from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostsViewSet, PostDetailView,
    WordCloudView, PostIdsView,
    PostsExportView
)

router = DefaultRouter()
router.register(r'posts', PostsViewSet, basename='posts')

urlpatterns = [
    # Router first
    path("", include(router.urls)),

    # Custom endpoints
    path("posts/detail/<int:id>/", PostDetailView.as_view(), name="post-detail"),
    path("wordcloud/", WordCloudView.as_view(), name="wordcloud"),
    path("post-ids/", PostIdsView.as_view(), name="post-ids"),
    path("posts-export/", PostsExportView.as_view(), name="posts-export"),
]