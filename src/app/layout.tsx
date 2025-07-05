import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShadowAuth - Gizlilik Odaklı Oturum Yönetimi",
  description: "Merkeziyetsiz, gizlilik koruyan, iz bırakmayan oturum yönetimi platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-200`}>
        <Providers>
          <Navbar />
          <main className="pt-14">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
