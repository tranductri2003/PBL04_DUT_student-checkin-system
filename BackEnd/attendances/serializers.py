from rest_framework import serializers
from django.conf import settings

from .models import Attendances

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendances
        fields = '__all__'