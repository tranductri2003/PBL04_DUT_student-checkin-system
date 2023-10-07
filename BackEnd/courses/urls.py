from django.urls import path

from .views import (
    CoursesListCreateView,
    CoursesRetrieveUpdateDeleteView,
    CourseStudentListView,
    StudentEnrollView,
    StudentDeleteView,
)

app_name = 'courses'

urlpatterns = [
    # Xem danh sách tất cả khóa học
    path('', CoursesListCreateView.as_view(), name='courses-list-create'),

    # Chỉnh sửa, xóa khóa học theo course_id
    path('<str:course_id>', CoursesRetrieveUpdateDeleteView.as_view(), name='courses-retrieve-update-delete'),
    
    # Xem danh sách sinh viên của một lớp học phần
    path('list-student/<str:course_id>/', CourseStudentListView.as_view(), name='course-student-list'),

    # Thêm một sinh viên vào một lớp
    path('add-student/<str:course_id>/<str:student_id>/', StudentEnrollView.as_view(), name='student-enrollment-create'),
    
    # Xóa một sinh viên ra khỏi lớp
    path('delete-student/<str:course_id>/<str:student_id>/', StudentDeleteView.as_view(), name='student-enrollment-delete'),
]