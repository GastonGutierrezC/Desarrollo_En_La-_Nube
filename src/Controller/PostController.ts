import { postService } from "../Service/post-service";

export interface Post {
  id: string;
  userId: string;
  text: string;
  date: any;
  image?: string;
  likes: number;
  dislikes: number;
}

export const PostController = {
  async getPosts(userId: string): Promise<Post[]> {
    return await postService.getPost(userId);
  },

  async createPost(userId: string, text: string, imageUrl: string): Promise<void> {
    if (!text.trim() || !imageUrl) return;
    await postService.postPost(userId, text.trim(), imageUrl);
  },

  async getAllPosts(): Promise<Post[]> {
    return await postService.getAllPosts();
  },

  async reactToPost(postId: string, type: "like" | "dislike", reactingUserId: string): Promise<void> {
    await postService.reactToPost(postId, type, reactingUserId);
  }

,

  async deletePost(id: string): Promise<void> {
    await postService.deletePost(id);
  },
};
