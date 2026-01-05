import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Video, Mic, X, Check, AlertCircle, RefreshCw, Image as ImageIcon, Wifi, WifiOff, Info, Sun, Moon, Focus, Smartphone, ZoomIn, AlertTriangle, CheckCircle, Lightbulb, Grid3x3, Volume2, ChevronRight } from 'lucide-react';

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
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Crop Diagnosis</h1>
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
        {/* Offline Queue */}
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

        {/* Recent Captures */}
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Actions */}
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

        {/* Quick Tips */}
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

const EnhancedCameraCapture = ({ setView, setCapturedImages, isOnline, addToOfflineQueue, showTutorial, setShowTutorial }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [qualityWarning, setQualityWarning] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [liveQuality, setLiveQuality] = useState({ brightness: 0, blur: 0, status: 'checking' });
  const [showGrid, setShowGrid] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(null);
  const [showDetailedTips, setShowDetailedTips] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (stream && videoRef.current && !capturedPhoto && cameraReady) {
      const interval = setInterval(() => {
        analyzeLiveQuality();
      }, 300);
      return () => clearInterval(interval);
    }
  }, [stream, capturedPhoto, cameraReady]);

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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeLiveQuality = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let brightness = 0;
      let blurScore = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      brightness /= (data.length / 4);
      
      for (let i = 0; i < data.length - 4; i += 40) {
        blurScore += Math.abs(data[i] - data[i + 4]);
      }
      blurScore /= (data.length / 40);
      
      let status = 'good';
      let message = '';
      let icon = '✓';
      
      if (brightness < 60) {
        status = 'dark';
        message = 'Too dark - Move to brighter area';
        icon = '⚠️';
        setVoiceGuidance('dark');
      } else if (brightness > 220) {
        status = 'bright';
        message = 'Too bright - Avoid direct sunlight';
        icon = '⚠️';
        setVoiceGuidance('bright');
      } else if (blurScore < 12) {
        status = 'blur';
        message = 'Image blurry - Hold phone steady';
        icon = '⚠️';
        setVoiceGuidance('blur');
      } else {
        status = 'good';
        message = 'Perfect! Ready to capture';
        icon = '✓';
        setVoiceGuidance('ready');
      }
      
      setLiveQuality({ 
        brightness: Math.round(brightness), 
        blur: Math.round(blurScore),
        status,
        message,
        icon
      });
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      
      const quality = performDetailedQualityCheck(ctx, canvas.width, canvas.height);
      
      if (quality.severe) {
        setQualityWarning({
          type: 'severe',
          issues: quality.issues,
          message: quality.message
        });
      } else if (quality.warning) {
        setQualityWarning({
          type: 'warning',
          issues: quality.issues,
          message: 'Photo quality could be better. Proceed anyway?'
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
    const issues = [];
    
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness /= (data.length / 4);
    
    for (let i = 0; i < data.length - 4; i += 40) {
      const diff = Math.abs(data[i] - data[i + 4]);
      blurScore += diff;
      contrast += diff;
    }
    blurScore /= (data.length / 40);
    contrast /= (data.length / 40);
    
    let severe = false;
    let warning = false;
    
    if (brightness < 40) {
      issues.push({ icon: Moon, text: 'Severely underexposed', color: 'red' });
      severe = true;
    } else if (brightness < 60) {
      issues.push({ icon: Moon, text: 'Image too dark', color: 'yellow' });
      warning = true;
    }
    
    if (brightness > 240) {
      issues.push({ icon: Sun, text: 'Severely overexposed', color: 'red' });
      severe = true;
    } else if (brightness > 220) {
      issues.push({ icon: Sun, text: 'Image too bright', color: 'yellow' });
      warning = true;
    }
    
    if (blurScore < 8) {
      issues.push({ icon: Focus, text: 'Severely out of focus', color: 'red' });
      severe = true;
    } else if (blurScore < 12) {
      issues.push({ icon: Focus, text: 'Slightly blurry', color: 'yellow' });
      warning = true;
    }
    
    if (contrast < 5) {
      issues.push({ icon: AlertCircle, text: 'Very low contrast', color: 'yellow' });
      warning = true;
    }
    
    return {
      severe,
      warning: warning && !severe,
      issues,
      message: severe ? 'Photo quality too poor. Please retake with better conditions.' : ''
    };
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      setCapturedImages(prev => [...prev, capturedPhoto]);
      
      if (!isOnline) {
        addToOfflineQueue({ type: 'image', data: capturedPhoto, timestamp: Date.now() });
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
  };

  const forceCapture = () => {
    setQualityWarning(null);
  };

  const getQualityColor = () => {
    switch(liveQuality.status) {
      case 'good': return 'bg-green-500';
      case 'dark': return 'bg-yellow-500';
      case 'bright': return 'bg-yellow-500';
      case 'blur': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-md space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Photo Guidance</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Sun className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">Good Lighting</p>
                  <p className="text-xs text-green-700">Use natural daylight, avoid harsh shadows</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Focus className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Clear Focus</p>
                  <p className="text-xs text-blue-700">Hold steady, fill frame with affected leaf</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900 text-sm">Proper Distance</p>
                  <p className="text-xs text-purple-700">Keep 15-20cm away from the leaf</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-white font-medium bg-black bg-opacity-50 px-4 py-2 rounded-full hover:bg-opacity-70 transition"
          >
            <X className="w-5 h-5" /> Back
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-full transition ${showGrid ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowDetailedTips(!showDetailedTips)}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
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
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white border-opacity-30"></div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Focus Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                <div className="absolute inset-0 border-2 border-white border-opacity-30 border-dashed rounded-lg"></div>
              </div>
            </div>

            {/* Live Quality Banner */}
            {cameraReady && (
              <div className="absolute top-20 left-4 right-4 z-20">
                <div className={`${getQualityColor()} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm bg-opacity-90`}>
                  <div className="flex-shrink-0">
                    {liveQuality.status === 'good' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{liveQuality.icon} {liveQuality.message}</p>
                    <div className="flex gap-4 mt-1 text-xs opacity-90">
                      <span>Brightness: {liveQuality.brightness}</span>
                      <span>Sharpness: {liveQuality.blur}</span>
                    </div>
                  </div>
                  {liveQuality.status !== 'good' && (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Detailed Tips Panel */}
            {showDetailedTips && (
              <div className="absolute bottom-24 left-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-xl backdrop-blur-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Photo Tips
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Natural daylight is best</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Focus className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Hold phone steady</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ZoomIn className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Fill frame with leaf</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Avoid shadows</span>
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
            <div className={`flex items-center gap-3 ${qualityWarning.type === 'severe' ? 'text-red-600' : 'text-yellow-600'}`}>
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">
                {qualityWarning.type === 'severe' ? 'Quality Issues Detected' : 'Quality Warning'}
              </h3>
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
        <div className="absolute top-20 left-4 right-4 z-30 bg-green-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down">
          <CheckCircle className="w-6 h-6" />
          <p className="font-bold">Photo captured successfully!</p>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="relative z-10 bg-gradient-to-t from-black to-transparent p-6 pb-8">
        {!capturedPhoto ? (
          <div className="flex items-center justify-center">
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all transform ${
                cameraReady && liveQuality.status === 'good'
                  ? 'bg-green-500 hover:scale-110 active:scale-95' 
                  : 'bg-gray-500'
              } disabled:opacity-50 shadow-2xl`}
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <Camera className={`w-8 h-8 ${liveQuality.status === 'good' ? 'text-green-500' : 'text-gray-500'}`} />
              </div>
            </button>
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
              className="flex-1 bg-green-600 bg-opacity-90 backdrop-blur-sm text-white py-4 rounded-xl font-bold hover:bg-opacity-100 transition flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6" />
              Save Photo
            </button>
          </div>
        )}
        
        {!capturedPhoto && (
          <p className="text-white text-center mt-4 text-sm opacity-75">
            {cameraReady ? 'Tap the button when ready' : 'Initializing camera...'}
          </p>
        )}
      </div>
    </div>
  );
};

// Multi-Image Upload Component
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

// Video Recorder Component  
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

// Voice Input Component
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

export default CropDiagnosisApp;