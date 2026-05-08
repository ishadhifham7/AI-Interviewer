# 🤖 AI Interview System – Intelligent Mock Interview Platform

AI Interview System is an AI-powered platform designed to simulate real interview experiences. It generates role-specific questions, evaluates responses, and provides structured feedback to help users improve their interview performance.

---

## ✨ Features

- 🎤 AI-generated interview questions based on role or topic   
- 🎙️ Voice-based interaction for interview experience   
- 🧠 Response evaluation and feedback generation  
- 📄 CV-based question generation  
- ⚡ Real-time conversation flow   

---

## 🧠 How It Works

1. User selects role or uploads CV  
2. AI generates relevant interview questions  
3. User responds via voice input  
4. Voice input is converted to text (speech-to-text)  
5. System processes response using AI model  
6. Feedback and next questions are generated    

---

## ⚙️ Tech Stack

- Frontend: React.js  
- Backend: Node.js / Express  
- AI: Gemma 4 / Gemini 3.1 Flash 
- Database: Firebase
- APIs: REST APIs  

---

## 🤖 AI Integration

The system uses a dual-model AI pipeline, combining Gemini and Gemma 4 for specialized roles:

- Gemini 3.1 Flash is used to parse and analyze user CV data, converting it into structured JSON that captures relevant candidate information
- Gemma 4 acts as the core interview engine, using this structured data to generate context-aware questions, evaluate responses, and maintain a realistic interview flow
- The separation ensures clear responsibility between data processing and conversational reasoning, improving control and output quality

Voice responses are processed using speech-to-text before being passed into the interview pipeline for analysis.

---

## 🎙️ Voice Interaction

The platform supports voice-based responses, allowing users to simulate real interview conditions.

- Converts speech to text for AI processing  
- Enables hands-free interaction  
- Creates a more realistic interview experience  

