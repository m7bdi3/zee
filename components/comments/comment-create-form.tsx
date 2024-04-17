"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CommentSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "../auth/form-error";
import { browserClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/user";
import { useRouter } from "next/navigation";

interface CommentCreateFormProps {
  postId: string;
  parentId?: string;
  startOpen: boolean;
}

const CommentCreateForm = ({
  postId,
  parentId,
  startOpen,
}: CommentCreateFormProps) => {
  const supabase = browserClient();
  const { user } = useUser((state) => state);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(startOpen);
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();
  useEffect(() => {
    setOpen(startOpen);
  }, [startOpen]);
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      postId: postId,
      parentId: parentId,
      content: "",
    },
  });

  const onCommentSubmit = async (values: z.infer<typeof CommentSchema>) => {
    const { error } = await supabase.from("comments").insert({
      content: values.content,
      post_id: postId,
      parent_id: parentId,
      user_id: user?.id!,
    });
    if (error) {
      return { error: error.message };
    }
  };

  const onSubmit = (values: z.infer<typeof CommentSchema>) => {
    setError("");
    startTransition(() => {
      onCommentSubmit(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          form.reset();
          router.refresh();
          setOpen(false);
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <div className="w-full p-0 m-0 flex flex-col justify-center items-end">
      {open && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className=" space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="rounded-md">
                        <Textarea
                          placeholder="Comment..."
                          {...field}
                          disabled={isPending}
                          className="bg-background"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <Button
                type="submit"
                className="mt-2"
                variant="default"
                disabled={isPending}
              >
                Reply
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default CommentCreateForm;
