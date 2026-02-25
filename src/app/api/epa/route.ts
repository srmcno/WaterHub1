import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ECHO_BASE = 'https://echo.epa.gov/rest/services';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const endpoint = searchParams.get('endpoint') ?? 'facilities';
  const state = searchParams.get('state') ?? searchParams.get('p_st');
  const zip = searchParams.get('zip');
  const p_co = searchParams.get('p_co');

  let url: string;
  if (endpoint === 'violations') {
    url = `${ECHO_BASE}/cwa_rest_services.get_facilities`;
  } else if (endpoint === 'effluent') {
    url = `${ECHO_BASE}/dmr_rest_services.get_custom_data_facility`;
  } else {
    url = `${ECHO_BASE}/cwa_rest_services.get_facilities`;
  }

  const params: Record<string, string> = {
    output: 'JSON',
    p_act: 'Y',
  };
  if (state) params.p_st = state;
  if (zip) params.p_zip = zip;
  if (p_co) params.p_co = p_co;

  try {
    const response = await axios.get(url, {
      params,
      timeout: 15000,
      headers: { 'Accept': 'application/json' },
    });

    return NextResponse.json(response.data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=600',
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      return NextResponse.json(
        { error: 'EPA API error', message: error.message },
        { status, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
