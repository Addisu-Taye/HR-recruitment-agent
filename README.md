# 🤖 AI-Powered HR Recruitment Agent
**Hugging Face Spaces**

---

### License
- Python  
- Django  
- React  

An end-to-end AI-powered HR recruitment system that automates the entire hiring process – from job posting and intelligent resume screening to candidate ranking and interview scheduling – using 100% free and open-source models.

---

## 🌟 Features

### 📋 Job Management
- Create, update, and publish job listings via Django Admin  
- REST API for job data consumption  
- Department and requirement categorization  

### 🤖 AI-Powered Resume Screening
- **Skill Extraction**: Automatically identifies relevant skills from resumes  
- **Experience Analysis**: Extracts years of experience and education  
- **Intelligent Matching**: Compares candidates against job requirements using semantic similarity  
- **PII Redaction**: Automatically detects and redacts sensitive information (SSN, bank accounts, phone numbers)  

### 📊 Candidate Intelligence
- **Match Scoring**: Provides percentage-based compatibility scores  
- **Strength Analysis**: Highlights candidate strengths  
- **Gap Identification**: Identifies missing critical skills  
- **Auto Shortlisting**: Automatically shortlists candidates above 70% match threshold  

### 🖥️ Professional Dashboard
- Real-time analytics and metrics  
- Job-wise application tracking  
- Candidate ranking visualization  
- Responsive React frontend with Tailwind CSS  

### 📧 Automated Workflows
- Email notifications for shortlisted candidates (SendGrid integration)  
- Interview scheduling coordination  
- Background task processing with Django-Q  

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 4.2 + Django REST Framework  
- **AI Orchestration**: LangGraph for stateful workflows  
- **Database**: SQLite (demo) / PostgreSQL (production)  
- **Task Queue**: Django-Q for background processing  

#### AI Models (All CPU-Optimized & Free)
- Resume Parsing: `dslim/bert-base-NER` (skill extraction)  
- Semantic Matching: `sentence-transformers/all-MiniLM-L6-v2`  
- Insight Generation: `google/flan-t5-small` (lightweight LLM)  
- PII Detection: Custom regex patterns + validation  

### Frontend
- **Framework**: React 18 + Vite  
- **Styling**: Tailwind CSS + Inter font  
- **Charts**: Chart.js for analytics visualization  
- **HTTP Client**: Axios  

### Deployment
- **Platform**: Hugging Face Spaces (Free Tier)  
- **Container**: Docker with CPU optimization  
- **Infrastructure**: CPU Basic (2 vCPU, 16GB RAM)  

---

## 🚀 Quick Start

### Local Development

**Clone the repository**
```bash
git clone https://github.com/your-username/hr-recruitment-agent.git
cd hr-recruitment-agent
# Backend Setup

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up database
python backend/manage.py migrate
python backend/manage.py createsuperuser

# Collect static files
python backend/manage.py collectstatic --noinput

# Run server
python backend/manage.py runserver 8084

# Frontend Setup

cd frontend
npm install
npm start

# Access the application:
# Frontend: http://localhost:3000
# Admin:    http://localhost:8084/admin
# API:      http://localhost:8084/api/jobs/

# Deployment to Hugging Face Spaces

# Build React frontend
cd frontend
npm run build

# Create HF Space
# SDK: Docker
# Hardware: CPU Basic
# Git repository: Your GitHub repo

# Add Secrets in Space Settings:
# SECRET_KEY=your-django-secret-key
# DEBUG=False

# Monitor deployment in the Logs tab
# The system will be available at:
# https://YOUR_HF_USERNAME-hr-recruitment-agent.hf.space

# Deployment to Hugging Face Spaces

# Build React frontend

