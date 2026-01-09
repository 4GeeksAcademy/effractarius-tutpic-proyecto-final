"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt = Bcrypt()
jwt = JWTManager()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hola!! Soy un mensaje del backend, Revisa la pestaña de red en el inspector de Google y verás la solicitud GET"
    }

    return jsonify(response_body), 200

# Recuperar Data de Usuario


@api.route('/create_user', methods=['POST'])
def create_user():

    # Hashear la contraseña
    passhash = bcrypt.generate_password_hash(
        request.json['password']).decode('utf-8')

    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        is_admin = data.get("is_admin")
        is_premium = data.get("is_premium")
        is_active = data.get("is_active")

# Verificar que los campos obligatorios no estén vacíos
        if not email or not password:
            return jsonify({"error": "Email & password son necesarios"}), 400

# Verificar que el usuario no exista
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "El usuario ya existe"}), 409

# Crear nuevo usuario
        user = User(username=username, email=email, password=passhash,
                    is_admin=is_admin, is_premium=is_premium, is_active=is_active)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User created successfully", "nuevo_usuario": user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    @api.route('/login', methods=['[POST'])
    def login():

        # Obtener datos del request
        data = request.get_json()
        if not data:
            return jsonify({"error": "Falta data"}), 400
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"message": "No Data"}), 400

# Verificar que el usuario exista
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        hashed_password = user.password
        password_match = bcrypt.check_password_hash(hashed_password, password)
        if not password_match:
            return jsonify({"error": "Contraseña incorrecta"}), 401
        expires = timedelta(minutes=30)

    User_id = user.id
    access_token = create_access_token(
        identity=str(User_id), expires_delta=expires)
    return jsonify({"access_token": access_token}), 200

@api.route('/restringido')
@jwt_required()
def restringido():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"error": "Usuario no autenticado"}), 401

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"user": user.serialize()}), 200
