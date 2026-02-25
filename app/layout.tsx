import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'CNO Water Data Hub',
  description: 'A comprehensive platform for water quality and data monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header/Navigation */}
        <header className="bg-primary text-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition">
                  CNO Water Data Hub
                </Link>
                <ul className="hidden md:flex gap-6">
                  <li>
                    <Link href="/map" className="hover:text-blue-100 transition">
                      Map
                    </Link>
                  </li>
                  <li>
                    <Link href="/data" className="hover:text-blue-100 transition">
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-blue-100 transition">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-400">
                  CNO Water Data Hub provides real-time water quality monitoring and data analysis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/map" className="hover:text-white transition">Map</Link></li>
                  <li><Link href="/data" className="hover:text-white transition">Data</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">
                  Email: info@cnowater.org<br />
                  Phone: (555) 123-4567
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-center text-gray-400">
                &copy; 2024 CNO Water Data Hub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
