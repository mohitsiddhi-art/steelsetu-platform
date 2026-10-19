import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steelsetu | B2B Industrial Steel Trading & Supply Platform",
  description: "Next-generation B2B portal for steel coils, GI/PPGL profile sheets, and industrial materials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
