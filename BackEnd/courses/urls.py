from django.urls import path

from .views import (
    CoursesListCreateView,
    CoursesRetrieveUpdateDeleteView,
    StudentsCourseDeleteView,
    StudentsCourseCreateView,
    StudentsCourseRetrieveView,
    # StudentsCourseRetrieveUpdateDeleteView
)

app_name = 'courses'

urlpatterns = [
    # Xem danh sách tất cả khóa học
    path('', CoursesListCreateView.as_view(), name='courses-list-create'),

    # Chỉnh sửa, xóa khóa học theo course_id
    path('<str:course_id>/', CoursesRetrieveUpdateDeleteView.as_view(), name='courses-retrieve-update-delete'),
    
    # Xem, thêm, xóa danh sách sinh viên của một lớp học phần
    path('students/<str:course_id>/', StudentsCourseRetrieveView.as_view(), name='students-course-retrieve'),
    path('students/<str:course_id>/', StudentsCourseCreateView.as_view(), name='students-course-create'),
    path('students/<str:course_id>/', StudentsCourseDeleteView.as_view(), name='students-course-delete'),
    # path('students/<str:course_id>/', StudentsCourseRetrieveUpdateDeleteView.as_view(), name='students-course-retrieve'),
]