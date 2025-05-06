from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import colorgram
from PIL import Image
import io

# Assuming your types.ts equivalent structures for Python (Pydantic models)
# For simplicity, we'll directly return dicts matching the frontend's expected structure
# In a larger app, you'd define Pydantic models for request/response validation.

app = FastAPI(title="ColorBuddy API")

# CORS Middleware
origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "ColorBuddy API is running!"}

@app.post("/api/palette/extract")
async def extract_palette_from_image(image_file: UploadFile = File(...)):
    """
    Extracts a color palette from an uploaded image.
    Expects 'image_file' in the multipart/form-data.
    """
    if not image_file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        # Read image content
        contents = await image_file.read()
        img = Image.open(io.BytesIO(contents))

        # Ensure image is in RGB mode for colorgram
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Extract colors using colorgram.py
        # Extract 6 colors. You can adjust this number.
        colors = colorgram.extract(img, 6)

        # Format colors for the response
        palette = []
        for color in colors:
            palette.append({"hex": f"#{color.rgb.r:02x}{color.rgb.g:02x}{color.rgb.b:02x}".upper()})
        
        if not palette:
            raise HTTPException(status_code=500, detail="Could not extract any colors from the image.")

        return {"palette": palette, "message": "Palette extracted successfully"}

    except HTTPException as e: # Re-raise HTTPExceptions
        raise e
    except Exception as e:
        print(f"Error processing image: {e}") # Log the error server-side
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        await image_file.close()


@app.get("/api/palette/random")
async def get_random_palette():
    """
    Generates a random, aesthetically pleasing palette.
    (Placeholder - simple random hex for now)
    """
    # TODO: Implement a more sophisticated random palette generation
    import random
    palette = []
    for _ in range(5): # Generate 5 random colors
        r = random.randint(0, 255)
        g = random.randint(0, 255)
        b = random.randint(0, 255)
        palette.append({"hex": f"#{r:02x}{g:02x}{b:02x}".upper()})
    
    return {"palette": palette, "message": "Random palette generated"}

# Neskôr pripojíme router pre palety (if you decide to split into multiple files)
# from .api import palette_router
# app.include_router(palette_router, prefix="/api/v1")