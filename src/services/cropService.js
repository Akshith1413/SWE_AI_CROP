// Service for managing user crop preferences and selections
import { consentService } from './consentService';
import { api } from './api';

const STORAGE_KEY = 'crop_diagnosis_user_crops';

export const cropService = {
    // Retrieve user's saved crop selections from storage
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

    // Save crop selections to local storage and optionally server
    saveCrops: async (crops, userId = null) => {
        if (consentService.isGuest()) {
            console.log('Guest mode: crop preferences not saved');
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
            console.log('Crops saved:', crops.length, 'crops');

            if (userId) {
                await api.crops.save(userId, crops.map(c => c.id || c));
            }
        } catch (e) {
            console.error('Failed to save crops', e);
        }
    },

    // Fetch crops from server and update local storage
    fetchCrops: async (userId) => {
        if (!userId) return [];
        try {
            const serverCrops = await api.crops.get(userId);
            if (serverCrops && Array.isArray(serverCrops)) {
                // Determine format - if strings, map to objects? getCrops returns stored format.
                // localStorage stores whatever we pass to saveCrops.
                // saveCrops receives `cropsToSave` which are objects from `UserProfile`.
                // But `CropPreference` model stores STRINGS (IDs).
                // So we need to ensure consistency.
                // The backend returns array of strings.
                // We should store strings in localStorage or objects?
                // `UserProfile` expects `cropService.getCrops()` to return something.
                // `loadData` says: `setSelectedCrops(userCrops.map(c => c.id || c));`
                // So it handles both objects and strings. Good.
                // I will store Strings from server to LocalStorage to be safe.
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverCrops));
                return serverCrops;
            }
        } catch (e) {
            console.error('Failed to fetch crops from server', e);
        }
        return [];
    },

    // Sync crops with server (push local to server)
    syncCropsWithServer: async (userId) => {
        if (!userId) return;
        try {
            const crops = cropService.getCrops();
            // crops might be objects or strings.
            const cropIds = crops.map(c => c.id || c);
            await api.crops.save(userId, cropIds);
            console.log('Synced crops to server');
        } catch (e) {
            console.error('Failed to sync crops with server:', e);
        }
    },

    // Get list of all available crop types with icons
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
