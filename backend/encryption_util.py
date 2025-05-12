import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet

load_dotenv()

ENCRYPTION_KEY = os.getenv("FERNET_KEY")

if not ENCRYPTION_KEY:
    raise ValueError("FERNET_KEY is missing in environment variables")

fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_text(plain_text):
    return fernet.encrypt(plain_text.encode()).decode()

def decrypt_text(encrypted_text):
    return fernet.decrypt(encrypted_text.encode()).decode()
