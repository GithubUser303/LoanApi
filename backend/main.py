from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

app = FastAPI(title="Loan Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load('loan_recommendation_model.pkl')

@app.post("/api/predict")
async def get_prediction(payload: dict):
    try:
  
        input_data = payload.get("data", [])
        df = pd.DataFrame(input_data)
        df = df.apply(pd.to_numeric, errors='coerce')
        predictions = model.predict(df)
        
        result = int(predictions[0])
        
        return {"prediction": result}
        
    except Exception as e:
        return {"error": str(e)}
