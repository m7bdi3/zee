"use client";
import { PostWithData } from "@/utils/supabase/types/types";
import React, { useEffect, useRef } from "react";
import { usePost } from "./posts";

export default function InitPostsWithSlug({ posts }: { posts: PostWithData[] }) {
  const initState = useRef(false);
  
  useEffect(() => {
    if (!initState.current) {
      usePost.setState({ postsWithSlug: posts });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
