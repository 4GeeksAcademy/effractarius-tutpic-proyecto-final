from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Receta, User
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

recetas = Blueprint('recetas', __name__)

jwt = JWTManager()

bcrypt = Bcrypt()

@recetas.route('/test', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message":"esto es recetas/test"
    }
    users = User.query.all()
    serialized = list(map(lambda x: x.serialize(),users))

    return jsonify(serialized), 200

@recetas.route('/lista', methods=['GET'])
def get_lista_recetas():
    recetas = Receta.query.all()
    serialized = list(map(lambda x: x.serialize(),recetas))

    return jsonify({"msg":"lista de recetas recuperada con éxito","recetas":serialized}),200

@recetas.route('/<int:receta_id>', methods=['GET'])
def get_receta_by_id(receta_id):
    receta = Receta.query.get(receta_id)

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    serialized = receta.serialize()
    
    return jsonify({"msg":"Receta encontrada con éxito","receta":serialized}),200

@recetas.route('/crear', methods=['POST'])
def crear_receta():

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    name = data.get("name")
    date = datetime.datetime.now()
    descripcion = data.get("descripcion")
    ingredientes = data.get("ingredientes")
    instrucciones = data.get("instrucciones")
    foto_url = data.get("foto_url")
    user_id = data.get("user_id")


    if not(name and descripcion and ingredientes and instrucciones and user_id):
        return jsonify({"msg":"No se recivieron los datos obligatorios"}),400
    
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg":"No se encontro user con ese id"}),404
    

    
    nueva_receta = Receta(
        name=name,
        date=date,
        descripcion = descripcion,
        ingredientes = ingredientes,
        instrucciones = instrucciones,
        foto_url = foto_url,
        autor_id = user_id
    )

    db.session.add(nueva_receta)
    db.session.commit()

    return jsonify({"msg":"Receta guardada con éxito","receta":nueva_receta.serialize()}),201


@recetas.route('/<int:receta_id>', methods=['DELETE'])
def eliminar_receta(receta_id):

    receta = Receta.query.get(receta_id)

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    db.session.delete(receta)
    db.session.commit()

    return jsonify({}),204

@recetas.route('/<int:receta_id>', methods=['PUT'])
def modificar_receta(receta_id):

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    receta_og = Receta.query.get(receta_id)

    if not receta_og:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    name = data.get("name")
    date = datetime.datetime.now()
    descripcion = data.get("descripcion")
    ingredientes = data.get("ingredientes")
    instrucciones = data.get("instrucciones")
    foto_url = data.get("foto_url")

    if not(name or descripcion or ingredientes or instrucciones or foto_url):
        return jsonify({"msg":"No se hicieron modificaciones"}),400

    if name:
        receta_og.name = name
    if descripcion:
        receta_og.descripcion = descripcion
    if ingredientes:
        receta_og.ingredientes = ingredientes
    if instrucciones:
        receta_og.instrucciones = instrucciones
    if foto_url:
        receta_og.foto_url = foto_url
    receta_og.date = date

    db.session.commit()

    return jsonify({"msg":"Receta modificada con éxito","receta":receta_og.serialize()}),200