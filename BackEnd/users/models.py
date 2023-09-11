from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


ROLES = [
    ("S", "Student"),
    ("T", "Teacher"),
    ("A", "Admin")
]


def upload_to(instance, filename):
    # Xác định thư mục con dựa trên vai trò của người dùng
    if isinstance(instance, Student):
        folder = 'students'
    else:
        folder = 'teachers'
    
    return f'{folder}/{filename}'


class CustomAccountManager(BaseUserManager):
    def create_superuser(self, identity_id, full_name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True.')

        # Không cần truyền giá trị email ở đây
        return self.create_user(identity_id=identity_id, full_name=full_name, password=password, **extra_fields)

    def create_user(self, identity_id, full_name, password, **extra_fields):
        email = extra_fields.pop('email', None)  # Lấy giá trị email nếu có, nếu không thì là None
        email = self.normalize_email(email)
        user = self.model(email=email, identity_id=identity_id, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class NewUser(AbstractBaseUser, PermissionsMixin):
    identity_id = models.CharField(max_length=15, unique=True)
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=50)
    avatar = models.ImageField(
        _("Avatar"), upload_to=upload_to, default='students/default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    about = models.TextField(_(
        'about'), max_length=500, blank=True, default="Em là sinh viên Bách Khoa")
    phone_number = models.CharField(max_length=100)
    date_of_birth = models.DateField(auto_now_add=True)
    role = models.CharField(choices=ROLES, default="S", max_length=20)
    
    is_deleted = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'identity_id'
    REQUIRED_FIELDS = ['full_name']
    
    objects = CustomAccountManager()

    def __str__(self):
        return self.full_name


class Student(NewUser):
    class_id = models.CharField(max_length=15)
    faculty = models.CharField(max_length=50)
    
class Teacher(NewUser):
    faculty = models.CharField(max_length=50)

class Admin(NewUser):
    pass
