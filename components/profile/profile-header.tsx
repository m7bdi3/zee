"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import BioEditForm from "./profile-bio";
import FollowState from "./follow-state";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { PostWithData, PostsLikedByUser } from "@/utils/supabase/types/types";
import { browserClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/user";
import { UserAvatar } from "../userAvater";
import { useProfile } from "@/lib/store/profile";
import ProfileDialog from "./profileDialog";
import ProfileTabs from "./profile-tabs";

interface Props {
  posts: PostWithData[];
  postsLiked: PostsLikedByUser[];
  isFollowing: boolean;
}

export default function ProfileHeader({
  posts,
  postsLiked,
  isFollowing,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const router = useRouter();
  const supabase = browserClient();
  const user = useUser((state) => state.user);
  const profile = useProfile((state) => state.profile);
  const handleMessage = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(member_one.eq.${user?.id},member_two.eq.${profile?.id}),and(member_one.eq.${profile?.id},member_two.eq.${user?.id})`
      );
    if (error) {
      toast.error(error.message);
    }
    if (data?.length! > 0) {
      router.push(`/messages/${data![0].id}`);
    }
    if (!data || data.length === 0) {
      const { error } = await supabase.from("conversations").insert([
        {
          id: uuidv4(),
          member_one: user?.id!,
          member_two: profile?.id!,
        },
      ]);
      if (error) {
        toast.error(error.message);
      } else {
        console.log(data);
        router.push(`/messages/${data![0].id}`);
      }
    }
  };
  const handleFollow = async () => {
    if (isFollowing) {
      const { error } = await supabase
        .from("follow")
        .delete()
        .or(
          `and(follower_id.eq.${user?.id!},following_id.eq.${profile?.id!}),and(follower_id.eq.${
            profile?.id
          },following_id.eq.${user?.id!})`
        );
      if (error) {
        toast.error(error.message);
      }
      setFollowing((prev) => !prev);
    } else {
      const { error } = await supabase.from("follow").insert([
        {
          follower_id: user?.id!,
          following_id: profile?.id!,
        },
      ]);
      if (error) {
        toast.error(error.message);
      }
      setFollowing((prev) => !prev);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="h-64 w-full bg-muted overflow-hidden">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-none">
            <Image
              src={profile?.cover_url || ""}
              alt="cover"
              fill
              className="w-full h-64 object-fit"
            />
          </AspectRatio>
          {user?.id === profile?.id && (
            <ProfileDialog
              username={profile?.username!}
              type="ProfileCoverImage"
            />
          )}
        </div>

        <div className="absolute -bottom-16 left-3 z-10 bg-card rounded-full">
          <UserAvatar
            className="shrink-0 w-32 h-32 border-[5px] border-card"
            src={profile?.avatar_url || "/avatar.jpg"}
          />
          {user?.id === profile?.id && (
            <ProfileDialog username={profile?.username!} type="ProfileImage" />
          )}
        </div>
        {user?.id !== profile?.id && (
          <div className="absolute -bottom-14 right-4 items-center justify-end ">
            <div className="flex items-center gap-4 w-full">
              <Button onClick={handleMessage}>
                <Mail className="hover:scale-110 transition-all" />
              </Button>
              <Button onClick={handleFollow}>
                {following ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-card pt-20 pb-4 px-4 space-y-4 flex-col items-center justify-between">
        <div className="px-2 space-y-1">
          <div className="flex gap-1">
            <p className="text-lg">{profile?.firstname}</p>
            <p className="text-lg">{profile?.lastname}</p>
          </div>

          <p className="text-zinc-500">@{profile?.username}</p>
        </div>
        <BioEditForm
          bio={profile?.bio || "Default bio"}
          userId={profile?.id!}
        />
        <FollowState profile={profile!} />
      </div>
      <div className="w-full border-t-muted border-t-[1px]">
        <ProfileTabs posts={posts} postsLiked={postsLiked} />
      </div>
    </div>
  );
}
