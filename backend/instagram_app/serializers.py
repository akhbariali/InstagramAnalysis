from rest_framework import serializers
from .models import Posts

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        exclude = ["top_comments", "tags", "lstm_prediction", "rf_prediction", "svm_prediction", "dt_prediction", "lr_prediction"]

class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = '__all__'  

     
class WordCloudRequestSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False
    )
    width = serializers.IntegerField(required=False, default=800, min_value=100, max_value=4000)
    height = serializers.IntegerField(required=False, default=400, min_value=100, max_value=4000)
    background = serializers.CharField(required=False, default="white")


class IdOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    
    
class PostsExportSerializer(serializers.Serializer):
    format = serializers.ChoiceField(choices=["csv", "xlsx"], default="csv")
    sentiment = serializers.ListField(
        child=serializers.CharField(allow_blank=False, trim_whitespace=True),
        required=False,
        allow_empty=True,
        default=list,
        help_text="List of sentiments to match (case-insensitive)."
    )
    search = serializers.CharField(required=False, allow_blank=True, default="")
    from_date = serializers.DateTimeField(required=False, allow_null=True, default=None)
    to_date = serializers.DateTimeField(required=False, allow_null=True, default=None)

    # Optional: allow comma-separated string for sentiment as a convenience
    def to_internal_value(self, data):
        if isinstance(data, dict) and "sentiment" in data and isinstance(data["sentiment"], str):
            data = data.copy()
            data["sentiment"] = [s.strip() for s in data["sentiment"].split(",") if s.strip()]
        return super().to_internal_value(data)


class PostsExportFilterSerializer(serializers.Serializer):
    format = serializers.ChoiceField(choices=["csv", "xlsx"], required=False, default="csv")
    sentiment = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True, allow_empty=True
    )
    search = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    from_date = serializers.DateTimeField(required=False, allow_null=True)
    to_date = serializers.DateTimeField(required=False, allow_null=True)

    def run_validation(self, data):
        # Convert empty strings to None before validation
        if isinstance(data, dict):
            for field in ["from_date", "to_date", "search"]:
                if data.get(field) == "":
                    data[field] = None
        return super().run_validation(data)

    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        # Additional processing if needed
        return data