"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { browserClient } from "@/utils/supabase/client";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  postId: string;
  onEdit: () => void;
}

const PostDeleteForm = ({ postId, onEdit }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = browserClient();
  const router = useRouter();
  const deletePost = async () => {
    await supabase.from("posts").delete().eq("id", postId);
    router.push("/");
  };
  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await deletePost();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
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

export default PostDeleteForm;
