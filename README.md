# CustomerPulse



CustomerPulse is an end to end customer churn intelligence dashboard that combines machine learning predictions with an interactive business dashboard.



The project predicts customer churn probability, segments customers by risk, and surfaces actionable retention insights through a FastAPI backend and a browser based dashboard.



## Features



* Customer churn prediction pipeline

* Customer Health Score generation

* Risk segmentation and retention prioritization

* Interactive dashboard with data visualizations

* Customer search and filtering

* CSV export functionality

* REST API built with FastAPI



## Tech Stack



### Machine Learning



* Python

* Pandas

* NumPy

* Scikit Learn

* XGBoost

* LightGBM



### Backend



* FastAPI

* Uvicorn



### Frontend



* HTML

* CSS

* Vanilla JavaScript

* Apache ECharts

* Lucide Icons



## Dashboard Modules



* KPI cards

* Customer Health Distribution

* Risk Distribution

* Customer Segments

* Feature Importance

* AI generated insights

* Customer Directory



## Project Structure



```text

backend/

frontend/

notebooks/

data/

```


# CustomerPulse



CustomerPulse is an end to end customer churn intelligence dashboard that combines machine learning predictions with an interactive business dashboard.



The project predicts customer churn probability, segments customers by risk, and surfaces actionable retention insights through a FastAPI backend and a browser based dashboard.



## Features



* Customer churn prediction pipeline

* Customer Health Score generation

* Risk segmentation and retention prioritization

* Interactive dashboard with data visualizations

* Customer search and filtering

* CSV export functionality

* REST API built with FastAPI



## Tech Stack



### Machine Learning



* Python

* Pandas

* NumPy

* Scikit Learn

* XGBoost

* LightGBM



### Backend



* FastAPI

* Uvicorn



### Frontend



* HTML

* CSS

* Vanilla JavaScript

* Apache ECharts

* Lucide Icons



## Dashboard Modules



* KPI cards

* Customer Health Distribution

* Risk Distribution

* Customer Segments

* Feature Importance

* AI generated insights

* Customer Directory



## Project Structure



```text

backend/
    api.py

frontend/
    index.html
    assets/
        favicon.ico
    css/
        variables.css
        layout.css
        dashboard.css
    js/
        api.js
        dashboard.js

notebooks/
    main.ipynb
input_data/
    Telco_customer_churn.csv

output_data/
    customerpulse_summary.csv
    executive_kpis.csv
    feature_importance.csv
    model_metrics.csv
    prediction_table.csv

```



## Getting Started

### Prerequisites

This project was developed and tested with:

* Python 3.11.6 

Download it [here.](https://www.python.org/ftp/python/3.11.6/python-3.11.6-amd64.exe)

Using a different Python version may result in dependency issues.

---

### 1. Clone the repository

```bash
git clone
cd CustomerPulse
```

---

### 2. Install dependencies

Create a virtual environment if desired:

```bash
python -m venv .venv
```

Activate it:

**Windows**

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Generate the project artifacts

Open the Jupyter notebook inside the `notebooks` directory and run all cells until completion.

The notebook generates the files required by the backend and populates the `output` directory.

The dashboard will not function correctly if this step is skipped.

---

### 4. Start the backend API

From the project root:

```bash
uvicorn backend.api:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

### 5. Start the frontend server

Open a new terminal:

```bash
cd frontend
python -m http.server
```

---

### 6. Open the dashboard

If using `python -m http.server`, the frontend is typically served at:

```text
http://[::]:8000/

or

```text
http://localhost:5500
```

if using the VSCode LiveServer extension by ritwickdey. (Note that you're supposed to right click on index.html and click "open with LiveServer")


## API Endpoints



```text

GET /api/dashboard

GET /api/customers

GET /api/customers/high-risk

GET /api/search

```



## Notes



This project was built as a learning exercise to understand the complete workflow of an ML powered application, from model training to deployment and frontend integration.



I used AI tools selectively during development to speed up debugging, brainstorm implementation approaches, and accelerate parts of the frontend scaffolding. The machine learning pipeline, system architecture, API integration, and overall project decisions were implemented and validated manually as part of the learning process.



## Future Improvements



* Authentication

* Database integration

* Real time predictions

* Time series analytics

* Customer profile pages

* PDF reporting

* Email notifications



## Author



Built by a B.Tech student as an end to end machine learning and full stack development project exploring customer churn prediction and business intelligence dashboards.