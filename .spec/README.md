# .spec Directory

## Purpose

This directory contains detailed specification documents for major features, changes, and system modifications to the PosterAI Platform. Each specification provides complete documentation for understanding, implementing, testing, and rolling back significant changes.

## Structure

```
.spec/
├── INDEX.md                              # Master index of all specifications
├── README.md                            # This file
└── [feature-name].md                    # Individual specification documents
```

## When to Create a Specification

Create a new specification document when:

- ✅ Implementing a major feature or refactoring
- ✅ Making breaking changes to APIs or database schema
- ✅ Modifying core user flows or business logic
- ✅ Integrating new third-party services
- ✅ Changing system architecture
- ✅ Performing data migrations

**Don't create specs for:**

- ❌ Minor bug fixes
- ❌ Cosmetic UI changes
- ❌ Configuration updates
- ❌ Dependency version bumps

## Specification Template

Each specification should follow this structure:

```markdown
# [Feature Name] - Implementation Specification

**Status:** 🟡 In Progress / ✅ Implemented / ❌ Deprecated  
**Date:** YYYY-MM-DD  
**Impact:** Low / Medium / High  
**Migration Required:** Yes / No

---

## Overview

Brief description of the change (2-3 sentences).

## Motivation

### Problems Identified

- Problem 1
- Problem 2

### Goals

- Goal 1
- Goal 2

---

## Changes Made

### 1. Component/Area A

**File:** `path/to/file.js`
**Changes:**

- Change 1
- Change 2

### 2. Component/Area B

...

---

## Migration Steps

### Prerequisites

- Prerequisite 1

### Step 1: ...

Instructions...

### Step 2: ...

Instructions...

---

## Testing Instructions

### Unit Tests

...

### Integration Testing

...

### Manual Testing Checklist

- [ ] Test case 1
- [ ] Test case 2

---

## Rollback Instructions

Step-by-step instructions to undo changes if needed.

---

## Benefits Achieved

✅ Benefit 1  
✅ Benefit 2

---

## Files Modified

- ✅ `path/to/file1.js`
- ✅ `path/to/file2.js`

---

## Related Documents

- [Related Doc 1](../path/to/doc.md)

---

**Last Updated:** YYYY-MM-DD  
**Author:** Name  
**Reviewed By:** Name  
**Status:** Current status
```

## How to Use

### Creating a New Specification

1. Copy the template above
2. Create a new file: `.spec/[descriptive-name].md`
3. Fill in all sections completely
4. Add an entry to `INDEX.md`
5. Commit with both the spec and the code changes

### Updating an Existing Specification

1. Open the relevant `.md` file
2. Update the necessary sections
3. Update the "Last Updated" date
4. Update status in `INDEX.md` if needed
5. Commit the update

### Finding a Specification

1. Check `INDEX.md` for a list of all specs
2. Look for specs by date, status, or keyword
3. Each spec has a descriptive filename

## Naming Conventions

Use kebab-case for filenames:

- ✅ `questionnaire-simplification.md`
- ✅ `leonardo-ai-integration.md`
- ✅ `payment-gateway-upgrade.md`
- ❌ `QuestionnaireSimplification.md`
- ❌ `questionnaire_simplification.md`

## Maintenance

- Review specs quarterly to update status
- Archive deprecated specs to `.spec/archive/`
- Keep INDEX.md current with all active specs
- Remove or archive specs older than 1 year that are fully integrated

## Integration with Project Rules

This `.spec` directory complements the `.cursor/rules/` directory:

| Directory        | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `.cursor/rules/` | Ongoing project guidelines, coding standards, architecture patterns |
| `.spec/`         | Point-in-time specifications for specific changes and features      |

---

**Maintained by:** Development Team  
**Last Updated:** 2025-11-02
