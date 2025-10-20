# Leonardo.ai Integration Implementation Plan

## Overview

Implement Leonardo.ai image generation as an alternative to OpenAI using a provider pattern with environment-based switching.

**✅ FRONTEND COMPATIBILITY**: This is a backend-only change. The frontend contract (`POST /images/generate` returns `{ imageUrl, prompt }`) remains unchanged. No frontend modifications needed.

## Implementation Steps

### 1. Create Provider Architecture

**Simpler approach than email pattern** - image generation is stateless with a single primary method.

Create lightweight provider classes:

- `backend/src/services/imageGeneration/OpenAIProvider.js` - Wraps OpenAI API calls
- `backend/src/services/imageGeneration/LeonardoProvider.js` - Wraps Leonardo.ai API calls
- `backend/src/services/imageGeneration/StubProvider.js` - Returns placeholder images

**No abstract base class needed** - the interface is simple enough without OOP inheritance.

**Interface Contract** (enforced by convention):

```javascript
async generateRawImage(prompt) // Returns temporary image URL from vendor
```

**Note:** Prompt building, retry logic, and Supabase storage upload remain in `ImageGeneratorService` (provider-agnostic).

### 2. Implement Leonardo.ai Provider

Create `backend/src/lib/leonardo.js` with Leonardo.ai SDK client initialization.

In `LeonardoProvider.js`:

- Support both `LucidRealism` and `LucidOrigin` models (configurable via `LEONARDO_MODEL` env var)
- Implement Leonardo.ai API flow:
  1. POST to `/generations` endpoint to create generation job
  2. Poll `/generations/{id}` for completion status
  3. Download generated image from Leonardo's CDN
  4. Upload to Supabase storage (same as OpenAI flow in lines 160-188 of `imageGenerator.js`)
- Adapt `buildPrompt()` method for Leonardo.ai's prompt style (negative prompts, style presets)
- Handle Leonardo.ai specific errors (credit exhaustion, generation failures)

### 3. Refactor Current Implementation

Update `backend/src/services/imageGenerator.js`:

- Replace direct OpenAI logic with factory pattern call
- Use `ImageGeneratorFactory.getProvider()` to get active provider
- Keep retry logic generic and provider-agnostic
- Preserve Supabase storage upload logic

Update `backend/src/config/features.js`:

```javascript
const features = {
  imageGenerationProvider: process.env.IMAGE_GENERATION_PROVIDER || 'openai',
  leonardoModel: process.env.LEONARDO_MODEL || 'leonardo-phoenix-1.0',
};
```

### 4. Update Configuration

Update `backend/env.example`:

```bash
# Image Generation Provider: openai, leonardo, stub
IMAGE_GENERATION_PROVIDER=openai

# OpenAI Configuration (when using openai provider)
OPENAI_API_KEY=your_openai_api_key_here

# Leonardo.ai Configuration (when using leonardo provider)
LEONARDO_API_KEY=your_leonardo_api_key_here
LEONARDO_MODEL=leonardo-phoenix-1.0  # or lucid-realism-1.0
```

Remove deprecated `USE_STUB_IMAGE_GENERATION` flag (replaced by `IMAGE_GENERATION_PROVIDER=stub`)

### 5. Install Dependencies

Add Leonardo.ai SDK or axios for API calls:

```bash
npm install @leonardo-ai/sdk
```

(If SDK not available, use axios directly)

### 6. Error Handling

Ensure all providers throw errors consistently:

- Network errors: "Failed to connect to image generation service"
- API errors: Include status code and vendor-specific message
- Timeout errors: "Image generation timed out"

No fallback between providers - errors surface to the user via `backend/src/routes/images.js` line 34.

### 7. Update Documentation

Update `backend/TESTING_README.md` with:

- How to switch providers via environment variables
- Leonardo.ai API key setup instructions
- Testing with different models (LucidRealism vs LucidOrigin)

### 8. Testing

Create `backend/tests/services/imageGeneration/` directory:

- Unit tests for `LeonardoProvider.js`
- Integration test verifying factory returns correct provider
- Test error handling for Leonardo.ai specific failures

Update `backend/scripts/test-image-generation.js` to support provider switching.

## Key Design Decisions

1. **Provider Pattern**: Mirrors existing email service architecture (`EmailVendorProvider`, `EmailServiceFactory`) for consistency
2. **Model Selection**: Support both LucidRealism and LucidOrigin via `LEONARDO_MODEL` env var
3. **No Fallback**: Errors propagate directly to user, consistent with current OpenAI behavior
4. **Storage Strategy**: All providers upload to Supabase storage for consistent URL management
5. **Backward Compatibility**: OpenAI remains default provider when `IMAGE_GENERATION_PROVIDER` not set

## Files to Modify

- `backend/src/services/imageGenerator.js` - Refactor to use factory
- `backend/src/config/features.js` - Add provider config
- `backend/env.example` - Add Leonardo vars
- `backend/package.json` - Add Leonardo SDK

## Files to Create

- `backend/src/services/imageGeneration/ImageGeneratorProvider.js`
- `backend/src/services/imageGeneration/OpenAIProvider.js`
- `backend/src/services/imageGeneration/LeonardoProvider.js`
- `backend/src/services/imageGeneration/StubProvider.js`
- `backend/src/services/imageGeneration/ImageGeneratorFactory.js`
- `backend/src/lib/leonardo.js`
- `backend/tests/services/imageGeneration/leonardoProvider.test.js`

## Implementation Todos

1. ✅ Create provider architecture with base class, factory, and directory structure
2. ✅ Extract existing OpenAI logic into OpenAIProvider class
3. ✅ Implement LeonardoProvider with LucidRealism/LucidOrigin model support
4. ✅ Migrate stub logic into StubProvider class
5. ✅ Refactor ImageGeneratorService to use factory pattern
6. ✅ Update features.js and env.example with provider configuration
7. ✅ Install Leonardo.ai SDK or configure axios for API calls
8. ✅ Create unit and integration tests for Leonardo provider
9. ✅ Update TESTING_README.md with provider switching instructions
