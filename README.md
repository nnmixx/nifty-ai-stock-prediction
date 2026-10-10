# NIFTY AI — Stock Price Prediction Using Machine Learning

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Academic Attribution & Workshop Reference**  
> **Student:** Gunjan Hembram (Roll No. `24102060018`)  
> **Institution:** Government Women's Polytechnic, Ranchi (Diploma in Computer Science & Engineering, 5th Semester)  
> **Workshop:** *Machine Learning for Data Science Projects & Generative AI* — Organised by **Anudip Foundation**  
> **Trainer:** Md Rashid | **Date:** 09/10/2026 | **Credentials:** IBM SkillsBuild (20 Hours)

---

## 📌 Executive Summary

**NIFTY AI** is a production-quality, full-stack quantitative machine learning platform built to reproduce and deploy the econometric findings of the *Stock Price Prediction Using Machine Learning* workshop report.

Using 14 years of daily OHLCV trading records from India's benchmark **NIFTY 50 (`NSEI`)** (2007-09-17 to 2021-05-31), the system benchmarks **Linear Regression** and **Random Forest Regressors** against the trivial **Naive Baseline** ($P_{t+1} = P_t$).

### ⚖️ The Critical Honesty Rule
> *"An $R^2 \approx 0.99$ looks impressive on raw price charts, but the naive baseline performs just as well ($RMSE\ 154.04$ vs $155.46$). Directional accuracy is only $\approx 54\%$, and after accounting for $0.1\%$ transaction fees, both machine learning strategies trailed Buy & Hold ($-10.4\%$ and $-12.8\%$ vs $+35.2\%$). Financial markets cannot be beaten with naive price regression."*

---

## 📊 Benchmark Results (Test Set: 660 Days, 2018–2021)

Every metric computed from `Market.csv` strictly replicates the workshop report:

| Model Architecture | MAE (₹) | RMSE (₹) | MAPE (%) | $R^2$ Score | Directional Accuracy | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Naive Baseline ($P_{t+1} = P_t$)** | **106.14** | **154.04** | **0.94%** | **0.9905** | — | Benchmark |
| **Linear Regression** | 105.93 | 156.20 | 0.95% | 0.9902 | 54.4% | Trained |
| **Random Forest (300 trees, depth 6)** | **105.84** | **155.46** | **0.94%** | **0.9903** | 53.6% | Trained |
| **LSTM / GRU Neural Network** | *Locked* | *Locked* | *Locked* | *Locked* | *Locked* | Future Scope |

### 📈 Backtesting Simulation ($0.1\%$ Transaction Friction)

Strategy rule: Long ($1$) when predicted return $> 0$, Cash ($0$) otherwise. $0.1\%$ cost applied on position transitions.

| Strategy | Cumulative Return | Sharpe Ratio (252D) | Max Drawdown | Win Rate |
| :--- | :---: | :---: | :---: | :---: |
| **Buy & Hold (Passive Index)** | **+35.3%** | **0.62** | **-38.4%** | **55.3%** |
| **Linear Regression** | -12.8% | -0.17 | -38.5% | 55.8% |
| **Random Forest** | -10.4% | -0.13 | -32.6% | 55.6% |

---

## 🧱 Leakage-Free 10-Stage Pipeline

```
[1. Data Collection] ──> [2. Data Cleaning] ──> [3. EDA Analysis] ──> [4. Feature Engineering]
       (3,381 raw)             (3,346 clean)           (Correlation)          (3,296 samples)
            │
            └──> [5. Chronological 80/20 Split] ──> [6. Model Training] ──> [7. Target Prediction]
                     (2,636 Train / 660 Test)            (Fit on Train)             (P_t * (1 + r))
                           │
                           └──> [8. Evaluation] ──> [9. Backtesting] ──> [10. Visualization]
                                    (ML Metrics)        (0.1% Friction)       (TradingView UI)
```

1. **Data Collection:** Historical Nifty 50 records from Yahoo Finance format (`Market.csv`).
2. **Data Cleaning:** 210 missing cells dropped (35 rows), 0 duplicates found $\to 3,346$ clean rows.
3. **Exploratory Data Analysis:** Multicollinearity identification ($Open, High, Low, Close \approx 1.0$) and return distribution fat-tail analysis.
4. **Feature Engineering:** Returns ($t, t-1, t-4$), 20-day Volatility, RSI(14), Close/SMA20, Close/SMA50, MACD/Close, Daily Range, Opening Gap. Drops 50-day window $\to 3,296$ rows.
5. **Leakage-Safe Split:** Chronological split (2,636 train days to 2018-09-12; 660 test days to 2021-05-28). `StandardScaler` fit exclusively on training data.
6. **Model Training:** Scikit-learn Linear Regression and Random Forest Regressor (`n_estimators=300`, `max_depth=6`, `min_samples_leaf=20`, `random_state=42`).
7. **Prediction:** Target is next-day return, converted to price: $\hat{P}_{t+1} = P_t \times (1 + \hat{r}_{t+1})$.
8. **Evaluation:** MAE, MSE, RMSE, MAPE, $R^2$, and Directional Accuracy.
9. **Backtesting:** Realistic portfolio simulation with transaction cost friction and underwater drawdown curve.
10. **Visualization:** High-performance TradingView lightweight charts, dynamic indicator overlays, and interactive client sandbox.

---

## 🛠️ Project Architecture

```
nifty-ai-stock-prediction/
├── backend/
│   ├── train.py           # Core ML training pipeline (exports compact JSONs)
│   └── main.py            # FastAPI REST backend server
├── frontend/
│   ├── public/data/       # Precomputed static JSONs (for serverless Vercel)
│   │   ├── indices.json
│   │   ├── NSEI_summary.json
│   │   ├── NSEI_history.json
│   │   └── SAMPLE_*.json
│   ├── src/
│   │   ├── components/    # 10 modular section components
│   │   ├── utils/         # DataLoader (auto-fallback) & In-browser CSV analyzer
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
├── data/
│   ├── NSEI.csv           # Clean filtered dataset (200 KB)
│   └── random_stock_market_dataset.csv
├── vercel.json            # Vercel deployment configuration
├── requirements.txt       # Python dependencies
└── README.md
```

### ⚡ Hybrid Deployment Strategy (Vercel Ready)
- **Local / On-Premise:** Runs FastAPI backend (`python -m uvicorn backend.main:app`) alongside Vite.
- **Serverless Cloud (Vercel):** Frontend auto-detects that API is unreachable and seamlessly serves the precomputed static datasets from `/data/*.json`. Drag-and-drop CSV uploads run **100% in-browser via JavaScript linear regression**.

---

## 🚀 Quickstart & Local Setup

### 1. Python Backend & Model Training
```bash
# Clone the repository
git clone https://github.com/nnmixx/nifty-ai-stock-prediction.git
cd nifty-ai-stock-prediction

# Install Python requirements
pip install -r requirements.txt

# Run full ML pipeline & export static datasets
python backend/train.py

# Start the FastAPI backend
python -m uvicorn backend.main:app --reload --port 8000
```
API docs available at: `http://localhost:8000/docs`

### 2. Frontend Development Server
```bash
# Enter frontend directory
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛡️ Limitations & Disclaimer

- **Not Financial Advice:** This platform was developed exclusively for academic learning and econometric research.
- **Efficient Markets:** Technical oscillators reflect past movements; asset prices in live markets are driven by unexpected macroeconomic announcements, liquidity shifts, and sentiment.
- **Zero Risk Capital:** Never trade real funds based on machine learning forecasts.

---

## 👤 Author & Credits

- **Author / Developer:** [nnmixx](https://github.com/nnmixx)
- **Report & Research:** Gunjan Hembram (Government Women's Polytechnic, Ranchi)
- **Trainer & Guidance:** Md Rashid (Anudip Foundation)
