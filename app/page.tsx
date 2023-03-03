"use client";

import { FormEvent, useState } from "react";

type Model =
  | { state: "picking_file" }
  | { state: "uploading" }
  | { state: "transcribed"; text: string }
  | { state: "failed"; error: string };

export default function Home() {
  const [model, setModel] = useState<Model>({ state: "picking_file" });
  const handleSubmit = async (file: File) => {
    try {
      setModel({ state: "uploading" });
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
    case "uploading":
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(selectedFile!);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files!.item(0))}
          required
        />
        <input type="submit" />
      </form>
    </div>
  );
};
