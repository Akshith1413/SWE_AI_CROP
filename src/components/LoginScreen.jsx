// Handles user authentication via phone number and OTP using Firebase.
// Includes a skip option to bypass login.
import { useState, useEffect } from "react";
import "./LoginScreen.css";

import { speak } from "../utils/voice";

import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

function LoginScreen({ onLogin, onSkip }) {

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");

  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  const [voiceEnabled, setVoiceEnabled] = useState(false);


  /* 🔊 Enable Voice After First Click */
  useEffect(() => {

    const enableVoice = () => {
      speak("Welcome to CropAid. Please enter your mobile number.");
      setVoiceEnabled(true);

      document.removeEventListener("click", enableVoice);
    };

    document.addEventListener("click", enableVoice);

    return () => {
      document.removeEventListener("click", enableVoice);
    };

  }, []);


  // Send OTP
  const sendOtp = async () => {

    if (phone.length !== 10) {
      if (voiceEnabled) {
        speak("Please enter a valid ten digit number.");
      }

      alert("Please enter valid 10-digit number");
      return;
    }

    try {
      setLoading(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
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

      if (voiceEnabled) {
        speak("OTP has been sent. Please enter the code.");
      }

    } catch (err) {
      console.error("OTP Error:", err);

      if (voiceEnabled) {
        speak("Failed to send OTP. Please try again.");
      }

      alert("Failed to send OTP. Try again later.");
    }

    setLoading(false);
  };


  // Verify OTP
  const verifyOtp = async () => {

    if (!confirmation) {

      if (voiceEnabled) {
        speak("Please request OTP first.");
      }

      alert("Please request OTP first");
      return;
    }

    try {
      setLoading(true);

      await confirmation.confirm(otp);

      if (voiceEnabled) {
        speak("Login successful. Welcome to CropAid.");
      }

      alert("Login successful!");

      onLogin();

    } catch (err) {
      console.error("Verify Error:", err);

      if (voiceEnabled) {
        speak("Incorrect OTP. Please try again.");
      }

      alert("Incorrect OTP");
    }

    setLoading(false);
  };


  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>CropAid 🌾</h1>

        <p>
          Smart Crop Diagnosis & Farmer Support Platform.
          <br /><br />
          Get expert help, insights, and grow better.
        </p>
      </div>


      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <h2>Farmer Login</h2>


          {/* PHONE INPUT */}
          {step === "phone" && (
            <>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                value={phone}
                maxLength="10"
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />

              <button
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}


          {/* OTP INPUT */}
          {step === "otp" && (
            <>
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </>
          )}


          {/* SKIP */}
          <p className="skip" onClick={onSkip}>
            Skip Login →
          </p>


          {/* FIREBASE CAPTCHA */}
          <div id="recaptcha-container"></div>

        </div>

      </div>

    </div>
  );
}

export default LoginScreen;
