const API_BASE = 'http://localhost:8000/api';

export interface ReplayState {
  is_running: boolean;
  is_completed: boolean;
  current_tick: number;
  total_ticks: number;
  tick_seconds: number;
  current_timestamp: string | null;
  total_events_in_db: number;
  total_dataset_events: number;
  mode_label: string;
}

export interface TrendScoreBreakdown {
  volume_growth: number;
  engagement_velocity: number;
  acceleration: number;
  anomaly: number;
  sentiment_shift: number;
  network_propagation: number;
  composite_score: number;
}

export interface TrendSummary {
  topic: string;
  trend_score: number;
  lifecycle_stage: string;
  breakdown: TrendScoreBreakdown;
  event_count: number;
  sentiment_distribution: { positive: number; neutral: number; negative: number };
  top_emotions: string[];
  active_platforms: Record<string, number>;
  last_updated: string;
  tick: number;
}

export interface TrendScoreRecord {
  id?: number;
  topic: string;
  tick: number;
  timestamp: string;
  volume_growth: number;
  engagement_velocity: number;
  acceleration: number;
  anomaly: number;
  sentiment_shift: number;
  network_propagation: number;
  composite_score: number;
  lifecycle_stage: string;
  event_count: number;
}

export interface NarrativeEvent {
  id?: number;
  topic: string;
  tick: number;
  timestamp: string;
  event_type: 'LIFECYCLE_TRANSITION' | 'MUTATION_DETECTED' | 'ATTENTION_MIGRATION' | 'WEAK_SIGNAL';
  title: string;
  description: string;
  evidence_post_ids: string[];
  confidence: number;
  meta_data: Record<string, any>;
}

export interface NarrativeSummary {
  topic: string;
  lifecycle_stage: string;
  trend_score: number;
  event_count: number;
  mutation_detected: boolean;
  mutation_data?: Record<string, any> | null;
  attention_migration: boolean;
  migration_data?: Record<string, any> | null;
  is_weak_signal: boolean;
  narrative_events_count: number;
  tick: number;
}

export interface NetworkGraphData {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: {
      label: string;
      author_id: string;
      author_name: string;
      platform: string;
      community: string;
      community_id: number;
      community_color: string;
      influence_score: number;
      betweenness: number;
      is_bridge: boolean;
      post_count: number;
      total_engagement: { likes: number; shares: number; comments: number; views: number };
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label: string;
    weight: number;
    animated: boolean;
    style: Record<string, any>;
  }>;
  stats: {
    total_nodes: number;
    total_edges: number;
    communities_count: number;
    bridge_accounts_count: number;
  };
}

export interface AIBriefingResponse {
  briefing: string;
  confidence: number;
  evidence: string[];
  provider: string;
}

export interface AIQueryResponse {
  answer: string;
  confidence: number;
  evidence: string[];
  provider: string;
}

export interface AudienceData {
  topic: string;
  total_sample_size: number;
  confidence_score: number;
  disclaimer: string;
  age_brackets: Array<{ bracket: string; percentage: number; confidence: string }>;
  language_distribution: Array<{ language: string; percentage: number }>;
  geographic_corridor: Array<{ corridor: string; share: number }>;
}

export const api = {
  // Replay
  async getReplayState(): Promise<ReplayState> {
    const res = await fetch(`${API_BASE}/replay/state`);
    return res.json();
  },
  async startReplay(): Promise<ReplayState> {
    const res = await fetch(`${API_BASE}/replay/start`);
    return res.json();
  },
  async pauseReplay(): Promise<ReplayState> {
    const res = await fetch(`${API_BASE}/replay/pause`);
    return res.json();
  },
  async resetReplay(): Promise<ReplayState> {
    const res = await fetch(`${API_BASE}/replay/reset`, { method: 'POST' });
    return res.json();
  },
  async stepReplayTick(): Promise<{ step_result: any; state: ReplayState }> {
    const res = await fetch(`${API_BASE}/replay/tick`, { method: 'POST' });
    return res.json();
  },

  // Trends
  async getTrends(): Promise<TrendSummary[]> {
    const res = await fetch(`${API_BASE}/trends`);
    return res.json();
  },
  async getTrendHistory(topic: string): Promise<TrendScoreRecord[]> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/history`);
    return res.json();
  },
  async getTopicEvents(topic: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/events`);
    return res.json();
  },
  async getTopicNetwork(topic: string): Promise<NetworkGraphData> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/network`);
    return res.json();
  },
  async getTopicCommunities(topic: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/communities`);
    return res.json();
  },
  async getTopicInfluencers(topic: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/influencers`);
    return res.json();
  },
  async getTopicSentiment(topic: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/sentiment`);
    return res.json();
  },
  async getTopicAudience(topic: string): Promise<AudienceData> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(topic)}/audience`);
    return res.json();
  },

  // Narratives
  async getNarratives(): Promise<NarrativeSummary[]> {
    const res = await fetch(`${API_BASE}/narratives`);
    return res.json();
  },
  async getNarrativeDetail(topic: string): Promise<any> {
    const res = await fetch(`${API_BASE}/narratives/${encodeURIComponent(topic)}`);
    return res.json();
  },
  async getNarrativeTimeline(topic: string): Promise<NarrativeEvent[]> {
    const res = await fetch(`${API_BASE}/narratives/${encodeURIComponent(topic)}/timeline`);
    return res.json();
  },
  async getNarrativeEvidence(topic: string): Promise<any> {
    const res = await fetch(`${API_BASE}/narratives/${encodeURIComponent(topic)}/evidence`);
    return res.json();
  },

  // AI Analyst
  async getNarrativeBriefing(topic: string): Promise<AIBriefingResponse> {
    const res = await fetch(`${API_BASE}/ai/narrative-briefing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
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
