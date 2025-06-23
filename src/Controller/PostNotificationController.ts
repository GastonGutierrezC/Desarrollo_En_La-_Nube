import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebaseinit";

export const usePostNotifications = (currentUserId: string) => {
  const notifiedPostIds = useRef<Set<string>>(new Set());
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!currentUserId) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const postsRef = collection(firestore, "Posts");
    const q = query(postsRef, orderBy("date", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type !== "added") return;

        const postId = change.doc.id;
        const newPost = change.doc.data();
        const authorId = newPost.userId;

        if (authorId === currentUserId) return;
        if (notifiedPostIds.current.has(postId)) return;

        notifiedPostIds.current.add(postId);

        const userDoc = await getDoc(doc(firestore, "User", authorId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        const authorName = userData?.name || "Alguien";

        toast.info(`📰 ${authorName} publicó: "${newPost.text.slice(0, 40)}..."`);
      });
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
