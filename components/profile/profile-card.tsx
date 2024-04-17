"use client";

import { Card } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { revalidatePath } from "next/cache";
import { useUser } from "@/lib/store/user";
import { useState } from "react";
import { browserClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Props {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  };
  username: string;
  isFollowing: boolean;
}

export function UserCard({ user, username, isFollowing }: Props) {
  const Sessionuser = useUser((state) => state.user);
  const [following, setFollowing] = useState(isFollowing);
  const supabase = browserClient();
  const handleFollow = async () => {
    if (isFollowing) {
      const { error } = await supabase
        .from("follow")
        .delete()
        .or(
          `and(follower_id.eq.${Sessionuser?.id!},following_id.eq.${user?.id!}),and(follower_id.eq.${user?.id},following_id.eq.${Sessionuser?.id!})`
        );
      if (error) {
        toast.error(error.message);
      }
      setFollowing((prev) => !prev);
    } else {
      const { error } = await supabase.from("follow").insert([
        {
          follower_id: Sessionuser?.id!,
          following_id: user?.id!,
        },
      ]);
      if (error) {
        toast.error(error.message);
      }
      setFollowing((prev) => !prev);
    }
  };
  return (
    <Card className="flex space-x-2 p-4 w-full">
      <Avatar>
        <AvatarImage src={user.avatar_url!} alt="User Image" />
        <AvatarFallback>Z</AvatarFallback>
      </Avatar>
      <Link href={`/profile/${user.username}`}>
        <div className="flex flex-col">
          <h5 className="card-title">{`${user.firstname} ${user.lastname}`}</h5>
          <p className="text-zinc-500 text-sm">@{user.username}</p>
        </div>
      </Link>
      {Sessionuser?.id !== user.id && (
        <div className="flex items-center justify-end flex-1">
          <Button onClick={handleFollow}>
            {following ? "Following" : "Follow"}
          </Button>
        </div>
      )}
    </Card>
  );
}
