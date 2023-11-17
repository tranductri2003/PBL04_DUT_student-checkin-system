from flask import Blueprint
from flask import request, jsonify
import jwt

from actions.face_recognization import create_features, face_recognize
from settings import JWT_SECRET_KEY

api_v1 = Blueprint('api_v1', __name__)

@api_v1.route('/', methods=["GET"])
def home():
    return jsonify({"msg":"Hello"}), 200

@api_v1.route('/image-features', methods=["POST"])
def add_image_feature():
    decoded_token = jwt.decode(jwt=request.headers.get('Authorization').split(' ')[1], key=JWT_SECRET_KEY, algorithms=['HS256'])
    if decoded_token.get('role', None) != 'A':
        return jsonify({"msg": "Unauthorized"}), 401
    img = request.files['image']
    staff_id = decoded_token.get('staff_id')
    try:
        create_features(staff_id=staff_id, image=img)
        return jsonify({"msg": "Create successfully!"}), 200
    except:
        return jsonify({"msg": "Create failed!"}), 400

@api_v1.route('/face-recognization', methods=["POST"])
def face_recognization():
    decoded_token = jwt.decode(jwt=request.headers.get('Authorization').split(' ')[1], key=JWT_SECRET_KEY, algorithms=['HS256'])
    if decoded_token.get('role', None) == None:
        return jsonify({"msg": "Unauthorized"}), 401
    staff_id = decoded_token.get('staff_id')
    image = request.files['image']
    result = face_recognize(staff_id=staff_id, image=image)
    return jsonify({"data": result}), 200