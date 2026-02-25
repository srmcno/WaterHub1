'use client';

import MapWrapper from '@/components/MapWrapper';

export default function MapPage() {
  return (
    <main className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-3xl font-bold">Interactive Water Map</h1>
        <p className="text-blue-100">Choctaw Nation of Oklahoma Water Resources</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main map area */}
        <div className="flex-1">
          <MapWrapper />
        </div>

        {/* Sidebar panel */}
        <aside className="w-80 bg-white border-l border-gray-300 overflow-y-auto shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Station Information</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-600 text-sm">
                  Select a station on the map to view detailed information about water flow,
                  stream gauge data, and historical readings.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Info</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Total stations: Loading...</li>
                  <li>• Last updated: --</li>
                  <li>• Data coverage: CNO Territory</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
