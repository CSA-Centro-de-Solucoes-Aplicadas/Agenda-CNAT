from rest_framework import viewsets

from .models import Categoria, Event
from .serializers import CategoriaSerializer, EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.prefetch_related('categoria', 'organizadores').all().order_by(
        'dataEventoInicio'
    )
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        categoria = self.request.query_params.get('categoria')
        inscricao_aberta = self.request.query_params.get('inscricao_aberta')

        if search:
            queryset = queryset.busca(search)

        if categoria:
            queryset = queryset.filter(categoria__nome__iexact=categoria)

        if inscricao_aberta and inscricao_aberta.lower() == 'true':
            queryset = queryset.com_inscricoes_abertas()

        return queryset.distinct()


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by('nome')
    serializer_class = CategoriaSerializer
