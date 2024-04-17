"use client";
import { PostWithData } from "@/utils/supabase/types/types";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HeartIcon, MessageSquareReply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../userAvater";
import { Separator } from "../ui/separator";
import { useUser } from "@/lib/store/user";
import { toast } from "sonner";
import { browserClient } from "@/utils/supabase/client";
import { usePost } from "@/lib/store/posts";
import CommentCreateForm from "../comments/comment-create-form";
import PostEditForm from "./post-edit-form";
import PostDeleteForm from "./post-delete-form";

export default function PostShow({
  postId,
  Post,
}: {
  postId: string;
  Post: PostWithData;
}) {
  const supabase = browserClient();
  const [isEditing, setIsEditing] = useState(false);

  const { posts, optimisticUpdatePostLikes, setPosts } = usePost(
    (state) => state
  );
  const post = posts.find((p) => p.id === postId) || Post;
  const [postContent, setPostContent] = useState(post.content);

  useEffect(() => {
    if (!posts.some((p) => p.id === postId)) {
      setPosts([...posts, post]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, posts, setPosts]);
  const [open, setOpen] = useState<boolean>(false);
  const imageUrls = post!.imageUrl ? post!.imageUrl.split(",") : [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const postStamp = formatDistanceToNow(new Date(post!.created_at!), {
    addSuffix: true,
  });
  const user = useUser((state) => state.user);
  const liked = post?.likes.some((like) => like.user_id === user?.id);
  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    if (
      post!.likes.length! > 0 &&
      post!.likes.some((like) => like.user_id === user.id)
    ) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ post_id: post!.id, user_id: user.id });
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
          .eq("id", post!.id)
          .single();
        const adjustedUser = Array.isArray(postData?.user)
          ? postData?.user[0]
          : postData?.user;
        const adjustedPostData = { ...postData, user: adjustedUser! };
        optimisticUpdatePostLikes(adjustedPostData as unknown as PostWithData);
      }
    } else {
      const { error } = await supabase.from("likes").insert({
        post_id: post!.id,
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
          .eq("id", post!.id)
          .single();
        const adjustedUser = Array.isArray(postData?.user)
          ? postData?.user[0]
          : postData?.user;
        const adjustedPostData = { ...postData, user: adjustedUser! };

        optimisticUpdatePostLikes(adjustedPostData as unknown as PostWithData);
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(post?.id!)
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
          optimisticUpdatePostLikes(
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
            .eq("id", post!.id)
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
            optimisticUpdatePostLikes(
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
  const handleEdit = () => {
    setIsEditing(true);
  };
  return (
    <div className="grid gap-4 grid-rows-1 grid-cols-1 p-4">
      <div className="flex flex-col justify-center bg-card p-4 rounded-md">
        <Button
          className="text-xl text-forground font-bold flex justify-start p-0"
          variant={"link"}
        >
          <Link href={`/topics/${post!.slug}`}>z/{post!.slug}</Link>
        </Button>
      </div>

      <Card className="rounded">
        <CardHeader>
          <div className="flex flex-col ">
            <div className="w-full space-y-2 flex items-center justify-between">
              <Link
                href={`/profile/${post!.user.username}`}
                className="flex items-center p-1 gap-2"
              >
                <UserAvatar
                  src={post!.user.avatar_url!}
                  className="h-12 w-12"
                />
                <div className="flex flex-col ">
                  <p>
                    {post!.user.firstname} {post!.user.lastname}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    @{post!.user.username}
                  </p>
                </div>
              </Link>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {postStamp}
              </span>
            </div>

            <Separator className="mx-auto " />
            {!post.isDeleted && post.userId === user?.id && (
              <div className="w-full flex items-center justify-end">
                <PostDeleteForm postId={post.id} onEdit={handleEdit} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {user?.id === post.userId && isEditing ? (
            <PostEditForm
              post={post}
              setIsEditing={setIsEditing}
              setCommentContent={setPostContent}
            />
          ) : (
            <p className="break-words">{post.content}</p>
          )}

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
        <CardFooter className=" pl-6">
          <div className="flex items-center space-x-4">
            <div className="flex gap-1 items-center">
              <div
                className="group flex gap-1 items-center cursor-pointer"
                onClick={handleLike}
              >
                <HeartIcon
                  className={`h-6 w-6 text-accent`}
                  fill={`${liked ? "hsl(var(--accent))" : "hsl(var(--card))"}`}
                  strokeWidth={2}
                />
                <p className="font-semibold text-sm">{post!.likes.length}</p>
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <MessageSquareReply className={`h-6 w-6`} />
              <p className="font-semibold text-sm">{post!.comments.length}</p>
            </div>
          </div>
          <div className="flex items-center justify-end w-full pr-6">
            <Button
              variant={"link"}
              className="p-0 h-fit"
              onClick={() => {
                setOpen(!open);
              }}
            >
              Reply
            </Button>
          </div>
        </CardFooter>
        {user && (
          <div className="flex items-center w-full p-2">
            <CommentCreateForm postId={post.id!} startOpen={open} />
          </div>
        )}
      </Card>
    </div>
  );
}
