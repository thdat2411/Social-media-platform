"use client";
import { useSession } from "next-auth/react";
import Pusher, { Channel } from "pusher-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface PusherContextType {
  pusher: Pusher | null;
  subscribeToChannel: (channelName: string) => void;
  unsubscribeFromChannel: (channelName: string) => void;
  bindEvent: (
    channelName: string,
    eventName: string,
    callback: (data: unknown) => void
  ) => void;
  unbindEvent: (channelName: string, eventName: string) => void;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const channelsRef = useRef<Record<string, Channel | null>>({});

  useEffect(() => {
    if (session?.user?.id && !pusher) {
      const pusherClient = new Pusher(
        process.env.NEXT_PUBLIC_PUSHER_KEY as string,
        {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
          forceTLS: true,
        }
      );
      setPusher(pusherClient);

      // Cleanup when the component unmounts
      return () => {
        Object.values(channelsRef.current).forEach((channel) => {
          if (channel) {
            channel.unbind_all();
            channel.unsubscribe();
          }
        });
        pusherClient.disconnect();
        setPusher(null);
        channelsRef.current = {};
      };
    }
  }, [session?.user?.id]);

  const subscribeToChannel = (channelName: string) => {
    if (!pusher || channelsRef.current[channelName]) {
      console.log(
        `Pusher not initialized or already subscribed to ${channelName}`
      );
      return;
    }

    const channel = pusher.subscribe(channelName);

    channelsRef.current[channelName] = channel;
  };

  const unsubscribeFromChannel = (channelName: string) => {
    const channel = channelsRef.current[channelName];

    if (channel) {
      channel.unbind_all();
      channel.unsubscribe();
      channelsRef.current[channelName] = null;
    }
  };

  const bindEvent = (
    channelName: string,
    eventName: string,
    callback: (data: unknown) => void
  ) => {
    const channel = channelsRef.current[channelName];
    if (channel) {
      channel.bind(eventName, callback);
    }
  };

  const unbindEvent = (channelName: string, eventName: string) => {
    const channel = channelsRef.current[channelName];
    if (channel) {
      channel.unbind(eventName);
    }
  };

  return (
    <PusherContext.Provider
      value={{
        pusher,
        subscribeToChannel,
        unsubscribeFromChannel,
        bindEvent,
        unbindEvent,
      }}
    >
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
