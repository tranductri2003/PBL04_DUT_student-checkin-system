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
import io
import math
from sklearn.cluster import KMeans
from collections import defaultdict

import os
from db import *


# Tải mô hình VGG16 (chọn include_top=False để loại bỏ các lớp fully connected ở cuối)
base_model = VGG16(weights='imagenet', include_top=False)

def read_image(image):
    image_stream = image.read()
    img_array = np.frombuffer(image_stream, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)  # Keep the color information
    img = cv2.resize(img, (224, 224))
    return img


def extract_features(image):
    image_array = read_image(image)
    x = np.expand_dims(image_array, axis=0)
    x = preprocess_input(x)
    features = base_model.predict(x)
    features_vector = features.flatten()
    return features_vector


def face_recognize(student_id, avatar, image, threshold=0.3):
    check_vector = extract_features(image)
    check_vector = normalize_vector(check_vector)



    # Trích xuất đặc trưng từ hình ảnh cơ sở (avatar)
    # avatar_url = MEDIA_URL + avatar
    # response = requests.get(avatar_url)
    
    # Đọc hình ảnh từ dữ liệu bytes sử dụng io.BytesIO
    # base_image = io.BytesIO(response.content)
    # base_vector = extract_features(base_image)
    
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT staff_id, features FROM FaceFeatures')  # Chọn cột staff_id và features
    result = cur.fetchall()  # Lấy tất cả các dòng kết quả
    cur.close()
    close_connection(conn)

    # Duyệt qua từng dòng kết quả và lấy ra staff_id và features_vector tương ứng
    student_vector = defaultdict(lambda: 0)
    min_distance = 10**9
    for row in result:
        staff_id, features_vector = row
        vector1, vector2 = features_vector.split('#')
        
        vector1 = list(vector1.split())
        for i in range(len(vector1)):
            vector1[i] = float(vector1[i])
            
        vector2 = list(vector2.split())
        for i in range(len(vector2)):
            vector2[i] = float(vector2[i])
        
        distance = min(euclidean_distance(check_vector, vector1), euclidean_distance(check_vector, vector2))
        min_distance = min(min_distance, distance)
        
        student_vector[distance] = staff_id

    print(student_vector)
    print(student_vector[min_distance])
    print(student_vector[min_distance],student_id)
    print(student_vector[min_distance] == student_id)
    return student_vector[min_distance] == student_id

    # # Tính toán độ tương đồng cosine giữa hai vectơ đặc trưng
    # matrix = np.vstack([base_vector, check_vector])
    # cosine_sim = cosine_similarity(matrix)

    # # Chuyển giá trị float32 thành float
    # cosine_similarity_value = float(cosine_sim[0, 1])
    
    # return cosine_similarity_value, cosine_similarity_value >= threshold
    return 1,1






# def face_detection(image):
#     # Load the pre-trained Haar Cascade face classifier
#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

#     # Perform face detection
#     faces = face_cascade.detectMultiScale(image, scaleFactor=1.3, minNeighbors=5)

#     # Find the largest face
#     largest_face = None
#     largest_area = 0

#     for (x, y, w, h) in faces:
#         current_area = w * h
#         if current_area > largest_area:
#             largest_area = current_area
#             largest_face = (x, y, w, h)
    
#     if largest_face is not None:
#         x, y, w, h = largest_face
#         largest_face_image = image[y:y+h, x:x+w]
#         largest_face_resized = cv2.resize(largest_face_image, (224, 224))
#         return largest_face_resized

#     return None
def euclidean_distance(vector1, vector2):
    """
    Compute the Euclidean distance between two vectors.

    Parameters:
    - vector1 (np.ndarray): First vector.
    - vector2 (np.ndarray): Second vector.

    Returns:
    - float: Euclidean distance.
    """
    distance = 0
    for i in range(len(vector1)):
        distance += (vector1[i] - vector2[i])**2
    return math.sqrt(distance)



def create_features(staff_id, images):
    data_features_vectors = []
    for image in images:
        data_features_vectors.append(extract_features(image))
    
            
    data_features_vectors = np.array(data_features_vectors)
    normalized_array = data_features_vectors / np.max(np.abs(data_features_vectors))
    flattened_array = normalized_array.reshape(normalized_array.shape[0], -1)

    kmeans = KMeans(n_clusters=2, random_state=0)
    kmeans.fit(flattened_array)
    centroids = kmeans.cluster_centers_
    
    try:
        print("OK1")
        string_features_vector = []
        for centroid in centroids:
            temp_array = []
            for element in centroid:
                temp_array.append(str(element))
            temp_string = " ".join(temp_array)
            string_features_vector.append(temp_string)
        string_features_vector ="#".join(string_features_vector) 
    
        # Insert đặc trưng vào cơ sở dữ liệu
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM FaceFeatures WHERE staff_id = %s", (staff_id,))
        existing_record = cur.fetchone()

        print("OK2")
        if existing_record:
            print("Existing")
            cur.execute("UPDATE FaceFeatures SET features = %s WHERE staff_id = %s", (string_features_vector, staff_id))
        else:
            print("No existing features")
            cur.execute("INSERT INTO FaceFeatures (features, staff_id) VALUES (%s , %s)", (string_features_vector, staff_id))

        print("OK3")
        conn.commit()
        cur.close()
        close_connection(conn)
    except Exception as e:
        print("Error:", str(e))

def normalize_vector(vector):
    max_value = np.max(np.abs(vector))
    if max_value > 0:
        normalized_vector = vector / max_value
    else:
        normalized_vector = vector
    return normalized_vector