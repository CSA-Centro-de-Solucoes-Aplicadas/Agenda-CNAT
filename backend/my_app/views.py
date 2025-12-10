from django.shortcuts import render
# render não está sendo usado, mas é comum em views Django
from rest_framework.views import APIView
# APIView é a classe base para criar views na DRF
from rest_framework.response import Response
# Response é usado para retornar respostas HTTP com dados serializados
from rest_framework import authentication, permissions
# authentication e permissions são usados para controlar acesso às views
from django.contrib.auth.models import User
# User é o modelo de usuário padrão do Django
from .serializers import EventSerializer
from .models import Event

class EventListView(APIView):
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]

    def get_queryset(self):
        qs = Event.objects.all()

        # Filtros baseados em query parameters
        busca = self.request.query_params.get('busca', None)
        if busca:
            qs = qs.busca(busca)    
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            qs = qs.por_categoria(categoria)        
        status = self.request.query_params.get('status', None)
        if status == 'atuais':
            qs = qs.eventos_atuais()    
        elif status == 'futuros':
            qs = qs.eventos_futuros()
        elif status == 'passados':
            qs = qs.eventos_passados()
        elif status == 'inscricoes_abertas':
            qs = qs.com_inscricoes_abertas()
        return qs
        # request.query_params é um dicionário-like que contém os parâmetros da query string da URL
        # o que tem depois do "?" na URL

    def get(self, request, format=None):
        '''Retorna a lista de eventos, limitada a 10 por padrão.
        Permite filtros por busca, categoria e status via query parameters.
        O funcionamento se dá por:
        request - objeto HTTP request
        format - formato da resposta (JSON, XML, etc), opcional, serve para content negotiation
        queryset - conjunto de dados filtrados conforme os parâmetros da requisição
        serializer - instancia do serializer para converter os dados do queryset em formato JSON
        response - objeto HTTP response com os dados serializados
    '''
        queryset = self.get_queryset()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    



