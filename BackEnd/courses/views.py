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

class CoursesListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseSerializer
    queryset = Courses.objects.all()
    filter_backends = [DjangoFilterBackend]
    ordering_fields = ['course_id']
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            course_id = self.request.GET.get('course_id', None)
            day_of_week = self.request.GET.get('day_of_week', None)
            staff_id = self.request.GET.get('staff_id', None)

            print("\033[91m-----------------------------------------------------\033[0m")
            print("\033[91mCourse_id_parameter\033[0m", course_id)
            print("\033[91mDay_of_week_parameter\033[0m", day_of_week)
            print("\033[91mStaff_id_parameter\033[0m", staff_id)
            print("\033[91m-----------------------------------------------------\033[0m")
            
            query_set = Courses.objects.all()
                    
            if course_id is not None and course_id != '':
                query_set = query_set.filter(course_id=course_id)

            if day_of_week is not None and day_of_week != '':
                query_set = query_set.filter(day_of_week=int(day_of_week))
                
            if staff_id is not None and staff_id != '':
                if NewUser.objects.filter(staff_id=staff_id).exists():
                    user = NewUser.objects.get(staff_id=staff_id)
                    print("\033[91mUser\033[0m", user, user.role, user.staff_id)
                    if user.role == 'T':
                        query_set = query_set.filter(teacher_id__staff_id=staff_id)
                    else:
                        course_ids=UserCourse.objects.filter(user=user).values_list('course__course_id', flat=True)
                        query_set = query_set.filter(course_id__in=course_ids)
                else:
                    raise Http404("User doesn't exist.")
                
            print("\033[91m-----------------------------------------------------\033[0m")
            print("\033[91mQuery_set\033[0m", query_set)
            for course in query_set:
                print("\033[91mCourse ID, Course Name\033[0m", course.course_id, course.course_name)
                print("\033[91mTeacher ID\033[0m", course.teacher_id)
            print("\033[91m-----------------------------------------------------\033[0m")
            return query_set
        else:
            return Response({"message": "Please login to view."}, status=status.HTTP_400_BAD_REQUEST)
    
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
    queryset = Courses.objects.all()  # Lấy tất cả các khóa học

    def get_object(self):
        
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to view."}, status=status.HTTP_400_BAD_REQUEST)
        
        course_id = self.kwargs['course_id']
        obj = generics.get_object_or_404(Courses, **{self.lookup_field: course_id})
        
        if self.request.user.role != 'A' or (self.request.user.role == "S" and UserCourse.objects.filter(course=obj, user=self.request.user).first()==None) or (self.request.user.role == "T" and self.request.user.staff_id != obj.teacher_id):
            return Response({"message": "You do not have this permission."}, status=status.HTTP_400_BAD_REQUEST)
        
        return obj


    def perform_destroy(self, instance):
        # Thực hiện kiểm tra trước khi xóa
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to delete."}, status=status.HTTP_400_BAD_REQUEST)
        
        if self.request.user.role != 'A':
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Nếu điều kiện đúng, xóa đối tượng khóa học
        instance.delete()
        return Response({"message": "This course has been deleted."}, status=status.HTTP_204_NO_CONTENT)
    
    def perform_update(self, serializer):
        # Thực hiện kiểm tra trước khi cập nhật
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_400_BAD_REQUEST)
        
        if self.request.user.role != 'A':
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Nếu điều kiện đúng, thực hiện cập nhật dữ liệu
        serializer.save()
        return Response(serializer.data, status=200)

class StudentsCourseRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView): 
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentsCourseSerializer
    queryset = UserCourse.objects.all()
    pagination_class = CustomPageNumberPagination
    
    def get(self, request, *args, **kwargs):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course_id = self.kwargs.get("course_id")
            course = Courses.objects.get(course_id=course_id)
            student_list = UserCourse.objects.filter(course=course) 
            student_data = student_list.values('user__staff_id', 'user__full_name', 'user__class_id', 'user__phone_number',)
            if self.request.user.role != 'A' and (self.request.user.role == 'S' and self.request.user not in student_list) and  (self.request.user.role == 'T' and self.request.user != course.teacher_id):
                return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
            formatted_data = [{k.split('__')[1]: v for k, v in item.items()} for item in student_data]
            return Response(formatted_data, status=status.HTTP_200_OK)
        except UserCourse.DoesNotExist:
            return Response({"message": "Object not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def perform_destroy(self, instance):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_400_BAD_REQUEST)
        
        if self.request.user.role != 'A':
            return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
        
        instance.delete()
        return Response({"message": "This course has been deleted."}, status=status.HTTP_204_NO_CONTENT)
    
    def perform_update(self, serializer):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_400_BAD_REQUEST)
        
        print(self.request.user.role)
        if self.request.user.role != 'A' and self.request.user.role != 'T':
            return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
        
        # Nếu điều kiện đúng, thực hiện cập nhật dữ liệu
        serializer.save()
        return Response(serializer.data, status=200)
    
    def delete(self, request, *args, **kwargs):
        
        removed_student_ids = request.data.get('student_ids', [])
        course = Courses.objects.get(course_id=self.kwargs['course_id'])
        
        removed_students = NewUser.objects.filter(staff_id__in=removed_student_ids)
        UserCourse.objects.filter(course=course, user__in=removed_students).delete()
        course.num_of_student -= len(removed_students)
        course.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):    
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
        return Response(status=status.HTTP_204_NO_CONTENT)