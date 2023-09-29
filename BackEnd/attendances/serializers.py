from rest_framework import serializers
from .models import Attendances
from django.conf import settings


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendances
        fields = '__all__'