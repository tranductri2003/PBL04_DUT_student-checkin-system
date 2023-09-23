# urls.py

from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # Xem danh sách người dùng
    path('', views.UserListView.as_view(), name='user-list'),
    path('student/', views.StudentListView.as_view(), name='student-list'),
    path('teacher/', views.TeacherListView.as_view(), name='teacher-list'),
    path('admin/', views.AdminListView.as_view(), name='admin-list'),

    # # Xem chi tiết người dùng
    # path('<str:staff_id>/', views.UserDetailView.as_view(), name='user-detail'),

    # # Tạo, Chỉnh sửa và Xóa người dùng
    path('create/', views.UserCreateView.as_view(), name='user-create'),
    path('edit/<str:staff_id>/', views.UserUpdateView.as_view(), name='user-update'),
    path('delete/<str:staff_id>/', views.UserDeleteView.as_view(), name='user-delete'),
]
