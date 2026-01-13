import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const EditarReceta = () => {

    const cloud_name = "dyy0t3hgk"
    const preset_name = "tutpic"

    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const {receta_id} = useParams()

    const [inst, setInst] = useState("")
    const [name, setName] = useState("")
    const [ingr, setIngr] = useState("")
    const [desc, setDesc] = useState("")
    const [tags, setTags] = useState({picante:false,keto:false,vegan:false})
    const [token, setToken] = useState({})
    const [event, setEvent] = useState({})

    const submitReceta = async () => {
        try {

            if (!(inst && name && ingr && desc)) {
                alert("Faltan campos requeridos")
                return
            }

            let img = ""

            if(Object.hasOwn(event, "target")){
                img = await subirImagen()
            }

            var payload = {
                name: name,
                descripcion: desc,
                ingredientes: ingr,
                instrucciones: inst,
                foto_url: img
            }

            var response = await fetch(`${backendUrl}recetas/${receta_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "PUT",
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error("fallo en la edicion de receta")
            }

            let data = await response.json()
            console.log("data:",data)

            modTags()
            .then(navigate(`/receta/${receta_id}`))
        } catch (error) {
            console.error(error)
        }
    }

    const modTags = async () =>{
        try {
            var payload = {
                receta_id:receta_id,
                ...tags
            }
            var response = await fetch(`${backendUrl}tags/modificar`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "PUT",
                body: JSON.stringify(payload)
            })

            if(!response.ok){
                throw new Error("error edicion de tags")
            }

            var data = await response.json()
            console.log("data:",data)
            navigate(`/receta/${receta_id}`)

        } catch (error) {
            console.error(error)
        }
    }

    const subirImagen = async () =>{
        if(!event){
            return
        }

        const files = event.target.files
        var data = new FormData()
        data.append("file", files[0])
        data.append('upload_preset',preset_name)

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();   
              
            return file.secure_url     

        } catch (error) {
            console.error(error)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        submitReceta()
    }

    useEffect(() => {
        setToken(localStorage.getItem("access_token"))
        if (!token) {
            navigate("/login")
        }
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
                setIngr(data.receta.ingredientes)
                setTags(data.receta.tags)



            } catch (error) {
                console.error(error)
            }
        }

        getReceta()
    }, [])

    return (
        <div className="d-flex justify-content-center flex-column align-items-center bg-warning-subtle bg-gradient">
            <h1>Crear receta:</h1>
            <form onSubmit={submitHandler} className="w-75 d-flex align-items-center flex-column">
                <div className="border border-secondary p-2 w-100 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                    <label className="fw-bold " htmlFor="name">Nombre de la receta:</label>
                    <input className="w-50" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="border border-secondary p-2 w-100 text-start align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                    <label className="fw-bold " htmlFor="desc">Descripción de la receta:</label>
                    <textarea style={{width:"75%",height:"20vh"}} id="desc" type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="border border-secondary p-2 w-100 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                    <label className="fw-bold " htmlFor="ingr">Ingredientes de la receta</label>
                    <textarea style={{width:"75%",height:"20vh"}} id="ingr" type="text" value={ingr} onChange={(e) => setIngr(e.target.value)} />
                </div>
                <div className="border border-secondary p-2 w-100 align-items-center flex-column d-flex m-2 bg-warning bg-gradient">
                    <label className="fw-bold " htmlFor="inst">Instrucciones de la receta:</label>
                    <textarea style={{width:"75%",height:"20vh"}} id="inst" type="text" value={inst} onChange={(e) => setInst(e.target.value)} />
                </div>
                <div className="border border-secondary p-2 w-50 align-items-start flex-column d-flex m-2 bg-warning bg-gradient">
                    <h2>Categorias</h2>
                    <div className="d-flex flex-row-reverse">
                        <label htmlFor="picante">Marca si la receta es picante</label>
                        <input id="picante" type="checkbox" className="mx-2" onChange={(e)=>setTags(prev=>{return {...prev,picante:e.target.checked}})}/>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <label htmlFor="keto">Marca si la receta es keto</label>
                        <input id="keto" type="checkbox" className="mx-2" onChange={(e)=>setTags(prev=>{return {...prev,keto:e.target.checked}})}/>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <label htmlFor="vegan">Marca si la receta es picante</label>
                        <input id="vegan" type="checkbox" className="mx-2" onChange={(e)=>setTags(prev=>{return {...prev,vegan:e.target.checked}})}/>
                    </div>
                </div>
                <div className="border border-secondary p-2 w-50 align-items-start flex-column d-flex m-2 bg-warning bg-gradient">
                    <label htmlFor="img">Subir imagen de la receta (png,jpeg)</label>
                    <input id="img" type="file" accept="image/png, image/jpg" onChange={(e)=>setEvent(e)}/>
                </div>
                <button type="submit" className="btn btn-warning m-2">Crear receta</button>
            </form>
        </div>
    )
}

export default EditarReceta