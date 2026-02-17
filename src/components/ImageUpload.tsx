"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentValue?: string;
}

export default function ImageUpload({ onUpload, currentValue }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentValue || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpload("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md flex items-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Image
            </>
          )}
        </label>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 font-medium text-sm"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-auto rounded-lg border-2 border-yellow-200 dark:border-yellow-700"
          />
        </div>
      )}
    </div>
  );
}
