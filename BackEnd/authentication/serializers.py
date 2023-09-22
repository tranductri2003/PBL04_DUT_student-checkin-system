from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from users.serializers import UserSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        # Lấy thông tin của người dùng từ request
        user = self.user
        
        # Kiểm tra xem thông tin của người dùng có tồn tại hay không
        if user:
            # Serialize thông tin người dùng bằng CustomUserSerializer
            user_serializer = UserSerializer(user)
            # Thêm thông tin người dùng vào kết quả trả về
            data['user'] = user_serializer.data

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
        
        return data