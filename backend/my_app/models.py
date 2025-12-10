from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import JSONField
from .managers import EventoQuerySet
import uuid
# Create your models here.

class Categoria(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    icone = models.CharField(max_length=100, blank=True, null=True)
    # O campo icone armazena somente o caminho para um arquivo de ícone localizado dentro do vue-project.

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['nome']
        # a classe Meta é usada para definir metadados para o modelo, como nomes legíveis e ordenação padrão.
    
class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    dataInscricao = models.DateTimeField(null=True, blank=True)
    dataInscricaoFinal = models.DateTimeField(null=True, blank=True)
    dataEventoInicio = models.DateTimeField(default=timezone.now)
    dataEventoFinal = models.DateTimeField()
    categoria = models.ManyToManyField(Categoria, related_name='eventos')
    local = models.CharField(max_length=200)
    contatos = JSONField(blank=True, default=list )
    objects = EventoQuerySet.as_manager()

    def __str__(self):
        return self.titulo
    
    def clean(self):
        # Se tiver data de inscrição início, precisa da final
        if self.dataInscricao and not self.dataInscricaoFinal:
            raise ValidationError("Se houver data de inscrição inicial, a data final deve ser definida.")

        # Se ambas existirem, a final deve ser depois da inicial
        if self.dataInscricao and self.dataInscricaoFinal:
            if self.dataInscricaoFinal < self.dataInscricao:
                raise ValidationError("A data final de inscrição deve ser posterior à data inicial.")

        # Inscrições devem terminar antes do evento começar
        if self.dataInscricaoFinal and self.dataEventoInicio:
            if self.dataInscricaoFinal > self.dataEventoInicio:
                raise ValidationError("A data final de inscrição deve ser antes do início do evento.")

        # Evento final precisa ser posterior ao evento inicial
        if self.dataEventoFinal and self.dataEventoInicio:
            if self.dataEventoFinal < self.dataEventoInicio:
                raise ValidationError("A data final do evento deve ser posterior à inicial.")

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['-dataEventoInicio']