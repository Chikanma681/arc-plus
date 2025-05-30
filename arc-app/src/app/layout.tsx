import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteHeader } from "./_components/site-header";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "ArcPlus",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ClerkProvider   
          appearance={{
              layout: {
                unsafe_disableDevelopmentModeWarnings: true,
              },
            }}>
        <TRPCReactProvider>
          <HydrateClient>
    <div className="relative flex min-h-screen flex-col space-y-12 bg-black text-white">
      <SiteHeader />
              {children}
              <Toaster />
            </div>
            </HydrateClient>    
        </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
