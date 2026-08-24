import { create } from 'zustand';
import { api } from '../api/client';
import type { TrendItem, NarrativeSummary, AudienceData } from '../api/client';

export type ScreenTab = 'executive' | 'trend' | 'narrative' | 'network' | 'audience' | 'ai_analyst';

interface TrajectState {
  activeTab: ScreenTab;
  activeTopic: string;
  replayState: any;
  trends: TrendItem[];
  narratives: NarrativeSummary[];
  activeTrendHistory: any[];
  activeTopicSentiment: any;
  activeTopicAudience: AudienceData | null;
  activeTopicEvents: any[];
  isLoading: boolean;

  setActiveTab: (tab: ScreenTab) => void;
  setActiveTopic: (topic: string) => void;
  fetchDashboardData: () => Promise<void>;
  startReplay: () => Promise<void>;
  pauseReplay: () => Promise<void>;
  resetReplay: () => Promise<void>;
  stepTick: () => Promise<void>;
  jumpToTick: (tick: number) => Promise<void>;
}

export const useTrajectStore = create<TrajectState>((set, get) => ({
  activeTab: 'executive',
  activeTopic: 'Transit System Delay',
  replayState: null,
  trends: [],
  narratives: [],
  activeTrendHistory: [],
  activeTopicSentiment: null,
  activeTopicAudience: null,
  activeTopicEvents: [],
  isLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveTopic: (topic) => {
    set({ activeTopic: topic });
    get().fetchDashboardData();
  },

  fetchDashboardData: async () => {
    try {
      const state = await api.getReplayState();
      const trends = await api.getTrends();
      const narratives = await api.getNarratives();
      
      const currentTopic = get().activeTopic || (trends[0]?.topic ?? 'Transit System Delay');
      
      let history: any[] = [];
      let sentiment = null;
      let audience = null;
      let events: any[] = [];

      if (currentTopic) {
        try {
          history = await api.getTrendHistory(currentTopic);
          sentiment = await api.getTopicSentiment(currentTopic);
          audience = await api.getTopicAudience(currentTopic);
          events = await api.getTopicEvents(currentTopic);
        } catch (e) {
          console.error("Error fetching topic specific telemetry", e);
        }
      }

      set({
        replayState: state,
        trends: trends || [],
        narratives: narratives || [],
        activeTopic: currentTopic,
        activeTrendHistory: history || [],
        activeTopicSentiment: sentiment,
        activeTopicAudience: audience,
        activeTopicEvents: events || []
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  },

  startReplay: async () => {
    await api.startReplay();
    await get().fetchDashboardData();
  },

  pauseReplay: async () => {
    await api.pauseReplay();
    await get().fetchDashboardData();
  },

  resetReplay: async () => {
    await api.resetReplay();
    await get().fetchDashboardData();
  },

  stepTick: async () => {
    await api.stepTick();
    await get().fetchDashboardData();
  },

  jumpToTick: async (tick: number) => {
    await api.jumpToTick(tick);
    await get().fetchDashboardData();
  }
}));
