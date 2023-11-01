import asyncio 
import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import NewUser
from django.contrib.auth.models import User
import jwt
from django.conf import settings  # Import Django settings


class StatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        
        await self.channel_layer.group_add("online", self.channel_name)
        await self.accept()
        #user = self.scope['user']
        #print(user)
        
        
        
        # if user.is_authenticated:
        #     await self.update_user_status(user, True)
        #     await self.send_status()

    async def disconnect(self, code):
        await self.channel_layer.group_discard("online", self.channel_name)
        #user = self.scope['user']
        # if user.is_authenticated:
        #     await self.update_user_status(user, False)
        #     await self.send_status()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if "access_token" in text_data_json:
            #print(text_data_json["access_token"])
            access_token = text_data_json["access_token"][3:]
            status = text_data_json["access_token"][0:3]
            #print(status)
            #print(access_token)
            try:
                decoded_token = jwt.decode(jwt=access_token, key=settings.SECRET_KEY, algorithms=['HS256'])
                staff_id = decoded_token.get('staff_id')
                print(staff_id)
                user = await self.get_user(staff_id)
                print(user)
                if status =='onl':
                    print(status)        
                    await self.update_user_status(user,True)
                    status_message = {'type': 'user.status', 'staff_id': user.staff_id, 'status': True}
                    await self.channel_layer.group_send('online', {
                        'type': 'send_status',
                        'message': status_message
                    })
                elif status =='off':
                    await self.update_user_status(user,False)
                    status_message = {'type': 'user.status', 'staff_id': user.staff_id, 'status': False}
                    await self.channel_layer.group_send('online', {
                        'type': 'send_status',
                        'message': status_message
                    })
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                await self.close()

            except jwt.DecodeError:
                print("Invalid token")
                await self.close()
        else:
            print("Không tìm thấy access token")
    
    @database_sync_to_async
    def get_user(self, staff_id):
        return NewUser.objects.get(staff_id=staff_id)


    async def send_status(self, event):
        print(event["message"],"đây nè")
        await self.send(json.dumps(event["message"]))

    @database_sync_to_async
    def update_user_status(self, user, status):
        user.status = status
        user.save()
        

            