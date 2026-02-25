import axios from 'axios';
import { StreamGauge, GroundwaterSite } from '@/types';

const USGS_BASE = 'https://waterservices.usgs.gov/nwis';

// HUC codes covering Choctaw Nation territory in southeastern Oklahoma
const CNO_HUC8_CODES = ['11140101', '11140102', '11140201', '11140202', '11130302'];

export async function fetchStreamGauges(huc: string = '1114'): Promise<StreamGauge[]> {
  try {
    const response = await axios.get(`${USGS_BASE}/iv/`, {
      params: {
        huc,
        parameterCd: '00060', // discharge
        siteStatus: 'active',
        format: 'json',
      },
      timeout: 10000,
    });
    return parseUSGSResponse(response.data);
  } catch (error) {
    console.error('Error fetching stream gauges:', error);
    return [];
  }
}

export async function fetchGroundwaterSites(huc: string = '1114'): Promise<GroundwaterSite[]> {
  try {
    const response = await axios.get(`${USGS_BASE}/gwlevels/`, {
      params: {
        huc,
        siteStatus: 'active',
        format: 'json',
      },
      timeout: 10000,
    });

    const timeSeries = response.data?.value?.timeSeries ?? [];
    return timeSeries.map((ts: USGSTimeSeries) => {
      const site = ts.sourceInfo;
      const values = ts.values?.[0]?.value ?? [];
      const latest = values[values.length - 1];
      const geoLocation = site.geoLocation?.geogLocation;

      return {
        siteNo: site.siteCode?.[0]?.value ?? '',
        siteName: site.siteName ?? '',
        lat: geoLocation?.latitude ?? 0,
        lng: geoLocation?.longitude ?? 0,
        depth: null,
        latestLevel: latest?.value ? parseFloat(latest.value) : null,
        latestDateTime: latest?.dateTime ?? null,
      } as GroundwaterSite;
    });
  } catch (error) {
    console.error('Error fetching groundwater sites:', error);
    return [];
  }
}

interface USGSSiteCode {
  value: string;
  network?: string;
  agencyCode?: string;
}

interface USGSGeoLocation {
  geogLocation?: {
    srs?: string;
    latitude: number;
    longitude: number;
  };
}

interface USGSSourceInfo {
  siteName: string;
  siteCode?: USGSSiteCode[];
  geoLocation?: USGSGeoLocation;
}

interface USGSVariable {
  unit?: {
    unitCode?: string;
  };
  variableCode?: Array<{ value: string }>;
}

interface USGSValue {
  value: string;
  dateTime: string;
  qualifiers?: string[];
}

interface USGSTimeSeries {
  sourceInfo: USGSSourceInfo;
  variable: USGSVariable;
  values?: Array<{ value: USGSValue[] }>;
}

export function parseUSGSResponse(data: { value?: { timeSeries?: USGSTimeSeries[] } }): StreamGauge[] {
  const timeSeries = data?.value?.timeSeries ?? [];

  return timeSeries.map((ts: USGSTimeSeries) => {
    const site = ts.sourceInfo;
    const variable = ts.variable;
    const values = ts.values?.[0]?.value ?? [];
    const latest = values[values.length - 1];
    const geoLocation = site.geoLocation?.geogLocation;

    return {
      siteNo: site.siteCode?.[0]?.value ?? '',
      siteName: site.siteName ?? '',
      lat: geoLocation?.latitude ?? 0,
      lng: geoLocation?.longitude ?? 0,
      parameterCd: variable.variableCode?.[0]?.value ?? '',
      unit: variable.unit?.unitCode ?? '',
      latestValue: latest?.value ? parseFloat(latest.value) : null,
      latestDateTime: latest?.dateTime ?? null,
      status: 'active',
    } as StreamGauge;
  });
}

export { CNO_HUC8_CODES };
