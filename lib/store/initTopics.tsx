"use client";
import { Topic } from "@/utils/supabase/types/types";
import React, { useEffect, useRef } from "react";
import { useTopic } from "./topics";

export default function InitTopics({ topics }: { topics: Topic[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useTopic.setState({ topic: topics });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
