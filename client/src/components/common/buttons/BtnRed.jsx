import { NavLink } from "react-router-dom"

export const BtnRed = ({direccion, texto}) => {
    return (
      <>
              <NavLink to={direccion} className="btn-red"> {texto} </NavLink>
      </>
    );
}