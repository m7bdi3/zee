import React, { useEffect } from "react";
import { useTopic } from "@/lib/store/topics";
import { UserAvatar } from "../userAvater";
import { cn } from "@/lib/utils";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  onSlugChange: (value: string) => void;
  resetKey: boolean;
  error?: string;
}
export default function SlugSelect({ onSlugChange, resetKey, error }: Props) {
  const [value, setValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const { topic } = useTopic((state) => state);

  const sendSlugToParent = (value: string) => {
    onSlugChange(value);
    setValue(value);
  };

  useEffect(() => {
    if (resetKey) {
      setValue("");
    }
  }, [resetKey]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[280px] justify-between",
            error && !value ? "border-destructive" : ""
          )}
        >
          {value && !resetKey
            ? topic.find((topic) => topic.slug === value)?.slug
            : "Select Topic"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput
            placeholder="Search topics..."
            className="h-9 w-full"
            autoFocus={false}
          />
          <CommandEmpty>No topics found.</CommandEmpty>
          <ScrollArea className=" h-24 w-full rounded-md border mt-2">
            <CommandList>
              <CommandGroup>
                <div className="w-full">
                  {topic.map((topic) => (
                    <CommandItem
                      key={topic.id}
                      value={topic.slug}
                      onSelect={(currentValue) => {
                        sendSlugToParent(
                          currentValue === value ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                      className="w-full p-[0.15rem] border-b"
                    >
                      <div className="w-full flex items-center gap-2 hover:bg-accent hover:text-accent-foreground p-1 pl-2 rounded-md">
                        <UserAvatar src={topic.image} className="h-4 w-4" />
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
      </PopoverContent>
    </Popover>
  );
}
