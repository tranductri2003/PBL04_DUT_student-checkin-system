from rest_framework import serializers
from django.conf import settings

from .models import Attendances
from courses.models import Courses
from courses.serializers import CourseSerializer
from users.serializers import UserSerializer
class AttendanceSerializer(serializers.ModelSerializer):
    attendance_date = serializers.DateField(required=False)
    attendance_time = serializers.TimeField(required=False)
    note = serializers.CharField(required=False)
    class Meta:
        model = Attendances
        fields = '__all__'
        
    def to_representation(self, instance):
        course_serializer = CourseSerializer(instance.course_id)  # Serialize the course data
        course_data = course_serializer.data  # Get the serialized data
        
        student_serializer = UserSerializer(instance.student_id)  # Serialize the student data
        student_data = student_serializer.data  # Get the serialized data
        
        return {
            'attendance_id': instance.attendance_id,
            'student': student_data,
            'course': course_data,
            'attendance_time': instance.attendance_time,
            'attendance_date': instance.attendance_date,
            'status': instance.status,
            'note': instance.note,
            'is_deleted': instance.is_deleted,
            'created_at': instance.created_at,
            'updated_at':instance.updated_at,
            'deleted_at': instance.deleted_at
        }
        