# courses/views.py

from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from django.http import Http404
from datetime import datetime

from .models import Courses, UserCourse
from .serializers import CourseSerializer, UserCourseSerializer
from users.serializers import UserSerializer
from users.models import NewUser
from helper.models import CustomPageNumberPagination

class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    queryset = Courses.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course_id', 'teacher_id']
    ordering_fields = ['course_id']
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        # query_set = Courses.objects.all()
        query_set = None
        if self.request.user.is_authenticated:
            recent_user = self.request.user
            # Truy vấn danh sách các khóa học của người dùng có staff_id tương ứng
            role = recent_user.role
            day_of_week = self.request.data.get('day_of_week', None)
            if role == 'S':
                CourseId=UserCourse.objects.filter(user=recent_user).values_list('course__course_id', flat=True)
                query_set = Courses.objects.filter(course_id__in=CourseId)
                if day_of_week is not None and day_of_week != '':
                    day_of_week = int(day_of_week)
                    query_set = query_set.filter(day_of_week=day_of_week)
            elif role == 'T':
                query_set = Courses.objects.filter(teacher_id=recent_user)
                
                if day_of_week is not None and day_of_week != '':
                    day_of_week = int(day_of_week)
                    query_set = query_set.filter(day_of_week=day_of_week)
            elif role == 'A':
                query_set = Courses.objects.all()
                course_id = self.request.data.get('course_id', None)
                staff_id = self.request.data.get('staff_id', None)
                if course_id is not None and course_id != '':
                    query_set = query_set.filter(course_id=course_id)

                if day_of_week is not None and day_of_week != '':
                    day_of_week = int(day_of_week)
                    query_set = query_set.filter(day_of_week=day_of_week)

                if staff_id is not None and staff_id != '':
                    staff = NewUser.objects.get(staff_id=staff_id)
                    if staff.role == 'T':
                        query_set = query_set.filter(teacher_id=staff)
                    elif staff.role == 'S':
                        course_ids=UserCourse.objects.filter(user=staff).values_list('course__course_id', flat=True)
                        query_set = Courses.objects.filter(course_id__in=course_ids)
        return query_set

class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)

class CourseStudentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
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