import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to CNO <span className="text-primary">Water Data Hub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Real-time water quality monitoring and comprehensive data analysis for better water management.
          Access live data from multiple monitoring stations across our region.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/map"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Map
          </Link>
          <Link
            href="/data"
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            Explore Data
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Real-Time Data
              </h3>
              <p className="text-gray-600">
                Access live water quality measurements from multiple monitoring stations updated every hour.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Interactive Maps
              </h3>
              <p className="text-gray-600">
                Visualize water monitoring stations on an interactive map with detailed location information.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Historical Analysis
              </h3>
              <p className="text-gray-600">
                Analyze trends and historical data to understand long-term water quality patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <p className="text-blue-100">Monitoring Stations</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <p className="text-blue-100">Data Points</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Live Monitoring</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <p className="text-blue-100">Quality Metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore water quality data in your area. No registration required to view public data.
          </p>
          <Link
            href="/map"
            className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  )
}
