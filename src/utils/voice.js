/**
 * Voice Utility Module
 * Provides text-to-speech functionality using the Web Speech API
 * Supports multi-language voice output for accessibility
 */

/**
 * Speak text using browser's speech synthesis
 * @param {string} text - Text to be spoken
 * @param {string} lang - Language code (default: "en-IN" for Indian English)
 * 
 * Supported languages include:
 * - en-IN: English (India)
 * - hi-IN: Hindi
 * - ta-IN: Tamil
 * - te-IN: Telugu
 * - And many more Indian languages
 */
export function speak(text, lang = "en-IN") {
  // Check if browser supports speech synthesis
  if (!("speechSynthesis" in window)) {
    console.warn("Speech not supported in this browser");
    return;
  }

  // Cancel any ongoing speech to prevent overlap
  window.speechSynthesis.cancel();

  // Create a new speech utterance with the provided text
  const msg = new SpeechSynthesisUtterance(text);

  // Configure speech parameters
  msg.lang = lang;      // Set language/accent
  msg.rate = 0.95;      // Slightly slower than default for clarity (normal is 1.0)
  msg.pitch = 1;        // Normal pitch

  // Queue and speak the utterance
  window.speechSynthesis.speak(msg);
}
