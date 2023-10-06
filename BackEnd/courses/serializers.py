from rest_framework import serializers
from users.models import NewUser

from .models import Courses, UserCourse

class CourseSerializer(serializers.ModelSerializer):
    teacher_id = serializers.CharField(max_length=255, required=True)
    class Meta:
        model = Courses
        fields = '__all__'

    def create(self, validated_data):
        teacher_id = validated_data.get('teacher_id')
        teacher = NewUser.objects.get(staff_id=teacher_id)
        validated_data['teacher_id'] = teacher
        course = Courses.objects.create(**validated_data)
        return course

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = '__all__'
        