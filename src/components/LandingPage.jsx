import React from 'react';
import { Leaf, User } from 'lucide-react';

const LandingPage = ({ onGuest, onLogin }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-nature-50 to-nature-100 flex flex-col items-center justify-center p-6 text-center animate-fade-in">

            {/* Hero Visual */}
            <div className="mb-8 p-6 bg-nature-100 rounded-full shadow-lg transform hover:scale-105 transition duration-500">
                <Leaf size={80} className="text-nature-600" />
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl md:text-5xl font-bold text-nature-900 mb-4 tracking-tight">
                AI Plant Doctor
            </h1>

            <p className="text-lg text-nature-700 max-w-md mb-12">
                Scan plants, detect diseases, and get instant care recommendations.
            </p>

            {/* Actions */}
            <div className="w-full max-w-xs space-y-4">
                <button
                    onClick={onGuest}
                    className="w-full bg-nature-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:bg-nature-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Leaf className="w-5 h-5" />
                    <span>Continue as Guest</span>
                </button>

                <button
                    onClick={onLogin}
                    className="w-full bg-white text-nature-800 font-medium py-3 px-6 rounded-2xl border-2 border-nature-200 hover:border-nature-400 hover:bg-nature-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                </button>
            </div>

            <p className="mt-8 text-xs text-nature-500">
                Empowering farmers with smart technology
            </p>
        </div>
    );
};

export default LandingPage;
