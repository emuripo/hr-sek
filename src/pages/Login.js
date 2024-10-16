import React, { useState, useContext } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Login.css';
import logo from '../assets/imagenes/imagen_linea_tiempo-1.jpg';  // Importar la imagen del logo

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:8087/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        handleLogin();       // Actualiza el estado de autenticación
        navigate('/');       // Redirige al dashboard
      } else {
        setErrorMessage('Usuario o contraseña inválidos');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setErrorMessage('Error al conectar con el servidor.');
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src={logo}   // Cambiar la ruta de la imagen al logo importado
                style={{ width: '185px' }}
                alt="logo"
              />
              <br></br>
              <h4 className="mt-1 mb-5 pb-1">Colegio Internacional SEK Costa Rica</h4>
            </div>

            <p>Por favor, inicia sesión en tu cuenta</p>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <MDBInput
              wrapperClass="mb-4"
              label="Usuario"
              id="form1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Contraseña"
              id="form2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100"
                style={{ backgroundColor: '#f0af00', color: '#fff' }}  
                onClick={handleLoginClick}
              >
                Iniciar sesión
              </MDBBtn>
              <a className="text-muted" href="#!">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">¿No tienes una cuenta?</p>
              <MDBBtn outline className='mx-2' style={{ borderColor: '#f0af00', color: '#f0af00' }}>
                Registrarse
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
