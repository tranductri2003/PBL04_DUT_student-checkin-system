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
class AttendanceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role == 'A':
            queryset = Attendances.objects.all()
        
        elif self.request.user.role == 'T':
            course_list = Courses.objects.filter(teacher_id=self.request.user)
            queryset = Attendances.objects.filter(course_id__in=course_list)
            
        else:
            queryset = Attendances.objects.filter(student_id=self.request.user)
        
        course_id = self.request.GET.get('course_id', None)
        if course_id is not None:
            try:
                course = Courses.objects.get(course_id=course_id)
                queryset = queryset.filter(course_id=course)
            except Courses.DoesNotExist:
                queryset = queryset.none()
                
        attendance_date = self.request.GET.get('attendance_date', None)
        if attendance_date is not None:
            queryset.filter(attendance_date=attendance_date)
            
        status = self.request.GET.get('status', None)
        if status is not None:
            queryset.filter(status=status)
        
        return queryset.order_by('-attendance_date', '-attendance_time')       
        
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
            return Response({"message": "Please login to update."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role not in ['A', 'T']:
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
        
        # Nếu điều kiện đúng, thực hiện cập nhật dữ liệu
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        if not request.user.is_authenticated:
            return Response({"message": "Please login to update."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.role not in ['A', 'T']:
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        result = self.perform_update(serializer)
            
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return result
    

class AttendanceDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    queryset = Attendances.objects.all()
    lookup_field = "attendance_id"
    
    def perform_destroy(self, instance):
        # Thực hiện kiểm tra trước khi xóa
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to delete."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role != 'A':
            # Nếu điều kiện không đúng, trả về lỗi và không xóa
            return Response({"message": "You do not have this permission."}, status=status.HTTP_403_FORBIDDEN)
        
        # Nếu điều kiện đúng, xóa đối tượng khóa học
        instance.delete()
        return Response({"message": "This course has been deleted."}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        result = self.perform_destroy(instance)
        return result

