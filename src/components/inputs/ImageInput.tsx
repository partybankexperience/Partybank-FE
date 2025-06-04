import React, { useState } from "react";

interface ImageUploadInputProps {
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  requiredSize?: { width: number; height: number };
  maxSizeMB?: number;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label = "Cover Image",
  requiredSize = { width: 724, height: 340 },
  maxSizeMB = 4,
  value,
  onChange,
}) => {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // You'll need to set this up in Cloudinary

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      onChange?.(imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <label className="text-black text-[.9rem] font-semibold font-[RedHat]">
          {label}
        </label>
        <div className="relative flex items-center justify-center p-4 border-dotted border border-gray-300 rounded-lg gap-2 w-full h-[260px] overflow-hidden">
          {!uploading && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          )}

          {uploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-gray-500">Uploading...</p>
            </div>
          ) : value ? (
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
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
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};