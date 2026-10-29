from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.core.logging import configure_logging
from app.discovery import discover_routers


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()

    application = FastAPI(title="Swape API", version="0.1.0")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(application)
    for router in discover_routers():
        application.include_router(router)
    return application


app = create_app()
