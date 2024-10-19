"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface PasswordFieldProps {
  title: string;
  value: string;
  onSave: (currentPassword: string, newPassword: string) => void;
  isEditing: boolean;
  onEdit: (value: string | null) => void;
}

const PasswordField = ({
  title,
  value,
  onSave,
  isEditing,
  onEdit,
}: PasswordFieldProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [retypePasswordError, setRetypePasswordError] = useState("");

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (isEditing) {
      setCurrentPassword(""); // Reset current password when editing starts
      setNewPassword("");
      setRetypeNewPassword("");
      setCurrentPasswordError(""); // Reset errors
      setRetypePasswordError("");
    }
  }, [isEditing]);

  const handleSave = () => {
    let hasError = false;
    setCurrentPasswordError("");
    setRetypePasswordError("");

    // Check if current password matches the expected value
    if (currentPassword !== value) {
      setCurrentPasswordError("Current password is incorrect.");
      hasError = true;
    }

    // Check if new passwords match
    if (newPassword !== retypeNewPassword) {
      setRetypePasswordError("New passwords do not match.");
      hasError = true;
    }

    if (!hasError) {
      onSave(currentPassword, newPassword);
      onEdit(null); // Close editing
    }
  };

  return (
    <>
      <div className="flex w-full justify-between rounded-lg px-4 py-2">
        <div className="flex w-full items-center">
          <p className="w-[210px] self-start py-4 text-sm">{title}</p>
          {isEditing ? (
            <div className="flex w-[500px] flex-col items-center py-2">
              <div className="flex w-full space-x-4">
                <div className="flex w-full flex-col space-y-2">
                  <div className="relative">
                    {currentPasswordError && (
                      <p className="mb-1 text-xs text-red-500">
                        {currentPasswordError}
                      </p>
                    )}
                    <input
                      ref={(el) => {
                        inputRefs.current[0] = el!;
                      }}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`mb-2 w-full rounded-lg border p-2 text-sm text-muted-foreground hover:border-black ${
                        currentPasswordError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="relative">
                    <input
                      ref={(el) => {
                        inputRefs.current[1] = el!;
                      }}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mb-2 w-full rounded-lg border border-gray-300 p-2 text-sm text-muted-foreground hover:border-black"
                    />
                  </div>
                  <div className="relative">
                    {retypePasswordError && (
                      <p className="mb-1 text-xs text-red-500">
                        {retypePasswordError}
                      </p>
                    )}
                    <input
                      ref={(el) => {
                        inputRefs.current[2] = el!;
                      }}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Re-type New Password"
                      value={retypeNewPassword}
                      onChange={(e) => setRetypeNewPassword(e.target.value)}
                      className={`mb-2 w-full rounded-lg border p-2 text-sm text-muted-foreground hover:border-black ${
                        retypePasswordError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="rounded-full p-3"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </Button>
              </div>
              <div className="flex w-[500px] justify-end space-x-4 pt-4">
                <Button
                  onClick={() => onEdit(null)}
                  variant="outline"
                  className="w-1/2 hover:bg-blue-600 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="w-1/2 hover:bg-blue-600 hover:text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">••••••••••••••••</p>
          )}
        </div>
        {!isEditing && (
          <Button
            onClick={() => onEdit(title.toLowerCase())}
            variant="ghost"
            className="rounded-lg p-3"
          >
            <Pencil className="size-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default PasswordField;
