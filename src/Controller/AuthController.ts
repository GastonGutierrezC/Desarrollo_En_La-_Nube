// src/controllers/AuthController.ts
import {
  createUserWithEmailAndPassword,
  linkWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { auth, firestore, googleProvider, facebookProvider } from "../firebaseinit";
import { UserModel } from "../Model/UserModel";

export class AuthController {
  static async registerWithEmail(user: UserModel): Promise<void> {
    const { email, password, name, city, birthrate, cellphone } = user;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password || "");
    const uid = userCredential.user.uid;

    const userData: UserModel = {
      email,
      provider: "email",
      name,
      city,
      birthrate,
      cellphone,
    };

    await setDoc(doc(firestore, "User", uid), userData);
  }

  static async registerWithGoogle(): Promise<void> {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userData: UserModel = {
      email: user.email || "",
      provider: "google",
      name: user.displayName || "",
    };

    await setDoc(doc(firestore, "User", user.uid), userData);
  }

  static async registerWithFacebook(): Promise<void> {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    const userData: UserModel = {
      email: user.email || "",
      provider: "facebook",
      name: user.displayName || "",
    };

    await setDoc(doc(firestore, "User", user.uid), userData);
  }

  static async loginWithEmail(user: UserModel): Promise<void> {
    await signInWithEmailAndPassword(auth, user.email, user.password || "");
  }

  static async loginWithGoogle(): Promise<void> {
    await signInWithPopup(auth, googleProvider);
  }

  static async loginWithFacebook(): Promise<void> {
    await signInWithPopup(auth, facebookProvider);
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static async linkWithGoogle(): Promise<void> {
    if (!auth.currentUser) throw new Error("Usuario no autenticado");
    await linkWithPopup(auth.currentUser, googleProvider);
  }

  static async linkWithFacebook(): Promise<void> {
    if (!auth.currentUser) throw new Error("Usuario no autenticado");
    await linkWithPopup(auth.currentUser, facebookProvider);
  }

  static getCurrentUser() {
    return auth.currentUser;
  }
}
