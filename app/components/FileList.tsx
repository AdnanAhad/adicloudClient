import React from "react";
import { Files } from "../types/types";

type FileListProps = {
  files?: Files[];
  onDeleted?: () => void;
};

const FileList: React.FC<FileListProps> = ({ files, onDeleted }) => {
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const handleDelete = async (file: Files) => {
    const ask = confirm(`Delete \"${file.name}\"?`);
    if (!ask) return;

    try {
      setDeleting(file.name);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ fileName: file.name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Failed to delete", await res.text());
        return;
      }

      onDeleted?.();
    } catch (err) {
      console.error("Error deleting file", err);
    } finally {
      setDeleting(null);
    }
  };

  if (!Array.isArray(files) || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-gray-400">
        <svg
          className="w-8 h-8 opacity-60"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 3h8l4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
          />
        </svg>
        <p className="text-sm">No files yet. Upload your first PDF.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
        >
          <a
            href={file.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-100 hover:underline truncate max-w-[75%]"
            title={file.name}
          >
            {file.name}
          </a>

          <button
            onClick={() => handleDelete(file)}
            disabled={deleting === file.name}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-400/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 px-2 py-1 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${file.name}`}
            title="Delete"
          >
            {deleting === file.name ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                Deleting...
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8zm4-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm3-3h-2.5l-.5-.5a1 1 0 0 0-.7-.3H9.7a1 1 0 0 0-.7.3L8.5 4H6a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zM5 7h10l-.6 9.3A2 2 0 0 1 12.4 18H7.6a2 2 0 0 1-2-1.7L5 7z" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;
