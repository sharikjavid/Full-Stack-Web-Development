from fastapi import FastAPI , Query, HTTPException
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from pydantic import BaseModel, Field
from pymongo import MongoClient, DESCENDING
import pymongo
from typing import Optional
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import pandas as pd
import requests
import numpy as np
import threading
import time
import io
from datetime import datetime 


app = FastAPI()#python framework that help to manager api built in python
# Add CORS middleware- cross origin resource sharing
app.add_middleware(
    CORSMiddleware,#middleware of fastapi that helps to us to manage cors
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],# yeh line saare headers ko allow karta hai jo koi bhi browser request me add kar sakta hai.
)
#'mongodb+srv://' connection protocol hai
#'cluster0.9zca08r.mongodb.net' MongoDB server ka address hai,
client = MongoClient('mongodb+srv://sharik:sjG91Zu2c1iZRwaE@cluster0.lceku9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['university_db']
collection = db['university']

class university(BaseModel):
    University: str
    City: str
    Country: str
    CourseName: str
    CourseDescription: str
    StartDate: str
    EndDate: str
    Price: float
    Currency: str
    university_id: int
 

class updateUniversity(BaseModel):
    university_id: Optional[int]
    Price: Optional[int]
    StartDate: Optional[str]
    EndDate: Optional[str]
    CourseDescription: Optional[str]
    Currency: Optional[str]
    
   


@app.get("/")
async def read_root():
    return {"message": "Welcome to university Management API!"}



@app.get("/universitys/")
async def get_all_universitys(
    skip: int = Query(0, description="Number of records to skip"),
    limit: int = Query(10, description="Number of records to return")
):
    if limit < 1:
        raise HTTPException(status_code=400, detail="Limit must be greater than 0")

    universitys = []
    for university in collection.find().skip(skip).limit(limit):
        university["_id"] = str(university["_id"])  # Convert ObjectId to string
        universitys.append(university)
    
    total_count = collection.count_documents({})  # Total number of documents
    return {
        "message": "universities found",
        "results": universitys,
        "skip": skip,
        "limit": limit,
        "total_count": total_count
    }

@app.post("/university/")
async def create_university(university: university):
    university_dict = university.dict()
    collection.insert_one(university_dict)
    return {"message": "university added successfully."}

@app.get("/university/{university_id}")
async def get_course(university_id: int):
    course = collection.find_one({"university_id": university_id})
    if course:
        return {
            "message": "Course found",
            "data": {
                "university": course.get("University"),
                "city": course.get("City"),
                "country": course.get("Country"),
                "course_name": course.get("CourseName"),
                "course_description": course.get("CourseDescription"),
                "start_date": course.get("start_date"),
                "end_date": course.get("end_date"),
                "price": course.get("Price"),
                "currency": course.get("Currency"),
            }
        }
    else:
        raise HTTPException(status_code=404, detail="Course not found.")
    

@app.put("/university/{university_id}")
async def update_university(university_id: int, university: updateUniversity):
    print(updateUniversity)
    university_dict = university.dict(exclude_unset=True)
    
    result = collection.update_one({"university_id": university_id}, {"$set": university_dict})
    if result.modified_count == 1:
        return {"message": university_dict}
    else:
        raise HTTPException(status_code=404, detail="University not found or no changes made.")

@app.delete("/university/{university_id}")
async def delete_university(university_id: int):
    result = collection.delete_one({"university_id": university_id})
    if result.deleted_count == 1:
        return {"message": "university deleted successfully."}
    else:
        return {"error": "university not found."}


@app.get("/universitys")
async def get_university(query: Optional[str] = None, skip: int = Query(0, ge=0), limit: int = Query(10, gt=0)):
    if query:
        search_query = {
            "$or": [
                {"University": {"$regex": query, "$options": "i"}},
                {"Country": {"$regex": query, "$options": "i"}},
                {"City": {"$regex": query, "$options": "i"}},
                {"CourseName": {"$regex": query, "$options": "i"}}


            ]
        }
    else:
        search_query = {}
    
    # If no query is provided, sort by _id or created_at to get the most recently added entries
    universitys = list(collection.find(search_query).sort("createdAt", pymongo.ASCENDING).skip(skip).limit(limit))
    
    if universitys:
        return {
            "message": f"{len(universitys)} universities found",
            "results": [
                {
                    "university_id": uni.get('university_id'),
                    "University": uni.get('University'),
                    "City": uni.get('City'),
                    "Country": uni.get('Country'),
                    "CourseName": uni.get('CourseName'),
                    "CourseDescription": uni.get('CourseDescription'),
                    "StartDate": uni.get('StartDate'),
                    "EndDate": uni.get('EndDate'),
                    "Price": uni.get('Price'),
                    "Currency": uni.get('Currency')
                } for uni in universitys
            ]
        }
    else:
        raise HTTPException(status_code=404, detail="No universities found matching the criteria")




def download_and_normalize_csv(url):
    response = requests.get(url)
    csv_data = response.content.decode('utf-8')
    data = pd.read_csv(io.StringIO(csv_data))
    data['university_id'] = np.random.randint(1e9, 1e10, size=len(data), dtype=np.int64)
    return data


def save_to_mongodb(data):
    collection.delete_many({})  # Clear existing data
    data_dict = data.to_dict("records")

    # Add createdAt field to each document
    for document in data_dict:
        document['createdAt'] = datetime.utcnow()

    # Insert the data into MongoDB
   

    # Create a TTL index on the createdAt field
    collection.create_index("createdAt", expireAfterSeconds=600)
    collection.insert_many(data_dict)

  

   

def update_data_periodically():
    url = "https://api.mockaroo.com/api/501b2790?count=1000&key=8683a1c0"
    while True:
        data = download_and_normalize_csv(url)
        save_to_mongodb(data)
        print("Data saved to MongoDB. It will expire in 10 minutes.")
        time.sleep(600)




@app.on_event("startup")
def startup_event():
    print("Ensuring TTL index is set and starting update thread.")
    indexes = collection.index_information()
    if 'createdAt_1' not in indexes:
        print("Creating TTL index for the first time.")
        collection.create_index("createdAt", expireAfterSeconds=600)
    else:
        print("TTL index already exists.")
    thread = threading.Thread(target=update_data_periodically)
    thread.start()
    print("Started periodic data update thread.")