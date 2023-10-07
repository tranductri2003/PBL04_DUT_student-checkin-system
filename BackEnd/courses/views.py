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
            query_set = None
            role = recent_user.role
            if role == 'S':
                #course_of_user = UserCourse.objects.filter(user=recent_user)
                CourseId=UserCourse.objects.filter(user=recent_user).values_list('course__course_id', flat=True)
                query_set = Courses.objects.filter(course_id__in=CourseId)
            elif role == 'T':
                query_set = Courses.objects.filter(teacher_id=recent_user)
            elif role == 'A':
                staffId = self.kwargs['staff_id']
                query_set = Courses.objects.all()   
        else:
            query_set = Courses.objects.all()
        return query_set

class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)


class TodayCoursesListView(generics.ListAPIView):
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
            query_set = None
            role = recent_user.role
            date = datetime.now().weekday()
            if role == 'S':
                #course_of_user = UserCourse.objects.filter(user=recent_user)
                CourseId=UserCourse.objects.filter(user=recent_user).values_list('course__course_id', flat=True)
                query_set = Courses.objects.filter(course_id__in=CourseId, day_of_week=date)
            elif role == 'T':
                query_set = Courses.objects.filter(teacher_id=recent_user, day_of_week=date)
            elif role == 'A':
                query_set = Courses.objects.all( day_of_week=date)   
        return query_set

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
    


class AssignStudentsToCoursesView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Get all users with role 'S'
        students = NewUser.objects.filter(role='S')
        
        # Get all existing courses
        courses = Courses.objects.all()
        
        # Loop through each student and each course to create UserCourse entries
        for student in students:
            for course in courses:
                # Check if the user is already enrolled in the course
                if not UserCourse.objects.filter(user=student, course=course).exists():
                    UserCourse.objects.create(user=student, course=course)
        
        return Response({"message": "Students assigned to courses successfully"}, status=201)