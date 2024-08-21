import { NavLink } from "react-router-dom"


export const BtnYellowIcon = ({direccion, texto, icon}) => {
    return (
      <>
              <NavLink to={direccion} className="btn-yellow-icon"> 
                  <span className="btn-icon">{icon}</span> <span className="texto">{texto} </span> 
              </NavLink>
      </>
    );
}