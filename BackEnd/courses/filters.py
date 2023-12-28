import django_filters
from .models import Courses

class CourseFilter(django_filters.FilterSet):
    class Meta:
        model = Courses
        fields = {
            'course_id': ['exact', 'icontains'],
            'course_id__course_name': ['exact', 'icontains'],
            'day_of_week': ['exact'],
        }
