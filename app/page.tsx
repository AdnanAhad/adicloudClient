"use client";

import Image from "next/image";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { UserProvider, useUser } from "./context/UserContext";

function Header() {
  const { isLoggedIn, user, logout, loading } = useUser();

  return (
    <header className="w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-black/30">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-2">
          <Image src="/file.svg" alt="PDF Cloud Drive" width={24} height={24} />
          <span className="text-sm font-semibold tracking-wide">PDF Cloud Drive</span>
        </div>

        {isLoggedIn && !loading ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs text-gray-300">Signed in as</span>
              <span className="text-sm font-medium truncate max-w-[160px]">
                {user?.login}
              </span>
            </div>
            <Image
              src={user?.avatar_url || "https://via.placeholder.com/40"}
              alt={user?.login || "Avatar"}
              width={32}
              height={32}
              className="rounded-full border border-white/20"
            />
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/15 text-gray-100 px-3 py-1.5 text-xs font-medium border border-white/20 transition"
            >
              <svg
                className="w-3.5 h-3.5"
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
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}

function AppContent() {
  const { isLoggedIn, loading, error } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-gray-100">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-gray-100">
      <Header />

      <main className="max-w-5xl mx-auto px-5">
        {error && (
          <div className="mt-6 rounded-md border border-red-400/30 bg-red-900/20 text-red-200 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {!isLoggedIn ? (
          <section className="flex flex-col items-center text-center py-28">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-gray-300 mb-4">
              Secure • GitHub OAuth • Cloud-backed
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight mb-3">
              Your PDFs, Organized in the Cloud
            </h1>
            <p className="text-gray-300 max-w-2xl mb-8">
              Upload, view, and manage your PDF documents securely. Sign in with
              GitHub to sync with your private storage repository.
            </p>
            <Login />
            <p className="text-xs text-gray-500 mt-4">
              By continuing you agree to our Terms and Privacy Policy.
            </p>
          </section>
        ) : (
          <section className="py-12">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/40 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Upload PDF</h2>
                  <p className="text-xs text-gray-400">Add files to your drive</p>
                </div>
                <Dashboard />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 mt-14">
        <div className="max-w-5xl mx-auto px-5 py-6 text-center text-xs text-gray-400">
          ©2025 PDF Cloud Drive — Built with Next.js
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
