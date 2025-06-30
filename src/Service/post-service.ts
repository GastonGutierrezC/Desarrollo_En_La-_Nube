import { firestore } from "../firebaseinit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Post, PostData } from "../Model/PostModel";
import { type } from "os";
import { toast } from "react-toastify";

export const postService = {
  async postPost(userId: string, text: string, image?: string): Promise<string> {
    const date = Timestamp.now();

    const newPost: PostData & { likes: number; dislikes: number } = {
      userId,
      text,
      date,
      image,
      likes: 0,
      dislikes: 0,
    };

    const postRef = await addDoc(collection(firestore, "Posts"), newPost);
    return postRef.id;
  },

  async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(firestore, "Posts", id));
  },

  async getPost(userId: string): Promise<Post[]> {
    const postRef = collection(firestore, "Posts");
    const queryByUserId = query(postRef, where("userId", "==", userId));
    const data = await getDocs(queryByUserId);

    return data.docs.map((doc) => {
      const postData = doc.data();
      return {
        id: doc.id,
        ...postData,
        likes: postData.likes ?? 0,
        dislikes: postData.dislikes ?? 0,
      } as Post;
    });
  },

  async getPostById(postId: string): Promise<Post | null> {
    const postDoc = doc(firestore, "Posts", postId);
    const postSnap = await getDoc(postDoc);

    if (!postSnap.exists()) return null;

    const postData = postSnap.data();
    return {
      id: postSnap.id,
      ...postData,
      likes: postData.likes ?? 0,
      dislikes: postData.dislikes ?? 0,
    } as Post;
  },

  async getAllPosts(): Promise<Post[]> {
    const data = await getDocs(collection(firestore, "Posts"));

    return data.docs.map((doc) => {
      const postData = doc.data();
      return {
        id: doc.id,
        ...postData,
        likes: postData.likes ?? 0,
        dislikes: postData.dislikes ?? 0,
      } as Post;
    });
  },

async reactToPost(postId: string, type: "like" | "dislike", fromUserId: string): Promise<void> {
  const post = await this.getPostById(postId);
  if (!post) return;

  const postDoc = doc(firestore, "Posts", postId);
  const currentCount = post[type === "like" ? "likes" : "dislikes"] ?? 0;

  await updateDoc(postDoc, {
    [type === "like" ? "likes" : "dislikes"]: currentCount + 1,
  });
},

};
