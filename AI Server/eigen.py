import cv2
import numpy as np
from sklearn.decomposition import PCA
from scipy.spatial import distance

# Đọc và tiền xử lý ảnh gương mặt
def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (100, 100))  # Đảm bảo ảnh có kích thước cố định
    img = img.flatten()  # Biến đổi ảnh thành một vector 1D
    return img

# Trích xuất eigenfaces từ tập dữ liệu gương mặt
def extract_eigenfaces(data, num_components):
    pca = PCA(n_components=num_components)
    pca.fit(data)
    eigenfaces = pca.components_
    return eigenfaces

# Biểu diễn ảnh gương mặt bằng các hệ số của eigenfaces
def represent_with_eigenfaces(img, eigenfaces):
    return np.dot(eigenfaces, img)

# Tính khoảng cách cosine giữa hai vector hệ số
def cosine_distance(vector1, vector2):
    return distance.cosine(vector1, vector2)

# Đường dẫn đến hai bức ảnh cần kiểm tra
image_path1 = 'AI Server\\uploads\\anh_the.jpg'
image_path2 = 'AI Server\\uploads\\anh_test_2.jpg'

# Đọc và tiền xử lý ảnh gương mặt
image1 = preprocess_image(image_path1)
image2 = preprocess_image(image_path2)

# Trích xuất eigenfaces từ tập dữ liệu gương mặt
data = np.array([image1, image2])
n_components = min(data.shape[0], data.shape[1])  # Đảm bảo không vượt quá số lượng ảnh
eigenfaces = extract_eigenfaces(data, num_components=n_components)

# Biểu diễn ảnh gương mặt bằng các hệ số của eigenfaces
image1_coefficients = represent_with_eigenfaces(image1, eigenfaces)
image2_coefficients = represent_with_eigenfaces(image2, eigenfaces)

# Tính khoảng cách cosine giữa hai vector hệ số
cosine_dist = cosine_distance(image1_coefficients, image2_coefficients)

# Đặt ngưỡng để quyết định độ tương tự
threshold = 0.1

print("Vector distance", cosine_dist)
# Kiểm tra xem hai ảnh có cùng một người hay không
if cosine_dist < threshold:
    print("Hai ảnh thuộc về cùng một người.")
else:
    print("Hai ảnh không thuộc về cùng một người.")
