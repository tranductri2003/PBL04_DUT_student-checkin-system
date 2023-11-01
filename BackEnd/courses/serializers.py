from rest_framework import serializers
from users.models import NewUser

from .models import Courses, UserCourse

class CourseSerializer(serializers.ModelSerializer):
    teacher_id = serializers.CharField(max_length=50, required=False)
    class Meta:
        model = Courses
        fields = '__all__'

    def create(self, validated_data):
        teacher_id = validated_data.pop('teacher_id', None)
        teacher = NewUser.objects.get(staff_id=teacher_id)
        validated_data['teacher_id'] = teacher
        course = Courses.objects.create(**validated_data)
        return course
    
    def update(self, instance, validated_data):
        teacher_id = validated_data.pop('teacher_id', None)
        if teacher_id:
            teacher = NewUser.objects.get(staff_id=teacher_id)
            instance.teacher_id = teacher

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class StudentsCourseSerializer(serializers.ModelSerializer):
    student_ids = serializers.ListField(child=serializers.CharField(max_length=50), required=False)
    
    course_id = serializers.CharField(max_length=50, required=False)

    class Meta:
        model = UserCourse
        fields = '__all__'