from rest_framework import viewsets
from .serializers import EventSerializer
from .models import Event

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite visualizar ou editar eventos.
    """
    queryset = Event.objects.all().order_by('-dataEventoInicio')
    serializer_class = EventSerializer