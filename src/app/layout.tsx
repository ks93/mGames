import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mGames - Fun Browser Games",
  description: "A collection of fun and interactive browser games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 to-gray-800`}>
        <nav className="bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-white">mGames</span>
                </Link>
              </div>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/games" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Games
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} mGames. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
