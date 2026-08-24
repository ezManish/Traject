import React, { useEffect } from 'react';
import { useTrajectStore } from './store/useTrajectStore';
import { PulseRail } from './components/PulseRail';
import { TopHeader } from './components/TopHeader';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { TrendIntelligence } from './pages/TrendIntelligence';
import { NarrativeIntelligence } from './pages/NarrativeIntelligence';
import { NetworkGraph } from './pages/NetworkGraph';
import { AudienceIntelligence } from './pages/AudienceIntelligence';
import { AIAnalyst } from './pages/AIAnalyst';

export const App: React.FC = () => {
  const { activeTab, fetchDashboardData } = useTrajectStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 2500);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboard />;
      case 'trend':
        return <TrendIntelligence />;
      case 'narrative':
        return <NarrativeIntelligence />;
      case 'network':
        return <NetworkGraph />;
      case 'audience':
        return <AudienceIntelligence />;
      case 'ai_analyst':
        return <AIAnalyst />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-porcelain text-charcoal-900 flex selection:bg-brand-amber/20 overflow-x-hidden">
      {/* 84px Precision Pulse Rail */}
      <PulseRail />

      {/* Main Content Area (offset by 84px) */}
      <div className="flex-1 ml-[84px] flex flex-col min-h-screen w-[calc(100vw-84px)] max-w-[calc(100vw-84px)]">
        <TopHeader />
        <main className="flex-1 pb-16 w-full">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
