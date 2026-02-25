export interface StreamGauge {
  siteNo: string;
  siteName: string;
  lat: number;
  lng: number;
  parameterCd: string;
  unit: string;
  latestValue: number | null;
  latestDateTime: string | null;
  status: 'active' | 'inactive' | 'unknown';
}

export interface GroundwaterSite {
  siteNo: string;
  siteName: string;
  lat: number;
  lng: number;
  depth: number | null;
  latestLevel: number | null;
  latestDateTime: string | null;
}

export interface WaterSystemViolation {
  pwsId: string;
  pwsName: string;
  violationId: string;
  contaminant: string;
  violationType: string;
  beginDate: string;
  endDate: string | null;
  isHealthBased: boolean;
}

export interface Alert {
  id: string;
  type: 'violation' | 'flood' | 'drought' | 'quality';
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  site?: string;
}
