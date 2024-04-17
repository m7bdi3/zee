import React from "react";

import { UserCard } from "./profile-card";
interface Props {
  following: {
    users: {
        id: string;
        username: string;
        avatar_url: string | null;
        firstname: string;
        lastname: string;
    } | null;
}[]
  username: string;
}

const FollowingShow =async ({ following, username }: Props) => {

  const currentUserFollowingIds = following.map((follow) => follow.users?.id);
  return (
    <div className="m-4">
      {following.map((user) => (
        <UserCard
          key={user.users?.id}
          user={user.users!}
          username={username}
          isFollowing={currentUserFollowingIds.includes(user.users?.id)}
        />
      ))}
    </div>
  );
};

export default FollowingShow;
