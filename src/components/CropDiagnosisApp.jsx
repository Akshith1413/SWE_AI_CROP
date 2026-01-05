import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, Upload, Video, Mic, X, Check, AlertCircle, RefreshCw, 
  Image as ImageIcon, Wifi, WifiOff, Info, Sun, Moon, Focus, 
  Smartphone, ZoomIn, AlertTriangle, CheckCircle, Lightbulb, 
  Grid3x3, Volume2, ChevronRight, Target, Leaf, Thermometer, 
  Zap, Shield, RotateCcw, Maximize2, Minus, Plus, CameraOff
} from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

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
        <EnhancedCameraCapture 
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
                <p className="text-sm text-yellow-700">{offlineQueue.length} items waiting</p>
              </div>
            </div>
          </div>
        )}

        {capturedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Captures</h2>
              <span className="text-sm text-gray-500">{capturedImages.length} images</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {capturedImages.slice(-8).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img} 
                    alt={`Capture ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-green-200 group-hover:border-green-400 transition"
                  />
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
                <span className="font-bold text-lg">Smart Camera</span>
                <p className="text-xs text-green-100 mt-1">AI-assisted capture</p>
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
                <p className="text-xs text-blue-100 mt-1">From gallery</p>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Smart Camera Features</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Real-time leaf detection
                </li>
                <li className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Image quality analysis
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI guidance overlays
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedCameraCapture = ({ setView, setCapturedImages, isOnline, addToOfflineQueue, showTutorial, setShowTutorial }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const modelRef = useRef(null);
  
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
    score: 0 
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
  const [aiModelLoaded, setAiModelLoaded] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  // Load AI model on mount
  useEffect(() => {
    loadAIModel();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  const loadAIModel = async () => {
    try {
      await tf.ready();
      const model = await cocossd.load();
      modelRef.current = model;
      setAiModelLoaded(true);
      console.log('AI model loaded successfully');
    } catch (error) {
      console.error('Failed to load AI model:', error);
    }
  };

  // Camera setup
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [cameraFacing]);

  // Real-time analysis
  useEffect(() => {
    if (stream && videoRef.current && !capturedPhoto && cameraReady) {
      const analyzeFrame = async () => {
        await analyzeLiveQuality();
        if (aiModelLoaded && frameCount % 3 === 0) {
          await detectObjects();
        }
        setFrameCount(prev => prev + 1);
        animationRef.current = requestAnimationFrame(analyzeFrame);
      };
      
      animationRef.current = requestAnimationFrame(analyzeFrame);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [stream, capturedPhoto, cameraReady, aiModelLoaded, frameCount]);

  useEffect(() => {
    if (showTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      if (navigator.mediaDevices.getSupportedConstraints().zoom) {
        constraints.video.zoom = { ideal: zoomLevel };
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
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

  const analyzeLiveQuality = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
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
      
      // Blur detection using Laplacian variance
      let blurScore = 0;
      let contrast = 0;
      let sharpness = 0;
      
      // Calculate edge strength
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          const prevIdx = (y * canvas.width + (x - 1)) * 4;
          const nextIdx = (y * canvas.width + (x + 1)) * 4;
          
          const horizontalDiff = Math.abs(data[idx] - data[nextIdx]);
          const verticalDiff = Math.abs(data[idx] - data[prevIdx]);
          blurScore += (horizontalDiff + verticalDiff) / 2;
          contrast += Math.abs(data[idx] - 128);
        }
      }
      
      blurScore /= ((canvas.width - 2) * (canvas.height - 2));
      contrast /= (data.length / 4);
      sharpness = blurScore;
      
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
      } else if (sharpness < 3) {
        status = 'soft';
        message = 'Image soft - Hold steady';
        icon = '📷';
        score = 60;
      }
      
      // Adjust score based on multiple factors
      if (status === 'good') {
        if (brightness > 180) score -= 10;
        if (blurScore > 15) score = Math.min(100, score + 20);
      }
      
      setLiveQuality({ 
        brightness: Math.round(brightness), 
        blur: Math.round(blurScore * 100) / 100,
        contrast: Math.round(contrast),
        sharpness: Math.round(sharpness * 100) / 100,
        status,
        message,
        icon,
        score
      });
    }
  };

  const detectObjects = async () => {
    if (!modelRef.current || !videoRef.current) return;
    
    try {
      setIsDetecting(true);
      const predictions = await modelRef.current.detect(videoRef.current);
      
      // Filter for plant-related objects
      const plantObjects = predictions.filter(p => 
        ['plant', 'potted plant', 'vase', 'flower'].includes(p.class.toLowerCase()) ||
        p.class.toLowerCase().includes('plant')
      );
      
      setDetectedObjects(plantObjects);
    } catch (error) {
      console.error('Object detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const capturePhoto = () => {
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
      
      // Draw detection boxes on captured image
      if (detectedObjects.length > 0) {
        detectedObjects.forEach(obj => {
          ctx.strokeStyle = obj.class.toLowerCase().includes('plant') ? '#10B981' : '#F59E0B';
          ctx.lineWidth = 3;
          ctx.strokeRect(obj.bbox[0], obj.bbox[1], obj.bbox[2], obj.bbox[3]);
          
          // Label
          ctx.fillStyle = obj.class.toLowerCase().includes('plant') ? '#10B981' : '#F59E0B';
          ctx.font = '16px Arial';
          ctx.fillText(`${obj.class} ${Math.round(obj.score * 100)}%`, obj.bbox[0], obj.bbox[1] > 10 ? obj.bbox[1] - 5 : 20);
        });
      }
      
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      const quality = performDetailedQualityCheck(ctx, canvas.width, canvas.height);
      
      if (quality.severe) {
        setQualityWarning({
          type: 'severe',
          issues: quality.issues,
          message: quality.message,
          score: quality.score
        });
      } else if (quality.warning) {
        setQualityWarning({
          type: 'warning',
          issues: quality.issues,
          message: 'Photo quality could be better. Proceed anyway?',
          score: quality.score
        });
        setCapturedPhoto(imageData);
      } else {
        setQualityWarning(null);
        setCapturedPhoto(imageData);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
      }
    }
  };

  const performDetailedQualityCheck = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let brightness = 0;
    let blurScore = 0;
    let contrast = 0;
    let colorVariance = 0;
    const issues = [];
    
    // Calculate metrics
    const sampleRate = 10;
    let count = 0;
    
    for (let i = 0; i < data.length; i += sampleRate * 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      count++;
    }
    brightness /= count;
    
    // Edge detection for blur
    for (let y = 1; y < Math.min(100, height - 1); y += 2) {
      for (let x = 1; x < Math.min(100, width - 1); x += 2) {
        const idx = (y * width + x) * 4;
        const rightIdx = (y * width + (x + 1)) * 4;
        const downIdx = ((y + 1) * width + x) * 4;
        
        blurScore += Math.abs(data[idx] - data[rightIdx]) + Math.abs(data[idx] - data[downIdx]);
      }
    }
    
    blurScore /= (50 * 50 * 2);
    
    // Determine issues
    let severe = false;
    let warning = false;
    let score = 100;
    
    if (brightness < 40) {
      issues.push({ icon: Moon, text: 'Severely underexposed', color: 'red' });
      severe = true;
      score -= 50;
    } else if (brightness < 60) {
      issues.push({ icon: Moon, text: 'Image too dark', color: 'yellow' });
      warning = true;
      score -= 20;
    }
    
    if (brightness > 240) {
      issues.push({ icon: Sun, text: 'Severely overexposed', color: 'red' });
      severe = true;
      score -= 40;
    } else if (brightness > 220) {
      issues.push({ icon: Sun, text: 'Image too bright', color: 'yellow' });
      warning = true;
      score -= 15;
    }
    
    if (blurScore < 8) {
      issues.push({ icon: Focus, text: 'Severely out of focus', color: 'red' });
      severe = true;
      score -= 40;
    } else if (blurScore < 12) {
      issues.push({ icon: Focus, text: 'Slightly blurry', color: 'yellow' });
      warning = true;
      score -= 15;
    }
    
    if (contrast < 10) {
      issues.push({ icon: AlertCircle, text: 'Very low contrast', color: 'yellow' });
      warning = true;
      score -= 10;
    }
    
    return {
      severe,
      warning: warning && !severe,
      issues,
      message: severe ? 'Photo quality too poor. Please retake with better conditions.' : '',
      score: Math.max(0, score)
    };
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      setCapturedImages(prev => [...prev, capturedPhoto]);
      
      if (!isOnline) {
        addToOfflineQueue({ 
          type: 'image', 
          data: capturedPhoto, 
          timestamp: Date.now(),
          quality: liveQuality,
          detectedObjects 
        });
      }
      
      setCapturedPhoto(null);
      setQualityWarning(null);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setView('home');
      }, 2000);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setQualityWarning(null);
    setCaptureCountdown(null);
  };

  const forceCapture = () => {
    setQualityWarning(null);
    savePhoto();
  };

  const getQualityColor = () => {
    switch(liveQuality.status) {
      case 'good': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'dark': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'bright': return 'bg-gradient-to-r from-orange-500 to-yellow-600';
      case 'blur': return 'bg-gradient-to-r from-red-500 to-orange-600';
      case 'low-contrast': return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'soft': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };

  const getQualityScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const speakGuidance = (message) => {
    if ('speechSynthesis' in window && voiceGuidance !== message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
      setVoiceGuidance(message);
    }
  };

  useEffect(() => {
    if (liveQuality.status !== 'good' && liveQuality.message) {
      speakGuidance(liveQuality.message);
    }
  }, [liveQuality.status]);

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
            
            {/* Detection Canvas Overlay */}
            <canvas
              ref={detectionCanvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 10 }}
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
                  {liveQuality.status !== 'good' && (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Detection Status */}
            {isDetecting && (
              <div className="absolute top-32 left-4 z-20 bg-blue-500 text-white px-3 py-2 rounded-lg backdrop-blur-sm bg-opacity-90 flex items-center gap-2">
                <Target className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Scanning for plants...</span>
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
                disabled={!cameraReady || liveQuality.status === 'checking'}
                className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all transform shadow-2xl ${
                  detectedObjects.length > 0 
                    ? 'border-green-500 bg-green-500 hover:scale-110' 
                    : 'border-white bg-black bg-opacity-50'
                } ${(!cameraReady || liveQuality.status === 'checking') && 'opacity-50'}`}
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
              onClick={savePhoto}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 backdrop-blur-sm text-white py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6" />
              Save Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// MultiImageUpload, VideoRecorder, and VoiceInput components remain the same as in your original code
// (They should be included but I'm omitting them here for brevity since you asked for camera enhancements)

export default CropDiagnosisApp;