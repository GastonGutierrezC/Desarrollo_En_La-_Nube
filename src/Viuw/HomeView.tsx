// src/views/HomeView.tsx
import React from "react";
import { AuthController } from "../Controller/AuthController";
import "../styles/HomeView.css"; 


const HomeView: React.FC = () => {
  const handleLogout = async () => {
    try {
      await AuthController.logout();
      alert("Sesión cerrada");
    } catch (error) {
      console.error(error);
      alert("Error al cerrar sesión.");
    }
  };

  const linkGoogle = async () => {
    try {
      await AuthController.linkWithGoogle();
      alert("Cuenta de Google vinculada exitosamente!");
    } catch (error) {
      console.error(error);
      alert("Error al vincular cuenta de Google.");
    }
  };

  const linkFacebook = async () => {
    try {
      await AuthController.linkWithFacebook();
      alert("Cuenta de Facebook vinculada exitosamente!");
    } catch (error) {
      console.error(error);
      alert("Error al vincular cuenta de Facebook.");
    }
  };

return (
  <div className="home-container">
    <h1>Bienvenido a la Home</h1>
    <button onClick={handleLogout}>Cerrar sesión</button>
    <hr />
    <button onClick={linkGoogle}>Vincular cuenta Google</button>
    <br />
    <button onClick={linkFacebook}>Vincular cuenta Facebook</button>
  </div>
);

};

export default HomeView;

