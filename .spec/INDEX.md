# Technical Specifications Index

This directory contains detailed technical documentation and integration guides for the AI Poster Platform.

## 📚 Available Documents

### Integration Guides

#### [Leonardo.ai Integration Summary](./LEONARDO_INTEGRATION_SUMMARY.md)

**Status:** ✅ Complete and Stable  
**Last Updated:** October 20, 2025

Comprehensive guide covering the full integration of Leonardo.ai as an image generation provider.

**Contents:**

- Session summary of all issues encountered and resolved
- Complete code changes with examples
- Configuration and environment setup
- API flow diagrams and response structures
- Troubleshooting guide for common issues
- Performance metrics and best practices
- Quick start guide for future sessions

**Key Information:**

- Default Model: Leonardo Kino XL (`291be633-cb24-434f-898f-e662799936ad`)
- Generation Time: 15-20 seconds average
- Polling Configuration: 60 attempts × 3 seconds = 180s timeout
- Image Format: 1024×1024 PNG
- Cost: ~40 Leonardo credits per image

**Use Cases:**

- Onboarding new developers
- Debugging Leonardo integration issues
- Understanding the image generation flow
- Context for AI agents in future sessions

---

## 📖 Document Categories

### Integration Guides

Technical documentation for third-party service integrations:

- Leonardo.ai (image generation) ✅

### Architecture Documentation

_(Coming soon)_

- System architecture overview
- Database schema and migrations
- API endpoint documentation

### Feature Specifications

_(Coming soon)_

- Questionnaire system
- Draft management
- Order processing and fulfillment

### Deployment Guides

_(Coming soon)_

- Railway deployment
- Vercel frontend deployment
- Environment configuration

---

## 🔍 Quick Reference

### Finding Information

| Topic                 | Document             | Section                                |
| --------------------- | -------------------- | -------------------------------------- |
| Leonardo API setup    | Leonardo Integration | Configuration                          |
| Authentication issues | Leonardo Integration | Troubleshooting > Authentication Error |
| Model selection       | Leonardo Integration | Model Selection                        |
| Polling timeout       | Leonardo Integration | Troubleshooting > Generation Timeout   |
| Response parsing      | Leonardo Integration | Response Structure                     |
| Prompt engineering    | Leonardo Integration | Best Practices > Prompt Engineering    |

---

## 📝 Contributing

When adding new documentation to this directory:

1. **Create descriptive filenames** using uppercase with underscores (e.g., `PAYMENT_INTEGRATION.md`)
2. **Update this INDEX.md** with:
   - Document title and link
   - Status indicator (✅ Complete, 🚧 In Progress, 📋 Planned)
   - Brief description
   - Key information or metrics
   - Last updated date
3. **Follow the structure** used in existing documents:
   - Overview section
   - Problem/solution format for integration guides
   - Code examples with syntax highlighting
   - Troubleshooting section
   - Quick reference for future use

---

## 📅 Document Status

| Document             | Status      | Last Updated | Maintainer       |
| -------------------- | ----------- | ------------ | ---------------- |
| Leonardo Integration | ✅ Complete | 2025-10-20   | AI Agent Session |

---

## 🔗 Related Resources

### External Documentation

- [Leonardo.ai API Docs](https://docs.leonardo.ai/)
- [Leonardo.ai SDK GitHub](https://github.com/Leonardo-Interactive/leonardo-ts-sdk)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)

### Project Documentation

- [Main README](../README.md)
- [Backend Testing Guide](../backend/TESTING_README.md)
- [Deployment Checklist](../DEPLOYMENT_CHECKLIST.md)
- [E2E Testing Guide](../E2E_TESTING_GUIDE.md)

---

## 💡 Tips for AI Agents

When reviewing these documents in future sessions:

1. **Start with INDEX.md** to understand available resources
2. **Check document status** to ensure information is current
3. **Use Quick Reference** tables to jump to relevant sections
4. **Review Troubleshooting** sections for common issues
5. **Follow Best Practices** guidelines when making changes

---

_This index is automatically maintained. Last updated: October 20, 2025_
