"use client";
import React from "react";
import ChatPresence from "./ChatPresence";
import { ChatVideoButton } from "./chat-video-button";
import Link from "next/link";
import { UserAvatar } from "../userAvater";

interface Props {
  conversationId: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  };
}
export default function ChatHeader({ conversationId, profile }: Props) {
  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <Link href={`/profile/${profile.username}`}>
          <div className="flex gap-2 items-center">
            <UserAvatar src={profile.avatar_url!} />
            <h1 className="text-xl font-bold">
              {profile.firstname} {profile.lastname}
            </h1>
            <ChatPresence conversationId={conversationId} userId={profile.id} />
          </div>
        </Link>
        <ChatVideoButton />
      </div>
    </div>
  );
}
