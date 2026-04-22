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
        
        # Force numeric types
        df = df.apply(pd.to_numeric, errors='coerce')
        
        # MANDATORY: List your columns in the EXACT order 
        # they appeared in your Colab training dataframe
        column_order = [
            'age', 'campaign', 'pdays', 'previous', 'emp_var_rate', 
            'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
        ]
        
        # This reorders the frontend data to match the model's brain
        df = df[column_order]

        prediction = model.predict(df)
        return {"prediction": int(prediction[0])}
    except Exception as e:
        return {"error": str(e)}
