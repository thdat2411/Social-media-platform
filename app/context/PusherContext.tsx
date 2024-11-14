"use client";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";

export interface PusherContextType {
  pusher: Pusher | null;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    if (session?.user?.id && !pusher) {
      console.log("render");
      const userId = session.user.id;
      Pusher.logToConsole = true;
      const pusherClient = new Pusher(
        process.env.NEXT_PUBLIC_PUSHER_KEY as string,
        {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
          forceTLS: true,
        }
      );

      const channel = pusherClient.subscribe(`user-${userId}`);
      console.log(channel);
      channel.bind("new-notification", (data: string) => {
        console.log("New notification received:", data);
      });

      setPusher(pusherClient);

      // Cleanup function for unsubscribing
      return () => {
        console.log("Unsubscribing from Pusher channel");
        channel.unbind_all();
        channel.unsubscribe();
        pusherClient.disconnect();
      };
    }
  }, [session, pusher]);

  return (
    <PusherContext.Provider value={{ pusher }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};
