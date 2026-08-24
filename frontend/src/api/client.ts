const API_BASE = '/api';

export interface TrendItem {
  topic: string;
  trend_score: number;
  lifecycle_stage: 'SEED' | 'EMERGING' | 'EXPANDING' | 'VIRAL' | 'SATURATION' | 'DECLINING' | 'DORMANT';
  event_count: number;
  tick: number;
  timestamp: string;
  active_platforms: Record<string, number>;
  breakdown: {
    volume_growth: number;
    engagement_velocity: number;
    acceleration: number;
    anomaly: number;
    sentiment_shift: number;
    network_propagation: number;
    composite_score: number;
  };
}

export interface NarrativeSummary {
  topic: string;
  lifecycle_stage: string;
  current_framing: string;
  mutation_detected: boolean;
  attention_migration: boolean;
  is_weak_signal: boolean;
  event_count: number;
}

export interface NarrativeEvent {
  event_type: string;
  title: string;
  description: string;
  tick: number;
  timestamp: string;
  evidence_post_ids: string[];
  confidence: number;
  meta_data: Record<string, any>;
}

export interface NetworkGraphData {
  topic: string;
  tick: number;
  nodes: Array<{
    id: string;
    label: string;
    position: { x: number; y: number };
    data: {
      author_id: string;
      author_name: string;
      platform: string;
      community: number;
      community_color: string;
      influence_score: number;
      is_bridge: boolean;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
    style: Record<string, any>;
  }>;
  stats: {
    total_nodes: number;
    total_edges: number;
    communities_count: number;
  };
}

export interface AudienceData {
  topic: string;
  tick: number;
  total_events: number;
  age_brackets: Array<{ bracket: string; percentage: number; confidence: string }>;
  language_distribution: Array<{ language: string; percentage: number }>;
  geographic_corridor: Array<{ corridor: string; share: number }>;
  disclaimer: string;
}

export interface AIBriefingResponse {
  topic: string;
  tick: number;
  briefing: string;
  confidence: number;
  provider: string;
}

export interface AIQueryResponse {
  topic: string;
  question: string;
  answer: string;
  confidence: number;
  evidence: string[];
  provider: string;
}

export const api = {
  async getReplayState() {
    const res = await fetch(`${API_BASE}/replay/state`);
    return res.json();
  },

  async startReplay() {
    const res = await fetch(`${API_BASE}/replay/start`);
    return res.json();
  },

  async pauseReplay() {
    const res = await fetch(`${API_BASE}/replay/pause`);
    return res.json();
  },

  async resetReplay() {
    const res = await fetch(`${API_BASE}/replay/reset`, { method: 'POST' });
    return res.json();
  },

  async stepTick() {
    const res = await fetch(`${API_BASE}/replay/tick`, { method: 'POST' });
    return res.json();
  },

  async jumpToTick(tick: number) {
    const res = await fetch(`${API_BASE}/replay/jump/${tick}`, { method: 'POST' });
    return res.json();
  },

  async getTrends(): Promise<TrendItem[]> {
    const res = await fetch(`${API_BASE}/trends`);
    return res.json();
  },

  async getTrendHistory(topic: string) {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/history`);
    return res.json();
  },

  async getTopicSentiment(topic: string) {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/sentiment`);
    return res.json();
  },

  async getTopicAudience(topic: string): Promise<AudienceData> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/audience`);
    return res.json();
  },

  async getNarratives(): Promise<NarrativeSummary[]> {
    const res = await fetch(`${API_BASE}/narratives`);
    return res.json();
  },

  async getNarrativeTimeline(topic: string): Promise<NarrativeEvent[]> {
    const res = await fetch(`${API_BASE}/narratives/${encodeURIComponent(topic)}/timeline`);
    return res.json();
  },

  async getNarrativeEvidence(topic: string) {
    const res = await fetch(`${API_BASE}/narratives/${encodeURIComponent(topic)}/evidence`);
    return res.json();
  },

  async getTopicNetwork(topic: string): Promise<NetworkGraphData> {
    const res = await fetch(`${API_BASE}/network/${encodeURIComponent(topic)}`);
    return res.json();
  },

  async getTopicCommunities(topic: string) {
    const res = await fetch(`${API_BASE}/network/${encodeURIComponent(topic)}/communities`);
    return res.json();
  },

  async getTopicEvents(topic: string) {
    const res = await fetch(`${API_BASE}/events?topic=${encodeURIComponent(topic)}`);
    return res.json();
  },

  async getNarrativeBriefing(topic: string): Promise<AIBriefingResponse> {
    const res = await fetch(`${API_BASE}/ai/briefing/${encodeURIComponent(topic)}`);
    return res.json();
  },

  async askAIAnalyst(topic: string, question: string): Promise<AIQueryResponse> {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, question })
    });
    return res.json();
  }
};
