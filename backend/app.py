from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from ai_service import AIDiaryService
from gpt_service import generate_gpt4_recommendations
import jwt
from functools import wraps
from bson import ObjectId
import logging
from transformers import pipeline

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Initialize MongoDB client
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['ai-diary']

# Initialize AI service
ai_service = AIDiaryService()

# Initialize emotion detection pipeline
try:
    logger.info("Initializing emotion detection pipeline...")
    emotion_analyzer = pipeline(
        "text-classification",
        model="bsingh/roberta_goEmotion",
        return_all_scores=True
    )
    logger.info("Emotion detection pipeline initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize emotion detection: {str(e)}")
    raise

LABEL_MAPPING = {
    "LABEL_0": "admiration",
    "LABEL_1": "amusement",
    "LABEL_2": "anger",
    "LABEL_3": "annoyance",
    "LABEL_4": "approval",
    "LABEL_5": "caring",
    "LABEL_6": "confusion",
    "LABEL_7": "curiosity",
    "LABEL_8": "desire",
    "LABEL_9": "disappointment",
    "LABEL_10": "disapproval",
    "LABEL_11": "disgust",
    "LABEL_12": "embarrassment",
    "LABEL_13": "excitement",
    "LABEL_14": "fear",
    "LABEL_15": "gratitude",
    "LABEL_16": "grief",
    "LABEL_17": "joy",
    "LABEL_18": "love",
    "LABEL_19": "nervousness",
    "LABEL_20": "optimism",
    "LABEL_21": "pride",
    "LABEL_22": "realization",
    "LABEL_23": "relief",
    "LABEL_24": "remorse",
    "LABEL_25": "sadness",
    "LABEL_26": "surprise",
    "LABEL_27": "neutral"
}

def map_emotion_to_mood(emotion):
    positive_emotions = {
        "joy", "love", "gratitude", "excitement", "pride", "optimism",
        "admiration", "approval", "relief", "amusement", "caring"
    }
    negative_emotions = {
        "sadness", "grief", "anger", "remorse", "disappointment", "disgust",
        "fear", "nervousness", "embarrassment", "annoyance", "confusion", "disapproval"
    }
    if emotion in positive_emotions:
        return "positive"
    elif emotion in negative_emotions:
        return "negative"
    else:
        return "neutral"

def analyze_emotion(text):
    try:
        emotions = emotion_analyzer(text)[0]
        sorted_emotions = sorted(emotions, key=lambda x: x['score'], reverse=True)
        top_emotion = sorted_emotions[0]

        primary_label = top_emotion['label']
        primary_emotion = LABEL_MAPPING.get(primary_label, "neutral")
        mood = map_emotion_to_mood(primary_emotion)
        confidence = float(top_emotion['score'])

        secondary_emotions = [
            {
                'emotion': LABEL_MAPPING.get(e['label'], "neutral"),
                'score': e['score']
            }
            for e in sorted_emotions[:3]
        ]

        return {
            'mood': mood,
            'confidence': confidence,
            'primary_emotion': primary_emotion,
            'secondary_emotions': secondary_emotions
        }
    except Exception as e:
        logger.error(f"Error in emotion analysis: {str(e)}")
        return {
            'mood': 'neutral',
            'confidence': 0.5,
            'primary_emotion': 'neutral',
            'secondary_emotions': []
        }


# JWT secret key
SECRET_KEY = os.getenv('JWT_SECRET')

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = ObjectId(data['user_id'])
            current_user = db.users.find_one({'_id': user_id})
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return jsonify({'message': 'Token validation failed'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# Register user
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400

    user = {
        'name': data['name'],
        'email': data['email'],
        'password': data['password']
    }
    result = db.users.insert_one(user)
    token = jwt.encode({'user_id': str(result.inserted_id)}, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token, 'message': 'User created successfully'}), 201

# Login user
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.users.find_one({'email': data['email']})
    if not user or user['password'] != data['password']:
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({'user_id': str(user['_id'])}, SECRET_KEY, algorithm='HS256')
    return jsonify({'token': token})

# Create diary entry
@app.route('/api/entries', methods=['POST'])
@token_required
def create_entry(current_user):
    data = request.get_json()
    title = data.get('title', '')
    content = data.get('content', '')
    if not content:
        return jsonify({'message': 'Content is required', 'error': 'No content provided'}), 400

    try:
        emotion_analysis = analyze_emotion(content)
        ai_recommendations = generate_gpt4_recommendations(
            content,
            emotion_analysis['mood'],
            emotion_analysis['primary_emotion']
        )

        print("Generated GPT-4 recommendation:\n", ai_recommendations)


        entry = {
            'user_id': str(current_user['_id']),
            'title': title,
            'content': content,
            'mood': emotion_analysis['mood'],
            'confidence': emotion_analysis['confidence'],
            'primary_emotion': emotion_analysis['primary_emotion'],
            'secondary_emotions': emotion_analysis['secondary_emotions'],
            'ai_recommendations': ai_recommendations,
            'date': datetime.now().isoformat()
        }
        result = db.entries.insert_one(entry)
        entry['_id'] = str(result.inserted_id)

        return jsonify({'message': 'Entry created successfully', 'entry': entry}), 201
    
    except Exception as e:
        logger.error(f"Error creating entry: {str(e)}")
        return jsonify({'message': 'Error creating entry', 'error': str(e)}), 500

# Get user entries
@app.route('/api/entries', methods=['GET'])
@token_required
def get_entries(current_user):
    try:
        entries = list(db.entries.find({'user_id': str(current_user['_id'])}))
        for entry in entries:
            entry['_id'] = str(entry['_id'])
        return jsonify(entries)
    except Exception as e:
        logger.error(f"Error getting entries: {str(e)}")
        return jsonify({'message': 'Error getting entries', 'error': str(e)}), 500

# Get single entry
@app.route('/api/entries/<entry_id>', methods=['GET'])
@token_required
def get_entry(current_user, entry_id):
    try:
        entry = db.entries.find_one({'_id': ObjectId(entry_id), 'user_id': str(current_user['_id'])})
        if not entry:
            return jsonify({'message': 'Entry not found'}), 404
        entry['_id'] = str(entry['_id'])
        return jsonify(entry)
    except Exception as e:
        logger.error(f"Error getting entry: {str(e)}")
        return jsonify({'message': 'Error getting entry', 'error': str(e)}), 500

# Delete an entry
@app.route('/api/entries/<entry_id>', methods=['DELETE'])
@token_required
def delete_entry(current_user, entry_id):
    try:
        result = db.entries.delete_one({'_id': ObjectId(entry_id), 'user_id': str(current_user['_id'])})
        if result.deleted_count == 0:
            return jsonify({'message': 'Entry not found'}), 404
        return jsonify({'message': 'Entry deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error deleting entry: {str(e)}")
        return jsonify({'message': 'Error deleting entry', 'error': str(e)}), 500

# Get insights
@app.route('/api/insights', methods=['GET'])
@token_required
def get_insights(current_user):
    try:
        entries = list(db.entries.find({'user_id': str(current_user['_id'])}))
        insights = ai_service.generate_insights(entries)
        return jsonify(insights)
    except Exception as e:
        logger.error(f"Error getting insights: {str(e)}")
        return jsonify({'message': 'Error getting insights', 'error': str(e)}), 500


@app.route('/api/ai/interactive-feedback', methods=['POST'])
def interactive_feedback():
    data = request.get_json()
    entry = data.get("entry")
    mood = data.get("mood")
    emotion = data.get("emotion")

    if not entry or not mood or not emotion:
        return jsonify({"error": "Missing entry, mood, or emotion"}), 400

    try:
        result = generate_gpt4_recommendations(entry, mood, emotion)
        return jsonify({"feedback": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)