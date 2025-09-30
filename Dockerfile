FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU PyTorch with EXTRA index (keeps PyPI as primary)
RUN pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu

# Install other dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create media directory (for resume uploads)
RUN mkdir -p backend/media/resumes

# Copy backend
COPY backend/ ./backend/

# Copy frontend build to static files
RUN mkdir -p backend/staticfiles
COPY frontend/build/ backend/staticfiles/

# Collect static files
RUN python backend/manage.py collectstatic --noinput

# Expose port
EXPOSE 7860

# Start server
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:7860"]