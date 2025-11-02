# Questionnaire Simplification - Implementation Specification

**Status:** ✅ Implemented  
**Date:** 2025-11-02  
**Impact:** High - Frontend & Backend  
**Migration Required:** Yes - Database migration needed

---

## Overview

This specification documents the simplification of the user questionnaire from 7 steps to 5 steps by removing redundant and confusing fields, and improving the overall prompt generation logic for AI image generation.

## Motivation

### Problems Identified

1. **Redundancy:** The `mainElement` field overlapped significantly with the `style` field
2. **Non-visual Field:** The `occasion` field was not a visual characteristic and didn't contribute to image generation
3. **Confusion:** Users were unclear about the difference between style and main element
4. **Prompt Bloat:** Generated prompts included unnecessary poster/frame/mockup language that confused the AI
5. **Terminology Mismatch:** "Poster" implied a specific format when we're creating general artwork

### Goals

- Reduce questionnaire steps from 7 to 5
- Remove overlapping fields (`mainElement`, `occasion`)
- Simplify prompt generation
- Update terminology from "poster" to "artwork"
- Improve AI image generation results

---

## Changes Made

### 1. Database Migration

**File Created:** `backend/src/db/remove_obsolete_questionnaire_options.sql`

Removes obsolete questionnaire options from the database:

- Deletes all `main_element` type options (3 rows)
- Deletes all `occasion` type options (5 rows)

**Action Required:** Run this migration before deploying frontend/backend changes.

### 2. Backend Changes

#### A. Image Generator Service

**File:** `backend/src/services/imageGenerator.js`

**Changes:**

- Simplified `buildPrompt()` method
- Removed all poster/frame/mockup references from prompts
- Removed `mainElement` and `occasion` parameters
- Created direct, simple prompt structure focused on describing the artwork itself
- Expanded style descriptions to incorporate functionality from removed `mainElement` field

**Before:**

```javascript
buildPrompt(theme, palette, style, mainElement, emotion, occasion, inspiration);
```

**After:**

```javascript
buildPrompt(theme, palette, style, emotion, inspiration);
```

**New Prompt Format:**

```
Create [theme subject], inspired by the concept of "[optional keyword]".

Style: [style description]
Mood: [emotion description]
Colors: [palette description]
Lighting: [lighting description]

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges.
```

#### B. API Validation

**File:** `backend/src/routes/images.js`

**Changes:**

- Updated validation to only check: `theme`, `palette`, `style`, `emotion`
- Removed `mainElement` and `occasion` from required field validation
- Updated error messages
- Simplified request validation logic

### 3. Frontend Changes

#### A. Questionnaire Page

**File:** `frontend/src/pages/QuestionnairePage.jsx`

**Changes:**

- Reduced questionnaire from 7 steps to 5 steps
- Removed `mainElement` step (former step 4)
- Removed `occasion` step (former step 5)
- Updated all UI text from "poster" to "artwork"
- Updated button text: "Generate Poster" → "Generate Artwork"
- Updated loading text: "Generating your poster..." → "Generating your artwork..."
- Updated result heading: "Your Generated Poster" → "Your Generated Artwork"

**New Step Structure:**

1. **Theme** (4 options: Nature, Urban, Fantasy, Futuristic)
2. **Palette** (4 options: Warm, Cool, Monochrome, Vibrant)
3. **Style** (6 options: Modern, Vintage, Abstract, Minimalist, Photorealistic, Illustrated)
4. **Emotion** (4 options: Calm, Energetic, Mysterious, Joyful)
5. **Inspiration Keyword** (optional text input)

**Old Step Structure (Removed):**

1. Theme
2. Palette
3. Style
4. ~~Main Element~~ ❌ REMOVED
5. ~~Occasion~~ ❌ REMOVED
6. Emotion
7. Inspiration Keyword

#### B. Questionnaire Context

**File:** `frontend/src/contexts/QuestionnaireContext.jsx`

**Changes:**

- Updated initial state to only include 5 fields
- Removed `mainElement` and `occasion` from responses state
- Updated `nextStep()` to reflect 5 steps (0-4 index instead of 0-6)
- Updated `resetQuestionnaire()` to match new structure
- Simplified state management logic

---

## Migration Steps

### Prerequisites

- Backup your database before running migrations
- Ensure you have Supabase access configured
- All code changes must be deployed after database migration

### Step 1: Run Database Migration

**Option A: Using Supabase Dashboard (Recommended)**

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Open: `backend/src/db/remove_obsolete_questionnaire_options.sql`
4. Copy the SQL content
5. Paste into the SQL Editor
6. Click "Run"

**Option B: Using Supabase CLI**

```bash
cd backend
supabase db execute --file src/db/remove_obsolete_questionnaire_options.sql
```

### Step 2: Verify Database Changes

Run this verification query:

```sql
SELECT type, COUNT(*) as count
FROM questionnaire_options
GROUP BY type
ORDER BY type;
```

**Expected Result:**

- `emotion`: 4 options ✅
- `palette`: 4 options ✅
- `style`: 6 options ✅
- `theme`: 4 options ✅

**Should NOT appear:**

- `main_element` ❌
- `occasion` ❌

### Step 3: Deploy Code Changes

```bash
# Backend
cd backend
npm install  # If needed
npm start

# Frontend
cd frontend
npm install  # If needed
npm start
```

### Step 4: Test the Application

**Functional Tests:**

1. Navigate to the questionnaire page
2. Verify only 5 steps appear (no mainElement or occasion)
3. Complete all steps:
   - Select theme
   - Select palette
   - Select style
   - Select emotion
   - Optionally enter inspiration keyword
4. Click "Generate Artwork"
5. Verify image generation completes successfully

**Backend Verification:**

- Check backend console logs for generated prompt
- Confirm prompt doesn't mention "poster", "frame", or "mockup"
- Verify prompt describes the artwork directly

**Image Quality:**

- Verify generated images match selections
- Test multiple combinations of options
- Verify optional inspiration keyword affects results appropriately

---

## Testing Instructions

### Unit Tests

```bash
cd backend
npm test -- images.test.js
npm test -- questionnaire.test.js
```

### Integration Testing

1. **Happy Path:**

   - Complete full questionnaire with all 5 steps
   - Generate image
   - Verify image URL returned
   - Save as draft
   - Verify draft saved with correct fields

2. **Edge Cases:**

   - Try generating without optional inspiration keyword
   - Test with each combination of required fields
   - Verify validation errors for missing required fields

3. **Regression Testing:**
   - Verify existing drafts still load correctly
   - Verify orders reference drafts correctly
   - Check that no old code references `mainElement` or `occasion`

### Manual Testing Checklist

- [ ] Questionnaire shows exactly 5 steps
- [ ] All text says "artwork" not "poster"
- [ ] Generate button says "Generate Artwork"
- [ ] Loading spinner shows "Generating your artwork..."
- [ ] Result heading says "Your Generated Artwork"
- [ ] Image generation succeeds
- [ ] Save draft works
- [ ] Draft appears in "My Drafts"
- [ ] Can proceed to checkout from draft
- [ ] Backend logs show simplified prompt format

---

## Expected Prompt Examples

### Example 1: Nature Theme

**Input:**

- Theme: Nature
- Palette: Warm
- Style: Photorealistic
- Emotion: Calm
- Inspiration: "mountain peaks"

**Generated Prompt:**

```
Create natural landscape or organic elements, inspired by the concept of "mountain peaks".

Style: photorealistic, fine texture and detail, lifelike lighting
Mood: calm and serene
Colors: bright colors — ivory, soft yellow, sky blue
Lighting: soft diffused light, gentle ambiance

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges.
```

### Example 2: Urban Theme

**Input:**

- Theme: Urban
- Palette: Cool
- Style: Modern
- Emotion: Energetic
- Inspiration: (none)

**Generated Prompt:**

```
Create cityscape or architectural subjects.

Style: clean lines, contemporary aesthetic, sleek surfaces
Mood: energetic and dynamic
Colors: darker palette — charcoal, slate blue, forest green
Lighting: dramatic contrast, bold shadows

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges.
```

---

## Rollback Instructions

If you need to revert these changes:

### 1. Restore Database

Re-run the full questionnaire initialization:

```bash
cd backend
supabase db execute --file src/db/init_questionnaire.sql
```

### 2. Restore Code Files

Using git:

```bash
# Navigate to project root
cd posterai-platform-codeguide

# Restore all modified files
git checkout HEAD~1 backend/src/services/imageGenerator.js
git checkout HEAD~1 backend/src/routes/images.js
git checkout HEAD~1 frontend/src/pages/QuestionnairePage.jsx
git checkout HEAD~1 frontend/src/contexts/QuestionnaireContext.jsx

# Delete the new migration file
rm backend/src/db/remove_obsolete_questionnaire_options.sql
```

### 3. Redeploy

```bash
# Restart backend
cd backend
npm start

# Restart frontend
cd frontend
npm start
```

---

## Benefits Achieved

✅ **Simpler User Experience:** 28% fewer steps (7→5)  
✅ **Clearer Intent:** "Artwork" terminology is more accurate  
✅ **Better Prompts:** Direct description without poster/frame confusion  
✅ **No Redundancy:** Style field now covers mainElement functionality  
✅ **Visual Focus:** Removed non-visual field (occasion)  
✅ **Cleaner Code:** Reduced complexity in prompt generation  
✅ **Better AI Results:** Simplified prompts produce more accurate images

---

## Files Modified

### Backend

- ✅ `backend/src/db/remove_obsolete_questionnaire_options.sql` (new)
- ✅ `backend/src/services/imageGenerator.js`
- ✅ `backend/src/routes/images.js`

### Frontend

- ✅ `frontend/src/pages/QuestionnairePage.jsx`
- ✅ `frontend/src/contexts/QuestionnaireContext.jsx`

### Documentation

- ✅ `.spec/questionnaire-simplification.md` (this file)
- ✅ `.spec/INDEX.md` (updated)

---

## Related Documents

- [Backend API Testing](../verifications/BACKEND_API_TESTING.md)
- [E2E Testing Guide](../E2E_TESTING_GUIDE.md)
- [PRD - User Flow](../.cursor/rules/unified-project-documentation.mdc)

---

**Last Updated:** 2025-11-02  
**Author:** AI Assistant (Cursor)  
**Reviewed By:** Pending  
**Status:** ✅ Implemented - Ready for Testing
