"use server";

import { redirect } from "next/navigation";

import { serverClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function logout() {
  const supabase = serverClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
