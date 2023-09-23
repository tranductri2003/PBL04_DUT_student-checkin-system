from django.shortcuts import render
from rest_framework import  filters, generics, permissions
from users.models import NewUser
from users.serializers import UserSerializer, StudentSerializer, TeacherSerializer, AdminSerializer, UserCreateSerializer,UserUpdateSerializer,UserDeleteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status



# Create your views here.
class UserListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    queryset = NewUser.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role']



class StudentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = StudentSerializer
    queryset = NewUser.objects.filter(role="S")

class TeacherListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TeacherSerializer
    queryset = NewUser.objects.filter(role="T")

class AdminListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AdminSerializer
    queryset = NewUser.objects.filter(role="A")

class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer

class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserUpdateSerializer
    lookup_field = "staff_id"
    queryset = NewUser.objects.all()
    def update(self, request, *arg, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data = request.data, partial = True) # partial = True kết hợp với 'phone_number': {'required': False} bên serializer để cho phép cập nhật dữ liệu chỉ thay đổi những trường đã nhập
        if serializer.is_valid():
            new_password = request.data.get('password')
            serializer.save()
            if new_password:
                user.set_password(new_password)
                user.save()
            return Response({'message': 'Profile updated successfully.', 'password': f'{new_password}'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserDeleteSerializer
    queryset = NewUser.objects.all()
    lookup_field = "staff_id"
        
    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.is_deleted = True 
    #     instance.save()
    #     instance.delete()  # Thực hiện xóa cứng
    #     return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)