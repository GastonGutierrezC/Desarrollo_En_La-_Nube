import React, { useEffect, useState } from "react";
import { AuthController } from "../Controller/AuthController";
import { PostController, Post } from "../Controller/PostController";
import "../styles/HomeView.css";

const HomeView: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AuthController.getCurrentUser(); 
      if (user) {
        setUserId(user.uid);
        await loadPosts(user.uid);
      }
    };
    fetchUser();
  }, []);

  const loadPosts = async (uid: string) => {
    const userPosts = await PostController.getPosts(uid);
    setPosts(userPosts);
  };

  const createPost = async () => {
    if (!userId || !newPostText.trim()) return;
    await PostController.createPost(userId, newPostText);
    setNewPostText("");
    await loadPosts(userId);
  };

  const deletePostById = async (id: string) => {
    await PostController.deletePost(id);
    await loadPosts(userId);
  };

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
      <hr />

      <h3>Crear nuevo post</h3>
      <input
        type="text"
        placeholder="Escribí tu post"
        value={newPostText}
        onChange={(e) => setNewPostText(e.target.value)}
        style={{ padding: "8px", width: "80%", marginRight: "10px" }}
      />
      <button onClick={createPost}>Crear post</button>

      <hr />
      <h2>Posts del usuario</h2>
      {posts.length === 0 ? (
        <p>No hay posts.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "10px" }}>
              <strong>{post.text}</strong> -{" "}
              {post.date?.toDate().toLocaleString()}
              <button
                onClick={() => deletePostById(post.id)}
                style={{ marginLeft: "10px" }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeView;
