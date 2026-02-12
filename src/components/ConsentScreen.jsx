// Component for displaying data consent information and collecting user agreement
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cloud, Database, Check, Volume2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { audioService } from '../services/audioService';
import { consentService } from '../services/consentService';
import { api } from '../services/api';

const ConsentScreen = ({ onConsent, userId }) => {
    const { t } = useTranslation();
    const [agreed, setAgreed] = useState(false);
    const [voiceAutoPlay, setVoiceAutoPlay] = useState(true);

    // Provide voice guidance when screen loads
    useEffect(() => {
        if (voiceAutoPlay) {
            try {
                const timer = setTimeout(() => {
                    audioService.speak(t('consentScreen.voiceGuide'));
                }, 500);
                return () => clearTimeout(timer);
            } catch (e) {
                console.error('ConsentScreen: Voice error:', e);
            }
        }
    }, [t, voiceAutoPlay]);

    // Handle user consent submission
    const handleConsent = async () => {
        if (!agreed) return; // Require checkbox to be checked

        // Log timestamped consent to backend
        try {
            if (userId) {
                await api.consent.log(userId, true);
            }
        } catch (error) {
            console.error('Failed to log consent to backend', error);
        }

        // Log locally
        consentService.giveConsent();
        audioService.confirmAction('success');

        onConsent();
    };

    // Replay audio instructions for accessibility
    const replayAudio = () => {
        try {
            audioService.speak(t('consentScreen.voiceGuide'));
            audioService.playClick();
        } catch (e) {
            console.error('ConsentScreen: Voice replay error:', e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f5132] to-[#2d6a4f] flex items-center justify-center p-6 animate-slide-up">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-nature-100">

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-nature-100 p-3 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-nature-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-nature-900">{t('consentScreen.title')}</h2>
                </div>

                <p className="text-nature-900 mb-6 font-medium">
                    {t('consentScreen.description')}
                </p>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-4">
                        <Cloud className="w-6 h-6 text-earth-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-nature-800">{t('consentScreen.imageAnalysis')}</h3>
                            <p className="text-sm text-nature-600 leading-relaxed">
                                {t('consentScreen.imageAnalysisDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Database className="w-6 h-6 text-earth-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-nature-800">{t('consentScreen.localStorage')}</h3>
                            <p className="text-sm text-nature-600 leading-relaxed">
                                {t('consentScreen.localStorageDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-nature-50 p-4 rounded-xl mb-6 border border-nature-100">
                    <p className="text-xs text-nature-700 italic text-center">
                        "{t('consentScreen.privacyNote')}"
                    </p>
                </div>

                {/* Mandatory Checkbox */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                    <div className="relative mt-0.5">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => {
                                setAgreed(e.target.checked);
                                if (e.target.checked) {
                                    audioService.playClick();
                                }
                            }}
                            className="w-5 h-5 rounded border-2 border-nature-300 text-nature-600 focus:ring-nature-500 accent-green-600"
                        />
                    </div>
                    <span className="text-sm text-nature-800 leading-relaxed group-hover:text-nature-900 transition-colors">
                        {t('consentScreen.checkboxLabel')}
                    </span>
                </label>

                {/* Agree Button - disabled until checkbox checked */}
                <button
                    onClick={handleConsent}
                    disabled={!agreed}
                    className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95
                        ${agreed
                            ? 'bg-nature-600 text-white hover:bg-nature-700 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Check className="w-5 h-5" />
                    <span>{t('consentScreen.agreeButton')}</span>
                </button>

                {!agreed && (
                    <p className="text-xs text-center text-red-400 mt-2">
                        {t('consentScreen.mustAgree')}
                    </p>
                )}

                {/* Voice Controls */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-nature-100">
                    <button
                        onClick={replayAudio}
                        className="flex items-center gap-1 text-xs text-nature-600 hover:text-nature-800 transition-colors"
                    >
                        <Volume2 className="w-4 h-4" />
                        {t('consentScreen.replayAudio')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentScreen;
