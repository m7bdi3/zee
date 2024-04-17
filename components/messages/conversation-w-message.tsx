"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useUser } from "@/lib/store/user";
import { UserAvatar } from "../userAvater";
import { conversationWithData } from "@/utils/supabase/types/types";

interface props {
  conversation: conversationWithData;
}
export default function ConversationWithMessage({ conversation }: props) {
  const session = useUser((state) => state.user);
  const memberOne = Array.isArray(conversation.memberOne)
    ? conversation.memberOne[0]
    : conversation.memberOne;
  const memberTwo = Array.isArray(conversation.memberTwo)
    ? conversation.memberTwo[0]
    : conversation.memberTwo;

  const receiverProfile = memberOne.id === session?.id ? memberTwo : memberOne;
  return (
    <Card className="w-full p-2">
      <Link href={`/messages/${conversation.id}`} className="cursor-pointer">
        <div className="flex w-full items-center gap-4">
          <UserAvatar src={receiverProfile.avatar_url!} className="h-16 w-16" />
          <div>
            <div className="flex gap-2 w-full items-center">
              <p>@{receiverProfile.username}</p>
              <h1 className="text-sm text-gray-400">
                {formatDistanceToNow(
                  new Date(conversation.latest_message.created_at),
                  { addSuffix: true }
                )}
              </h1>
            </div>
            <div className="flex-col w-full ">
              <div className="flex gap-2 w-full items-center">
                <p className="dark:text-gray-300">
                  {conversation.latest_message?.senderProfile?.id ===
                  session?.id
                    ? `You: ${conversation.latest_message?.content}`
                    : conversation.latest_message?.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
