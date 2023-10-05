# serializers.py

from rest_framework import serializers
from .models import Room, Message
from users.models import NewUser

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()  # Thêm trường message ở đây

    class Meta:
        model = Message
        fields = ('message', 'user_name')
    def get_user_name(self, obj):
        return obj.user.user_name
        # return CustomUserChatSerializer(obj.user).data
    def get_message(self, obj):  # Định nghĩa hàm get_message để trả về nội dung content
        return obj.content