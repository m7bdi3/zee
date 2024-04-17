"use server";

import { serverClient } from "@/utils/supabase/server";

const supabase = serverClient();

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (
    error &&
    error.message !==
      "JSON object requested, single row expected but 0 returned"
  ) {
    return null;
  }
  if (data) {
    return true;
  }
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (
    error &&
    error.message !==
      "JSON object requested, single row expected but 0 returned"
  ) {
    return null;
  }
  if (data) {
    return true;
  }
};

export const getUserByUsername = async (name: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", name)
    .single();

  if (
    error &&
    error.message !==
      "JSON object requested, single row expected but 0 returned"
  ) {
    return null;
  }
  if (data) {
    return true;
  }
};

export async function generateUsername(name: string): Promise<string> {
  const MAX_ATTEMPTS = 10;
  const RANDOM_SUFFIX_LENGTH = 4;
  const cleanedBaseUsername = cleanUsername(name);

  async function isUsernameAvailable(
    cleanedBaseUsername: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .ilike("name", `${cleanedBaseUsername}%`)
      .single();

    return !data && !error;
  }

  let finalUsername = cleanedBaseUsername;
  let counter = 1;

  while (
    !(await isUsernameAvailable(finalUsername)) &&
    counter <= MAX_ATTEMPTS
  ) {
    finalUsername = `${cleanedBaseUsername}_${generateRandomSuffix(
      RANDOM_SUFFIX_LENGTH
    )}`;
    counter++;
  }

  if (counter > MAX_ATTEMPTS) {
    throw new UsernameGenerationError("Unable to generate a unique username");
  }

  return finalUsername;
}

function cleanUsername(name: string): string {
  const maxLength = 32;
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_]+/g, "")
    .substring(0, maxLength);
}
class UsernameGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsernameGenerationError";
  }
}
function generateRandomSuffix(length = 4): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < length; i++) {
    suffix += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return suffix;
}
