"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PostSchema } from "@/schemas";
import { browserClient } from "@/utils/supabase/client";
import ImageView from "../ImageView";
import { FormError } from "@/components/auth/form-error";
import { FileButtonUpload } from "../file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MapPin, SendIcon } from "lucide-react";
import SlugSelect from "./SlugSelect";
import { usePost } from "@/lib/store/posts";
import { PostWithData } from "@/utils/supabase/types/types";

interface Props {
  slug?: string;
  isHome: boolean;
}

const PostCreateForm = ({ slug, isHome }: Props) => {
  const supabase = browserClient();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [SlugValue, setSlugValue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [reset, setReset] = useState(false);

  const { addPost, setOptimisticIds } = usePost((state) => state);

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: "",
      slug: isHome ? slug : "",
      imageUrl: "",
    },
  });

  const handleSlugChange = (value: string) => {
    if (!isHome) {
      setSlugValue(value);
    }
  };
  const id = uuidv4();
  const onPostSubmit = async (values: z.infer<typeof PostSchema>) => {
    const { data } = await supabase
      .from("topics")
      .select("id")
      .eq("slug", values.slug)
      .single();
    const dataP = {
      id: id,
      content: values.content,
      slug: values.slug,
      imageUrl: values.imageUrl,
      topicId: data!.id,
    };
    const { error } = await supabase.from("posts").insert([dataP]);
    if (error) {
      return { error: error.message };
    } else {
      const { data: PostData } = await supabase
        .from("posts")
        .select(
          "*,user:profiles!userId(username,avatar_url,firstname,lastname)"
        )
        .eq("id", id)
        .single();

      const adjustedPostData = {
        ...PostData,
        user: Array.isArray(PostData!.user)
          ? PostData!.user[0]
          : PostData!.user,
      };

      addPost(adjustedPostData as PostWithData);
      setOptimisticIds(id);
    }
  };

  const handleImageUpload = (newImageUrl?: string) => {
    if (newImageUrl) {
      setImages((prevImages) => [...prevImages, newImageUrl]);
    }
  };

  useEffect(() => {
    form.setValue("imageUrl", images.join(","));
  }, [images, form]);

  useEffect(() => {
    const slugValue = isHome ? slug : SlugValue;
    form.setValue("slug", slugValue!, { shouldDirty: true });
  }, [SlugValue, slug, form, isHome]);

  const onSubmit = (values: z.infer<typeof PostSchema>) => {
    setError("");
    const result = PostSchema.safeParse(values);
    if (!result.success) {
      setError("Validation failed");
      return;
    }
    startTransition(() => {
      onPostSubmit(values)
        .then(async (data) => {
          if (data?.error) {
            setError(data?.error);
          }
          form.reset();
          setImages([]);
          setSlugValue("");
          setReset(true);
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 w-full break-words"
      >
        <div>
          <div className="flex w-full h-full gap-2">
            <div className="flex-1">
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
                            : "What's on your mind?"
                        }
                        className="resize-none border border-none bg-background text-base ring-offset-background placeholder:text-muted-foreground  rounded-b-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={isPending}
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <ImageView images={images} setImages={setImages} />
            </div>
          </div>
        </div>
        <FormError message={error} />
        <Separator />
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 flex w-full items-center gap-2">
            {isHome && (
              <FormField
                control={form.control}
                name="slug"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <SlugSelect
                        onSlugChange={handleSlugChange}
                        resetKey={reset}
                        error={form.formState.errors.slug?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormControl className="rounded-md">
                    <FileButtonUpload
                      endPoint="PostImage"
                      value=""
                      onChange={handleImageUpload}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MapPin className="h-5 w-5 text-foreground hover:scale-110" />
          </div>
          <div>
            <div className="self-end justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={isPending}
                size={"icon"}
                className="bg-accent hover:bg-accent rounded-md"
              >
                <SendIcon className="h-5 w-5 text-white hover:scale-110" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PostCreateForm;
