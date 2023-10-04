from rest_framework import serializers
from django.conf import settings

from users.models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role'] 

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role'] 

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role'] 

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'avatar', 'university', 'faculty', 'class_id', 'about', 'phone_number', 'date_of_birth', 'role']  
        
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id', 'email', 'full_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}  # Để đảm bảo mật khẩu không hiển thị trong response

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['avatar','about', 'phone_number', 'date_of_birth']  
        extra_kwargs = {
            'password': {'write_only': True},
            'phone_number': {'required': False} 
            }  # Để đảm bảo mật khẩu không hiển thị trong response
class UserDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['staff_id']