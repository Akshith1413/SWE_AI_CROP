SWE_AI_CROP — AI Crop Disease Detection & Advisory System
Overview

SWE_AI_CROP is an AI-powered crop disease detection and advisory application designed to help farmers identify plant diseases and receive treatment recommendations. The system combines a React-based user interface, a CNN-based disease classification model, and an AI advisory module for remediation guidance.

The application supports multilingual interaction, voice assistance, and mobile deployment through Capacitor.

Project Goal

The goal of this project is to build a practical AI-assisted agriculture support tool that:

Detects crop diseases from leaf images

Provides treatment recommendations

Supports low-literacy users with audio guidance

Works across web and Android platforms

Enables offline-first interaction when possible

Tech Stack
Frontend

React (Vite)

Tailwind CSS

Context API

Capacitor (Android support)

i18n translation system

AI / ML

TensorFlow / Keras

CNN (EfficientNet-based transfer learning)

PlantVillage dataset

Backend (planned)

FastAPI / Flask

TensorFlow inference API

LLM integration for treatment recommendations

Deployment

Vercel (Web deployment)

Android build via Capacitor

Project Structure
SWE_AI_CROP
│
├── android/                # Capacitor Android project
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── translations/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── firebase.js
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md

Current Features
User Access

Language selection

Consent screen

Guest mode

Login UI

User profile page

Capture & Input

Camera capture interface

Image upload UI

Voice guidance hooks

Audio feedback components

Disease Detection (AI Pipeline — in progress)

CNN model training using PlantVillage dataset

Image preprocessing pipeline

Model export for inference

Advisory System

LLM advice page

Crop advice card components

Service layer for AI responses

Localization

Multiple language support:

Hindi

English

Tamil

Telugu

Kannada

Marathi

Bengali

Gujarati

Punjabi

Malayalam

Odia

Urdu

Assamese

Nepali

Sanskrit

Deployment

Web app:
https://swe-ai-crop.vercel.app/

Android build supported via Capacitor.

CNN Model Training

The disease detection model is trained using:

Dataset:
PlantVillage Dataset

Architecture:
Transfer learning using EfficientNetB0

Training environment:
Kaggle GPU / Colab GPU

Model output:

crop_disease_model.h5


This model will be deployed through a backend inference API.

Planned System Flow
User captures image
        ↓
React uploads image
        ↓
Backend inference API
        ↓
CNN predicts disease
        ↓
Prediction passed to LLM module
        ↓
Treatment advice generated
        ↓
Advice displayed + audio playback

How to Run the Project

Install dependencies:

npm install


Run locally:

npm run dev


Build:

npm run build

Team Roles

Dhanuja — Backend Engineer
Bhuvaneshwari — DevOps Engineer
Ramaroshinee — Frontend & Backend Developer
Akshith — Frontend Developer
Saketh — Testing Engineer

Future Improvements

Real-time CNN inference API

Offline model inference support

Region-specific treatment recommendations

Push notifications

Farmer feedback loop

Model performance optimization

Dataset expansion for local crops
