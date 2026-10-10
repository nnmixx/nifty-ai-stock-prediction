#!/usr/bin/env python3
"""
NIFTY AI - FastAPI Backend API Server
Provides endpoints for market indices, historical data, indicators, predictions, backtest, and CSV upload.
"""

import os
import json
import io
import pandas as pd
import numpy as np
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = FastAPI(
    title="NIFTY AI API",
    description="Machine Learning Stock Price Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_DATA_DIR = os.path.join(BASE_DIR, "frontend", "public", "data")


def get_static_data(filename):
    file_path = os.path.join(FRONTEND_DATA_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return json.load(f)
    return None


@app.get("/")
def root():
    return {
        "app": "NIFTY AI API",
        "status": "online",
        "description": "Stock Price Prediction Using Machine Learning",
        "reference": "Workshop Report - Gunjan Hembram"
    }


@app.get("/api/indices")
def get_indices():
    """Returns list of available indices and current stats."""
    data = get_static_data("indices.json")
    if data:
        return data
    return [
        {"symbol": "NSEI", "name": "Nifty 50 (India)", "last_close": 15582.8, "pct_change": 0.95, "is_positive": True},
        {"symbol": "SAMPLE", "name": "Sample Stock Demo", "last_close": 417.6, "pct_change": 1.2, "is_positive": True}
    ]


@app.get("/api/history")
def get_history(index: str = Query("NSEI", description="Index symbol (e.g. NSEI, SAMPLE)")):
    """Returns OHLCV history with moving averages and technical indicators."""
    sym = index.upper()
    data = get_static_data(f"{sym}_history.json")
    if data:
        return data
    raise HTTPException(status_code=404, detail=f"History for index '{index}' not found")


@app.get("/api/metrics")
def get_metrics(index: str = Query("NSEI", description="Index symbol")):
    """Returns model evaluation metrics (MAE, RMSE, MAPE, R2, Directional Accuracy)."""
    sym = index.upper()
    summary = get_static_data(f"{sym}_summary.json")
    if summary and "metrics" in summary:
        return {
            "index": sym,
            "metrics": summary["metrics"],
            "dataset_info": {
                "raw_rows": summary.get("raw_rows"),
                "cleaned_rows": summary.get("cleaned_rows"),
                "after_features_rows": summary.get("after_features_rows"),
                "train_rows": summary.get("train_rows"),
                "test_rows": summary.get("test_rows")
            },
            "honest_takeaway": summary.get("honest_takeaway")
        }
    raise HTTPException(status_code=404, detail=f"Metrics for index '{index}' not found")


@app.get("/api/features")
def get_features(index: str = Query("NSEI", description="Index symbol")):
    """Returns feature importance list and correlation matrix."""
    sym = index.upper()
    summary = get_static_data(f"{sym}_summary.json")
    if summary:
        return {
            "index": sym,
            "feature_importances": summary.get("feature_importances", []),
            "correlation_matrix": summary.get("correlation_matrix", {})
        }
    raise HTTPException(status_code=404, detail=f"Features for index '{index}' not found")


@app.get("/api/predict")
def get_prediction(index: str = Query("NSEI", description="Index symbol"), days: int = Query(1, ge=1, le=5)):
    """Returns next-day forecast and test-set actual vs predicted prices."""
    sym = index.upper()
    summary = get_static_data(f"{sym}_summary.json")
    if summary:
        return {
            "index": sym,
            "horizon_days": days,
            "next_day_forecast": summary.get("next_day_forecast"),
            "test_predictions": summary.get("test_predictions", [])[-120:]  # last 120 days for quick view
        }
    raise HTTPException(status_code=404, detail=f"Predictions for index '{index}' not found")


@app.get("/api/backtest")
def get_backtest(index: str = Query("NSEI", description="Index symbol"), cost: float = Query(0.001)):
    """Returns backtest results (Buy&Hold vs Linear Regression vs Random Forest)."""
    sym = index.upper()
    summary = get_static_data(f"{sym}_summary.json")
    if summary and "backtest" in summary:
        return summary["backtest"]
    raise HTTPException(status_code=404, detail=f"Backtest for index '{index}' not found")


@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    """Accepts user-uploaded OHLCV CSV, calculates features, trains a fast model and returns predictions."""
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))

        # Check required columns
        req_cols = ['Close']
        missing = [c for c in req_cols if c not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

        df['Date'] = pd.to_datetime(df['Date']) if 'Date' in df.columns else pd.date_range(end=pd.Timestamp.now(), periods=len(df))
        df = df.sort_values('Date').dropna(subset=['Close']).reset_index(drop=True)

        if len(df) < 15:
            raise HTTPException(status_code=400, detail="At least 15 rows of OHLCV data required for feature extraction.")

        df['ret'] = df['Close'].pct_change()
        df['ret_lag1'] = df['ret'].shift(1)
        df['target_ret'] = df['Close'].pct_change().shift(-1)

        valid = df.dropna(subset=['ret', 'ret_lag1', 'target_ret']).copy()
        if len(valid) < 5:
            raise HTTPException(status_code=400, detail="Insufficient valid rows after lag computation.")

        X = valid[['ret', 'ret_lag1']].values
        y = valid['target_ret'].values
        lr = LinearRegression().fit(X, y)

        latest_x = np.array([[valid['ret'].iloc[-1], valid['ret_lag1'].iloc[-1]]])
        pred_ret = float(lr.predict(latest_x)[0])
        last_close = float(df['Close'].iloc[-1])
        pred_close = last_close * (1 + pred_ret)

        return {
            "status": "success",
            "filename": file.filename,
            "total_rows": len(df),
            "valid_rows": len(valid),
            "last_close": round(last_close, 2),
            "predicted_close": round(pred_close, 2),
            "predicted_return_pct": round(pred_ret * 100, 2),
            "direction": "UP" if pred_ret > 0 else "DOWN",
            "message": "Quick estimate calculated successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
