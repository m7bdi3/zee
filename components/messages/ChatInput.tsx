"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Imessage, useMessage } from "@/lib/store/messages";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { EmojiPicker } from "@/components/emoji-picker";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FileButtonUpload } from "@/components/file-upload";
import Image from "next/image";
import { useUser } from "@/lib/store/user";
import { browserClient } from "@/utils/supabase/client";

interface ImageProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageView = ({ images, setImages }: ImageProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full shadow-sm ml-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={image}
              alt={`Uploaded image ${index + 1}`}
              layout="fill"
              className="rounded-md "
            />
            <button
              onClick={() => setImages(images.filter((_, i) => i !== index))}
              className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

interface Props {
  conversationId: string;
  receiverId: string;
}

const formSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.optional(z.string().min(1)),
});
export default function ChatInput({ conversationId, receiverId }: Props) {
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const session = useUser((state) => state.user);
  const supabase = browserClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const handleImageUpload = (newImageUrl?: string) => {
    if (newImageUrl) {
      setImages((prevImages) => [...prevImages, newImageUrl]);
    }
  };

  useEffect(() => {
    form.setValue("fileUrl", images.join(","));
  }, [images, form]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const values = {
        content: e.currentTarget.value,
        fileUrl: images.join(","),
      };
      await onSubmit(values);
      form.reset();
      setImages([]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.content.trim() || values.fileUrl) {
      const id = uuidv4();
      const newMessage = {
        id,
        content: values.content,
        sender_id: session?.id!,
        created_at: new Date().toISOString(),
        is_edit: false,
        file_url: values.fileUrl,
        conversation_id: conversationId,
        senderProfile: {
          id: session?.id!,
          avatar_url: session?.user_metadata.avatar_url,
          username: session?.user_metadata.username,
          firstname: session?.user_metadata.firstname,
          lastname: session?.user_metadata.lastname,
        },
      };
      addMessage(newMessage as unknown as Imessage);
      setOptimisticIds(newMessage.id);
      const { data, error } = await supabase.from("messages").insert({
        id,
        conversation_id: conversationId,
        content: values.content,
        file_url: values.fileUrl,
        sender_id: session?.id!,
        receiver_id: receiverId,
      });
      form.reset();
      setImages([]);
      if (error) {
        toast.error(error.message);
    
      }
    } else {
      toast.error("Message can not be empty");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileButtonUpload
                              endPoint="messageFile"
                              value=""
                              onChange={handleImageUpload}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Input
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={"send message"}
                      {...field}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="absolute top-7 right-8">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <ImageView images={images} setImages={setImages} />
        </form>
      </Form>
    </>
  );
}
