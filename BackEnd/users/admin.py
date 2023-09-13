from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import models
from django.forms import TextInput, Textarea, CharField
from users.models import NewUser

class UserAdminConfig(UserAdmin):
    model = NewUser
    search_fields = ('email', 'full_name',)
    list_filter = ('email', 'full_name', 'avatar', 'is_active', 'is_staff')
    ordering = ('-created_at',)
    list_display = ('email', 'id', 'full_name', 'is_active', 'is_staff',)
    
    fieldsets = (
        (None, {'fields': ('email', 'full_name', 'avatar')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups')}),
        ('Personal', {'fields': ('about',)}),
    )
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 4, 'cols': 40})},
        models.CharField: {'widget': TextInput(attrs={'size': 40})},
    }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'university', 'faculty', 'class_id', 'is_active', 'is_staff')}
        ),
    )
admin.site.register(NewUser, UserAdminConfig)
