# urls.py

from django.urls import path
from .views import (
    UserListView,
    StudentListView,
    TeacherListView,
    AdminListView,
    UserDetailView,
    UserCreateView,
    UserUpdateView,
    UserDeleteView,
)
app_name = 'users'

urlpatterns = [
    # Xem danh sách người dùng
    path('',UserListView.as_view(), name='user-list'),
    path('student/',StudentListView.as_view(), name='student-list'),
    path('teacher/',TeacherListView.as_view(), name='teacher-list'),
    path('admin/',AdminListView.as_view(), name='admin-list'),

    # # Xem chi tiết người dùng
    path('<str:staff_id>/',UserDetailView.as_view(), name='user-detail'),

    # # Tạo, Chỉnh sửa và Xóa người dùng
    path('create/',UserCreateView.as_view(), name='user-create'),
    path('edit/<str:staff_id>/',UserUpdateView.as_view(), name='user-update'),
    path('delete/<str:staff_id>/',UserDeleteView.as_view(), name='user-delete'),
]
