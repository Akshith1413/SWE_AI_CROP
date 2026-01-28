import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera, Upload, Video, Mic, X, Check, AlertCircle, RefreshCw,
  Image as ImageIcon, Wifi, WifiOff, Info, Sun, Moon, Focus,
  Smartphone, ZoomIn, AlertTriangle, CheckCircle, Lightbulb,
  Grid3x3, Volume2, ChevronRight, Target, Leaf, Thermometer,
  Zap, Shield, RotateCcw, Maximize2, Minus, Plus, CameraOff,
  Settings, Crop, Droplets, Wind, Cloud, Sparkles, Scan,
  BarChart3, Filter, Image, HelpCircle, ChevronDown, ChevronUp,
  Download, Save, ShieldAlert, ThermometerSun, Waves, Bug,
  Flower2, Sprout, Trees, Globe, MapPin, Clock, Battery,
  Circle, Square, Triangle, Octagon, Crosshair, Eye, EyeOff,
  Play, Square as SquareIcon, Circle as CircleIcon,
  Music, MessageSquare, Headphones, Ear, VolumeX,
  Bell, BellOff, PhoneCall, PhoneOff, Radio,
  FileText, BookOpen, ShieldCheck, Wifi as WifiIcon,
  CloudRain, CloudSnow, Wind as WindIcon, Sunrise,
  Droplet, Thermometer as ThermometerIcon, UserCheck,
  BellRing, BatteryCharging, Layers, Activity
} from 'lucide-react';
import LandingPage from './LandingPage';
import ConsentScreen from './ConsentScreen';
import { cropService } from '../services/cropService';
import { consentService } from '../services/consentService';

const CropDiagnosisApp = () => {
  const [appState, setAppState] = useState('loading'); // loading, landing, consent, app
  const [view, setView] = useState('home');
  const [capturedImages, setCapturedImages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
  });

  useEffect(() => {
    const initApp = () => {
      const hasConsent = consentService.hasConsent();
      if (hasConsent) {
        setAppState('app');
      } else {
        setAppState('landing');
      }
    };
    initApp();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    testCameraCapabilities();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const testCameraCapabilities = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log(`Camera test: ${videoDevices.length} camera(s) detected`);
    } catch (err) {
      console.log('Camera enumeration not supported');
    }
  };

  const addToOfflineQueue = (data) => {
    setOfflineQueue(prev => [...prev, data]);
  };

  const handleGuestContinue = () => {
    consentService.setGuestMode(true);
    setAppState('consent');
  };

  const handleLogin = () => {
    // Simulate login for now
    consentService.setGuestMode(false);
    setAppState('consent');
  };

  const handleConsentGiven = () => {
    consentService.giveConsent();
    setAppState('app');
  };

  if (appState === 'loading') return <div className="min-h-screen bg-nature-50 flex items-center justify-center"><RefreshCw className="animate-spin text-nature-600" /></div>;
  if (appState === 'landing') return <LandingPage onGuest={handleGuestContinue} onLogin={handleLogin} />;
  if (appState === 'consent') return <ConsentScreen onConsent={handleConsentGiven} />;

  return (
    <div className="min-h-screen bg-nature-50">
      {view === 'home' && (
        <HomeView
          setView={setView}
          capturedImages={capturedImages}
          offlineQueue={offlineQueue}
          isOnline={isOnline}
          setShowTutorial={setShowTutorial}
          deviceInfo={deviceInfo}
        />
      )}
      {view === 'camera' && (
        <EnhancedCompleteCameraCapture
          setView={setView}
          setCapturedImages={setCapturedImages}
          isOnline={isOnline}
          addToOfflineQueue={addToOfflineQueue}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          deviceInfo={deviceInfo}
        />
      )}
      {view === 'upload' && (
        <MultiImageUpload
          setView={setView}
          setCapturedImages={setCapturedImages}
          isOnline={isOnline}
          addToOfflineQueue={addToOfflineQueue}
        />
      )}
      {view === 'video' && (
        <VideoRecorder
          setView={setView}
          isOnline={isOnline}
          addToOfflineQueue={addToOfflineQueue}
        />
      )}
      {view === 'voice' && (
        <VoiceInput
          setView={setView}
          isOnline={isOnline}
        />
      )}
      {view === 'analysis' && (
        <ImageAnalysis
          setView={setView}
          capturedImages={capturedImages}
        />
      )}
    </div>
  );
};

const HomeView = ({ setView, isOnline, capturedImages, setShowTutorial }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-lg flex flex-col items-center mt-6 mb-8">
        <Camera className="w-8 h-8 text-white mb-4" />
        <h1 className="text-3xl font-bold mb-2">AI Crop Diagnosis</h1>
        <p className="text-gray-400 text-sm">Smart Disease Detection</p>
      </header>

      {/* Connection Status */}
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-white/10 rounded-xl mb-2">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Wifi className="w-4 h-4" />
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-lg mb-12">
        <button
          onClick={() => {
            setShowTutorial(true);
            setView('camera');
          }}
          className="col-span-1 bg-[#242424] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-[#2a2a2a] transition relative group"
        >
          <div className="absolute top-2 left-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">New</div>
          <Camera className="w-6 h-6 text-white group-hover:scale-110 transition" />
          <span className="text-xs font-medium text-center">Smart Camera</span>
          <span className="text-[10px] text-gray-500 text-center leading-tight">AI-guided photo capture</span>
        </button>

        <button
          onClick={() => setView('upload')}
          className="col-span-1 bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#242424] transition"
        >
          <Upload className="w-6 h-6 text-white" />
          <span className="text-xs font-medium text-center">Upload</span>
          <span className="text-[10px] text-gray-500 text-center leading-tight">Select from gallery</span>
        </button>

        <button
          onClick={() => setView('video')}
          className="col-span-1 bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#242424] transition"
        >
          <Video className="w-6 h-6 text-white" />
          <span className="text-xs font-medium text-center">Record Video</span>
          <span className="text-[10px] text-gray-500 text-center leading-tight">Show plant condition</span>
        </button>

        <button
          onClick={() => setView('voice')}
          className="col-span-1 bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#242424] transition"
        >
          <Mic className="w-6 h-6 text-white" />
          <span className="text-xs font-medium text-center">Voice Input</span>
          <span className="text-[10px] text-gray-500 text-center leading-tight">Describe symptoms</span>
        </button>
      </div>

      {/* Features List */}
      <div className="w-full max-w-lg text-center mb-12">
        <Lightbulb className="w-5 h-5 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-6">Smart Camera Features</h3>
        <ul className="space-y-4 text-sm text-gray-400 text-left pl-8">
          <li className="flex items-center gap-3">
            <Focus className="w-5 h-5 text-gray-300" />
            <span>Real-time Quality Analysis - <span className="text-gray-500">Checks for blur, darkness, and focus</span></span>
          </li>
          <li className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-300" />
            <span>Voice Guidance - <span className="text-gray-500">Audio instructions for perfect photos</span></span>
          </li>
          <li className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-300" />
            <span>Instant Warnings - <span className="text-gray-500">Alerts for poor lighting or blur</span></span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-gray-300" />
            <span>Device Optimization - <span className="text-gray-500">Works on all phone models</span></span>
          </li>
        </ul>
      </div>

      {/* Compatibility Test */}
      <div className="w-full max-w-lg text-center mb-8">
        <Camera className="w-5 h-5 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-4">Camera Compatibility Test</h3>
        <button
          onClick={() => setView('camera')}
          className="bg-[#242424] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition"
        >
          Test Now
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center max-w-xs">
        Test your camera with our AI guidance system. We'll help you take perfect crop photos!
      </p>
    </div>
  );
};

const EnhancedCompleteCameraCapture = ({
  setView,
  setCapturedImages,
  isOnline,
  addToOfflineQueue,
  showTutorial,
  setShowTutorial,
  deviceInfo
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const voiceTimeoutRef = useRef(null);
  const warningSoundRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [qualityWarning, setQualityWarning] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [liveQuality, setLiveQuality] = useState({
    brightness: 0,
    blur: 0,
    contrast: 0,
    sharpness: 0,
    status: 'checking',
    score: 0,
    message: '',
    issues: []
  });
  const [showGrid, setShowGrid] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(null);
  const [showDetailedTips, setShowDetailedTips] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [flashMode, setFlashMode] = useState('off');
  const [captureCountdown, setCaptureCountdown] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentStep, setCurrentStep] = useState('camera'); // 'camera', 'preparation', 'analysis'
  const [cropType, setCropType] = useState('');
  const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [voiceInstructions, setVoiceInstructions] = useState(true);
  const [cameraSupported, setCameraSupported] = useState(true);
  const [photoTipsShown, setPhotoTipsShown] = useState(false);
  const [qualityHistory, setQualityHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showSaveConsent, setShowSaveConsent] = useState(false);

  // Initialize camera immediately
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      speechSynthesis.cancel();
    };
  }, [cameraFacing]);

  // Live analysis
  useEffect(() => {
    if (stream && videoRef.current && !capturedPhoto && cameraReady) {
      const analyzeFrame = () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          performLiveAnalysis();
        }
        animationRef.current = requestAnimationFrame(analyzeFrame);
      };

      animationRef.current = requestAnimationFrame(analyzeFrame);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [stream, capturedPhoto, cameraReady]);

  // Tutorial timeout
  useEffect(() => {
    if (showTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(false);
        // Show photo tips after tutorial
        setTimeout(() => {
          if (!photoTipsShown) {
            showPhotoGuidanceTips();
            setPhotoTipsShown(true);
          }
        }, 1000);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  // Voice guidance with delay to avoid spam
  useEffect(() => {
    if (voiceInstructions && liveQuality.message && voiceGuidance !== liveQuality.message && !isSpeaking) {
      voiceTimeoutRef.current = setTimeout(() => {
        speakGuidance(liveQuality.message);
        setVoiceGuidance(liveQuality.message);
      }, 2000); // 2 second delay between voice messages
    }

    return () => {
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    };
  }, [liveQuality.message, voiceInstructions, isSpeaking]);

  // NEW: Check for quality issues and show warnings separately
  useEffect(() => {
    if (cameraReady && liveQuality.status !== 'good' && liveQuality.score < 70) {
      // Show warning alert
      setShowWarningAlert(true);
      setWarningMessage(liveQuality.message);

      // Speak warning if voice is enabled
      if (voiceInstructions && !isSpeaking) {
        const warningText = `Warning: ${liveQuality.message}`;
        speakWarning(warningText);
      }
    } else {
      setShowWarningAlert(false);
    }
  }, [liveQuality.status, liveQuality.message, liveQuality.score, cameraReady]);

  // Track quality history for improvement validation
  useEffect(() => {
    if (liveQuality.score > 0) {
      setQualityHistory(prev => {
        const newHistory = [...prev, {
          score: liveQuality.score,
          timestamp: Date.now(),
          issues: liveQuality.issues
        }].slice(-10); // Keep last 10 measurements
        return newHistory;
      });
    }
  }, [liveQuality.score]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        }
      };

      // Adjust constraints based on device
      if (deviceInfo.isMobile) {
        if (deviceInfo.isIOS) {
          constraints.video.width = { ideal: 1280 };
          constraints.video.height = { ideal: 720 };
        }
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          if (voiceInstructions) {
            speakGuidance("Camera ready. Please aim at the plant for analysis.");
          }
          // Show initial photo tips
          if (!photoTipsShown) {
            setTimeout(() => {
              showPhotoGuidanceTips();
              setPhotoTipsShown(true);
            }, 1000);
          }
        };
      }
      setStream(mediaStream);
      setCameraSupported(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraSupported(false);
      showCameraError();
    }
  };

  const showCameraError = () => {
    if (voiceInstructions) {
      speakGuidance("Unable to access camera. Please check permissions and try again.");
    }
    alert('Unable to access camera. Please check permissions and try again.');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    if (voiceInstructions) {
      speakGuidance(`Switching to ${cameraFacing === 'environment' ? 'front' : 'rear'} camera`);
    }
  };

  const performLiveAnalysis = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Brightness calculation
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness /= (data.length / 4);

    // Advanced blur detection using Laplacian variance
    let blurScore = 0;
    let laplacianSum = 0;
    let pixelCount = 0;

    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4;
        const topIdx = ((y - 1) * canvas.width + x) * 4;
        const bottomIdx = ((y + 1) * canvas.width + x) * 4;
        const leftIdx = (y * canvas.width + (x - 1)) * 4;
        const rightIdx = (y * canvas.width + (x + 1)) * 4;

        const centerBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const topBrightness = (data[topIdx] + data[topIdx + 1] + data[topIdx + 2]) / 3;
        const bottomBrightness = (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3;
        const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3;
        const rightBrightness = (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3;

        // Laplacian approximation
        const laplacian = Math.abs(4 * centerBrightness - (topBrightness + bottomBrightness + leftBrightness + rightBrightness));
        laplacianSum += laplacian;
        pixelCount++;

        // Edge strength for blur detection
        const edgeStrength = Math.abs(centerBrightness - leftBrightness) + Math.abs(centerBrightness - rightBrightness);
        blurScore += edgeStrength;
      }
    }

    const laplacianVariance = laplacianSum / pixelCount;
    blurScore /= pixelCount;

    // Contrast calculation
    let contrast = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      contrast += Math.abs(pixelBrightness - brightness);
    }
    contrast /= (data.length / 4);

    // Sharpness (based on edge strength)
    const sharpness = laplacianVariance;

    // Determine status with multiple thresholds
    let status = 'good';
    let message = 'Perfect! Ready to capture';
    let icon = '✓';
    let score = 100;
    let issues = [];

    // Check for darkness
    if (brightness < 40) {
      status = 'dark';
      message = 'Too dark - Move to brighter area or use flash';
      icon = '🌙';
      score = 20;
      issues.push('Severe darkness');
    } else if (brightness < 60) {
      status = 'dark';
      message = 'Low light - Move to brighter area';
      icon = '🌙';
      score = 40;
      issues.push('Low light');
    }

    // Check for brightness
    if (brightness > 240) {
      status = 'bright';
      message = 'Too bright - Avoid direct sunlight';
      icon = '☀️';
      score = 30;
      issues.push('Severe overexposure');
    } else if (brightness > 200) {
      status = 'bright';
      message = 'Very bright - Reduce lighting';
      icon = '☀️';
      score = 50;
      issues.push('Overexposure');
    }

    // Check for blur using advanced detection
    if (laplacianVariance < 50) {
      status = 'blur';
      message = 'Very blurry - Hold phone steady';
      icon = '🌀';
      score = Math.min(score, 25);
      issues.push('Severe blur');
    } else if (laplacianVariance < 100) {
      status = 'blur';
      message = 'Image blurry - Hold phone steady';
      icon = '🌀';
      score = Math.min(score, 40);
      issues.push('Blur detected');
    }

    // Check for low contrast
    if (contrast < 15) {
      status = 'low-contrast';
      message = 'Low contrast - Adjust lighting';
      icon = '⚫';
      score = Math.min(score, 50);
      issues.push('Low contrast');
    }

    // Plant detection
    let greenPixelCount = 0;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (g > r * 1.2 && g > b * 1.2 && g > 50) {
        greenPixelCount++;
      }
    }
    const greenPercentage = (greenPixelCount / (data.length / 16)) * 100;
    const plantDetected = greenPercentage > 5;

    if (!plantDetected && status === 'good') {
      message = 'Aim at plant for best results';
      score = 60;
    }

    // Update detection
    setDetectedObjects(plantDetected ? [{ class: 'plant', score: greenPercentage / 100 }] : []);

    setLiveQuality({
      brightness: Math.round(brightness),
      blur: Math.round(blurScore * 100) / 100,
      contrast: Math.round(contrast),
      sharpness: Math.round(sharpness),
      status,
      message: plantDetected ? message : 'Aim at plant',
      icon,
      score,
      issues
    });
  };

  const showPhotoGuidanceTips = () => {
    const tips = [
      "For best results, ensure good lighting",
      "Hold your phone steady to avoid blur",
      "Fill the frame with the affected leaf",
      "Avoid shadows on the plant surface",
      "Keep 15-20 cm distance from the plant"
    ];

    // Show visual tips
    setShowDetailedTips(true);

    // Speak first tip
    if (voiceInstructions) {
      speakGuidance("Here are some photo tips: " + tips[0]);
    }

    // Auto-hide tips after 10 seconds
    setTimeout(() => {
      setShowDetailedTips(false);
    }, 10000);
  };

  const validateImageQuality = () => {
    const issues = [];

    if (liveQuality.brightness < 60) {
      issues.push({
        type: 'darkness',
        severity: liveQuality.brightness < 40 ? 'severe' : 'warning',
        message: liveQuality.brightness < 40 ? 'Image is too dark' : 'Image is somewhat dark',
        suggestion: 'Move to brighter area or use flash'
      });
    }

    if (liveQuality.brightness > 220) {
      issues.push({
        type: 'brightness',
        severity: 'warning',
        message: 'Image is too bright',
        suggestion: 'Avoid direct sunlight'
      });
    }

    if (liveQuality.sharpness < 100) {
      issues.push({
        type: 'blur',
        severity: liveQuality.sharpness < 50 ? 'severe' : 'warning',
        message: liveQuality.sharpness < 50 ? 'Image is very blurry' : 'Image is slightly blurry',
        suggestion: 'Hold phone steady or use support'
      });
    }

    if (liveQuality.contrast < 20) {
      issues.push({
        type: 'contrast',
        severity: 'warning',
        message: 'Low contrast detected',
        suggestion: 'Adjust lighting conditions'
      });
    }

    if (detectedObjects.length === 0) {
      issues.push({
        type: 'subject',
        severity: 'warning',
        message: 'No plant detected',
        suggestion: 'Aim camera at plant or leaf'
      });
    }

    return issues;
  };

  // NEW: Separate function to speak warnings
  const speakWarning = (message) => {
    if ('speechSynthesis' in window && voiceInstructions && !isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const capturePhoto = () => {
    // Start countdown immediately - no blocking quality checks
    setCaptureCountdown(3);

    if (voiceInstructions) {
      speakGuidance("Starting countdown. Get ready... 3... 2... 1...");
    }

    const countdown = setInterval(() => {
      setCaptureCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          performCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Apply enhancements
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Increase contrast and brightness if needed
      const enhancementFactor = liveQuality.brightness < 100 ? 1.2 : 1.1;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * enhancementFactor);     // R
        data[i + 1] = Math.min(255, data[i + 1] * enhancementFactor); // G
        data[i + 2] = Math.min(255, data[i + 2] * enhancementFactor); // B
      }

      ctx.putImageData(imageData, 0, 0);

      const photoData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedPhoto(photoData);

      // Perform analysis
      const analysis = performDetailedAnalysis(ctx, canvas.width, canvas.height);
      setAnalysisResult(analysis);

      // Stop camera
      stopCamera();

      // Show confirmation
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);

      // Speak confirmation
      if (voiceInstructions) {
        const qualityMessage = liveQuality.score >= 80 ? "Excellent quality!" :
          liveQuality.score >= 60 ? "Good quality." : "Acceptable quality.";
        speakGuidance(`Photo captured successfully. ${qualityMessage} Health score is ${analysis.healthScore} percent.`);
      }

      // Move to preparation step after delay
      setTimeout(() => {
        setCurrentStep('preparation');
      }, 3000);
    }
  };

  const performDetailedAnalysis = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let greenPixelCount = 0;
    let brownPixelCount = 0;
    let yellowPixelCount = 0;
    let whitePixelCount = 0;
    let blackPixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detect plant health colors
      if (g > r * 1.3 && g > b * 1.3 && g > 100) {
        greenPixelCount++; // Healthy green
      } else if (r > g * 1.2 && r > b * 1.2 && r > 150 && g < 200) {
        brownPixelCount++; // Browning
      } else if (r > 180 && g > 180 && b < 120 && r < 240) {
        yellowPixelCount++; // Yellowing
      } else if (r > 200 && g > 200 && b > 200) {
        whitePixelCount++; // Fungal/mildew
      } else if (r < 50 && g < 50 && b < 50) {
        blackPixelCount++; // Necrosis
      }
    }

    const totalPixels = data.length / 4;
    const greenPercentage = (greenPixelCount / totalPixels) * 100;
    const brownPercentage = (brownPixelCount / totalPixels) * 100;
    const yellowPercentage = (yellowPixelCount / totalPixels) * 100;
    const diseasePercentage = ((whitePixelCount + blackPixelCount) / totalPixels) * 100;

    // Calculate health score
    let healthScore = 100;
    healthScore -= brownPercentage * 1.5;
    healthScore -= yellowPercentage * 1.2;
    healthScore -= diseasePercentage * 2;
    healthScore = Math.max(0, Math.round(healthScore));

    // Determine likely issues
    const issues = [];
    if (brownPercentage > 5) issues.push('Leaf browning detected');
    if (yellowPercentage > 5) issues.push('Yellowing observed');
    if (diseasePercentage > 2) issues.push('Possible disease spots');
    if (greenPercentage < 20) issues.push('Low healthy green area');

    const recommendations = [
      healthScore < 50 ? 'Immediate treatment recommended' : 'Monitor regularly',
      brownPercentage > 10 ? 'Check for fungal infections' : null,
      yellowPercentage > 10 ? 'Check nutrient levels' : null,
      diseasePercentage > 5 ? 'Consider fungicide treatment' : null,
      'Compare with previous captures'
    ].filter(Boolean);

    return {
      healthScore,
      greenPercentage: Math.round(greenPercentage),
      brownPercentage: Math.round(brownPercentage),
      yellowPercentage: Math.round(yellowPercentage),
      diseasePercentage: Math.round(diseasePercentage),
      spotDensity: Math.round(Math.random() * 10),
      issues,
      recommendations,
      timestamp: new Date().toISOString(),
      qualityScore: liveQuality.score
    };
  };

  const saveCapture = () => {
    setShowSaveConsent(true);
  };

  const confirmSave = () => {
    if (capturedPhoto && analysisResult) {
      const captureData = {
        data: capturedPhoto,
        analysis: analysisResult,
        metadata: {
          cropType,
          diseaseSymptoms,
          environmentalData,
          qualityScore: liveQuality.score,
          qualityIssues: liveQuality.issues,
          deviceInfo,
          timestamp: Date.now(),
          qualityHistory: qualityHistory.slice(-5) // Last 5 quality measurements
        }
      };

      setCapturedImages(prev => [...prev, captureData]);

      if (!isOnline) {
        addToOfflineQueue(captureData);
      }

      setCurrentStep('analysis');
      setShowAnalysis(true);
      setShowSaveConsent(false);

      if (voiceInstructions) {
        speakGuidance("Capture saved successfully. Viewing analysis results.");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysisResult(null);
    setQualityWarning(null);
    setShowWarningAlert(false);
    setCurrentStep('camera');
    setCaptureCountdown(null);
    startCamera();

    if (voiceInstructions) {
      speakGuidance("Retaking photo. Please position your camera.");
    }
  };

  const getQualityColor = () => {
    switch (liveQuality.status) {
      case 'good': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'dark': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'bright': return 'bg-gradient-to-r from-orange-500 to-yellow-600';
      case 'blur': return 'bg-gradient-to-r from-red-500 to-orange-600';
      case 'low-contrast': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };

  const getQualityScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const speakGuidance = (message) => {
    if ('speechSynthesis' in window && voiceInstructions) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceInstructions = () => {
    setVoiceInstructions(!voiceInstructions);
    if (!voiceInstructions) {
      speakGuidance("Voice instructions enabled");
    }
  };

  const getEnvironmentalData = () => {
    // Simulate environmental data
    const mockData = {
      temperature: Math.floor(Math.random() * 15) + 20,
      humidity: Math.floor(Math.random() * 40) + 40,
      soilMoisture: Math.floor(Math.random() * 50) + 30,
      lightLevel: Math.floor(Math.random() * 60) + 40,
      location: 'Field A',
      time: new Date().toLocaleTimeString(),
      weather: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)]
    };
    setEnvironmentalData(mockData);

    if (voiceInstructions) {
      speakGuidance(`Environmental data collected. Temperature is ${mockData.temperature} degrees, humidity ${mockData.humidity} percent.`);
    }
  };

  // NEW: Function to show warning button
  const showWarningButton = () => {
    if (qualityWarning) {
      return (
        <button
          onClick={() => setQualityWarning(null)}
          className="absolute top-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse"
        >
          <AlertTriangle className="w-5 h-5" />
          Quality Issues
        </button>
      );
    }
    return null;
  };

  // Render based on current step
  if (currentStep === 'camera') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col">
        {/* Camera Unsupported Message */}
        {!cameraSupported && (
          <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Camera Not Available</h2>
                  <p className="text-sm text-gray-600">Unable to access camera on this device</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <CameraOff className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">Check Permissions</p>
                    <p className="text-xs text-red-700">Allow camera access in browser settings</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Device Support</p>
                    <p className="text-xs text-blue-700">Ensure your device has a working camera</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView('home')}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={startCamera}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Smart Camera Guide</h2>
                  <p className="text-sm text-gray-600">AI-powered assistance for perfect photos</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 text-sm">Auto Leaf Detection</p>
                    <p className="text-xs text-green-700">Green frame appears when leaf is detected</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Quality Meter</p>
                    <p className="text-xs text-blue-700">Real-time quality score and feedback</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Volume2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900 text-sm">Voice Guidance</p>
                    <p className="text-xs text-purple-700">Audio prompts for perfect capture</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 text-sm">Quality Warnings</p>
                    <p className="text-xs text-yellow-700">Alerts for blur, darkness, and other issues</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowTutorial(false)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Start Smart Camera
              </button>
            </div>
          </div>
        )}

        {/* Countdown Overlay */}
        {captureCountdown && (
          <div className="absolute inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-8xl font-bold animate-pulse mb-4">{captureCountdown}</div>
              <p className="text-xl opacity-80">Get ready...</p>
            </div>
          </div>
        )}

        {/* Warning Alert Button (Separate from capture) */}
        {showWarningAlert && (
          <button
            onClick={() => {
              // Show detailed warning modal
              const qualityIssues = validateImageQuality();
              setQualityWarning({
                type: 'warning',
                issues: qualityIssues.map(issue => ({
                  icon: issue.type === 'darkness' ? Moon :
                    issue.type === 'blur' ? Focus :
                      issue.type === 'brightness' ? Sun : AlertCircle,
                  text: issue.message,
                  color: issue.severity === 'severe' ? 'red' : 'yellow',
                  suggestion: issue.suggestion
                })),
                message: 'Photo quality issues detected',
                score: liveQuality.score
              });
            }}
            className="absolute top-20 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 animate-pulse shadow-2xl"
          >
            <AlertTriangle className="w-5 h-5" />
            Quality Warning
          </button>
        )}

        {/* Quality Warning Modal (Only shown when warning button is clicked) */}
        {qualityWarning && (
          <div className="absolute inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-fade-in">
              <div className={`flex items-center justify-between ${qualityWarning.type === 'severe' ? 'text-red-600' : 'text-yellow-600'}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {qualityWarning.type === 'severe' ? '⚠️ Poor Quality Detected' : '⚠️ Quality Warning'}
                    </h3>
                    <div className={`text-sm font-bold ${getQualityScoreColor(qualityWarning.score)}`}>
                      Quality Score: {qualityWarning.score}%
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setQualityWarning(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                {qualityWarning.issues.map((issue, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${issue.color === 'red' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                    <issue.icon className={`w-5 h-5 ${issue.color === 'red' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <span className={`text-sm font-medium ${issue.color === 'red' ? 'text-red-800' : 'text-yellow-800'}`}>
                        {issue.text}
                      </span>
                      {issue.suggestion && (
                        <p className={`text-xs mt-1 ${issue.color === 'red' ? 'text-red-700' : 'text-yellow-700'}`}>
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-gray-700 text-sm">
                {qualityWarning.message} You can still capture photos, but quality may be affected.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setQualityWarning(null)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => {
                    if (voiceInstructions) {
                      const warningDetails = qualityWarning.issues.map(issue => issue.text).join('. ');
                      speakWarning(`Quality warning details: ${warningDetails}. Suggestions: ${qualityWarning.issues.map(issue => issue.suggestion).join('. ')}`);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Hear Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative z-10 bg-gradient-to-b from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-white font-medium bg-black bg-opacity-50 px-4 py-2 rounded-full hover:bg-opacity-70 transition backdrop-blur-sm"
            >
              <X className="w-5 h-5" /> Back
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-full transition backdrop-blur-sm ${showGrid ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'
                  }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>

              <button
                onClick={switchCamera}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition backdrop-blur-sm"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleVoiceInstructions}
                className={`p-2 rounded-full transition backdrop-blur-sm ${voiceInstructions ? 'bg-green-500 text-white' : 'bg-black bg-opacity-50 text-white'
                  }`}
              >
                {voiceInstructions ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowDetailedTips(!showDetailedTips)}
                className={`p-2 rounded-full transition backdrop-blur-sm ${showDetailedTips ? 'bg-blue-500 text-white' : 'bg-black bg-opacity-50 text-white'
                  }`}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          {!capturedPhoto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
              />

              {/* Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white border-opacity-20"></div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white border-opacity-30 rounded-lg"></div>
                </div>
              )}

              {/* Smart Focus Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12" style={{ zIndex: 15 }}>
                <div className="relative w-full max-w-md aspect-square">
                  {detectedObjects.length > 0 ? (
                    <>
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-lg animate-pulse"></div>
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-lg animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-lg animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-lg animate-pulse"></div>
                      <div className="absolute inset-0 border-2 border-green-500 border-opacity-50 rounded-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Plant Detected
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
                      <div className="absolute inset-0 border-2 border-red-500 border-opacity-30 border-dashed rounded-lg"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Aim at Plant
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Live Quality Banner */}
              {cameraReady && (
                <div className="absolute top-20 left-4 right-4 z-20">
                  <div className={`${getQualityColor()} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-90`}>
                    <div className="flex-shrink-0">
                      {liveQuality.status === 'good' ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <AlertTriangle className="w-7 h-7 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{liveQuality.icon} {liveQuality.message}</p>
                        <span className={`text-lg font-bold ${getQualityScoreColor(liveQuality.score)}`}>
                          {liveQuality.score}%
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs opacity-90">
                        <div className="flex items-center gap-1">
                          <Sun className="w-3 h-3" />
                          <span>Light: {liveQuality.brightness}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Focus className="w-3 h-3" />
                          <span>Sharp: {liveQuality.sharpness}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Contrast: {liveQuality.contrast}</span>
                        </div>
                      </div>
                    </div>
                    {liveQuality.status !== 'good' && voiceInstructions && (
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    )}
                  </div>
                </div>
              )}

              {/* Quality Issues List */}
              {liveQuality.issues.length > 0 && (
                <div className="absolute top-36 left-4 right-4 z-20">
                  <div className="bg-red-500 bg-opacity-90 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-bold text-sm">Quality Issues:</span>
                    </div>
                    <p className="text-xs">{liveQuality.issues.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 rounded-xl p-2 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.1))}
                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <div className="text-white text-xs font-bold">{zoomLevel.toFixed(1)}x</div>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.1))}
                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detailed Tips Panel */}
              {showDetailedTips && (
                <div className="absolute bottom-24 left-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-xl backdrop-blur-sm z-20">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Photo Tips for Best Results
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Sun className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Use natural daylight</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Focus className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>Hold phone steady</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Fill frame with leaf</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Avoid shadows</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ThermometerIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Check temperature</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Droplet className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>Morning is best</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Device Optimization Banner */}
              <div className="absolute bottom-36 left-4 right-4 z-20">
                <div className="bg-blue-500 bg-opacity-80 text-white px-4 py-2 rounded-xl backdrop-blur-sm text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Optimized for {deviceInfo.isMobile ? `${deviceInfo.isIOS ? 'iPhone' : 'Android'}` : 'your device'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <img src={capturedPhoto} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Success Confirmation */}
        {showConfirmation && !qualityWarning && (
          <div className="absolute top-20 left-4 right-4 z-30 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down">
            <CheckCircle className="w-6 h-6" />
            <div className="flex-1">
              <p className="font-bold">Photo captured successfully!</p>
              <p className="text-xs opacity-90">
                Quality: {liveQuality.score}% | Plants: {detectedObjects.length} |
                {liveQuality.score >= 80 ? ' Excellent!' : liveQuality.score >= 60 ? ' Good!' : ' Acceptable'}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="relative z-10 bg-gradient-to-t from-black to-transparent p-6 pb-8">
          {!capturedPhoto ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    if (voiceInstructions) speakGuidance("Zoom reset");
                  }}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full backdrop-blur-sm hover:bg-opacity-70 transition"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>

                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all transform shadow-2xl ${detectedObjects.length > 0 && liveQuality.score >= 60
                    ? 'border-green-500 bg-green-500 hover:scale-110'
                    : 'border-white bg-black bg-opacity-50'
                    } ${(!cameraReady) && 'opacity-50'}`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${detectedObjects.length > 0 && liveQuality.score >= 60 ? 'bg-white' : 'bg-white bg-opacity-20'
                    }`}>
                    <Camera className={`w-10 h-10 ${detectedObjects.length > 0 && liveQuality.score >= 60 ? 'text-green-500' : 'text-white'
                      }`} />
                  </div>
                  {detectedObjects.length > 0 && liveQuality.score >= 60 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                  {liveQuality.score < 60 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-2 shadow-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setFlashMode(prev => prev === 'off' ? 'on' : 'off');
                    if (voiceInstructions) speakGuidance(`Flash ${flashMode === 'off' ? 'enabled' : 'disabled'}`);
                  }}
                  className={`p-3 rounded-full backdrop-blur-sm transition ${flashMode === 'on'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                    }`}
                >
                  <Zap className="w-6 h-6" />
                </button>
              </div>

              <div className="text-white text-center space-y-1">
                <p className="text-sm opacity-75">
                  {cameraReady ? (
                    detectedObjects.length > 0 ? (
                      liveQuality.status === 'good' ? (
                        <span className="text-green-300 font-semibold">✓ Ready to capture!</span>
                      ) : (
                        <span className="text-yellow-300 font-semibold">⚠️ {liveQuality.message}</span>
                      )
                    ) : (
                      <span className="text-red-300 font-semibold">⚠️ Aim at plant</span>
                    )
                  ) : (
                    'Initializing camera...'
                  )}
                </p>
                <p className="text-xs opacity-60">
                  {detectedObjects.length > 0 ? 'Plant detected' : 'No plant detected'} • Quality: {liveQuality.score}%
                </p>
                {qualityHistory.length > 1 && (
                  <p className="text-xs opacity-60">
                    Quality trend: {qualityHistory[qualityHistory.length - 1].score > qualityHistory[0].score ? 'Improving' : 'Stable'}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="flex-1 bg-gray-600 bg-opacity-90 backdrop-blur-sm text-white py-4 rounded-xl font-bold hover:bg-opacity-100 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-6 h-6" />
                Retake
              </button>
              <button
                onClick={() => setCurrentStep('preparation')}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 backdrop-blur-sm text-white py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" />
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'preparation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Retake</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Capture Details</h1>
            <button
              onClick={saveCapture}
              className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              <Check className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">

            {/* Save Consent Modal */}
            {showSaveConsent && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in border border-zinc-100">
                  <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Save to Account?</h3>
                  <p className="text-center text-gray-500 text-sm mb-6">
                    This will securely store the diagnosis in your personal history for future reference.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={confirmSave}
                      className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Yes, Save It
                    </button>
                    <button
                      onClick={() => setShowSaveConsent(false)}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {/* Captured Image Preview */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                  <h3 className="font-bold text-gray-800">Captured Image</h3>
                  <div className="ml-auto flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${liveQuality.score >= 80 ? 'bg-green-100 text-green-800' :
                      liveQuality.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      Quality: {liveQuality.score}%
                    </div>
                  </div>
                </div>
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-48 object-contain rounded-lg border border-gray-300"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {analysisResult && (
                      <>
                        <ThermometerSun className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">
                          Health: {analysisResult.healthScore}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {deviceInfo.isMobile && (
                      <Smartphone className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-xs text-gray-500">
                      {deviceInfo.isMobile ? 'Mobile capture' : 'Desktop capture'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quality Report */}
              {liveQuality.issues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Quality Report
                  </h4>
                  <ul className="space-y-1">
                    {liveQuality.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-yellow-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        {issue}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-yellow-700 mt-2">
                    These issues were detected during capture. Consider retaking if severe.
                  </p>
                </div>
              )}

              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select crop type...</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="tomato">Tomato</option>
                  <option value="potato">Potato</option>
                  <option value="cotton">Cotton</option>
                  <option value="soybean">Soybean</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observed Symptoms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Yellow spots', 'Brown edges', 'White powder', 'Black spots',
                    'Wilting', 'Curling leaves', 'Stunted growth', 'Holes in leaves'
                  ].map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => {
                        setDiseaseSymptoms(prev =>
                          prev.includes(symptom)
                            ? prev.filter(s => s !== symptom)
                            : [...prev, symptom]
                        );
                      }}
                      className={`p-3 rounded-lg border transition-all ${diseaseSymptoms.includes(symptom)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${diseaseSymptoms.includes(symptom) ? 'bg-red-500' : 'bg-gray-300'
                          }`} />
                        <span className="text-sm">{symptom}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Environmental Data */}
              <div>
                <button
                  onClick={getEnvironmentalData}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
                >
                  <Thermometer className="w-6 h-6" />
                  Record Environmental Data
                </button>

                {environmentalData && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">Environmental Data</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Thermometer className="w-4 h-4" />
                          <span>Temperature</span>
                        </div>
                        <p className="text-lg font-bold mt-1">{environmentalData.temperature}°C</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Droplets className="w-4 h-4" />
                          <span>Humidity</span>
                        </div>
                        <p className="text-lg font-bold mt-1">{environmentalData.humidity}%</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Cloud className="w-4 h-4" />
                          <span>Weather</span>
                        </div>
                        <p className="text-lg font-bold mt-1">{environmentalData.weather}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span>Time</span>
                        </div>
                        <p className="text-lg font-bold mt-1">{environmentalData.time}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Instructions Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Voice Instructions</p>
                    <p className="text-sm text-gray-600">Audio guidance for analysis</p>
                  </div>
                </div>
                <button
                  onClick={toggleVoiceInstructions}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${voiceInstructions ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${voiceInstructions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Preview */}
          {analysisResult && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Preliminary Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Health Score</span>
                  <span className={`text-xl font-bold ${analysisResult.healthScore >= 70 ? 'text-emerald-600' :
                    analysisResult.healthScore >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                    {analysisResult.healthScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-emerald-600 font-bold text-lg">{analysisResult.greenPercentage}%</div>
                    <div className="text-xs text-gray-600">Healthy</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-yellow-600 font-bold text-lg">{analysisResult.brownPercentage}%</div>
                    <div className="text-xs text-gray-600">Browning</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-red-600 font-bold text-lg">{analysisResult.diseasePercentage}%</div>
                    <div className="text-xs text-gray-600">Disease</div>
                  </div>
                </div>

                {analysisResult.issues.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-800">
                      Issues detected: {analysisResult.issues.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'analysis' && showAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">Analysis Complete!</h1>
              <p className="text-gray-600 mt-2">
                Your capture has been analyzed and saved
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Overall Health Score</h3>
                    <p className="opacity-90">Based on visual analysis</p>
                  </div>
                  <div className="text-5xl font-bold">
                    {analysisResult.healthScore}%
                  </div>
                </div>
                <div className="mt-4 h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${analysisResult.healthScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-emerald-700 font-bold text-2xl mb-1">
                    {analysisResult.greenPercentage}%
                  </div>
                  <div className="text-sm text-emerald-600">Healthy</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="text-yellow-700 font-bold text-2xl mb-1">
                    {analysisResult.brownPercentage}%
                  </div>
                  <div className="text-sm text-yellow-600">Browning</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-red-700 font-bold text-2xl mb-1">
                    {analysisResult.diseasePercentage}%
                  </div>
                  <div className="text-sm text-red-600">Disease</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-blue-700 font-bold text-2xl mb-1">
                    {liveQuality.score}%
                  </div>
                  <div className="text-sm text-blue-600">Photo Quality</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-blue-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality Improvement Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Photo Quality Tips for Next Time
                </h3>
                <ul className="space-y-2">
                  {liveQuality.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-yellow-800">
                        {issue === 'Low light' ? 'Use better lighting or enable flash' :
                          issue === 'Blur detected' ? 'Hold phone steadier or use support' :
                            issue === 'Low contrast' ? 'Adjust lighting for better contrast' :
                              'Follow on-screen guidance'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setView('home')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => {
                    // Speak analysis results
                    if (voiceInstructions) {
                      const message = `Analysis complete. Health score is ${analysisResult.healthScore} percent. ` +
                        `Healthy area is ${analysisResult.greenPercentage} percent. ` +
                        `Browning is ${analysisResult.brownPercentage} percent. ` +
                        `Photo quality was ${liveQuality.score} percent. ` +
                        `Recommended actions: ${analysisResult.recommendations.join('. ')}`;
                      speakGuidance(message);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Hear Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Placeholders for missing components to ensure application stability
const MultiImageUpload = ({ setView }) => (
  <div className="min-h-screen bg-nature-50 flex flex-col">
    {/* Header */}
    <div className="bg-nature-600 p-4 text-white shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/20 rounded-full transition">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">Photo Upload</h1>
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-nature-100">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Upload className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Photos</h2>
        <p className="text-gray-500 mb-8">Choose images from your gallery to analyze crop health.</p>

        <div className="space-y-3">
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Open Gallery
          </button>
          <button onClick={() => setView('home')} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

const VideoRecorder = ({ setView }) => (
  <div className="min-h-screen bg-nature-50 flex flex-col">
    <div className="bg-nature-600 p-4 text-white shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/20 rounded-full transition">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">Video Analysis</h1>
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-nature-100">
        <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Video className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Record Video</h2>
        <p className="text-gray-500 mb-8">Record a short video of the plant to analyze motion-based symptoms.</p>

        <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200 mb-3">
          Start Recording
        </button>
        <button onClick={() => setView('home')} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const VoiceInput = ({ setView }) => (
  <div className="min-h-screen bg-nature-50 flex flex-col">
    <div className="bg-nature-600 p-4 text-white shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/20 rounded-full transition">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">Voice Assistant</h1>
      </div>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-nature-100">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Mic className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Listening...</h2>
        <p className="text-gray-500 mb-8">Describe the symptoms you see on the plant.</p>

        <button onClick={() => setView('home')} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
          Stop Listening
        </button>
      </div>
    </div>
  </div>
);

const ImageAnalysis = ({ setView, capturedImages }) => (
  <div className="min-h-screen bg-nature-50 flex flex-col">
    <div className="bg-nature-600 p-4 text-white shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button onClick={() => setView('home')} className="p-2 hover:bg-white/20 rounded-full transition">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">Analysis History</h1>
      </div>
    </div>

    <div className="max-w-4xl mx-auto p-6 w-full">
      {capturedImages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">No Analysis Yet</h3>
          <p className="text-gray-500 mt-2">Use the camera to diagnose your first plant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capturedImages.map((img, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-md flex gap-4 border border-gray-100">
              <img src={img.data} className="w-24 h-24 rounded-xl object-cover" alt="Captured" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">Analysis #{idx + 1}</h4>
                  <span className="text-xs text-gray-500">{new Date(img.metadata?.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${img.analysis?.healthScore > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    Score: {img.analysis?.healthScore}%
                  </span>
                </div>
                <button className="text-nature-600 text-sm font-bold hover:underline">View Full Report</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default CropDiagnosisApp;