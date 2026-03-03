FROM python:3.11-slim
WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app folder INTO a subfolder named 'app'
COPY ./app /code/app

EXPOSE 8000

# Run uvicorn pointing to the app module
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
