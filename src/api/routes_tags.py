from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Receta, User, TagList
import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

tags = Blueprint('tags', __name__)

jwt = JWTManager()

bcrypt = Bcrypt()

@tags.route('/<int:tags_id>', methods=['GET'])
def get_tags_by_id(tags_id):
    tags = TagList.query.get(tags_id)

    if not tags:
        return jsonify({"msg":"No se encontro taglist con ese id"}),404
    
    serialized = tags.serialize()
    
    return jsonify({"msg":"Tags encontradas con éxito","tags":serialized}),200

@tags.route('/crear', methods=['POST'])
def crear_taglist():

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    receta_id = data.get("receta_id")
    vegan = data.get("vegan")
    picante = data.get("picante")
    keto = data.get("keto")
    
    if not(receta_id and vegan!=None and picante!=None and keto!=None):
        return jsonify({"msg":"No se recivieron los datos obligatorios"}),400
    
    receta = Receta.query.get(receta_id)

    if receta.tags:
        return jsonify({"msg":"Ya existe una taglist para esta receta"}),400

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    nueva_taglist = TagList(
        receta_id=receta_id,
        vegan=vegan,
        picante=picante,
        keto=keto
    )

    db.session.add(nueva_taglist)
    db.session.commit()

    return jsonify({"msg":"Tags añadidos con éxito","tags":nueva_taglist.serialize()}),201

@tags.route('/<int:receta_id>', methods=['DELETE'])
def borrar_taglist(receta_id):

    receta = Receta.query.get(receta_id)

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    taglist_id = receta.tags.id

    taglist = TagList.query.get(taglist_id)

    if not taglist:
        return jsonify({"msg":"No se encontraron tags en esta receta"}),404
    
    db.session.delete(taglist)
    db.session.commit()

    return jsonify({}) ,204

@tags.route('/modificar', methods=['PUT'])
def modificar_taglist():

    data = request.get_json()

    if not data:
        return jsonify({"msg":"No se recivieron datos"}),400
    
    receta_id = data.get("receta_id")
    vegan = data.get("vegan")
    picante = data.get("picante")
    keto = data.get("keto")

    if not receta_id:
        return jsonify({"msg":"Debe especificar el id de la receta"}),400
    
    receta = Receta.query.get(receta_id)

    if not receta:
        return jsonify({"msg":"No se encontro receta con ese id"}),404
    
    if not receta.tags:
        return jsonify({"msg":"No se encontraron tags en esta receta"}),404
    
    if not(vegan!=None or picante!=None or keto!=None) or (vegan == receta.tags.vegan and picante == receta.tags.picante and keto == receta.tags.keto):
        return jsonify({"msg":"Debe haber al menos una modificación"}),400

    
    
    taglist_id = receta.tags.id

    taglist = TagList.query.get(taglist_id)

    if vegan!=None:
        taglist.vegan = vegan

    if picante!=None:
        taglist.picante = picante

    if keto!=None:
        taglist.keto = keto 

    db.session.commit()   

    return jsonify({"msg":"Tags modificados con éxito","tags":taglist.serialize()}),200