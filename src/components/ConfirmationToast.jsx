import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { audioService } from '../services/audioService';

const TOAST_TYPES = {
    success: {
        icon: Check,
        bg: 'bg-emerald-500',
        text: 'text-white',
        sound: 'success'
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

const ConfirmationToast = ({
    message,
    type = 'success',
    duration = 3000,
    onClose,
    voiceMessage = null,
    showVoice = true
}) => {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setVisible(true));

        // Play sound
        try {
            const soundType = TOAST_TYPES[type]?.sound || 'click';
            audioService.confirmAction(soundType);
        } catch (e) {
            console.error('Toast: Audio error:', e);
        }

        // Speak voice message if provided
        if (showVoice && voiceMessage) {
            try {
                audioService.speak(voiceMessage);
            } catch (e) {
                console.error('Toast: Voice error:', e);
            }
        }

        // Auto dismiss
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => {
            onClose && onClose();
        }, 300);
    };

    const config = TOAST_TYPES[type] || TOAST_TYPES.success;
    const Icon = config.icon;

    return (
        <div
            className={`fixed top-4 left-1/2 z-[9999] transition-all duration-300 ease-out
                ${visible && !exiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
            `}
            style={{ transform: `translateX(-50%) ${visible && !exiting ? 'translateY(0)' : 'translateY(-16px)'}` }}
        >
            <div className={`${config.bg} ${config.text} rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 min-w-[280px] max-w-[90vw]`}>
                <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm flex-1">{message}</p>
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

// Toast manager for triggering toasts from anywhere
let toastCallback = null;

export const showToast = (message, options = {}) => {
    if (toastCallback) {
        toastCallback({ message, ...options });
    }
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastCallback = (toast) => {
            const id = Date.now() + Math.random();
            setToasts(prev => [...prev, { ...toast, id }]);
        };
        return () => { toastCallback = null; };
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <>
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
