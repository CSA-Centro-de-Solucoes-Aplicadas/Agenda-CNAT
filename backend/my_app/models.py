from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import JSONField
from .managers import EventoQuerySet
import uuid
# Create your models here.
class Organizador(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.email   
    
    class Meta:
        verbose_name = "Organizador"
        verbose_name_plural = "Organizadores"
        ordering = ['email']    

class Categoria(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['nome']
        # a classe Meta é usada para definir metadados para o modelo, como nomes legíveis e ordenação padrão.
    
class Event(models.Model):

    def evento_upload_path(instance, filename):
        # Função para definir o caminho de upload da imagem
        return f'event_images/{instance.id}/{filename}'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200, db_index=True)
    descricao = models.TextField()
    link = models.URLField(max_length=200, null=True, blank=True)
    imagem = models.ImageField(upload_to=evento_upload_path, null=True, blank=True)
    dataInscricao = models.DateTimeField(null=True, blank=True)
    dataInscricaoFinal = models.DateTimeField(null=True, blank=True)
    dataEventoInicio = models.DateTimeField(default=timezone.now, db_index=True)
    dataEventoFinal = models.DateTimeField()
    categoria = models.ManyToManyField(Categoria, related_name='eventos')
    local = models.CharField(max_length=200)
    organizadores = models.ManyToManyField(Organizador, related_name='organizadores')
    objects = EventoQuerySet.as_manager()

    def __str__(self):
        return self.titulo
    
    @property
    def inscricao_aberta(self):
        if not self.inscricao_inicio or not self.inscricao_fim:
            return False
        hoje = timezone.now().date()
        return self.inscricao_inicio <= hoje <= self.inscricao_fim
        # Retorna True se a inscrição estiver aberta, caso contrário, False
    
    def clean(self):
        # Se tiver data de inscrição início, precisa da final
        if self.dataInscricao and not self.dataInscricaoFinal:
            raise ValidationError("Se houver data de inscrição inicial, a data final deve ser definida.")
        if self.dataInscricaoFinal and not self.dataInscricao:
            raise ValidationError("Se houver data de inscrição final, a data inicial deve ser definida.")

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
