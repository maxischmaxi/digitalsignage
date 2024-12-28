import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import QueryProvider from "@/components/query-provider";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { digitalsignageFileRouter } from "@/app/api/uploadthing/core";
import { connection } from "next/server";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  params: Promise<{ lng: string }>;
  children: ReactNode;
};

async function UTSSR() {
  await connection();
  return (
    <NextSSRPlugin
      routerConfig={extractRouterConfig(digitalsignageFileRouter)}
    />
  );
}

export default async function Layout({ params, children }: Props) {
  const data = await auth.getSession();

  if (!data) {
    notFound();
  }

  if (!data.user.email) {
    notFound();
  }

  const { lng } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(lng as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={lng} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Auth0Provider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Suspense>
                  <UTSSR />
                </Suspense>
                {children}
              </ThemeProvider>
            </QueryProvider>
          </Auth0Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
