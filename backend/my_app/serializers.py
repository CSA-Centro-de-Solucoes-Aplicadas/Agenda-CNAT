from rest_framework import serializers
from django.db import transaction
from .models import Event, Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    #  a classe CategoriaSerializer serializa o model Categoria
    class Meta:
        # a classe Meta informa ao serializer qual model ele está serializando
        model = Categoria
        fields = ['id', 'nome', 'descricao', 'icone']

class EventSerializer(serializers.ModelSerializer):
    # Representar categorias como lista de IDs (input) e permitir mostrar dados breves do objeto (output)
    categoria = serializers.PrimaryKeyRelatedField(
        # PrimaryKeyRelatedFiel é usado para representar relações por suas chaves primárias
        many=True,
        # many=True porque é ManyToMany, 
        queryset=Categoria.objects.all()
    )
    # essa linha acima permite que o campo categoria aceite uma lista de IDs de Categoria ao criar/atualizar um Event

    # contatos: garante que seja uma lista de strings (e-mails) no nível do serializer
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

        return instance