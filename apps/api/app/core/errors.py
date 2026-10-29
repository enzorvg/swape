"""Domain errors. Services raise these; they are turned into JSON HTTP errors here.

Never raise HTTPException from a service or repository: raise a DomainError subclass.
Error bodies look like {"error": {"code": "offer_not_found", "message": "..."}}.
Messages are shown to users: never put personal data in them.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class DomainError(Exception):
    status_code = 400
    code = "bad_request"

    def __init__(self, message: str, *, code: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        if code is not None:
            self.code = code


class NotFoundError(DomainError):
    status_code = 404
    code = "not_found"


class PermissionDeniedError(DomainError):
    status_code = 403
    code = "forbidden"


class AuthenticationError(DomainError):
    status_code = 401
    code = "unauthenticated"


class ConflictError(DomainError):
    status_code = 409
    code = "conflict"


async def _handle_domain_error(_: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, DomainError):  # registered for DomainError only
        raise exc
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(DomainError, _handle_domain_error)
