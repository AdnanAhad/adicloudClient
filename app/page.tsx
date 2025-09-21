"use client";

import Image from "next/image";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { UserProvider, useUser } from "./context/UserContext";
import { useState } from "react";

function Header() {
  const { isLoggedIn, user, logout, loading } = useUser();

  return (
    <header className="w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-black/30">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-2">
          <Image src="/cloud-stack.svg" alt="AdiCloud" width={24} height={24} />
          <span className="text-sm font-semibold tracking-wide">
            AdiCloud
          </span>
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
  const { isLoggedIn, loading, error, authLoading, authAction } = useUser();
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const Overlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-5 shadow-2xl shadow-black/50">
        <svg
          className="w-6 h-6 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-xs text-gray-200 capitalize">
          {authAction === "login" && "Redirecting to AdiCloud..."}
          {authAction === "logout" && "Signing you out..."}
          {!authAction && "Loading..."}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-gray-100">
        <Overlay />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-gray-100">
      <Header />
      {(authLoading || loading) && <Overlay />}

      <main className="flex-1 max-w-5xl mx-auto px-5 w-full">
        {error && (
          <div className="mt-6 rounded-md border border-red-400/30 bg-red-900/20 text-red-200 text-sm px-3 py-2">
            {error}
          </div>
        )}

        {!isLoggedIn ? (
          <section className="flex flex-col items-center text-center py-28">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-gray-300 mb-4">
              Secure • OAuth • Cloud-backed
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight mb-3">
              Your PDFs, Organized in the Cloud
            </h1>
            <p className="text-gray-300 max-w-2xl mb-8">
              Upload, view, and manage your PDF documents securely. Sign in with
              your developer account to sync with your private storage
              workspace.
            </p>
            <Login disabled={!accepted} />
            <p className="text-xs text-gray-500 mt-4">
              By continuing you acknowledge our
              <button
                onClick={() => setShowTerms(true)}
                className="ml-1 underline text-gray-300 hover:text-gray-100"
              >
                Terms and Privacy Policy
              </button>
              .
            </p>
            {!accepted && (
              <div className="mt-2 text-xs text-amber-300">
                Please accept the Terms & Privacy Policy to continue.
              </div>
            )}
          </section>
        ) : (
          <section className="py-12">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/40 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Upload PDF</h2>
                  <p className="text-xs text-gray-400">
                    Add files to your drive
                  </p>
                </div>
                <Dashboard />
              </div>
            </div>
          </section>
        )}
      </main>

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-2xl w-[90%] rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50 text-left">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Terms of Service & Privacy Policy
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="text-sm text-gray-300 hover:text-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-200 max-h-[50vh] overflow-y-auto pr-2">
              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  1. Service Description
                </h4>
                <p>
                  This application enables you to authenticate with your
                  developer account and manage PDF documents through a secure
                  integration with third‑party developer services. Your
                  documents are synchronized to your account using approved
                  access permissions granted during sign‑in.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  2. Permissions & Access
                </h4>
                <p>
                  During authentication you grant the application limited access
                  to create, update, and remove content necessary for storing
                  and organizing PDF files within your account workspace. Access
                  is restricted to the minimum scope required for these features
                  and may be revoked at any time from your account settings on
                  the provider’s platform.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  3. Your Content
                </h4>
                <p>
                  You retain ownership of all documents you upload. By using the
                  service, you authorize storage, retrieval, and management
                  operations on your behalf in order to provide the
                  application’s core functionality. You are responsible for
                  ensuring that uploaded content complies with applicable laws
                  and does not contain prohibited or sensitive information
                  beyond your intended use.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  4. Privacy & Security
                </h4>
                <p>
                  We do not store your access token in the browser. Sessions are
                  maintained securely on the server. Operational logs avoid
                  personal content and tokens. Data transmission occurs over
                  secure channels. When provider limits or errors occur, the
                  application may retry operations and surface clear status
                  messages without exposing sensitive details.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  5. Revocation & Deletion
                </h4>
                <p>
                  You may end access by signing out or revoking permissions from
                  the provider. Removing a document from within the application
                  requests its deletion from the synchronized storage location.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">
                  6. Acceptable Use
                </h4>
                <p>
                  Do not upload unlawful content, malware, or materials you are
                  not authorized to share. Abuse, automated scraping, or
                  attempts to circumvent platform restrictions are prohibited
                  and may result in limited access.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">7. Changes</h4>
                <p>
                  We may update these terms and the policy to reflect
                  improvements or compliance needs. Continued use after updates
                  indicates acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h4 className="font-medium text-gray-100 mb-1">8. Contact</h4>
                <p>
                  For questions or requests regarding data or access, contact
                  the project maintainers via the repository’s issue tracker.
                </p>
              </section>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                I have read and agree to the Terms of Service and Privacy
                Policy.
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-3 py-1.5 text-xs rounded-md border border-white/15 hover:bg-white/10"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowTerms(false)}
                  disabled={!accepted}
                  className="px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/15 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-auto border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 py-6 text-center text-xs text-gray-400">
          ©2025 AdiCloud — adicloud.com
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
