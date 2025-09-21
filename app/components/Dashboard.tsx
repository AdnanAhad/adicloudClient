import { useEffect, useState } from "react";
import { Files, GitHubUser } from "../types/types";
import FileList from "./FileList";

type DashboardProps = {
  user: GitHubUser | undefined;
  // logout: () => void; // function with no arguments returning nothing
};

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [file, setFile] = useState<File | null>();
  const [fileList, setFileList] = useState<Files[]>();
  const hanldleUpload = async () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formData.append("pdf", file);
    console.log("Backend URL:", `${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    console.log("The file U uplaoding is:", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.status !== 200 && res.status !== 201) {
        alert("Error while uploading, please try again");
        return;
      }

      alert("File Uplaoded successfully");
    } catch (error) {
      console.log("Error while uplading file", error);
    }
  };

  const getFileList = async () => {
    console.log("getting file List");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files`, {
        credentials: "include",
      });

      if (res.status !== 200) {
        alert("error while Getting files list");
      }

      const files = await res.json();

      console.log("Files are:", files);
      setFileList(files);
    } catch (error) {
      console.log("Error getting file list", error);
    }
  };

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2>Upload PDF to Cloud</h2>
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={hanldleUpload}
      >
        <input
          className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="small_size"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]; // get the first file
            if (selectedFile) {
              console.log("Selected file:", selectedFile);
              setFile(selectedFile); // store the file in state
            }
          }}
        />

        <button
          type="submit"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
          // onClick={}
        >
          <svg
            className="w-4 h-4 me-2"
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
      </form>

      <FileList files={fileList} />
    </div>
  );
};
