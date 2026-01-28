import { useState } from "react";
import "./App.css";

import CAM from "./components/CropDiagnosisApp";
import LoginScreen from "./components/LoginScreen";
import LanguageScreen from "./components/LanguageScreen";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState(null);

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
        onSkip={() => setIsLoggedIn(true)}
      />
    );
  }

  if (!language) {
    return (
      <LanguageScreen
        onSelect={(lang) => setLanguage(lang)}
      />
    );
  }

  return (
  <div className="app-container">
    <CAM language={language} />
  </div>
);
}

export default App;
