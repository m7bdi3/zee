"use client";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import Navabarmessages from "../navbar/navbar-messages";
import Link from "next/link";
import { conversationWithData } from "@/utils/supabase/types/types";

interface props {
  conversation: conversationWithData
}

const MessagesBody = ({ conversation }: props) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger className="h-fit p-0 m-0 flex items-center">
        <MessageSquare className="h-7 w-7 text-white" />
      </PopoverTrigger>
      <PopoverContent className="h-[400px] w-[400px] mr-5 flex flex-col justify-between">
        <ScrollArea>
          <Navabarmessages conversation={conversation} />
        </ScrollArea>
        <div>
          <Link href={`/messages`}>
            <p className="text-center text-sm text-accent">Show all messages</p>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MessagesBody;
