export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">About CNO Water Data Hub</h1>
          <p className="text-xl text-blue-700">
            Empowering the Choctaw Nation of Oklahoma with water resources data and insights
          </p>
        </header>

        <article className="space-y-8">
          {/* Mission Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              The CNO Water Data Hub is dedicated to providing the Choctaw Nation of Oklahoma with
              comprehensive, real-time water resources data and analysis tools. We aggregate data from
              the United States Geological Survey (USGS) and other sources to support water management,
              environmental monitoring, and decision-making across CNO territory.
            </p>
            <p className="text-gray-700">
              By making this data accessible and interactive, we aim to support the Nation&apos;s commitment to
              environmental stewardship and sustainable water resource management.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Interactive Map</h3>
                <p className="text-gray-700">
                  Visualize water monitoring stations and CNO territory boundaries in an interactive map view.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Real-Time Data</h3>
                <p className="text-gray-700">
                  Access current stream gauge readings, discharge rates, and other water quality parameters.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Historical Analysis</h3>
                <p className="text-gray-700">
                  Explore historical water data trends to understand seasonal patterns and long-term changes.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Data Export</h3>
                <p className="text-gray-700">
                  Download water data in various formats for further analysis and reporting.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sources Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Data Sources</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">USGS National Water Information System (NWIS)</h3>
                <p className="text-gray-700 mb-2">
                  Primary data source providing real-time and historical water resources data from across Oklahoma.
                  We pull instantaneous values including discharge (cubic feet per second), gage height (feet),
                  and specific conductance (microsiemens per centimeter).
                </p>
                <a
                  href="https://waterdata.usgs.gov/ok/"
                  className="text-blue-600 hover:underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit USGS Oklahoma Water Data →
                </a>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Geographic Data</h3>
                <p className="text-gray-700">
                  CNO boundary and hydrographic data sourced from USGS, NOAA, and the Choctaw Nation of Oklahoma
                  geographic information systems.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Frontend</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Next.js 14 (React framework)</li>
                  <li>• Leaflet & React-Leaflet (mapping)</li>
                  <li>• Tailwind CSS (styling)</li>
                  <li>• TypeScript (type safety)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Backend & Data</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Next.js API Routes (serverless)</li>
                  <li>• PostgreSQL + PostGIS (spatial database)</li>
                  <li>• USGS REST API integration</li>
                  <li>• Railway / Supabase hosting</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-blue-50 rounded-lg border-l-4 border-blue-600 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-4">
              Have questions about this project or want to contribute? We welcome feedback and collaboration
              on water resources data initiatives within CNO territory.
            </p>
            <p className="text-gray-700 text-sm">
              For inquiries, please contact the Choctaw Nation of Oklahoma Water Resources Department.
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm border-t border-gray-300 pt-6">
          <p>
            © 2024 Choctaw Nation of Oklahoma Water Data Hub. All rights reserved.
          </p>
          <p className="mt-2">
            Data sources: USGS NWIS, NOAA, Choctaw Nation of Oklahoma
          </p>
        </footer>
      </div>
    </main>
  );
}
