import { NavLink } from "react-router-dom"

export const BtnBlue = ({direccion, texto}) => {
    return (
      <>
          <NavLink to={direccion} className="btn-blue">{texto}</NavLink>
      </>
    );
  }