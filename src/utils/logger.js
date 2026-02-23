/**
 * Standardized Unified Logger Utility
 * Captures UI actions, warnings, and pipes critical failures to the backend.
 */
import { api } from '../services/api';

class GenericLogger {
    constructor() {
        this.logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
    }

    info(message, data = null) {
        if (this.logLevel === 'info' || this.logLevel === 'debug') {
            const output = data ? [message, data] : [message];
            console.log(`[INF] ${new Date().toISOString()} -`, ...output);
        }
    }

    warn(message, data = null) {
        const output = data ? [message, data] : [message];
        console.warn(`[WRN] ${new Date().toISOString()} -`, ...output);
    }

    success(message, data = null) {
        const output = data ? [message, data] : [message];
        console.log(`[OK ] ${new Date().toISOString()} - %c${message}`, 'color: green; font-weight: bold;');
    }

    async error(context, errorObj, metadata = null) {
        console.error(`[ERR] ${new Date().toISOString()} - ${context}:`, errorObj, metadata);

        // Pipe critical errors to backend telemetry API
        try {
            await api.logs.save({
                level: 'error',
                context,
                message: errorObj?.message || String(errorObj),
                stack: errorObj?.stack || '',
                metadata: {
                    ...metadata,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                },
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.error("Failed to sync error log to backend:", e);
        }
    }
}

export const logger = new GenericLogger();
