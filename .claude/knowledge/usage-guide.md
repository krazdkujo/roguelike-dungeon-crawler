# Claude Code Expert Agent Team - Usage Guide

## Quick Start

### 1. Day 1-2 Setup (Completed ✓)
- [x] Knowledge base structure created
- [x] Core agents configured (Project Manager, Development Manager, Research Specialist)
- [x] Domain specialists created (Backend, Frontend, DevOps, Security, QA)
- [x] MCP servers installed (sequential-thinking, browser-use, puppeteer, github)

### 2. Usage Patterns

#### Starting New Features
```bash
# Primary workflow entry point
Use project-manager to [implement user authentication with OAuth]
```

**Expected Flow:**
1. PM reads `.claude/knowledge/` for context
2. Consults relevant specialists via Task tool
3. Synthesizes plan with decision points
4. Presents: "DECISION REQUIRED: [decision] - Proceed? (y/n)"
5. Development Manager provides critical review
6. Human approves, PM delegates implementation

#### Research Requests
```bash
Use research-specialist to evaluate React vs Vue for small game projects
```

#### Specialist Consultation
```bash
Use security-specialist to review this authentication flow
Use backend-developer to design API architecture for multiplayer game
Use frontend-developer to optimize game rendering performance
```

### 3. Agent Hierarchy & Roles

```
Human Input
    ↓
🔵 Project Manager (planning & orchestration)
    ↓ (consults via Task tool)
[🩵 Research] [🟢 Backend] [🟡 Frontend] [🟠 DevOps] [🔴 Security] [🟪 QA]
    ↓                    ↓           ↓           ↓
Development Manager ←→ IMPLEMENTATION AGENTS (write actual code)
    ↓ (critical review)
Human Approval
    ↓
Code Implementation by Specialists
```

**Planning Agents:** 🔵 Project Manager, 🟣 Development Manager, 🩵 Research Specialist, 🔴 Security Specialist
**Implementation Agents:** 🟢 Backend Developer, 🟡 Frontend Developer, 🟠 DevOps Specialist, 🟪 QA Specialist

### 4. Decision Documentation

All decisions are automatically logged to:
- `.claude/knowledge/decisions.md` - Approved technical decisions
- `.claude/knowledge/standards.md` - Coding standards and preferences
- `.claude/knowledge/architecture.md` - System architecture decisions

### 5. Token Optimization Features

- **Focused Responses:** Each specialist limited to 150-250 words
- **Context Reuse:** Knowledge base prevents repetitive discussions
- **Task Isolation:** Task tool creates separate contexts for consultations
- **Decision Persistence:** Approved decisions prevent re-discussion

## Full Implementation Workflow Example

**Request:** "Add a dark mode toggle to the settings page"

1. 🔵 **Project Manager** plans the feature, consults specialists
2. 🩵 **Research Specialist** researches dark mode best practices (if needed)
3. 🔴 **Security Specialist** reviews any security implications
4. 🟣 **Development Manager** provides critical review
5. **Human approves** the plan
6. 🟡 **Frontend Developer** implements the actual UI components and CSS
7. 🟢 **Backend Developer** implements user preference storage API
8. 🟪 **QA Specialist** writes and runs tests for the feature
9. 🟠 **DevOps Specialist** updates deployment configs if needed

**The implementation agents actually write the code files!**

Expected token reduction: **40-60%** through focused, specialized responses.