import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "@/context/InventoryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio Inventory Pro",
  description: "Minimalist Studio Inventory Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} min-h-screen bg-background text-foreground tracking-wide`}>
        <InventoryProvider>
          <main className="mx-auto max-w-md min-h-screen bg-background shadow-2xl shadow-black/5 relative overflow-hidden">
            {/* Simulate mobile app container on desktop, full width on mobile */}
            {children}
          </main>
        </InventoryProvider>
      </body>
    </html>
  );
}
