/**
 * Crop Advice API Service
 * Service for communicating with backend API to get crop disease treatment advice
 * Handles API calls to the LLM backend for generating crop treatment recommendations
 */

// Backend API base URL - uses environment variable or defaults to production server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://swe-ai-crop-back.onrender.com';

// Singleton service for managing crop advice API calls
class CropAdviceService {
    constructor() {
        console.log('CropAdviceService initialized with API:', API_BASE_URL);
    }

    /**
     * Get crop advice for a single disease from the backend LLM
     * Sends disease data to Gemini AI via backend and receives structured treatment advice
     * @param {Object} diseaseData - Contains crop, disease, severity, confidence
     * @returns {Promise<Object>} - LLM-generated advice with treatments and prevention
     */
    async getCropAdvice(diseaseData) {
        try {
            // Make POST request to backend with disease information
            const response = await fetch(`${API_BASE_URL}/api/crop-advice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diseaseData), // Send disease data as JSON
            });

            // Check if response is successful (status 200-299)
            if (!response.ok) {
                // Extract error message from response or use default
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || 'Failed to get crop advice');
            }

            // Parse and return the successful response
            const result = await response.json();
            return result.data;
        } catch (error) {
            // Log and re-throw error for caller to handle
            console.error('Error fetching crop advice:', error);
            throw error;
        }
    }

    /**
     * Get crop advice for multiple diseases in a single batch request
     * More efficient than making individual requests for each disease
     * Processes all diseases in parallel on the backend
     * @param {Array} diseasesArray - Array of disease objects
     * @returns {Promise<Array>} - Array of advice objects
     */
    async getBatchCropAdvice(diseasesArray) {
        try {
            // Send all diseases in one request to backend
            const response = await fetch(`${API_BASE_URL}/api/crop-advice/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ diseases: diseasesArray }),
            });

            // Validate response status
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || 'Failed to get batch crop advice');
            }

            // Return array of advice objects
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching batch crop advice:', error);
            throw error;
        }
    }

    /**
     * Test if the backend API is reachable and functioning
     * Useful for debugging connection issues and validating deployment
     * @returns {Promise<boolean>} - True if API is working, false otherwise
     */
    async testConnection() {
        try {
            // Call the test endpoint
            const response = await fetch(`${API_BASE_URL}/api/test`);

            // Check response status
            if (!response.ok) {
                throw new Error('API test failed');
            }

            // Parse and return the response
            return await response.json();
        } catch (error) {
            // Connection failed
            console.error('API connection test failed:', error);
            throw error;
        }
    }
}

// Export singleton instance for use throughout the app
export default new CropAdviceService();
