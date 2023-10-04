from rest_framework import serializers

from .models import Courses, UserCourse

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = '__all__'
        