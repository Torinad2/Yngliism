import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yngliism",
    template: "%s · Yngliism",
  },

  description:
    "Yngliism — открытая мультиязычная библиотека статей и источников.",

  metadataBase: new URL("https://yngliism.com"),

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
