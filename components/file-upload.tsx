"use client";
import { ImagePlusIcon, Loader2, X, Plus } from "lucide-react";
import Image from "next/image";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import { AspectRatio } from "./ui/aspect-ratio";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endPoint:
    | "ProfileCoverImage"
    | "topicImage"
    | "PostImage"
    | "ProfileImage"
    | "messageFile"
    | "RegisterImage";
}

export const FileUpload = ({ onChange, value, endPoint }: Props) => {
  const fileType = value?.split(".").pop();
  useEffect(() => {
    console.log("Endpoint updated:", endPoint);
  }, [endPoint]);
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value && fileType !== "pdf") {
    const aspectRatio = endPoint === "ProfileCoverImage" ? 16 / 9 : 1;

    return (
      <div className="w-full flex justify-center items-center border border-dashed rounded-md hover:border-primary focus:border-primary transition-all p-4">
        <AspectRatio ratio={aspectRatio}>
          <Image
            fill
            src={value}
            alt="Uploaded Image"
            className={
              endPoint === "ProfileCoverImage"
                ? " object-cover"
                : "rounded-full object-cover"
            }
          />
        </AspectRatio>
        <button
          onClick={() => onChange("")}
          className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      key={value}
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      config={{
        mode: "auto",
      }}
      onUploadError={(error) => {
        toast.error(error?.message);
      }}
      content={{
        uploadIcon({ isUploading }) {
          if (isUploading) {
            return <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />;
          }
          return <ImagePlusIcon className="h-7 w-7 cursor-pointer" />;
        },
        label({ isUploading }) {
          return isUploading ? "" : <p>Choose Image</p>;
        },
        allowedContent: () => null,
      }}
      appearance={{
        container:
          "w-full flex flex-row items-center justify-center gap-2 p-2 border-2 border-dashed rounded-md hover:border-primary focus:border-primary transition-all m-0",
        uploadIcon: "text-primary",
        label:
          "w-fit text-sm hover:text-accent  text-forground focus:text-primary transition-all m-0",
        allowedContent: "hidden",
        button: "hidden",
      }}
    />
  );
};

export const FileButtonUpload = ({ onChange, value, endPoint }: Props) => {
  return (
    <>
      {endPoint !== "messageFile" && (
        <UploadButton
          endpoint={endPoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            toast.error(error?.message);
          }}
          content={{
            button({ ready, isUploading }) {
              if (ready)
                return (
                  <ImagePlusIcon className="h-5 w-5 text-card-foreground hover:scale-110" />
                );
              if (isUploading)
                return (
                  <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
                );
              return <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />;
            },
          }}
          appearance={{
            button:
              "ut-ready:bg-transparent ut-uploading:cursor-not-allowed rounded-r-none bg-transparent w-fit h-fit p-1 bg-none after:bg-transparent",
            container:
              "w-fit h-full flex items-center justify-center rounded-md ",
            allowedContent: "hidden",
          }}
        />
      )}
      {endPoint === "messageFile" && (
        <UploadButton
          endpoint={endPoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            toast.error(error?.message);
          }}
          content={{
            button({ ready, isUploading }) {
              if (ready)
                return <Plus className="text-white dark:text-[#313338]" />;
              if (isUploading)
                return (
                  <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
                );
              return <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />;
            },
          }}
          appearance={{
            button:
              "ut-ready:bg-transparent ut-uploading:cursor-not-allowed ut-uploading:none bg-transparent w-full h-full bg-none after:bg-transparent",
            container:
              "absolute top-7 left-8 h-7 w-7 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center",
            allowedContent: "hidden",
          }}
        />
      )}
    </>
  );
};
