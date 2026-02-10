import { consentService } from './consentService';

const STORAGE_KEY = 'crop_diagnosis_user_crops';

export const cropService = {
    getCrops: () => {
        if (consentService.isGuest()) {
            return [];
        }
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load crops', e);
            return [];
        }
    },

    saveCrops: (crops) => {
        if (consentService.isGuest()) {
            console.log('Guest mode: crop preferences not saved');
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
            console.log('Crops saved:', crops.length, 'crops');
        } catch (e) {
            console.error('Failed to save crops', e);
        }
    },

    // Sync crops with server (stub - logs to console)
    syncCropsWithServer: async () => {
        try {
            const crops = cropService.getCrops();
            // TODO: Replace with actual API call
            console.log('Syncing crops with server:', crops);
            console.log('Server sync: Would POST to /api/user/crops with', crops.length, 'crops');
        } catch (e) {
            console.error('Failed to sync crops with server:', e);
        }
    },

    getAllCrops: () => [
        { id: 'wheat', name: 'Wheat', icon: '🌾' },
        { id: 'rice', name: 'Rice', icon: '🍚' },
        { id: 'corn', name: 'Corn', icon: '🌽' },
        { id: 'tomato', name: 'Tomato', icon: '🍅' },
        { id: 'potato', name: 'Potato', icon: '🥔' },
        { id: 'cotton', name: 'Cotton', icon: '🧶' },
        { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' },
        { id: 'soybean', name: 'Soybean', icon: '🌱' },
        { id: 'onion', name: 'Onion', icon: '🧅' },
        { id: 'chilli', name: 'Chilli', icon: '🌶️' },
        { id: 'groundnut', name: 'Groundnut', icon: '🥜' },
        { id: 'mustard', name: 'Mustard', icon: '🌿' },
    ]
};
