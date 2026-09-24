import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinancialHealthPage } from './pages/FinancialHealthPage';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { LoansPage } from './pages/LoansPage';
import { SavingsPage } from './pages/SavingsPage';
import { SeasonalPage } from './pages/SeasonalPage';
import { AiHelperPage } from './pages/AiHelperPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { HelpPage } from './pages/HelpPage';
import { OnboardingSettingsPage } from './pages/OnboardingSettingsPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { StorageService } from './services/storage';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/login') return '/login';
      // When opening the web/application, show login dashboard if not logged in
      const isLoggedIn = StorageService.isLoggedIn();
      if (!isLoggedIn) {
        return '/login';
      }
      return path && path !== '/' ? path : '/dashboard';
    }
    return '/login';
  });

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');

  useEffect(() => {
    // Initialize storage seed
    StorageService.init();

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setCurrentRoute('/login');
        return;
      }
      if (!StorageService.isLoggedIn()) {
        setCurrentRoute('/login');
        return;
      }
      setCurrentRoute(path && path !== '/' ? path : '/dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToAi = (query: string) => {
    setAiInitialQuery(query);
    navigate('/ai-helper');
  };

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/login':
        return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />;
      case '/':
      case '/landing':
        if (!StorageService.isLoggedIn()) {
          return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />;
        }
        return <LandingPage onNavigate={navigate} onOpenVoice={() => setIsVoiceOpen(true)} />;
      case '/dashboard':
        return <DashboardPage onNavigate={navigate} onOpenVoice={() => setIsVoiceOpen(true)} />;
      case '/financial-health':
        return <FinancialHealthPage onNavigate={navigate} />;
      case '/income':
        return <IncomePage onOpenVoice={() => setIsVoiceOpen(true)} />;
      case '/expenses':
        return <ExpensePage onOpenVoice={() => setIsVoiceOpen(true)} />;
      case '/loans':
        return <LoansPage />;
      case '/savings':
        return <SavingsPage />;
      case '/seasonal-income':
      case '/seasonal':
        return <SeasonalPage />;
      case '/ai-helper':
        return (
          <AiHelperPage
            initialQuery={aiInitialQuery}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        );
      case '/what-if':
        return <WhatIfPage />;
      case '/documents':
        return <DocumentsPage />;
      case '/reports':
        return <ReportsPage />;
      case '/help':
      case '/scam-safety':
        return <HelpPage />;
      case '/onboarding':
      case '/profile':
      case '/settings':
        return <OnboardingSettingsPage onComplete={() => navigate('/dashboard')} />;
      case '/about':
      case '/features':
        return <AboutPage onNavigate={navigate} />;
      default:
        return <DashboardPage onNavigate={navigate} onOpenVoice={() => setIsVoiceOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={navigate} />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigateToAi={handleNavigateToAi}
      />
    </div>
  );
}

export default App;
