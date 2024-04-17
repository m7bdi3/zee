"use server";
import * as z from "zod";

import { ResetPasswordSchema } from "@/schemas";
import { serverClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const newPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const supabase = serverClient();

  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;

  
  const {  error } = await supabase.auth
    .updateUser({
      password: password,
    })
    
    if (error) {
      return { error: error.message };
    }


    revalidatePath("/", "layout");
    return { success: "Password updated" ,redirectUrl: "/"};
};
