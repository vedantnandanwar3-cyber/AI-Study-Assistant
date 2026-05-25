import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect("../database/study.db", check_same_thread=False)

cursor = conn.cursor()


cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT
)
""")

conn.commit()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
""")

conn.commit()

@app.get("/")
def home():
    return {"message": "AI Study Assistant Backend Running"}

@app.get("/tasks")
def get_tasks():

    cursor.execute("SELECT * FROM tasks")

    data = cursor.fetchall()

    tasks = []

    for row in data:
        tasks.append({
            "id": row[0],
            "task": row[1]
        })

    return tasks

@app.post("/tasks")
def add_task(task: dict):

    cursor.execute(
        "INSERT INTO tasks (task) VALUES (?)",
        (task["task"],)
    )

    conn.commit()

    return {
        "message": "Task Added Successfully"
    }
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )
    """)

conn.commit()

@app.post("/signup")
def signup(user: dict):

    cursor.execute(
        "SELECT * FROM users WHERE username=?",
        (user["username"],)
    )

    existing_user = cursor.fetchone()

    if existing_user:

        return {
            "message": "Username Already Exists"
        }

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (user["username"], user["password"])
    )

    conn.commit()

    return {
        "message": "User Registered Successfully"
    }
    
@app.post("/login")
def login(user: dict):

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (user["username"], user["password"])
    )

    existing_user = cursor.fetchone()

    if existing_user:

        return {
            "message": "Login Successful"
        }

    return {
        "message": "Invalid Credentials"
    }
    

@app.post("/chat")
def chat(data: dict):

    message = data["message"].lower()

    if "python" in message:

        reply = "Python is great for AI, backend, automation, and web development."

    elif "dsa" in message:

        reply = "Practice arrays, strings, recursion, linked lists, and trees daily for strong DSA."

    elif "study" in message:

        reply = "Consistency beats motivation. Study 2-3 focused hours daily."

    elif "fastapi" in message:

        reply = "FastAPI is a modern Python backend framework used for APIs and AI applications."

    elif "hello" in message or "hi" in message:

        reply = "Hello Vedant 👋 How can I help you today?"

    elif "motivate" in message:

        reply = "Small daily progress creates massive long-term results 🚀"

    else:

        reply = "I'm your AI Study Assistant. Ask me about Python, DSA, FastAPI, or study tips."

    return {
        "reply": reply
    }