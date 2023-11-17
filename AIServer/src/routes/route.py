from flask import Blueprint
from flask import request, jsonify


from actions.face_recognization import create_features, face_recognize

api_v1 = Blueprint('api_v1', __name__)

@api_v1.route('/', methods=["GET"])
def home():
    return jsonify({"msg":"Hello"}), 200

@api_v1.route('/create-image-features', methods=["POST"])
def add_image_feature():
    img = request.files['image']
    staff_id = request.form.get('staff_id')
    create_features(staff_id=staff_id, image=img)
    return jsonify({"msg": "Create successfully!"}), 200

@api_v1.route('/face-recognization', methods=["POST"])
def face_recognization():
    staff_id = request.form.get('staff_id')
    image = request.files['image']
    result = face_recognize(staff_id=staff_id, image=image)
    return jsonify({"data": result}), 200