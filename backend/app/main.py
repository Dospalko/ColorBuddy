from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .api.routes import palette as palette_router # Import the palette router
from .models.palette import BaseMessage # For the root endpoint response model

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json" # Consistent prefix
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS], # Ensure origins are strings
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

@app.get("/", response_model=BaseMessage, tags=["Root"])
async def read_root():
    """ Basic endpoint to check if the API is running. """
    return {"message": f"{settings.PROJECT_NAME} is running!"}

# Include your API routers
app.include_router(palette_router.router, prefix=f"{settings.API_V1_PREFIX}/palette", tags=["Palette Operations"])
# The prefix in include_router is combined with any prefix on the router itself.
# So if palette_router has @router.post("/extract"), the full path becomes /api/palette/extract

# Example of another router if you add more features:
# from .api.routes import user as user_router
# app.include_router(user_router.router, prefix=f"{settings.API_V1_PREFIX}/users", tags=["User Operations"])