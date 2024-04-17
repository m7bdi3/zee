"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/utils/supabase/server";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail, getUserByUsername } from "./getUserInfo";

export async function signup(values: z.infer<typeof RegisterSchema>) {
  const supabase = serverClient();
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { firstName, lastName, avatar_url, name, email, password } =
    validatedFields.data;

  const existingUserEmail = await getUserByEmail(email);
  const existingUserName = await getUserByUsername(name);
  if (existingUserEmail) {
    return { error: "Email already exists" };
  }
  if (existingUserName) {
    return { error: "Username already exists" };
  }
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        firstname: firstName,
        lastName: lastName,
        username: name,
        avatar_url: avatar_url,
      },
    },
  });
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  return { success: "Email sent successfully" };
}
