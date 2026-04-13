const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const API_VERSION = "/api/v1";

// ==================== ALERT TYPES ====================
export interface AlertIOCs {
  ips: string[];
  hashes: string[];
  domains: string[];
  urls: string[];
}

export interface Alert {
  id: string;
  source: string;
  source_id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "new" | "open" | "investigating" | "closed";
  source_ip: string;
  dest_ip: string;
  hostname: string;
  rule_name: string;
  iocs: AlertIOCs;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Legacy fields for backwards compatibility
  alert_id?: string;
  timestamp?: string;
  rule_level?: number;
  rule_description?: string;
  agent_name?: string;
  agent_ip?: string;
  incident_id?: string;
  investigation_id?: string;
}

export interface AlertRelationships {
  incidents: {
    count: number;
    items: { id: string; title: string }[];
    view_all: string;
  };
  similar: {
    count: number;
    items: { id: string; source_ip: string }[];
    view_all: string;
  };
}

export interface AlertDetailResponse {
  data: Alert;
  relationships: AlertRelationships;
  actions: {
    view_timeline?: string;
    search_ip?: string;
  };
}

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== INCIDENT TYPES ====================
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "closed";
  assigned_to: string | null;
  assigned_username: string | null;
  tags: string[];
  alert_count: number;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  // Legacy fields
  incident_id?: string;
  investigation_id?: string;
}

export interface IncidentRelationships {
  alerts: {
    count: number;
    items: Alert[];
    view_all: string;
  };
  timeline: {
    exists: boolean;
    view: string;
  };
  investigations: {
    exists: boolean;
    view: string;
  };
}

export interface IncidentDetailResponse {
  data: Incident;
  relationships: IncidentRelationships;
}

export interface IncidentListResponse {
  incidents: Incident[];
  total: number;
  limit: number;
  offset: number;
}

export interface TimelineEvent {
  type: string;
  timestamp: string;
  description?: string;
  investigation_id?: string;
  playbook_generated?: boolean;
  decided_by?: string;
  fix_verified?: boolean;
}

export interface IncidentTimeline {
  incident_id: string;
  total_events: number;
  events: TimelineEvent[];
}

// ==================== INVESTIGATION TYPES ====================
export interface Investigation {
  id: string;
  incident_id: string;
  incident_title: string;
  incident_severity?: string;
  status: "pending" | "running" | "awaiting_approval" | "approved" | "declined" | "completed" | "failed" | "archived";
  severity?: "critical" | "high" | "medium" | "low";
  source_ips?: string[];
  ai_summary?: string;
  ai_narrative?: string;
  ai_risk?: string;
  playbook_yaml?: string;
  playbook_valid?: boolean;
  playbook_error?: string | null;
  target_host?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields
  investigation_id?: string;
  summary?: string;
  playbook?: Playbook;
  ai_analysis?: AIAnalysis;
}

export interface InvestigationStats {
  pending: number;
  awaiting_approval: number;
  approved: number;
  running: number;
  completed: number;
  failed: number;
  archived: number;
  declined: number;
  total: number;
}

export interface InvestigationListResponse {
  investigations: Investigation[];
  total: number;
}

export interface InvestigationTimeline {
  investigation_id: string;
  events: TimelineEvent[];
}

export interface PlaybookYamlResponse {
  yaml: string;
  valid: boolean;
  investigation_id: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  steps: PlaybookStep[];
  status: "pending" | "approved" | "declined" | "executed";
}

export interface PlaybookStep {
  id: string;
  order: number;
  action: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  output?: string;
}

export interface AIAnalysis {
  threat_assessment: string;
  confidence: number;
  indicators: string[];
  recommendations: string[];
  timeline: TimelineEvent[];
}

// ==================== ARCHIVE TYPES ====================
export interface Archive {
  id: string;
  investigation_id: string;
  incident_id: string;
  incident_title: string;
  severity: "critical" | "high" | "medium" | "low";
  fix_status: "likely_fixed" | "not_fixed" | "unknown";
  fix_detail: string;
  full_context?: Record<string, unknown>;
  archived_at: string;
  // Legacy fields
  archive_id?: string;
  summary?: string;
  resolution?: string;
  lessons_learned?: string;
}

export interface ArchiveStats {
  total_archived: number;
  fix_success_rate_pct: number;
  by_fix_status: {
    likely_fixed: number;
    not_fixed: number;
    unknown: number;
  };
  by_severity: {
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
}

export interface ArchiveListResponse {
  archives: Archive[];
  total: number;
}

export interface ArchiveDetailResponse {
  id: string;
  investigation_id: string;
  incident_id: string;
  incident_title: string;
  severity: string;
  fix_status: string;
  fix_detail: string;
  full_context: {
    investigation?: Investigation;
    incident?: Incident;
    alerts?: Alert[];
  };
  archived_at: string;
}

// ==================== PIPELINE TYPES ====================
export interface PipelineStatus {
  running: boolean;
  poll_interval: number;
  batch_size: number;
  description: string;
}

export interface PipelineSource {
  source: string;
  cursor: string;
  documents_tracked: number;
  index_pattern: string;
}

export interface PipelineSourcesResponse {
  sources: PipelineSource[];
}

export interface AlertTrace {
  alert_id: string;
  steps: {
    step: string;
    timestamp: string;
  }[];
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardSummary {
  alerts: {
    total: number;
    by_severity: Record<string, number>;
    by_status: Record<string, number>;
    by_source: Record<string, number>;
    navigation: string;
  };
  incidents: {
    total: number;
    by_severity: Record<string, number>;
    by_status: Record<string, number>;
    navigation: string;
  };
  investigations: {
    total: number;
    by_status: Record<string, number>;
    navigation: string;
  };
  archives: {
    total: number;
    navigation: string;
  };
  pipeline: {
    running: boolean;
  };
}

export interface QuickStats {
  alerts: number;
  incidents: number;
  investigations: number;
  archives: number;
}

export interface DashboardStats {
  total_alerts: number;
  critical_alerts: number;
  open_incidents: number;
  active_investigations: number;
  pending_approvals: number;
  alerts_trend: TrendData[];
  incidents_by_severity: SeverityCount[];
  recent_activity: ActivityItem[];
}

export interface TrendData {
  timestamp: string;
  count: number;
}

export interface SeverityCount {
  severity: string;
  count: number;
}

export interface ActivityItem {
  id: string;
  type: "alert" | "incident" | "investigation" | "archive";
  message: string;
  timestamp: string;
}

// ==================== METRICS TYPES ====================
export interface MetricData {
  host: string;
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
}

export interface MetricsDashboard {
  hosts: MetricData[];
  timestamp: string;
}

// ==================== MONITORING TYPES ====================
export interface ServiceStatus {
  name: string;
  status: "running" | "stopped" | "error";
  port?: number;
  poll_interval?: number;
}

export interface ServicesStatus {
  services: Record<string, ServiceStatus>;
  total_running: number;
  total_disabled: number;
}

export interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency_ms: number;
  last_check: string;
  details?: string;
}

export interface MonitorHealth {
  status: string;
  database: string;
  timestamp: string;
}

// ==================== SEARCH TYPES ====================
export interface SearchResponse {
  query: string;
  results: {
    alerts: Alert[];
    incidents: Incident[];
    investigations: Investigation[];
  };
  counts: {
    alerts: number;
    incidents: number;
    investigations: number;
  };
}

export interface IPSearchResponse {
  ip: string;
  results: {
    alerts: Alert[];
    incidents: Incident[];
  };
  counts: {
    alerts: number;
    incidents: number;
  };
}

export interface SearchResult {
  type: "alert" | "incident" | "investigation" | "archive";
  id: string;
  title: string;
  description: string;
  timestamp: string;
  relevance: number;
}

// ==================== IPS MAP TYPES ====================
export interface AttackSource {
  ip: string;
  country: string;
  countryName: string;
  city?: string;
  lat: number;
  lon: number;
  isp?: string;
}

export interface AttackDestination {
  ip: string;
  country: string;
  countryName: string;
}

export interface AttackEvent {
  id: string;
  timestamp: string;
  source: AttackSource;
  destination: AttackDestination;
  severity: string;
  alertName: string;
}

export interface IPSMapData {
  attacks: AttackEvent[];
  count: number;
}

export interface IPSStatistics {
  total_attacks: number;
  unique_sources: number;
  active_events: number;
  by_severity: Record<string, number>;
  top_countries: { code: string; count: number }[];
}

// ==================== AI ASSISTANT TYPES ====================
export interface AssistantContext {
  available_sources: {
    name: string;
    description: string;
    endpoint: string;
  }[];
  query_tips: string[];
}

export interface AssistantHealth {
  status: string;
  llm_available: boolean;
}

export interface AssistantQueryRequest {
  question: string;
  context?: {
    time_range?: string;
  };
  sources?: string[];
}

export interface AssistantQueryResponse {
  answer: string;
  sources: {
    type: string;
    id: string;
    title: string;
  }[];
  statistics?: {
    archives: number;
    active_investigations: number;
    live_alerts_incidents: number;
  };
  record_count: number;
  recommendations?: {
    action: string;
    investigation_id?: string;
  }[];
}

// ==================== LEGACY TYPES (for backwards compatibility) ====================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ==================== API FUNCTIONS ====================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// Dashboard
export const dashboardAPI = {
  getSummary: () => fetchAPI<DashboardSummary>(`${API_VERSION}/dashboard/summary`),
  getQuickStats: () => fetchAPI<QuickStats>(`${API_VERSION}/dashboard/quick-stats`),
  getStats: () => fetchAPI<DashboardStats>("/api/dashboard/stats"),
};

// Alerts
export const alertsAPI = {
  list: (params?: { 
    limit?: number; 
    offset?: number; 
    status?: string; 
    severity?: string; 
    source?: string;
    hostname?: string;
    // Legacy params
    page?: number; 
    page_size?: number; 
    level?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    if (params?.status) searchParams.set("status", params.status);
    if (params?.severity) searchParams.set("severity", params.severity);
    if (params?.source) searchParams.set("source", params.source);
    if (params?.hostname) searchParams.set("hostname", params.hostname);
    // Legacy
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    if (params?.level) searchParams.set("level", params.level.toString());
    return fetchAPI<AlertListResponse>(`${API_VERSION}/alerts?${searchParams}`);
  },
  get: (id: string) => fetchAPI<AlertDetailResponse>(`${API_VERSION}/alerts/${id}`),
  getIncidents: (id: string) => fetchAPI<{ incidents: Incident[]; total: number }>(`${API_VERSION}/alerts/${id}/incidents`),
  getSimilar: (id: string) => fetchAPI<{ alerts: Alert[]; total: number }>(`${API_VERSION}/alerts/${id}/similar`),
  // Legacy
  getRelationships: (id: string) =>
    fetchAPI<{ incident?: Incident; investigation?: Investigation }>(`/api/alerts/${id}/relationships`),
};

// Incidents
export const incidentsAPI = {
  list: (params?: { 
    limit?: number; 
    offset?: number; 
    status?: string; 
    severity?: string;
    assignee?: string;
    // Legacy
    page?: number; 
    page_size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    if (params?.status) searchParams.set("status", params.status);
    if (params?.severity) searchParams.set("severity", params.severity);
    if (params?.assignee) searchParams.set("assignee", params.assignee);
    // Legacy
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    return fetchAPI<IncidentListResponse>(`${API_VERSION}/incidents?${searchParams}`);
  },
  get: (id: string) => fetchAPI<IncidentDetailResponse>(`${API_VERSION}/incidents/${id}`),
  getAlerts: (id: string) => fetchAPI<{ alerts: Alert[]; total: number }>(`${API_VERSION}/incidents/${id}/alerts`),
  getTimeline: (id: string) => fetchAPI<IncidentTimeline>(`${API_VERSION}/incidents/${id}/timeline`),
  getInvestigations: (id: string) => fetchAPI<{ investigations: Investigation[]; total: number }>(`${API_VERSION}/incidents/${id}/investigations`),
  getByAlert: (alertId: string) => fetchAPI<{ incidents: Incident[]; total: number }>(`${API_VERSION}/incidents/by-alert/${alertId}`),
};

// Investigations
export const investigationsAPI = {
  list: (params?: { 
    limit?: number; 
    offset?: number; 
    status?: string;
    source?: string;
    severity?: string;
    // Legacy
    page?: number; 
    page_size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    if (params?.status) searchParams.set("status", params.status);
    if (params?.source) searchParams.set("source", params.source);
    if (params?.severity) searchParams.set("severity", params.severity);
    // Legacy
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    return fetchAPI<InvestigationListResponse>(`${API_VERSION}/investigations?${searchParams}`);
  },
  get: (id: string) => fetchAPI<Investigation>(`${API_VERSION}/investigations/${id}`),
  getStats: () => fetchAPI<InvestigationStats>(`${API_VERSION}/investigations/stats`),
  getPlaybookYaml: (id: string) => fetchAPI<PlaybookYamlResponse>(`${API_VERSION}/investigations/${id}/playbook/yaml`),
  updatePlaybook: (id: string, yaml: string) => 
    fetchAPI<{ message: string }>(`${API_VERSION}/investigations/${id}/playbook`, {
      method: "PUT",
      body: JSON.stringify({ yaml }),
    }),
  approve: (id: string, decidedBy: string) =>
    fetchAPI<{ message: string; investigation_id: string }>(`${API_VERSION}/investigations/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ decided_by: decidedBy }),
    }),
  decline: (id: string, decidedBy: string, reason?: string) =>
    fetchAPI<{ message: string; investigation_id: string }>(`${API_VERSION}/investigations/${id}/decline`, {
      method: "POST",
      body: JSON.stringify({ decided_by: decidedBy, reason }),
    }),
  execute: (id: string) =>
    fetchAPI<{ message: string }>(`${API_VERSION}/investigations/${id}/execute`, { method: "POST" }),
  getTimeline: (id: string) => fetchAPI<InvestigationTimeline>(`${API_VERSION}/investigations/${id}/timeline`),
  // Legacy
  getPlaybook: (id: string) => fetchAPI<Playbook>(`/api/investigations/${id}/playbook`),
  approvePlaybook: (id: string) =>
    fetchAPI<{ status: string }>(`/api/investigations/${id}/playbook/approve`, { method: "POST" }),
  declinePlaybook: (id: string, reason: string) =>
    fetchAPI<{ status: string }>(`/api/investigations/${id}/playbook/decline`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  executePlaybook: (id: string) =>
    fetchAPI<{ status: string }>(`/api/investigations/${id}/playbook/execute`, { method: "POST" }),
  archive: (id: string, data: { resolution: string; lessons_learned?: string }) =>
    fetchAPI<Archive>(`/api/investigations/${id}/archive`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Archives
export const archivesAPI = {
  list: (params?: { 
    limit?: number; 
    offset?: number; 
    fix_status?: string;
    // Legacy
    page?: number; 
    page_size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    if (params?.fix_status) searchParams.set("fix_status", params.fix_status);
    // Legacy
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.page_size) searchParams.set("page_size", params.page_size.toString());
    return fetchAPI<ArchiveListResponse>(`${API_VERSION}/archives?${searchParams}`);
  },
  get: (id: string) => fetchAPI<ArchiveDetailResponse>(`${API_VERSION}/archives/${id}`),
  getStats: () => fetchAPI<ArchiveStats>(`${API_VERSION}/archives/stats`),
  getAlerts: (id: string) => fetchAPI<{ alerts: Alert[]; total: number }>(`${API_VERSION}/archives/${id}/alerts`),
  getByInvestigation: (investigationId: string) => fetchAPI<Archive>(`${API_VERSION}/archives/by-investigation/${investigationId}`),
  // Legacy
  getFullContext: (id: string) =>
    fetchAPI<{ archive: Archive; investigation: Investigation; incident: Incident; alerts: Alert[] }>(
      `/api/archives/${id}/context`
    ),
};

// Pipeline
export const pipelineAPI = {
  getStatus: () => fetchAPI<PipelineStatus>(`${API_VERSION}/pipeline/status`),
  getSources: () => fetchAPI<PipelineSourcesResponse>(`${API_VERSION}/pipeline/sources`),
  getCursors: () => fetchAPI<Record<string, string>>(`${API_VERSION}/pipeline/cursors`),
  traceAlert: (alertId: string) => fetchAPI<AlertTrace>(`${API_VERSION}/pipeline/trace/alert/${alertId}`),
  // Legacy
  getStats: () =>
    fetchAPI<{ total_processed: number; error_rate: number; avg_processing_time: number }>("/api/pipeline/stats"),
};

// Metrics
export const metricsAPI = {
  getDashboard: () => fetchAPI<MetricsDashboard>(`${API_VERSION}/metrics/dashboard`),
  getHost: (host: string) => fetchAPI<MetricData>(`${API_VERSION}/metrics/${host}`),
  getHostRelationships: (host: string) => fetchAPI<{
    host: string;
    metrics: MetricData;
    alerts: Alert[];
    investigations: Investigation[];
  }>(`${API_VERSION}/metrics/${host}/relationships`),
  // Legacy
  getHosts: () => fetchAPI<string[]>("/api/metrics/hosts"),
  getHostMetrics: (host: string, timeRange?: string) => {
    const params = timeRange ? `?time_range=${timeRange}` : "";
    return fetchAPI<MetricData[]>(`/api/metrics/hosts/${host}${params}`);
  },
  getOverview: () =>
    fetchAPI<{ total_hosts: number; avg_cpu: number; avg_memory: number; critical_hosts: string[] }>(
      "/api/metrics/overview"
    ),
};

// Monitoring
export const monitoringAPI = {
  getServicesStatus: () => fetchAPI<ServicesStatus>("/monitor/services-status"),
  getHealth: () => fetchAPI<MonitorHealth>("/monitor/health"),
  getPipelineHealth: () => fetchAPI<{ status: string }>("/monitor/pipeline-health"),
  getStuckInvestigations: () => fetchAPI<Investigation[]>("/monitor/stuck-investigations"),
  getServiceLogs: (service: string) => fetchAPI<string[]>(`/monitor/services/${service}/logs`),
  getServiceErrors: (service: string) => fetchAPI<string[]>(`/monitor/services/${service}/errors`),
  // Legacy
  getService: (name: string) => fetchAPI<ServiceHealth>(`/api/monitoring/services/${name}`),
};

// Search
export const searchAPI = {
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query });
    if (limit) params.set("limit", limit.toString());
    return fetchAPI<SearchResponse>(`${API_VERSION}/search?${params}`);
  },
  searchByIP: (ip: string) => fetchAPI<IPSearchResponse>(`${API_VERSION}/search/ips/${ip}`),
  searchByDomain: (domain: string) => fetchAPI<SearchResponse>(`${API_VERSION}/search/domains/${domain}`),
};

// IPS Map
export const ipsAPI = {
  getMapData: () => fetchAPI<IPSMapData>(`${API_VERSION}/ips/map-data`),
  getStatistics: () => fetchAPI<IPSStatistics>(`${API_VERSION}/ips/statistics`),
  getCountries: () => fetchAPI<{ code: string; name: string }[]>(`${API_VERSION}/ips/countries`),
  submitEvent: (event: {
    source_ip: string;
    dest_ip: string;
    severity: string;
    alert_name: string;
    protocol?: string;
  }) => fetchAPI<{ status: string; event_id: string }>(`${API_VERSION}/ips/event`, {
    method: "POST",
    body: JSON.stringify(event),
  }),
};

// AI Assistant
export const aiAPI = {
  getContext: () => fetchAPI<AssistantContext>(`${API_VERSION}/assistant/context`),
  getSources: () => fetchAPI<Record<string, number>>(`${API_VERSION}/assistant/sources`),
  getHealth: () => fetchAPI<AssistantHealth>(`${API_VERSION}/assistant/health`),
  query: (request: AssistantQueryRequest) =>
    fetchAPI<AssistantQueryResponse>(`${API_VERSION}/assistant/query`, {
      method: "POST",
      body: JSON.stringify(request),
    }),
};

export { API_BASE };
