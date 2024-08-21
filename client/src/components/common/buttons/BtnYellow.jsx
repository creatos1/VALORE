import { NavLink } from "react-router-dom"

export const BtnYellow = ({direccion, texto}) => {
    return (
      <>
              <NavLink to={direccion} className="btn-yellow"> {texto} </NavLink>
      </>
    );
}