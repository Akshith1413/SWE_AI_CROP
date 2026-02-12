import { offlineSync } from './offlineSync';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    auth: {
        login: async (phoneNumber) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });
            return res.json();
        },
        verify: async (phoneNumber, otp) => {
            const res = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            if (!res.ok) throw new Error('Verification failed');
            return res.json();
        }
    },
    user: {
        getProfile: async (userId) => {
            const res = await fetch(`${API_URL}/user/${userId}`);
            return res.json();
        },
        updateProfile: async (userId, data) => {
            const res = await fetch(`${API_URL}/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return res.json();
        }
    },
    crops: {
        get: async (userId) => {
            const res = await fetch(`${API_URL}/crops/${userId}`);
            return res.json();
        },
        save: async (userId, selectedCrops) => {
            const res = await fetch(`${API_URL}/crops`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, selectedCrops }),
            });
            return res.json();
        }
    },
    settings: {
        get: async (userId) => {
            const res = await fetch(`${API_URL}/settings/${userId}`);
            return res.json();
        },
        update: async (userId, settings) => {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...settings }),
            });
            return res.json();
        }
    },
    consent: {
        log: async (userId, agreed) => {
            const res = await fetch(`${API_URL}/consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, agreed }),
            });
            return res.json();
        }
    },
    diagnosis: {
        save: async (data) => {
            const res = await fetch(`${API_URL}/diagnosis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return res.json();
        }
    },
    community: {
        getPosts: async () => {
            if (!navigator.onLine) {
                const cached = offlineSync.getCachedData('community_posts');
                return cached || [];
            }
            try {
                const res = await fetch(`${API_URL}/community`);
                const data = await res.json();
                offlineSync.cacheData('community_posts', data);
                return data;
            } catch (e) {
                console.error("Fetch failed, using cache", e);
                return offlineSync.getCachedData('community_posts') || [];
            }
        },
        createPost: async (postData) => {
            if (!navigator.onLine) {
                return offlineSync.queueAction('CREATE_POST', postData);
            }
            const res = await fetch(`${API_URL}/community`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
            return res.json();
        },
        likePost: async (postId, userId) => {
            // Likes are less critical, maybe just skip offline or optimistic allow?
            // For simplicity, skip offline for now or just throw error caught by UI
            if (!navigator.onLine) return [];
            const res = await fetch(`${API_URL}/community/${postId}/like`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            return res.json();
        },
        commentPost: async (postId, userId, text) => {
            if (!navigator.onLine) return null; // Comments complex to sync offline
            const res = await fetch(`${API_URL}/community/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, text }),
            });
            return res.json();
        }
    },
    calendar: {
        getTasks: async (userId) => {
            if (!navigator.onLine) {
                const cached = offlineSync.getCachedData(`calendar_tasks_${userId}`);
                return cached || [];
            }
            try {
                const res = await fetch(`${API_URL}/calendar/${userId}`);
                const data = await res.json();
                offlineSync.cacheData(`calendar_tasks_${userId}`, data);
                return data;
            } catch (e) {
                return offlineSync.getCachedData(`calendar_tasks_${userId}`) || [];
            }
        },
        createTask: async (taskData) => {
            if (!navigator.onLine) {
                return offlineSync.queueAction('CREATE_TASK', taskData);
            }
            const res = await fetch(`${API_URL}/calendar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            return res.json();
        },
        toggleTask: async (taskId) => {
            if (!navigator.onLine) {
                return offlineSync.queueAction('TOGGLE_TASK', { taskId });
            }
            const res = await fetch(`${API_URL}/calendar/${taskId}/toggle`, {
                method: 'PUT',
            });
            return res.json();
        },
        deleteTask: async (taskId) => {
            if (!navigator.onLine) {
                return offlineSync.queueAction('DELETE_TASK', { taskId });
            }
            const res = await fetch(`${API_URL}/calendar/${taskId}`, {
                method: 'DELETE',
            });
            return res.json();
        }
    }
};
