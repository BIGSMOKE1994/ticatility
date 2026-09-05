import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticatility",
  description: "The World's Marketplace for Live Event Tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Smartsupp Live Chat */}
        <Script
          id="smartsupp-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '1c4f6281791d860cde8aeee9250dd7be542a4106';
            `,
          }}
        />

        <Script
          id="smartsupp-loader"
          src="https://www.smartsuppchat.com/loader.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}