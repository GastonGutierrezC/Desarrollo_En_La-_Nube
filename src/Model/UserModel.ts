// src/models/UserModel.ts
export interface UserModel {
  email: string;
  password?: string;
  provider?: "google" | "facebook" | "email";
  name?: string;
  city?: string;
  birthrate?: string;   
  cellphone?: string;
}
