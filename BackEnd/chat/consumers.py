import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .models import Room,Message
from users.models import NewUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_slug']
        self.roomGroupName = 'chat_%s' % self.room_name
        
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_name
        )
        
    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        print("\033[91m" + json.dumps(text_data_json), "----------------------\033[0m")
        message = text_data_json["message"]
        staff_id = text_data_json["staff_id"]
        room_name = text_data_json["room_name"]
        
        await self.save_message(message, staff_id, room_name)     

        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "message": message,
                "staff_id": staff_id,
                "room_name": room_name,
            }
        )
        
    async def sendMessage(self, event):

        message = event["message"]
        staff_id = event["staff_id"]

        await self.send(text_data=json.dumps({"message": message, "staff_id": staff_id}))
    
    @sync_to_async
    def save_message(self, message, staff_id, room_name):

        print("\033[91m" + staff_id, "----------------------\033[0m")
        print("\033[91m" + room_name, "----------------------\033[0m")
        print("\033[91m" + message, "----------------------\033[0m")
        
        user=NewUser.objects.get(staff_id=staff_id)
        room=Room.objects.get(slug=room_name)
        
        Message.objects.create(user=user,room=room,content=message)
