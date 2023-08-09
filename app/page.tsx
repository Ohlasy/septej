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
        setModel({ state: "failed", error: response.statusText });
      }
    } catch (e) {
      setModel({ state: "failed", error: `${e}` });
    }
  };
  switch (model.state) {
    case "picking_file":
      return <UploadForm onSubmit={handleSubmit} />;
    case "transcribing":
      return <Spinner />;
    case "transcribed":
      return <OutputText text={model.text} />;
    case "failed":
      return <ErrorScreen error={model.error} />;
  }
}

//
// Upload Screen
//

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
            <div className="flex flex-col items-center justify-center pt-5 pb-6 max-w-[50ex]">
              <CloudIcon />
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Kliknutím nahrajete soubor
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 p-5 text-center">
                Formáty MP3, MP4, MPEG, MPGA, M4A, WAV nebo WEBM. Maximálně
                4,5 MB (
                <a
                  href="https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions"
                  className="underline"
                >
                  omezení Vercelu
                </a>
                )
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
      <Footer />
    </div>
  );
};

const CloudIcon = () => (
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
);

const Footer = () => (
  <p className="text-sm text-gray-500 max-w-[50ex] text-center">
    Šeptej – přepis nahrávek pomocí{" "}
    <a
      href="https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
      className="underline"
    >
      OpenAI Whisper
    </a>
    . Zdrojový kód na{" "}
    <a href="https://github.com/Ohlasy/septej" className="underline">
      GitHubu
    </a>
    . Provoz sponzorují{" "}
    <a href="https://ohlasy.info" className="underline">
      Ohlasy
    </a>
    .
  </p>
);

//
// Transcribing Screen
//

const Spinner = () => (
  <div className="grid h-screen place-items-center m-5">
    <div role="status">
      <CircleIcon />
      <div className="mt-4 text-center">
        <p>Přepisuju…</p>
        <p className="text-gray-500 text-sm">
          Přepsat 10 minut záznamu trvá zhruba minutu.
        </p>
      </div>
    </div>
  </div>
);

const CircleIcon = () => (
  <svg
    aria-hidden="true"
    className="m-auto w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

//
// Transcription Output
//

type OutputTextProps = {
  text: string;
};

const OutputText = ({ text }: OutputTextProps) => (
  <div className="max-w-prose m-auto bg-slate-200 min-h-screen">
    <div className="font-mono p-5">{text}</div>
  </div>
);

//
// Error
//

type ErrorScreenProps = {
  error: string;
};

const ErrorScreen = ({ error }: ErrorScreenProps) => (
  <div className="grid h-screen place-items-center m-5">
    <div className="mt-4 text-center">
      <p>Chyba 🫤</p>
      <p className="text-gray-500 text-sm">{error}</p>
    </div>
  </div>
);
