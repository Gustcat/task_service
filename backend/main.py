import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from errors_handlers import register_errors_handlers
from routers.tasks import router

app = FastAPI()

register_errors_handlers(app)

origins = [
    "http://localhost",
    f"http://{settings.frontend_host}:{settings.frontend_port}",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/tasks", tags=["tasks"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app", host=settings.http_host, port=settings.http_port, reload=True
    )
