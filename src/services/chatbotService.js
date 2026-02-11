/**
 * Chatbot Service
 * Handles agriculture-focused chatbot interactions with LLM
 */

// Agriculture-related keywords to validate if question is farming-related
const AGRICULTURE_KEYWORDS = [
  'crop', 'plant', 'soil', 'fertilizer', 'pest', 'disease', 'irrigation',
  'farming', 'agriculture', 'harvest', 'seed', 'leaf', 'root', 'stem',
  'tomato', 'wheat', 'rice', 'corn', 'potato', 'vegetable', 'fruit',
  'pesticide', 'herbicide', 'fungicide', 'organic', 'compost', 'mulch',
  'water', 'weather', 'climate', 'yield', 'growth', 'cultivation',
  'nitrogen', 'phosphorus', 'potassium', 'nutrient', 'deficiency',
  'blight', 'rust', 'wilt', 'rot', 'mold', 'fungus', 'bacteria',
  'insect', 'caterpillar', 'aphid', 'beetle', 'mite', 'nematode'
];

// Check if question is agriculture-related
const isAgricultureRelated = (question) => {
  const lowerQuestion = question.toLowerCase();
  return AGRICULTURE_KEYWORDS.some(keyword => lowerQuestion.includes(keyword));
};

// Agriculture knowledge base for common questions
const AGRICULTURE_KB = {
  'yellow leaves': {
    response: `Yellow leaves can indicate several issues:

🌱 **Nitrogen Deficiency**: The most common cause. Older leaves turn yellow first.
   • Treatment: Apply nitrogen-rich fertilizer or compost
   
💧 **Overwatering**: Root rot prevents nutrient absorption
   • Treatment: Reduce watering, improve drainage
   
🌞 **Iron Deficiency**: Yellow leaves with green veins
   • Treatment: Apply chelated iron or adjust soil pH
   
🦠 **Disease**: Viral or fungal infections
   • Treatment: Identify specific disease and treat accordingly

What type of crop are you growing? This will help me provide more specific advice.`,
    keywords: ['yellow', 'yellowing', 'chlorosis']
  },
  'pest control': {
    response: `Here are effective pest control strategies:

🌿 **Organic Methods**:
   • Neem oil spray (5ml/liter water)
   • Introduce beneficial insects (ladybugs, lacewings)
   • Companion planting (marigolds, basil)
   • Manual removal of visible pests

🧪 **Chemical Methods** (if organic fails):
   • Use specific pesticides for identified pests
   • Follow dosage instructions carefully
   • Apply in evening to protect pollinators
   
🛡️ **Prevention**:
   • Regular inspection of plants
   • Remove infected plant parts
   • Maintain proper spacing for air circulation
   • Crop rotation

What specific pest are you dealing with?`,
    keywords: ['pest', 'insect', 'bug', 'control', 'aphid', 'caterpillar']
  },
  'soil health': {
    response: `Maintaining healthy soil is crucial for good yields:

🌱 **Improve Soil Structure**:
   • Add organic matter (compost, manure)
   • Avoid compaction - don't work wet soil
   • Use cover crops in off-season
   
🧪 **Nutrient Management**:
   • Test soil pH (ideal: 6.0-7.0 for most crops)
   • Add NPK fertilizers based on crop needs
   • Use organic amendments (bone meal, blood meal)
   
💧 **Water Retention**:
   • Add compost to improve water holding
   • Mulch to reduce evaporation
   • Create proper drainage for clay soils
   
🔄 **Maintain Balance**:
   • Rotate crops annually
   • Add beneficial microbes
   • Avoid excessive chemical use

Would you like specific advice for your soil type?`,
    keywords: ['soil', 'fertility', 'compost', 'pH', 'nutrient']
  },
  'irrigation': {
    response: `Proper irrigation is key to healthy crops:

💧 **Watering Guidelines**:
   • Early morning is best time (6-10 AM)
   • Water deeply but less frequently
   • Avoid wetting leaves to prevent disease
   
📊 **Water Amount**:
   • Seedlings: Light, frequent watering
   • Established plants: Deep watering 1-2 times/week
   • Adjust based on weather and soil type
   
🌱 **Methods**:
   • Drip irrigation: Most efficient (90% efficiency)
   • Sprinkler: Good for large areas
   • Furrow: Traditional for row crops
   
⚠️ **Signs of Problems**:
   • Wilting in morning = underwatered
   • Wilting + yellow leaves = overwatered
   • Slow growth = inconsistent watering

What irrigation method are you currently using?`,
    keywords: ['water', 'irrigation', 'watering', 'drip', 'sprinkler']
  },
  'crop diseases': {
    response: `Common crop diseases and their management:

🦠 **Fungal Diseases** (most common):
   • Symptoms: Spots, wilting, powder on leaves
   • Treatment: Fungicides, remove infected parts
   • Prevention: Good air circulation, avoid overhead watering
   
🔬 **Bacterial Diseases**:
   • Symptoms: Water-soaked spots, ooze
   • Treatment: Copper-based sprays, remove infected plants
   • Prevention: Use disease-free seeds, crop rotation
   
🧬 **Viral Diseases**:
   • Symptoms: Mottling, stunted growth, distorted leaves
   • Treatment: No cure - remove infected plants
   • Prevention: Control insect vectors, use resistant varieties
   
📸 For accurate diagnosis, I recommend using the app's camera feature to scan your plant!

What symptoms are you seeing on your crops?`,
    keywords: ['disease', 'blight', 'rust', 'wilt', 'rot', 'fungal', 'viral']
  }
};

// Find best matching response from knowledge base
const findKBResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  
  for (const [topic, data] of Object.entries(AGRICULTURE_KB)) {
    if (data.keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return data.response;
    }
  }
  
  return null;
};

export const chatbotService = {
  /**
   * Send message to chatbot and get response
   * @param {string} message - User's question
   * @returns {Promise<string>} - Bot's response
   */
  sendMessage: async (message) => {
    // Validate if agriculture-related
    if (!isAgricultureRelated(message)) {
      return `I'm CropAID, your Smart Farming Assistant! 🌱

I specialize in helping with agriculture-related topics such as:
• Crop diseases and pest control
• Soil health and fertilization
• Irrigation and water management
• Planting and harvesting advice
• Organic farming practices

Please ask me questions related to farming and crop management. How can I help with your crops today?`;
    }

    // Try to find answer in knowledge base first
    const kbResponse = findKBResponse(message);
    if (kbResponse) {
      return kbResponse;
    }

    // For questions not in KB, try to call the API
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: 'agriculture'
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.reply) {
        return data.reply;
      }
    } catch (err) {
      console.log('API not available, using fallback response');
    }

    // Fallback response with helpful general advice
    return `Thank you for your question about "${message}".

As CropAID, I can provide better assistance if you:

📸 **Use the Camera Feature**: Scan your plant for instant disease detection
🌱 **Be More Specific**: Tell me your crop type and specific symptoms
💬 **Try Common Topics**: Ask about yellow leaves, pest control, soil health, or irrigation

Here are some quick tips for general plant health:
• Ensure good drainage and don't overwater
• Provide adequate sunlight (6-8 hours for most crops)
• Test and amend soil regularly
• Monitor for pests and diseases weekly
• Maintain proper spacing between plants

Would you like to know more about any specific topic?`;
  }
};
