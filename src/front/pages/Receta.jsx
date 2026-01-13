import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


const Receta = () => {

    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { receta_id } = useParams()

    const [inst, setInst] = useState("")
    const [name, setName] = useState("")
    const [ingr, setIngr] = useState("")
    const [desc, setDesc] = useState("")
    const [date, setDate] = useState("")
    const [img, setImg] = useState("")
    const [tags, setTags] = useState({})
    const [auth, setAuth] = useState({})
    const [owner, setOwner] = useState(false)


    const verificarAutor = async () => {
        if (!localStorage.getItem("access_token")) {
            setOwner(false)
            return
        }
        try {
            var response = await fetch(`${backendUrl}recetas/verificar/${receta_id}`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            })
            if (!response.ok) {
                throw new Error("fallo en verificacion de autor")
            }
            var data = await response.json()
            setOwner(data.autor)
        } catch (error) {
            console.error(error)
        }
    }

    const añadirFav = async () => {
        if (!localStorage.getItem("access_token")) {
            setOwner(false)
            return
        }
        try {
            var response = await fetch(`${backendUrl}favorito/${receta_id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            })
            if (!response.ok) {
                throw new Error("error añadir fav")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const borrarReceta = async () => {
        try {
            var response = await fetch(`${backendUrl}recetas/${receta_id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            })
            if(!response.ok){
                alert("No se pudo borrar la receta")
                throw new Error("error al borrar")
            }
            navigate("/")
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {

        const getReceta = async () => {

            try {
                let response = await fetch(`${backendUrl}/recetas/${receta_id}`)

                if (!response.ok) {
                    throw new Error("fallo fetch receta")
                }

                let data = await response.json()

                setInst(data.receta.instrucciones)
                setName(data.receta.name)
                setDesc(data.receta.descripcion)
                setDate(data.receta.date)
                setIngr(data.receta.ingredientes)
                setImg(data.receta.foto_url)
                setTags(data.receta.tags)
                setAuth(data.receta.autor)


            } catch (error) {
                console.error(error)
            }
        }

        getReceta()
            .then(verificarAutor())
    }, [])



    return (
        <div className="d-flex justify-content-center flex-column align-items-center bg-warning-subtle bg-gradient">
            <h6>Fecha de creacion: {date}</h6>
            <h1 className="text-warning fw-bold" style={{ WebkitTextStroke: "1px black" }}>{name}, por {auth.username}</h1>
            {tags.keto && <h6 className="text-warning" style={{ WebkitTextStroke: "1px black" }}>Esta receta es keto!</h6>}
            {tags.vegan && <h6 className="text-success" style={{ WebkitTextStroke: "1px black" }}>Esta receta es vegana!</h6>}
            {tags.picante && <h6 className="text-danger" style={{ WebkitTextStroke: "2px black" }}>Esta receta es picante!</h6>}
            <div className="border border-secondary p-2 w-50 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                <h4 className="fw-bold">Descripción</h4>
                <h6>{desc}</h6>
            </div>
            {img && <img className="border border-warning w-25" src={img} alt="imagen de la receta" />}
            <div className="border border-secondary p-2 w-50 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                <h4 className="fw-bold">Ingredientes:</h4>
                <h6>{ingr}</h6>
            </div>
            <div className="border border-secondary p-2 w-50 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                <h4 className="fw-bold">Instrucciones:</h4>
                <h6>{inst}</h6>
            </div>
            {owner && <div>
                <button className="btn btn-warning" onClick={() => navigate(`/receta/editar/${receta_id}`)}>Editar Receta</button>
                <button className="btn btn-danger" onClick={borrarReceta}>Borrar receta</button>
            </div>}
            {!owner && localStorage.getItem("access_token") && <button className="btn btn-warning" onClick={añadirFav}></button>}
        </div>
    )
}

export default Receta