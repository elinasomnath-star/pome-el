import React, { useState } from 'react';
import { useSimStore } from './store/useSimStore';
import Navbar from './components/layout/Navbar';
import Dock from './components/reactbits/Dock';
import LandingHero from './components/views/LandingHero';
import OverviewView from './components/views/OverviewView';
import BCGMatrixView from './components/views/BCGMatrixView';
import FiveForcesView from './components/views/FiveForcesView';
import ShockLabView from './components/views/ShockLabView';
import PriceWarView from './components/views/PriceWarView';
import OrgDesignView from './components/views/OrgDesignView';
import StrategyRecommenderView from './components/views/StrategyRecommenderView';
import MonteCarloView from './components/views/MonteCarloView';
import ValidationView from './components/views/ValidationView';
import MethodologyView from './components/views/MethodologyView';

import {
  LayoutDashboard,
  BarChart2,
  Shield,
  Zap,
  Swords,
  Network,
  Sparkles,
  Dices,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const { activeTab, setActiveTab } = useSimStore();
  const [showHero, setShowHero] = useState(true);

  const dockItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bcg', label: 'BCG Matrix', icon: BarChart2 },
    { id: 'forces', label: 'Five Forces', icon: Shield },
    { id: 'shocks', label: 'Shock Lab', icon: Zap },
    { id: 'pricewar', label: 'Price War', icon: Swords },
    { id: 'org', label: 'Org Design', icon: Network },
    { id: 'recommender', label: 'Strategy & Case', icon: Sparkles },
    { id: 'montecarlo', label: 'Monte Carlo', icon: Dices },
    { id: 'validation', label: 'Validation', icon: FileCheck },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  const handleStartSimulation = () => {
    setShowHero(false);
    setActiveTab('overview');
  };

  const handleSelectTab = (tabId) => {
    setShowHero(false);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white pb-24">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {showHero ? (
          <LandingHero onStartSimulation={handleStartSimulation} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewView />}
              {activeTab === 'bcg' && <BCGMatrixView />}
              {activeTab === 'forces' && <FiveForcesView />}
              {activeTab === 'shocks' && <ShockLabView />}
              {activeTab === 'pricewar' && <PriceWarView />}
              {activeTab === 'org' && <OrgDesignView />}
              {activeTab === 'recommender' && <StrategyRecommenderView />}
              {activeTab === 'montecarlo' && <MonteCarloView />}
              {activeTab === 'validation' && <ValidationView />}
              {activeTab === 'methodology' && <MethodologyView />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Floating Bottom Dock Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-2 max-w-[95vw] print:hidden">
        <Dock
          items={dockItems}
          activeTab={showHero ? '' : activeTab}
          onSelectTab={handleSelectTab}
        />
      </div>
    </div>
  );
}

