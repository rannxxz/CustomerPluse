from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd
import numpy as np

# =====================================================
# PATH CONFIGURATION
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "output_data"

# =====================================================
# LOAD DATA
# =====================================================

prediction_df = pd.read_csv(
    DATA_DIR / "prediction_table.csv"
)

kpi_df = pd.read_csv(
    DATA_DIR / "executive_kpis.csv"
)

summary_df = pd.read_csv(
    DATA_DIR / "customerpulse_summary.csv"
)

feature_df = pd.read_csv(
    DATA_DIR / "feature_importance.csv"
)

metrics_df = pd.read_csv(
    DATA_DIR / "model_metrics.csv"
)

# =====================================================
# CLEAN DATA FOR JSON SERIALIZATION
# =====================================================

prediction_df = prediction_df.replace(
    [np.inf, -np.inf],
    np.nan
)

kpi_df = kpi_df.replace(
    [np.inf, -np.inf],
    np.nan
)

summary_df = summary_df.replace(
    [np.inf, -np.inf],
    np.nan
)

feature_df = feature_df.replace(
    [np.inf, -np.inf],
    np.nan
)

metrics_df = metrics_df.replace(
    [np.inf, -np.inf],
    np.nan
)


def clean_records(df):
    """
    Convert pandas/numpy values into JSON-safe Python values.
    """

    cleaned = df.copy()

    cleaned = cleaned.replace(
        [np.inf, -np.inf],
        np.nan
    )

    cleaned = cleaned.astype(object)

    cleaned = cleaned.where(
        pd.notnull(cleaned),
        None
    )

    return cleaned.to_dict(
        orient="records"
    )


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(
    title="CustomerPulse API",
    version="1.0.0",
    description="Customer Intelligence and Churn Prediction API"
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {
        "message": "CustomerPulse API Running",
        "version": "1.0.0"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


# =====================================================
# DASHBOARD DATA
# =====================================================

@app.get("/api/dashboard")
def dashboard():

    kpi_lookup = {
        row["Metric"]: row["Value"]
        for _, row in kpi_df.iterrows()
    }

    dashboard_kpis = {
        "totalCustomers": int(kpi_lookup["Total Customers"]),
        "highRiskCustomers": int(kpi_lookup["High Risk Customers"]),
        "revenueAtRisk": round(
            float(kpi_lookup["Revenue At Risk"]), 2
        ),
        "averageHealthScore": round(
            float(kpi_lookup["Average Health Score"]), 1
        ),
    }

    return {

        "kpis": dashboard_kpis,

        "summary": clean_records(summary_df),

        "features": clean_records(
            feature_df.head(10)
        ),

        "models": clean_records(metrics_df),
        "segments": clean_records(
            prediction_df
            .groupby("LifecycleStage")
            .size()
            .reset_index(name="Customers")
            ),
        "healthScores": clean_records(
            prediction_df[
                ["CustomerHealthScore"]
            ]
        )
    }


# =====================================================
# KPI ENDPOINTS
# =====================================================

@app.get("/api/kpis")
def get_kpis():
    return clean_records(kpi_df)


@app.get("/api/risk-summary")
def risk_summary():
    return clean_records(summary_df)


@app.get("/api/features")
def feature_importance():
    return clean_records(feature_df)


@app.get("/api/models")
def model_metrics():
    return clean_records(metrics_df)


# =====================================================
# CUSTOMER ENDPOINTS
# =====================================================

@app.get("/api/customers")
def customers(
    risk: str | None = Query(None),
    priority: str | None = Query(None),
    lifecycle: str | None = Query(None),
    skip: int = 0,
    limit: int = 100
):

    df = prediction_df.copy()

    if risk:
        df = df[
            df["RiskSegment"] == risk
        ]

    if priority:
        df = df[
            df["RetentionPriority"]
            == priority
        ]

    if lifecycle:
        df = df[
            df["LifecycleStage"]
            == lifecycle
        ]

    df = df.iloc[skip:skip + limit]
    return clean_records(df)
@app.get("/api/customer-count")

def customer_count():

    return {
        "total_customers":
            int(len(prediction_df)),

        "high_risk_customers":
            int(
                (
                    prediction_df["RiskSegment"]
                    == "High Risk"
                ).sum()
            )
    }

# =====================================================
# HIGH RISK CUSTOMERS
# =====================================================

@app.get("/api/customers/high-risk")
def high_risk_customers():

    df = prediction_df[
        prediction_df["RiskSegment"]
        == "High Risk"
    ]

    return clean_records(df)


# =====================================================
# SINGLE CUSTOMER
# =====================================================

@app.get("/api/customers/{customer_id}")
def customer(
    customer_id: str
):

    df = prediction_df[
        prediction_df["CustomerID"]
        == customer_id
    ]

    if df.empty:
        return {
            "message":
                "Customer not found"
        }

    return clean_records(df)[0]


# =====================================================
# SEARCH
# =====================================================

@app.get("/api/search")
def search(
    customer_id: str
):

    df = prediction_df[
        prediction_df["CustomerID"]
        .astype(str)
        .str.contains(
            str(customer_id),
            case=False,
            na=False
        )
    ]

    return clean_records(df)


# =====================================================
# DEBUG ENDPOINT
# =====================================================

@app.get("/api/debug")
def debug():

    return {
        "columns":
            prediction_df.columns.tolist(),

        "rows":
            len(prediction_df),

        "high_risk_count":
            int(
                (
                    prediction_df["RiskSegment"]
                    == "High Risk"
                ).sum()
            )
    }


# print(BASE_DIR)
# print(DATA_DIR)
# print(DATA_DIR.exists()) # DEBUG