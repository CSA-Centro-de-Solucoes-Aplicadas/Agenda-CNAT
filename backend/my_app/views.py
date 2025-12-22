from rest_framework import viewsets
from .serializers import EventSerializer
from .models import Event

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-dataEventoInicio')
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        inscricao_aberta = self.request.query_params.get('inscricao_aberta')
        if inscricao_aberta is not None:
            if inscricao_aberta.lower() == 'true':
                queryset = queryset.filter(inscricao_aberta=True)
            elif inscricao_aberta.lower() == 'false':
                queryset = queryset.filter(inscricao_aberta=False)
        return queryset