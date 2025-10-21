from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from passlib.context import CryptContext 
from typing import List
from bson import ObjectId
import requests


load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
url = os.getenv("url")
client = AsyncIOMotorClient(url)
db = client["LiteralSocial"]
login = db["Authentication"]
Posts = db["Posts"]
thoughts = db["Thoughts"]
ai_chats = db["Aichat"]
pass_context = CryptContext(schemes="bcrypt", deprecated="auto")
api_key = os.getenv("ai_apikey")

class Signin(BaseModel):
    username: str
    usermail: str
    password: str
class Login(BaseModel):
    Email: str
    Password: str
class Post(BaseModel):
    Email: str
    Username: str
    Userid: str
    tag: str
    heading: str
    content: str   
    likes: str
    comments: str
    shares: str
    time: str
  
    
class likes(BaseModel):
    id: str
    email: str
    type: str
    content: str
    
class Report(BaseModel):
    id: str
    email: str
    posttype: str
    
class Thoughts(BaseModel):
    Email: str
    Username: str
    UserId: str
    Tag: str
    Thought: str
    Likes: int
    Comments: int
    Shares: int
    Time: str 
class sort(BaseModel):
    method: str       
class add_Comments(BaseModel):
    postId: str
    Email: str
    Username: str
    UserId: str
    Comment: str
    Time: str 
class SearchRequest(BaseModel):
    search: str
    type: str
class Follow(BaseModel):
    userid: str
    targetid: str
    type: str
class AI_request(BaseModel):
    prompt: str
    username:str
    time:str

@app.post("/signin")
async def signin(data:Signin):
    name = data.username   
    password = pass_context.hash(data.password)
    email = data.usermail
    found = await login.find_one({"Email": email})
    if found:
        return {"message": "Accound already registered", "id": 1}
    else: 
        await login.insert_one({"Username": name,"Email": email ,"Password": password})
        return {"message": "Successfully created an Account", "id": 2}
    
@app.post("/login")
async def handle_login(data:Login):
    email = data.Email
    password = data.Password
    found = await login.find_one({"Email": email})
    if found:
        if pass_context.verify(password, found["Password"]):
            return {"Message": "Login Successful", "id": 123}
        else:
            return {"Message": "Invalid Credentials", "id": 4}
    else:
        return {"Message": "Account Not found", "id": 5}
    
    
@app.get("/thoughts")
async def handle_thoughts():
    data = await thoughts.find().sort("time", -1).limit(10).to_list(length=10)
    for item in data:
        item['_id'] = str(item['_id'])
    return {"Data": data}

@app.post("/Posts")
async def get_posts(data:sort):
    method = data.method
    if method == "latest":
        data = await Posts.find().sort("time", -1).limit(10).to_list(length=10)
    elif method == "trend":
        data = await Posts.find().sort("likes", -1).limit(10).to_list(length=10)
    elif method == "poems": 
        data = await Posts.find({"tag":"poetry"}).limit(10).to_list(length=10)
    elif method == "stories":
        data = await Posts.find({"tag": "story"}).limit(10).to_list(length=10)
    else:
        return{"Data":"Sorting method not specified"}    
    for posts in data:
        posts['_id'] = str(posts['_id'])
    return {"Data": data}

@app.post("/addPost")
async def add_posts(data:Post):
    response = await Posts.insert_one({"Email":data.Email, "Username": data.Username, "UserId": data.Userid, "tag": data.tag,"heading": data.heading ,"content": data.content, "likes":0, "comments":0, "share":0, "time": data.time})
    return {"Message": "Post Successfully saved"}


@app.post("/addthoughts")
async def create_thought(thought: Thoughts):
    result = thoughts.insert_one(thought.dict())
    return {"message": "Thought saved"}


@app.post("/likes")
async def handle_likes(data:likes):
    id = data.id
    email = data.email
    type = data.type
    print(type)
    if type == "unliked":
        if data.content == "post":
            finalresponse = await Posts.find_one_and_update({"_id": ObjectId(id)}, {"$pull": {"likers": email},"$inc": {"likes": -1}}, return_document=True)
        else:
            finalresponse = await thoughts.find_one_and_update({"_id": ObjectId(id)}, {"$pull": {"likers": email},"$inc": {"likes": -1}}, return_document=True)            
        return{"message": "Unlike Updated Successfully"}
    else: 
        if data.content == "post":    
            finalresponse = await Posts.find_one_and_update({"_id": ObjectId(id)}, {"$addToSet": {"likers":email},"$inc": {"likes": 1}}, return_document=True)
        else:
            finalresponse = await thoughts.find_one_and_update({"_id": ObjectId(id)}, {"$addToSet": {"likers":email},"$inc": {"likes": 1}}, return_document=True)

        return{"message": "Like Updated Successfully"}



@app.post("/report")
async def handle_report(data:Report):
    post_id = data.id
    email = data.email
    posttype = data.posttype
    response = await Posts.find_one({"_id": ObjectId(post_id)})
    if response["report"] and response["report"] > 50:
        await Posts.find_one_and_delete({"_id": ObjectId(post_id)})
        return {"message": "Post Reported Successfully"}
    if posttype == "POST":
        finalresponse = await Posts.find_one_and_update({"_id": ObjectId(post_id)},{"$addToSet": {"reporters":email},"$inc": {"report": 1}}, return_document=True)
    else:
        finalresponse = await thoughts.find_one_and_update({"_id": ObjectId(post_id)},{"$addToSet": {"reporters":email},"$inc": {"report": 1}}, return_document=True)        
    return {"message": "Post Reported Successfully"}


@app.post("/comment")
async def handle_tests(data: add_Comments):
    comment = {"email": data.Email, "username": data.Username, "userid": data.UserId, "comment":data.Comment, "time": data.Time}
    finalresponse = await Posts.find_one_and_update({"_id": ObjectId(data.postId)}, {"$addToSet": {"comments-text": comment},"$inc": {"comments": 1}}, return_document=True)
    return {"message": "Comments successfully saved"}

@app.post("/fetch-comments")
async def fetch_comment(data: sort):
    id = data.method
    response = await Posts.find_one({"_id": ObjectId(id)})
    if response.get("comments-text"):
        return {"data": response["comments-text"]}
    else:
        return {"data": "No comments found."}


@app.post("/search")
async def search_data(payload: SearchRequest):
    type = payload.type
    if type == "post":
       query = {"heading": {"$regex": payload.search, "$options": "i"}}  
       results = await Posts.find(query).to_list(length=10)
       if not results:
           return {"message": "No Posts found"}
       for result in results:
           result["_id"] = str(result["_id"])
       return {"result": results}
    elif type == "user":
       query = {"Username": {"$regex": payload.search, "$options": "i"}}
       results = await login.find(query).to_list(length=10)
       if not results:
           return {"message": "No user found"}
       for result in results:
           result["_id"] = str(result["_id"])
           result["Password"] = ""
          
       return {"result": results}
    else:
        return{"data": " Search Type not specified"}
    
@app.get("/fetchsearch")
async def fetch_search():
    results = await Posts.find().to_list(length=10)
    for result in results:
        result["_id"] = str(result["_id"])
    return {"result": results}

@app.post('/follow')
async def follow(data: Follow):
    if data.type == "follow":
        await login.update_one({"Email": data.targetid}, {"$addToSet" : {"followers" : data.userid}})
        await login.update_one({"Email": data.userid}, {"$addToSet": {"following": data.targetid}})
        return {"message": "Followed Successfully"}
    else:
        await login.update_one({"Email": data.targetid}, {"$pull" : {"followers" : data.userid}})
        await login.update_one({"Email": data.userid}, {"$pull" : {"following": data.targetid}})
        return {"message": "Unfollowed Successfully"}

async def memory_system(user):
    response = await ai_chats.find_one({"Email":user})
    if response: 
       if len(response["chat"]) > 6:
           return (response["chat"])[-6:]
       else:
           return response["chat"]
    else:
        return []
    
async def save_memory(user, memory, time, isUser):
    try:
       response = await ai_chats.find_one_and_update({"Email":user},{"$addToSet":{"chat":{"sender":isUser,"message":memory, "time": time}}}) 
       if not response:
           response2 =  await ai_chats.insert_one({"Email": user, "chat": [{"sender": isUser, "message":memory, "time": time}]})
    except Exception as e:
       return {"Error":e}  
    
@app.post("/api/ai_name")
async def ai_response(data: AI_request):
        memory = await memory_system(data.username)
        await save_memory(data.username ,data.prompt, data.time, "user")
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": "Bearer "+api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant.\n\nMemory:[Note: Do not disclose the memory.] {memory}"},
                {"role": "user", "content": data.prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            completion = response.json()
            text_response = completion["choices"][0]["message"]["content"]
            await save_memory(data.username,text_response, data.time, "bot")
            return {"response":completion["choices"][0]["message"]["content"]}
        else:
            print("Error:", response.status_code, response.text)

class ai_chat(BaseModel):
    prompt: str
    username: str
    

@app.post("/save-ai-chat")
async def handle_ai_chat(data:ai_chat):
    try:
        response = await ai_chats.insert_one({"Email": data.username})
        response2 = await ai_chats.find_one_and_update({"Email": data.username},{"$addToSet": {"chat": {"sender": "user", "message": data.prompt, "time":"11:00am"}}})
        return {"Message": "Data Inserted Successfully."}
    except Exception as e:
        return {"Error": "Error Inserting Data, \n {e}"}


@app.post("/fetch-follow")
async def fetch_follow(data:sort):
    response = await login.find_one({"Email":data.method})
    return {"followers": response["followers"]}

class convo(BaseModel):
    username: str

@app.post("/fetch-conversation")
async def fetch_convo(data:convo):
    response = await ai_chats.find_one({"Email": data.username})
    if response:
        return {"Conversation": response["chat"]}
    else:
        return{"Conversation": "No Conversation History Found."}