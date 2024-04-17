import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import InitUser from "@/lib/store/initUser";
import { serverClient } from "@/utils/supabase/server";
import { HeaderNavbar } from "@/components/navbar/navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import InitTopics from "@/lib/store/initTopics";
import InitPosts from "@/lib/store/initPosts";
import {
  PostWithData,
  conversationWithData,
} from "@/utils/supabase/types/types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zee",
  description: "Your next social platform",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = serverClient();
  const { data: topicData } = await supabase.from("topics").select("*");
  const { data: PostData, error } = await supabase
    .from("posts")
    .select(
      `*,user:profiles!userId(username,avatar_url,firstname,lastname), likes:likes!post_id (
        id,
        user_id,
        user:profiles!user_id (
          username,
          avatar_url,
          firstname,
          lastname
        )
      ),comments:comments!post_id (
        *,
        user:profiles!user_id (
          username,
          avatar_url,
          firstname,
          lastname
        ),likes:likes!comment_id (
          id,
          user_id,
          user:profiles!user_id (
            username,
            avatar_url,
            firstname,
            lastname
          )
        )
      )`
    )
    .order("created_at", { ascending: false })
    .limit(5);
  const adjustedPosts = PostData!.map((post) => {
    const user = Array.isArray(post.user) ? post.user[0] : post.user;
    return {
      ...post,
      user,
    };
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversations } = await supabase.from("conversations").select(
    `
      *, 
      memberOne:profiles!member_one (id, username, avatar_url, firstname, lastname),  
      memberTwo:profiles!member_two (id, username, avatar_url, firstname, lastname),
      latest_message:messages!latest_message (content,created_at, senderProfile:profiles!public_messages_sender_id_fkey(id, username, avatar_url, firstname, lastname))
    `
  );
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn(inter.className)}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="mx-auto max-w-[1400px] max-h-full">
              <HeaderNavbar
                className="grid py-2 bg-primary dark:bg-card shadow-lg"
                conversations={
                  conversations as unknown as conversationWithData[]
                }
              />
              {children}
              <Toaster position="top-center" />
              <InitTopics topics={topicData! || undefined} />

              <InitPosts
                posts={
                  (adjustedPosts! as unknown as PostWithData[]) || undefined
                }
              />
              <InitUser user={user || undefined} />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
