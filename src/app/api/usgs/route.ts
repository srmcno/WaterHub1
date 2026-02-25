import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') ?? 'iv';
  const sites = searchParams.get('sites');
  const stateCd = searchParams.get('stateCd');
  const huc = searchParams.get('huc');
  const parameterCd = searchParams.get('parameterCd');
  const startDT = searchParams.get('startDT');
  const endDT = searchParams.get('endDT');
  const format = searchParams.get('format') ?? 'json';

  let baseUrl: string;
  if (type === 'gw') {
    baseUrl = 'https://waterservices.usgs.gov/nwis/gwlevels/';
  } else if (type === 'dv') {
    baseUrl = 'https://waterservices.usgs.gov/nwis/dv/';
  } else {
    baseUrl = 'https://waterservices.usgs.gov/nwis/iv/';
  }

  const params: Record<string, string> = { format };
  if (sites) params.sites = sites;
  if (stateCd) params.stateCd = stateCd;
  if (huc) params.huc = huc;
  if (parameterCd) params.parameterCd = parameterCd;
  if (startDT) params.startDT = startDT;
  if (endDT) params.endDT = endDT;

  try {
    const response = await axios.get(baseUrl, {
      params,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
      },
    });

    return NextResponse.json(response.data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=300',
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: 'USGS API error', message: error.message },
        {
          status,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
