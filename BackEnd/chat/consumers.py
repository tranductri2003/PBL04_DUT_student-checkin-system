import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import asyncio  # Import asyncio module for timeouts
from core import settings
import jwt

from .models import Room,Message
from users.models import NewUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.roomGroupName = 'chat_%s' % self.room_slug
        await self.channel_layer.group_add(self.roomGroupName, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_name
        )
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if "access_token" in text_data_json:
            access_token = text_data_json["access_token"]
            
            try:
                decoded_token = jwt.decode(jwt=access_token, key=settings.SECRET_KEY, algorithms=['HS256'])
                staff_id = decoded_token.get('staff_id')
                user = await self.get_user(staff_id)
                room = await self.get_room()

                if await self.user_in_room(user, room):
                    pass
                else:
                    print("Invalid or missing staff_id in access_token")
                    await self.close()
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                await self.close()
            except jwt.DecodeError:
                print("Invalid token")
                await self.close()
        else:
            # Handle other types of messages here, e.g., messages with "message" field.
            message = text_data_json.get("message")
            staff_id = text_data_json.get("staff_id")
            room_slug = text_data_json.get("room_slug")
            
            if message and staff_id and room_slug:
                await self.save_message(message, staff_id, room_slug)
                await self.channel_layer.group_send(
                    self.roomGroupName, {
                        "type": "sendMessage",
                        "message": message,
                        "staff_id": staff_id,
                        "room_slug": room_slug,
                    }
                )

        
    async def sendMessage(self, event):

        message = event["message"]
        staff_id = event["staff_id"]

        await self.send(text_data=json.dumps({"message": message, "staff_id": staff_id}))
    
    @sync_to_async
    def save_message(self, message, staff_id, room_slug):
        
        user=NewUser.objects.get(staff_id=staff_id)
        room=Room.objects.get(slug=room_slug)
        
        Message.objects.create(user=user,room=room,content=message)

    @database_sync_to_async
    def get_room(self):
        return Room.objects.get(slug=self.room_slug)

    @database_sync_to_async
    def get_user(self, staff_id):
        return NewUser.objects.get(staff_id=staff_id)

    @database_sync_to_async
    def user_in_room(self, user, room):
        if user in room.participants.all():
            return True
        else:
            return False