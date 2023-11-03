import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import asyncio
from core import settings
import jwt
import datetime

from .models import Attendances
from users.models import NewUser
from courses.models import Courses, UserCourse

class AttendanceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.course_id = self.scope['url_route']['kwargs']['course_id']
        self.courseGroupName = 'course_%s' % self.course_id
        await self.channel_layer.group_add(self.courseGroupName, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.courseGroupName, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        access_token = text_data_json["access_token"]

        try:
            decoded_token = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
            staff_id = decoded_token.get('staff_id')
            user = await self.get_user(staff_id)
            course = await self.get_course()
            start_time = str(course.start_time)
            end_time = str(course.end_time)
            current_time = datetime.datetime.now().strftime("%H:%M:%S")

            if await self.student_in_course(user, course) and start_time <= current_time <= end_time:
                await self.check_in(user, course)
                await self.sendMessage(user)
            else:
                print("Invalid or missing staff_id in access_token")
                await self.close()
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            await self.close()
        except jwt.DecodeError:
            print("Invalid token")
            await self.close()

    async def sendMessage(self, user):
        message = {
            'student_id': user.staff_id,
            'full_name': user.full_name,
            'message': f"{user.full_name} đã điểm danh"
        }
        await self.channel_layer.group_send(
            self.courseGroupName,
            {
                'type': 'attendance_message',
                'message': message,
            }
        )

    async def attendance_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))

    @database_sync_to_async
    def get_user(self, staff_id):
        return NewUser.objects.get(staff_id=staff_id)

    @database_sync_to_async
    def get_course(self):
        return Courses.objects.get(course_id=self.course_id)

    @database_sync_to_async
    def student_in_course(self, user, course):
        user_course = UserCourse.objects.filter(user=user, course=course).first()
        return user_course is not None

    @database_sync_to_async
    def check_in(self, student, course):
        try:
            today = datetime.datetime.now().date()
            existing_attendance = Attendances.objects.filter(student_id=student, course_id=course, attendance_date=today).first()

            if existing_attendance:
                existing_attendance.status = True
                existing_attendance.attendance_time = datetime.datetime.now().time()
                existing_attendance.note = "Đã điểm danh"
                existing_attendance.save()
            else:
                new_attendance = Attendances(student_id=student, course_id=course, status=True, note="Đã điểm danh")
                new_attendance.save()
        except Exception as e:
            print(f"Error during check-in: {str(e)}")
