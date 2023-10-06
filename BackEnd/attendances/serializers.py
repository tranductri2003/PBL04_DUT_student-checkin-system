from rest_framework import serializers
from django.conf import settings

from .models import Attendances
from courses.models import Courses

class AttendanceSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(required=False)
    attendance_date = serializers.DateField(required=False)
    attendance_time = serializers.TimeField(required=False)
    note = serializers.CharField(required=False)
    class Meta:
        model = Attendances
        fields = '__all__'