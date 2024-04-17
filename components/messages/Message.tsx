import { Imessage, useMessage } from "@/lib/store/messages";
import React from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/store/user";

export default function Message({ message }: { message: Imessage }) {
  const user = useUser((state) => state.user);

  const fileType = message.file_url?.split(".").pop();

  const isPDF = fileType === "pdf" && message.file_url;
  const isImage = !isPDF && message.file_url;
  return (
    <div className="flex gap-2">
      <div>
        <Image
          src={message.senderProfile?.avatar_url!}
          alt={message.senderProfile?.username!}
          width={40}
          height={40}
          className=" rounded-full ring-2"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{message.senderProfile?.username}</h1>

            <h1 className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(message.created_at!), {
                addSuffix: true,
              })}
            </h1>
            {message.is_edit && (
              <h1 className="text-sm text-gray-400">edited</h1>
            )}
          </div>
          {message.senderProfile?.id === user?.id && (
            <MessageMenu message={message} />
          )}
        </div>
        <div>
          <p className="dark:text-gray-300 ">{message.content}</p>
          {isImage && (
            <a
              href={message.file_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={message.file_url!}
                alt={message.content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message.file_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
