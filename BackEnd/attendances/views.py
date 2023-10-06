from django.shortcuts import render
from rest_framework import  generics, permissions,filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status
from django.shortcuts import get_object_or_404  
from datetime import datetime

from attendances.models import Attendances
from attendances.serializers import AttendanceSerializer
from helper.models import CustomPageNumberPagination
from courses.models import Courses

# Create your views here.
class AttendanceListCreateView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AttendanceSerializer
    queryset = Attendances.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["student_id", "course_id", "attendance_date", "status"]
    pagination_class = CustomPageNumberPagination
    
    def perform_create(self, serializer):
        user_id = self.request.user.id
        course_id = self.request.data.get('course_id')
        attendance_date = datetime.now().strftime("%Y-%m-%d")
        attendance_time = Courses.objects.get(course_id=course_id).start_time
        attendance_id = f"{user_id}-{course_id}-{attendance_date}"
        status = self.request.data.get('status', True)
        note = self.request.data.get('note', '')

        serializer.save(
            user_id=user_id,
            course_id=course_id,
            attendance_date=attendance_date,
            attendance_time=attendance_time,
            attendance_id=attendance_id,
            status=status,
            note=note
        )

class AttendanceUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"
    queryset = Attendances.objects.all()
#    filter_backends = [DjangoFilterBackend]
#    filterset_fields = ["student_id", "course_id", "attendance_date", "status"]

class AttendanceDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AttendanceSerializer
    queryset = Attendances.objects.all()
    lookup_field = "attendance_id"



