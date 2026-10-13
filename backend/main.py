from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import bcrypt
from database import get_connection
import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is missing from .env")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = int(payload["sub"])
        return user_id

    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str

class ResourceCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    type: Literal["SELL", "RENT", "BORROW"]
    price: float | None = Field(default=None, ge=0)
    condition: Literal["NEW", "GOOD", "USED"]

class ResourceUpdateRequest(BaseModel):
    title: str
    description: str
    category: str
    type: Literal["SELL", "RENT", "BORROW"]
    price: float | None = Field(default=None, ge=0)
    condition: Literal["NEW", "GOOD", "USED"]
    status: Literal["AVAILABLE", "SOLD", "RENTED", "BORROWED"]

class RequestCreateRequest(BaseModel):
    user_id: int
    title: str
    description: str
    category: str

@app.get("/")
def home():
    return {"message": "CampusFind Backend Running"}


@app.get("/hello")
def hello(current_user: int = Depends(get_current_user)):
    return {
        "message": "Hello from CampusFind",
        "user_id": current_user
    }

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

    access_token = create_access_token(db_user[0])
    
    return {
    "message": "Login successful",
    "access_token": access_token,
    "token_type": "bearer",
    "user": {
        "id": db_user[0],
        "full_name": db_user[1],
        "email": user.email,
        "role": db_user[3]
        }
    }

@app.get("/resources")
def get_resources():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, title, description, category,
               type, price, `condition`, status, created_at
        FROM resources
        ORDER BY created_at DESC
        """
    )

    resources = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "resources": [
            {
                "id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "type": row[5],
                "price": float(row[6]) if row[6] is not None else None,
                "condition": row[7],
                "status": row[8],
                "created_at": row[9]
            }
            for row in resources
        ]
    }

@app.get("/resources/search")
def search_resources(search: str = Query(..., min_length=1)):

    connection = get_connection()
    cursor = connection.cursor()

    search_pattern = f"%{search}%"

    cursor.execute(
        """
        SELECT id, user_id, title, description, category,
               type, price, `condition`, status, created_at
        FROM resources
        WHERE title LIKE %s
           OR description LIKE %s
           OR category LIKE %s
        ORDER BY created_at DESC
        """,
        (search_pattern, search_pattern, search_pattern)
    )

    resources = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "resources": [
            {
                "id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "type": row[5],
                "price": float(row[6]) if row[6] is not None else None,
                "condition": row[7],
                "status": row[8],
                "created_at": row[9]
            }
            for row in resources
        ]
    }

@app.get("/resources/{resource_id}")
def get_resource(resource_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, title, description, category,
               type, price, `condition`, status, created_at
        FROM resources
        WHERE id = %s
        """,
        (resource_id,)
    )

    resource = cursor.fetchone()

    cursor.close()
    connection.close()

    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")

    return {
        "id": resource[0],
        "user_id": resource[1],
        "title": resource[2],
        "description": resource[3],
        "category": resource[4],
        "type": resource[5],
        "price": float(resource[6]) if resource[6] is not None else None,
        "condition": resource[7],
        "status": resource[8],
        "created_at": resource[9]
    }


@app.post("/resources")
def create_resource(
    resource: ResourceCreateRequest,
    current_user: int = Depends(get_current_user)
):
    connection = get_connection()
    cursor = connection.cursor()

    # Verify that the authenticated user exists
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (current_user,)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Insert the resource using the authenticated user's ID
    cursor.execute(
        """
        INSERT INTO resources
        (user_id, title, description, category, type, price, `condition`, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            current_user,
            resource.title,
            resource.description,
            resource.category,
            resource.type,
            resource.price,
            resource.condition,
            "AVAILABLE"
        )
    )

    connection.commit()

    resource_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "message": "Resource created successfully",
        "resource_id": resource_id
    }

@app.post("/requests")
def create_request(request: RequestCreateRequest):

    connection = get_connection()
    cursor = connection.cursor()

    # Check whether the user exists
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (request.user_id,)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Insert the request
    cursor.execute(
        """
        INSERT INTO requests
        (user_id, title, description, category, status)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            request.user_id,
            request.title,
            request.description,
            request.category,
            "OPEN"
        )
    )

    connection.commit()

    request_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return {
        "message": "Request created successfully",
        "request_id": request_id
    }

@app.get("/requests")
def get_requests():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, title, description, category, status, created_at
        FROM requests
        ORDER BY created_at DESC
        """
    )

    requests = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "requests": [
            {
                "id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "status": row[5],
                "created_at": row[6]
            }
            for row in requests
        ]
    }

@app.get("/requests/{request_id}")
def get_request(request_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, user_id, title, description, category, status, created_at
        FROM requests
        WHERE id = %s
        """,
        (request_id,)
    )

    request = cursor.fetchone()

    cursor.close()
    connection.close()

    if request is None:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    return {
        "id": request[0],
        "user_id": request[1],
        "title": request[2],
        "description": request[3],
        "category": request[4],
        "status": request[5],
        "created_at": request[6]
    }

@app.put("/resources/{resource_id}")
def update_resource(
    resource_id: int,
    resource: ResourceUpdateRequest,
    current_user: int = Depends(get_current_user)
):
    connection = get_connection()
    cursor = connection.cursor()

    # Verify that the authenticated user owns this resource
    cursor.execute(
        "SELECT id FROM resources WHERE id = %s AND user_id = %s",
        (resource_id, current_user)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Resource not found or you do not own this resource"
        )

    # Update only the resource owned by the authenticated user
    cursor.execute(
        """
        UPDATE resources
        SET title = %s,
            description = %s,
            category = %s,
            type = %s,
            price = %s,
            `condition` = %s,
            status = %s
        WHERE id = %s AND user_id = %s
        """,
        (
            resource.title,
            resource.description,
            resource.category,
            resource.type,
            resource.price,
            resource.condition,
            resource.status,
            resource_id,
            current_user
        )
    )

    connection.commit()
    cursor.close()
    connection.close()

    return {
        "message": "Resource updated successfully",
        "resource_id": resource_id
    }

@app.delete("/resources/{resource_id}")
def delete_resource(
    resource_id: int,
    current_user: int = Depends(get_current_user)
):
    connection = get_connection()
    cursor = connection.cursor()

    # Verify that the authenticated user owns this resource
    cursor.execute(
        "SELECT id FROM resources WHERE id = %s AND user_id = %s",
        (resource_id, current_user)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Resource not found or you do not own this resource"
        )

    # Delete only the resource owned by the authenticated user
    cursor.execute(
        "DELETE FROM resources WHERE id = %s AND user_id = %s",
        (resource_id, current_user)
    )

    connection.commit()
    cursor.close()
    connection.close()

    return {
        "message": "Resource deleted successfully",
        "resource_id": resource_id
    }

@app.get("/users/{user_id}")
def get_user_profile(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, full_name, email, phone, is_verified, role
        FROM users
        WHERE id = %s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": user[0],
        "full_name": user[1],
        "email": user[2],
        "phone": user[3],
        "is_verified": bool(user[4]),
        "role": user[5]
    }

@app.get("/users/{user_id}/resources")
def get_user_resources(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    # Check whether the user exists
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (user_id,)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Fetch resources belonging to this user
    cursor.execute(
        """
        SELECT id, user_id, title, description, category,
               type, price, `condition`, status, created_at
        FROM resources
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    resources = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "user_id": user_id,
        "resources": [
            {
                "id": row[0],
                "user_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "type": row[5],
                "price": float(row[6]) if row[6] is not None else None,
                "condition": row[7],
                "status": row[8],
                "created_at": row[9]
            }
            for row in resources
        ]
    }
