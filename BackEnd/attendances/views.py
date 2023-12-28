from rest_framework import  generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status
from django.core.exceptions import PermissionDenied

from attendances.models import Attendances
from attendances.serializers import AttendanceSerializer
from helper.models import CustomPageNumberPagination
from courses.models import Courses
from .filters import AttendanceFilter

# Create your views here.
class AttendanceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = AttendanceFilter
    # filterset_fields = ["student_id", "course_id", "attendance_date", "status"]
    
    def get_queryset(self):
        page_size = self.request.GET.get('page_size', None)
        
        if page_size is None:
            page_size = CustomPageNumberPagination.page_size
        else:
            page_size = int(page_size)
        self.pagination_class.page_size = page_size
        
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to get data."}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        queryset = Attendances.objects.all()
       
        course_id = self.request.GET.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id__course_id=course_id)
        
        attendance_date = self.request.GET.get('attendance_date', None)
        if attendance_date is not None:
            queryset = queryset.filter(attendance_date=attendance_date)
        
        attendance_status = self.request.GET.get('status', None)
        if attendance_status is not None:
            queryset = queryset.filter(status=attendance_status)
            
        
        student_id = self.request.GET.get('student_id', None)
        if student_id is not None:
            if student_id != self.request.user.staff_id:
                raise PermissionDenied("You do not have permission")
            else:
                queryset = queryset.filter(student_id__staff_id=student_id)
        return queryset.order_by('-attendance_date', '-attendance_time')     
        
class AttendanceUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to get data."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role == 'A':
            queryset = Attendances.objects.all()
        
        elif self.request.user.role == 'T':
            course_list = Courses.objects.filter(teacher_id=self.request.user)
            queryset = Attendances.objects.filter(course_id__in=course_list)
        else:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        return queryset
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
            
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    

class AttendanceDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Response({"message": "Please login to get data."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.role == 'A':
            queryset = Attendances.objects.all()
        else:
            return Response({"message": "You do not have permission to access this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        return queryset

