from django.contrib import admin
from .models import Attendances

@admin.register(Attendances)
class AttendancesAdmin(admin.ModelAdmin):
    list_display = ('attendance_id', 'student_id', 'course_id', 'attendance_time','attendance_date','status', 'note', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('student_id__full_name', 'course_id__course_name', 'note')
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {
            'fields': ('student_id', 'course_id', 'attendance_time','attendance_date',)
        }),
        ('Status and Note', {
            'fields': ('status', 'note')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    # def has_delete_permission(self, request, obj=None):
    #     # Ngăn người dùng xóa bất kỳ mục nào
    #     return False

