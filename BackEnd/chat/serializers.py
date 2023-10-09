# serializers.py

from rest_framework import serializers
from .models import Room, Message
from users.models import NewUser

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
class MessageSerializer(serializers.ModelSerializer):
    staff_id = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()  # Thêm trường message ở đây

    class Meta:
        model = Message
        fields = ('message', 'staff_id')
    def get_staff_id(self, obj):
        return obj.user.staff_id
        # return CustomUserChatSerializer(obj.user).data
    def get_message(self, obj):  # Định nghĩa hàm get_message để trả về nội dung content
        return obj.content