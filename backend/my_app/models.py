from django.db import models
from django.utils import timezone
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']
        # a classe Meta é usada para definir metadados para o modelo, como nomes legíveis e ordenação padrão.
    
class Event(models.Model):
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    dataInscricao = models.DateTimeField(default=timezone.now)
    dataInscricaoFinal = models.DateTimeField()
    dataEventoInicio = models.DateTimeField()
    dataEventoFinal = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    local = models.CharField(max_length=200)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['-date']
