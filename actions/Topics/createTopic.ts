"use server";
import * as z from "zod";

import { TopicSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/utils/supabase/server";

export async function CreateTopic(values: z.infer<typeof TopicSchema>) {
  const supabase = serverClient();
const {data:{user}} = await supabase.auth.getUser();
  const validatedFields = TopicSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { slug, description, imageUrl } = validatedFields.data;

  const finalSlug = slug
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\d/g, "")
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

    let { data: existingTopic } = await supabase
    .from('topics')
    .select('slug')
    .eq('slug', finalSlug)
    .single();


  if (existingTopic) {
    return {
      error: "Topic already exists",
    };
  }

  await supabase
  .from('topics')
  .insert([
    {
      created_by:user?.id!,
      slug: finalSlug,
      description: description,
      image: imageUrl,
    },
  ]);
  revalidatePath(`/`,'layout');
  return { success: true, message: "Topic created successfully" };
}
