"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProfileBio } from "@/schemas";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUser } from "@/lib/store/user";
import { PencilLine } from "lucide-react";
import { browserClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";

interface Props {
  bio: string;
  userId: string;
}

const BioEditForm = ({ bio, userId }: Props) => {
  const user = useUser((state) => state.user);
  const supabase = browserClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);
  const form = useForm<z.infer<typeof ProfileBio>>({
    resolver: zodResolver(ProfileBio),
    defaultValues: {
      bio: bio,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const updateBio = async (values: z.infer<typeof ProfileBio>) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        bio: values.bio,
      })
      .eq("id", userId);
    if (error) {
      return { error: error.message };
    }
  };
  const onSubmit = (values: z.infer<typeof ProfileBio>) => {
    setError("");

    const result = ProfileBio.safeParse(values);
    if (!result.success) {
      setError("Validation failed");
      return;
    }
    startTransition(() => {
      updateBio(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          form.reset();
          setIsEditing(false);
          revalidatePath(`/profile/${user?.user_metadata.username}`);
          console.log(`/profile/${user?.user_metadata.username}`)
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  useEffect(() => {
    form.reset({
      bio: bio,
    });
  }, [bio, form]);
  return (
    <>
      {!isEditing && (
        <div className="flex w-full bg-muted rounded-md p-4 items-center">
          <p className="font-base flex-1">{bio}</p>
          {user?.id === userId && (
            <PencilLine
              className="h-5 w-5 text-accent cursor-pointer"
              onClick={() => {
                setIsEditing(true);
              }}
            />
          )}
        </div>
      )}
      {isEditing && user?.id === userId && (
        <Form {...form}>
          <div className="w-full">
            <form
              className="flex items-center w-full gap-x-2 pt-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited bio"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} size="sm" variant="default">
                Save
              </Button>
            </form>
            <span className="text-[10px] mt-1 text-zinc-400">
              Press escape to cancel, enter to save
            </span>
          </div>
        </Form>
      )}
    </>
  );
};

export default BioEditForm;
