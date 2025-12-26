from http import HTTPStatus
from typing import Type

from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import JSONResponse

from exceptions import AppError, TaskNotFoundError, TaskAlreadyExistsError

APP_ERROR_STATUS_MAP: dict[Type[AppError], HTTPStatus] = {
    TaskNotFoundError: HTTPStatus.NOT_FOUND,
    TaskAlreadyExistsError: HTTPStatus.BAD_REQUEST,
}


def register_errors_handlers(app: FastAPI) -> None:

    @app.exception_handler(AppError)
    def handle_app_error(request: Request, exc: AppError):
        status_code = APP_ERROR_STATUS_MAP.get(type(exc), 500)
        return JSONResponse(status_code=status_code, content={"error": str(exc)})
