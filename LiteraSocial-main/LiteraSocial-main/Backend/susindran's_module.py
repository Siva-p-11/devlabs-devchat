from http.client import HTTPException
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
url = os.getenv("url")
client = AsyncIOMotorClient(url)
db = client["LiteralSocial"]
conversations = db["conversations"]

class AI_request(BaseModel):
    prompt: str
    username: str

#for AI

def build_memory(username: str) -> str:
    convo = conversations.find_one({"username": username})
    if not convo or "message" not in convo:
        return ""
    recent = convo["messages"][-6:]
    return "\n".join([f"{'User' if msg['sender'] == 'user' else 'ai_sname'}: {msg['message']}" for msg in recent])

@app.post("/api/ai_name")
async def ai_response(data: AI_request):

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": "Bearer ",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": data.prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload)

        # Extract and print response
        if response.status_code == 200:
            completion = response.json()
            print(completion["choices"][0]["message"]["content"])
        else:
            print("Error:", response.status_code, response.text)

#for follow requests

class FollowRequest(BaseModel):
    username: str
    
@app.post('/follow')
async def follow(request: FollowRequest):
    if request.username in followers:
        HTTPException(status_code = 400, detail = "Already following")
    followers.append(request.username)
    return {'message' : f"{request.username} followed successfully", "followers": followers}

@app.post('/unfollow')
async def unfollow(request: FollowRequest):
    followers.remove(request.username)
    return {'message' : f"{request.username} unfollowed successfully"}

#count setups

@app.post("/fetch-profile")
async def fetch_profile(data: UserQuery):
    user = await login.find_one({"Email": data.username})
    posts = await posts.find({"Username": user["Username"]}).to_list(length=None)
    thoughts = await thoughts.find({"Username": user["Username"]}).to_list(length=None)

    # Convert ObjectIds to strings
    for post in posts:
        post["_id"] = str(post["_id"])
    for thought in thoughts:
        thought["_id"] = str(thought["_id"])

    return {
        "username": user["Username"],
        "post_count": len(posts),
        "thought_count": len(thoughts),
        "follower_count": len(user.get("followers", [])),
        "following_count": len(user.get("following", [])),
        "posts": posts,
        "thoughts": thoughts,
        "followers": user.get("followers", []),
        "following": user.get("following", [])
    }