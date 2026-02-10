// Service for managing user consent and guest mode status
// Handles consent tracking, revocation, and guest mode storage

const CONSENT_KEY = 'crop_diagnosis_consent';
const CONSENT_RECORD_KEY = 'crop_diagnosis_consent_record';
const GUEST_KEY = 'crop_diagnosis_is_guest';

export const consentService = {
    // Check if user has given consent
    hasConsent: () => {
        return localStorage.getItem(CONSENT_KEY) === 'true';
    },

    // Record user consent with timestamp and metadata
    giveConsent: () => {
        try {
            localStorage.setItem(CONSENT_KEY, 'true');
            // Log timestamped consent record
            const record = {
                consentGiven: true,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                version: '1.0'
            };
            const existingRecords = consentService.getConsentRecords();
            existingRecords.push(record);
            localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify(existingRecords));
            console.log('Consent recorded at:', record.timestamp);
        } catch (e) {
            console.error('Failed to save consent:', e);
        }
    },

    revokeConsent: () => {
        try {
            localStorage.removeItem(CONSENT_KEY);
            // Log revocation
            const record = {
                consentGiven: false,
                consentRevoked: true,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            const existingRecords = consentService.getConsentRecords();
            existingRecords.push(record);
            localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify(existingRecords));
            console.log('Consent revoked at:', record.timestamp);
        } catch (e) {
            console.error('Failed to revoke consent:', e);
        }
    },

    // Retrieve all consent records from storage
    getConsentRecords: () => {
        try {
            const stored = localStorage.getItem(CONSENT_RECORD_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load consent records:', e);
            return [];
        }
    },

    getLatestConsentRecord: () => {
        const records = consentService.getConsentRecords();
        return records.length > 0 ? records[records.length - 1] : null;
    },

    // Check if user is in guest mode
    isGuest: () => {
        return localStorage.getItem(GUEST_KEY) === 'true';
    },

    // Enable or disable guest mode
    setGuestMode: (isGuest) => {
        if (isGuest) {
            localStorage.setItem(GUEST_KEY, 'true');
        } else {
            localStorage.removeItem(GUEST_KEY);
        }
    }
};
