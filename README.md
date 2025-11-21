# Voice Controlled Web Music Player

A full stack application that allows users to control music playback using real-time **voice commands**.

---

## Features

### Voice Control

* Web Speech API
* Real-time transcription
* Intent → action system
* Toast feedback notifications

### Music Player

* Stream MP3s from backend
* Play / Pause / Next / Previous
* Shuffle mode
* Seek

### 🗄️ Backend + DB

* Node.js + Express
* MongoDB for metadata
* Streaming via `fs.createReadStream`

### Frontend

* React + TailwindCSS

---

## Tech Stack

* **Frontend:** React, TailwindCSS, Context API
* **Backend:** Node.js, Express, MongoDB
* **ASR:** Web Speech API
* **Audio:** HTMLAudioElement

---

## 📂 Project Structure

```
project/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── uploads/
│   └── config/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── utils/
    │   ├── services/
    │   └── api/
    └── public/
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=mongodb://localhost:27017/musicdb
PORT=3000
```

Run backend:

```bash
npm start
```

Backend runs at **[http://localhost:3000](http://localhost:3000)**

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **[http://localhost:5173](http://localhost:5173)**

---

## Supported Voice Commands

### Playback

* "play"
* "pause"
* "next"
* "previous"

### Search / Play by Name

* "play *starboy*"
* "play *song_name*"
* "search *song_name*"


### Seek

* "jump to 45 seconds"

### Shuffle

* "shuffle"

---

## How to Test Locally

1. Run backend
2. Run frontend
3. Click mic
4. Speak commands
5. Check toast feedback

---

## API Endpoints

* **GET /api/tracks** – list tracks
* **GET /api/tracks/search?q=** – search
* **GET /api/tracks/:id/stream** – audio stream

---

## Architecture Overview

```
User → SpeechRecognition → IntentMapper → PlayerService → PlayerContext → AudioPlayer → Backend Stream
```

---

## Limitations

* Web Speech API best in Chrome
* Requires local MP3 files
* No authentication

---

## Demo

https://voicecontrolledmusicplayer.vercel.app/.

---

## Summary

A complete MERN + ASR powered voice-controlled music player with playback control and audio streaming.