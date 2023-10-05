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
        message = text_data_json["message"]
        user_name = text_data_json["user_name"]
        room_name = text_data_json["room_name"]
        
        await self.save_message(message, user_name, room_name)     

        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "message": message,
                "user_name": user_name,
                "room_name": room_name,
            }
        )
        
    async def sendMessage(self, event):

        message = event["message"]
        user_name = event["user_name"]

        await self.send(text_data=json.dumps({"message": message, "user_name": user_name}))
    
    @sync_to_async
    def save_message(self, message, user_name, room_name):

        print(user_name,room_name,message,"----------------------")
        user=NewUser.objects.get(user_name=user_name)
        room=Room.objects.get(slug=room_name)
        
        Message.objects.create(user=user,room=room,content=message)

# chat/consumers.py
# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import WebsocketConsumer


# class TextRoomConsumer(WebsocketConsumer):
#     def connect(self):
#         # gets 'room_name' and open websocket connection
#         self.room_name = self.scope['url_route']['kwargs']['room_name'] #
#         self.room_group_name = 'chat_%s' % self.room_name

#         # Join room group
#         async_to_sync(self.channel_layer.group_add)(
#             self.room_group_name,
#             self.channel_name
#         )

#         self.accept()

#     def disconnect(self, close_code):
#         # Leave room group
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name,
#             self.channel_name
#         )

#     # Receive message from WebSocket
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         text = text_data_json['text']
#         sender = text_data_json['sender']

#         # Send message to room group
#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': text,
#                 'sender': sender
#             }
#         )

    
#     def chat_message(self, event):
#         # Receive message from room group
#         text = event['message']
#         sender = event['sender']

#         # broadcast message to all clients in WebSocket
#         self.send(text_data=json.dumps({
#             'text': text,
#             'sender': sender
#         }))