# from .views import 
from django.urls import path
from .views import (
    AttendanceListView,
    AttendanceCreateView,
    AttendanceUpdateView,
    AttendanceDeleteView,
)

app_name = 'Attendances'

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance-list'),
    path('create/',AttendanceCreateView.as_view(), name='attendance-create'),
    path('edit/<str:attendance_id>', AttendanceUpdateView.as_view(), name='attendance-update'),
    path('delete/<str:attendance_id>',AttendanceDeleteView.as_view(), name='attendance-delete'),
]
