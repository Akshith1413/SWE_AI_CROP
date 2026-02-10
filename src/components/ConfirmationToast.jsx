/**
 * ConfirmationToast Component
 * Provides toast notifications with audio feedback
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Smooth slide-in/slide-out animations
 * - Audio feedback (sound effects + voice)
 * - Stacked positioning for multiple toasts
 * 
 * Usage:
 * ```js
 * import { showToast } from './ConfirmationToast';
 * showToast('Operation successful!', {
 *   type: 'success',
 *   duration: 3000,
 *   voiceMessage: 'Your changes have been saved'
 * });
 * ```
 */
import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { audioService } from '../services/audioService';

/**
 * Toast Type Configurations
 * Defines appearance and behavior for each toast type
 */
const TOAST_TYPES = {
    success: {
        icon: Check,
        bg: 'bg-emerald-500',
        text: 'text-white',
        sound: 'success'  // Sound effect to play
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-red-500',
        text: 'text-white',
        sound: 'error'
    },
    warning: {
        icon: AlertCircle,
        bg: 'bg-amber-500',
        text: 'text-white',
        sound: 'warning'
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500',
        text: 'text-white',
        sound: 'click'
    }
};

/**
 * ConfirmationToast Component
 * Individual toast notification with animations and audio
 * 
 * @param {string} message - Text to display in toast
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Auto-dismiss duration in milliseconds
 * @param {function} onClose - Callback when toast closes
 * @param {string} voiceMessage - Optional voice message to speak
 * @param {boolean} showVoice - Whether to enable voice feedback (default: true)
 */
const ConfirmationToast = ({
    message,
    type = 'success',
    duration = 3000,
    onClose,
    voiceMessage = null,
    showVoice = true
}) => {
    // Animation states
    const [visible, setVisible] = useState(false);  // Controls fade-in animation
    const [exiting, setExiting] = useState(false);  // Controls fade-out animation

    useEffect(() => {
        // Trigger slide-in animation on next frame (allows CSS transition to work)
        requestAnimationFrame(() => setVisible(true));

        // Play sound effect based on toast type
        try {
            const soundType = TOAST_TYPES[type]?.sound || 'click';
            audioService.confirmAction(soundType);
        } catch (e) {
            console.error('Toast: Audio error:', e);
        }

        // Speak voice message if provided and voice is enabled
        if (showVoice && voiceMessage) {
            try {
                audioService.speak(voiceMessage);
            } catch (e) {
                console.error('Toast: Voice error:', e);
            }
        }

        // Auto-dismiss timer
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, []);

    /**
     * Handle toast dismissal
     * Triggers exit animation before calling onClose
     */
    const handleClose = () => {
        setExiting(true);
        // Wait for exit animation to complete before removing
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    };

    // Get configuration for current toast type
    const config = TOAST_TYPES[type] || TOAST_TYPES.success;
    const Icon = config.icon;

    return (
        <div
            className={`fixed top-4 left-1/2 z-[9999] transition-all duration-300 ease-out
                ${visible && !exiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
            `}
            style={{ transform: `translateX(-50%) ${visible && !exiting ? 'translateY(0)' : 'translateY(-16px)'}` }}
        >
            {/* Toast card with type-specific styling */}
            <div className={`${config.bg} ${config.text} rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 min-w-[280px] max-w-[90vw]`}>
                {/* Icon with semi-transparent background circle */}
                <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
                    <Icon className="w-5 h-5" />
                </div>

                {/* Message text */}
                <p className="font-medium text-sm flex-1">{message}</p>

                {/* Manual close button */}
                <button
                    onClick={handleClose}
                    className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

/**
 * Toast Manager
 * Global callback for triggering toasts from anywhere in the app
 */
let toastCallback = null;

/**
 * Show toast notification
 * Can be called from anywhere in the application
 * 
 * @param {string} message - Toast message
 * @param {Object} options - Toast configuration
 * @param {string} options.type - 'success' | 'error' | 'warning' | 'info'
 * @param {number} options.duration - Auto-dismiss duration (default: 3000ms)
 * @param {string} options.voiceMessage - Optional voice message
 * @param {boolean} options.showVoice - Enable voice feedback (default: true)
 */
export const showToast = (message, options = {}) => {
    if (toastCallback) {
        toastCallback({ message, ...options });
    }
};

/**
 * ToastContainer Component
 * Must be rendered once in app root to enable toast notifications
 * Manages multiple toasts with stacked positioning
 */
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Register global toast callback
        toastCallback = (toast) => {
            // Generate unique ID for each toast
            const id = Date.now() + Math.random();
            setToasts(prev => [...prev, { ...toast, id }]);
        };

        // Cleanup callback on unmount
        return () => { toastCallback = null; };
    }, []);

    /**
     * Remove toast from the stack
     * @param {string} id - Toast ID to remove
     */
    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <>
            {/* Render all active toasts with stacked positioning */}
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ position: 'fixed', top: `${(index * 60) + 16}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 + index }}>
                    <ConfirmationToast
                        message={toast.message}
                        type={toast.type || 'success'}
                        duration={toast.duration || 3000}
                        voiceMessage={toast.voiceMessage}
                        showVoice={toast.showVoice !== false}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </>
    );
};

export default ConfirmationToast;
