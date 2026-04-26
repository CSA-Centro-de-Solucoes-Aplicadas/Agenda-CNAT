from rest_framework.routers import DefaultRouter

from .views import CategoriaViewSet, EventViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'categories', CategoriaViewSet, basename='category')

urlpatterns = router.urls
