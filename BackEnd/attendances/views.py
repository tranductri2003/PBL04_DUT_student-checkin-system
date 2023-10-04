from django.shortcuts import render
from rest_framework import  generics, permissions,filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status
from django.shortcuts import get_object_or_404  

from attendances.models import Attendances
from attendances.serializers import AttendanceSerializer
from helper.models import CustomPageNumberPagination

# Create your views here.
class AttendanceListCreateView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AttendanceSerializer
    queryset = Attendances.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["student_id", "course_id", "attendance_date", "status"]
    pagination_class = CustomPageNumberPagination

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



