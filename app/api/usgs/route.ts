import { NextRequest, NextResponse } from 'next/server';

/**
 * USGS Water Services REST API Proxy
 * 
 * Proxies requests to the USGS NWIS Instantaneous Values service.
 * Endpoint: https://waterservices.usgs.gov/nwis/iv/
 * 
 * Query Parameters:
 * - sites: Comma-separated USGS site codes (e.g., "07334200,07335000")
 * - parameterCd: Parameter codes (default: "00060,00065,72019" for discharge, gage height, specific conductance)
 * - period: Time period (e.g., "P7D" for past 7 days)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get query parameters
    const sites = searchParams.get('sites');
    const parameterCd = searchParams.get('parameterCd') || '00060,00065,72019';
    const period = searchParams.get('period') || 'P7D';

    // Validate required parameters
    if (!sites) {
      return NextResponse.json(
        { error: 'Missing required parameter: sites' },
        { status: 400 }
      );
    }

    // Build USGS API URL
    const usgsUrl = new URL('https://waterservices.usgs.gov/nwis/iv/');
    usgsUrl.searchParams.append('sites', sites);
    usgsUrl.searchParams.append('parameterCd', parameterCd);
    usgsUrl.searchParams.append('period', period);
    usgsUrl.searchParams.append('format', 'json');

    // Fetch from USGS API
    const response = await fetch(usgsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CNO-WaterHub/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `USGS API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return with cache headers
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300', // Cache for 5 minutes
      'Access-Control-Allow-Origin': '*',
    });

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('USGS API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from USGS API' },
      { status: 500 }
    );
  }
}
