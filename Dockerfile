FROM python:3.10-slim

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU PyTorch
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# PATCH DJANGO-Q FOR DJANGO 4.2+
RUN sed -i "s/providing_args=\[.*\]//g" /usr/local/lib/python3.10/site-packages/django_q/signals.py

COPY . .
RUN python backend/manage.py collectstatic --noinput

EXPOSE 7860
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:7860"]