import { Geist, Geist_Mono, Red_Hat_Text, Cormorant_Garamond } from "next/font/google";
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

const redHatSans = Red_Hat_Text({
    variable: "--font-red-hat",
    subsets: ["latin"]
})

const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant-garamond",
    weight: ["300", "400", "500", "600", "700"],
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
        className={`${redHatSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} max-h-screen max-w-screen overflow-hidden antialiased`}
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
