import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useShowToastWithCloseButton } from '../components/toastWithCloseButton';
import Pusher from 'pusher-js';

const useNotifications = () => {
    const { data: session } = useSession();

    const showToast: (message: string) => void = useShowToastWithCloseButton();

    useEffect(() => {
        if (!session?.user?.id) return;

        const userId = session.user.id as string;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
            forceTLS: true,
        });

        const channel = pusher.subscribe(`user-${userId}`);
        channel.bind('new-notification', (data: string) => {
            showToast(data);
        });

        return () => {
            console.log('Cleaning up...');
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [session?.user.id, showToast]);
};
export default useNotifications;