from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
# Registra o EventViewSet no router com o prefixo 'events'

urlpatterns = [
    path('eventos/', include(router.urls)), # Inclui todas as rotas geradas pelo router no prefixo raiz da app
]