from keras.preprocessing import image
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.models import Model
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import cv2
import jwt
from settings import JWT_SECRET_KEY, MEDIA_URL
from flask import request, jsonify
import requests

import os
from db import *


# Tải mô hình VGG16 (chọn include_top=False để loại bỏ các lớp fully connected ở cuối)
base_model = VGG16(weights='imagenet', include_top=False)


def face_detection(image):
    # Load the pre-trained Haar Cascade face classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Convert the image to grayscale (required for face detection)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Perform face detection
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    # Find the largest face
    largest_face = None
    largest_area = 0

    for (x, y, w, h) in faces:
        current_area = w * h
        if current_area > largest_area:
            largest_area = current_area
            largest_face = (x, y, w, h)
    
    if largest_face is not None:
        x, y, w, h = largest_face
        largest_face_image = image[y:y+h, x:x+w]
        largest_face_resized = cv2.resize(largest_face_image, (224, 224))
        return largest_face_resized

    return largest_face



# Hàm để trích xuất đặc trưng từ ảnh
def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = base_model.predict(x)
    features_vector = features.flatten()
    return features_vector

def read_image(image):
    # Read the image using cv2.imdecode
    image_stream = image.read()
    img_array = np.frombuffer(image_stream, dtype=np.float32)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)  # Keep the color information

    # Resize the image
    # img = cv2.resize(img, (224, 224))
    return img

def create_features(staff_id, image):
    # Lấy đường dẫn của thư mục chứa tệp tin hiện tại
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    img_path = os.path.join(current_directory, "temp_image.jpg")
    image.save(img_path)
    image = read_image(image)
    
    face = face_detection(image)
    

    # Trích xuất đặc trưng từ ảnh đã lưu
    features_vector = extract_features(face)

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

     

def face_recognize(staff_id, avatar, image, threshold = 0.3):
    # Lấy đường dẫn của thư mục chứa tệp tin hiện tại
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    img_path = os.path.join(current_directory, "temp_image.jpg")
    image.save(img_path)
    check_vector = extract_features(img_path)

    avatar_url = MEDIA_URL + avatar
    
    # Sử dụng thư viện requests để tải ảnh từ URL
    response = requests.get(avatar_url)
    url_path = os.path.join(current_directory, "temp_avatar.jpg") 
    with open(url_path, 'wb') as f:
            f.write(response.content)
            
    base_vector = extract_features(url_path)

    

    # conn = get_connection()
    # cur = conn.cursor()
    # cur.execute('SELECT * FROM FaceFeatures WHERE staff_id = %s', (str(staff_id), )) 
    # base_vector = cur.fetchone() 
    # cur.close()
    # close_connection(conn)
    

    matrix = np.vstack([base_vector, check_vector])
    
    cosine_sim = cosine_similarity(matrix)
    os.remove(img_path)
    os.remove(url_path)

    # Chuyển giá trị float32 thành float
    cosine_similarity_value = float(cosine_sim[0, 1])
    print(cosine_similarity_value)
    
    check = True if cosine_similarity_value >= threshold else False
    return cosine_similarity_value, check
    
    
