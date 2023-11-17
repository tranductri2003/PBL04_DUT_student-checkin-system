from keras.preprocessing import image
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.models import Model
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import cv2

import os
from db import *


# Tải mô hình VGG16 (chọn include_top=False để loại bỏ các lớp fully connected ở cuối)
base_model = VGG16(weights='imagenet', include_top=False)



# Hàm để trích xuất đặc trưng từ ảnh
def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = base_model.predict(x)
    features_vector = features.flatten()
    return features_vector

def create_features(staff_id, image):
    # Lấy đường dẫn của thư mục chứa tệp tin hiện tại
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    img_path = os.path.join(current_directory, "temp_image.jpg")
    image.save(img_path)

    # Trích xuất đặc trưng từ ảnh đã lưu
    features_vector = extract_features(img_path)
    print(111111, features_vector)
    # Insert đặc trưng vào cơ sở dữ liệu
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM FaceFeatures WHERE staff_id = %s", (staff_id,))
    existing_record = cur.fetchone()

    if existing_record:
        cur.execute("UPDATE FaceFeatures SET features = %s WHERE staff_id = %s", (features_vector.tolist(), staff_id))

    else:
        cur.execute("INSERT INTO FaceFeatures (features, staff_id) VALUES (%s , %s)", (features_vector.tolist(), staff_id))

    conn.commit()
    cur.close()
    # Tùy chọn: Xóa file tạm thời
    os.remove(img_path)
    close_connection(conn)

     

def face_recognize(staff_id, image, threshold = 0.1):
    # Lấy đường dẫn của thư mục chứa tệp tin hiện tại
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    img_path = os.path.join(current_directory, "temp_image.jpg")
    image.save(img_path)
    check_vector = extract_features(img_path)


    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM FaceFeatures WHERE staff_id = %s', (str(staff_id), )) 
    base_vector = cur.fetchone() 
    cur.close()
    close_connection(conn)
    
    print(len(base_vector))
    print(len(check_vector))

    # matrix = np.vstack([base_vector, check_vector])
    
    # cosine_sim = cosine_similarity(matrix)
    # os.remove(img_path)

    # return cosine_sim
    
    
