// Displays a consent screen explaining data usage for image analysis and local storage.
// Requires user agreement to proceed.
import React from 'react';
import { ShieldCheck, Cloud, Database, Check } from 'lucide-react';

const ConsentScreen = ({ onConsent }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f5132] to-[#2d6a4f] flex items-center justify-center p-6 animate-slide-up">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full border border-nature-100">

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-nature-100 p-3 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-nature-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-nature-900">Privacy & Data</h2>
                </div>

                <p className="text-nature-900 mb-6 font-medium">
                    To provide accurate diagnoses, we need your permission to analyze plant images.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                        <Cloud className="w-6 h-6 text-earth-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-nature-800">Image Analysis</h3>
                            <p className="text-sm text-nature-600 leading-relaxed">
                                Images are processed to identify crop diseases instantly.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Database className="w-6 h-6 text-earth-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-nature-800">Local Storage</h3>
                            <p className="text-sm text-nature-600 leading-relaxed">
                                We store crop preferences on your device for a better experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-nature-50 p-4 rounded-xl mb-8 border border-nature-100">
                    <p className="text-xs text-nature-700 italic text-center">
                        "We store plant images and crop preferences only to improve diagnosis accuracy."
                    </p>
                </div>

                <button
                    onClick={onConsent}
                    className="w-full bg-nature-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:bg-nature-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                    <Check className="w-5 h-5" />
                    <span>I Agree & Continue</span>
                </button>
            </div>
        </div>
    );
};

export default ConsentScreen;
