# courses/views.py

from rest_framework import generics, permissions
from .models import Courses, StudentCourse
from .serializers import CourseSerializer, StudentCourseSerializer
from users.serializers import UserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404


class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    queryset = Courses.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course_id', 'teacher_id']
    ordering_fields = ['course_id']


class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)


class StudentCoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    ordering_fields = ['course_id']

    def get_queryset(self):
        # Lấy student_id từ URL parameter
        student_id = self.kwargs['student_id']
        
        # Truy vấn danh sách các khóa học của sinh viên có student_id tương ứng
        query_set = StudentCourse.objects.filter(staff_id=student_id)
        return query_set
    

class CourseStudentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    ordering_fields = ['staff_id']

    def get_queryset(self):
        # Lấy course_id từ URL parameter
        course_id = self.kwargs['course_id']

        #Truy vấn danh sách các sinh viên của một lớp
        query_set = StudentCourse.objects.filter(course_id=course_id)
        return query_set
       
        
class StudentEnrollView(generics.CreateAPIView): 
    permission_classes = [permissions.AllowAny]
    serializer_class = StudentCourseSerializer
    
    def create(self, request, *args, **kwargs):
        # Gọi phương thức create mặc định của CreateAPIView để tạo bản ghi StudentCourse
        response = super().create(request, *args, **kwargs)
        
        # Lấy thông tin khóa học từ bản ghi vừa tạo
        course_id = self.kwargs['course_id']
        course = StudentCourse.objects.get(course_id=course_id)
        
        # Tăng giá trị num_of_student của khóa học lên 1
        course.num_of_student += 1
        course.save()
        return response

class StudentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = StudentCourseSerializer
    
    def destroy(self, request, *args, **kwargs):
        # Gọi phương thức destroy mặc định của DestroyAPIView để xóa bản ghi StudentCourse
        response = super().destroy(request, *args, **kwargs)
        
        # Lấy thông tin course_id từ URL parameter
        course_id = self.kwargs['course_id']
        
        # Tìm khóa học liên quan
        course = Courses.objects.get(course_id=course_id)
        
        # Giảm giá trị num_of_student của khóa học đi 1
        course.num_of_student -= 1
        course.save()
        
        return response