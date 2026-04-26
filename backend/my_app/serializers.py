from django.db import transaction
from rest_framework import serializers

from .models import Categoria, Event, Organizador


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'descricao']


class EventSerializer(serializers.ModelSerializer):
    categorias = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    organizadores = serializers.ListField(
        child=serializers.EmailField(),
        write_only=True,
        required=False,
    )
    imagem = serializers.ImageField(required=False, allow_null=True, write_only=True)
    dataInscricaoInicio = serializers.DateTimeField(source='dataInscricao', required=False, allow_null=True)
    dataInscricaoFim = serializers.DateTimeField(
        source='dataInscricaoFinal',
        required=False,
        allow_null=True,
    )
    dataEventoFim = serializers.DateTimeField(source='dataEventoFinal')
    linkInformacao = serializers.URLField(source='link', required=False, allow_blank=True, allow_null=True)
    imagemUrl = serializers.SerializerMethodField()
    categoriasNomes = serializers.SerializerMethodField()
    organizadoresEmails = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'titulo',
            'descricao',
            'local',
            'linkInformacao',
            'linkInscricao',
            'imagem',
            'imagemUrl',
            'dataInscricaoInicio',
            'dataInscricaoFim',
            'dataEventoInicio',
            'dataEventoFim',
            'categorias',
            'categoriasNomes',
            'organizadores',
            'organizadoresEmails',
        ]
        read_only_fields = ['id', 'imagemUrl', 'categoriasNomes', 'organizadoresEmails']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['categorias'] = representation.pop('categoriasNomes')
        representation['organizadores'] = representation.pop('organizadoresEmails')
        representation['imagem'] = representation.pop('imagemUrl')
        return representation

    def get_imagemUrl(self, obj):
        if not obj.imagem:
            return None

        request = self.context.get('request')
        image_url = obj.imagem.url
        if request is None:
            return image_url
        return request.build_absolute_uri(image_url)

    def get_categoriasNomes(self, obj):
        return list(obj.categoria.values_list('nome', flat=True))

    def get_organizadoresEmails(self, obj):
        return list(obj.organizadores.values_list('email', flat=True))

    def validate(self, attrs):
        data_inscricao_inicio = attrs.get('dataInscricao')
        data_inscricao_fim = attrs.get('dataInscricaoFinal')
        data_evento_inicio = attrs.get('dataEventoInicio')
        data_evento_fim = attrs.get('dataEventoFinal')

        if data_inscricao_inicio and data_inscricao_fim and data_inscricao_fim < data_inscricao_inicio:
            raise serializers.ValidationError(
                {'dataInscricaoFim': 'A data final de inscrição deve ser posterior à inicial.'}
            )

        if data_evento_inicio and data_evento_fim and data_evento_fim < data_evento_inicio:
            raise serializers.ValidationError(
                {'dataEventoFim': 'A data final do evento deve ser posterior à inicial.'}
            )

        if data_inscricao_fim and data_evento_inicio and data_inscricao_fim > data_evento_inicio:
            raise serializers.ValidationError(
                {'dataInscricaoFim': 'As inscrições devem terminar antes do início do evento.'}
            )

        return attrs

    def _sync_relations(self, event, categorias, organizadores):
        if categorias is not None:
            categorias_obj = [
                Categoria.objects.get_or_create(nome=nome.strip())[0]
                for nome in categorias
                if nome.strip()
            ]
            event.categoria.set(categorias_obj)

        if organizadores is not None:
            organizadores_obj = [
                Organizador.objects.get_or_create(email=email.strip())[0]
                for email in organizadores
                if email.strip()
            ]
            event.organizadores.set(organizadores_obj)

    def create(self, validated_data):
        categorias = validated_data.pop('categorias', [])
        organizadores = validated_data.pop('organizadores', [])

        with transaction.atomic():
            event = Event.objects.create(**validated_data)
            self._sync_relations(event, categorias, organizadores)

        return event

    def update(self, instance, validated_data):
        categorias = validated_data.pop('categorias', None)
        organizadores = validated_data.pop('organizadores', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        with transaction.atomic():
            instance.save()
            self._sync_relations(instance, categorias, organizadores)

        return instance
