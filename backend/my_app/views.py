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

class UserListView(APIView):


