import random
from typing import List, Optional
from ..models.palette import ColorModel
from ..core.config import settings # If needed for specific settings

class PaletteGeneratorService:
    def generate_palette(self, num_colors: int, prompt: Optional[str] = None) -> List[ColorModel]:
        """
        Generates a palette.
        If a prompt is provided, it could be used for more advanced generation in the future.
        Currently, it generates simple random hex colors.
        """
        palette: List[ColorModel] = []

        if prompt:
            # STAGE 3: This is where you'd integrate with an AI (e.g., OpenAI)
            # or a more complex algorithmic generator based on the prompt.
            # For now, we'll acknowledge the prompt and fall back to random.
            print(f"Palette generation with prompt (not yet fully implemented): {prompt}")
            # Example: return self._generate_ai_palette(prompt, num_colors)

        # Fallback to simple random generation if no prompt or AI not implemented
        for _ in range(num_colors):
            r = random.randint(0, 255)
            g = random.randint(0, 255)
            b = random.randint(0, 255)
            hex_code = f"#{r:02x}{g:02x}{b:02x}".upper()
            palette.append(ColorModel(hex=hex_code))
        
        return palette

    # --- Placeholder for future AI-based generation (Stage 3) ---
    # def _generate_ai_palette(self, prompt: str, num_colors: int) -> List[ColorModel]:
    #     if not settings.OPENAI_API_KEY:
    #         raise HTTPException(status_code=503, detail="AI palette generation is not configured (OpenAI API key missing).")
        
    #     try:
    #         # import openai # Ensure openai library is installed
    #         # openai.api_key = settings.OPENAI_API_KEY
    #         # response = openai.Completion.create(
    #         # engine="text-davinci-003", # or a newer chat model
    #         # prompt=f"Generate a harmonious color palette of {num_colors} colors based on the theme: '{prompt}'. Provide colors as a list of hex codes.",
    #         # max_tokens=100 + (num_colors * 10) # Adjust based on expected output
    #         # )
    #         # ai_generated_hex_codes = self._parse_ai_response(response) # You'll need a parser
    #         # return [ColorModel(hex=code) for code in ai_generated_hex_codes]
    #         pass # Replace with actual implementation
    #     except Exception as e:
    #         print(f"Error generating AI palette: {e}")
    #         raise HTTPException(status_code=500, detail="Failed to generate AI palette.")
    #     # Fallback if AI fails or for testing
    #     print(f"AI palette generation for '{prompt}' would happen here. Falling back to random.")
    #     return [ColorModel(hex=f"#{random.randint(0,255):02x}{random.randint(0,255):02x}{random.randint(0,255):02x}") for _ in range(num_colors)]

    # def _parse_ai_response(self, response) -> List[str]:
    #     # Implement logic to parse hex codes from the LLM's response text.
    #     # This can be tricky and requires robust parsing (regex, string manipulation).
    #     # Example: text = response.choices[0].text
    #     # ... parse text ...
    #     return ["#FF0000", "#00FF00", "#0000FF"] # Placeholder

palette_generator_service = PaletteGeneratorService()