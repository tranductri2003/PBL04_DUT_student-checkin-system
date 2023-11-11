import cv2
import numpy as np
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
import json

from db import *

temp_features = None

# Convert NumPy array to JSON
def numpy_array_to_json(numpy_array):
    nested_list = numpy_array.tolist()
    return json.dumps(nested_list)

# Convert JSON to NumPy array
def json_to_numpy_array(json_data):
    nested_list = json.loads(json_data)
    return np.array(nested_list)

# Đọc và tiền xử lý ảnh gương mặt
def preprocess_image(image):
    image_stream = image.read()
    img_array = np.frombuffer(image_stream, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (100, 100))
    img = img.flatten()
    return img

# Trích xuất eigenfaces từ tập dữ liệu gương mặt
def extract_eigenfaces(data, num_components):
    pca = PCA(n_components=num_components)
    pca.fit(data)
    eigenfaces = pca.components_
    return eigenfaces

def detect_feature(image):
    img = preprocess_image(image)
    data = np.array([img])
    eigenfaces = extract_eigenfaces(data, num_components=1)
    mean_face = np.mean(eigenfaces, axis=0)
    return mean_face

def create_features(staff_id, image):
    features = detect_feature(image)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO FaceFeatures (features, staff_id) VALUES (%s , %s)", (features.tolist(), staff_id))
    conn.commit() 
    cur.close()
    close_connection(conn)
        

def face_recognize(staff_id, image, threshold = 0.1):
    check_image = preprocess_image(image)
    
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM FaceFeatures WHERE staff_id = %s', (str(staff_id), )) 
    data = cur.fetchone() 
    cur.close()
    close_connection(conn)
    
    check_image = np.nan_to_num(check_image, nan=0)  # Loại bỏ NaN bằng cách đặt giá trị NaN thành 0
    cosine_similarity_value = cosine_similarity([check_image], [data[2]])[0][0]

    if cosine_similarity_value > threshold:
        return True
    return False
