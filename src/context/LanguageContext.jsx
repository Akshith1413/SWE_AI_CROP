// Language context for managing multi-language support across the app
import React, { createContext, useContext, useState, useEffect } from 'react';
import { preferencesService } from '../services/preferencesService';

// Create the language context for provider/consumer pattern
const LanguageContext = createContext(null);

import { SUPPORTED_LANGUAGES } from '../constants/languages';


// Language Provider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        // Initialize from preferences or default to null (will show language selection)
        return preferencesService.getLanguage() || null;
    });

    // Update language and persist to preferences
    const setLanguage = (langCode) => {
        setLanguageState(langCode);
        preferencesService.setLanguage(langCode);
    };

    // Check if language is selected
    const isLanguageSelected = () => {
        return language !== null;
    };

    // Get current language info
    const getCurrentLanguageInfo = () => {
        return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
    };

    const value = {
        language: language || 'en', // Default to 'en' for translations
        rawLanguage: language, // Can be null if not selected
        setLanguage,
        isLanguageSelected,
        getCurrentLanguageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook to use language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// export default LanguageContext;
