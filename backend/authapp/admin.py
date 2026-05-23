# admin.py (تکه‌های مرتبط با UserAdmin)
from django import forms
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

User = get_user_model()

admin.site.site_header = "پنل ادمین"      
admin.site.site_title = "پنل ادمین"       
admin.site.index_title = "سامانه جمع آوری و تحلیل داده های اینستاگرام"      


class CustomUserChangeForm(forms.ModelForm):
    is_admin = forms.BooleanField(
        label="Is admin (sets is_staff & is_superuser)",
        required=False,
        help_text="If checked: will make the user staff. If you are superuser, it will also grant superuser."
    )

    class Meta:
        model = User
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and getattr(self.instance, "pk", None):
            self.fields["is_admin"].initial = bool(self.instance.is_staff or self.instance.is_superuser)
        else:
            self.fields["is_admin"].initial = False

@admin.action(description="Activate selected users")
def activate_users(modeladmin, request, queryset):
    queryset.update(is_active=True)

@admin.action(description="Deactivate selected users")
def deactivate_users(modeladmin, request, queryset):
    queryset.update(is_active=False)


class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm

    list_display = ("id", "username", "email", "is_active", "is_admin_flag", "date_joined")
    list_filter = ("is_active", "is_superuser", "date_joined")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("-date_joined",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (_("Permissions"), {"fields": ("is_active", "is_admin")}),
        (_("Important dates"), {"fields": ("date_joined",)}),
    )
    readonly_fields = ("date_joined",)

    actions = [activate_users, deactivate_users]

    def has_delete_permission(self, request, obj=None):
        if not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)

    def is_admin_flag(self, obj):
        return bool(obj.is_staff and obj.is_superuser)
    is_admin_flag.boolean = True
    is_admin_flag.short_description = "Is admin"

    def save_model(self, request, obj, form, change):
        is_admin = form.cleaned_data.get("is_admin", False)

        if is_admin:
            obj.is_staff = True
            if request.user.is_superuser:
                obj.is_superuser = True
        else:
            obj.is_staff = False
            if request.user.is_superuser:
                obj.is_superuser = False

        super().save_model(request, obj, form, change)

from django.contrib.auth.models import Group
admin.site.unregister(Group)
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
admin.site.register(User, UserAdmin)