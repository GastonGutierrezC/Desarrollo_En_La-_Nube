import React, { useState } from "react";
import { AuthController } from "../Controller/AuthController";
import "../styles/LoginView.css"; 

const LoginView: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await AuthController.loginWithEmail({ email, password });
      alert("Login exitoso!");
    } catch (error) {
      alert("Error en login con email/password");
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await AuthController.loginWithGoogle();
      alert("Login con Google exitoso!");
    } catch (error) {
      alert("Error en login con Google");
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await AuthController.loginWithFacebook();
      alert("Login con Facebook exitoso!");
    } catch (error) {
      alert("Error en login con Facebook");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailLogin}>Iniciar sesión</button>
      <hr />
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
      <button onClick={handleFacebookLogin}>Iniciar sesión con Facebook</button>
    </div>
  );
};

export default LoginView;
