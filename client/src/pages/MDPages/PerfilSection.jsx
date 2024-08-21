import React, { useState } from "react";

// Funciones
import { MotionHoc } from "../../features/MotionHoc";

// Componentes
import { Title } from "../../components/common/Title";
import { BtnBlue } from "../../components/common/buttons/BtnBlue";

// Img
import user from "../../assets/img/user.png";       

export const PerfilSection = () => {
  // Hooks
  const [profileClick, setProfileClick] = useState(false);
  const handleProfileClick = () => setProfileClick(!profileClick);

  return (
    <>
      <Title text="Hola Juan Pancho" />

      <div className="setting-column">
        <div className="settings-header">

          <h3>Configuración de Usuario</h3>

          <div className="perfil-section">
            {/* Primera columna izquierda */}
            <div className="info-column">
              <BtnBlue direccion="/login" texto={"Cambiar Cuenta"} />
              <section className="user-info">
                <img
                  src={user}
                  alt="Profile"
                  className="img-profile"
                  onClick={handleProfileClick}
                />

                <div className="info-text">
                  <span className="user-name">Juan Pancho</span>
                  <span className="user-rol">Director</span>
                </div>
              </section>
            </div>
          </div>
        </div>

          <div className="settings-box">
            <h4 className="settings-title">Cambiar Contraseña</h4>
            <span>Un director debera aprobar el cambio de contraseña</span>

            <form action="" method="POST">
              <fieldset className="settings-fieldset">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="input"
                />
                <input
                  type="password"
                  placeholder="Nueva Contraseña"
                  className="input"
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  className="input"
                />

                <button type="submit" className="btn-green btn-submit">
                  Cambiar
                </button>
              </fieldset>
            </form>
          </div>
          <div className="settings-box">
            <h4 className="settings-title">Cambiar nombre de usuario</h4>
            <form action="/" method="post">
              <fieldset className="settings-fieldset">
                <input type="text" placeholder="Usuario" className="input" />
                <section className="section-codigo">
                  <button className="btn-blue">Solicitar</button>
                  <input
                    type="text"
                    placeholder="Código de verificación"
                    className="input"
                  />
                </section>

                <button type="submit" className="btn-green btn-submit">
                  Cambiar
                </button>
              </fieldset>
            </form>
          </div>
        </div>
    </>
  );
};

export const PerfilSectionMotion = MotionHoc(PerfilSection, "perfilSection" );
