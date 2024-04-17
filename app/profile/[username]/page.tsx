import ProfileHeader from "@/components/profile/profile-header";
import InitProfile from "@/lib/store/initProfile";
import { serverClient } from "@/utils/supabase/server";
import {
  PostWithData,
  PostsLikedByUser,
  profile,
} from "@/utils/supabase/types/types";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const supabase = serverClient();
  const user = await supabase.auth.getUser();
  const { username } = params;
  const {data:userProfile,error:profileError} = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (!userProfile || profileError) {
    return notFound();
  }
  const userId = user.data.user?.id!;

  const { data: followers, error: followersError } = await supabase
  .from("follow")
  .select("follower_id:profiles!public_follow_follower_id_fkey(id, username, avatar_url)")
  .eq("following_id", userProfile.id!);


if (followersError) {
  console.error(followersError);
  return
}

const followerProfiles = followers.map(follow => follow.follower_id);

// Fetch all following
const { data: following, error: followingError } = await supabase
  .from("follow")
  .select("following_id:profiles!public_follow_following_id_fkey(id, username, avatar_url)")
  .eq("follower_id", userProfile.id!);


if (followingError) {
  console.error(followingError);
  return;
}

// Extract following profiles
const followingProfiles = following.map(follow => follow.following_id);

// Now you can combine this data with the userProfile
const profileWithFollowData = {
  ...userProfile,
  followers: followerProfiles,
  following: followingProfiles
};
  const posts = await supabase
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
    .eq("userId", userProfile.id!);
  const postsLikedByUser = await supabase
    .from("likes")
    .select(
      `*,
      posts!inner(*,user:profiles!userId(username,avatar_url,firstname,lastname), likes:likes!post_id (
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
      ))
    `
    )
    .eq("user_id", userProfile.id!);

  const { data, error } = await supabase
    .from("follow")
    .select("*")
    .or(
      `and(follower_id.eq.${user.data.user?.id},following_id.eq.${userProfile.id!}),and(follower_id.eq.${userProfile.id!},following_id.eq.${user.data.user?.id})`
    );
  const isFollowing = data && data.length > 0;
  return (
    <>
      <InitProfile profile={profileWithFollowData!} />
      <ProfileHeader
        posts={posts.data as unknown as PostWithData[]}
        postsLiked={postsLikedByUser.data as unknown as PostsLikedByUser[]}
        isFollowing={!!isFollowing}
      />
    </>
  );
};

export default ProfilePage;
