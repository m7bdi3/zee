'use server'
import React from "react";
import { redirect } from "next/navigation";
import { serverClient } from "@/utils/supabase/server";
import ConversationWithMessage from "@/components/messages/conversation-w-message";
import { conversationWithData } from "@/utils/supabase/types/types";

export default async function Page() {
  const supabase = serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return redirect("/login");
  }
 
  let { data, error } = await supabase
    .from("conversations")
    .select(
      `
      *, 
      memberOne:profiles!member_one (id, username, avatar_url, firstname, lastname),  
      memberTwo:profiles!member_two (id, username, avatar_url, firstname, lastname),
      latest_message:messages!latest_message (content,created_at, senderProfile:profiles!public_messages_sender_id_fkey(id, username, avatar_url, firstname, lastname))
    `
    )
    .or(`member_one.eq.${user.id},member_two.eq.${user.id}`);
  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-center w-full h-full">
      {data!.map((conversation) => (
        <ConversationWithMessage
          key={conversation.id}
          conversation={conversation as any}
        />
      ))}
    </div>
  );
}
