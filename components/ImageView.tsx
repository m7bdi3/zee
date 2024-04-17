import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ImageView({ images, setImages }: ImageProps) {
  return (
    <>
      {images.length === 1 && (
        <div className="grid grid-cols-1 gap-4 w-full shadow-sm bg-background pb-3">
          {images.map((image, index) => (
            <div key={index} className="relative  h-52 mx-auto  w-1/2 ">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="rounded-md "
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-4 w-full shadow-sm bg-background pb-3">
          {images.map((image, index) => (
            <div key={index} className="relative  h-52 mx-auto  w-full ">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  sizes={'(max-width: 640px) 100vw, 64'}
                  className="rounded-md "
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {images.length === 3 && (
        <div className="grid grid-cols-3 gap-4 w-full shadow-sm bg-background pb-3">
          {images.map((image, index) => (
            <div key={index} className="relative h-44 mx-auto  w-full ">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="rounded-md "
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {images.length === 4 && (
        <div className="grid grid-cols-4 gap-4 w-full shadow-sm bg-background pb-3">
          {images.map((image, index) => (
            <div key={index} className="relative h-36 mx-auto  w-full ">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="rounded-md "
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="bg-destructive text-destructive-foreground p-1 rounded-full absolute top-1 right-1 shadow-sm"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
