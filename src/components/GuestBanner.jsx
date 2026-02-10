import React from 'react';
import { UserPlus, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const GuestBanner = ({ onUpgrade, onDismiss }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-lg mx-auto">
                <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">
                        {t('guestBanner.title')}
                    </p>
                    <p className="text-white/80 text-xs truncate">
                        {t('guestBanner.description')}
                    </p>
                </div>
                <button
                    onClick={onUpgrade}
                    className="bg-white text-amber-600 font-semibold text-xs px-3 py-2 rounded-xl hover:bg-amber-50 transition-colors flex-shrink-0"
                >
                    {t('guestBanner.upgradeButton')}
                </button>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuestBanner;
