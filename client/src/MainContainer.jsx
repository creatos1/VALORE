// Componentes
import { SidebarNavigationComponent } from "./components/layout/SidebarNavigationComponent";
import { AppRouter } from "../router/AppRouter";
// Librerias
import { useLocation } from "react-router-dom";

export const MainContainer = () => {
  // Hooks
  const location = useLocation();
  // Si el usuario se encuentra en la ruta /login la barra de navegación no se muestra
  const mostrarSidebar = location.pathname !== "/login";

  return (
    <>
      {mostrarSidebar && (
        <SidebarNavigationComponent className="SidebarNavigationComponent" />
      )}
      <div className={!mostrarSidebar ? 'login' : 'main'} >
        <AppRouter/>
      </div>
      {/** fin de main */}
    </>
  );
};
