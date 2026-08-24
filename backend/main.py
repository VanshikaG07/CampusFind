from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
def home():
    return {"message": "CampusFind Backend Running"}


@app.get("/hello")
def hello():
    return {"message": "Hello from CampusFind"}


@app.post("/register")
def register(user: RegisterRequest):

    connection = get_connection()
    cursor = connection.cursor()

    # Check whether email already exists
    cursor.execute(
        "SELECT id FROM users WHERE email = %s",
        (user.email,)
    )

    if cursor.fetchone():
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash the password
    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # Insert user into database
    cursor.execute(
        """
        INSERT INTO users (full_name, email, password_hash, phone)
        VALUES (%s, %s, %s, %s)
        """,
        (
            user.full_name,
            user.email,
            password_hash,
            user.phone
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Registration successful",
        "user": {
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone
        }
    }

@app.post("/login")
def login(user: LoginRequest):

    connection = get_connection()
    cursor = connection.cursor()

    # Find user by email
    cursor.execute(
        "SELECT id, full_name, password_hash, role FROM users WHERE email = %s",
        (user.email,)
    )

    db_user = cursor.fetchone()

    # User doesn't exist
    if not db_user:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Check password
    password_correct = bcrypt.checkpw(
        user.password.encode("utf-8"),
        db_user[2].encode("utf-8")
    )

    if not password_correct:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    cursor.close()
    connection.close()

    return {
        "message": "Login successful",
        "user": {
            "id": db_user[0],
            "full_name": db_user[1],
            "email": user.email,
            "role": db_user[3]
        }
    }