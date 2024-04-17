"use client";

import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EditCommentSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormError } from "../auth/form-error";
import { browserClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/user";

interface Props {
  commentId: string;
  content: string;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setCommentContent: Dispatch<SetStateAction<string | undefined>>;
}

const CommentEditForm = ({
  commentId,
  content,
  setIsEditing,
  setCommentContent,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const supabase = browserClient();
  const { user } = useUser((state) => state);
  const form = useForm<z.infer<typeof EditCommentSchema>>({
    resolver: zodResolver(EditCommentSchema),
    defaultValues: {
      CommentId: commentId,
      content: content,
    },
  });

  const editComment = async (values: z.infer<typeof EditCommentSchema>) => {
    const { error } = await supabase
      .from("comments")
      .update({
        content: values.content,
        is_edited: true,
      })
      .eq("id", commentId)
      .eq("user_id", user?.id!);
    if (error) {
      return { error: error.message };
    }
  };

  const onSubmit = (values: z.infer<typeof EditCommentSchema>) => {
    setError("");

    startTransition(() => {
      editComment(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          } else {
            setCommentContent(values.content);
            setIsEditing(false);
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <div className="w-full p-0 m-0 flex flex-col justify-center items-end">
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
                      placeholder={content}
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
            Edit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentEditForm;
