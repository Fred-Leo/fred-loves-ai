import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "Fred Loves AI", description: "An independent notebook on AI, experiments, and putting intelligent tools to work." };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${geist.variable} antialiased`}><body>{children}</body></html>;
}