import type { Metadata } from "next";
import { inter } from "./ui/fonts";
import "./ui/globals.css";
import { Header, HeaderItem } from "./components/header";

export const metadata: Metadata = {
  title: "Volo Accendo Inc",
  description: "Volo Accendo's company webpage.",
};

const routes: HeaderItem[] = [
  { title: "Home", route: "/" },
  { title: "About", route: "/about/" },
  { title: "Resume", route: "/resume/" },
  { title: "Contact", route: "/contact/" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter">
      <body className={`${inter.className} antialiased mx-auto w-4/5`}>
        <Header headerItems={routes} />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
