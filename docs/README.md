# 📚 Celo Mexico Academy Documentation

Welcome to the complete documentation for the Celo Mexico Academy platform.

---

## 📖 Quick Navigation

### 🚀 Deployment Documentation
Essential guides for deploying and maintaining the platform in production.

- **[Production Status](./deployment/PRODUCTION_STATUS.md)**  
  Current production state, metrics, and system health

- **[Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)**  
  Step-by-step instructions for deploying to production

- **[Deployment Summary](./deployment/DEPLOYMENT_SUMMARY.md)**  
  Quick reference for common deployment tasks

---

### 🔧 Technical Documentation
Deep dives into system architecture and implementation details.

- **[Course Paywall System](./technical/COURSE_PAYWALL.md)**  
  NFT-based access control for courses and lessons

- **[Dynamic NFT Solution](./technical/DYNAMIC_NFT_SOLUTION.md)**  
  Token ID generation and badge management architecture

---

### 📖 Reference Documentation
Guidelines, rules, and templates for development.

- **[Project Rules](./reference/PROJECT_RULES.md)** ⚠️ **READ FIRST**  
  Critical rules and conventions - must read before making changes

- **[Feature Request Template](./reference/FEATURE_REQUEST_TEMPLATE.md)**  
  How to properly request and document new features

- **[Docs Cleanup Plan](./reference/DOCS_CLEANUP_PLAN.md)**  
  Roadmap for documentation organization and improvements

---

### 📜 Scripts Documentation
Automation scripts for deployment and monitoring.

- **[Scripts Guide](../scripts/README.md)**  
  Usage instructions for deployment and monitoring scripts

---

## 🎯 Documentation by Role

### For Developers
Start here if you're building features or fixing bugs:
1. **[Project Rules](./reference/PROJECT_RULES.md)** - Learn the rules ⚠️
2. **[Technical Docs](./technical/)** - Understand the architecture
3. **[Feature Request Template](./reference/FEATURE_REQUEST_TEMPLATE.md)** - Propose new features

### For DevOps/Deployment
Start here if you're deploying or maintaining the platform:
1. **[Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)** - Full deployment process
2. **[Production Status](./deployment/PRODUCTION_STATUS.md)** - Current state
3. **[Scripts Guide](../scripts/README.md)** - Automation tools

### For Stakeholders/PMs
Start here if you're tracking project status:
1. **[Production Status](./deployment/PRODUCTION_STATUS.md)** - Health metrics
2. **[Deployment Summary](./deployment/DEPLOYMENT_SUMMARY.md)** - Quick overview
3. **[Feature Request Template](./reference/FEATURE_REQUEST_TEMPLATE.md)** - Request features

---

## 📂 Documentation Structure

```
docs/
├── README.md                          # This file
├── deployment/                        # Deployment & Production
│   ├── PRODUCTION_STATUS.md          # Current production state
│   ├── DEPLOYMENT_GUIDE.md           # Full deployment guide
│   └── DEPLOYMENT_SUMMARY.md         # Quick deployment reference
├── technical/                         # Technical Architecture
│   ├── COURSE_PAYWALL.md             # NFT paywall system
│   └── DYNAMIC_NFT_SOLUTION.md       # Token ID generation
└── reference/                         # Guidelines & Templates
    ├── PROJECT_RULES.md              # Project rules (READ FIRST!)
    ├── FEATURE_REQUEST_TEMPLATE.md   # Feature request template
    └── DOCS_CLEANUP_PLAN.md          # Documentation roadmap
```

---

## 🔄 Documentation Updates

### How to Update Documentation

1. **Find the right category:**
   - Deployment changes? → `deployment/`
   - Technical implementation? → `technical/`
   - Rules or templates? → `reference/`

2. **Edit the markdown file** using your preferred editor

3. **Update the index** if you add new files:
   - Update this `README.md`
   - Update main project `../README.md`

4. **Commit with clear message:**
   ```bash
   git add docs/
   git commit -m "docs: update [category] - brief description"
   ```

### Documentation Standards

- ✅ Use clear, concise language
- ✅ Include code examples where helpful
- ✅ Add emojis for visual navigation (📚 🚀 🔧 📖)
- ✅ Link between related documents
- ✅ Keep table of contents updated
- ✅ Add "Last Updated" dates to major docs

---

## 🆘 Need Help?

### Can't Find What You're Looking For?

1. **Check the main README:** [../README.md](../README.md)
2. **Search in GitHub Issues:** Look for existing discussions
3. **Ask the Team:** Create a new issue with your question

### Found a Documentation Bug?

Please help us improve! If you find:
- Broken links
- Outdated information
- Unclear instructions
- Missing documentation

Create an issue with the label `documentation` or submit a PR with fixes.

---

## 📝 Contributing to Documentation

Good documentation is crucial! Here's how to contribute:

1. **Identify gaps:** What's missing or unclear?
2. **Draft content:** Write clear, helpful documentation
3. **Get feedback:** Share with the team
4. **Submit PR:** Include documentation in your feature PRs

**Remember:** Every PR should update relevant documentation!

---

<div align="center">
  <strong>Celo Mexico Academy Documentation</strong><br>
  <em>Building the future of blockchain education in Mexico 🇲🇽</em>
  <br><br>
  <a href="../README.md">← Back to Main README</a>
</div>
