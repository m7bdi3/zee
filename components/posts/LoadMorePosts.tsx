"use client";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePost } from "@/lib/store/posts";
import { browserClient } from "@/utils/supabase/client";
import { PostWithData } from "@/utils/supabase/types/types";
export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;
  let to = from + itemPerPage;

  if (page > 0) {
    from += 1;
  }
  return { from, to };
}

interface Props {
  isWithSlug: boolean;
  slug?: string;
}

export default function LoadMorePosts({ isWithSlug, slug }: Props) {
  const observerRef = useRef(null);
  const page = usePost((state) => state.page);
  const setPosts = usePost((state) => state.setPosts);
  const setPostsWithSlug = usePost((state) => state.setPostsWithSlug);

  const hasMore = usePost((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, 4);
    const supabase = browserClient();

    if (isWithSlug) {
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
        .eq("slug", slug!)
        .range(from, to)
        .order("created_at", { ascending: false });

      const adjustedPosts = post!.map((post) => {
        const user = Array.isArray(post.user) ? post.user[0] : post.user;
        const likes = Array.isArray(post.likes) ? post.likes[0] : post.likes;
        return {
          ...post,
          user,
          likes,
        };
      });

      setPostsWithSlug(adjustedPosts as unknown as PostWithData[]);
    } else {
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
        .range(from, to)
        .order("created_at", { ascending: false });
      const adjustedPosts = data!.map((post) => {
        const user = Array.isArray(post.user) ? post.user[0] : post.user;
        const likes = Array.isArray(post.likes) ? post.likes[0] : post.likes;
        return {
          ...post,
          user,
          likes,
        };
      });
      if (error) {
        toast.error(error.message);
      } else {
        setPosts(adjustedPosts as unknown as PostWithData[]);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore]);

  if (hasMore) {
    return (
      <div
        ref={observerRef}
        className="h-10 flex w-full items-center justify-center"
      >
        <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
      </div>
    );
  }
  return <></>;
}
