import React from "react";

import ChatInput from "@/components/messages/ChatInput";
import ChatMessages from "@/components/messages/ChatMessages";

import { redirect } from "next/navigation";
import ChatHeader from "@/components/messages/chatHeader";
import Conversations from "@/components/messages/conversations";
import { MediaRoom } from "@/components/media-room";
import { serverClient } from "@/utils/supabase/server";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    video?: boolean;
  };
}
export default async function Page({ params, searchParams }: Props) {
  const supabase = serverClient();
  const { id } = params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return redirect("/login");
  const { data } = await supabase
    .from("conversations")
    .select(
      `
    *,
    memberOne:profiles!member_one (id, username, avatar_url, firstname, lastname),  
    memberTwo:profiles!member_two (id, username, avatar_url, firstname, lastname)
  `
    )
    .eq("id", id)
    .single();

  if (!data) {
    return redirect("/");
  }
  const memberOne = Array.isArray(data.memberOne)
    ? data.memberOne[0]
    : data.memberOne;
  const memberTwo = Array.isArray(data.memberTwo)
    ? data.memberTwo[0]
    : data.memberTwo;

  const receiverProfile = memberOne.id === user?.id ? memberTwo : memberOne;

  return (
    <>
      <div className="w-full h-[94vh] flex">
        <div className="h-full bg-card">
          <Conversations />
        </div>
        <div className=" h-full border flex flex-col relative flex-1">
          <ChatHeader conversationId={data.id} profile={receiverProfile} />

          {searchParams.video && (
            <MediaRoom chatId={data.id} video={true} audio={true} />
          )}
          {!searchParams.video && (
            <>
              <ChatMessages conversationId={data.id} />
              <ChatInput
                conversationId={data.id}
                receiverId={receiverProfile.id}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
