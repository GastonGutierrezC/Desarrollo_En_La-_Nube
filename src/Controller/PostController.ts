// src/Controller/PostController.ts
import { postService } from "../Service/post-service";

export interface Post {
  id: string;
  userId: string;
  text: string;
  date: any;
}

export const PostController = {
  async getPosts(userId: string): Promise<Post[]> {
    return await postService.getPost(userId);
  },

  async createPost(userId: string, text: string): Promise<void> {
    if (!text.trim()) return;
    await postService.postPost(userId, text.trim());
  },

  async deletePost(id: string): Promise<void> {
    await postService.deletePost(id);
  }
};
