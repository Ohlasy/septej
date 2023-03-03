"use client";

import { useState } from "react";

type Model =
  | { state: "picking_file" }
  | { state: "transcribing" }
  | { state: "transcribed"; text: string }
  | { state: "failed"; error: string };

export default function Home() {
  const [model, setModel] = useState<Model>({ state: "picking_file" });
  const handleSubmit = async (file: File) => {
    try {
      setModel({ state: "transcribing" });
      const payload = new FormData();
      payload.append("file", file);
      const response = await fetch("/transcribe", {
        method: "POST",
        body: payload,
      });
      if (response.ok) {
        setModel({ state: "transcribed", text: await response.text() });
      } else {
        setModel({ state: "failed", error: await response.text() });
      }
    } catch (e) {
      setModel({ state: "failed", error: `${e}` });
    }
  };
  switch (model.state) {
    case "picking_file":
      return <UploadForm onSubmit={handleSubmit} />;
    case "transcribing":
      return "Přepisuju. (Přepsat 10 minut záznamu trvá zhruba minutu.)";
    case "transcribed":
      return (
        <div>
          <p>Hotovo!</p>
          <code>{model.text}</code>
        </div>
      );
    case "failed":
      return "😞";
  }
}

type UploadFormProps = {
  onSubmit: (file: File) => void;
};

const UploadForm = ({ onSubmit }: UploadFormProps) => {
  return (
    <div className="grid h-screen place-items-center m-5">
      <form>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Kliknutím nahrajete soubor
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 p-5">
                Formáty MP3, MP4, MPEG, MPGA, M4A, WAV nebo WEBM, maximálně
                25 MB
              </p>
            </div>
            <input
              id="dropzone-file"
              className="hidden"
              type="file"
              onChange={(e) => onSubmit(e.target.files!.item(0)!)}
              required
            />
          </label>
        </div>
      </form>
    </div>
  );
};
