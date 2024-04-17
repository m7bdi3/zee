import FollowingShow from "@/components/profile/following-page";
import { serverClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
interface Props {
  params: {
    username: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const { username } = params;
  const supabase = serverClient();
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (!userProfile || profileError) {
    return notFound();
  }
  const { data: followers, error: followingError } = await supabase
    .from("follow")
    .select(
      "users:profiles!public_follow_follower_id_fkey(id, username, avatar_url,firstname,lastname)"
    )
    .eq("following_id", userProfile.id!);

  if (followers!.length === 0 || followingError) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <h1>{username} is not followed by anyone...</h1>
      </div>
    );
  }

  return <FollowingShow following={followers!} username={username} />;
};

export default ProfilePage;
