"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { PostDialog } from "../posts/postDialog";
import TopicCreateForm from "../topics/topic-create-form";
import { TopicsScrollArea } from "../topics/topic-scroll-area";
import { Card } from "../ui/card";
import { SquareMenu } from "lucide-react";

export function NavbarMenu() {
  return (
    <div className="grid grid-cols-2 gap-2 lg:hidden md:hidden ">
      <Sheet>
        <SheetTrigger asChild className="h-full w-full">
          <SquareMenu className="h-6 w-6 cursor-pointer" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <Card className="row-span-1 sticky top-[4.5rem] z-10 flex col-span-1 md:col-span-1 lg:col-span-1 rounded-md flex-col shadow py-3 px-2 h-[91vh] w-full">
            <div className="flex justify-between items-center">
              <Link href={"/topics"}>
                <h3 className="pl-2 text-lg font-medium">Topics</h3>
              </Link>
              <PostDialog header="Create topic" button="+">
                <TopicCreateForm />
              </PostDialog>
            </div>
            <div className="h-full">
              <TopicsScrollArea />
            </div>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
}
