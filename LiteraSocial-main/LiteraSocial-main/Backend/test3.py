from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from pymongo import DESCENDING, ASCENDING

load_dotenv()
app = FastAPI()
router = APIRouter()
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
collection = db["Authentication"]
thoughts = db["Thoughts"]
Posts = db["Posts"]
pass_context = CryptContext(schemes="bcrypt", deprecated="auto")

class Signin(BaseModel):
    username: str
    usermail: str
    password: str
class Login(BaseModel):
    Email: str
    Password: str
class Thoughts(BaseModel):
    Email: str
    username: str
    userid: str
    tag: str
    content: str
    likes: str
    comments: str
    shares: str
    
@app.post("/signin")
async def signin(data:Signin):
    name = data.username   
    password = pass_context.hash(data.password)
    email = data.usermail
    found = await collection.find_one({"Email": email})
    if found:
        return {"message": "Accound already registered", "id": 1}
    else: 
        await collection.insert_one({"Username": name,"Email": email ,"Password": password})
        return {"message": "Successfully created an Account", "id": 2}
    
@app.post("/login")
async def handle_login(data:Login):
    email = data.Email
    password = data.Password
    found = await collection.find_one({"Email": email})
    if found:
        if pass_context.verify(password, found["Password"]) :
            return {"Message": "Login Successful", "id": 123}
        else:
            return {"Message": "Invalid Credentials", "id": 4}
    else:
        return {"Message": "Account Not found", "id": 5}
    
@app.get("/thoughts")
async def handle_thoughts():
   data = await thoughts.find().to_list(length=None)
   for id in data:
       id['_id'] = str(id['_id'])
   return {"Data": data}

@app.get("/Posts")
async def get_posts():
    data = await Posts.find().to_list(length=None)
    for id in data:
        id['_id'] = str(id['_id'])
    return {"Data": data}

@router.post("/thoughts")
async def create_thought(thought: Thoughts):
    result = thoughts.insert_one(thought.dict())
    return {"message": "Thought saved", "id": str(result.inserted_id)}

@router.get("/posts/sorted")
async def get_sorted_posts(
        sort_by: str = Query("createdAt", enum=["likes", "createdAt"]),
        order: str = Query("desc", enum=["asc","desc"]),
        tag: str = Query(None, enum=["poems", "stories", None])
):
    sort_order = DESCENDING if order == "desc" else ASCENDING
    query = {"tag": tag} if tag else {}
    posts = list(Posts.find(query).sort(sort_by, sort_order).to_list(length=None))
    for post in posts:
        post["_id"] = str(post["_id"])
    return {"posts" : posts}

app.include_router(router)