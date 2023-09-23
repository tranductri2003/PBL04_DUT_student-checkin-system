from rest_framework import serializers
from users.models import NewUser
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role']    
        
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}  # Để đảm bảo mật khẩu không hiển thị trong response

