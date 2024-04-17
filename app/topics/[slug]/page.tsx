import TopicShowPage from "@/components/topics/TopicShowPage";
import InitPostsWithSlug from "@/lib/store/initPostsWithSlug";
import { serverClient } from "@/utils/supabase/server";
import { PostWithData } from "@/utils/supabase/types/types";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}
export default async function Topic({ params }: Props) {
  const { slug } = params;
  const supabase = serverClient();

  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return notFound();
  }

  const { data: post, error: postError } = await supabase
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
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  const adjustedPosts = post!.map((post) => {
    const user = Array.isArray(post.user) ? post.user[0] : post.user;
    return {
      ...post,
      user,
    };
  });

  return (
    <>
      <TopicShowPage slug={slug} topic={topic} />
      
      <InitPostsWithSlug posts={adjustedPosts as unknown as PostWithData[]} />
    </>
  );
}
