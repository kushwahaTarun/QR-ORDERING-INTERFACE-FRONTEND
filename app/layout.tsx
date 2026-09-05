import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/house/auth-provider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dining House",
  description:
    "For the restaurant team — kitchen, menu, table cards, and this week’s sales.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">
        <div className="grain" aria-hidden="true" />
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1612",
                border: "1px solid rgba(201,163,106,0.22)",
                color: "#f3ebe0",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
