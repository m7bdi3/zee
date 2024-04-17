import HomePostForm from "@/components/posts/HomePostForm";
import HomePosts from "@/components/posts/home-posts";
import { PostDialog } from "@/components/posts/postDialog";
import TopicCreateForm from "@/components/topics/topic-create-form";
import { TopicsScrollArea } from "@/components/topics/topic-scroll-area";
import { Card } from "@/components/ui/card";
import { PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Home() {
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full h-full overflow-hidden">
      <Card className="hidden row-span-1 md:flex lg:flex col-span-1 md:col-span-1 lg:col-span-1 rounded-md flex-col shadow py-3 px-2 h-full w-full">
        <div className="flex justify-between items-center">
          <Link href={"/topics"}>
            <h3 className="pl-2 text-lg font-medium">Topics</h3>
          </Link>
          <PostDialog
            header="Create topic"
            button={<PlusCircle className="hover:scale-110" />}
          >
            <TopicCreateForm />
          </PostDialog>
        </div>
        <div className="h-full">
          <TopicsScrollArea />
        </div>
      </Card>
      <div className="h-full flex gap-2 flex-col w-full col-span-1 md:col-span-2 lg:col-span-3 row-span-1 p-1">
        <div className="flex items-center bg-card w-full rounded-md p-1">
          <TrendingUp className="w-7 h-7 text-accent" />
          <p className="text-xl m-2 ">Top Posts</p>
        </div>
        <div className="h-[820px] w-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            <HomePostForm />
            <HomePosts />
          </div>
        </div>
      </div>
    </div>
  );
}
