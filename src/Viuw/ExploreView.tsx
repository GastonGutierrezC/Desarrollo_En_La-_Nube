import React, { useEffect, useState } from "react";
import { Post, PostController } from "../Controller/PostController";
import { AuthController } from "../Controller/AuthController";
import { useReactionNotifications } from "../Controller/ReactionsController";

const ExploreView: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const user = await AuthController.getCurrentUser();
      if (user) {
        setUserId(user.uid);
        await loadAllPosts(user.uid);
      }
    })();
  }, []);

  useReactionNotifications(userId);

  const loadAllPosts = async (uid: string) => {
    const allPosts = await PostController.getAllPosts();
    const filtered = allPosts.filter((post) => post.userId !== uid);
    setPosts(filtered);
  };

  const handleReaction = async (
    postId: string,
    ownerId: string,
    type: "like" | "dislike"
  ) => {
    await PostController.reactToPost(postId, type, ownerId);

    await loadAllPosts(userId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Explorar publicaciones</h2>
      {posts.length === 0 ? (
        <p>No hay publicaciones de otros usuarios.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <strong>{post.text}</strong>
            <br />
            <small>{post.date.toDate().toLocaleString()}</small>
            {post.image && (
              <div>
                <img
                  src={post.image}
                  alt="img"
                  style={{ maxWidth: "300px", marginTop: "8px", borderRadius: "4px" }}
                />
              </div>
            )}
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => handleReaction(post.id, post.userId, "like")}>
                👍 {post.likes ?? 0}
              </button>
              <button
                onClick={() => handleReaction(post.id, post.userId, "dislike")}
                style={{ marginLeft: "10px" }}
              >
                👎 {post.dislikes ?? 0}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExploreView;
