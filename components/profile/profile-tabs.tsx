"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "../posts/post-card";
import { PostWithData, PostsLikedByUser } from "@/utils/supabase/types/types";
type Props = {
  posts: PostWithData[];
  postsLiked: PostsLikedByUser[];
};

const ProfileTabs = ({ posts, postsLiked }: Props) => {
  return (
    <Tabs defaultValue="Posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Posts">Posts</TabsTrigger>
        <TabsTrigger value="Likes">Likes</TabsTrigger>
      </TabsList>
      <TabsContent value="Posts" className="p-2 flex flex-col gap-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isWithSlug={false} />
        ))}
      </TabsContent>
      <TabsContent value="Likes" className="px-2 -mt-2 flex flex-col gap-2">
        {postsLiked.map((post) => (
          <PostCard key={post.id} post={post.posts} isWithSlug={false} />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
