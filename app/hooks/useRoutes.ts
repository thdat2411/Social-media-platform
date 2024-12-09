import { usePathname } from "next/navigation";
import { useMemo } from "react";

const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/feed",
        iconHover: "/home.mp4",
        active: pathname === "/feed",
      },
      {
        label: "My Network",
        href: "/mynetwork",
        iconHover: "/friendship.mp4",
        active: pathname === "/mynetwork",
      },

      {
        label: "Jobs",
        href: "/jobs",
        iconHover: "/job-seeking.mp4",
        active: pathname === "/jobs",
      },
      // {
      //   label: "Messaging",
      //   href: "/message",
      //   iconHover: "/message.mp4",
      //   active: pathname === "/message",
      // },
      {
        label: "Notifications",
        href: "/notifications",
        iconHover: "/notification.mp4",
        active: pathname === "/notifications",
      },
      {
        label: "Post a job",
        href: "/job-posting",
        iconHover: "/post.mp4",
        active: pathname === "/job-posting",
      },
    ],
    [pathname]
  );
  return routes;
};

export default useRoutes;
