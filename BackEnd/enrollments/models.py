# models.py

from django.db import models
from users.models import NewUser
from courses.models import Courses

class StudentCourse(models.Model):
    student = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.course_name}"