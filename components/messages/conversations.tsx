import { redirect } from "next/navigation";
import React from "react";
import ConversationsSidebar from "./conversationsSidebar";
import { serverClient } from "@/utils/supabase/server";

export default async function Conversations() {
  const supabase = serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return redirect("/login");
  const { data } = await supabase.from("conversations").select(
    `
    *,
    memberOne:profiles!member_one (id, username, avatar_url, firstname, lastname),  
    memberTwo:profiles!member_two (id, username, avatar_url, firstname, lastname)
  `
  );

  if (!data) {
    return redirect("/");
  }

  return (
    <div className="flex p-2">
      <ConversationsSidebar conversations={data as any} />
    </div>
  );
}
