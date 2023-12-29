import django_filters
from .models import Attendances

class AttendanceFilter(django_filters.FilterSet):
    class Meta:
        model = Attendances
        fields = {
            'attendance_date': ['exact'],
            'status': ['exact'],
            # 'student_id__staff_id': ['exact', 'icontains'],
            # 'course_id__course_id': ['exact', 'icontains']
        }
