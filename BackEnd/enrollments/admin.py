# student_course/admin.py

from django.contrib import admin
from .models import StudentCourse

class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ('student', 'course')
    list_filter = ('course',)
    search_fields = ('student__full_name', 'course__course_name')
    list_per_page = 20

admin.site.register(StudentCourse, StudentCourseAdmin)