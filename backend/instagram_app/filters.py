import django_filters
from django.db.models.functions import Lower
from .models import Posts

class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    """Accepts comma-separated values, e.g. ?sentiment=joy,sadness"""
    pass

class PostsFilter(django_filters.FilterSet):
    from_date = django_filters.DateTimeFilter(field_name="post_date", lookup_expr="gte")
    to_date   = django_filters.DateTimeFilter(field_name="post_date", lookup_expr="lte")

    # Case-insensitive sentiment filter: ?sentiment=joy or ?sentiment=joy,sadness
    sentiment = CharInFilter(method="filter_sentiment")

    class Meta:
        model = Posts
        fields = ["from_date", "to_date", "sentiment"]

    def filter_sentiment(self, queryset, name, values):
        if not values:
            return queryset
        # Normalize user input to lowercase, match case-insensitively
        lowered = [v.strip().lower() for v in values if v and v.strip()]
        if not lowered:
            return queryset
        # Annotate lower() once so DB can use index in many backends
        return queryset.annotate(_sent=Lower("sentiment_overall")).filter(_sent__in=lowered)
