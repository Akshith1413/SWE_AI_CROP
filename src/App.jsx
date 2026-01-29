import { useState, useEffect } from "react";
import "./App.css";

import CAM from "./components/CropDiagnosisApp";
import LoginScreen from "./components/LoginScreen";
import LanguageScreen from "./components/LanguageScreen";
import LandingPage from "./components/LandingPage";
import ConsentScreen from "./components/ConsentScreen";
import { preferencesService } from "./services/preferencesService";
import { audioService } from "./services/audioService";
import cropdocapp from './components/cropdocapp';


function App() {
  const [view, setView] = useState("loading"); // 'loading', 'landing', 'consent', 'login', 'main'
  const [language, setLanguage] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load saved preferences on app launch
  useEffect(() => {
    const savedLanguage = preferencesService.getLanguage();
    const savedUserId = preferencesService.getUserId();

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

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

  // Main Application Flow
  if (!language) {
    return (
      <LanguageScreen
        onSelect={(lang) => {
          setLanguage(lang);
          preferencesService.setLanguage(lang);

          // Audio confirmation
          audioService.confirmAction('success');
          audioService.speakLocalized('language_selected', lang);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <CAM language={language} userId={userId} />
    </div>
  );
  return (
    <cropdocapp language={language} /> // pass language if your component needs it
  );

}

export default App;
