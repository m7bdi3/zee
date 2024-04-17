"use client";
import { useUser } from "@/lib/store/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  conversations:
    | {
        id: string;
        memberOneId: string;
        memberTwoId: string;
        memberOne: {
          id: string;
          username: string;
          avatar_url: string | null;
          firstname:string;
          lastname:string;
        }[];
        memberTwo: {
          id: string;
          username: string;
          avatar_url: string | null;
          firstname:string;
          lastname:string;
        }[];
      }[]
    | null;
}
export default function ConversationsSidebar({ conversations }: Props) {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const currentUserId = user?.id;
  if (!conversations) {
    return null;
  }
  return (
    <div className="w-16 lg:w-16 hover:w-64  h-full  overflow-hidden transition-all duration-300 ease-in-out group">
      {conversations.map((conversation) => {
        const memberOne = Array.isArray(conversation.memberOne)
          ? conversation.memberOne[0]
          : conversation.memberOne;
        const memberTwo = Array.isArray(conversation.memberTwo)
          ? conversation.memberTwo[0]
          : conversation.memberTwo;
        const partner = memberOne.id === currentUserId ? memberTwo : memberOne;
        return (
          <div
            key={conversation.id}
            className="flex hover:flex-grow items-center p-2 hover:bg-muted cursor-pointer transition-all duration-300 ease-in-out rounded-md"
            onClick={() => {
              router.push(`/messages/${conversation.id}`);
            }}
          >
            <Image
              src={partner.avatar_url || "Z"}
              alt={partner.username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <>
              <div className="group-hover:flex ml-2 hover:min-w-0 overflow-hidden hidden">
                <p className="text-zinc-600 dark:text-zinc-400 truncate">
                  @{partner.username}
                </p>
              </div>
            </>
          </div>
        );
      })}
    </div>
  );
}
