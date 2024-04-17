"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProfileCoverImage } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useUser } from "@/lib/store/user";
import { FormError } from "../auth/form-error";
import { browserClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
  username: string;
}

const ProfileCoverUpload = ({ onClose, username }: Props) => {
  const [isPending, startTransition] = useTransition();
  const supabase = browserClient();
  const user = useUser((state) => state.user);
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof ProfileCoverImage>>({
    resolver: zodResolver(ProfileCoverImage),
    defaultValues: {
      imageUrl: "",
    },
  });
  const imageUrl = form.watch("imageUrl");

  const updateProfileCover = async (imageUrl: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        cover_url: imageUrl,
      })
      .eq("id", user?.id!);
    if (error) {
      return { error: error.message };
    }
  };
  const onSubmit = (values: z.infer<typeof ProfileCoverImage>) => {
    setError("");

    const result = ProfileCoverImage.safeParse(values);
    if (!result.success) {
      setError("Validation failed");
      return;
    }

    startTransition(() => {
      updateProfileCover(values.imageUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          form.reset();
          onClose();
          router.refresh();
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full items-center justify-center gap-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full mt-2">
                <FormControl className="w-full h-full">
                  <FileUpload
                    endPoint="ProfileCoverImage"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        {imageUrl && (
          <Button
            type="submit"
            variant="default"
            disabled={isPending || !imageUrl}
            className="w-full"
          >
            Upload
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ProfileCoverUpload;
