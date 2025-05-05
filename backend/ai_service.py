from textblob import TextBlob
import numpy as np
from datetime import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

class AIDiaryService:
    def __init__(self):
        # Download required NLTK data
        nltk.download('vader_lexicon')
        nltk.download('punkt')
        nltk.download('averaged_perceptron_tagger')
        nltk.download('maxent_ne_chunker')
        nltk.download('words')
        
        # Initialize sentiment analyzer
        self.sia = SentimentIntensityAnalyzer()
        
    def analyze_entry(self, text):
        """
        Analyze a diary entry for sentiment, emotions, and key insights
        """
        # Get sentiment scores using NLTK
        sentiment_scores = self.sia.polarity_scores(text)
        
        # Get key phrases and topics using TextBlob
        blob = TextBlob(text)
        key_phrases = blob.noun_phrases
        
        # Calculate sentiment using TextBlob
        sentiment = blob.sentiment
        
        # Determine emotion based on sentiment scores
        emotion = self._determine_emotion(sentiment_scores)
        
        return {
            "sentiment": {
                "label": self._get_sentiment_label(sentiment_scores),
                "score": float(sentiment_scores["compound"]),
                "polarity": sentiment.polarity,
                "subjectivity": sentiment.subjectivity
            },
            "emotion": emotion,
            "key_phrases": list(key_phrases),
            "timestamp": datetime.now().isoformat()
        }
    
    def _determine_emotion(self, sentiment_scores):
        """
        Determine the primary emotion based on sentiment scores
        """
        if sentiment_scores["compound"] >= 0.5:
            return {"label": "Happy", "score": sentiment_scores["compound"]}
        elif sentiment_scores["compound"] <= -0.5:
            return {"label": "Sad", "score": abs(sentiment_scores["compound"])}
        elif sentiment_scores["neg"] > 0.5:
            return {"label": "Angry", "score": sentiment_scores["neg"]}
        else:
            return {"label": "Neutral", "score": 0.5}
    
    def _get_sentiment_label(self, sentiment_scores):
        """
        Get sentiment label based on compound score
        """
        if sentiment_scores["compound"] >= 0.05:
            return "Positive"
        elif sentiment_scores["compound"] <= -0.05:
            return "Negative"
        else:
            return "Neutral"
    
    def analyze_entries_trend(self, entries):
        """
        Analyze multiple entries to detect mood trends and patterns
        """
        if not entries:
            return None
            
        sentiments = []
        emotions = []
        dates = []
        
        for entry in entries:
            analysis = self.analyze_entry(entry["content"])
            sentiments.append(analysis["sentiment"]["polarity"])
            emotions.append(analysis["emotion"]["score"])
            dates.append(datetime.fromisoformat(entry["date"]))
        
        # Calculate trend
        sentiment_trend = np.polyfit(range(len(sentiments)), sentiments, 1)[0]
        emotion_trend = np.polyfit(range(len(emotions)), emotions, 1)[0]
        
        return {
            "sentiment_trend": float(sentiment_trend),
            "emotion_trend": float(emotion_trend),
            "average_sentiment": float(np.mean(sentiments)),
            "average_emotion": float(np.mean(emotions)),
            "analysis_period": {
                "start": min(dates).isoformat(),
                "end": max(dates).isoformat()
            }
        }
    
    def generate_insights(self, entries):
        """s
        Generate insights and recommendations based on diary entries
        """
        if not entries:
            return None
            
        trend_analysis = self.analyze_entries_trend(entries)
        latest_entry = entries[-1]
        latest_analysis = self.analyze_entry(latest_entry["content"])
        
        insights = []
        
        # Mood trend insights
        if trend_analysis["sentiment_trend"] > 0.1:
            insights.append("Your overall mood has been improving recently.")
        elif trend_analysis["sentiment_trend"] < -0.1:
            insights.append("You've been feeling more down lately.")
        
        # Emotion insights
        if latest_analysis["emotion"]["score"] > 0.8:
            insights.append(f"You're experiencing strong {latest_analysis['emotion']['label']} emotions.")
        
        # Key topics insights
        if latest_analysis["key_phrases"]:
            insights.append(f"Recent entries focus on: {', '.join(latest_analysis['key_phrases'][:3])}")
        
        return {
            "insights": insights,
            "trend_analysis": trend_analysis,
            "latest_analysis": latest_analysis
        } 