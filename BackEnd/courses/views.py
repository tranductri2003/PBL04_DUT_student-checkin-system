# courses/views.py

from rest_framework import generics, permissions
from .models import Courses, StudentCourse
from .serializers import CoursesSerializer


class CoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer
    queryset = Courses.objects.all()

class CoursesDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)

class CoursesCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer

class CoursesUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer
    queryset = Courses.objects.all()

class CoursesDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer
    queryset = Courses.objects.all()

class TeacherCoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer

    def get_queryset(self):
        # Lấy teacher_id từ URL parameter
        teacher_id = self.kwargs['teacher_id']

        # Truy vấn danh sách các khóa học của giáo viên có teacher_id tương ứng
        query_set = Courses.objects.filter(teacher_id=teacher_id)
        return query_set
    
class StudentCoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CoursesSerializer
    
    def get_queryset(self):
        # Lấy student_id từ URL parameter
        student_id = self.kwargs['student_id']
        
        # Truy vấn danh sách các khóa học của sinh viên có student_id tương ứng
        query_set = StudentCourse.objects.filter(student__staff_id=student_id)
        return query_set
        