"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { serverClient } from "@/utils/supabase/server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "./getUserInfo";

export async function login(values: z.infer<typeof LoginSchema>) {
  const supabase = serverClient();
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }
  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Invalid credentials" };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
