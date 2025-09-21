import { useEffect, useState } from "react";
import { GitHubUser } from "../types/types";
import Profile from "./Profile";
import { Dashboard } from "./Dashboard";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<GitHubUser>();

  const checkLoggedIn = async () => {
    console.log("Handle Login");

    try {
      const res = await fetch("http://localhost:4000/me", {
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Please login again.");
        console.log("RESPONSE:", await res.json());
        setIsLoggedIn(false);
        return;
      }

      if (res.status == 200) {
        const data = await res.json();
        console.log("The logged in data:", data);
        setIsLoggedIn(true);
        setUser(data as GitHubUser);
      }
    } catch (error) {
      console.log("Error getting Login Details", error);
    }
  };

  const handleLogin = () => {
    console.log("Backend URL:", `${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
  };
  const handleLogout = async () => {
    const ask = confirm("You wanna logout");
    if (ask) {
      const res = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Unable to logout, please try again after some time");
        return;
      }

      alert("Logged out Successfully");
      setUser(undefined);
      setIsLoggedIn(false);
      console.log("FrontendURL:", `${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
      window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;
    } else {
      console.log("Permission denied we can't log you out");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkLoggedIn();
    };
    fetchData();
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
          onClick={handleLogin}
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              clip="evenodd"
            />
          </svg>
          Sign in with Github
        </button>
      ) : (
        <>
          <Profile user={user} logout={handleLogout} />
          <Dashboard user={user} />
        </>
      )}
    </>
  );
};

export default Login;
