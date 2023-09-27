# courses/views.py

from rest_framework import generics, permissions
from .models import Courses, StudentCourse
from .serializers import CourseSerializer, StudentCourseSerializer
from users.serializers import UserSerializer

class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    queryset = Courses.objects.all()

class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDeleteAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Courses.objects.filter(course_id=course_id)

# class CoursesCreateView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = CourseSerializer

# class CoursesUpdateView(generics.UpdateAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = CourseSerializer
#     queryset = Courses.objects.all()

# class CoursesDeleteView(generics.DestroyAPIView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = CourseSerializer
#     queryset = Courses.objects.all()

class TeacherCoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer

    def get_queryset(self):
        # Lấy teacher_id từ URL parameter
        teacher_id = self.kwargs['teacher_id']

        # Truy vấn danh sách các khóa học của giáo viên có teacher_id tương ứng
        query_set = Courses.objects.filter(teacher_id=teacher_id)
        return query_set
    
class StudentCoursesListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        # Lấy student_id từ URL parameter
        student_id = self.kwargs['student_id']
        
        # Truy vấn danh sách các khóa học của sinh viên có student_id tương ứng
        query_set = StudentCourse.objects.filter(student__staff_id=student_id)
        return query_set
    

class CourseStudentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        # Lấy course_id từ URL parameter
        course_id = self.kwargs['course_id']

        #Truy vấn danh sách các sinh viên của một lớp
        query_set = StudentCourse.objects.filter(course__course_id=course_id)
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