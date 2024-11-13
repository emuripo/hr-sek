import React, { useState, useContext } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../styles/Login.css';
import logo from '../../assets/imagenes/imagen_linea_tiempo-1.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    setIsLoading(true);

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
        handleLogin();
        navigate('/');
      } else {
        setErrorMessage('Usuario o contraseña inválidos');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setErrorMessage('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MDBContainer className="login-container d-flex align-items-center justify-content-center">
      <MDBRow className="login-box">
        <MDBCol>
          <div className="d-flex flex-column align-items-center">
            <div className="text-center">
              <img
                src={logo}
                style={{ width: '150px' }}
                alt="logo"
              />
              <h4 className="mt-3 mb-4 pb-1">Colegio Internacional SEK Costa Rica</h4>
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
              disabled={isLoading}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Contraseña"
              id="form2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <MDBBtn
              className="mb-4 w-100"
              style={{ backgroundColor: '#f0af00', color: '#fff' }}
              onClick={handleLoginClick}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </MDBBtn>

            <a className="text-muted" href="#!">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
