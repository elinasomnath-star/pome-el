import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSimStore } from './store/useSimStore';
import Navbar from './components/layout/Navbar';
import Dock from './components/reactbits/Dock';
import LandingHero from './components/views/LandingHero';
import GuidedDemoModal from './components/common/GuidedDemoModal';
import ScenarioManagerModal from './components/common/ScenarioManagerModal';
import GlossaryDrawer from './components/common/GlossaryDrawer';
import { decodeStateFromHash } from './engine/scenarioManager';

// Lazy-loaded views for optimal code-splitting & performance (Requirement 12)
const OverviewView = lazy(() => import('./components/views/OverviewView'));
const BCGMatrixView = lazy(() => import('./components/views/BCGMatrixView'));
const FiveForcesView = lazy(() => import('./components/views/FiveForcesView'));
const ShockLabView = lazy(() => import('./components/views/ShockLabView'));
const PriceWarView = lazy(() => import('./components/views/PriceWarView'));
const OrgDesignView = lazy(() => import('./components/views/OrgDesignView'));
const StrategyRecommenderView = lazy(() => import('./components/views/StrategyRecommenderView'));
const MonteCarloView = lazy(() => import('./components/views/MonteCarloView'));
const ElasticityCalculatorView = lazy(() => import('./components/views/ElasticityCalculatorView'));
const ValidationView = lazy(() => import('./components/views/ValidationView'));
const MethodologyView = lazy(() => import('./components/views/MethodologyView'));

import {
  LayoutDashboard,
  BarChart2,
  Shield,
  Zap,
  Swords,
  Network,
  Sparkles,
  Dices,
  Calculator,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    setSelectedCompanyId,
    setForceScore
  } = useSimStore();

  const [showHero, setShowHero] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [reduceEffects, setReduceEffects] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  // Check URL hash for shared state on mount
  useEffect(() => {
    if (window.location.hash) {
      const decoded = decodeStateFromHash(window.location.hash);
      if (decoded) {
        if (decoded.c) setSelectedCompanyId(decoded.c);
        if (decoded.t) {
          setActiveTab(decoded.t);
          setShowHero(false);
        }
        if (decoded.f) {
          Object.entries(decoded.f).forEach(([k, v]) => setForceScore(k, v));
        }
      }
    }
  }, []);

  // 'F' key listener for Presentation Mode toggle (Requirement 14)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        // Only if not in an input/textarea
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
          setPresentationMode(prev => !prev);
        }
      }
      if (e.key === 'Escape' && presentationMode) {
        setPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode]);

  const dockItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bcg', label: 'BCG Matrix', icon: BarChart2 },
    { id: 'forces', label: 'Five Forces', icon: Shield },
    { id: 'shocks', label: 'Shock Lab', icon: Zap },
    { id: 'pricewar', label: 'Price War', icon: Swords },
    { id: 'org', label: 'Org Design', icon: Network },
    { id: 'recommender', label: 'Strategy & Case', icon: Sparkles },
    { id: 'montecarlo', label: 'Risk Lab', icon: Dices },
    { id: 'elasticity', label: 'Elasticity Solver', icon: Calculator },
    { id: 'validation', label: 'Validation', icon: FileCheck },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  const handleStartSimulation = () => {
    setShowHero(false);
    setActiveTab('overview');
  };

  const handleStartGuidedDemo = () => {
    setShowHero(false);
    setIsDemoOpen(true);
  };

  const handleSelectTab = (tabId) => {
    setShowHero(false);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white pb-56 sm:pb-64 transition-all ${
      presentationMode ? 'text-lg select-none' : ''
    }`}>
      {/* Sticky Top Navbar */}
      <Navbar
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
        reduceEffects={reduceEffects}
        onToggleReduceEffects={() => setReduceEffects(!reduceEffects)}
        presentationMode={presentationMode}
        onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16">
        {showHero ? (
          <LandingHero
            onStartSimulation={handleStartSimulation}
            onStartGuidedDemo={handleStartGuidedDemo}
            reduceEffects={reduceEffects}
          />
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh] text-xs font-mono text-cyan-400 animate-pulse">
                Loading StratSim Module...
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'overview' && <OverviewView />}
                {activeTab === 'bcg' && <BCGMatrixView />}
                {activeTab === 'forces' && <FiveForcesView />}
                {activeTab === 'shocks' && <ShockLabView />}
                {activeTab === 'pricewar' && <PriceWarView />}
                {activeTab === 'org' && <OrgDesignView />}
                {activeTab === 'recommender' && <StrategyRecommenderView />}
                {activeTab === 'montecarlo' && <MonteCarloView />}
                {activeTab === 'elasticity' && <ElasticityCalculatorView />}
                {activeTab === 'validation' && <ValidationView />}
                {activeTab === 'methodology' && <MethodologyView />}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        )}
      </main>

      {/* Floating Bottom Dock Navigation (hidden in presentation mode) */}
      {!presentationMode && (
        <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 px-2 max-w-[98vw] print:hidden">
          <Dock
            items={dockItems}
            activeTab={showHero ? '' : activeTab}
            onSelectTab={handleSelectTab}
          />
        </div>
      )}

      {/* Presentation Mode Exit Floating Pill */}
      {presentationMode && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setPresentationMode(false)}
            className="px-3 py-1.5 rounded-full bg-violet-600 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 opacity-80 hover:opacity-100 cursor-pointer"
          >
            <span>Exit Presentation (Esc or F)</span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <GuidedDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <ScenarioManagerModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
      />

      <GlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
