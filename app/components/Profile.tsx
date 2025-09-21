import React from "react";
import { GitHubUser } from "../types/types";
import Image from "next/image";

type ProfileProps = {
  user: GitHubUser | undefined;
  logout: () => void; // function with no arguments returning nothing
};

const Profile: React.FC<ProfileProps> = ({ user, logout }) => {
  return (
    <div className="flex">
      <h1> Hello Dear {user?.login}</h1>
      <Image
        src={user?.avatar_url || "https://via.placeholder.com/40"}
        alt={user?.login || "Avatar"}
        width={40}
        height={40}
        className="rounded-full border border-gray-300 dark:border-gray-600"
      />
      <button
        type="button"
        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
        onClick={logout}
      >
        <svg
          className="w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 4.75A1.75 1.75 0 0 1 4.75 3h4.5a.75.75 0 0 1 0 1.5h-4.5a.25.25 0 0 0-.25.25v11.5c0 .138.112.25.25.25h4.5a.75.75 0 0 1 0 1.5h-4.5A1.75 1.75 0 0 1 3 16.25V4.75Zm10.22 2.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L14.94 11H8.75a.75.75 0 0 1 0-1.5h6.19l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};
export default Profile;
