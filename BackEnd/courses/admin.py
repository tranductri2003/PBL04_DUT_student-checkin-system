from django.contrib import admin

from .models import Courses, UserCourse

@admin.register(Courses)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ('course_id', 'course_name','num_of_student', 'teacher_id', 'day_of_week', 'start_time', 'end_time', 'start_date', 'end_date', 'room', 'created_at', 'updated_at')
    list_filter = ('day_of_week', 'start_date', 'end_date', 'created_at', 'updated_at')
    search_fields = ('course_id', 'course_name', 'teacher_id__full_name', 'room')
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {
            'fields': ('course_id', 'course_name','num_of_student', 'teacher_id', 'day_of_week', 'start_time', 'end_time', 'start_date', 'end_date', 'room')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course')
    list_filter = ('course',)
    search_fields = ('user__full_name', 'course__course_name')
    list_per_page = 20

admin.site.register(UserCourse, UserCourseAdmin)