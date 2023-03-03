import "./global.css";

export const metadata = {
  title: "Šeptej 🤫",
  description: "Přepis záznamu do textu pomocí OpenAI Whisper",
  openGraph: {
    images: [{ url: "https://i.ohlasy.info/i/d4a6851b.jpg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <script
          defer
          data-domain="septej.ohlasy.info"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
