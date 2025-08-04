from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from datetime import datetime
import uuid

# Initialize FastAPI app
app = FastAPI(title="GTM Strategy Portfolio API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/gtm_portfolio_db")
client = MongoClient(MONGO_URL)
db = client.gtm_portfolio_db

# Collections
case_studies_collection = db.case_studies
frameworks_collection = db.frameworks
metrics_collection = db.metrics

# Pydantic models
class CaseStudy(BaseModel):
    id: str
    company_name: str
    company_type: str  # "startup" or "mnc"
    industry: str
    product_category: str
    challenge: str
    solution_overview: str
    market_research: Dict[str, Any]
    competitive_analysis: Dict[str, Any]
    pricing_strategy: Dict[str, Any]
    channel_strategy: Dict[str, Any]
    execution_timeline: List[Dict[str, Any]]
    key_metrics: Dict[str, Any]
    success_rate: float
    revenue_impact: str
    created_at: datetime
    updated_at: datetime

class GTMFramework(BaseModel):
    id: str
    name: str
    description: str
    phases: List[Dict[str, Any]]
    success_rate: float
    use_cases: List[str]
    created_at: datetime

class Metric(BaseModel):
    id: str
    case_study_id: str
    metric_name: str
    metric_value: float
    metric_unit: str
    time_period: str
    category: str  # "market", "pricing", "channel", "revenue"

# API Routes
@app.get("/")
async def root():
    return {"message": "GTM Strategy Portfolio API is running!"}

@app.get("/api/case-studies")
async def get_case_studies():
    try:
        studies = list(case_studies_collection.find({}, {"_id": 0}))
        return {"case_studies": studies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/case-studies/{case_id}")
async def get_case_study(case_id: str):
    try:
        study = case_studies_collection.find_one({"id": case_id}, {"_id": 0})
        if not study:
            raise HTTPException(status_code=404, detail="Case study not found")
        return study
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/frameworks")
async def get_frameworks():
    try:
        frameworks = list(frameworks_collection.find({}, {"_id": 0}))
        return {"frameworks": frameworks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics/{case_id}")
async def get_case_metrics(case_id: str):
    try:
        metrics = list(metrics_collection.find({"case_study_id": case_id}, {"_id": 0}))
        return {"metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard-stats")
async def get_dashboard_stats():
    try:
        total_studies = case_studies_collection.count_documents({})
        startup_studies = case_studies_collection.count_documents({"company_type": "startup"})
        mnc_studies = case_studies_collection.count_documents({"company_type": "mnc"})
        
        # Calculate average success rate
        pipeline = [
            {"$group": {"_id": None, "avg_success_rate": {"$avg": "$success_rate"}}}
        ]
        avg_result = list(case_studies_collection.aggregate(pipeline))
        avg_success_rate = avg_result[0]["avg_success_rate"] if avg_result else 0
        
        return {
            "total_case_studies": total_studies,
            "startup_studies": startup_studies,
            "mnc_studies": mnc_studies,
            "average_success_rate": round(avg_success_rate, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)