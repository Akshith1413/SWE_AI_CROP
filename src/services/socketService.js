import { io } from 'socket.io-client';
import { API_BASE_URL } from './api';

let socket = null;
const listeners = new Map();

/**
 * Real-time socket service for receiving live updates.
 * Connects to backend Socket.IO server.
 */
export const socketService = {
    /**
     * Connect to Socket.IO and join user room
     */
    connect(userId) {
        if (socket?.connected) return;

        socket = io(API_BASE_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
            console.log('✓ Socket connected:', socket?.id);
            if (userId) {
                socket.emit('join', userId);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('connect_error', (err) => {
            console.warn('Socket connection error:', err.message);
        });
    },

    /**
     * Disconnect from server
     */
    disconnect() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        listeners.clear();
    },

    /**
     * Listen for an event. Returns an unsubscribe function.
     */
    on(event, callback) {
        if (!socket) return () => {};
        socket.on(event, callback);

        // Track listeners for cleanup
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event).push(callback);

        return () => {
            if (socket) socket.off(event, callback);
            const cbs = listeners.get(event);
            if (cbs) {
                const idx = cbs.indexOf(callback);
                if (idx > -1) cbs.splice(idx, 1);
            }
        };
    },

    /**
     * Check if connected
     */
    get isConnected() {
        return socket?.connected ?? false;
    }
};
