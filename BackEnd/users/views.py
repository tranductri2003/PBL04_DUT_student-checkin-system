from django.shortcuts import render
from rest_framework import  filters, generics, permissions
from users.models import NewUser
from users.serializers import UserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status

from helper.models import CustomPageNumberPagination

# Create your views here.
class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    queryset = NewUser.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['staff_id', 'university', 'faculty', 'class_id', 'role']
    ordering_fields = ['staff_id']
    pagination_class = CustomPageNumberPagination


class UserRetriveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = "staff_id"

    def get_queryset(self):
        staff_id = self.kwargs['staff_id']
        return NewUser.objects.filter(staff_id=staff_id)
    
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
    # def destroy(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.is_deleted = True 
    #     instance.save()
    #     instance.delete()  # Thực hiện xóa cứng
    #     return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
    
