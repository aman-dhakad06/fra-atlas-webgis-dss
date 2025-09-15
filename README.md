🌳 FRA Atlas & WebGIS-based Decision Support System (DSS)

Ministry of Tribal Affairs – FRA Implementation Monitoring
This project builds an AI-powered FRA Atlas integrated with WebGIS and a Decision Support System (DSS) to monitor and support Forest Rights Act (FRA), 2006 implementation in states like Madhya Pradesh, Tripura, Odisha, Telangana.


---

🚀 Project Objectives

Digitize legacy FRA claims & pattas using AI.

Build an interactive FRA Atlas with GIS layers.

Map assets (agriculture, forest, water, homesteads) using AI/Remote Sensing.

Create a DSS engine to layer FRA holders with Central Schemes (PM-KISAN, Jal Jeevan Mission, MGNREGA, DAJGUA).

Provide a WebGIS portal for visualization, monitoring, and decision-making.



---

🏗️ Project Architecture

FRA Documents → OCR + NER → Database (PostGIS)
Satellite Imagery → AI/ML → Asset Maps
Backend (Flask) → APIs → Frontend (React + WebGIS)
DSS Engine → Recommendations → Dashboards
Deployment (Docker + Azure/AWS)


---

📂 Repository Structure

fra-atlas-webgis-dss/
│── README.md
│── requirements.txt          # Python dependencies
│── package.json              # React dependencies
│── docker-compose.yml
│── backend/                  # Flask backend
│── frontend/                 # React frontend
│── ai-ml/                    # AI/ML models + scripts
│── gis/                      # GIS layers (shapefiles, geojson)
│── devops/                   # CI/CD, Docker, Cloud configs
│── docs/                     # Documentation


---

⚙️ Tech Stack

AI/ML & Data

Python, TensorFlow/PyTorch, scikit-learn

Google Earth Engine, Remote Sensing (NDVI, NDWI)

OCR (Tesseract, AWS Textract, HuggingFace NER)


Backend

Flask (Python)

PostgreSQL + PostGIS


Frontend

React.js

Leaflet / Mapbox / Kepler.gl


DevOps & Deployment

Docker, GitHub Actions

Azure / AWS / NIC Cloud

GeoServer for GIS layers



---

🔧 Setup Instructions

1️⃣ Clone Repository

git clone https://github.com/<your-org>/fra-atlas-webgis-dss.git
cd fra-atlas-webgis-dss

2️⃣ Backend Setup (Flask + PostGIS)

cd backend
python3 -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)
pip install -r requirements.txt
flask run

3️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

4️⃣ AI/ML Setup

cd ai-ml
jupyter notebook
# Run training/inference notebooks

5️⃣ Docker Deployment (DevOps)

docker-compose up --build


---

🧑‍🤝‍🧑 Team Members

Vikram Sen – Team Lead, Data Science, ML, Backend, Database, GenAI

Rohit Singh – Frontend (React), DSA, WebGIS UI

Sanjay Dhakad – DevOps, Docker, Azure, Deployment

Aman Dhakad – Frontend, Database, Integration

Chanchal Gupta – Frontend, Data Analysis, Python Support

Abhishek Chaudhary – Data Science, Backend (Flask), DSS Engine



---

📊 Deliverables

✅ AI-digitized FRA archive

✅ FRA Atlas (WebGIS portal)

✅ AI-based asset maps

✅ DSS engine for scheme recommendations



---

🌱 Future Scope

Real-time satellite feed integration

IoT sensors (soil, water quality)

Mobile-based FRA holder feedback & updates



---

🤝 Contribution Guidelines

1. Create a feature branch (feature/<your-task>)


2. Commit changes with clear messages


3. Push & open a Pull Request to dev


4. Sanjay’s CI/CD pipeline will test & deploy


5. Once reviewed → merge into main

