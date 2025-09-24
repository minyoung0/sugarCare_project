# main.py
from fastapi import FastAPI
import sys, json
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# 테스트용 API 엔드포인트
@app.get("/hello")
def hello():
    return {"msg": "Hello from FastAPI!"}

# CORS 허용 (React랑 연결 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


