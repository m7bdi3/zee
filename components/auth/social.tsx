"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { browserClient } from "@/utils/supabase/client";
export const Social = () => {
  const supabase = browserClient();
  const onClick = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="flex justify-between items-center gap-4">
        <Separator className="w-16" />
        <p className="w-full">or continue with</p>
        <Separator className="w-16" />
      </div>
      <div className="flex items-center w-full gap-x-2">
        <Button
          size="lg"
          className="w-full gap-2"
          variant="outline"
          onClick={() => onClick("google")}
        >
          <FcGoogle className="h-5 w-5" />
          Google
        </Button>
        <Button
          size="lg"
          className="w-full gap-2"
          variant="outline"
          onClick={() => onClick("github")}
        >
          <FaGithub className="h-5 w-5" />
          Github
        </Button>
      </div>
    </div>
  );
};
