from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Room, Message
from users.models import NewUser
from .serializers import MessageSerializer, RoomSerializer
from rest_framework import status, permissions

class RoomListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user  # Người dùng hiện tại

        # # Khởi tạo queryset rỗng
        # rooms_queryset = Room.objects.none()

        # # Duyệt qua danh sách các phòng chat
        # for room in Room.objects.all():
        #     # Kiểm tra nếu phòng là public hoặc người dùng là participant
        #     if room.private is False or user in room.participants.all():
        #         rooms_queryset |= Room.objects.filter(id=room.id)

        # Lấy ra danh sách các phòng chat public hoặc private mà người dùng đang tham gia
        rooms = user.chat_rooms.all() | Room.objects.filter(private = False)  # Sử dụng related_name 'chat_rooms' đã định nghĩa trong model NewUser
        serializer = RoomSerializer(rooms, many=True)
        
        
        return Response({
            "staff_id": user.staff_id,
            "rooms": serializer.data
        })
        

class CreateRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        room_data = request.data

        # Kiểm tra xem slug đã tồn tại hay chưa
        if Room.objects.filter(slug=room_data['slug']).exists():
            return Response({"detail": "Room with this slug already exists"}, status=status.HTTP_400_BAD_REQUEST)


        # Tạo một room mới với thông tin từ request data
        room = Room.objects.create(name=room_data['name'], slug=room_data['slug'], description=room_data['description'], private=room_data['private'])
        
        participants = room_data['participants'].split()

        for staff_id in participants:
            user  = NewUser.objects.get(staff_id=staff_id)
            room.participants.add(user)

        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
class RoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug):
        user = request.user
        room = Room.objects.get(slug=slug)
        
        if user not in room.participants.all():
            return Response({"message": "You are not a participant of this room."}, status=status.HTTP_FORBIDDEN)
        else:      
            messages = Message.objects.filter(room=room)
            serializer = MessageSerializer(messages, many=True)
            return Response({ "staff_id": request.user.staff_id,"room_name": room.name, "slug": slug, "messages": serializer.data})