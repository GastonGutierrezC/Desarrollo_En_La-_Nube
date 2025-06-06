// src/controllers/AuthController.ts
import { auth, googleProvider, facebookProvider } from "../firebaseinit";
import {
  createUserWithEmailAndPassword,
  linkWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { UserModel } from "../Model/UserModel";



export class AuthController {
  static async registerWithEmail(user: UserModel): Promise<void> {
    await createUserWithEmailAndPassword(auth, user.email, user.password || "");
  }

  static async registerWithGoogle(): Promise<void> {
    await signInWithPopup(auth, googleProvider);
  }

  static async registerWithFacebook(): Promise<void> {
    await signInWithPopup(auth, facebookProvider);
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
