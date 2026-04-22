from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pycaret.classification import load_model, predict_model
app = FastAPI(title="Loan Recommendation API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = load_model('loan_recommendation_model')
@app.post("/api/predict")
async def get_prediction(payload: dict):
    try:
        input_data = payload.get("data", [])
        df = pd.DataFrame(input_data)
        predictions = predict_model(model, data=df)
        result = int(predictions['prediction_label'].iloc[0])
        return {"prediction": result}
        
    except Exception as e:
        return {"error": str(e)}