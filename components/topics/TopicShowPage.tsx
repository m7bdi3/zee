"use client";
import { usePost } from "@/lib/store/posts";
import { Topic } from "@/utils/supabase/types/types";
import React, { Suspense } from "react";
import { Card } from "../ui/card";
import PostCreateForm from "../posts/create-post-form";
import PostCard from "../posts/post-card";
import LoadMorePosts from "../posts/LoadMorePosts";
import { UserAvatar } from "../userAvater";
import { useUser } from "@/lib/store/user";

interface Props {
  slug: string;
  topic: Topic;
}

export default function TopicShowPage({ slug, topic }: Props) {
  const { postsWithSlug } = usePost((state) => state);
  const { user } = useUser((state) => state);

  return (
    <div className="grid gap-4 grid-rows-1 grid-cols-1 p-4">
      <div className="flex items-center justify-between bg-card p-4 rounded-md">
        <div className="flex items-center gap-4 ">
          <UserAvatar src={topic.image} className="w-16 h-16" />
          <div className="flex flex-col">
            <p className="text-4xl font-bold">z/{slug}</p>
            <p className="mt-2 text-accent">{topic?.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full ">
        {user && (
          <Card className="w-full p-2">
            <PostCreateForm isHome={false} slug={slug} />
          </Card>
        )}
      </div>
      <Suspense>
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-col gap-4">
            {postsWithSlug.map((value, index) => {
              return <PostCard key={index} post={value} isWithSlug={true} slug={slug} />;
            })}
          </div>
          <div className="flex-1 pb-5 ">
            <LoadMorePosts isWithSlug={true} slug={slug} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
