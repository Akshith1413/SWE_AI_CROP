/**
 * AI Service
 * Simulates sophisticated AI inference for crop disease detection.
 * Provides diagnostics, confidence scores, severity estimation, and plain language explanations.
 */

// Mock disease database containing crop-specific and general diseases
// Each disease has symptoms, treatments, severity level, and AI explanation
const DISEASE_DATABASE = {
    // Tomato-specific diseases
    tomato: [
        {
            name: "Early Blight",
            scientificName: "Alternaria solani",
            symptoms: ["Concentric rings on leaves", "Lower leaves yellowing"],
            severity: "moderate",
            treatments: ["Copper-based fungicides", "Improve air circulation", "Mulch soil"],
            explanation: "The AI detected characteristic 'bullseye' patterns on the lower leaves, indicating Early Blight fungus."
        },
        {
            name: "Late Blight",
            scientificName: "Phytophthora infestans",
            symptoms: ["Large dark spots", "White fungal growth"],
            severity: "severe",
            treatments: ["Remove infected plants", "Apply fungicide immediately", "Keep leaves dry"],
            explanation: "Analysis reveals rapidly spreading dark lesions suggesting Late Blight, a serious condition requiring immediate action."
        }
    ],
    // Corn-specific diseases
    corn: [
        {
            name: "Common Rust",
            scientificName: "Puccinia sorghi",
            symptoms: ["Reddish-brown pustules", "Powdery spores"],
            severity: "mild",
            treatments: ["Fungicide if severe", "Plant resistant varieties"],
            explanation: "Pustules found on leaf surfaces match Common Rust patterns. Usually manageable unless infection is widespread."
        }
    ],
    // General crop issues applicable to any plant
    general: [
        {
            name: "Healthy",
            severity: "none",
            explanation: "The plant shows vigorous growth with uniform green color and no visible signs of stress or disease.",
            treatments: ["Continue regular care", "Monitor for pests"]
        },
        {
            name: "Nitrogen Deficiency",
            severity: "moderate",
            symptoms: ["Overall yellowing", "Stunted growth"],
            explanation: "Uniform yellowing (chlorosis) suggests a lack of Nitrogen. Consider adding organic compost or nitrogen-rich fertilizer.",
            treatments: ["Apply nitrogen fertilizer", "Check soil pH"]
        }
    ]
};

export const aiService = {
    /**
     * Simulate AI Analysis of an image
     * @param {string} imageData - Base64 image data
     * @param {string} cropContext - Optional crop type hint
     */
    analyze: async (imageData, cropContext = null) => {
        return new Promise((resolve) => {
            // Simulate AI processing delay (2 seconds)
            setTimeout(() => {
                // Randomly determine if plant is healthy (60% chance of disease)
                const isHealthy = Math.random() > 0.4;

                // Select disease database based on crop context
                // If crop type is provided and exists in database, use crop-specific diseases
                // Otherwise fall back to general diseases
                const diseases = cropContext && DISEASE_DATABASE[cropContext.toLowerCase()]
                    ? DISEASE_DATABASE[cropContext.toLowerCase()]
                    : DISEASE_DATABASE.general;

                let diagnosis;
                if (isHealthy) {
                    // Plant is healthy - use the "Healthy" entry from general database
                    diagnosis = DISEASE_DATABASE.general[0];
                } else {
                    // Plant has disease - randomly select one from available diseases
                    diagnosis = diseases[Math.floor(Math.random() * diseases.length)];

                    // Safety check: if we randomly picked "Healthy" but isHealthy is false,
                    // default to nitrogen deficiency to ensure we show a problem
                    if (diagnosis.name === 'Healthy') diagnosis = DISEASE_DATABASE.general[1];
                }

                // Generate random confidence score between 70% and 98%
                // Higher confidence makes the diagnosis appear more reliable
                const confidence = 0.70 + (Math.random() * 0.28);

                // Generate heatmap points showing affected areas on the plant
                // Heatmap uses normalized coordinates (0-1) for position and intensity
                const heatmap = [];
                if (diagnosis.name !== "Healthy") {
                    // Create 3 random hotspots indicating disease locations
                    for (let i = 0; i < 3; i++) {
                        heatmap.push({
                            x: 0.2 + Math.random() * 0.6,        // X position (20-80% of image width)
                            y: 0.2 + Math.random() * 0.6,        // Y position (20-80% of image height)
                            radius: 0.1 + Math.random() * 0.15,  // Size of affected area (10-25%)
                            intensity: 0.5 + Math.random() * 0.5 // Severity of infection (50-100%)
                        });
                    }
                }

                // Calculate visual analysis scores based on plant health status
                // Healthy plants: 80-100% health score, minimal disease/browning
                // Unhealthy plants: 20-70% health score, significant disease/browning
                const healthScore = isHealthy ? Math.floor(80 + Math.random() * 20) : Math.floor(20 + Math.random() * 50);
                const diseasePercentage = isHealthy ? Math.floor(Math.random() * 5) : Math.floor(10 + Math.random() * 40);
                const brownPercentage = isHealthy ? Math.floor(Math.random() * 10) : Math.floor(5 + Math.random() * 20);

                // Calculate green percentage (remaining healthy tissue)
                // Total must equal 100%: green + disease + brown = 100
                const greenPercentage = 100 - diseasePercentage - brownPercentage;

                // Return comprehensive analysis results
                resolve({
                    // Primary diagnosis information
                    diagnosis: diagnosis.name,                          // Disease name
                    scientificName: diagnosis.scientificName,           // Scientific/Latin name
                    confidence: parseFloat(confidence.toFixed(2)),      // Confidence score (0-1)
                    severity: diagnosis.severity,                       // Severity: mild, moderate, severe, none

                    // Clinical details
                    symptoms: diagnosis.symptoms || [],                 // Observable symptoms
                    explanation: diagnosis.explanation,                 // AI's reasoning
                    treatments: diagnosis.treatments || [],             // Recommended treatments

                    // Visual analysis data
                    heatmap: heatmap,                                  // Affected area coordinates
                    timestamp: new Date().toISOString(),               // Analysis timestamp

                    // Health metrics for UI display
                    healthScore: healthScore,                          // Overall health (0-100)
                    greenPercentage: greenPercentage,                  // Healthy tissue %
                    brownPercentage: brownPercentage,                  // Dead tissue %
                    diseasePercentage: diseasePercentage,              // Diseased tissue %

                    // Alternative field names for backwards compatibility
                    issues: diagnosis.symptoms || [],                   // Same as symptoms
                    recommendations: diagnosis.treatments || [],        // Same as treatments

                    // Alternative diagnoses (multi-label classification simulation)
                    // Only shown for diseased plants to suggest other possible causes
                    otherPossibilities: !isHealthy ? [
                        { name: "Nutrient Deficiency", confidence: 0.15 },  // 15% chance
                        { name: "Water Stress", confidence: 0.08 }           // 8% chance
                    ] : []
                });
            }, 2000); // 2 second mock delay
        });
    }
};
