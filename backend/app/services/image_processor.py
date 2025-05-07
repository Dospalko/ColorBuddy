import io
from PIL import Image
import colorgram
from fastapi import HTTPException, UploadFile
from typing import List
from ..models.palette import ColorModel
from ..core.config import settings

class ImageProcessorService:
    @staticmethod
    def _validate_image(image_file: UploadFile, max_size_mb: int):
        if not image_file.content_type or not image_file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image (PNG, JPG, GIF).")

        # Simple size check (approximate, as file.size is not always available before read)
        # A more robust check involves reading chunks or checking Content-Length header if available
        # For now, we'll rely on checking after reading the file, but it's good to be aware.

    @staticmethod
    async def extract_colors_from_image(
        image_file: UploadFile, num_colors: int = settings.DEFAULT_PALETTE_SIZE
    ) -> List[ColorModel]:
        ImageProcessorService._validate_image(image_file, settings.MAX_IMAGE_UPLOAD_SIZE_MB)

        try:
            contents = await image_file.read()

            # Check actual size after reading
            if len(contents) > settings.MAX_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024:
                raise HTTPException(
                    status_code=413, # Payload Too Large
                    detail=f"Image file too large. Maximum size is {settings.MAX_IMAGE_UPLOAD_SIZE_MB}MB."
                )

            img = Image.open(io.BytesIO(contents))

            if img.mode != 'RGB':
                img = img.convert('RGB')

            extracted_colors = colorgram.extract(img, num_colors)

            if not extracted_colors:
                raise HTTPException(status_code=500, detail="Could not extract any dominant colors from the image.")

            palette: List[ColorModel] = []
            for color in extracted_colors:
                hex_code = f"#{color.rgb.r:02x}{color.rgb.g:02x}{color.rgb.b:02x}".upper()
                palette.append(ColorModel(hex=hex_code))
            
            return palette

        except HTTPException as e:
            raise e # Re-raise specific HTTP exceptions
        except Exception as e:
            # Log the error for debugging
            print(f"Error processing image: {e}") # Replace with proper logging
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred while processing the image: {str(e)}")
        finally:
            await image_file.close()

image_processor_service = ImageProcessorService()