"use client";

import { profile } from "@/utils/supabase/types/types";
import Link from "next/link";

interface Props {
  profile: profile;
}

const FollowState = ({ profile }: Props) => {
  return (
    <div className="space-x-4 flex items-center px-2">
      <Link
        href={`/profile/${profile.username}/following`}
        className=" cursor-pointer"
      >
        <div className="flex gap-1">
          <p>{profile.following.length}</p>
          <p className="text-zinc-500 hover:text-zinc-400">Following</p>
        </div>
      </Link>
      <Link
        href={`/profile/${profile.username}/followers`}
        className=" cursor-pointer"
      >
        <div className="flex gap-1">
          <p>{profile.followers.length}</p>

          <p className="text-zinc-500 hover:text-zinc-400">Followers</p>
        </div>
      </Link>
    </div>
  );
};

export default FollowState;
