import React from "react";
import { Files } from "../types/types";
import Link from "next/link";

type FileListProps = {
  files?: Files[];
};

const FileList: React.FC<FileListProps> = ({ files }) => {
  const handleDelete = async (file: Files) => {
    const ask = confirm(`You want to delete ${file.name}`);

    if (!ask) {
      return;
    } else {
      const fileName = file.name;
      console.log("File Deleting:", fileName);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ fileName: fileName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response from Delete:", res);

      alert("File deleted successfully");
    }
  };

  return (
    <div className="space-y-2">
      {Array.isArray(files) && files.length > 0 ? (
        files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between border p-2 rounded-md"
          >
            <Link href={file.url}>
              <p className="text-sm text-base-400s">{file.name}</p>
            </Link>
            <button
              onClick={() => handleDelete(file)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              <svg
                className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8zm4-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm3-3h-2.5l-.5-.5a1 1 0 0 0-.7-.3H9.7a1 1 0 0 0-.7.3L8.5 4H6a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zM5 7h10l-.6 9.3A2 2 0 0 1 12.4 18H7.6a2 2 0 0 1-2-1.7L5 7z" />
              </svg>
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No files available</p>
      )}
    </div>
  );
};

export default FileList;
