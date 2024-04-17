"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useEffect, useState, useTransition } from "react";
import { signup } from "@/actions/auth/register";

import { RegisterSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { FileButtonUpload } from "../file-upload";
import Image from "next/image";
import { X } from "lucide-react";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [image, setImage] = useState("");

  const handleImageUpload = (newImageUrl?: string) => {
    if (newImageUrl) {
      setImage(newImageUrl);
    }
  };
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    form.setValue("avatar_url", image);
  }, [image, form]);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      signup(values).then((data) => {
        setSuccess(data.success);
        setError(data.error);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonHref="/login"
      backButtonLabel="Already have an account? Sign in"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full overflow-y-auto"
        >
          <div className=" w-full flex flex-col gap-6 ">
            <div className="flex flex-col w-full items-center justify-between gap-6">
              <div className="relative w-32 h-32 bg-primary rounded-full">
                {image && (
                  <>
                    <Image
                      src={image}
                      alt={`Uploaded avatar`}
                      layout="fill"
                      className="rounded-full "
                    />
                    <button
                      onClick={() => setImage("")}
                      className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                {!image && (
                  <div className="absolute bottom-0 right-0 bg-card rounded-full flex items-center justify-center w-full h-full">
                    <FormField
                      control={form.control}
                      name="avatar_url"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <FileButtonUpload
                              endPoint="RegisterImage"
                              value=""
                              onChange={handleImageUpload}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              <FormLabel>Avatar</FormLabel>
            </div>

            <div className="flex w-full items-center justify-betweeen gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        placeholder="John"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        placeholder="Doe"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full items-center justify-between gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>User Name</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        placeholder="john_doe"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full items-center justify-between gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl className="rounded-md">
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            variant="outline"
            disabled={isPending}
          >
            Create Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
