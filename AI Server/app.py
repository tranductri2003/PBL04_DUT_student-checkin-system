from keras.models import load_model
from keras.preprocessing import image
from keras.applications.inception_resnet_v2 import preprocess_input
import numpy as np

# Load pre-trained FaceNet model
model = load_model('facenet_keras.h5')

# Load and preprocess images
img1 = image.load_img('AI Server\\uploads\\anh_the.jpg', target_size=(160, 160))
img2 = image.load_img('AI Server\\uploads\\ava.png', target_size=(160, 160))
img1 = image.img_to_array(img1)
img2 = image.img_to_array(img2)
img1 = np.expand_dims(img1, axis=0)
img2 = np.expand_dims(img2, axis=0)
img1 = preprocess_input(img1)
img2 = preprocess_input(img2)

# Get embeddings for images
embeddings1 = model.predict(img1)
embeddings2 = model.predict(img2)

# Calculate Euclidean distance between embeddings
distance = np.linalg.norm(embeddings1 - embeddings2)

# Set a threshold for face similarity
threshold = 0.6

# Compare the distance to the threshold
if distance < threshold:
    print("The images belong to the same person.")
else:
    print("The images belong to different people.")
