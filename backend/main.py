from fastapi import FastAPI, HTTPException, Query
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

class ResourceCreateRequest(BaseModel):
    user_id: int
    title: str
    description: str
    category: str
    type: str
    price: float | None = None
    condition: str

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
def create_resource(resource: ResourceCreateRequest):

    connection = get_connection()
    cursor = connection.cursor()

    # Check whether the user exists
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (resource.user_id,)
    )

    if cursor.fetchone() is None:
        cursor.close()
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Insert the new resource
    cursor.execute(
        """
        INSERT INTO resources
        (user_id, title, description, category, type, price, `condition`, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            resource.user_id,
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