# from .views import 
from django.urls import path

from .views import (
    AttendanceListCreateView,
    AttendanceUpdateView,
    AttendanceDeleteView,
)

app_name = 'Attendances'

urlpatterns = [
    path('', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('edit/<str:attendance_id>', AttendanceUpdateView.as_view(), name='attendance-update'),
    path('delete/<str:attendance_id>',AttendanceDeleteView.as_view(), name='attendance-delete'),
]
