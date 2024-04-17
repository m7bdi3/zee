"use client";

import React, { use, useEffect, useState } from "react";
import {
  NotificationType,
  notificationWithData,
} from "@/utils/supabase/types/types";

import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BellDot, BellIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useUser } from "@/lib/store/user";
import { browserClient } from "@/utils/supabase/client";
import { set } from "date-fns";

const NotificationCenter = () => {
  const router = useRouter();
  const user = useUser((state) => state.user);
  const supabase = browserClient();
  const [localNotifications, setLocalNotifications] = useState<
    notificationWithData[]
  >([]);
  const [open, setOpen] = useState(false);
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notification")
      .select(
        `*,CreatedByProfile:profiles!public_notification_created_by_fkey(id, username, avatar_url, firstname, lastname),Post:posts!public_notification_post_id_fkey(id,slug,content, created_at,userId)`
      )
      .eq("user_id", user?.id!)
      .eq("is_cleared", false)
      .order("created_at", { ascending: false });

    if (data) {
      setLocalNotifications(data as notificationWithData[]);
    }
  };

  useEffect(() => {
    fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const clearAllNotifications = async () => {
    const { error } = await supabase
      .from("notification")
      .update({ is_cleared: true })
      .eq("user_id", user?.id!);
  };

  const readNotifications = async (id: string) => {
    const { error } = await supabase
      .from("notification")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", user?.id!);
  };
  const handleClearAllNotifications = async () => {
    setLocalNotifications((currentNotifs) =>
      currentNotifs.map((n) => ({ ...n, isCleared: true }))
    );
    try {
      await clearAllNotifications();
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      setLocalNotifications(localNotifications);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const optimisticNotifications = localNotifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setLocalNotifications(optimisticNotifications);
    console.log(notificationId);
    try {
      await readNotifications(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setLocalNotifications(localNotifications);
    }
  };

  const navigateToDetail = (notification: notificationWithData) => {
    handleMarkAsRead(notification.id);
    switch (notification.type) {
      case NotificationType.LIKE:
        notification.post_id
          ? router.push(
              `/topics/${notification.Post.slug}/post/${notification.post_id}`
            )
          : router.push(
              `/topics/${notification.Post.slug}/post/${notification.post_id}#comment-${notification.comment_id}`
            );
        break;
      case NotificationType.COMMENT:
        router.push(
          `/topics/${notification.Post.slug}/post/${notification.post_id}#comment-${notification.comment_id}`
        );
        break;
      case NotificationType.FOLLOW:
        router.push(`/profile/${notification.CreatedByProfile?.username}`);
        break;
      default:
        return router.refresh();
    }
  };

  const renderNotificationMessage = (
    notification: notificationWithData
  ): string => {
    switch (notification.type) {
      case NotificationType.LIKE:
        return notification.post_id
          ? `@${notification.CreatedByProfile?.username} liked your post.`
          : `@${notification.CreatedByProfile?.username} liked your comment.`;
      case NotificationType.COMMENT:
        return `@${notification.CreatedByProfile?.username} Commented on your post.`;
      case NotificationType.FOLLOW:
        return `@${notification.CreatedByProfile?.username} is now following you`;
      case NotificationType.MESSAGE:
        return `@${notification.CreatedByProfile?.username} Sent you a message.`;
      default:
        return "You have a notification";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild onClick={()=>{
        fetchNotifications;
        setOpen(!open);
      }}>
        {localNotifications.length > 0 ? (
          <BellDot className="h-7 w-7 text-white" />
        ) : (
          <BellIcon className="h-7 w-7 text-white" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 mr-4">
        <div className="w-full max-h-64 overflow-y-auto">
          {localNotifications.map((notification) => (
            <div
              key={notification.id}
              className="w-full"
              onClick={() => {
                navigateToDetail(notification), setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={notification.CreatedByProfile?.avatar_url}
                  />
                  <AvatarFallback>
                    {notification.CreatedByProfile?.username}
                  </AvatarFallback>
                </Avatar>
                {renderNotificationMessage(notification)}
              </div>
            </div>
          ))}
          {localNotifications.length === 0 && (
            <div>
              <p className="w-full text-center text-sm">No notifications</p>
            </div>
          )}
        </div>
        {localNotifications.length > 0 && (
          <>
            <Separator />
            <Button
              onClick={()=>{
                handleClearAllNotifications();
                setOpen(false);
              }}
            
              className="w-full bg-transparent hover:bg-transparent h-6 mt-4"
            >
              Clear all
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
