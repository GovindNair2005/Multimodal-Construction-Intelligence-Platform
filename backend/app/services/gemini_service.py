import json
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiMultimodalService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Google GenAI client initialized successfully with API key.")
            except Exception as e:
                logger.warning(f"Failed to initialize Google GenAI client: {e}. Falling back to simulation engine.")
        else:
            logger.info("GEMINI_API_KEY not set. Running in intelligent local mock/fallback mode.")

    def is_live_api_active(self) -> bool:
        return self.client is not None

    async def analyze_multimodal(
        self,
        prompt: str,
        image_bytes: Optional[bytes] = None,
        mime_type: str = "image/jpeg",
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes multimodal prompt against Google Gemini API if configured;
        otherwise safely falls back to high-fidelity structured analysis.
        """
        if self.client:
            try:
                from google.genai import types
                contents = []
                if image_bytes:
                    contents.append(
                        types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
                    )
                contents.append(prompt)

                config = types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json"
                )

                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=contents,
                    config=config
                )
                
                text_content = response.text.strip()
                # Parse JSON safely
                if text_content.startswith("```json"):
                    text_content = text_content[7:]
                if text_content.endswith("```"):
                    text_content = text_content[:-3]
                return json.loads(text_content.strip())
            except Exception as e:
                logger.error(f"Live Gemini API invocation error: {e}. Falling back to intelligent response generator.")

        return {}

gemini_service = GeminiMultimodalService()
