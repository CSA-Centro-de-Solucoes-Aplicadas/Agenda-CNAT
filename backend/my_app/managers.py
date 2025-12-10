from django.db.models import Q
from django.db import models
from django.utils import timezone

# Custom QuerySet para o modelo Event
class EventoQuerySet(models.QuerySet):
    def eventos_atuais(self):
        now = timezone.now()
        return self.filter(dataEventoFinal__gte=now)

    def eventos_futuros(self):
        now = timezone.now()
        return self.filter(dataEventoInicio__gt=now)

    def eventos_passados(self):
        now = timezone.now()
        return self.filter(dataEventoFinal__lt=now)
    
    def busca(self, texto):
        return self.filter(models.Q(titulo__icontains=texto) | models.Q(descricao__icontains=texto))
    
    def com_inscricoes_abertas(self):
        now = timezone.now()
        return self.filter(dataInscricao__lte=now, dataInscricaoFinal__gte=now)
    
    def por_categoria(self, categoria_id):
        return self.filter(categoria__id=categoria_id)