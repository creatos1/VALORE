import { NavLink } from "react-router-dom"

export const BtnBlueIcon = ({direccion, texto, icon}) => {
    return (
      <>
          <NavLink to={direccion} className="btn-blue-icon">
             <span className="btn-icon">{icon}</span> <span className="texto">{texto}</span>
          </NavLink>
      </>
    );
}