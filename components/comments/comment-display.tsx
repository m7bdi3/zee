"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CornerDownRightIcon, HeartIcon } from "lucide-react";
import { CommentsWithData } from "@/utils/supabase/types/types";
import { useUser } from "@/lib/store/user";
import CommentEditForm from "./comment-edit-form";
import DeleteForm from "./comment-delete-form";
import CommentCreateForm from "./comment-create-form";
import { UserAvatar } from "../userAvater";
import { browserClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentProps {
  commentId: string;
  comments: CommentsWithData[];
}

const Comment: React.FC<CommentProps> = ({ comments, commentId }) => {
  const supabase = browserClient();
  const [isEditing, setIsEditing] = useState(false);
  const user = useUser((state) => state.user);
  const comment = comments.find((c) => c.id === commentId);
  const [commentContent, setCommentContent] = useState(comment?.content);
  const userId = user?.id;
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const initialIsLiked = comment?.likes.some((like) => like.user_id === userId);

  const initialLikeCount = comment?.likes.length;
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const { data: fetchedComments, error } = await supabase
          .from('comments')
          .select(`
            *,
            likes(*)
          `)
          .eq('id', commentId);
  
        if (error) throw error;
  
        // Assuming `fetchedComments` is an array and you're interested in the first item
        const fetchedComment = fetchedComments?.[0];
        if (fetchedComment) {
          setCommentContent(fetchedComment.content);
          setLikeCount(fetchedComment.likes.length);
          setIsLiked(fetchedComment.likes.some(like => like.user_id === userId));
        }
      } catch (error) {
        console.error('Error fetching comment data:', error);
        toast.error('Failed to fetch comment data');
      }
    };
  
    fetchCommentData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentId, userId]);
  
  const handleLike = useCallback(async () => {
    if (!user) return;
  
    let actionType = '';
    let error;
  
    if (comment?.likes.some((like) => like.user_id === user.id)) {
      actionType = 'delete';
      ({ error } = await supabase.from("likes").delete().match({ comment_id: comment.id, user_id: user.id }));
    } else {
      actionType = 'insert';
      ({ error } = await supabase.from("likes").insert({ user_id: userId!, comment_id: commentId }));
    }
  
    setLikeCount((prev) => prev! + (actionType === 'delete' ? -1 : 1));
    setIsLiked((prev) => !prev);
  
    if (error) {
      toast.error(error.message);
      setLikeCount((prev) => prev! - (actionType === 'delete' ? -1 : 1));
      setIsLiked((prev) => !prev);
    }
  
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment, userId, user]); 
  

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const commentElement = document.querySelector(hash);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  if (!comment) {
    return null;
  }

  const children = comments.filter((c) => c.parent_id === commentId);
  const renderedChildren = children.length > 0 && (
    <div className=" pl-4 relative">
      <span
        className="absolute top-0 left-4 h-full w-0.5 bg-accent"
        aria-hidden="true"
      ></span>
      {children.map((child) => (
        <Comment key={child.id} commentId={child.id} comments={comments} />
      ))}
    </div>
  );
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className="space-y-4 bg-card m-2 rounded-md shadow"
    >
      <div className="flex gap-4 p-4">
        {!comment.is_deleted && (
          <div className="flex flex-col justify-around self-start pt-2">
            {!comment.is_deleted && user && (
              <div className="flex flex-col  ">
                <div className="flex items-center flex-col">
                  <div
                    onClick={handleLike}
                    className="p-0 h-fit cursor-pointer"
                  >
                    <HeartIcon
                      className={`h-6 w-6 text-accent`}
                      fill={`${
                        isLiked ? "hsl(var(--accent))" : "hsl(var(--card))"
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                  <p className="font-semibold text-sm">{likeCount}</p>
                </div>
                <div
                  className="p-0 pt-1 cursor-pointer"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <CornerDownRightIcon className="h-6 w-6 text-accent" />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col w-full">
          <div className={`rounded-md bg-muted p-3 shadow-sm`}>
            {!comment.is_deleted && (
              <div className="flex items-center justify-between">
                <>
                  <Link
                    href={`/profile/${comment.user.username}`}
                    className="flex items-center gap-1"
                  >
                    <UserAvatar
                      src={comment.user.avatar_url!}
                      className="w-7 h-7 shrink-0"
                    />
                    <p className="font-medium text-sm">
                      @{comment.user.username}
                    </p>
                  </Link>
                </>
                {user?.id === comment.user_id && (
                  <DeleteForm commentId={comment.id} onEdit={handleEdit} />
                )}
              </div>
            )}
            {user?.id === comment.user_id && isEditing ? (
              <CommentEditForm
                commentId={comment.id}
                content={comment.content}
                setIsEditing={setIsEditing}
                setCommentContent={setCommentContent}
              />
            ) : (
              <>
                <p className="mt-1 ml-2 text-foreground text-base">
                  {commentContent}
                </p>
              </>
            )}
            {!comment.is_deleted && user && (
              <div className="mt-2 flex justify-end">
                <CommentCreateForm
                  postId={comment.post_id}
                  parentId={comment.id}
                  startOpen={open}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {renderedChildren}
    </div>
  );
};

interface CommentDisplayProps {
  postId: string;
  comments: CommentsWithData[];
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({ comments }) => {
  const topLevelComments = comments?.filter(
    (comment) => comment.parent_id === null
  );

  return (
    <div className="p-2">
      {topLevelComments?.map((comment) => (
        <Comment key={comment.id} commentId={comment.id} comments={comments} />
      ))}
    </div>
  );
};

export default CommentDisplay;
