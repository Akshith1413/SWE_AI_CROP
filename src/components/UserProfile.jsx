import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { cropService } from '../services/cropService';
import { useTranslation } from '../hooks/useTranslation';
import { audioService } from '../services/audioService';
import { consentService } from '../services/consentService';
import { showToast } from './ConfirmationToast';

const UserProfile = ({ onBack }) => {
    const { t } = useTranslation();
    const [crops, setCrops] = useState([]);
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saved, setSaved] = useState(false);
    const isGuest = consentService.isGuest();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allCrops = cropService.getAllCrops();
        const userCrops = cropService.getCrops();

        setCrops(allCrops);
        setSelectedCrops(userCrops.map(c => c.id || c));
        setLoading(false);
    };

    const toggleCrop = (crop) => {
        setSelectedCrops(prev => {
            if (prev.includes(crop.id)) {
                return prev.filter(id => id !== crop.id);
            } else {
                return [...prev, crop.id];
            }
        });
        setSaved(false);
        audioService.playClick();
    };

    const selectAll = () => {
        setSelectedCrops(crops.map(c => c.id));
        setSaved(false);
        audioService.playClick();
    };

    const clearAll = () => {
        setSelectedCrops([]);
        setSaved(false);
        audioService.playClick();
    };

    const handleSave = () => {
        if (isGuest) {
            showToast(t('guestMode.profileRestricted'), { type: 'warning' });
            return;
        }

        const cropsToSave = crops.filter(c => selectedCrops.includes(c.id));
        cropService.saveCrops(cropsToSave);
        setSaved(true);
        audioService.confirmAction('success', t('confirmation.cropsSaved'));
        showToast(t('confirmation.cropsSaved'), { type: 'success', voiceMessage: t('confirmation.cropsSaved') });

        // Try to sync with server
        cropService.syncCropsWithServer();

        setTimeout(() => setSaved(false), 2000);
    };

    // Get translated crop name
    const getCropName = (cropId) => {
        return t(`profileView.${cropId}`) || cropId;
    };

    const filteredCrops = crops.filter(crop => {
        const translatedName = getCropName(crop.id);
        return translatedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">{t('profileView.loading')}</div>;
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pt-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">{t('profileView.title')}</h1>
                    <div className="ml-auto">
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${saved
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? t('profileView.saved') : t('profileView.save')}
                        </button>
                    </div>
                </div>

                {/* Guest Warning */}
                {isGuest && (
                    <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 mb-4 text-center">
                        <p className="text-amber-300 text-sm">{t('guestMode.profileRestricted')}</p>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6">
                    <div className="bg-[#242424] p-6 rounded-2xl border border-white/5">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">{t('profileView.whatDoYouGrow')}</h2>
                            <p className="text-gray-400 text-sm">
                                {t('profileView.selectCropsDesc')}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('profileView.searchCrops')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 transition text-white"
                            />
                        </div>

                        {/* Select/Clear All + Count */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-400">
                                {selectedCrops.length} {t('profileView.cropsSelected')}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="text-xs text-green-400 hover:text-green-300 transition px-2 py-1 rounded border border-green-500/30 hover:bg-green-900/20"
                                >
                                    {t('profileView.selectAll')}
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-red-400 hover:text-red-300 transition px-2 py-1 rounded border border-red-500/30 hover:bg-red-900/20"
                                >
                                    {t('profileView.clearAll')}
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {filteredCrops.map(crop => {
                                const isSelected = selectedCrops.includes(crop.id);
                                return (
                                    <button
                                        key={crop.id}
                                        onClick={() => toggleCrop(crop)}
                                        className={`relative p-4 rounded-xl border transition-all flex flex-col items-center gap-3 group ${isSelected
                                            ? 'bg-green-900/20 border-green-500/50 shadow-lg shadow-green-900/20'
                                            : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition">
                                            {crop.icon}
                                        </div>
                                        <span className={`text-sm font-medium ${isSelected ? 'text-green-400' : 'text-gray-300'}`}>
                                            {getCropName(crop.id)}
                                        </span>

                                        {/* Checkbox indicator */}
                                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition ${isSelected
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-600'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
