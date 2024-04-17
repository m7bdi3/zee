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
import { EditPostSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { browserClient } from "@/utils/supabase/client";
import { FormError } from "../auth/form-error";
import { usePost } from "@/lib/store/posts";
import { PostWithData } from "@/utils/supabase/types/types";

interface Props {
  post:PostWithData;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setCommentContent: Dispatch<SetStateAction<string>>;
}

const PostEditForm = ({
  post,
  setIsEditing,
  setCommentContent,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const supabase = browserClient();
  const optimisticUpdatePost = usePost((state) => state.optimisticUpdatePost);

  const form = useForm<z.infer<typeof EditPostSchema>>({
    resolver: zodResolver(EditPostSchema),
    defaultValues: {
      postId: post.id,
      content: post.content,
    },
  });
  const editPost = async (values: z.infer<typeof EditPostSchema>) => {
    if (values.content) {
      optimisticUpdatePost({
        ...post,
        content:values.content,
        isEdited: true,
      } as PostWithData);
      const { error } = await supabase
        .from("posts")
        .update({
          title: values.title,
          content: values.content,
          isEdited: true,
        })
        .eq("id", values.postId);
      if (error) {
        return { error: error.message };
      }
    } else {
    }
  };
  const onSubmit = (values: z.infer<typeof EditPostSchema>) => {
    setError("");

    startTransition(() => {
      editPost(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          } else {
            setCommentContent(values.content!);
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
                  <FormControl>
                    <Textarea
                      placeholder={
                        form.formState.errors.content?.message
                          ? form.formState.errors.content?.message
                          : post.content
                      }
                      className="resize-none border border-none bg-background text-base ring-offset-background placeholder:text-muted-foreground rounded-b-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isPending}
                      rows={2}
                    />
                  </FormControl>
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

export default PostEditForm;
