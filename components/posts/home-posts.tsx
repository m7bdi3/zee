"use client";
import PostCard from "@/components/posts/post-card";
import React, { useEffect } from "react";

import { browserClient } from "@/utils/supabase/client";
import { usePost } from "@/lib/store/posts";
import { PostWithData } from "@/utils/supabase/types/types";
import LoadMorePosts from "./LoadMorePosts";


const HomePosts = () => {
  const {
    posts,
    addPost,
    optimisticIds,
    optimisticDeletePost,
    optimisticUpdatePost,
  } = usePost((state) => state);
  const supabase = browserClient();
  //------------------------------------------------------//

  useEffect(() => {
    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data: postData } = await supabase
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
              .eq("id", payload.new.id)
              .single();
            addPost(postData as unknown as PostWithData);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) => {
          optimisticDeletePost(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          optimisticUpdatePost(payload.new as PostWithData);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col gap-4">
          {posts.map((value, index) => {
            return <PostCard key={index} post={value} isWithSlug={false} />;
          })}
        </div>
        <div className="flex-1 pb-5 ">
          <LoadMorePosts isWithSlug={false} />
        </div>
      </div>
    </>
  );
};

export default HomePosts;
