from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Time, Table, Column, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()

favoritos = Table(
    "favoritos",
    db.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("receta_id", ForeignKey("recetas.id"), primary_key=True),
)


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    is_premium: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    favorites: Mapped[List["Receta"]] = relationship(
        secondary=favoritos, back_populates="favorites")
    
    recetas: Mapped[List["Receta"]] = relationship(back_populates="autor")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "is_premium": self.is_premium,
            "is_admin": self.is_admin
            # do not serialize the password, its a security breach
        }


class Receta(db.Model):
    __tablename__ = "recetas"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    date: Mapped[object] = mapped_column(Time(), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(), nullable=False)
    ingredientes: Mapped[str] = mapped_column(String(), nullable=False)
    instrucciones: Mapped[str] = mapped_column(String(), nullable=False)
    foto_url: Mapped[str] = mapped_column(String())

    favorites: Mapped[List["User"]] = relationship(
        secondary=favoritos, back_populates="favorites")
    
    autor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    autor: Mapped["User"] = relationship(back_populates="recetas")

    tags: Mapped["TagList"] = relationship(back_populates="receta")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "date": str(self.date),
            "descripcion": self.descripcion,
            "ingredientes": self.ingredientes,
            "instrucciones": self.instrucciones,
            "foto_url": self.foto_url,
            "autor": self.autor.serialize(),
            "tags": self.tags.serialize()
        }

class TagList(db.Model):
    __tablename__="taglists"

    id: Mapped[int] = mapped_column(primary_key=True)

    receta_id: Mapped[int] = mapped_column(ForeignKey("recetas.id"))
    receta: Mapped["Receta"] = relationship(back_populates="tags", single_parent=True)

    vegan: Mapped[bool] = mapped_column(Boolean(),nullable=False)
    picante: Mapped[bool] = mapped_column(Boolean(),nullable=False)
    keto: Mapped[bool] = mapped_column(Boolean(),nullable=False)

    __table_args__ = (UniqueConstraint("receta_id"),)

    def serialize(self):
        return {
            "id":self.id,
            "receta_id": self.receta_id,
            "vegan": self.vegan,
            "picante": self.picante,
            "keto": self.keto,
        }