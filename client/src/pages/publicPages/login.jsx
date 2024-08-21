import { ArrowRightIcon } from "../../components/common/icons/ArrowRightIcon"
import logoValore from "../../assets/img/logos/logoValore.png";
import { MotionHoc } from "../../features/MotionHoc";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ correo: email, password: password }).unwrap();
      console.log(userData)
      dispatch(setCredentials({ user: userData.name, token: userData.token, rol: userData.rol }));
      navigate('/usuarios');
    } catch (err) {
      console.error('Failed to log in: ', err);
    }
  };

  return (
    <>
      <div className="loginContainer glassmorphism">
          <section className="loginLogo">
            <img src={ logoValore } alt="logoValore" />
          </section>
          <section className="sectionLoginForm">
            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="loginFormInfo">
                  <input type="email" className="inputEmail input" name="email" id="loginFormEmail" placeholder="Tu Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                  <input type="password" name="password" id="loginFormPassword" placeholder="Contraseña" className="inputPassword input" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="sectionLoginButton">
                  <h3>Inicia Sesión</h3>

                  <button type="submit" className="loginButton" disabled={isLoading}> <ArrowRightIcon /> </button>
                </div>
            </form>
          </section>
          <section className="sectionLoginFooter">
              <div>
                <span>Olvide la contraseña</span>
              </div>
          </section>
      </div>
    </>
  )
}


export const LoginMotion = MotionHoc(Login);
