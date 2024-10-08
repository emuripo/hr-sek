import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import '../styles/Login.css'; // Asegúrate de que esta ruta sea correcta
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Para la redirección después del login

  const handleLogin = async () => {
    try {
      console.log("Iniciando el proceso de login...");

      const response = await fetch('http://localhost:8087/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, // Cambiado de 'email' a 'username'
          password,
        }),
      });

      console.log("Respuesta recibida del servidor:", response);

      const data = await response.json();
      console.log("Datos recibidos:", data);

      if (response.ok) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        console.log("Token guardado en localStorage:", data.token);
        
        // Redirigir a la página principal/dashboard
        navigate('/empleados');
      } else {
        // Manejar el error
        setErrorMessage('Invalid username or password');
        console.log("Error de autenticación:", response.status);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setErrorMessage('Error connecting to the server.');
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img 
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{ width: '185px' }} 
                alt="logo" 
              />
              <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
            </div>

            <p>Please login to your account</p>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <MDBInput 
              wrapperClass='mb-4' 
              label='Username'  // Cambiado de 'Email address' a 'Username'
              id='form1' 
              type='text' 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <MDBInput 
              wrapperClass='mb-4' 
              label='Password' 
              id='form2' 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleLogin}>Sign in</MDBBtn>
              <a className="text-muted" href="#!">Forgot password?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className='mx-2' color='danger'>
                Sign Up
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
