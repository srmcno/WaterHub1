import React from "react";
import Head from "next/head";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                CNO
              </div>
              <div>
                <h1 className="text-lg font-bold text-blue-900 leading-tight">
                  CNO Water Data Hub
                </h1>
                <p className="text-xs text-gray-500">
                  Choctaw Nation of Oklahoma · Environmental Protection Service
                </p>
              </div>
            </div>
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-700 transition-colors">
                Map
              </Link>
              <Link href="/data" className="hover:text-blue-700 transition-colors">
                Data
              </Link>
              <Link href="/about" className="hover:text-blue-700 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Choctaw Nation of Oklahoma · Environmental Protection Service · Data sourced from USGS, EPA, OWRB
          </div>
        </footer>
      </div>
    </>
  );
}
