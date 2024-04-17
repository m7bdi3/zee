"use server";

import { serverClient } from "@/utils/supabase/server";

export async function getPostWithData(postId: string) {
  const supabase = serverClient();

  const { error, data: postData } = await supabase
    .from("posts")
    .select(
      `*,user:profiles!userId(id,username,avatar_url,firstname,lastname), likes:likes!post_id (
                id,
                user_id,
                user:profiles!user_id (
                  id,
                  username,
                  avatar_url,
                  firstname,
                  lastname
                )
              )`
    )
    .eq("id", postId)
    .single();
  if (error) {
    return { error };
  }
  return { postData };
}
