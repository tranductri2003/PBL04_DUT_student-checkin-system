# create_users.py
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "C:\\Users\\Phat\\OneDrive - The University of Technology\\Desktop\\HK5\\PBL4\\PBL04_DUT-Student-CheckIn-System\\BackEnd\\core\\settings.py")
import django
from models import NewUser

def create_users_from_data_file(file_path):
    # Đọc dữ liệu từ tệp và tạo người dùng
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            data = line.strip().split('\t')
            staff_id, full_name, class_id, phone_number = data[:4]

            # Tạo một người dùng mới nếu chưa tồn tại
            user_email = f'{staff_id}@gmail.com'
           

            if not NewUser.objects.filter(staff_id=staff_id).exists():
                new_user = NewUser(
                    staff_id=staff_id,
                    email=user_email,
                    full_name=full_name,
                    phone_number=phone_number,
                    class_id=class_id,
                    password='123456789',  # Đặt mật khẩu mặc định
                    is_active=True,  # Bạn có thể điều chỉnh điều này tùy theo nhu cầu của bạn
                    is_staff=False,  # Bạn có thể điều chỉnh điều này tùy theo nhu cầu của bạn
                )

                new_user.save()

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project_name.settings")
    django.setup()
    
    # Thay "your_project_name" bằng tên của dự án Django của bạn
    
    create_users_from_data_file('Student_Data.txt')
