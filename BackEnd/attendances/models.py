from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from users.models import NewUser
from courses.models import Courses

# Create your models here.
class Attendances(models.Model):
    student_id = models.ForeignKey(
        NewUser, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE)
    attendance_time = models.TimeField(default=timezone.now)  # Sử dụng TimeField
    status =models.BooleanField(default=False)
    note = models.CharField(max_length=100)
    
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(default = None, null = True)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.course_name}"
    

