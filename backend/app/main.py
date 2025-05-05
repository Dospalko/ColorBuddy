from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Tu budú neskôr importy pre API routes
# from .api import palette_router

app = FastAPI(title="ColorBuddy API")

# CORS Middleware - Povoľ komunikáciu z frontendu (bežiaceho na inom porte)
origins = [
    "http://localhost",
    "http://localhost:5173", # Predvolený port pre Vite dev server
    # Pridaj sem aj adresu nasadenej appky v budúcnosti
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Povoľ všetky metódy (GET, POST, atď.)
    allow_headers=["*"], # Povoľ všetky hlavičky
)


@app.get("/")
async def read_root():
    """ Základný endpoint na overenie, či API beží. """
    return {"message": "ColorBuddy API is running!"}

# Neskôr pripojíme router pre palety
# app.include_router(palette_router, prefix="/api/v1") # Príklad s verziovaním

# Sem neskôr pridáš endpointy z návrhu (/api/palette/extract, /api/palette/random)
# Napr. placeholder:
@app.post("/api/palette/extract")
async def placeholder_extract():
    # TODO: Implement image upload and palette extraction
    return {"message": "Endpoint /api/palette/extract works - implementation pending."}

@app.get("/api/palette/random")
async def placeholder_random():
    # TODO: Implement random palette generation (maybe via Celery)
    return {"message": "Endpoint /api/palette/random works - implementation pending."}