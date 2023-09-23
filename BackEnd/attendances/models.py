from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from users.models import NewUser
from courses.models import Courses
from helper.models import TimeSetup

# Create your models here.
class Attendances(TimeSetup, models.Model):
    student_id = models.ForeignKey(
        NewUser, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE)
    attendance_time = models.TimeField(default=timezone.now)  # Sử dụng TimeField
    status =models.BooleanField(default=False)
    note = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.student.full_name} - {self.course.course_name}"
    

