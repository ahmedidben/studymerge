# StudyMerge 🎓

> Merge multiple screenshots into one image and send it to AI — instantly.

![StudyMerge](https://img.shields.io/badge/StudyMerge-v1.0-7F77DD?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

---

## 🧠 The Problem

ChatGPT and most AI tools limit the number of images you can upload for free. Students with multiple screenshots — exam questions, handwritten notes, textbook pages — are forced to either pay or send images one by one, losing context.

## ✅ The Solution

**StudyMerge** takes all your screenshots, merges them into one clean labeled grid image, and opens ChatGPT so you can upload it immediately. One image. Full context. Zero cost.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼 Image Merge | Combine up to 10 images into a 2×2 or 3×3 labeled grid |
| ⌨️ OCR | Extract text from any screenshot instantly |
| 🌙 Dark / Light mode | Toggle between dark and light theme |
| 📱 Responsive | Works perfectly on mobile, tablet, and desktop |
| ⚡ No backend | Everything runs in the browser — no server needed |
| 🔒 Private | Your images never leave your device |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/ahmedidben/studymerge.git

# Enter the project folder
cd studymerge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite 5** — Build tool
- **Tesseract.js** — OCR engine (runs in browser)
- **HTML Canvas API** — Image merging

---

## 📁 Project Structure
```
studymerge/
├── src/
│   ├── App.tsx          # Main UI component
│   ├── mergeImages.ts   # Image merging logic
│   ├── extractText.ts   # OCR logic
│   ├── useTrials.ts     # Trial counter hook
│   └── index.css        # Global styles
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🗺 Roadmap

- [x] Image merging with grid layout
- [x] Labels on each image
- [x] OCR text extraction
- [x] Dark / Light mode
- [x] Mobile responsive
- [ ] Drag to reorder images
- [ ] Send to Claude / Gemini
- [ ] Chrome extension
- [ ] AI auto-summarize (premium)

---

## 👤 Author

**Ahmed Amine ID-BENADI**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/ahmed-amine-id-benadi-02baba262)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/ahmedidben)

---

## 📄 License

MIT License — free to use, modify, and share.

---

<p align="center">Built for students, by a student ♥</p>
```

Save the file then run these three commands one at a time:

**Command 1:**
```
git add .
```

**Command 2:**
```
git commit -m "add professional README"
```

**Command 3:**
```
git push
