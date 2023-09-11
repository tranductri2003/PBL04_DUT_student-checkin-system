from django.contrib import admin
from users.models import NewUser, Student, Teacher, Admin
# Register your models here.
admin.site.register(NewUser)
admin.site.register(Student)
admin.site.register(Teacher)
# admin.site.register(Admin)
