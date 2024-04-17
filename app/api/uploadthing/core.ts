import { serverClient } from "@/utils/supabase/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

const handleAuth = async () => {
  const supabase = serverClient();
  const { data, error } = await supabase.auth.getUser();

  const userId = data.user?.id;
  if (error) {
    throw new Error("Unauthorized");
  }

  return { userId: userId };
};
export const ourFileRouter = {
  topicImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  PostImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  ProfileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  ProfileCoverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    RegisterImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
