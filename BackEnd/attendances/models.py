from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from datetime import datetime

from users.models import NewUser
from courses.models import Courses
from helper.models import TimeSetup
# Create your models here.


class Attendances(TimeSetup, models.Model):
    attendance_id = models.CharField(max_length=255, blank=True, editable=False)
    student_id = models.ForeignKey(
        NewUser, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE)
    attendance_time = models.TimeField(default=None, null=True, blank=True)
    attendance_date = models.DateField(null=True, blank=True, default=datetime.now)
    status = models.BooleanField(default=False)
    note = models.CharField(max_length=100)
    
    def __str__(self):
        student_name = NewUser.objects.get(id=self.student_id_id, role="S").full_name
        course_name = Courses.objects.get(id=self.course_id_id).course_name
        return f"{student_name} - {course_name}"
    def save(self, *args, **kwargs):
        # Tạo giá trị cho trường attendance_id
        self.attendance_id = f"{self.student_id_id}-{self.course_id_id}-{self.attendance_date}"
        super().save(*args, **kwargs)

