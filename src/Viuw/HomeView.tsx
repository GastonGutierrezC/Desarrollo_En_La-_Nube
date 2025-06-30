import React, { useEffect, useState } from "react";
import { AuthController } from "../Controller/AuthController";
import { PostController, Post } from "../Controller/PostController";
import { imageService } from "../Service/Image-service";
import "../styles/HomeView.css";
import { usePostNotifications } from "../Controller/PostNotificationController";
import { useReactionNotifications } from "../Controller/ReactionsController";

const MODERATE_POSTS_URL = "https://moderateposts-r3plriklfq-uc.a.run.app";

const HomeView: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const user = await AuthController.getCurrentUser();
      if (user) {
        setUserId(user.uid);
        await loadPosts(user.uid);
      }
    })();
  }, []);

  usePostNotifications(userId); 
  useReactionNotifications(userId);

  const loadPosts = async (uid: string) => {
    const userPosts = await PostController.getPosts(uid);
    setPosts(userPosts);
  };

  const createPost = async () => {
    if (!userId || !newPostText.trim()) {
      alert("El texto del post es obligatorio.");
      return;
    }

    if (!selectedImage) {
      alert("Debes seleccionar una imagen para el post.");
      return;
    }

    setUploading(true);

    const imageUrl = await imageService.postImage(selectedImage);

    if (!imageUrl) {
      alert("Hubo un error al subir la imagen.");
      setUploading(false);
      return;
    }

    await PostController.createPost(userId, newPostText.trim(), imageUrl);

    // Llamada a función de moderación en Firebase
    try {
      const response = await fetch(MODERATE_POSTS_URL);
      const resultText = await response.text();
      console.log("Moderación:", resultText);
    } catch (error) {
      console.error("Error al llamar a la función de moderación:", error);
    }

    setNewPostText("");
    setSelectedImage(null);
    await loadPosts(userId);
    setUploading(false);
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
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
          }
        }}
        style={{ marginLeft: "10px" }}
      />
      <button onClick={createPost} disabled={uploading || !selectedImage}>
        {uploading ? "Subiendo..." : "Crear post"}
      </button>

      <hr />
      <h2>Posts del usuario</h2>
      {posts.length === 0 ? (
        <p>No hay posts.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "20px" }}>
              <strong>{post.text}</strong> -{" "}
              {post.date?.toDate
                ? post.date.toDate().toLocaleString()
                : new Date(post.date).toLocaleString()}
              <button
                onClick={() => deletePostById(post.id)}
                style={{ marginLeft: "10px" }}
              >
                Eliminar
              </button>
              {post.image && (
                <div>
                  <img
                    src={post.image}
                    alt="Post image"
                    style={{ maxWidth: "300px", marginTop: "8px" }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeView;
