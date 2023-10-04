# courses/views.py

from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404
from datetime import datetime

from .models import Courses, UserCourse
from .serializers import CourseSerializer, UserCourseSerializer
from users.serializers import UserSerializer
from users.models import NewUser
from helper.models import CustomPageNumberPagination

class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    queryset = Courses.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course_id', 'teacher_id']
    ordering_fields = ['course_id']
    pagination_class = CustomPageNumberPagination


class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)




class StaffCoursesListView(generics.ListAPIView, ):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    ordering_fields = ['course_id']
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        recent_user = self.request.user
        
        # Truy vấn danh sách các khóa học của người dùng có staff_id tương ứng
        query_set = None
        if self.request.user.is_superuser:
            # Lấy staff_id từ URL parameter
            staff_id = self.kwargs['staff_id']
            user = NewUser.objects.get(staff_id=staff_id)
            role = user.role
            if role == 'S':
                query_set = UserCourse.objects.filter(user=user)
            elif role == 'T':
                query_set = Courses.objects.filter(user=user)
            elif role == 'A':
                query_set = Courses.objects.all()        
        else:
            if recent_user.role == 'S':
                query_set = Courses.objects.filter(user=recent_user)
            elif recent_user.role == 'T':
                query_set = Courses.objects.filter(user=recent_user)
                
        return query_set

class StaffCoursesOnDayListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    ordering_fields = ['course_id']
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        # Lấy student_id từ URL parameter
        staff_id = self.kwargs['staff_id']
        
        # Truy vấn danh sách các khóa học của người dùng có staff_id tương ứng
        query_set = None
        if self.request.user.role == 'S':
            query_set = UserCourse.objects.filter(staff_id=staff_id, day_of_week=datetime.now().weekday())
        elif self.request.user.role == 'T':
            query_set = Courses.objects.filter(staff_id=staff_id, day_of_week=datetime.now().weekday())
        return query_set

class CourseStudentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    ordering_fields = ['staff_id']
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        # Lấy course_id từ URL parameter
        course_id = self.kwargs['course_id']

        #Truy vấn danh sách các sinh viên của một lớp
        query_set = UserCourse.objects.filter(course_id=course_id)
        return query_set
       
        
class StudentEnrollView(generics.CreateAPIView): 
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCourseSerializer
    
    def create(self, request, *args, **kwargs):
        # Gọi phương thức create mặc định của CreateAPIView để tạo bản ghi UserCourse
        response = super().create(request, *args, **kwargs)
        
        # Lấy thông tin khóa học từ bản ghi vừa tạo
        course_id = self.kwargs['course_id']
        course = UserCourse.objects.get(course_id=course_id)
        
        # Tăng giá trị num_of_student của khóa học lên 1
        course.num_of_student += 1
        course.save()
        return response

class StudentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCourseSerializer
    
    def destroy(self, request, *args, **kwargs):
        # Gọi phương thức destroy mặc định của DestroyAPIView để xóa bản ghi UserCourse
        response = super().destroy(request, *args, **kwargs)
        
        # Lấy thông tin course_id từ URL parameter
        course_id = self.kwargs['course_id']
        
        # Tìm khóa học liên quan
        course = Courses.objects.get(course_id=course_id)
        
        # Giảm giá trị num_of_student của khóa học đi 1
        course.num_of_student -= 1
        course.save()
        
        return response