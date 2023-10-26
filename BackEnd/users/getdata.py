# Nhập các module và mô hình cần thiết
import os
import django
from yourapp.models import NewUser  # Thay 'yourapp' bằng tên ứng dụng Django của bạn
from django.contrib.auth.hashers import make_password

# Cài đặt Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yourproject.settings')  # Thay 'yourproject' bằng tên dự án Django của bạn
django.setup()

# Xác định đường dẫn đến tệp dữ liệu
data_file_path = 'Student_data.txt'  # Cập nhật với đường dẫn chính xác đến tệp của bạn

# Đọc dữ liệu từ tệp và tạo người dùng
with open(data_file_path, 'r') as file:
    for line in file:
        data = line.strip().split('\t')
        staff_id, full_name, _, phone_number = data[:4]

        # Tạo một người dùng mới
        user_email = f'{staff_id}@gmail.com'
        class_id = 'thuwc3'

        # Kiểm tra xem người dùng đã tồn tại dựa trên staff_id chưa
        if not NewUser.objects.filter(staff_id=staff_id).exists():
            new_user = NewUser(
                staff_id=staff_id,
                email=user_email,
                full_name=full_name,
                phone_number=phone_number,
                class_id=class_id,
                password=make_password('your_password_here'),  # Đặt mật khẩu mặc định
                is_active=True,  # Bạn có thể điều chỉnh điều này tùy theo nhu cầu của bạn
                is_staff=False,  # Bạn có thể điều chỉnh điều này tùy theo nhu cầu của bạn
            )

            new_user.save()
            print(f'Đã tạo người dùng: {new_user}')
        else:
            print(f'Người dùng với staff_id {staff_id} đã tồn tại.')

# Đóng tệp
file.close()
