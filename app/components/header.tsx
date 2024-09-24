import Image from "next/image";
import Link from "next/link";
import {
  FaBell,
  FaBriefcase,
  FaCommentDots,
  FaHome,
  FaUserFriends,
} from "react-icons/fa";
import InLogo from "@/app/assets/In-logo.jpg";
const Header = () => {
  return (
    <div className="w-full bg-white shadow-sm flex justify-around items-center">
      <div className="flex items-center">
        <Image src={InLogo} alt="LinkedIn Logo" className="w-16 h-fit" />
        <input
          type="text"
          placeholder="Search"
          className="border rounded-full px-4 py-2 w-64"
        />
      </div>
      <div className="flex items-center space-x-10 text-gray-600">
        <Link
          href="#"
          className="flex flex-col items-center justify-center hover:text-gray-800"
        >
          <FaHome className="size-6" />
          <p className="text-xs">Home</p>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center hover:text-gray-800"
        >
          <FaUserFriends className="size-6" />
          <p className="text-xs">My Network</p>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center hover:text-gray-800"
        >
          <FaBriefcase className="size-6" />
          <p className="text-xs">Jobs</p>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center hover:text-gray-800"
        >
          <FaCommentDots className="size-6" />
          <p className="text-xs">Messaging</p>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center hover:text-gray-800"
        >
          <FaBell className="size-6" />
          <p className="text-xs">Notifications</p>
        </Link>
        <Image
          src="/profile-placeholder.png"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
