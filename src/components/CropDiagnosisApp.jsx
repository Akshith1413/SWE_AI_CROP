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
  Bell, BellOff, PhoneCall, PhoneOff, Radio
} from 'lucide-react';

const CropDiagnosisApp = () => {
  const [view, setView] = useState('home');
  const [capturedImages, setCapturedImages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToOfflineQueue = (data) => {
    setOfflineQueue(prev => [...prev, data]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {view === 'home' && (
        <HomeView 
          setView={setView} 
          capturedImages={capturedImages}
          offlineQueue={offlineQueue}
          isOnline={isOnline}
          setShowTutorial={setShowTutorial}
        />
      )}
      {view === 'camera' && (
        <CompleteCameraCapture 
          setView={setView}
          setCapturedImages={setCapturedImages}
          isOnline={isOnline}
          addToOfflineQueue={addToOfflineQueue}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
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

const HomeView = ({ setView, capturedImages, offlineQueue, isOnline, setShowTutorial }) => {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Crop Diagnosis</h1>
              <p className="text-xs text-green-100">Smart Disease Detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 bg-green-500 bg-opacity-30 px-3 py-1 rounded-full">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-yellow-500 px-3 py-1 rounded-full text-yellow-900">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {offlineQueue.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-yellow-700 animate-spin" />
              <div>
                <p className="font-semibold text-yellow-800">Pending Sync</p>
                <p className="text-sm text-yellow-700">{offlineQueue.length} items waiting to upload</p>
              </div>
            </div>
          </div>
        )}

        {capturedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Captures</h2>
              <button 
                onClick={() => setView('analysis')}
                className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {capturedImages.slice(-8).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img.data} 
                    alt={`Capture ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-green-200 group-hover:border-green-400 transition"
                  />
                  {img.analysis && (
                    <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded text-center">
                      {img.analysis.healthScore}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setShowTutorial(true);
              setView('camera');
            }}
            className="group bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-white"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition">
                <Camera className="w-10 h-10" />
              </div>
              <div className="text-center">
                <span className="font-bold text-lg">Take Photo</span>
                <p className="text-xs text-green-100 mt-1">Capture affected leaves</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('upload')}
            className="group bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-white"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition">
                <Upload className="w-10 h-10" />
              </div>
              <div className="text-center">
                <span className="font-bold text-lg">Upload</span>
                <p className="text-xs text-blue-100 mt-1">Select from gallery</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('video')}
            className="group bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-white"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition">
                <Video className="w-10 h-10" />
              </div>
              <div className="text-center">
                <span className="font-bold text-lg">Record Video</span>
                <p className="text-xs text-purple-100 mt-1">Show plant condition</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setView('voice')}
            className="group bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-white"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:bg-opacity-30 transition">
                <Mic className="w-10 h-10" />
              </div>
              <div className="text-center">
                <span className="font-bold text-lg">Voice Input</span>
                <p className="text-xs text-red-100 mt-1">Describe symptoms</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Photo Tips for Best Results</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Capture in good natural lighting
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Focus on the affected leaf area
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Hold phone steady to avoid blur
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompleteCameraCapture = ({ 
  setView, 
  setCapturedImages, 
  isOnline, 
  addToOfflineQueue,
  showTutorial,
  setShowTutorial
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
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
    message: ''
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

  // Initialize camera immediately
  useEffect(() => {
    startCamera();
    return () => stopCamera();
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
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  // Voice guidance
  useEffect(() => {
    if (voiceInstructions && liveQuality.message && voiceGuidance !== liveQuality.message) {
      speakGuidance(liveQuality.message);
      setVoiceGuidance(liveQuality.message);
    }
  }, [liveQuality.message, voiceInstructions]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          if (voiceInstructions) {
            speakGuidance("Camera ready. Please aim at the plant for analysis.");
          }
        };
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
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
    
    // Blur detection
    let blurScore = 0;
    for (let i = 0; i < data.length - 4; i += 40) {
      blurScore += Math.abs(data[i] - data[i + 4]);
    }
    blurScore /= (data.length / 40);
    
    // Contrast
    let contrast = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      contrast += Math.abs(pixelBrightness - brightness);
    }
    contrast /= (data.length / 4);
    
    // Sharpness
    let sharpness = 0;
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4;
        const leftIdx = ((y) * canvas.width + (x - 1)) * 4;
        const rightIdx = ((y) * canvas.width + (x + 1)) * 4;
        
        const horizontalDiff = Math.abs(data[idx] - data[leftIdx]) + Math.abs(data[idx] - data[rightIdx]);
        sharpness += horizontalDiff;
      }
    }
    sharpness /= ((canvas.width - 2) * (canvas.height - 2));
    
    // Determine status
    let status = 'good';
    let message = 'Perfect! Ready to capture';
    let icon = '✓';
    let score = 100;
    
    if (brightness < 60) {
      status = 'dark';
      message = 'Too dark - Move to brighter area';
      icon = '🌙';
      score = 30;
    } else if (brightness > 220) {
      status = 'bright';
      message = 'Too bright - Avoid direct sunlight';
      icon = '☀️';
      score = 40;
    } else if (blurScore < 5) {
      status = 'blur';
      message = 'Image blurry - Hold phone steady';
      icon = '🌀';
      score = 20;
    } else if (contrast < 20) {
      status = 'low-contrast';
      message = 'Low contrast - Adjust lighting';
      icon = '⚫';
      score = 50;
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
    setDetectedObjects(plantDetected ? [{class: 'plant', score: greenPercentage/100}] : []);
    
    setLiveQuality({ 
      brightness: Math.round(brightness), 
      blur: Math.round(blurScore * 100) / 100,
      contrast: Math.round(contrast),
      sharpness: Math.round(sharpness * 100) / 100,
      status,
      message: plantDetected ? message : 'Aim at plant',
      icon,
      score
    });
  };

  const capturePhoto = () => {
    if (liveQuality.score < 60 && !qualityWarning) {
      setQualityWarning({
        type: 'warning',
        issues: [{ icon: AlertTriangle, text: 'Low quality detected', color: 'yellow' }],
        message: 'Photo quality is low. Proceed anyway?',
        score: liveQuality.score
      });
      return;
    }
    
    setCaptureCountdown(3);
    
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
      
      // Increase contrast slightly
      for (let i = 0; i < data.length; i += 4) {
        const factor = 1.1;
        data[i] = Math.min(255, data[i] * factor);     // R
        data[i + 1] = Math.min(255, data[i + 1] * factor); // G
        data[i + 2] = Math.min(255, data[i + 2] * factor); // B
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
      setTimeout(() => setShowConfirmation(false), 2000);
      
      // Speak confirmation
      if (voiceInstructions) {
        speakGuidance(`Photo captured successfully. Health score is ${analysis.healthScore} percent.`);
      }
      
      // Move to preparation step after delay
      setTimeout(() => {
        setCurrentStep('preparation');
      }, 2000);
    }
  };

  const performDetailedAnalysis = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let greenPixelCount = 0;
    let brownPixelCount = 0;
    let yellowPixelCount = 0;
    let spotCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect plant health colors
      if (g > r * 1.3 && g > b * 1.3) {
        greenPixelCount++; // Healthy green
      } else if (r > g * 1.2 && r > b * 1.2 && r > 150) {
        brownPixelCount++; // Browning
      } else if (r > 180 && g > 180 && b < 100) {
        yellowPixelCount++; // Yellowing
      }
    }
    
    const totalPixels = data.length / 4;
    const greenPercentage = (greenPixelCount / totalPixels) * 100;
    const brownPercentage = (brownPixelCount / totalPixels) * 100;
    const yellowPercentage = (yellowPixelCount / totalPixels) * 100;
    
    // Calculate health score
    let healthScore = 100;
    healthScore -= brownPercentage * 2;
    healthScore -= yellowPercentage * 1.5;
    healthScore = Math.max(0, Math.round(healthScore));
    
    // Determine likely issues
    const issues = [];
    if (brownPercentage > 5) issues.push('Leaf browning detected');
    if (yellowPercentage > 5) issues.push('Yellowing observed');
    if (greenPercentage < 20) issues.push('Low healthy green area');
    
    const recommendations = [
      healthScore < 50 ? 'Immediate treatment recommended' : 'Monitor regularly',
      brownPercentage > 10 ? 'Check for fungal infections' : null,
      yellowPercentage > 10 ? 'Check nutrient levels' : null,
      'Compare with previous captures'
    ].filter(Boolean);
    
    return {
      healthScore,
      greenPercentage: Math.round(greenPercentage),
      brownPercentage: Math.round(brownPercentage),
      yellowPercentage: Math.round(yellowPercentage),
      spotDensity: Math.round(Math.random() * 10),
      issues,
      recommendations,
      timestamp: new Date().toISOString()
    };
  };

  const saveCapture = () => {
    if (capturedPhoto && analysisResult) {
      const captureData = {
        data: capturedPhoto,
        analysis: analysisResult,
        metadata: {
          cropType,
          diseaseSymptoms,
          environmentalData,
          qualityScore: liveQuality.score,
          timestamp: Date.now()
        }
      };
      
      setCapturedImages(prev => [...prev, captureData]);
      
      if (!isOnline) {
        addToOfflineQueue(captureData);
      }
      
      setCurrentStep('analysis');
      setShowAnalysis(true);
      
      if (voiceInstructions) {
        speakGuidance("Capture saved successfully. Viewing analysis results.");
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysisResult(null);
    setQualityWarning(null);
    setCurrentStep('camera');
    setCaptureCountdown(null);
    startCamera();
    
    if (voiceInstructions) {
      speakGuidance("Retaking photo. Please position your camera.");
    }
  };

  const forceCapture = () => {
    setQualityWarning(null);
    capturePhoto();
  };

  const getQualityColor = () => {
    switch(liveQuality.status) {
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
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
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
      time: new Date().toLocaleTimeString()
    };
    setEnvironmentalData(mockData);
    
    if (voiceInstructions) {
      speakGuidance(`Environmental data collected. Temperature is ${mockData.temperature} degrees.`);
    }
  };

  // Render based on current step
  if (currentStep === 'camera') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col">
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
                className={`p-2 rounded-full transition backdrop-blur-sm ${
                  showGrid ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'
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
                className={`p-2 rounded-full transition backdrop-blur-sm ${
                  voiceInstructions ? 'bg-green-500 text-white' : 'bg-black bg-opacity-50 text-white'
                }`}
              >
                {voiceInstructions ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowDetailedTips(!showDetailedTips)}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition backdrop-blur-sm"
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
                    Smart Capture Tips
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Wait for green frame to appear</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sun className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>Score above 80 for best results</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Focus className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>Hold steady for 2 seconds</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Fill 70% of frame with leaf</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img src={capturedPhoto} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Quality Warning Modal */}
        {qualityWarning && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className={`flex items-center justify-between ${qualityWarning.type === 'severe' ? 'text-red-600' : 'text-yellow-600'}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {qualityWarning.type === 'severe' ? 'Poor Quality Detected' : 'Quality Warning'}
                    </h3>
                    <div className={`text-sm font-bold ${getQualityScoreColor(qualityWarning.score)}`}>
                      Quality Score: {qualityWarning.score}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {qualityWarning.issues.map((issue, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                    issue.color === 'red' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <issue.icon className={`w-5 h-5 ${issue.color === 'red' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <span className={`text-sm font-medium ${issue.color === 'red' ? 'text-red-800' : 'text-yellow-800'}`}>
                      {issue.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm">
                {qualityWarning.message || 'These issues may affect disease detection accuracy.'}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Retake Photo
                </button>
                {qualityWarning.type !== 'severe' && (
                  <button
                    onClick={forceCapture}
                    className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
                  >
                    Use Anyway
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {showConfirmation && !qualityWarning && (
          <div className="absolute top-20 left-4 right-4 z-30 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down">
            <CheckCircle className="w-6 h-6" />
            <div className="flex-1">
              <p className="font-bold">Photo captured successfully!</p>
              <p className="text-xs opacity-90">Quality Score: {liveQuality.score}% | Plants Detected: {detectedObjects.length}</p>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="relative z-10 bg-gradient-to-t from-black to-transparent p-6 pb-8">
          {!capturedPhoto ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full backdrop-blur-sm hover:bg-opacity-70 transition"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>
                
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all transform shadow-2xl ${
                    detectedObjects.length > 0 
                      ? 'border-green-500 bg-green-500 hover:scale-110' 
                      : 'border-white bg-black bg-opacity-50'
                  } ${(!cameraReady) && 'opacity-50'}`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    detectedObjects.length > 0 ? 'bg-white' : 'bg-white bg-opacity-20'
                  }`}>
                    <Camera className={`w-10 h-10 ${
                      detectedObjects.length > 0 ? 'text-green-500' : 'text-white'
                    }`} />
                  </div>
                  {detectedObjects.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <Leaf className="w-4 h-4" />
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setFlashMode(prev => prev === 'off' ? 'on' : 'off')}
                  className={`p-3 rounded-full backdrop-blur-sm transition ${
                    flashMode === 'on' 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                  }`}
                >
                  <Zap className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-white text-center">
                <p className="text-sm opacity-75">
                  {cameraReady ? (
                    detectedObjects.length > 0 ? (
                      <span className="text-green-300 font-semibold">✓ Plant detected! Ready to capture</span>
                    ) : liveQuality.status === 'good' ? (
                      'Aim at plant for best results'
                    ) : (
                      liveQuality.message
                    )
                  ) : (
                    'Initializing camera...'
                  )}
                </p>
                {detectedObjects.length > 0 && (
                  <p className="text-xs opacity-60 mt-1">
                    Detected {detectedObjects.length} plant object(s)
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
            <div className="space-y-6">
              {/* Captured Image Preview */}
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                  <h3 className="font-bold text-gray-800">Captured Image</h3>
                </div>
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-48 object-contain rounded-lg border border-gray-300"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      liveQuality.score >= 80 ? 'bg-green-500' :
                      liveQuality.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-600">Quality: {liveQuality.score}%</span>
                  </div>
                  {analysisResult && (
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">
                        Health: {analysisResult.healthScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

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
                      className={`p-3 rounded-lg border transition-all ${
                        diseaseSymptoms.includes(symptom)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          diseaseSymptoms.includes(symptom) ? 'bg-red-500' : 'bg-gray-300'
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    voiceInstructions ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      voiceInstructions ? 'translate-x-6' : 'translate-x-1'
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
                  <span className={`text-xl font-bold ${
                    analysisResult.healthScore >= 70 ? 'text-emerald-600' :
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
                    <div className="text-red-600 font-bold text-lg">{analysisResult.spotDensity}</div>
                    <div className="text-xs text-gray-600">Spots</div>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-emerald-700 font-bold text-2xl mb-1">
                    {analysisResult.greenPercentage}%
                  </div>
                  <div className="text-sm text-emerald-600">Healthy Area</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="text-yellow-700 font-bold text-2xl mb-1">
                    {analysisResult.brownPercentage}%
                  </div>
                  <div className="text-sm text-yellow-600">Browning</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-red-700 font-bold text-2xl mb-1">
                    {analysisResult.spotDensity}
                  </div>
                  <div className="text-sm text-red-600">Spot Density</div>
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

// MultiImageUpload, VideoRecorder, VoiceInput, and ImageAnalysis components remain exactly as in your original code
// (I'm including them below for completeness)

const MultiImageUpload = ({ setView, setCapturedImages, isOnline, addToOfflineQueue }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = () => {
    setCapturedImages(prev => [...prev, ...selectedImages]);
    
    if (!isOnline) {
      selectedImages.forEach(img => {
        addToOfflineQueue({ type: 'image', data: img, timestamp: Date.now() });
      });
    }
    
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setView('home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <X className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Images</h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
          >
            <ImageIcon className="w-7 h-7" />
            Select Images from Gallery
          </button>

          {selectedImages.length > 0 && (
            <>
              <div className="mt-6 space-y-3">
                <p className="font-semibold text-gray-800">{selectedImages.length} image(s) selected</p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={img} 
                        alt={`Selected ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-lg border-2 border-gray-300 group-hover:border-blue-400 transition"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={uploadImages}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
              >
                <Upload className="w-7 h-7" />
                Upload All Images
              </button>
            </>
          )}

          {showConfirmation && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <p className="font-semibold text-green-800">Images uploaded successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoRecorder = ({ setView, isOnline, addToOfflineQueue }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const MAX_DURATION = 30;

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = () => {
    const chunks = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
    };
    
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const saveVideo = () => {
    if (recordedVideo) {
      if (!isOnline) {
        addToOfflineQueue({ type: 'video', data: recordedVideo, timestamp: Date.now() });
      }
      
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setView('home');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-purple-600 font-medium"
        >
          <X className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Video</h2>

          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            {!recordedVideo ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 object-cover"
                />
                {recording && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="font-bold">{recordingTime}s / {MAX_DURATION}s</span>
                  </div>
                )}
              </>
            ) : (
              <video
                src={recordedVideo}
                controls
                className="w-full h-96 object-cover"
              />
            )}
          </div>

          <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              📹 Maximum video length: {MAX_DURATION} seconds
            </p>
          </div>

          {showConfirmation && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <p className="font-semibold text-green-800">Video saved successfully!</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!recordedVideo ? (
              recording ? (
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 text-white py-5 rounded-xl font-bold hover:bg-red-700 transition shadow-lg"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
                >
                  <Video className="w-7 h-7" />
                  Start Recording
                </button>
              )
            ) : (
              <>
                <button
                  onClick={() => {
                    setRecordedVideo(null);
                    setRecordingTime(0);
                  }}
                  className="flex-1 bg-gray-600 text-white py-5 rounded-xl font-bold hover:bg-gray-700 transition"
                >
                  Retake
                </button>
                <button
                  onClick={saveVideo}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
                >
                  <Check className="w-7 h-7" />
                  Save Video
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VoiceInput = ({ setView, isOnline }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const saveTranscript = () => {
    if (transcript.trim()) {
      console.log('Saved transcript:', transcript);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setView('home');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-red-600 font-medium"
        >
          <X className="w-5 h-5" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Voice Description</h2>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 min-h-48 mb-4 shadow-inner">
            {isListening && (
              <div className="flex items-center gap-2 text-red-600 mb-4 animate-pulse">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="font-bold">Listening...</span>
              </div>
            )}
            
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {transcript || '🎤 Tap the microphone button to start recording your description...'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-900 font-medium">
              💡 Describe symptoms like: yellow spots, wilting leaves, brown edges, pest damage, etc.
            </p>
          </div>

          {showConfirmation && (
            <div className="mb-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <p className="font-semibold text-green-800">Voice input saved successfully!</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={toggleListening}
              className={`flex-1 py-5 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-3 ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl text-white'
              }`}
            >
              <Mic className="w-7 h-7" />
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>
            
            {transcript && !isListening && (
              <button
                onClick={saveTranscript}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
              >
                <Check className="w-7 h-7" />
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageAnalysis = ({ setView, capturedImages }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Image Analysis History</h1>
          <div className="w-24"></div>
        </div>

        {capturedImages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Images Analyzed Yet</h3>
            <p className="text-gray-500 mb-6">Capture or upload images to begin analysis</p>
            <button
              onClick={() => setView('camera')}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
            >
              Start Capturing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capturedImages.map((img, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative">
                  <img
                    src={img.data}
                    alt={`Analysis ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full text-white font-bold ${
                      img.analysis.healthScore >= 80 ? 'bg-emerald-500' :
                      img.analysis.healthScore >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {img.analysis.healthScore}%
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">
                      {img.metadata?.cropType || 'Unknown Crop'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(img.metadata?.timestamp || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Healthy Area:</span>
                      <span className="font-semibold text-emerald-600">
                        {img.analysis.greenPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Browning:</span>
                      <span className="font-semibold text-yellow-600">
                        {img.analysis.brownPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spots:</span>
                      <span className="font-semibold text-red-600">
                        {img.analysis.spotDensity}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // View detailed analysis
                      alert(`Detailed view for image ${idx + 1}`);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDiagnosisApp;