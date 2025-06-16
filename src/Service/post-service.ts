import { firestore } from "../firebaseinit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

export const postService = {
  async postPost(userId: string, text: string) {
    const date = Timestamp.now();
    const newPost = {
      userId,
      text,
      date,
    };
    const postRef = await addDoc(collection(firestore, "Posts"), newPost);
    return postRef.id;
  },


    async deletePost(id: string){
         await deleteDoc(doc(firestore, "Posts", id))
    },

async getPost(userId: string) {
  const postRef = collection(firestore, "Posts");
  const queryByUserId = query(postRef, where("userId", "==", userId));
  const data = await getDocs(queryByUserId);
  return data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      userId: string;
      text: string;
      date: Timestamp;
    }),
  }));
}

}