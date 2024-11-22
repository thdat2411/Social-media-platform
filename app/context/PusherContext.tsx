"use client";
import { useSession } from "next-auth/react";
import Pusher, { Channel } from "pusher-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface PusherContextType {
  pusher: Pusher | null;
  bindEvent: (eventName: string, callback: (data: unknown) => void) => void;
  unbindEvent: (eventName: string) => void;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (session?.user?.id && !pusher) {
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
      channelRef.current = channel;

      setPusher(pusherClient);

      // Cleanup function for unsubscribing
      return () => {
        console.log("Unsubscribing from Pusher channel");
        channel.unbind_all();
        channel.unsubscribe();
        pusherClient.disconnect();
        setPusher(null);
        channelRef.current = null;
      };
    }
  }, [session?.user.id]);

  const bindEvent = (eventName: string, callback: (data: unknown) => void) => {
    channelRef.current?.bind(eventName, callback);
  };

  const unbindEvent = (eventName: string) => {
    channelRef.current?.unbind(eventName);
  };

  return (
    <PusherContext.Provider value={{ pusher, bindEvent, unbindEvent }}>
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
