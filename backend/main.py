import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("loan_recommendation_model.pkl")

FEATURES = [
    'age', 'campaign', 'pdays', 'previous', 'emp_var_rate', 
    'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
]

@app.post("/api/predict")
async def predict(payload: dict):
    try:
        df = pd.DataFrame(payload.get("data", []))
        df = df[FEATURES]
        prediction = model.predict(df)
        return {"prediction": int(prediction[0])}
    except Exception as e:
        return {"error": str(e)}
