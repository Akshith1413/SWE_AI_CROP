/**
 * AudioSettingsPanel Component
 * Modal panel providing UI controls for audio feedback settings
 * Allows users to toggle sound effects and voice guidance on/off
 * Settings are persisted via audioService to localStorage
 */
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Settings, X } from 'lucide-react';
import { audioService } from '../services/audioService';
import { useTranslation } from '../hooks/useTranslation';

const AudioSettingsPanel = ({ onClose }) => {
    const { t } = useTranslation();

    // Local state mirrors audioService state for responsive UI updates
    const [soundEnabled, setSoundEnabled] = useState(audioService.isSoundEnabled());
    const [voiceEnabled, setVoiceEnabled] = useState(audioService.isVoiceEnabled());

    /**
     * Toggle sound effects on/off
     * Updates both audioService state and local UI state
     * Plays confirmation click if enabling sound
     */
    const handleToggleSound = () => {
        // Toggle sound in audioService (persists to localStorage)
        const newState = audioService.toggleSound();

        // Update local state to reflect change in UI
        setSoundEnabled(newState);

        // Provide audio confirmation when enabling (users can hear it working)
        if (newState) {
            audioService.playClick();
        }
    };

    /**
     * Toggle voice feedback on/off
     * Updates both audioService state and local UI state
     * Speaks confirmation message if enabling voice
     */
    const handleToggleVoice = () => {
        // Toggle voice in audioService (persists to localStorage)
        const newState = audioService.toggleVoice();

        // Update local state to reflect change in UI
        setVoiceEnabled(newState);

        // Speak confirmation when enabling (users can hear it working)
        if (newState) {
            audioService.speak(t('audioSettings.voiceFeedbackEnabledSpeak'));
        }
    };

    /**
     * Test audio functionality
     * Plays a success sound followed by a voice message
     * Helps users verify their audio settings are working
     */
    const testSounds = () => {
        // Play success sound effect
        audioService.playSuccess();

        // Speak test message after a short delay (prevents overlap)
        setTimeout(() => audioService.speak(t('audioSettings.audioTestSuccess')), 500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-800">{t('audioSettings.title')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    {/* Sound Effects Toggle */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {soundEnabled ? (
                                    <Music className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Music className="w-5 h-5 text-gray-400 opacity-50" />
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-800">{t('audioSettings.soundEffects')}</h3>
                                    <p className="text-xs text-gray-600">{t('audioSettings.soundEffectsDesc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleSound}
                                className={`relative w-14 h-8 rounded-full transition ${soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            {soundEnabled ? t('audioSettings.soundEffectsEnabled') : t('audioSettings.soundEffectsMuted')}
                        </p>
                    </div>

                    {/* Voice Feedback Toggle */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {voiceEnabled ? (
                                    <Volume2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <VolumeX className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-800">{t('audioSettings.voiceFeedback')}</h3>
                                    <p className="text-xs text-gray-600">{t('audioSettings.voiceFeedbackDesc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleVoice}
                                className={`relative w-14 h-8 rounded-full transition ${voiceEnabled ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition transform ${voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            {voiceEnabled ? t('audioSettings.voiceFeedbackEnabled') : t('audioSettings.voiceFeedbackOff')}
                        </p>
                    </div>

                    {/* Test Audio Button */}
                    <button
                        onClick={testSounds}
                        disabled={!soundEnabled && !voiceEnabled}
                        className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${soundEnabled || voiceEnabled
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Music className="w-5 h-5" />
                        {t('audioSettings.testAudio')}
                    </button>

                    {/* Info */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>{t('audioSettings.note')}</strong> {t('audioSettings.noteText')}
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                    {t('audioSettings.close')}
                </button>
            </div>
        </div>
    );
};

export default AudioSettingsPanel;
