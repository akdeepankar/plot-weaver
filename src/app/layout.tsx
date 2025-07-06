import { TamboProvider } from "@tambo-ai/react";
import { AutumnProvider } from "autumn-js/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { components } from "@/lib/tambo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AutumnProvider backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL || "http://localhost:3000"}>
          <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY as string} components={components}
          tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}>
            {children}
          </TamboProvider>
        </AutumnProvider>
      </body>
    </html>
  );
}
