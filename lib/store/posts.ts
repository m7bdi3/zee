import { create } from "zustand";
import { PostWithData } from "@/utils/supabase/types/types";

interface PostState {
  posts: PostWithData[];
  postsWithSlug: PostWithData[];
  hasMore: boolean;
  page: number;
  actionPost: PostWithData | undefined;
  optimisticIds: string[];
  addPost: (post: PostWithData) => void;
  setActionPost: (post: PostWithData | undefined) => void;
  optimisticDeletePost: (PostId: string) => void;
  optimisticUpdatePost: (Post: PostWithData) => void;
  setOptimisticIds: (id: string) => void;
  setPosts: (Posts: PostWithData[]) => void;
  setPostsWithSlug: (Posts: PostWithData[]) => void;
  optimisticUpdatePostLikes: (Post: PostWithData) => void;
  optimisticUpdatePostWithSlugLikes: (Post: PostWithData) => void;
}

export const usePost = create<PostState>()((set) => ({
  hasMore: true,
  page: 1,
  posts: [],
  postsWithSlug: [],
  optimisticIds: [],
  actionPost: undefined,
  setPosts: (posts) =>
    set((state) => ({
      posts: [...state.posts, ...posts],
      page: state.page + 1,
      hasMore: posts.length >= 5,
    })),
  setPostsWithSlug: (posts) =>
    set((state) => ({
      postsWithSlug: [...state.postsWithSlug, ...posts],
      page: state.page + 1,
      hasMore: posts.length >= 5,
    })),
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  addPost: (newPost) => {
    set((state) => {
      const postExists = state.posts.some((post) => post.id === newPost.id);
      if (!postExists) {
        return {
          ...state,
          posts: [newPost, ...state.posts],
        };
      }
      return state;
    });
  },
  setActionPost: (post) => set(() => ({ actionPost: post })),
  optimisticDeletePost: (PostId) =>
    set((state) => {
      return {
        posts: state.posts.filter((post) => post.id !== PostId),
      };
    }),
  optimisticUpdatePost: (updatePost) =>
    set((state) => {
      return {
        posts: state.posts.filter((post) => {
          if (post.id === updatePost.id) {
            post = updatePost;
          }
          return post;
        }),
      };
    }),
  optimisticUpdatePostLikes: (updatedPost) =>
    set((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === updatedPost.id
          ? {
              ...post,
              likes: updatedPost.likes,
            }
          : post
      ),
    })),
  optimisticUpdatePostWithSlugLikes: (updatedPost) =>
    set((state) => ({
      ...state,
      postsWithSlug: state.postsWithSlug.map((post) =>
        post.id === updatedPost.id
          ? {
              ...post,
              likes: updatedPost.likes,
            }
          : post
      ),
    })),
}));
