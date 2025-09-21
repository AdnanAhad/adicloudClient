import { FormEvent, useEffect, useState } from "react";
import { Files } from "../types/types";
import FileList from "./FileList";

type MessageType = "success" | "error" | "";

export const Dashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<Files[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("");

  const setStatus = (text: string, type: MessageType = "") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("");

    if (!file) {
      setStatus("Please select a PDF file.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok && res.status !== 201) {
        setStatus("Upload failed. Please try again.", "error");
        return;
      }

      setStatus("File uploaded successfully.", "success");
      setFile(null);
      await getFileList();
    } catch (error) {
      console.error("Error while uploading file", error);
      setStatus("Unexpected error during upload.", "error");
    }
  };

  const getFileList = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files`, {
        credentials: "include",
      });

      if (!res.ok) {
        setStatus("Failed to fetch file list.", "error");
        return;
      }

      const files = await res.json();
      setFileList(Array.isArray(files) ? files : []);
    } catch (error) {
      console.error("Error getting file list", error);
      setStatus("Unexpected error while fetching files.", "error");
    }
  };

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <div className="space-y-5">
      {message && (
        <div
          className={`${
            messageType === "success"
              ? "border-green-400/30 bg-green-900/20 text-green-200"
              : messageType === "error"
              ? "border-red-400/30 bg-red-900/20 text-red-200"
              : "border-white/10 bg-white/5 text-gray-200"
          } text-sm rounded-md border px-3 py-2`}
        >
          {message}
        </div>
      )}

      <form method="post" encType="multipart/form-data" onSubmit={handleUpload}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            className="flex-1 text-xs text-gray-100 file:mr-3 file:rounded-md file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-100 hover:file:bg-white/15 border rounded-md border-white/10 bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            id="pdf_input"
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              setFile(selectedFile ?? null);
            }}
          />

          <button
            type="submit"
            disabled={!file}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 hover:bg-white/15 text-gray-100 px-4 py-2 text-sm font-medium border border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 0-2 0v2H5v-2a1 1 0 1 0-2 0v3z" />
              <path d="M10 2a1 1 0 0 0-1 1v8H7l3-3 3 3h-2V3a1 1 0 0 0-1-1z" />
            </svg>
            Upload
          </button>
        </div>
      </form>

      <div className="pt-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-200">Your files</h3>
        </div>
        <FileList files={fileList} onDeleted={getFileList} />
      </div>
    </div>
  );
};
