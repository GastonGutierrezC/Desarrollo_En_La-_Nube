import { Timestamp } from "firebase/firestore";

export interface PostData {
  userId: string;
  text: string;
  date: Timestamp;
  image?: string;  
}

export interface Post extends PostData {
  id: string;
}
