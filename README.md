# MindMuse 🧠📓  
AI-Powered Mental Health Journaling Web App

MindMuse is a full-stack web application that helps users reflect on their mental well-being through daily journaling, AI-generated insights, and emotion tracking. By combining modern web technologies with natural language processing, MindMuse empowers users to understand and manage their emotional health in a private, intelligent way.

---

## 🌟 Features

- 📝 **Smart Journaling:** Write daily entries and receive AI-generated reflections based on mood and content.
- 🎯 **Emotion Detection:** Uses NLP to classify emotions from journal entries using Hugging Face models.
- 📈 **Mood Trends:** Interactive calendar and charts visualize emotional patterns over time.
- 🔐 **User Privacy:** Secure authentication (JWT) and encrypted data storage for complete privacy.
- 💡 **AI Integration:** Personalized recommendations powered by GPT and emotion classifiers.

---

## 🛠️ Tech Stack

**Frontend:**  
- React  
- Chart.js  
- Tailwind CSS  

**Backend:**  
- Python (Flask)  
- Hugging Face Transformers (Emotion Detection)  
- OpenAI GPT (Reflections)  
- MongoDB  
- JWT (Authentication)  
- Fernet Encryption  

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mindmuse.git
cd mindmuse
```

### 2. Backend Setup (Flask API)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables
Create a .env file in your backend directory with the following safe template (DO NOT share the actual values)
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
FERNET_KEY=your_fernet_encryption_key
```

## 🤖 AI Models Used

- [`bsingh/roberta_goEmotion`](https://huggingface.co/bsingh/roberta_goEmotion) – Emotion classification based on Google’s GoEmotions dataset  
- [OpenAI GPT API](https://platform.openai.com) – Personalized reflections and recommendations  

