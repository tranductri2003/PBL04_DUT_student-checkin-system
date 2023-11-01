from rest_framework import serializers
from django.conf import settings

from .models import Attendances
from courses.models import Courses

class AttendanceSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(required=False)
    course_id = serializers.CharField(required=False)
    attendance_date = serializers.DateField(required=False)
    attendance_time = serializers.TimeField(required=False)
    note = serializers.CharField(required=False)
    class Meta:
        model = Attendances
        fields = '__all__'
        
    def to_representation(self, instance):
        return {
            'attendance_id': instance.attendance_id,
            'student_id': instance.student_id.staff_id,
            'course_id': instance.course_id.course_id,
            'attendance_time': instance.attendance_time,
            'attendance_date': instance.attendance_date,
            'status': instance.status,
            'note': instance.note,
            'is_deleted': instance.is_deleted,
            'created_at': instance.created_at,
            'updated_at':instance.updated_at,
            'deleted_at': instance.deleted_at
        }
        