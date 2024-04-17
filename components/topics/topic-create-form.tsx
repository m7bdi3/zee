"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TopicSchema } from "@/schemas";
import { CreateTopic } from "@/actions/Topics/createTopic";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { FormError } from "@/components/auth/form-error";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import {FileUpload} from "../file-upload";
import { useTopic } from "@/lib/store/topics";
import { Topic } from "@/utils/supabase/types/types";

const TopicCreateForm = () => {
  const [isPending, startTransition] = useTransition();
  const addTopic = useTopic((state) => state.addTopic);

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof TopicSchema>>({
    resolver: zodResolver(TopicSchema),
    defaultValues: {
      slug: "",
      description: "",
      imageUrl:''
    },
  });

  const onSubmit = (values: z.infer<typeof TopicSchema>) => {
    setError("");
    startTransition(() => {
      addTopic(values as unknown as Topic)
      CreateTopic(values)
        .then((data) => {
          if (data.error) {
            setError(data.error); 
          } else {
            form.reset();
            router.push(`/topics/${values.slug}`);
          }
        })
        .catch((error) => {
          console.error("Submission error:", error);
          setError("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full break-words"
      >
        <div className="space-y-4">
     
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormControl className="rounded-md">
                  <Input
                    placeholder="Topic Name"
                    {...field}
                    disabled={isPending}
                    className="bg-card"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl className="rounded-md">
                  <Input
                    placeholder="Description"
                    {...field}
                    disabled={isPending}
                    className="bg-card h-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
             <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl className="rounded-md">
                  <FileUpload
                  endPoint='topicImage'
                  value={field.value}
                  onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && <FormError message={error} />}
        <Button type="submit" variant="default" disabled={isPending}>
          Create
        </Button>
      </form>
    </Form>
  );
};

export default TopicCreateForm;
