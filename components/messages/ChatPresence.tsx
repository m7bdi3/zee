"use client";

import { useUser } from "@/lib/store/user";
import { browserClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

export default function ChatPresence({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const supabase = browserClient();
  const [onlineUsers, setOnlineUsers] = useState([""]);
  const user = useUser((state) => state.user);
  useEffect(() => {
    const channel = supabase.channel(conversationId);
   
    channel
      .on("presence", { event: "sync" }, () => {
        const userIds = [];
        for (const id in channel.presenceState()) {
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }
        console.log(channel.presenceState());
        setOnlineUsers([...new Set(userIds)]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  // eslint-disable-next-line
  }, [user]);

  const userPrecence = onlineUsers.includes(userId);
  if (!user) {
    return <div className=" h-3 w-1"></div>;
  }

  return (
    <>
      {userPrecence === true && (
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </>
  );
}
