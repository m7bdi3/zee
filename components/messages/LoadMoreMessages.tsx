import React, { useEffect, useRef } from "react";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { browserClient } from "@/utils/supabase/client";

export default function LoadMoreMessages() {
  const observerRef = useRef(null);
  const page = useMessage((state) => state.page);
  const setMesssages = useMessage((state) => state.setMesssages);
  const hasMore = useMessage((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    const supabase = browserClient();

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
            *, 
            senderProfile:profiles!public_messages_sender_id_fkey(id, username, avatar_url, firstname, lastname)),         receiverProfile:profiles!public_messages_receiver_id_fkey(id, username, avatar_url, firstname, lastname))
        `
      )
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      //@ts-ignore
      setMesssages(data.reverse());
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore]);

  if (hasMore) {
    return (
      <div
        ref={observerRef}
        className="h-10 flex w-full items-center justify-center"
      >
        <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
      </div>
    );
  }
  return <></>;
}
