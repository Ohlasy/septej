import "./global.css";

export const metadata = {
  title: "Šeptej 🤫",
  description: "Přepis záznamu do textu pomocí OpenAI Whisper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
