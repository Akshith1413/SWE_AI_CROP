import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import CropAidCapture from "./components/CropAidCapture";
import LoginScreen from "./components/LoginScreen";
import LanguageScreen from "./components/LanguageScreen";
import LandingPage from "./components/LandingPage";
import ConsentScreen from "./components/ConsentScreen";
import HomePage from "./components/HomePage";
import { preferencesService } from "./services/preferencesService";
import { audioService } from "./services/audioService";

// Component for the main app flow (previously the default view)
function MainAppFlow() {
  const { language, rawLanguage, setLanguage } = useLanguage();
  const [view, setView] = useState("loading"); // 'loading', 'landing', 'consent', 'login', 'main'
  const [userId, setUserId] = useState(null);

  // Load saved preferences on app launch
  useEffect(() => {
    const savedUserId = preferencesService.getUserId();

    if (savedUserId) {
      setUserId(savedUserId);
    }

    // Switch from loading to landing after preferences are loaded
    setView("landing");
  }, []);

  const handleGuestEntry = () => setView("consent");
  const handleAccountEntry = () => setView("login");
  const handleConsent = () => setView("main");

  // Both login, skip, and consent lead to the main app flow
  const handleLoginCompletion = (user) => {
    if (user && user.id) {
      setUserId(user.id);
      preferencesService.syncWithServer(user.id);
    }
    setView("main");
  };

  // Handle language selection from the LanguageScreen
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);

    // Audio confirmation
    audioService.confirmAction('success');
    audioService.speakLocalized('language_selected', lang);
  };

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  if (view === "landing") {
    return <LandingPage onGuest={handleGuestEntry} onLogin={handleAccountEntry} />;
  }

  if (view === "consent") {
    return <ConsentScreen onConsent={handleConsent} />;
  }

  if (view === "login") {
    return (
      <LoginScreen
        onLogin={handleLoginCompletion}
        onSkip={handleLoginCompletion}
      />
    );
  }

  // Main Application Flow - Show language selection if not selected
  if (!rawLanguage) {
    return (
      <LanguageScreen onSelect={handleLanguageSelect} />
    );
  }

  return (
    <div className="app-container">
      <CropAidCapture userId={userId} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<MainAppFlow />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
