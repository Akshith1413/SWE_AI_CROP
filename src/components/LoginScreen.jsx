// Component for Firebase phone authentication with OTP verification
import { useState, useEffect, useRef, useCallback } from "react";
import "./LoginScreen.css";

import { speak } from "../utils/voice";
import { useTranslation } from "../hooks/useTranslation";
import { audioService } from "../services/audioService";

import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

// OTP expiry duration (2 minutes)
const OTP_EXPIRY_SECONDS = 120;

function LoginScreen({ onLogin, onSkip }) {
  const { t, language } = useTranslation();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");

  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);

  // OTP Timer
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  // OTP individual digit inputs
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  // Enable voice feature after user's first click interaction
  useEffect(() => {
    const enableVoice = () => {
      setVoiceEnabled(true);
      if (autoPlayVoice) {
        speak(t('loginScreen.brandDesc'), getVoiceLang());
      }
      document.removeEventListener("click", enableVoice);
    };

    document.addEventListener("click", enableVoice);
    return () => {
      document.removeEventListener("click", enableVoice);
    };
  }, [t, autoPlayVoice]);

  // Provide voice guidance when authentication step changes
  useEffect(() => {
    if (voiceEnabled && autoPlayVoice) {
      if (step === "phone") {
        speak(t('loginScreen.voiceGuidePhone'), getVoiceLang());
      } else if (step === "otp") {
        speak(t('loginScreen.voiceGuideOtp'), getVoiceLang());
      }
    }
  }, [step, voiceEnabled, autoPlayVoice, t]);

  // Map language codes to voice recognition language codes
  const getVoiceLang = useCallback(() => {
    const langMap = {
      en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
      kn: 'kn-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN',
      pa: 'pa-IN', ml: 'ml-IN', or: 'or-IN', as: 'as-IN',
      ur: 'ur-IN', ne: 'ne-NP', sa: 'sa-IN'
    };
    return langMap[language] || 'en-IN';
  }, [language]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [otpTimer]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Replay audio guidance
  const replayAudio = () => {
    if (step === "phone") {
      speak(t('loginScreen.voiceGuidePhone'), getVoiceLang());
    } else if (step === "otp") {
      speak(t('loginScreen.voiceGuideOtp'), getVoiceLang());
    }
    audioService.playClick();
  };

  // Send OTP to entered phone number via Firebase
  const sendOtp = async () => {
    setError("");

    // Validate 10-digit phone number
    if (phone.length !== 10) {
      const msg = t('loginScreen.invalidPhone');
      setError(msg);
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playError();
      return;
    }

    try {
      setLoading(true);

      // Guard: check if Firebase auth is properly initialized
      if (!auth || auth._isInitialized === false) {
        const msg = t('loginScreen.firebaseError');
        setError(msg);
        console.warn('Firebase auth not initialized. Auth object:', auth?._error || 'unknown');
        if (voiceEnabled) speak(msg, getVoiceLang());
        audioService.playError();
        setLoading(false);
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier
      );

      setConfirmation(result);
      setStep("otp");
      setOtpTimer(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);

      const msg = t('loginScreen.otpSent');
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playSuccess();

      // Try auto-read OTP using Web OTP API
      tryAutoReadOtp();

    } catch (err) {
      console.error("OTP Error:", err);
      let errorMsg = t('loginScreen.otpFailed');

      // Enhanced error messages
      if (err.code === 'auth/too-many-requests') {
        errorMsg = t('loginScreen.tooManyRequests');
      } else if (err.code === 'auth/invalid-phone-number') {
        errorMsg = t('loginScreen.invalidPhoneNumber');
      } else if (err.code === 'auth/quota-exceeded') {
        errorMsg = t('loginScreen.quotaExceeded');
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = t('loginScreen.networkError');
      } else if (err.message && err.message.includes('Firebase')) {
        // Firebase not configured properly - graceful fallback
        errorMsg = t('loginScreen.firebaseError');
        console.warn('Firebase may not be configured properly:', err.message);
      }

      setError(errorMsg);
      if (voiceEnabled) speak(errorMsg, getVoiceLang());
      audioService.playError();

      // Reset recaptcha on error
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (e) {
        console.warn('Recaptcha cleanup error:', e);
      }
    }

    setLoading(false);
  };

  // Resend OTP
  const resendOtp = async () => {
    setCanResend(false);
    setOtp("");
    setOtpDigits(["", "", "", "", "", ""]);
    setError("");

    // Reset recaptcha
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } catch (e) {
      console.warn('Recaptcha cleanup error:', e);
    }

    await sendOtp();
  };

  // Auto-read OTP via Web OTP API
  const tryAutoReadOtp = async () => {
    try {
      if ('OTPCredential' in window) {
        const ac = new AbortController();
        const otpCredential = await navigator.credentials.get({
          otp: { transport: ['sms'] },
          signal: ac.signal
        });
        if (otpCredential && otpCredential.code) {
          const code = otpCredential.code;
          setOtp(code);
          // Fill digit inputs
          const digits = code.split('').slice(0, 6);
          setOtpDigits(prev => {
            const newDigits = [...prev];
            digits.forEach((d, i) => { newDigits[i] = d; });
            return newDigits;
          });
        }
      }
    } catch (e) {
      // Auto-read not supported or user cancelled - silently ignore
      console.log('OTP auto-read not available:', e.message);
    }
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtp(newDigits.join(''));

    // Auto-focus next
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    setError("");
    const fullOtp = otpDigits.join('');

    if (!confirmation) {
      const msg = t('loginScreen.requestOtpFirst');
      setError(msg);
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playError();
      return;
    }

    if (fullOtp.length !== 6) {
      const msg = t('loginScreen.enterCompleteOtp');
      setError(msg);
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playError();
      return;
    }

    if (otpTimer === 0) {
      const msg = t('loginScreen.otpExpired');
      setError(msg);
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playWarning();
      return;
    }

    try {
      setLoading(true);
      const result = await confirmation.confirm(fullOtp);

      const msg = t('loginScreen.loginSuccess');
      if (voiceEnabled) speak(msg, getVoiceLang());
      audioService.playSuccess();

      onLogin({
        id: result.user?.uid || 'firebase_user',
        phone: phone,
        provider: 'phone'
      });

    } catch (err) {
      console.error("Verify Error:", err);
      let errorMsg = t('loginScreen.incorrectOtp');

      if (err.code === 'auth/invalid-verification-code') {
        errorMsg = t('loginScreen.invalidOtp');
      } else if (err.code === 'auth/code-expired') {
        errorMsg = t('loginScreen.otpExpired');
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = t('loginScreen.networkError');
      }

      setError(errorMsg);
      if (voiceEnabled) speak(errorMsg, getVoiceLang());
      audioService.playError();
    }

    setLoading(false);
  };


  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>{t('loginScreen.brandName')}</h1>
        <p>
          {t('loginScreen.brandDesc')}
          <br /><br />
          {t('loginScreen.brandSubDesc')}
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">

          <h2>{t('loginScreen.title')}</h2>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span className="login-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* PHONE INPUT */}
          {step === "phone" && (
            <>
              <div className="phone-input-group">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  placeholder={t('loginScreen.enterMobile')}
                  value={phone}
                  maxLength="10"
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="phone-input"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading || phone.length !== 10}
                className="login-btn"
              >
                {loading ? t('loginScreen.sending') : t('loginScreen.sendOtp')}
              </button>
            </>
          )}

          {/* OTP INPUT */}
          {step === "otp" && (
            <>
              <p className="otp-info-text">{t('loginScreen.otpSentTo')} +91 {phone}</p>

              {/* OTP Digit Boxes */}
              <div className="otp-digits-row">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-digit-input"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* OTP Timer */}
              <div className="otp-timer-row">
                {otpTimer > 0 ? (
                  <span className="otp-timer">
                    ⏱️ {t('loginScreen.otpExpiresIn')} {formatTimer(otpTimer)}
                  </span>
                ) : (
                  <span className="otp-expired">
                    ⚠️ {t('loginScreen.otpExpired')}
                  </span>
                )}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading || otpDigits.join('').length !== 6}
                className="login-btn"
              >
                {loading ? t('loginScreen.verifying') : t('loginScreen.verifyLogin')}
              </button>

              {/* Resend OTP */}
              <div className="resend-row">
                {canResend ? (
                  <button onClick={resendOtp} className="resend-btn">
                    🔄 {t('loginScreen.resendOtp')}
                  </button>
                ) : otpTimer > 0 ? (
                  <span className="resend-wait">
                    {t('loginScreen.resendIn')} {formatTimer(otpTimer)}
                  </span>
                ) : null}
              </div>

              {/* Back to phone */}
              <p className="back-to-phone" onClick={() => { setStep("phone"); setError(""); }}>
                ← {t('loginScreen.changeNumber')}
              </p>
            </>
          )}

          {/* Voice Controls */}
          <div className="voice-controls">
            <button onClick={replayAudio} className="voice-btn" title={t('loginScreen.replayAudio')}>
              🔊 {t('loginScreen.replayAudio')}
            </button>
            <label className="auto-play-toggle">
              <input
                type="checkbox"
                checked={autoPlayVoice}
                onChange={(e) => setAutoPlayVoice(e.target.checked)}
              />
              <span>{t('loginScreen.autoPlayVoice')}</span>
            </label>
          </div>

          {/* SKIP */}
          <p className="skip" onClick={onSkip}>
            {t('loginScreen.skipLogin')}
          </p>

          {/* FIREBASE CAPTCHA */}
          <div id="recaptcha-container"></div>

        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
