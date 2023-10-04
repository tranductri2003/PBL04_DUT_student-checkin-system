from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from users.serializers import BasicUserSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)

        # Tạo một custom payload cho access token
        access_payload = {
            'user_id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,  # Thay 'role' bằng tên field chứa vai trò của user
            'staff_id': self.user.staff_id,  # Thay 'staff_id' bằng tên field chứa staff_id của user
            'avatar': str(self.user.avatar.url) if self.user.avatar else None,  # Chuyển URL avatar thành chuỗi
        }
        access_token = refresh.access_token
        access_token.payload.update(access_payload)
        data["access"] = str(access_token)

        # Lấy thông tin của người dùng từ request
        user = self.user
        
        # Kiểm tra xem thông tin của người dùng có tồn tại hay không
        if user:
            # Serialize thông tin người dùng bằng CustomUserSerializer
            user_serializer = BasicUserSerializer(user)
            # Thêm thông tin người dùng vào kết quả trả về
            data['user'] = user_serializer.data

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
        
        return data
