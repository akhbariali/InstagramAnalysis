from django.contrib import admin

# Register your models here.
from .models import Posts


admin.site.site_header = "پنل ادمین"      
admin.site.site_title = "پنل ادمین"       
admin.site.index_title = "سامانه جمع آوری و تحلیل داده های اینستاگرام"      

@admin.register(Posts)
class PostsAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ("id", "caption", "owner", "likes", "comments_count", "post_date", "sentiment_overall")
    
    # Fields to filter by in the sidebar
    list_filter = ("post_date", "sentiment_overall")
    
    # Fields to search by
    search_fields = ("caption", "owner")
    
    # Fields to display in the form view
    fields = ("caption", "owner","url", "likes", "comments_count", "post_date",
              "tags", "top_comments","sentiment_overall", "lstm_prediction",  
              "rf_prediction", "svm_prediction","dt_prediction","lr_prediction")
    
    # Read-only fields (optional)
    readonly_fields = ("post_date","likes", 'comments_count', "sentiment_overall","owner", "url",
                        "rf_prediction", "lstm_prediction", "svm_prediction","dt_prediction","lr_prediction")
    
    # Pagination for the list view
    list_per_page = 20
    def has_add_permission(self, request):
        return False
