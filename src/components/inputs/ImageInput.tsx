import React, { useEffect, useMemo, useState } from "react";
import { useEventStore } from "../../stores/useEventStore";

interface ImageUploadInputProps {
  label?: string;
  requiredSize?: { width: number; height: number };
  maxSizeMB?: number;
  onImageChange?: (file: File | null) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label = "Cover Image",
  requiredSize = { width: 724, height: 340 },
  maxSizeMB = 4,
  onImageChange,
}) => {
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const { form } = useEventStore();
  const eventSetupForm = form["Event Setup"] || {};
  const storedImage = eventSetupForm.coverImage;
//   const previewUrl = useMemo(() => {
//     if (!storedImage) return null;
//     const url = URL.createObjectURL(storedImage);
//     return url;
//   }, [storedImage]);
useEffect(() => {
    let url: string | undefined;
  
    if (storedImage instanceof File) {
      url = URL.createObjectURL(storedImage);
      setPreviewUrl(url);
    }
  
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [storedImage]);
console.log(storedImage)
console.log(previewUrl)
  const resizeImage = (
    file: File,
    width: number,
    height: number
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject("Failed to read file");

        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject("No canvas context");

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Failed to convert to Blob");

            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          1
        );
      };

      img.onerror = () => reject("Image load error");

      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB.`);
      onImageChange?.(null);
      return;
    }

    try {
      const resized = await resizeImage(file, requiredSize.width, requiredSize.height);
      const preview = URL.createObjectURL(resized);
      setPreviewUrl(preview);
      onImageChange?.(resized);
    } catch (err) {
      console.error("Resize failed:", err);
      setError("Image processing failed.");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <label className="text-black text-[.9rem] font-semibold font-[RedHat]">
          {label}
        </label>
        <div className="flex items-center justify-center p-4 border-dotted border border-gray-300 rounded-lg gap-2 w-full h-[260px]">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <span className="text-center text-[#918F90]">
              Drop your image here, or{" "}
              <span className="text-primary underline cursor-pointer">browse</span>
            </span>
            <p className="mt-2 text-xs text-[#A7A5A6] text-[.8rem]">
              (Recommended size: {requiredSize.width}x{requiredSize.height}px, max{" "}
              {maxSizeMB}MB)
            </p>
          </div>
        </div>

        {previewUrl && (
          <div className="mt-2 flex justify-center items-center w-[680px] h-[260px] border border-dotted border-gray-300 rounded-lg">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

  