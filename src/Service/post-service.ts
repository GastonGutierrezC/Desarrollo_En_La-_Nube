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
} from "firebase/firestore";
import { Post, PostData } from "../Model/PostModel";

export const postService = {
  async postPost(userId: string, text: string, image?: string): Promise<string> {
    const date = Timestamp.now();

    const newPost: any = {
      userId,
      text,
      date,
      image, 
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
      const postData = doc.data() as PostData;
      return {
        id: doc.id,
        ...postData,
      };
    });
  },
};
