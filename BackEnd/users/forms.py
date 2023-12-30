from django.contrib.auth.forms import UserCreationForm
from django.contrib.sites.shortcuts import get_current_site
from .tokens import account_activation_token
from dotenv import load_dotenv
from django.core.mail import EmailMessage
import os
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils.html import strip_tags
from django.conf import settings

# Đặt đường dẫn đến tệp .env ở đây
env_file = "./.env"

# Load các biến môi trường từ tệp .env
load_dotenv(env_file)
from django.template.loader import render_to_string

class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['password1'].required = False
        self.fields['password2'].required = False

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.set_password('123456789')
        user.save()

        # Render the email content using the template
        activation_link = f"{os.getenv('FRONT_END_IP')}/activate/{urlsafe_base64_encode(force_bytes(user.pk))}/{account_activation_token.make_token(user)}/"
        mail_subject = 'Activate your account'
        message = render_to_string('registration_activation_email.html', {'user': user, 'activation_link': activation_link})
        to_email = user.email

        # Send the email with both HTML and plain text versions
        email = EmailMessage(
            mail_subject,
            message,  # HTML version
            to=[to_email],
            from_email=settings.DEFAULT_FROM_EMAIL,
        )
        email.content_subtype = 'html'  # Set the content type to HTML
        email.send()

        return user