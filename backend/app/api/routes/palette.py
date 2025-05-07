from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from typing import Optional

from ....app.models.palette import PaletteResponse # Adjusted import path
from ....app.services.image_processor import image_processor_service # Adjusted import path
from ....app.services.palette_generator import palette_generator_service # Placeholder, create this file
from ....app.core.config import settings # Adjusted import path

router = APIRouter()

@router.post(
    "/extract",
    response_model=PaletteResponse,
    summary="Extract Palette from Image",
    description="Upload an image to extract its dominant color palette."
)
async def extract_palette_from_image_endpoint(
    image_file: UploadFile = File(..., description="Image file (PNG, JPG, GIF)."),
    num_colors: Optional[int] = Query(
        settings.DEFAULT_PALETTE_SIZE,
        ge=1,
        le=20,
        description="Number of colors to extract."
    )
):
    """
    Extracts a color palette from an uploaded image.
    - **image_file**: The image to process.
    - **num_colors**: Desired number of colors in the palette (default defined in settings).
    """
    if num_colors is None: # Should not happen due to default, but good practice
        num_colors = settings.DEFAULT_PALETTE_SIZE

    extracted_palette = await image_processor_service.extract_colors_from_image(
        image_file=image_file,
        num_colors=num_colors
    )
    return PaletteResponse(palette=extracted_palette, message="Palette extracted successfully.")


@router.get(
    "/random",
    response_model=PaletteResponse,
    summary="Generate Random Palette",
    description="Generates a random or AI-assisted color palette. "
                "Currently uses a simple random generator. "
                "Future: Accepts prompts for themed generation."
)
async def get_random_palette_endpoint(
    num_colors: Optional[int] = Query(
        settings.DEFAULT_PALETTE_SIZE,
        ge=1,
        le=10,
        description="Number of colors to generate."
    ),
    prompt: Optional[str] = Query(
        None,
        max_length=100,
        description="Optional text prompt to guide AI palette generation (e.g., 'serene beach sunset')."
    )
):
    """
    Generates a random palette.
    - **num_colors**: Desired number of colors.
    - **prompt**: (Future Feature) Text prompt for AI generation.
    """
    if num_colors is None:
        num_colors = settings.DEFAULT_PALETTE_SIZE

    # For now, prompt is just logged. Later, it will be used by palette_generator_service
    if prompt:
        print(f"Received prompt for random palette: {prompt}") # Replace with logging

    generated_palette = palette_generator_service.generate_palette(
        num_colors=num_colors,
        prompt=prompt # Pass the prompt to the service
    )
    return PaletteResponse(palette=generated_palette, message="Palette generated.")