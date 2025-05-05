import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Now get the key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment!")

# Pass it to the OpenAI client
client = OpenAI(api_key=api_key)


def generate_gpt4_recommendations(entry_text, mood, emotion):
    prompt = f"""
You are a compassionate AI therapist. A user wrote this diary entry:

"{entry_text}"

The user's mood is {mood} and their primary emotion is {emotion}.
Generate:
1. A short emotional summary (2-3 sentences).
2. Three kind, personal, and helpful self-care recommendations.

Format your response with bullet points.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an empathetic AI that provides mental health guidance."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print("GPT-4 API error:", e)
        return "Sorry, we couldn't generate recommendations at this time."
