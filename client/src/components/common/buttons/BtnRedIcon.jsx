
import { NavLink } from "react-router-dom"

export const BtnRedIcon = ({direccion, texto, icon}) => {
    return (
      <>
              <NavLink to={direccion} className="btn-red-icon">
                  <span className="btn-icon">{icon}</span> <span className="texto">{texto} </span>
              </NavLink>
      </>
    );
}