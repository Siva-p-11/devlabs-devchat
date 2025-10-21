from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

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
class Poems(BaseModel):
    username: str
    usermail: str
    content : str
    tag: str
    likes: int
    share: int
    comment: int
    time: int
    
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