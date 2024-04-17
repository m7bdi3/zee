"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/store/user";
import { browserClient } from "@/utils/supabase/client";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  commentId: string;
  onEdit: () => void;
}

const DeleteForm = ({ commentId, onEdit }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = browserClient();
  const { user } = useUser((state) => state);

  const deleteComment = async () => {
    await supabase
      .from("comments")
      .update({
        is_deleted: true,
        content: "/Deleted comment",
      })
      .eq("id", commentId)
      .eq("user_id", user?.id!);
  };

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await deleteComment();
    } catch (error) {
      console.error("Failed to delete the comment:", error);
    } finally {
      setIsDeleting(false);
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="text-accent w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-md">
        <DropdownMenuItem className="rounded-md" onSelect={onEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-md"
          onSelect={handleDeleteClick}
          disabled={isDeleting}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeleteForm;
