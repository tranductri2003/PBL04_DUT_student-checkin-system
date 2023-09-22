from django.shortcuts import render
from rest_framework import  filters, generics, permissions
from users.models import NewUser
from users.serializers import UserSerializer


# Create your views here.
class UserListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    queryset = NewUser.objects.all()

