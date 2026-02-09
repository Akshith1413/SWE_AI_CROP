const DB_NAME = 'CropDocDB';
const STORE_NAME = 'crop_diagnosis_history';

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const cropService = {
    getCrops: async () => {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error('Failed to load crops from IndexedDB', e);
            return [];
        }
    },

    saveCapture: async (captureData) => {
        try {
            const db = await initDB();
            const id = captureData.id || `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const dataToSave = { ...captureData, id };

            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.put(dataToSave);
                request.onsuccess = () => resolve(dataToSave);
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error('Failed to save capture to IndexedDB', e);
        }
    },

    deleteCapture: async (id) => {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error('Failed to delete capture from IndexedDB', e);
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
    ]
};
