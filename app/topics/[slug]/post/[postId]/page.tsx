import CommentDisplay from "@/components/comments/comment-display";
import PostShow from "@/components/posts/PostShow";
import InitPosts from "@/lib/store/initPosts";
import { serverClient } from "@/utils/supabase/server";
import { CommentsWithData, PostWithData } from "@/utils/supabase/types/types";
import { notFound } from "next/navigation";
import React from "react";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostPageProps) {
  const { postId } = params;
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `*,user:profiles!userId(username,avatar_url,firstname,lastname), likes:likes!post_id (
      id,
      user_id,
      user:profiles!user_id (
        username,
        avatar_url,
        firstname,
        lastname
      )
    ),comments:comments!post_id (
      *,
      user:profiles!user_id (
        username,
        avatar_url,
        firstname,
        lastname
      ),likes:likes!comment_id (
        id,
        user_id,
        user:profiles!user_id (
          username,
          avatar_url,
          firstname,
          lastname
        )
      )
    )`
    )
    .eq("id", postId)
    .single();

  if (error || !data) {
    return notFound();
  }

  return (
    <>
      <PostShow postId={postId} Post={data as unknown as PostWithData} />
      <CommentDisplay comments={data.comments as unknown as CommentsWithData[]} postId={data.id} />
    </>
  );
}
