import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAS3 Trading — Quality Japanese Vehicles",
  description:
    "Premium Japanese vehicles delivered worldwide. Browse inventory, auctions and trusted importing services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
