"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { browserClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { usePost } from "@/lib/store/posts";
import { PostWithData } from "@/utils/supabase/types/types";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserAvatar } from "../userAvater";
import { HeartIcon, MessageSquareReply } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/lib/store/user";

interface Props {
  post: PostWithData;
  isWithSlug: boolean;
  slug?: string;
}

const PostCard = ({ post, isWithSlug, slug }: Props) => {
  const supabase = browserClient();
  const router = useRouter();
  const imageUrls = post.imageUrl ? post.imageUrl.split(",") : [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { optimisticUpdatePostLikes, optimisticUpdatePostWithSlugLikes } =
    usePost((state) => state);
  const user = useUser((state) => state.user);
  const liked = post.likes.some((like) => like.user_id === user?.id);
  const postStamp = formatDistanceToNow(new Date(post.created_at!), {
    addSuffix: true,
  });

  const textPreview =
    post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content;

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };
  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    if (
      post.likes.length > 0 &&
      post.likes.some((like) => like.user_id === user.id)
    ) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ post_id: post.id, user_id: user.id });
      if (error) {
        toast.error(error.message);
      } else {
        const { data: postData } = await supabase
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
          .eq("id", post.id)
          .single();
        const adjustedUser = Array.isArray(postData?.user)
          ? postData?.user[0]
          : postData?.user;
        const adjustedPostData = { ...postData, user: adjustedUser! };
        isWithSlug
          ? optimisticUpdatePostWithSlugLikes(
              adjustedPostData as unknown as PostWithData
            )
          : optimisticUpdatePostLikes(
              adjustedPostData as unknown as PostWithData
            );
      }
    } else {
      const { error } = await supabase.from("likes").insert({
        post_id: post.id,
        user_id: user.id,
      });
      if (error) {
        toast.error(error.message);
      } else {
        const { data: postData } = await supabase
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
          .eq("id", post.id)
          .single();
        const adjustedUser = Array.isArray(postData?.user)
          ? postData?.user[0]
          : postData?.user;
        const adjustedPostData = { ...postData, user: adjustedUser! };
        isWithSlug
          ? optimisticUpdatePostWithSlugLikes(
              adjustedPostData as unknown as PostWithData
            )
          : optimisticUpdatePostLikes(
              adjustedPostData as unknown as PostWithData
            );
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(post.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes" },
        async (payload) => {
          const { data: postData } = await supabase
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
            .eq("id", payload.new.post_id)
            .single();
          const adjustedUser = Array.isArray(postData?.user)
            ? postData?.user[0]
            : postData?.user;
          const adjustedPostData = { ...postData, user: adjustedUser! };
          isWithSlug
            ? optimisticUpdatePostWithSlugLikes(
                adjustedPostData as unknown as PostWithData
              )
            : optimisticUpdatePostLikes(
                adjustedPostData as unknown as PostWithData
              );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "likes" },
        async () => {
          const { data: postData, error } = await supabase
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
            .eq("id", post.id)
            .single();
          if (error) {
            toast.error(error.message);
          } else {
            const adjustedUser = Array.isArray(postData?.user)
              ? postData?.user[0]
              : postData?.user;
            const adjustedLikes = postData?.likes.map((like) => {
              // Adjust each user within the likes
              const adjustedLikeUser = Array.isArray(like.user)
                ? like.user[0]
                : like.user;
              return { ...like, user: adjustedLikeUser };
            });
            const adjustedPostData = {
              ...postData,
              user: adjustedUser!,
              likes: adjustedLikes!,
            };
            isWithSlug
              ? optimisticUpdatePostWithSlugLikes(
                  adjustedPostData as unknown as PostWithData
                )
              : optimisticUpdatePostLikes(
                  adjustedPostData as unknown as PostWithData
                );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLike]);

  return (
    <Card className="hover:border-b-accent rounded-sm hover:border-b-2 w-full">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <UserAvatar src={post.user.avatar_url!} className="h-9 w-9" />
            <div>
              <CardDescription className="text-foreground">
                {post.user.firstname} {post.user.lastname}
              </CardDescription>
              <CardDescription className="text-sm flex flex-col">
                @{post.user.username}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col w-full">
        <div
          className="break-words cursor-pointer"
          onClick={() => {
            isWithSlug
              ? router.replace(`${post.slug}/post/${post.id}`)
              : router.replace(`topics/${post.slug}/post/${post.id}`);
          }}
        >
          {textPreview}
        </div>
        {imageUrls.length > 0 && (
          <div
            className={cn(
              "grid gap-2 rounded-md p-2 mt-4 w-full items-center justify-center",
              imageUrls.length === 1
                ? "grid-cols-1"
                : imageUrls.length === 2
                ? "grid-cols-2"
                : imageUrls.length === 3
                ? "grid-cols-3"
                : "grid-cols-4"
            )}
          >
            {imageUrls.map(
              (url, index) =>
                url.trim() && (
                  <div key={index} className="w-full ">
                    <Dialog>
                      <DialogTrigger className="w-full h-full flex items-center justify-center">
                        <Image
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          width={516}
                          height={291}
                          className="object-contain cursor-pointer items-stretch w-auto h-auto"
                          onClick={() => handleImageClick(url)}
                          priority={true}
                        />
                      </DialogTrigger>
                      <DialogContent className="h-[576px] w-[1024px] ">
                        <Image
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          fill
                          className="object-contain cursor-pointer w-full"
                          onClick={() => handleImageClick(url)}
                          priority={true}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="group flex gap-1 items-center cursor-pointer"
              onClick={handleLike}
            >
              <HeartIcon
                className={`h-6 w-6 text-accent`}
                fill={`${liked ? "hsl(var(--accent))" : "hsl(var(--card))"}`}
                strokeWidth={2}
              />
              <p className="font-semibold text-sm">{post.likes.length}</p>
            </div>
            <div className="flex gap-1 items-center">
              <MessageSquareReply className={`h-6 w-6`} />
              <p className="font-semibold text-sm">{post?.comments?.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/topics/${post.slug}`} className="flex">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                in z/{post.slug}
              </span>
            </Link>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {postStamp}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
