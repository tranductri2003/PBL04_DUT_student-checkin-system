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
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"
    queryset = Attendances.objects.all()
#    filter_backends = [DjangoFilterBackend]
#    filterset_fields = ["student_id", "course_id", "attendance_date", "status"]

    def perform_update(self, serializer):
        # Thực hiện kiểm tra trước khi cập nhật
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_BAD_REQUEST)
        
        if self.request.user.role not in ['A', 'T']:
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_BAD_REQUEST)
        
        # Nếu điều kiện đúng, thực hiện cập nhật dữ liệu
        serializer.save()
        return Response(serializer.data, status=status.HTTP_OK)

class AttendanceDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    queryset = Attendances.objects.all()
    lookup_field = "attendance_id"
    
    def perform_destroy(self, instance):
        # Thực hiện kiểm tra trước khi xóa
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to delete."}, status=status.HTTP_BAD_REQUEST)
        
        if self.request.user.role != 'A':
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_BAD_REQUEST)
        
        # Nếu điều kiện đúng, xóa đối tượng khóa học
        instance.delete()
        return Response({"message": "This course has been deleted."}, status=status.HTTP_NO_CONTENT)



