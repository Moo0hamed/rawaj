import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAWAJ Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#03080F] font-sans text-[#E9F1FF]">
        {children}
      </body>
    </html>
  );
}