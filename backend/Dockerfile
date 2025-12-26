FROM python:3.11-slim

WORKDIR /back

COPY backend/requirements.txt .
COPY .env .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD uvicorn main:app --host $HTTP_HOST --port $HTTP_PORT