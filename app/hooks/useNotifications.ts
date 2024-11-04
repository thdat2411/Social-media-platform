import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useShowToastWithCloseButton } from '../components/toastWithCloseButton';

const useNotifications = () => {
    const { data: session } = useSession();

    const showToast = useShowToastWithCloseButton();

    useEffect(() => {
        console.log('Session data:', session);

        if (!session?.user) return;

        const eventSource = new EventSource(`/api/sse?userId=${session.user.id}`);

        eventSource.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            showToast(notification.message);
        };

        return () => {
            eventSource.close();
        };
    }, [session, session?.user]);
};
export default useNotifications;