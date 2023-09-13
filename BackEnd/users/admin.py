from django.contrib import admin
from users.models import NewUser
from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models


class UserAdminConfig(UserAdmin):
    model = NewUser
    search_fields = ('email',  'full_name',)
    list_filter = ('email',  'full_name',
                   'avatar', 'full_name',  'about', 'is_active', 'is_staff')

    ordering = ('-created_at',)
    list_display = ('email', 'id',  'full_name',
                    'is_active', 'is_staff',)

    fieldsets = (
        (None, {'fields': ('email', 
         'full_name', 'avatar')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups')}),
        ('Personal', {'fields': ('about',)}),
        ('Statistics', {'fields': ()}),
    )
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
    }
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email',  'full_name', 'password1', 'password2', 'is_active', 'is_staff')}
         ),
    )


admin.site.register(NewUser, UserAdminConfig)
