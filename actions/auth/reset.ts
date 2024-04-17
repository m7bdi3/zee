"use server";
import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "./getUserInfo";
import { serverClient } from "@/utils/supabase/server";

export const Reset = async (values: z.infer<typeof ResetSchema>) => {
  const supabase = serverClient();
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }

  if (existingUser) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })
      }

  return { success: "Reset email sent" };
};
