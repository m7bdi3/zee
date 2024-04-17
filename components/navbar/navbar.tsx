"use client";
import Link from "next/link";
import React, { useEffect } from "react";

import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "../ui/button";
import logout from "@/actions/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarMenu } from "./navbarMenu";
import SearchModal from "./search";
// import NotificationCenter from "./notificationCenter";
import { useRouter } from "next/navigation";
// import MainMessages from "../messages/main-messages";
import { useUser } from "@/lib/store/user";
import { UserAvatar } from "../userAvater";
import { revalidatePath } from "next/cache";
import { browserClient } from "@/utils/supabase/client";
import NotificationCenter from "./notificationCenter";
import MainMessages from "../messages/main-messages";
import { conversationWithData } from "@/utils/supabase/types/types";

interface Props {
  className?: string;
  conversations: conversationWithData[];
}

export const HeaderNavbar = ({ className, conversations }: Props) => {
  const user = useUser((state) => state.user);
  const supabase = browserClient();
  const [profileLink, setProfileLink] = React.useState("");
  const fethcusername = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id!)
      .single();
    setProfileLink(data?.username!);
  };
  useEffect(() => {
    fethcusername();
  });

  const router = useRouter();
  const username = user?.user_metadata.username
    ? user?.user_metadata.username
    : user?.user_metadata.name;
  let userImage;

  if (user) {
    userImage = user?.user_metadata.avatar_url;
  }

  const onClick = () => {
    logout();
    revalidatePath("/", "layout");
  };
  return (
    <nav className={className}>
      <div className="grid grid-cols-3 grid-rows-1 gap-2 items-center mx-4">
        <div className="flex z-10">
          <NavbarMenu />
          <Link href="/" className="flex justify-center items-center">
            <p className="font-extrabold text-4xl text-[#f8f3ed] z-100">Z</p>
          </Link>
        </div>
        <span></span>
        <div className="flex justify-end gap-4 items-center z-10">
          <SearchModal />
          {user && (
            <MainMessages
              conversations={conversations as conversationWithData[]}
            />
          )}
          {user && <NotificationCenter />}
          {!user && (
            <Button
              variant={"outline"}
              className="rounded"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          )}

          {user?.id && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full h-fit w-fit">
                  <UserAvatar src={userImage} className="h-10 w-10 ring-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-1">
                  <DropdownMenuLabel>{username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(`/profile/${profileLink}`);
                    }}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push(`/settings`);
                    }}
                    className="cursor-pointer"
                  >
                    Settings
                  </DropdownMenuItem>

                  <ThemeSwitcher />
                  <DropdownMenuItem
                    className="text-destructive hover:bg-destructive hover:text-red-50 cursor-pointer"
                    onClick={onClick}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
