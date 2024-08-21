import { NavLink } from "react-router-dom"

export const BtnGreenIcon = ({direccion, texto, icon}) => {
    return (
        <>
            <NavLink to={direccion} className="btn-green-icon">
                <span className="btn-icon">{icon}</span> <span className="texto">{texto} </span>
            </NavLink>
        </>
    );
}