from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "CampusFind Backend Running"}

@app.get("/hello")
def hello():
    return {"message": "Hello from CampusFind"}