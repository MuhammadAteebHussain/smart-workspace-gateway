export type ServiceStatus = 'up' | 'down';

export interface ServiceHealthResult {
  name: string;
  url: string;
  status: ServiceStatus;
  latencyMs: number;
  details?: Record<string, unknown>;
  error?: string;
}

export interface DiscoveryResult {
  gateway: {
    status: 'ok';
    service: string;
    phase: number;
  };
  services: Record<string, ServiceHealthResult>;
  timestamp: string;
}
