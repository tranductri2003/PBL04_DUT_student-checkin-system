# courses/views.py

from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from django.http import Http404

from .models import Courses, UserCourse, NewUser
from .serializers import CourseSerializer, StudentsCourseSerializer
from users.models import NewUser
from helper.models import CustomPageNumberPagination
from .filters import CourseFilter

class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CourseFilter
    ordering_fields = ['course_id']
    
    def get_queryset(self):
        
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to get data."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role not in ['A', 'T', 'S']:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        staff_id = self.request.GET.get('staff_id', None)
        # Nếu truyền vào staff_id thì sẽ truy vấn theo staff_id
        # Nếu không thì sẽ truy vấn theo role của người đăng nhập
        if staff_id is not None:
            query_set = Courses.objects.all()
            user = NewUser.objects.get(staff_id=staff_id)
            if user.role == 'T':
                query_set = query_set.filter(teacher_id=user)
            elif user.role == 'S':
                course_ids = UserCourse.objects.filter(user=self.request.user).values_list('course__course_id', flat=True)
                query_set = query_set.filter(course_id__in=course_ids)
            else:
                query_set = Courses.objects.none()
        else:
            if self.request.user.role == 'A':
                query_set = Courses.objects.all()
            elif self.request.user.role == 'T':
                query_set = Courses.objects.filter(teacher_id=self.request.user)
            elif self.request.user.role == 'S':
                course_ids = UserCourse.objects.filter(user=self.request.user).values_list('course__course_id', flat=True)
                query_set = Courses.objects.filter(course_id__in=course_ids)
        print(list(query_set))
        return query_set

    def perform_create(self, serializer):
        
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to create a course."}, status=status.HTTP_400_BAD_REQUEST)

        if self.request.user.role != 'A':
            return Response({"message": "You do not have permission to create a course."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CoursesRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    lookup_field = "course_id"

    def get_queryset(self):
        page_size = self.request.GET.get('page_size', None)
        
        if page_size is None:
            page_size = CustomPageNumberPagination.page_size
        else:
            page_size = int(page_size)
        self.pagination_class.page_size = page_size
            
        if self.request.user.role == 'A':
            self.query_set = Courses.objects.all()
        elif self.request.user.role == 'T':
            self.query_set = Courses.objects.filter(teacher_id=self.request.user)
        elif self.request.user.role == 'S':
            course_ids = UserCourse.objects.filter(user=self.request.user).values_list('course__course_id', flat=True)
            self.query_set = Courses.objects.filter(course_id__in=course_ids)
        else:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        return self.query_set

class StudentsCourseRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentsCourseSerializer
    queryset = UserCourse.objects.all()
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        page_size = self.request.GET.get('page_size', None)
        
        if page_size is None:
            page_size = CustomPageNumberPagination.page_size
        else:
            page_size = int(page_size)
        self.pagination_class.page_size = page_size
            
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to do it."}, status=status.HTTP_400_BAD_REQUEST)    
            
        if self.request.user.role == 'A':
            query_set = UserCourse.objects.all()
        elif self.request.user.role == 'T':
            courses = Courses.objects.filter(teacher_id=self.request.user)
            query_set = UserCourse.objects.filter(course__in=courses)
        elif self.request.user.role == 'S':
            query_set = UserCourse.objects.filter(user=self.request.user)
        else:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        return query_set
    
    def get(self, request, *args, **kwargs):
        try:
            course_id = self.kwargs.get("course_id")
            course = Courses.objects.get(course_id=course_id)
            student_list = UserCourse.objects.filter(course=course) 
            student_data = student_list.values('user__staff_id', 'user__full_name', 'user__class_id', 'user__phone_number',)
            formatted_data = [{k.split('__')[1]: v for k, v in item.items()} for item in student_data]
            return Response(formatted_data, status=status.HTTP_200_OK)
        except UserCourse.DoesNotExist:
            return Response({"message": "Object not found."}, status=status.HTTP_404_NOT_FOUND)
        
class StudentsCourseCreateView(generics.CreateAPIView):        
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentsCourseSerializer
    pagination_class = CustomPageNumberPagination
    
    def create(self, request, *args, **kwargs):
        if self.request.user.role != 'A':
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
            
        new_student_ids = request.data.get('student_ids', [])
        course = Courses.objects.get(course_id=self.kwargs['course_id'])
        
        # Loại bỏ những học sinh không còn trong danh sách `new_student_ids`
        existed_student = UserCourse.objects.filter(course=course).values('user__staff_id')
        new_students = NewUser.objects.filter(staff_id__in=new_student_ids).exclude(staff_id__in=existed_student)
        
        # Thêm những học sinh mới vào khóa học
        for student in new_students:
            user_course = UserCourse.objects.create(user=student, course=course)
            user_course.save()
            
        course.num_of_student += len(new_students)
        course.save()
        return Response(status=status.HTTP_201_CREATED)

class StudentsCourseDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentsCourseSerializer
    queryset = UserCourse.objects.all()
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        page_size = self.request.GET.get('page_size', None)
        
        if page_size is None:
            page_size = CustomPageNumberPagination.page_size
        else:
            page_size = int(page_size)
        self.pagination_class.page_size = page_size
            
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to do it."}, status=status.HTTP_400_BAD_REQUEST)    
            
        if self.request.user.role == 'A':
            query_set = UserCourse.objects.all()
        else:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        return query_set
    
    def delete(self, request, *args, **kwargs):
        
        removed_student_ids = request.data.get('student_ids', [])
        course = Courses.objects.get(course_id=self.kwargs['course_id'])
        
        removed_students = NewUser.objects.filter(staff_id__in=removed_student_ids)
        UserCourse.objects.filter(course=course, user__in=removed_students).delete()
        course.num_of_student -= len(removed_students)
        course.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    