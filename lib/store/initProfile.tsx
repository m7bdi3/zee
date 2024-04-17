"use client";

import React, { useEffect, useRef } from "react";
import { profile } from "@/utils/supabase/types/types";
import { useProfile } from "./profile";

export default function InitProfile({
  profile,
}: {
  profile: profile | undefined;
}) {
  const initState = useRef(false);
  useEffect(() => {
    if (!initState.current) {
      useProfile.setState({ profile });
    }
    initState.current = true;
    //eslint-disable-next-line
  }, []);
  return <></>;
}
