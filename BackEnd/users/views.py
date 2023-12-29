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
from django.contrib.auth.hashers import check_password
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from helper.models import CustomPageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from .tokens import account_activation_token
from dotenv import load_dotenv
from django.core.mail import EmailMessage
import os


# Đặt đường dẫn đến tệp .env ở đây
env_file = "./.env"

# Load các biến môi trường từ tệp .env
load_dotenv(env_file)


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
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')

            if new_password and old_password: 
                if not check_password(old_password, user.password):  # Sửa thành not để kiểm tra khi mật khẩu khớp
                    return Response({'error': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)    
                else:
                    user.set_password(new_password)
                    user.save()

            return Response({'message': 'Profile updated successfully.'}, status=status.HTTP_200_OK)
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


class UpdateAllUserInformation(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Lấy mật khẩu mới
            new_password = '123456789'

            # Lấy tất cả người dùng trong hệ thống
            all_users = NewUser.objects.all()

            # Cập nhật mật khẩu của mỗi người dùng
            for user in all_users:
                user.password = make_password(new_password)
                user.faculty = "Công nghệ thông tin"
                user.university = "Bách khoa Đà Nẵng"

                if user.role == "S":
                    user.avatar = f"{user.staff_id}.jpg"
                    
                user.save()

            return Response({'message': 'Thông tin của tất cả người dùng đã được cập nhật thành công.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': 'Lỗi trong quá trình cập nhật Thông tin.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_password_reset_email (request):
    staff_id= request.data.get("staff_id")
    user = get_object_or_404(NewUser, staff_id = staff_id)
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        
        mail_subject = 'Reset your password'
        reset_url = f"{os.getenv('FRONT_END_IP')}/reset-password/{uid}/{token}/"


        message = f"Hi {user.full_name},\n\n" \
                f"You're receiving this email because you requested a password reset for your account.\n" \
                f"Please click the following link to reset your password:\n\n" \
                f"{reset_url}\n\n" \
                f"If you didn't request a password reset, please ignore this email.\n\n" \
                f"Best regards,\n" \
                f"Dutchecker staff!"
        
        to_email = user.email
        email = EmailMessage(
            mail_subject, message, to=[to_email]
        )
        email.send()

        return Response({'success': 'check your mail to reset your password!'}, status=status.HTTP_201_CREATED)
    else:
        # Trả về cùng một thông báo cho mọi trường hợp lỗi để ẩn thông tin về sự tồn tại của tài khoản
        return Response({
            'error': 'An error occurred while processing your request'
        }, status=status.HTTP_400_BAD_REQUEST)
        
        
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def confirm_and_update_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = NewUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, NewUser.DoesNotExist):
        user = None
    
    if user is not None and account_activation_token.check_token(user, token):
        password = request.data.get("password")

        user.set_password(password)
        user.save()

        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

