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
            // Local storage must save the raw strings rather than objects to be consistent.
            const rawCropIds = crops.map(c => c.id || c);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rawCropIds));
            console.log('Crops saved locally:', rawCropIds.length, 'crops');

            if (userId) {
                await api.crops.save(userId, rawCropIds);
                console.log('Crops synced to backend for user:', userId);
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
                // Determine format
                // The backend returns array of strings.
                // localStorage should store strings to maintain consistency with `getCrops` returning IDs.
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverCrops));
                return serverCrops;
            }
        } catch (e) {
            console.error('Failed to fetch crops from server', e);
        }
        return [];
    },

    // Sync crops with server conflict-free
    syncCropsWithServer: async (userId) => {
        if (!userId) return;
        try {
            // 1. Fetch latest state from server
            const serverCrops = await api.crops.get(userId) || [];

            // 2. Fetch current local state
            const localCrops = cropService.getCrops();
            const localCropIds = localCrops.map(c => c.id || c);

            // 3. Merge both avoiding duplicate overwrite
            const mergedCropIds = Array.from(new Set([...serverCrops, ...localCropIds]));

            // 4. Save to backend and overwrite local storage natively to stay consistent
            await api.crops.save(userId, mergedCropIds);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedCropIds));

            console.log('Synced crops to server with conflict resolution');
        } catch (e) {
            console.error('Failed to sync crops with server:', e);
        }
    },

    // Migrate guest data to newly logged in user
    migrateGuestData: async (newUserId) => {
        try {
            const localCrops = localStorage.getItem(STORAGE_KEY);
            if (localCrops) {
                const parsedCrops = JSON.parse(localCrops);
                // Just save the accumulated guest data directly to the new user's profile
                if (parsedCrops.length > 0) {
                    await api.crops.save(newUserId, parsedCrops);
                    console.log(`Migrated ${parsedCrops.length} guest crops to user ${newUserId}`);
                }
            }
        } catch (e) {
            console.error('Failed to migrate guest data:', e);
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
