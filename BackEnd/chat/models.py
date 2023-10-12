from django.db import models
from users.models import NewUser
from django.conf import settings
# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(default="For those who love writing")
    private = models.BooleanField(default=True)
    participants = models.ManyToManyField(NewUser, related_name='chat_rooms', blank=True)

    def __str__(self):
        return self.slug
    

class Message(models.Model):
    user =models.ForeignKey(
       NewUser , on_delete=models.CASCADE)
    content = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return "Message is :- "+ self.content