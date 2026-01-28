import "./LanguageScreen.css";

function LanguageScreen({ onSelect }) {

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "kn", name: "ಕನ್ನಡ" }
  ];

  return (
    <div className="lang-wrapper">

      <h2>Select Your Language</h2>

      <div className="lang-grid">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>

    </div>
  );
}

export default LanguageScreen;
