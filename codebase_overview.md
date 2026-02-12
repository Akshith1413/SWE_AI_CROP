# codebase_overview.md

## Project Overview
**Name**: CropAId (based on package.json)
**Type**: React Web Application (Vite + Tailwind CSS)
**Purpose**: AI-powered crop disease diagnosis, treatment advice, and farmer community platform. Features offline support and multi-language capabilities.

## Directory Structure

### Root Directory `c:\SWE_AI`
- **`package.json`**: Project configuration, dependencies (React, Firebase, TensorFlow.js, Capacitor), and scripts.
- **`vite.config.js`**: Vite build configuration.
- **`tailwind.config.js`**: Tailwind CSS styling configuration.
- **`src/`**: Source code directory.
- **`server/`**: (Currently empty) Placeholder for backend server code.

### Source Directory `src/`

#### 1. Entry Points & Configuration
- **`main.jsx`**: Application entry point. Mounts the React app to the DOM.
- **`App.jsx`**: Main application component.
    - **Function**: Handles top-level routing (`/`, `/home`, `/llm-advice`), global providers (`LanguageProvider`, `ToastContainer`), and the authentication flow (Loading -> Landing -> Consent -> Login -> Main App).
    - **Key Components**: `MainAppFlow`, `CropDiagnosisApp`.

#### 2. Core Components (`src/components/`)
This directory contains the building blocks of the UI.

- **`HomePage.jsx`** (Landing Page)
    - **Function**: Public-facing landing page.
    - **Features**: 3D particle animation background, scroll progress, features showcase, tech stack visualization, and "Launch App" CTAs.
    - **Components**: `Particle` class (3D animation), `Hero Section`, `Features Grid`.

- **`CropDiagnosisApp.jsx`** (Main Dashboard)
    - **Function**: The central hub for the authenticated user.
    - **Features**:
        - **Navigation**: Switch between Home, Camera, Upload, Analysis, Profile, Community, etc.
        - **Camera Logic**: `EnhancedCompleteCameraCapture` handles video stream, live quality analysis (blur/brightness), and capturing.
        - **Offline Support**: Manages `offlineQueue` and `isOnline` state.
    - **Sub-components defined in file**: `HomeView`, `EnhancedCompleteCameraCapture`.

- **`UserProfile.jsx`**
    - **Function**: User profile and crop management.
    - **Features**: Allows users to select/deselect crops they grow, search crops, and save preferences. Syncs with backend.
    - **Key Functions**: `loadData`, `toggleCrop`, `handleSave`.

- **`LLMAdvicePage.jsx`** (Located in `src/pages/`)
    - **Function**: Displays detailed, AI-generated treatment advice.
    - **Features**:
        - **Diagnosis Info**: Shows Crop, Disease, Severity, Confidence.
        - **Advice Cards**: Structured advice (Cause, Symptoms, Chemical, Organic, Prevention).
        - **Offline Cache**: Checks `offlineSync` cache before fetching API.
        - **Interactive**: Allows editing diagnosis details to regenerate advice.

- **Other Components** (Inferred from usage):
    - **`LoginScreen.jsx`**: User authentication interface.
    - **`LanguageScreen.jsx`**: Language selection interface.
    - **`ConsentScreen.jsx`**: Privacy/Terms consent flow.
    - **`CommunityScreen.jsx`**: Farmer community/forum interface.
    - **`CalendarScreen.jsx`**: Crop calendar/task management.
    - **`ConfirmationToast.jsx`**: Custom toast notification system.

#### 3. Services (`src/services/`)
Handles business logic, API calls, and data management.

- **`api.js`**
    - **Function**: Centralized API client.
    - **Endpoints**: Auth, User, Crops, Settings, Consent, Diagnosis, Community, Calendar.
    - **Offline Handling**: Checks `navigator.onLine`. If offline, reads/writes to `offlineSync` or returns queued actions.

- **`aiService.js`**
    - **Function**: Mock AI inference service for development/demo.
    - **Logic**: Simulates disease detection with random confidence scores and heatmaps. Returns structured diagnosis data (symptoms, treatments) from a local `DISEASE_DATABASE`.

- **`offlineSync.js`** *(Inferred)*: Manages local storage caching and queuing actions when offline.
- **`cropService.js`** *(Inferred)*: Wrapper around `api.crops` for fetching/saving user crops.
- **`audioService.js`** *(Inferred)*: Handles text-to-speech and UI sound effects.
- **`preferencesService.js`** *(Inferred)*: Manages user settings persistence.
- **`consentService.js`** *(Inferred)*: Manages user consent state.

#### 4. Context & Hooks (`src/context/`, `src/hooks/`)
- **`LanguageContext`**: Global state for current language.
- **`useTranslation`**: Hook for retrieving localized strings.

## Data Flow Summary
1.  **User Action**: User captures an image in `CropDiagnosisApp`.
2.  **Service Call**: `aiService.analyze(image)` is called.
3.  **Result**: AI service returns diagnosis (currently mocked).
4.  **Integration**: Application directs user to `LLMAdvicePage` or shows results overlay.
5.  **API/Storage**: 
    - **Online**: `api.diagnosis.save()` sends data to backend.
    - **Offline**: Data is stored in `offlineQueue` via `offlineSync`.
6.  **Advice**: `LLMAdvicePage` fetches detailed treatment plan from `/api/crop-advice`.

## Key Technologies
- **UI**: React 18+, Tailwind CSS, Lucide React (Icons).
- **Hardward Access**: `@capacitor/camera` (Mobile camera access).
- **ML/AI**: `@tensorflow/tfjs`, `@tensorflow-models/coco-ssd` included in dependencies (likely for future real implementation).
- **State Management**: React `useState`, `useEffect`, Context API.
- **Routing**: `react-router-dom`.
