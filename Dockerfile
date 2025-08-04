FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend code
COPY app ./app

# Copy static frontend (adjust path to match your build setup)
COPY static ./static

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]