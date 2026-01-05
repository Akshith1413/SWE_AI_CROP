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
  Circle, Square, Triangle, Octagon, Crosshair, Eye, EyeOff
} from 'lucide-react';

// OpenCV.js integration
const loadOpenCV = () => {
  return new Promise((resolve) => {
    if (window.cv) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/3.4.0/opencv.js';
    script.async = true;
    script.onload = () => {
      // Wait for OpenCV to be ready
      const checkOpenCV = setInterval(() => {
        if (window.cv && window.cv.Mat) {
          clearInterval(checkOpenCV);
          resolve(true);
        }
      }, 100);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

const CropDiagnosisApp = () => {
  const [view, setView] = useState('home');
  const [capturedImages, setCapturedImages] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [opencvLoaded, setOpencvLoaded] = useState(false);

  useEffect(() => {
    loadOpenCV().then(loaded => setOpencvLoaded(loaded));
    
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
          opencvLoaded={opencvLoaded}
        />
      )}
      {view === 'camera' && (
        <ProfessionalCameraCapture 
          setView={setView}
          setCapturedImages={setCapturedImages}
          isOnline={isOnline}
          addToOfflineQueue={addToOfflineQueue}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          opencvLoaded={opencvLoaded}
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
      {view === 'analysis' && (
        <ImageAnalysis 
          setView={setView}
          capturedImages={capturedImages}
        />
      )}
    </div>
  );
};

const HomeView = ({ setView, capturedImages, offlineQueue, isOnline, setShowTutorial, opencvLoaded }) => {
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
              <p className="text-xs text-green-100">Professional Agricultural Imaging</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${opencvLoaded ? 'bg-green-500' : 'bg-yellow-500'} bg-opacity-30`}>
              {opencvLoaded ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">AI Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Loading AI</span>
                </>
              )}
            </div>
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
                <p className="font-semibold text-yellow-800">Pending Analysis</p>
                <p className="text-sm text-yellow-700">{offlineQueue.length} items in queue</p>
              </div>
            </div>
          </div>
        )}

        {capturedImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Analysis</h2>
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
                <span className="font-bold text-lg">Smart Camera</span>
                <p className="text-xs text-green-100 mt-1">Professional capture</p>
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

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-2">Advanced Features</h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Real-time disease pattern detection
                </li>
                <li className="flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4" />
                  Plant health scoring (0-100%)
                </li>
                <li className="flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Pest & disease identification
                </li>
                <li className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Nutrient deficiency analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalCameraCapture = ({ 
  setView, 
  setCapturedImages, 
  isOnline, 
  addToOfflineQueue,
  showTutorial,
  setShowTutorial,
  opencvLoaded
}) => {
  const [captureStep, setCaptureStep] = useState('preparation'); // 'preparation', 'positioning', 'capturing', 'review', 'analysis'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [captureMode, setCaptureMode] = useState('leaf'); // 'leaf', 'plant', 'field'
  const [cropType, setCropType] = useState('');
  const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
  const [environmentalData, setEnvironmentalData] = useState({
    temperature: null,
    humidity: null,
    soilMoisture: null,
    lightLevel: null
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [captureInstructions, setCaptureInstructions] = useState([]);
  
  // Video and stream refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analysisCanvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // Analysis state
  const [liveAnalysis, setLiveAnalysis] = useState({
    focusScore: 0,
    lightingScore: 0,
    framingScore: 0,
    plantDetected: false,
    recommendations: [],
    qualityScore: 0
  });
  
  const [detectionOverlay, setDetectionOverlay] = useState({
    contours: [],
    spots: [],
    discoloration: [],
    edges: []
  });

  // Initialize camera
  useEffect(() => {
    if (captureStep === 'positioning' || captureStep === 'capturing') {
      startCamera();
      return () => stopCamera();
    }
  }, [captureStep]);

  // Load capture instructions based on mode
  useEffect(() => {
    const instructions = {
      leaf: [
        'Place leaf flat against a dark background',
        'Ensure entire leaf is visible',
        'Focus on affected areas',
        'Avoid shadows on the leaf surface',
        'Capture from 15-20cm distance'
      ],
      plant: [
        'Capture entire plant structure',
        'Include leaves, stem, and soil',
        'Show overall plant posture',
        'Highlight multiple affected areas',
        'Keep background simple'
      ],
      field: [
        'Capture multiple plants in frame',
        'Show affected area pattern',
        'Include healthy plants for comparison',
        'Note spacing between plants',
        'Show soil condition if visible'
      ]
    };
    setCaptureInstructions(instructions[captureMode] || instructions.leaf);
  }, [captureMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 60 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          // Start live analysis
          startLiveAnalysis();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera access required. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startLiveAnalysis = () => {
    const analyzeFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        performLiveAnalysis();
      }
      requestAnimationFrame(analyzeFrame);
    };
    analyzeFrame();
  };

  const performLiveAnalysis = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Basic analysis
    const focusScore = analyzeFocus(imageData);
    const lightingScore = analyzeLighting(imageData);
    const framingScore = analyzeFraming(imageData);
    const plantDetected = await detectPlant(imageData);
    
    const qualityScore = Math.round((focusScore + lightingScore + framingScore) / 3);
    
    setLiveAnalysis({
      focusScore,
      lightingScore,
      framingScore,
      plantDetected,
      qualityScore,
      recommendations: generateRecommendations(focusScore, lightingScore, framingScore, plantDetected)
    });

    // Advanced OpenCV analysis if loaded
    if (opencvLoaded && window.cv) {
      performOpenCVAnalysis(canvas);
    }
  };

  const analyzeFocus = (imageData) => {
    const data = imageData.data;
    let edgeStrength = 0;
    
    // Simple edge detection
    for (let i = 0; i < data.length - 4; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const nextBrightness = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
      edgeStrength += Math.abs(brightness - nextBrightness);
    }
    
    const normalizedScore = Math.min(100, Math.floor(edgeStrength / 1000));
    return normalizedScore;
  };

  const analyzeLighting = (imageData) => {
    const data = imageData.data;
    let totalBrightness = 0;
    let contrast = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
      pixelCount++;
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    // Calculate contrast
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      contrast += Math.abs(brightness - avgBrightness);
    }
    
    const avgContrast = contrast / pixelCount;
    
    // Score based on ideal lighting conditions (120-180 brightness, high contrast)
    let score = 100;
    
    if (avgBrightness < 80) score -= 40;
    else if (avgBrightness < 120) score -= 20;
    else if (avgBrightness > 220) score -= 30;
    else if (avgBrightness > 180) score -= 10;
    
    if (avgContrast < 20) score -= 30;
    else if (avgContrast < 40) score -= 15;
    
    return Math.max(0, score);
  };

  const analyzeFraming = (imageData) => {
    // Analyze composition and framing
    const width = imageData.width;
    const height = imageData.height;
    
    // Check if there's a subject in center (rule of thirds)
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const centerSize = Math.floor(Math.min(width, height) * 0.3);
    
    let centerBrightness = 0;
    let centerCount = 0;
    
    for (let y = centerY - centerSize; y < centerY + centerSize; y++) {
      for (let x = centerX - centerSize; x < centerX + centerSize; x++) {
        const idx = (y * width + x) * 4;
        if (idx >= 0 && idx < imageData.data.length) {
          centerBrightness += (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
          centerCount++;
        }
      }
    }
    
    const avgCenterBrightness = centerBrightness / centerCount;
    
    // Compare with edges
    let edgeBrightness = 0;
    let edgeCount = 0;
    
    // Sample edges
    for (let x = 0; x < width; x += 10) {
      for (let y = 0; y < 20; y += 5) {
        const idx = (y * width + x) * 4;
        if (idx < imageData.data.length) {
          edgeBrightness += (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
          edgeCount++;
        }
      }
    }
    
    for (let x = 0; x < width; x += 10) {
      for (let y = height - 20; y < height; y += 5) {
        const idx = (y * width + x) * 4;
        if (idx < imageData.data.length) {
          edgeBrightness += (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
          edgeCount++;
        }
      }
    }
    
    const avgEdgeBrightness = edgeBrightness / edgeCount;
    
    // Good framing: subject in center, edges less interesting
    const brightnessDiff = Math.abs(avgCenterBrightness - avgEdgeBrightness);
    let score = 50; // Base score
    
    if (brightnessDiff > 30) score += 30; // Good subject isolation
    if (brightnessDiff > 50) score += 20;
    
    return Math.min(100, score);
  };

  const detectPlant = async (imageData) => {
    // Simple color-based plant detection
    const data = imageData.data;
    let greenPixelCount = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect green pixels (plant-like colors)
      if (g > r * 1.2 && g > b * 1.2 && g > 50) {
        greenPixelCount++;
      }
      totalPixels++;
    }
    
    const greenPercentage = (greenPixelCount / totalPixels) * 100;
    return greenPercentage > 5; // At least 5% green indicates plant
  };

  const generateRecommendations = (focus, lighting, framing, plantDetected) => {
    const recommendations = [];
    
    if (focus < 70) {
      recommendations.push('Hold camera steadier for better focus');
    }
    if (lighting < 70) {
      recommendations.push('Improve lighting conditions');
    }
    if (framing < 60) {
      recommendations.push('Center the plant in frame');
    }
    if (!plantDetected) {
      recommendations.push('Aim camera at plant/leaf');
    }
    if (recommendations.length === 0) {
      recommendations.push('Perfect! Ready to capture');
    }
    
    return recommendations;
  };

  const performOpenCVAnalysis = (canvas) => {
    try {
      const src = window.cv.imread(canvas);
      const gray = new window.cv.Mat();
      const edges = new window.cv.Mat();
      const contours = new window.cv.MatVector();
      const hierarchy = new window.cv.Mat();
      
      // Convert to grayscale
      window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);
      
      // Detect edges
      window.cv.Canny(gray, edges, 50, 150);
      
      // Find contours
      window.cv.findContours(edges, contours, hierarchy, window.cv.RETR_EXTERNAL, window.cv.CHAIN_APPROX_SIMPLE);
      
      // Process contours for detection overlay
      const detectedContours = [];
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = window.cv.contourArea(contour);
        if (area > 100) { // Filter small contours
          const moments = window.cv.moments(contour);
          if (moments.m00 !== 0) {
            const cx = moments.m10 / moments.m00;
            const cy = moments.m01 / moments.m00;
            detectedContours.push({
              x: cx,
              y: cy,
              area,
              points: Array.from(contour.data32S)
            });
          }
        }
      }
      
      setDetectionOverlay(prev => ({
        ...prev,
        contours: detectedContours
      }));
      
      // Clean up
      src.delete();
      gray.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
    } catch (error) {
      console.error('OpenCV analysis error:', error);
    }
  };

  const captureImage = () => {
    setCaptureStep('capturing');
    
    setTimeout(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Apply enhancements
        enhanceImage(ctx, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedPhoto(imageData);
        
        // Perform detailed analysis
        const analysis = performDetailedAnalysis(ctx, canvas.width, canvas.height);
        setAnalysisResult(analysis);
        
        setCaptureStep('review');
      }
    }, 1000);
  };

  const enhanceImage = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Simple enhancement: increase contrast and saturation
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      const factor = 1.2;
      data[i] = clamp(data[i] * factor, 0, 255);     // R
      data[i + 1] = clamp(data[i + 1] * factor, 0, 255); // G
      data[i + 2] = clamp(data[i + 2] * factor, 0, 255); // B
      
      // Slight saturation boost for green channel (plants)
      data[i + 1] = clamp(data[i + 1] * 1.1, 0, 255);
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  const performDetailedAnalysis = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let totalBrightness = 0;
    let greenPixelCount = 0;
    let brownPixelCount = 0;
    let yellowPixelCount = 0;
    let spotCount = 0;
    
    // Analyze pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      
      // Detect plant health colors
      if (g > r * 1.3 && g > b * 1.3) {
        greenPixelCount++; // Healthy green
      } else if (r > g * 1.2 && r > b * 1.2 && r > 150) {
        brownPixelCount++; // Browning
      } else if (r > 180 && g > 180 && b < 100) {
        yellowPixelCount++; // Yellowing
      }
      
      // Detect potential spots (sudden color changes)
      if (i > 4) {
        const prevBrightness = (data[i-4] + data[i-3] + data[i-2]) / 3;
        if (Math.abs(brightness - prevBrightness) > 50) {
          spotCount++;
        }
      }
    }
    
    const totalPixels = data.length / 4;
    const greenPercentage = (greenPixelCount / totalPixels) * 100;
    const brownPercentage = (brownPixelCount / totalPixels) * 100;
    const yellowPercentage = (yellowPixelCount / totalPixels) * 100;
    const spotDensity = spotCount / totalPixels;
    
    // Calculate health score
    let healthScore = 100;
    healthScore -= brownPercentage * 2;
    healthScore -= yellowPercentage * 1.5;
    healthScore -= Math.min(50, spotDensity * 1000);
    healthScore = Math.max(0, Math.round(healthScore));
    
    // Determine likely issues
    const issues = [];
    if (brownPercentage > 5) issues.push('Leaf browning detected');
    if (yellowPercentage > 5) issues.push('Yellowing observed');
    if (spotDensity > 0.05) issues.push('Possible disease spots');
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
      spotDensity: Math.round(spotDensity * 1000) / 10,
      issues,
      recommendations,
      timestamp: new Date().toISOString(),
      captureMode,
      cropType
    };
  };

  const saveCapture = () => {
    if (capturedPhoto && analysisResult) {
      const captureData = {
        data: capturedPhoto,
        analysis: analysisResult,
        environmentalData,
        diseaseSymptoms,
        timestamp: Date.now(),
        metadata: {
          mode: captureMode,
          crop: cropType,
          qualityScore: liveAnalysis.qualityScore
        }
      };
      
      setCapturedImages(prev => [...prev, captureData]);
      
      if (!isOnline) {
        addToOfflineQueue(captureData);
      }
      
      setCaptureStep('analysis');
      setTimeout(() => {
        setView('home');
      }, 5000);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysisResult(null);
    setCaptureStep('positioning');
  };

  const getEnvironmentalData = async () => {
    // Simulate environmental data collection
    // In real app, this would come from device sensors or user input
    const mockData = {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      soilMoisture: Math.floor(Math.random() * 50) + 30, // 30-80%
      lightLevel: Math.floor(Math.random() * 60) + 40 // 40-100%
    };
    setEnvironmentalData(mockData);
  };

  // Render different steps
  const renderStep = () => {
    switch (captureStep) {
      case 'preparation':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView('home')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Capture Preparation</h1>
                <div className="w-10"></div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Capture Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['leaf', 'plant', 'field'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setCaptureMode(mode)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            captureMode === mode
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {mode === 'leaf' && <Leaf className="w-6 h-6" />}
                            {mode === 'plant' && <Sprout className="w-6 h-6" />}
                            {mode === 'field' && <Trees className="w-6 h-6" />}
                            <span className="capitalize font-medium">{mode}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Type (Optional)
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observed Symptoms (Select all that apply)
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

                  <div>
                    <button
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <span className="font-medium">Advanced Settings</span>
                      {showAdvancedSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showAdvancedSettings && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
                        <button
                          onClick={getEnvironmentalData}
                          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          Collect Environmental Data
                        </button>
                        
                        {environmentalData.temperature && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white rounded-lg">
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium">Temperature</span>
                              </div>
                              <p className="text-lg font-bold mt-1">{environmentalData.temperature}°C</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg">
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium">Humidity</span>
                              </div>
                              <p className="text-lg font-bold mt-1">{environmentalData.humidity}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setCaptureStep('positioning')}
                      className="w-full p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                      Continue to Camera
                    </button>
                  </div>
                </div>
              </div>

              {/* Capture Instructions */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Capture Instructions for {captureMode} Mode
                </h3>
                <ul className="space-y-2">
                  {captureInstructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-purple-800">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'positioning':
      case 'capturing':
        return (
          <div className="fixed inset-0 bg-black">
            {/* Camera View */}
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Analysis Overlay */}
              <canvas
                ref={analysisCanvasRef}
                className="absolute inset-0 pointer-events-none"
              />
              
              {/* Guidance Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-2xl aspect-square">
                  {/* Focus Frame */}
                  <div className="absolute inset-0 border-4 border-white border-opacity-30 rounded-3xl"></div>
                  
                  {/* Corner Indicators */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl animate-pulse"></div>
                  
                  {/* Center Crosshair */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Crosshair className="w-12 h-12 text-white opacity-50" />
                  </div>
                </div>
              </div>
              
              {/* Live Analysis Panel */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Scan className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold">Live Analysis</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      liveAnalysis.qualityScore >= 80 ? 'bg-emerald-500' :
                      liveAnalysis.qualityScore >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      <span className="font-bold">{liveAnalysis.qualityScore}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm opacity-75">Focus</div>
                      <div className={`text-lg font-bold ${
                        liveAnalysis.focusScore >= 70 ? 'text-emerald-400' :
                        liveAnalysis.focusScore >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {liveAnalysis.focusScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-75">Lighting</div>
                      <div className={`text-lg font-bold ${
                        liveAnalysis.lightingScore >= 70 ? 'text-emerald-400' :
                        liveAnalysis.lightingScore >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {liveAnalysis.lightingScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-75">Framing</div>
                      <div className={`text-lg font-bold ${
                        liveAnalysis.framingScore >= 70 ? 'text-emerald-400' :
                        liveAnalysis.framingScore >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {liveAnalysis.framingScore}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                    <p className="text-sm opacity-75 mb-1">Recommendations:</p>
                    <p className="text-sm">
                      {liveAnalysis.recommendations[0] || 'Adjusting...'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Capture Controls */}
              <div className="absolute bottom-6 left-0 right-0">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={captureImage}
                    disabled={liveAnalysis.qualityScore < 60 || !liveAnalysis.plantDetected}
                    className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${
                      liveAnalysis.qualityScore >= 80 && liveAnalysis.plantDetected
                        ? 'bg-emerald-500 border-emerald-300 hover:scale-110'
                        : 'bg-gray-600 border-gray-400 opacity-50'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                      <Camera className="w-10 h-10 text-emerald-600" />
                    </div>
                  </button>
                  
                  <p className="text-white text-center">
                    {liveAnalysis.plantDetected ? (
                      <span className="text-emerald-300">✓ Plant detected</span>
                    ) : (
                      <span className="text-yellow-300">⚠️ Aim at plant</span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Back Button */}
              <button
                onClick={() => setCaptureStep('preparation')}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={retakePhoto}
                  className="flex items-center gap-2 text-white hover:text-gray-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Retake</span>
                </button>
                <h1 className="text-2xl font-bold text-white">Capture Review</h1>
                <button
                  onClick={saveCapture}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                >
                  <Check className="w-5 h-5" />
                  <span>Save & Analyze</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Captured Image */}
                <div className="bg-black rounded-2xl overflow-hidden">
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    className="w-full h-96 object-contain"
                  />
                </div>

                {/* Preliminary Analysis */}
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Preliminary Analysis</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">Health Score</span>
                          <span className={`font-bold ${
                            analysisResult.healthScore >= 70 ? 'text-emerald-400' :
                            analysisResult.healthScore >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {analysisResult.healthScore}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              analysisResult.healthScore >= 70 ? 'bg-emerald-500' :
                              analysisResult.healthScore >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${analysisResult.healthScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900 p-3 rounded-lg">
                          <div className="text-sm text-gray-400">Healthy Green</div>
                          <div className="text-lg font-bold text-emerald-400">
                            {analysisResult.greenPercentage}%
                          </div>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg">
                          <div className="text-sm text-gray-400">Browning</div>
                          <div className="text-lg font-bold text-yellow-600">
                            {analysisResult.brownPercentage}%
                          </div>
                        </div>
                      </div>

                      {analysisResult.issues.length > 0 && (
                        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
                          <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Detected Issues
                          </h4>
                          <ul className="space-y-1">
                            {analysisResult.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-red-300">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Capture Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mode</span>
                        <span className="text-white capitalize">{captureMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Crop Type</span>
                        <span className="text-white">{cropType || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Image Quality</span>
                        <span className="text-emerald-400">{liveAnalysis.qualityScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-800">Analysis Complete!</h1>
                  <p className="text-gray-600 mt-2">
                    Your {captureMode} capture has been analyzed and saved
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
                        // In real app, this would navigate to detailed analysis
                        alert('Detailed analysis would show here with treatment recommendations');
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
                    >
                      View Detailed Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderStep();
};

const MultiImageUpload = ({ setView, setCapturedImages, isOnline, addToOfflineQueue }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            data: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setSelectedImages(prev => [...prev, ...images]);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = () => {
    const analysisPromises = selectedImages.map(img => {
      return new Promise((resolve) => {
        // Simulate analysis
        const analysis = {
          healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
          greenPercentage: Math.floor(Math.random() * 30) + 60,
          brownPercentage: Math.floor(Math.random() * 20),
          yellowPercentage: Math.floor(Math.random() * 15),
          spotDensity: Math.random() * 10,
          issues: ['Uploaded image - analysis pending'],
          recommendations: ['Complete analysis in main app'],
          timestamp: new Date().toISOString()
        };
        
        resolve({
          ...img,
          analysis
        });
      });
    });

    Promise.all(analysisPromises).then(analyzedImages => {
      setCapturedImages(prev => [...prev, ...analyzedImages]);
      
      if (!isOnline) {
        analyzedImages.forEach(img => {
          addToOfflineQueue({ type: 'image', data: img, timestamp: Date.now() });
        });
      }
      
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setView('home');
      }, 2000);
    });
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
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3 mb-6"
          >
            <ImageIcon className="w-7 h-7" />
            Select Images from Gallery
          </button>

          {selectedImages.length > 0 && (
            <>
              <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-3">
                  {selectedImages.length} image(s) selected
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={img.data} 
                        alt={img.name}
                        className="w-full h-28 object-cover rounded-lg border-2 border-gray-300 group-hover:border-blue-400 transition"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={uploadImages}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-3"
              >
                <Upload className="w-7 h-7" />
                Upload & Analyze All Images
              </button>
            </>
          )}

          {showConfirmation && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
              <Check className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Images uploaded successfully!</p>
                <p className="text-sm text-green-700">Analysis in progress...</p>
              </div>
            </div>
          )}
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
                      {img.metadata?.crop || 'Unknown Crop'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(img.timestamp).toLocaleDateString()}
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