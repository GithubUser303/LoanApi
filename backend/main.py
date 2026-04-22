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

# 1. Define the EXACT order from your Colab training
COLUMNS = [
    'age', 'campaign', 'pdays', 'previous', 'emp_var_rate', 
    'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
]

@app.post("/api/predict")
async def get_prediction(payload: dict):
    try:
        # Get data from Lovable
        input_data = payload.get("data", [])
        df = pd.DataFrame(input_data)
        
        # Ensure all columns are present and numeric
        df = df.apply(pd.to_numeric, errors='coerce')
        
        # REORDER columns to match the model's training exactly
        df = df[COLUMNS]
        
        # Predict
        prediction = model.predict(df)
        return {"prediction": int(prediction[0])}
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"error": str(e)}
