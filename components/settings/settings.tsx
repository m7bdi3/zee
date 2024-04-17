"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { SettingsSchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { browserClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/user";
import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";

interface Props {
  settingsUser: {
    avatar_url: string | null;
    bio: string | null;
    cover_url: string | null;
    email: string;
    firstname: string;
    id: string;
    lastname: string;
    username: string;
  };
}

const SettingPage = ({ settingsUser }: Props) => {
  const supabase = browserClient();
  const user = useUser((state) => state.user);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: settingsUser.username || undefined,
      firstName: settingsUser.firstname || undefined,
      lastName: settingsUser.lastname || undefined,
      email: settingsUser.email || undefined,
    },
  });
  const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const validatedFields = SettingsSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.app_metadata.provider !== "email") {
      values.email = undefined;
      values.newPassword = undefined;
    }

    if (values.email && values.email !== user?.email) {
      const { data: existingUserEmail, error: existingUserEmailError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("email", values.email!)
          .single();

      if (existingUserEmail && existingUserEmail.id !== user?.id) {
        return { error: "Email already in use!" };
      }
    }

    const { data: existingUserName } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", values.name!)
      .single();

    if (existingUserName) {
      return { error: "Username already in use!" };
    }

    const { data: Profile, error: ProfileError } = await supabase
      .from("profiles")
      .update({
        username: values.name,
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
      })
      .eq("id", settingsUser.id);

    const { data, error } = await supabase.auth.updateUser({
      email: values.email,
      password: values.newPassword,
      data: {
        username: values.name,
        firstname: values.firstName,
        lastname: values.lastName,
      },
    });

    if (ProfileError) {
      return { error: ProfileError.message };
    }
    if (error) {
      return { error: error.message };
    }
    if (data) {
      return { success: "Email verification sent" };
    }
    return { success: "Profile updated" };
  };
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="w-[80%]">
      <Card className="w-full h-full flex flex-col justify-between">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Account Settings</p>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 mt-2">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>User Name</FormLabel>
                      <FormControl className="flex-1 w-full">
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
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
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.app_metadata.provider === "email" && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="john.doe@example.com"
                              type="email"
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex w-full justify-end">
                <Button disabled={isPending} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        {user?.app_metadata.provider !== "email" && (
          <p className="text-xs text-zinc-500 text-center p-1">
            users signed with OAuth can&apos;t change their email nor password
          </p>
        )}
      </Card>
    </div>
  );
};

export default SettingPage;
