import Image from "next/image";
import Gaze from "@/components/gaze";


export const metadata = {
  title: "eyesite",
  description: "Check my stuff out.",
  openGraph: {
    type: "website",
    url: "https://eyesite.andykhau.com/",
    title: "eyesite",
    description: "An experimental website combining computer vision and web design.",
    images: [
      {
        url: "/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "eyesite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eyesite",
    description: "An experimental website combining computer vision and web design.",
    images: ["/thumbnail.jpg"],
  },
};

export default function Home() {
  return (
      <Gaze />
  );
}
