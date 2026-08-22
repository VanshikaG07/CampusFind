from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


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
    return {
        "message": "Registration data received",
        "user": {
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone
        }
    }

@app.post("/login")
def login(user: LoginRequest):
    return {
        "message": "Login data received",
        "email": user.email
    }