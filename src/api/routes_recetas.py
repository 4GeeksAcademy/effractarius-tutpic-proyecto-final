from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Receta, User, favoritos, TagList
import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from sqlalchemy import insert, delete

recetas = Blueprint('recetas', __name__)
CORS(recetas)

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
@jwt_required()
def crear_receta():

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    name = data.get("name")
    date = datetime.datetime.now().strftime("%c")
    descripcion = data.get("descripcion")
    ingredientes = data.get("ingredientes")
    instrucciones = data.get("instrucciones")
    foto_url = data.get("foto_url")
    user_id = get_jwt_identity()


    if not(name and descripcion and ingredientes and instrucciones):
        return jsonify({"msg":"No se recivieron los datos obligatorios"}),400
    
    

    
    nueva_receta = Receta(
        name=name,
        date=date,
        descripcion = descripcion,
        ingredientes = ingredientes,
        instrucciones = instrucciones,
        foto_url = foto_url,
        autor_id = int(user_id)
    )

    db.session.add(nueva_receta)
    db.session.commit()

    return jsonify({"msg":"Receta guardada con éxito","receta":nueva_receta.serialize()}),201


@recetas.route('/<int:receta_id>', methods=['DELETE'])
@jwt_required()
def eliminar_receta(receta_id):

    receta = Receta.query.get(receta_id)

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    if receta.autor.id != int(get_jwt_identity()):
        return jsonify({"msg":"Esta receta no pertenece a este user"}),404
    
    taglist_id = receta.tags.id
    taglist = TagList.query.get(taglist_id)
    
    db.session.delete(taglist)
    db.session.delete(receta)
    db.session.commit()

    return jsonify({}),204

@recetas.route('/<int:receta_id>', methods=['PUT'])
@jwt_required()
def modificar_receta(receta_id):

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    receta_og = Receta.query.get(receta_id)

    if receta_og.autor.id != int(get_jwt_identity()):
        return jsonify({"msg":"Esta receta no pertenece a este user"}),404

    if not receta_og:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    name = data.get("name")
    date = datetime.datetime.now().strftime("%c")
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

@recetas.route('/verificar/<int:receta_id>', methods=['GET'])
@jwt_required()
def verificar_autor(receta_id):

    user = int(get_jwt_identity())
    receta = Receta.query.get(receta_id)

    if user == receta.autor.id:
        return jsonify({"msg":"Este usuario es dueño de la receta","autor":True}),200
    else:
        return jsonify({"msg":"Este usuario no es dueño de la receta","autor":False}),200
    
@recetas.route('/favorito/<int:receta_id>', methods=['POST'])
@jwt_required()
def crear_favorito(receta_id):

    receta = Receta.query.get(receta_id)
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not (user and receta):
        return jsonify({"msg":"receta o user no valido"}),404
    
    if receta.autor_id == user_id:
        return jsonify({"msg":"No se puede hacer favorito una receta propia"}),400
    
    new_table = insert(favoritos).values(user_id=user_id, receta_id=receta_id)

    db.session.execute(new_table)
    db.session.commit()

    return jsonify({"msg":"favorito añadido con exito"})