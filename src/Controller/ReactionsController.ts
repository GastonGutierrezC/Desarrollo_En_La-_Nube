import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebaseinit";

export const useReactionNotifications = (currentUserId: string) => {
  const notifiedPostIds = useRef<Set<string>>(new Set());
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!currentUserId) return;


    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const postsRef = collection(firestore, "Posts");

    const q = query(postsRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type !== "modified") continue; 

        const postId = change.doc.id;
        if (notifiedPostIds.current.has(postId)) continue;

        const newPostData = change.doc.data();
        const authorId = newPostData.userId;

        if (authorId !== currentUserId) continue; 


        notifiedPostIds.current.add(postId);

        toast.info(
          `👍 Alguien le dio una reacción a un post: "${newPostData.text.slice(0, 40)}..."`
        );


        setTimeout(() => {
          notifiedPostIds.current.delete(postId);
        }, 10000); 
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = undefined;
      }
    };
  }, [currentUserId]);
};
