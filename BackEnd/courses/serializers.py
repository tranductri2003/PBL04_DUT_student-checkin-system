from rest_framework import serializers
from users.models import NewUser

from .models import Courses, UserCourse


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['full_name', 'staff_id'] 



class CourseSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(source='teacher_id', read_only=True)
    class Meta:
        model = Courses
        fields = ['course_id', 'course_name', 'num_of_student', 'day_of_week', 'start_time', 'end_time', 'start_date', 'end_date', 'room', 'teacher']


class StudentsCourseSerializer(serializers.ModelSerializer):
    student_ids = serializers.ListField(child=serializers.CharField(max_length=50), required=False)
    
    course_id = serializers.CharField(max_length=50, required=False)

    class Meta:
        model = UserCourse
        fields = '__all__'