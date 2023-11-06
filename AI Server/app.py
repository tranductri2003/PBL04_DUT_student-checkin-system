from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
import face_recognition
import cv2
import numpy as np

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/compare_images', methods=['POST'])
def compare_images():
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({'error': 'Missing image(s)'}), 400

    image1 = request.files['image1']
    image2 = request.files['image2']

    if image1.filename == '' or image2.filename == '':
        return jsonify({'error': 'Empty file name(s)'}), 400

    if image1 and image2:
        filename1 = secure_filename(image1.filename)
        filename2 = secure_filename(image2.filename)
        image1_path = os.path.join(app.config['UPLOAD_FOLDER'], filename1)
        image2_path = os.path.join(app.config['UPLOAD_FOLDER'], filename2)
        image1.save(image1_path)
        image2.save(image2_path)

        # Read and encode the faces in both images
        image1 = cv2.imread(image1_path)
        rgb1 = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)
        boxes1 = face_recognition.face_locations(rgb1)
        encodings1 = face_recognition.face_encodings(rgb1, boxes1)

        image2 = cv2.imread(image2_path)
        rgb2 = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
        boxes2 = face_recognition.face_locations(rgb2)
        encodings2 = face_recognition.face_encodings(rgb2, boxes2)

        if not encodings1 or not encodings2:
            return jsonify({'error': 'No faces found in one or both images'}), 400

        # Compare the face encodings
        similarity_scores = []
        for encoding1 in encodings1:
            for encoding2 in encodings2:
                similarity_score = face_recognition.face_distance([encoding1], encoding2)
                similarity_scores.append(similarity_score[0])

        # Calculate the average similarity score
        average_similarity_score = np.mean(similarity_scores)
        print(average_similarity_score)
        return jsonify({'average_similarity_score': average_similarity_score})

if __name__ == '__main__':
    app.run(debug=True)
