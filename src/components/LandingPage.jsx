import React from 'react';
import { Leaf, User } from 'lucide-react';

const LandingPage = ({ onGuest, onLogin }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f5132] to-[#2d6a4f] flex flex-col items-center justify-center p-6 text-center animate-fade-in text-white">

            {/* Hero Visual */}
            <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-full shadow-lg transform hover:scale-105 transition duration-500 border border-white/20">
                <Leaf size={80} className="text-white" />
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
                AI Plant Doctor
            </h1>

            <p className="text-lg text-nature-100 max-w-md mb-12 font-medium">
                Scan plants, detect diseases, and get instant care recommendations.
            </p>

            {/* Actions */}
            <div className="w-full max-w-xs space-y-4">
                <button
                    onClick={onGuest}
                    className="w-full bg-white text-[#0f5132] font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-nature-50 hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 border-2 border-transparent"
                >
                    <Leaf className="w-5 h-5" />
                    <span>Continue as Guest</span>
                </button>

                <button
                    onClick={onLogin}
                    className="w-full bg-transparent text-white font-bold py-3 px-6 rounded-2xl border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                </button>
            </div>

            <p className="mt-8 text-xs text-nature-200 opacity-80">
                Empowering farmers with smart technology
            </p>
        </div>
    );
};

export default LandingPage;
