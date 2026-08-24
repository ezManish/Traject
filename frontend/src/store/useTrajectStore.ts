import { create } from 'zustand';
import { api } from '../api/client';
import type { ReplayState, TrendSummary, NarrativeSummary, TrendScoreRecord, NetworkGraphData } from '../api/client';

export type ScreenTab = 'executive' | 'trend' | 'narrative' | 'network' | 'audience' | 'ai_analyst';

interface TrajectStore {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;

  activeTopic: string;
  setActiveTopic: (topic: string) => void;

  replayState: ReplayState | null;
  trends: TrendSummary[];
  narratives: NarrativeSummary[];
  activeTrendHistory: TrendScoreRecord[];
  networkGraph: NetworkGraphData | null;
  activeTopicEvents: any[];
  activeTopicSentiment: any | null;

  isPolling: boolean;
  fetchDashboardData: () => Promise<void>;
  startReplay: () => Promise<void>;
  pauseReplay: () => Promise<void>;
  resetReplay: () => Promise<void>;
  stepTick: () => Promise<void>;
}

export const useTrajectStore = create<TrajectStore>((set, get) => ({
  activeTab: 'executive',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeTopic: 'Transit System Delay',
  setActiveTopic: (topic) => {
    set({ activeTopic: topic });
    get().fetchDashboardData();
  },

  replayState: null,
  trends: [],
  narratives: [],
  activeTrendHistory: [],
  networkGraph: null,
  activeTopicEvents: [],
  activeTopicSentiment: null,
  isPolling: false,

  fetchDashboardData: async () => {
    try {
      const state = await api.getReplayState();
      const trends = await api.getTrends();
      const narratives = await api.getNarratives();
      
      const currentTopic = get().activeTopic;
      let history: TrendScoreRecord[] = [];
      let network: NetworkGraphData | null = null;
      let events: any[] = [];
      let sentiment: any = null;

      if (currentTopic) {
        history = await api.getTrendHistory(currentTopic);
        network = await api.getTopicNetwork(currentTopic);
        events = await api.getTopicEvents(currentTopic);
        sentiment = await api.getTopicSentiment(currentTopic);
      }

      set({
        replayState: state,
        trends: trends || [],
        narratives: narratives || [],
        activeTrendHistory: history || [],
        networkGraph: network,
        activeTopicEvents: events || [],
        activeTopicSentiment: sentiment
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  },

  startReplay: async () => {
    try {
      const state = await api.startReplay();
      set({ replayState: state });
      get().fetchDashboardData();
    } catch (err) {
      console.error('Failed to start replay:', err);
    }
  },

  pauseReplay: async () => {
    try {
      const state = await api.pauseReplay();
      set({ replayState: state });
    } catch (err) {
      console.error('Failed to pause replay:', err);
    }
  },

  resetReplay: async () => {
    try {
      const state = await api.resetReplay();
      set({
        replayState: state,
        trends: [],
        narratives: [],
        activeTrendHistory: [],
        networkGraph: null,
        activeTopicEvents: [],
        activeTopicSentiment: null
      });
      get().fetchDashboardData();
    } catch (err) {
      console.error('Failed to reset replay:', err);
    }
  },

  stepTick: async () => {
    try {
      const res = await api.stepReplayTick();
      set({ replayState: res.state });
      get().fetchDashboardData();
    } catch (err) {
      console.error('Failed to step tick:', err);
    }
  },
}));
