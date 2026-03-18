import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade Circle - Your Ultimate Trading Companion",
  description:
    "Trade Circle provides real-time trading signals, smart strategies, and powerful tools to help you turn market moves into profitable trades. Join now and get a 20% bonus on your first deposit!",
  icons: {
    icon: "/trade-circle-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-(--brand-dark) text-white relative">

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GSM4YXBCJ5"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GSM4YXBCJ5');
          `}
        </Script>

        <main className="w-full md:w-[70%] mx-auto">
          {children}
        </main>

        {/* Zoho SalesIQ Live Chat */}
        <Script id="zoho-salesiq-init" strategy="afterInteractive">
          {`
            window.$zoho=window.$zoho || {};
            $zoho.salesiq=$zoho.salesiq||{ready:function(){}};
          `}
        </Script>

        <Script
          id="zoho-salesiq-script"
          src="https://salesiq.zohopublic.in/widget?wc=siq4c8e819cb495c0e3a7681477896023e14714babb3b73f6f9e32d866f47fce36b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
