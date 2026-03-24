# FastAPI Backend for Trailblazer Welfare Navigator
# This file will contain the FastAPI application and endpoints

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Trailblazer Welfare Navigator API"}
