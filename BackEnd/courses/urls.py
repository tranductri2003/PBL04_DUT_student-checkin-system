from django.urls import path
from .views import (
    CoursesListView,
    CoursesDetailView,
    CoursesCreateView,
    CoursesUpdateView,
    CoursesDeleteView,
    TeacherCoursesListView,
    StudentCoursesListView,
    CourseStudentListView,
    StudentEnrollView,
    StudentDeleteView,
)

app_name = 'courses'

urlpatterns = [
    # Xem danh sách tất cả khóa học
    path('', CoursesListView.as_view(), name='courses-list'),

    # Xem chi tiết khóa học theo course_id
    path('<str:course_id>/', CoursesDetailView.as_view(), name='courses-detail'),

    # Tạo khóa học mới
    path('create/', CoursesCreateView.as_view(), name='courses-create'),

    # Chỉnh sửa thông tin khóa học theo course_id
    path('edit/<str:course_id>/', CoursesUpdateView.as_view(), name='courses-update'),

    # Xóa khóa học theo course_id
    path('delete/<str:course_id>/', CoursesDeleteView.as_view(), name='courses-delete'),

    # Xem danh sách khóa học của một giáo viên
    path('teacher/<str:teacher_id>/', TeacherCoursesListView.as_view(), name='teacher-courses-list'),
    
    # Xem danh sách khóa học của một sinh viên
    path('student/<str:student_id>/', StudentCoursesListView.as_view(), name='student-courses-list'),
    
    # Xem danh sách sinh viên của một lớp
    path('list-student/<str:course_id>/', CourseStudentListView.as_view(), name='course-student-list'),

    # Thêm một sinh viên vào một lớp
    path('add-student/<str:course_id>/<str:student_id>', StudentEnrollView.as_view(), name='student-enrollment-create'),
    
    # Xóa một sinh viên ra khỏi lớp
    path('delete-student/<str:course_id>/<str:student_id>', StudentDeleteView.as_view(), name='student-enrollment-delete'),
]