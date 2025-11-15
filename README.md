# 🛡️ AI Phishing Detection System

**Live Demo:** https://app.ridox.dev/phishing-demo

Privacy-first phishing detection using Hybrid ML + Local LLM.

## ✨ Features

- ✅ **RandomForest ML** + **DeepSeek R1 LLM**
- ✅ **100% Local Processing** - No external APIs
- ✅ **Zero Monthly Costs** - Self-hosted infrastructure
- ✅ **Explainable AI** - Detailed threat analysis
- ✅ **3-Tier Classification** - Phishing/Suspicious/Legitimate

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/phishing-detection-ai.git

# Install dependencies
cd phishing-detection-ai
npm install

# Run development
npm run dev
```

Visit http://localhost:3000/phishing-demo

## 📚 Documentation

- [📖 Complete Documentation](./docs/PROJECT_DOCUMENTATION.md)
- [🎤 Presentation Guide](./docs/PRESENTATION_GUIDE.md)
- [⚖️ Ethical Framework](./docs/ETHICAL_FRAMEWORK.md)
- [🏗️ Architecture](./docs/ARCHITECTURE.md)

## 🎯 Project Overview

**Problem:** Email phishing costs $26B annually

**Solution:** Hybrid system combining:
1. Machine Learning (RandomForest) - Fast classification
2. Local LLM (DeepSeek R1) - Explainable reasoning
3. Self-hosted infrastructure - Privacy + Cost savings

**Results:**
- 85-90% accuracy
- <5 second response time
- 90% cost savings vs cloud APIs

## 📊 System Architecture
```
User → Next.js UI → n8n Workflow → ML Model → AI Analysis → Response
                         ↓              ↓           ↓
                    PostgreSQL    Python API   Ollama LLM
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **ML:** Python, scikit-learn, RandomForest
- **AI:** Ollama, DeepSeek R1 (20B params)
- **Orchestration:** n8n workflow engine
- **Infrastructure:** Docker, NVIDIA GPU, Proxmox

## 📸 Screenshots

![Demo](./docs/images/demo-screenshot.png)

## 👥 Team

**Author:** Hubert  
**Domain:** ridox.dev  
**Course:** Cybersecurity & AI  

## 📄 License

MIT License

## 🙏 Acknowledgments

- DeepSeek AI for R1 model
- Ollama for LLM deployment
- Claude AI for development assistance
