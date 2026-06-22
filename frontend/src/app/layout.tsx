import type { Metadata } from "next";
import "./globals.css";
import "./tabler-icons.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "OmniShoe — Sneaker Culture Việt Nam",
  description: "Đón đầu xu hướng sneaker culture tại Việt Nam. Khám phá những phối màu giới hạn độc nhất dành riêng cho thế hệ Gen Z.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,700;1,800;1,900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
