import { Button } from "@/components/ui/button";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { getUserByEmail } from "../actions/getUserByEmail";

interface ChangePasswordFormProps {
  emailValue: string;
}

const ChangePasswordForm = ({ emailValue }: ChangePasswordFormProps) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordFocus, setIsNewPasswordFocus] = useState(false);

  const validatePassword = (password: string) => {
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/g; // Adjust this pattern as needed
    if (password.length < 8) {
      setNewError("Password must be at least 8 characters long.");
    } else if (!specialCharacterPattern.test(password)) {
      setNewError("Password must contain at least one special character.");
    }
  };

  const checkValid = async () => {
    const user = await getUserByEmail(emailValue);
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
    }
    const data = {
      newPassword,
      userId: user?.id,
    };
    axios
      .put("/api/user/change-password", data)
      .then(() => {
        toast.success("Password changed successfully");
        router.push("/signin");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Failed to change password");
      });
  };

  const handleSubmit = () => {
    if (newPassword === "" || confirmPassword === "") {
      if (newPassword === "") {
        setNewError("Please enter your new password");
      }
      if (confirmPassword === "") {
        setConfirmError("Please confirm your new password");
      }
    } else {
      checkValid();
    }
  };

  return (
    <>
      <p className="mb-2 text-3xl font-medium">Choose a new password</p>
      <p className="mb-8 text-xs">
        To secure your account, choose a strong password you haven’t used before
        and is at least 8 characters long.
      </p>
      <div className="my-4 flex flex-col space-y-3">
        <p>New password*</p>

        <div
          className={`flex justify-between rounded-md px-3 py-1 outline ${isNewPasswordFocus && newError === "" ? "outline-2 outline-blue-500" : "outline-1"} ${newError !== "" ? "outline-2 outline-red-500" : "outline-gray-700"}`}
        >
          <input
            value={newPassword}
            className="outline-none"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="New password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              setNewError("");
            }}
            onClick={() => setIsNewPasswordFocus(true)}
            onBlur={() => {
              validatePassword(newPassword);
              setIsNewPasswordFocus(false);
            }}
          />
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
        {newError !== "" && (
          <p className="text-sm font-medium text-red-500">{newError}</p>
        )}
      </div>
      <div className="mb-10 mt-8 flex flex-col space-y-3">
        <p>Confirm password*</p>

        <input
          value={confirmPassword}
          className={`w-full rounded-md border p-3 ${confirmError !== "" ? "border-red-500 outline outline-1 outline-red-500" : "border-gray-700 focus:outline-blue-500"} } transition-all`}
          type="password"
          placeholder="Retype new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {confirmError !== "" && (
          <p className="text-sm font-medium text-red-500">{confirmError}</p>
        )}
      </div>
      <Button
        onClick={handleSubmit}
        className="h-12 w-full bg-blue-500 p-4 text-lg hover:bg-blue-700"
      >
        Submit
      </Button>
    </>
  );
};

export default ChangePasswordForm;
