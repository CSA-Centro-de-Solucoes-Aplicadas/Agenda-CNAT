from rest_framework import serializers
from django.db import transaction
from .models import Event, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'descricao', 'icone']


class EventSerializer(serializers.ModelSerializer):
    # Representar categorias como lista de IDs (input) e permitir mostrar dados breves do objeto (output)
    categoria = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Categoria.objects.all()
    )

    # contatos: garantimos que seja uma lista de strings (e-mails) no nível do serializer
    contatos = serializers.ListField(
        child=serializers.EmailField(),
        allow_empty=True,
        required=False
    )

    class Meta:
        model = Event
        fields = [
            'id', 'titulo', 'descricao',
            'dataInscricao', 'dataInscricaoFinal',
            'dataEventoInicio', 'dataEventoFinal',
            'categoria', 'local', 'contatos'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        """
        Validações de alto nível: aqui você pode chamar validação do model (clean),
        mas model.clean() espera um objeto instanciado. Vamos fazer validações
        de consistência básicas e depois deixar model.clean() ser chamado em create/update.
        """
        # Exemplos simples (opcionais - já cobertos no model)
        di = attrs.get('dataInscricao')
        df = attrs.get('dataInscricaoFinal')
        ei = attrs.get('dataEventoInicio')
        ef = attrs.get('dataEventoFinal')

        if di and df and df < di:
            raise serializers.ValidationError("dataInscricaoFinal deve ser posterior a dataInscricao.")
        if df and ei and df > ei:
            raise serializers.ValidationError("dataInscricaoFinal deve ser anterior ao início do evento.")
        if ei and ef and ef < ei:
            raise serializers.ValidationError("dataEventoFinal deve ser posterior ao início do evento.")
        return attrs

    def create(self, validated_data):
        categorias = validated_data.pop('categoria', [])
        contatos = validated_data.pop('contatos', [])
        with transaction.atomic():
            event = Event.objects.create(**validated_data)
            if categorias:
                event.categoria.set(categorias)
            if contatos is not None:
                event.contatos = contatos
                event.save()
            # chamar full_clean() para garantir validação do model
            event.full_clean()
        return event

    def update(self, instance, validated_data):
        categorias = validated_data.pop('categoria', None)
        contatos = validated_data.pop('contatos', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        with transaction.atomic():
            instance.save()
            if categorias is not None:
                instance.categoria.set(categorias)
            if contatos is not None:
                instance.contatos = contatos
                instance.save()
            # valida model
            instance.full_clean()

        return instance