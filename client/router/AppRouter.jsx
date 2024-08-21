import { UsuariosSectionMotion } from "../src/pages/directorPages/usuariosSection";
import { GestionMotion } from "../src/pages/adminPages/gestionSection/gestion";
import { VentasSectionMotion } from "../src/pages/MDPages/ventasSection";
import { CatalogoSectionMotion } from "../src/pages/MDPages/catalogoSection";
import { Login, LoginMotion } from "../src/pages/publicPages/login";

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PerfilSectionMotion } from "../src/pages/MDPages/PerfilSection";
import { GestionPromocionesMotion } from "../src/pages/adminPages/gestionSection/gestionPromociones";
import { GestionVentasMotion } from "../src/pages/adminPages/gestionSection/gestionVentas";
import { GestionAfiliadosMotion } from "../src/pages/adminPages/gestionSection/gestionAfiliados";

import RequireAuth from "../src/features/auth/RequireAuth";
import Unauthorized from "../src/features/auth/Unauthorized";

export const AppRouter = () => {
  const location = useLocation();

  const ROLES = {
    'admin': 'admin',
    'director': 'director',
    'marketing': 'marketing'
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/usuarios" exact element={<UsuariosSectionMotion className = "usuariosSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/gestion" element={<GestionMotion className = "gestionSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/promociones" element={<GestionPromocionesMotion className = "gestionSection" />} />
          </Route>
          
          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/gestionVetas" element={<GestionVentasMotion className = "gestionSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/afiliados" element={<GestionAfiliadosMotion className = "gestionSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/ventas" element={<VentasSectionMotion className = "ventasSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/catalogo" element={<CatalogoSectionMotion className = "catalogoSection" />} />
          </Route>

          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/perfil" element={<PerfilSectionMotion className = "perfilSection" />} />
          </Route>
          
          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route element={<RequireAuth  allowedRoles={[ROLES.admin, ROLES.director]}/>}>
            <Route path="/" element={<PerfilSectionMotion className = "perfilSection" />} />
          </Route>
        </Routes>
      </AnimatePresence>
      
    </>
  );
};
