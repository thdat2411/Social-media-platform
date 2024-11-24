import Pusher from "pusher";

// Initialize Pusher client
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

// Function to send notifications to Pusher channel
export const notifyUser = async (
  userId: string,
  type: string,
  message: string
) => {
  try {
    await pusher.trigger(`user-${userId}`, "new-notification", {
      message: message,
      userId: userId,
      type: type,
    });
    console.log(`Notification sent to user-${userId}`);
  } catch (error) {
    console.error(`Error publishing message for user ${userId}:`, error);
  }
};
