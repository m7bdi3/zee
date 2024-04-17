import { profile } from "@/utils/supabase/types/types";
import { create } from "zustand";

interface userState {
  profile: profile | undefined;
}

export const useProfile = create<userState>()((set) => ({
  profile: undefined,
}));
