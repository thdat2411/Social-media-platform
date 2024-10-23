import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface RecruiterCardProps {
  userData: user | null;
}

const RecruiterCard = ({ userData }: RecruiterCardProps) => {
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const userLoginData = {
        email: userData?.email,
        password: userData?.password_hash,
      };
      await axios.post("/api/register/user", userData).then(() => {
        signIn("credentials", {
          ...userLoginData,
          redirect: false,
        })
          .then((callback) => {
            if (callback?.error) {
              toast.error(callback.error);
            }
            if (callback?.ok && !callback.error) {
              router.push("/feed");
              toast.success("Logged in!");
            }
          })
          .catch((error) => {
            console.error("Error signing in:", error);
          });
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recruiter</h1>
          <p className="text-muted-foreground">Hire the best talent</p>
        </div>
        <Avatar className="size-16">
          <AvatarFallback className="text-lg font-semibold">
            {userData?.name?.split(" ").pop()?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="mt-4 text-muted-foreground">
        Post a job, find the right candidate, and grow your business
      </p>
      <Button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-700 text-white py-2 rounded-md text-lg hover:bg-blue-700"
      >
        Get started
      </Button>
    </div>
  );
};

export default RecruiterCard;
