"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { UserAvatar } from "../userAvater";
import { useTopic } from "@/lib/store/topics";

export function TopicsScrollArea() {
  const {topic} = useTopic((state)=> state)
  const router = useRouter();
  return (
    <div className="h-full rounded-md mt-4">
      <div>
        <Command>
          <CommandInput
            placeholder="Search topics..."
            className="h-9 w-full"
            autoFocus={false}
          />
          <CommandEmpty>No topics found.</CommandEmpty>
          <ScrollArea className="h-full w-full rounded-md border mt-2">
            <CommandList>
              <CommandGroup>
                <div className="w-full">
                  {topic.map((topic) => (
                    <CommandItem
                      key={topic.id}
                      value={topic.slug}
                      onSelect={() => {
                        router.push(`/topics/${topic.slug}`);
                      }}
                      className="w-full p-[0.15rem] border-b"
                    >
                      <div className="w-full flex items-center gap-2 hover:bg-accent hover:text-accent-foreground p-1 pl-2 rounded-md">
                        <UserAvatar src={topic.image} className="h-5 w-5" />
                        <p className="text-base font-medium break-words overflow-hidden">
                          z/{topic.slug}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </div>
    </div>
  );
}
