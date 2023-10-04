from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from helper.models import TimeSetup


ROLES = [
    ("S", "Student"),
    ("T", "Teacher"),
    ("A", "Admin")
]


def upload_to(instance, filename):
    # Kiểm tra vai trò của người dùng và xác định thư mục con
    if instance.role == "S":
        folder = 'students'
    elif instance.role == "T":
        folder = 'teachers'
    else:
        folder = 'admin'

    return f'{folder}/{filename}'


class CustomAccountManager(BaseUserManager):
    def create_superuser(self, staff_id, email, full_name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True.')
        if email is None:
            raise ValueError('The Email field must be set')  # Kiểm tra email

        return self.create_user(staff_id, email, full_name, password, **extra_fields)


    def create_user(self, staff_id, email, full_name, password, **other_fields):

        if not email:
            raise ValueError(_('You must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(staff_id=staff_id, email=email, full_name=full_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class NewUser(TimeSetup, AbstractBaseUser, PermissionsMixin):
    staff_id = models.CharField(max_length=15, unique=True)
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=50)
    avatar = models.ImageField(
        _("Avatar"), upload_to=upload_to, default='students/default.jpg')

    university = models.CharField(max_length=50, default = None, null = True)
    faculty = models.CharField(max_length=50, default = None, null = True)
    class_id = models.CharField(max_length=15, default = None, null = True)

    about = models.TextField(_(
        'about'), max_length=500, blank=True, default="Em là sinh viên Bách Khoa")
    phone_number = models.CharField(max_length=100)
    date_of_birth = models.DateField(auto_now_add=True)
    role = models.CharField(choices=ROLES, default="S", max_length=1)
    

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    
    USERNAME_FIELD = 'staff_id'
    REQUIRED_FIELDS = ['full_name', 'email']
    
    objects = CustomAccountManager()

    def __str__(self):
        return self.full_name

