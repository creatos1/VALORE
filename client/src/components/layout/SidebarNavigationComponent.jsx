// librerias
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
// img
import logo from "../../assets/img/logos/logo.png";
import PowerOf from "../../assets/img/powerOf.svg";

// common icons
import { UserIcon } from "../common/icons/UserIcon";
import { BuildingIcon } from "../common/icons/BuildingIcon";
import { ShoppingBagCheckIcon } from "../common/icons/ShoppingBagCheckIcon";
import { CategoryFilledIcon } from "../common/icons/CategoryFilledIcon";
import { logOut } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";


export const SidebarNavigationComponent = () => {
  const [click, setclick] = useState(false);
  const handleClick = () => setclick(!click);

  const [profileClick, setProfileClick] = useState(false);
  const handleProfileClick = () => setProfileClick(!profileClick);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = localStorage.getItem('user')
  
  const handleLogout = async () => {
    try {
      dispatch(logOut());
      navigate("/login")
    } catch (err) {
      console.error('Failed to log out: ', err);
    }
  };

  return (
    <>
      <section className="sidebarNavigation">
        <button
          className={`buttonSidebar ${click ? "clicked" : "notClicked"}`}
          onClick={handleClick}
        >
        </button>

        <div className="seccion-nav">
          <section className="seccion-sidebar-logo">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </section>

          <nav className={`sidebar ${click ? "clicked" : "notClicked"}`}>
            <NavLink
              to="/usuarios"
              onClick={() => setclick(false)}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <div className="container-icon">
                <UserIcon />
              </div>
              <span className={`span ${click ? "clicked" : "notClicked"}`}>Empleados</span>
            </NavLink>

            <NavLink
              onClick={() => setclick(false)}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
              to="/gestion"
            >
              <div className="container-icon ">
                <BuildingIcon />
              </div>
              <span className={`span ${click ? "clicked" : "notClicked"}`}>Gestión</span>
            </NavLink>

            <NavLink
              onClick={() => setclick(false)}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
              to="/ventas"
              exact="true"
            >
              <div className="container-icon ">
                <ShoppingBagCheckIcon />
              </div>
              <span className={`span ${click ? "clicked" : "notClicked"}`}>Ventas</span>
            </NavLink>

            <NavLink
              onClick={() => setclick(false)}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
              to="/catalogo"
            >
              <div className="container-icon ">
                <CategoryFilledIcon />
              </div>
              <span className={`span ${click ? "clicked" : "notClicked"}`}>Catálogo</span>
            </NavLink>
          </nav>

          <section className={`profile ${profileClick ? "profileClicked" : "notProfileClicked"}`}>

            <img src={user} alt="Perfil" className="img-profile" onClick={handleProfileClick} />

            <div className={`opcions-profile ${profileClick ? "profileClicked" : "notProfileClicked"}`} >

              <section className="info-profile">
                <h4>{user}</h4>
                <NavLink to="/perfil">Ver perfil</NavLink>
              </section>

              <button className="powerOf" onClick={handleLogout}>
                <img src={PowerOf} alt="cerrarSesion" />
              </button>

            </div>
          </section>
        </div>
      </section>
    </>
  );
};
