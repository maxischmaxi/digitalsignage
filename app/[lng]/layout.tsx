import QueryProvider from "@/components/query-provider";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

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
    <html lang={lng}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Auth0Provider>
            <QueryProvider>{children}</QueryProvider>
          </Auth0Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
