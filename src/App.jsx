import { useState, useEffect } from "react";
import "./App.css";

import CAM from "./components/CropDiagnosisApp";
import LoginScreen from "./components/LoginScreen";
import LanguageScreen from "./components/LanguageScreen";
import cropdocapp from './components/cropdocapp';
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState(null);


  
  useEffect(() => {

    const body = document.body;

    if (!isLoggedIn || !language) {
      body.classList.add("auth-mode");
      body.classList.remove("app-mode");
    } else {
      body.classList.add("app-mode");
      body.classList.remove("auth-mode");
    }

  }, [isLoggedIn, language]);


  
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
    <CropDocApp language={language} />
  );


 
  return <CAM language={language} />;
}

export default App;
