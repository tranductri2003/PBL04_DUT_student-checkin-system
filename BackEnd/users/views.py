from django.shortcuts import render
from rest_framework import  filters, generics, permissions
from users.models import NewUser
from users.serializers import UserSerializer, TXTUploadSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response    
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password  # Thêm import này
from django.db.models import Q

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

    def get_queryset(self):
        full_name_query = self.request.query_params.get('full_name', None)

        queryset = self.queryset

        if full_name_query:
            queryset = queryset.filter(Q(full_name__icontains=full_name_query))

        return queryset


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

class TXTUploadView(APIView):
    serializer_class = TXTUploadSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            txt_file = serializer.validated_data['file']  # Sửa thành 'file' thay vì 'user.txt'
            # Đảm bảo tệp txt đã được tải lên
            try:
                # Đọc dữ liệu từ tệp văn bản
                decoded_file = txt_file.read().decode('utf-8').splitlines()

                # Duyệt qua từng dòng trong tệp văn bản và nạp dữ liệu vào cơ sở dữ liệu
                for line in decoded_file:
                    staff_id, full_name, class_id, phone_number = line.split('\t')
                    # Tạo hoặc cập nhật đối tượng NewUser
                    user, created = NewUser.objects.update_or_create(
                        staff_id=staff_id,
                        defaults={
                            'full_name': full_name,
                            'email': str(staff_id)+"@sv1.dut.udn.vn",
                            'class_id': class_id,
                            'phone_number': phone_number,
                            'is_active' : True,
                            'password': make_password('123456789'),  # Tạo và lưu mật khẩu đã mã hóa
                        }
                    )
            except Exception as e:
                return Response({'error': 'Lỗi trong quá trình nạp dữ liệu từ tệp văn bản'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Dữ liệu đã được nạp thành công'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
