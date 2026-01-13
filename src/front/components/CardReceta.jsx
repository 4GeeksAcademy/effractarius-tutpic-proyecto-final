import { useNavigate } from "react-router-dom"
import logoImageUrl from "../assets/img/11.png";


const CardReceta = ({desc,name,img,receta_id}) => {

    const navigate = useNavigate()

    return(
        <div className="card" style={{width:"16vw",cursor:"pointer"}} onClick={()=>{navigate(`/receta/${receta_id}`)}}>
            {img && <img src={img} alt="imagen de la receta" style={{width:"16vw", height:"16vw", imageResolution:"16:9"}} className="card-img-top" />}
            {!img && <img src={logoImageUrl} alt="imagen de la receta" style={{width:"16vw", height:"16vw", imageResolution:"16:9"}} className="card-img-top" />}
            <div className="card-body border bg-warning-subtle">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{desc}</p>
            </div>
        </div>
    )
}

export default CardReceta