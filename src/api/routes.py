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

@api.route('/create_user', methods=['POST'])
def create_user():

    #recuperar data entrante del json
    data = request.get_json()
    
    #verificar si tiene informacion la data
    if not data:
        return jsonify({"msg": "No mandaste data, presta atencion"}), 400
    
    #recuperar la variable
    name = data.get("name")
    email = data.get("email")
    password = data.get("password") 
    is_active = data.get("is_active", True)

    #verificar si las variables tienen contenido
    if not name or not email or not password:
        return jsonify({"msg": "Faltan datos importantes"}), 400
    
    #confirmar si este usuario existe en la base de datos buscando por email
    existing_user = User.query.filter_by(email=email).first()
        
    #si existe retornar un error y si no continuar con la creacion
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400
    
    #hashear la contraseña
    passhash = bcrypt.generate_password_hash(password).decode('utf-8')

    #crear el usuario
    new_user = User(
        username=name,
        email=email,
        password=passhash, 
        is_active=is_active,
        is_admin=False,
        is_premium=False
        )

    #anexar el usuario a la base de datos
    db.session.add(new_user)

    #comitiar la sesion
    db.session.commit()

    #retornar una respuesta de exito con el usuario creado
    return jsonify({"msg": "Usuario creado exitosamente", "nuevo_usuario": new_user.serialize()}), 201