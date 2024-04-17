
import FollowingShow from "@/components/profile/following-page";
import { serverClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
  };
}

const ProfilePage = async ({ params }: Props) => {
  const supabase = serverClient();
  const { username } = params;
  const {data:userProfile,error:profileError} = await supabase
  .from("profiles")
  .select("*")
  .eq("username", username)
  .single();
if (!userProfile || profileError) {
  return notFound();
}
 const { data: following, error: followingError } = await supabase
  .from("follow")
  .select("users:profiles!public_follow_following_id_fkey(id, username, avatar_url,firstname,lastname)")
  .eq("follower_id", userProfile.id!);

  if (!following || following!.length === 0) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <h1>{username} is not following anyone...</h1>
      </div>
    );
  }

  return <FollowingShow following={following} username={username}/>;
};

export default ProfilePage;
