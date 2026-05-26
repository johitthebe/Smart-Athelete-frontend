"use client";

import { useState, useRef } from "react";
import { API_BASE_URL } from "@/lib/config";

interface ProfilePictureUploadProps {
  currentPictureUrl?: string | null;
  onUploadSuccess?: (newUrl: string) => void;
  onDeleteSuccess?: () => void;
  userInitials?: string;
}

export default function ProfilePictureUpload({ currentPictureUrl, onUploadSuccess, onDeleteSuccess, userInitials = "U" }: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, or WEBP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      alert("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const csrfToken = getCookie("csrftoken");
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await fetch(`${API_BASE_URL}/api/auth/profile-picture/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewUrl(data.user.profile_picture_url);
        if (onUploadSuccess) {
          onUploadSuccess(data.user.profile_picture_url);
        }
      } else {
        alert(data.error || "Failed to upload profile picture");
        setPreviewUrl(currentPictureUrl || null);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Network error. Please try again.");
      setPreviewUrl(currentPictureUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile picture?")) return;

    setUploading(true);

    try {
      const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${API_BASE_URL}/api/auth/profile-picture/delete/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
      });

      if (response.ok) {
        setPreviewUrl(null);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
        if (onUploadSuccess) {
          onUploadSuccess("");
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete profile picture");
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    return userInitials;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Picture Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Upload Button Overlay */}
        {!uploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#173B80] text-white flex items-center justify-center hover:bg-[#102a5a] transition-colors shadow-lg"
            title="Upload photo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}

        {/* Loading Spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 text-sm font-medium text-[#173B80] border border-[#173B80] rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {previewUrl ? "Change Photo" : "Upload Photo"}
        </button>

        {previewUrl && (
          <button
            onClick={handleDelete}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
