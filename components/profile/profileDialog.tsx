"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ImageUp } from "lucide-react";
import { useState, useEffect } from "react";
import ImageUploadForm from "./profile-image-form";
import ProfileCoverUpload from "./profile-cover-form";
import { cn } from "@/lib/utils";

interface Props {
  type: "ProfileImage" | "ProfileCoverImage";
  username: string;
}

const ProfileDialog = ({ type ,username}: Props) => {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClose = () => setDialogOpen(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className={cn(
        'absolute z-10',
        type === "ProfileImage"? 'bottom-4 -right-2 ' : 'top-2 right-2',
      )}>
        <Button
          variant={"default"}
          className="rounded-full h-fit w-fit p-1 bg-card shadow-none"
        >
          <ImageUp className="h-5 w-5 text-accent" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        {type === "ProfileImage" ? (
          <ImageUploadForm onClose={handleClose} />
        ) : (
          <ProfileCoverUpload onClose={handleClose} username={username} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
