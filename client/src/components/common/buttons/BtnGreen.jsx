import { NavLink } from "react-router-dom"

export const BtnGreen = ({direccion, texto}) => {
    return (
      <>
              <NavLink to={direccion} className="btn-green"> {texto} </NavLink>
      </>
    );
}