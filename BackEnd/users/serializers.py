from rest_framework import serializers
from django.conf import settings

from users.models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role', 'status'] 

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['full_name', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth'] 

class TXTUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    
    

