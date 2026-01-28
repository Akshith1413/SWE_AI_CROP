import { useState } from "react";
import "./App.css";

import CAM from "./components/CropDiagnosisApp";
import LoginScreen from "./components/LoginScreen";
import LanguageScreen from "./components/LanguageScreen";

function App() {
  const [view, setView] = useState("landing"); // 'landing', 'consent', 'login', 'main'
  const [language, setLanguage] = useState(null);

  const handleGuestEntry = () => setView("consent");
  const handleAccountEntry = () => setView("login");
  const handleConsent = () => setView("main");

  // Both login success and skip lead to the main app flow
  const handleLoginCompletion = () => setView("main");

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
        onSelect={(lang) => setLanguage(lang)}
      />
    );
  }
  return (
    <CropDocApp language={language} />
  );

  return (
    <div className="app-container">
      <CAM language={language} />
    </div>
  );
}

export default App;
