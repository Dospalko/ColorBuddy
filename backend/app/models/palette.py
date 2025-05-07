from pydantic import BaseModel, Field
from typing import List, Optional

class ColorModel(BaseModel):
    hex: str = Field(..., example="#FF5733", description="Hexadecimal color code.")
    name: Optional[str] = Field(None, example="Fiery Orange", description="Optional name for the color.")

class PaletteResponse(BaseModel):
    palette: List[ColorModel] = Field(..., description="List of colors in the palette.")
    message: Optional[str] = Field(None, example="Palette generated successfully.", description="Optional status message.")

class BaseMessage(BaseModel):
    message: str