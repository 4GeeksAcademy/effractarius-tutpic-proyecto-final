"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt = Bcrypt()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


passhash = bcrypt.generate_password_hash("password").decode('utf-8')


@api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

# Recuperar la Variable

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_premium = data.get('is_premium', False)
    is_admin = data.get('is_admin', False)

# Verificar que vengan los datos obligatorios

    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

# Verificar que no exista un usuario con el mismo username o email

    existing_user = User.query.filter(
        (User.email == email) | (User.username == username)
    ).first()

# Si existe, retornar un error

    if existing_user:
        return jsonify({"message": "User with this email or username already exists"}), 409

# Crear el usuario

    new_user = User(
        username=username,
        email=email,
        password=password,
        is_admin=is_admin,
        is_premium=is_premium,
        is_active=True
    )

# Guardar el usuario en la base de datos

    db.session.add(new_user)

# Commitiar los cambios

    db.session.commit()

# Retornar el usuario creado

    return jsonify({"message": "User created successfully", "user": new_user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    email = data.get("email")
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"message": "Missing required fields"}), 400

# Buscar el usuario por email o username

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful", "user": user.serialize()}), 200
