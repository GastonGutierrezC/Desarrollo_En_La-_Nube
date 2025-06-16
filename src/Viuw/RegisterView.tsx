import React, { useState } from "react";
import { AuthController } from "../Controller/AuthController";
import "../styles/RegisterView.css";

const RegisterView: React.FC = () => {
  const [birthrate, setBirthrate] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await AuthController.registerWithEmail({
        email,
        password,
        name,
        city,
        birthrate,
        cellphone,
      });
      alert("Usuario registrado!");
    } catch (error) {
      alert("Error al registrar usuario");
      console.error(error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await AuthController.registerWithGoogle();
      alert("Registro con Google exitoso!");
    } catch (error) {
      alert("Error al registrar con Google");
      console.error(error);
    }
  };

  const handleFacebookRegister = async () => {
    try {
      await AuthController.registerWithFacebook();
      alert("Registro con Facebook exitoso!");
    } catch (error) {
      alert("Error al registrar con Facebook");
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <input
        type="text"
        placeholder="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="date"
        placeholder="Fecha de nacimiento"
        value={birthrate}
        onChange={(e) => setBirthrate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Celular"
        value={cellphone}
        onChange={(e) => setCellphone(e.target.value)}
      />
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
      <button onClick={handleRegister}>Registrar</button>
      <hr />
      <button onClick={handleGoogleRegister}>Registrarse con Google</button>
      <button onClick={handleFacebookRegister}>Registrarse con Facebook</button>
    </div>
  );
};

export default RegisterView;
