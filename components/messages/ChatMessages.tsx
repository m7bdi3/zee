import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { serverClient } from "@/utils/supabase/server";

export default async function ChatMessages({
  conversationId,
}: {
  conversationId: string;
}) {
  const supabase = serverClient();

  const { data } = await supabase
    .from("messages")
    .select(
      `*,senderProfile:profiles!public_messages_sender_id_fkey(id, username, avatar_url, firstname, lastname)`
    )
    .eq("conversation_id", conversationId)
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });
  return (
    <Suspense fallback={"loading.."}>
      <ListMessages conversationId={conversationId} />
      <InitMessages messages={(data?.reverse() as any) || []} />
    </Suspense>
  );
}
