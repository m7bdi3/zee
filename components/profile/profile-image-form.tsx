"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProfileImage } from "@/schemas";
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

interface Props {
  onClose: () => void;
}

const ImageUploadForm = ({ onClose }: Props) => {
  const [isPending, startTransition] = useTransition();
  const user = useUser((state) => state.user);
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof ProfileImage>>({
    resolver: zodResolver(ProfileImage),
    defaultValues: {
      imageUrl: "",
    },
  });
  const imageUrl = form.watch("imageUrl");

  const onSubmit = (values: z.infer<typeof ProfileImage>) => {
    // setError("");

    // const result = ProfileImage.safeParse(values);
    // if (!result.success) {
    //   setError("Validation failed");
    //   return;
    // }

    // startTransition(() => {
    //   updateProfileImage(values.imageUrl, session?.data?.user.id!)
    //     .then((data) => {
    //       if (data?.error) {
    //         setError(data.error);
    //       }
    //       form.reset();
    //       onClose();
    //       session.update();
    //     })
    //     .catch(() => {
    //       setError("Something went wrong");
    //     });
    // });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="flex w-full items-center justify-center gap-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full mt-2">
                <FormControl className="w-full h-full">
                  <FileUpload
                    endPoint="ProfileImage"
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

export default ImageUploadForm;
