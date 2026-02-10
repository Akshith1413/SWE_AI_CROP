/**
 * Offline Storage Service
 * Uses IndexedDB for storing captured media offline
 * Provides sync queue management and background sync
 */

const DB_NAME = 'cropaid_offline_db';
const DB_VERSION = 1;
const CAPTURES_STORE = 'captures';
const SYNC_QUEUE_STORE = 'sync_queue';

class OfflineStorageService {
    constructor() {
        this.db = null;
        this.syncInProgress = false;
        this.listeners = [];
        this.init();
    }

    async init() {
        try {
            this.db = await this.openDatabase();
            console.log('OfflineStorage: IndexedDB initialized');

            // Listen for online/offline events
            window.addEventListener('online', () => this.onOnline());
            window.addEventListener('offline', () => this.onOffline());
        } catch (error) {
            console.error('OfflineStorage: Failed to initialize IndexedDB:', error);
        }
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    // Captures store - for all saved captures
                    if (!db.objectStoreNames.contains(CAPTURES_STORE)) {
                        const captureStore = db.createObjectStore(CAPTURES_STORE, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        captureStore.createIndex('timestamp', 'timestamp', { unique: false });
                        captureStore.createIndex('synced', 'synced', { unique: false });
                        captureStore.createIndex('type', 'type', { unique: false });
                    }

                    // Sync queue store
                    if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
                        const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        syncStore.createIndex('status', 'status', { unique: false });
                        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Save a capture (image/video) to IndexedDB
    async saveCapture(captureData) {
        if (!this.db) {
            console.warn('OfflineStorage: DB not initialized, using fallback');
            return this.saveCaptureToLocalStorage(captureData);
        }

        try {
            const record = {
                type: captureData.type || 'image', // 'image' | 'video'
                data: captureData.data, // base64 or blob
                thumbnail: captureData.thumbnail || null,
                description: captureData.description || '',
                metadata: captureData.metadata || {},
                timestamp: new Date().toISOString(),
                synced: false,
                syncAttempts: 0
            };

            const tx = this.db.transaction(CAPTURES_STORE, 'readwrite');
            const store = tx.objectStore(CAPTURES_STORE);
            const id = await new Promise((resolve, reject) => {
                const req = store.add(record);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });

            // Add to sync queue if online
            if (navigator.onLine) {
                await this.addToSyncQueue(id);
            }

            this.notifyListeners('capture_saved', { id, ...record });
            console.log('OfflineStorage: Capture saved with id:', id);
            return id;
        } catch (error) {
            console.error('OfflineStorage: Failed to save capture:', error);
            return this.saveCaptureToLocalStorage(captureData);
        }
    }

    // Save media (Blob/File) - convenience method used by VideoRecorder and camera
    async saveMedia(blob, type = 'image', metadata = {}) {
        try {
            // Convert blob to base64 for storage
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            return await this.saveCapture({
                type,
                data: base64,
                metadata: {
                    ...metadata,
                    size: blob.size,
                    mimeType: blob.type,
                    savedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('OfflineStorage: Failed to save media:', error);
            // Fallback: try saving the blob reference directly
            return await this.saveCapture({
                type,
                data: URL.createObjectURL(blob),
                metadata: { ...metadata, fallback: true }
            });
        }
    }

    // Fallback to localStorage
    saveCaptureToLocalStorage(captureData) {
        try {
            const key = 'offline_capture_' + Date.now();
            const record = {
                ...captureData,
                timestamp: new Date().toISOString(),
                synced: false
            };
            localStorage.setItem(key, JSON.stringify(record));
            console.log('OfflineStorage: Saved to localStorage fallback:', key);
            return key;
        } catch (e) {
            console.error('OfflineStorage: localStorage fallback failed:', e);
            return null;
        }
    }

    // Get all captures
    async getAllCaptures() {
        if (!this.db) return [];

        try {
            const tx = this.db.transaction(CAPTURES_STORE, 'readonly');
            const store = tx.objectStore(CAPTURES_STORE);
            return new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(req.error);
            });
        } catch (error) {
            console.error('OfflineStorage: Failed to get captures:', error);
            return [];
        }
    }

    // Get unsynced captures
    async getUnsyncedCaptures() {
        if (!this.db) return [];

        try {
            const tx = this.db.transaction(CAPTURES_STORE, 'readonly');
            const store = tx.objectStore(CAPTURES_STORE);
            const index = store.index('synced');
            return new Promise((resolve, reject) => {
                const req = index.getAll(false);
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(req.error);
            });
        } catch (error) {
            console.error('OfflineStorage: Failed to get unsynced captures:', error);
            return [];
        }
    }

    // Delete a capture
    async deleteCapture(id) {
        if (!this.db) return;

        try {
            const tx = this.db.transaction(CAPTURES_STORE, 'readwrite');
            const store = tx.objectStore(CAPTURES_STORE);
            await new Promise((resolve, reject) => {
                const req = store.delete(id);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
            this.notifyListeners('capture_deleted', { id });
        } catch (error) {
            console.error('OfflineStorage: Failed to delete capture:', error);
        }
    }

    // Mark capture as synced
    async markAsSynced(id) {
        if (!this.db) return;

        try {
            const tx = this.db.transaction(CAPTURES_STORE, 'readwrite');
            const store = tx.objectStore(CAPTURES_STORE);
            const record = await new Promise((resolve, reject) => {
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });

            if (record) {
                record.synced = true;
                record.syncedAt = new Date().toISOString();
                await new Promise((resolve, reject) => {
                    const req = store.put(record);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
            }
        } catch (error) {
            console.error('OfflineStorage: Failed to mark as synced:', error);
        }
    }

    // Add to sync queue
    async addToSyncQueue(captureId) {
        if (!this.db) return;

        try {
            const tx = this.db.transaction(SYNC_QUEUE_STORE, 'readwrite');
            const store = tx.objectStore(SYNC_QUEUE_STORE);
            await new Promise((resolve, reject) => {
                const req = store.add({
                    captureId,
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    attempts: 0
                });
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        } catch (error) {
            console.error('OfflineStorage: Failed to add to sync queue:', error);
        }
    }

    // Background sync
    async syncPendingCaptures() {
        if (this.syncInProgress || !navigator.onLine) return;

        this.syncInProgress = true;
        this.notifyListeners('sync_started');

        try {
            const unsynced = await this.getUnsyncedCaptures();
            let syncedCount = 0;

            for (const capture of unsynced) {
                try {
                    // Simulate server upload (replace with actual API call)
                    console.log('OfflineStorage: Syncing capture:', capture.id);
                    // await uploadToServer(capture);
                    await this.markAsSynced(capture.id);
                    syncedCount++;
                    this.notifyListeners('sync_progress', {
                        synced: syncedCount,
                        total: unsynced.length
                    });
                } catch (error) {
                    console.error('OfflineStorage: Failed to sync capture:', capture.id, error);
                }
            }

            this.notifyListeners('sync_completed', { synced: syncedCount });
            console.log(`OfflineStorage: Synced ${syncedCount}/${unsynced.length} captures`);
        } catch (error) {
            console.error('OfflineStorage: Sync failed:', error);
            this.notifyListeners('sync_error', { error });
        } finally {
            this.syncInProgress = false;
        }
    }

    // Get pending sync count
    async getPendingSyncCount() {
        const unsynced = await this.getUnsyncedCaptures();
        return unsynced.length;
    }

    // Event handling
    onOnline() {
        console.log('OfflineStorage: Online - starting sync');
        this.notifyListeners('online');
        this.syncPendingCaptures();
    }

    onOffline() {
        console.log('OfflineStorage: Offline');
        this.notifyListeners('offline');
    }

    // Listener management
    addListener(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(event, data = {}) {
        this.listeners.forEach(cb => {
            try {
                cb(event, data);
            } catch (e) {
                console.error('OfflineStorage: Listener error:', e);
            }
        });
    }

    // Check if online
    isOnline() {
        return navigator.onLine;
    }

    // Clear all data
    async clearAll() {
        if (!this.db) return;

        try {
            const tx = this.db.transaction([CAPTURES_STORE, SYNC_QUEUE_STORE], 'readwrite');
            tx.objectStore(CAPTURES_STORE).clear();
            tx.objectStore(SYNC_QUEUE_STORE).clear();
            console.log('OfflineStorage: All data cleared');
        } catch (error) {
            console.error('OfflineStorage: Failed to clear data:', error);
        }
    }
}

// Export singleton
export const offlineStorageService = new OfflineStorageService();
export default offlineStorageService;
