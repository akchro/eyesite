import { Geist, Geist_Mono } from "next/font/google";
import {WebgazerProvider} from "@/components/webgazerProvider";
import LandingScreen from "@/components/LandingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eyesite",
  description: "Eye tracking cursor experimental",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <WebgazerProvider>
              <LandingScreen>
                  {children}
              </LandingScreen>
          </WebgazerProvider>
      </body>
    </html>
  );
}
