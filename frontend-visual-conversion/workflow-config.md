# Image Request Workflow Configuration
## Standard Operating Procedures for Asset Generation Pipeline

### Workflow Overview
```mermaid
Frontend → UI/UX Designer → Human → Folder → UI/UX Confirms → Frontend Implements
```

## Step-by-Step Process

### Step 1: Frontend Creates Request (Optional)
**Agent**: 🟡 Frontend Developer
**Action**: Add prompt to `prompt-requests.md` "NEXT PROMPTS TO PROCESS" section
**Note**: Can also work from existing template prompts

### Step 2: Human Takes Next Prompt
**Actor**: Human User
**Actions**:
1. Go to `prompt-requests.md` "NEXT PROMPTS TO PROCESS" section
2. Take the **FIRST** prompt in the list
3. Generate image using the prompt
4. Save with exact filename specified in prompt

### Step 3: Upload & Notify
**Actor**: Human User
**Actions**:
1. Upload generated file to `frontend-visual-conversion/inbox/`
2. Notify: "Uploaded [filename] to inbox"

### Step 4: UI/UX Processes & Distributes
**Agent**: 🎮 UI/UX Game Designer
**Actions**:
1. Check `inbox/` folder for new file
2. Quality check (SNES style, colors, dimensions)
3. Move file to appropriate location:
   - Characters → `assets/converted/characters/`
   - UI → `assets/converted/ui/`
   - Backgrounds → `assets/converted/backgrounds/`
   - Items → `assets/converted/items/`
   - Effects → `assets/converted/effects/`
4. Add confirmation to `receipt-log.md`
5. **DELETE completed prompt** from "NEXT PROMPTS TO PROCESS" list
6. Coordinate with 🟡 Frontend and 🟢 Backend for implementation

### Step 5: Frontend Implementation
**Agent**: 🟡 Frontend Developer
**Actions**:
1. Check `receipt-log.md` for confirmed assets
2. Integrate asset into application
3. Update `image-tracking.md` with integration status
4. Test asset in application context

## File Locations

### Request Management
- **Active Requests**: `prompt-requests.md` (Active Queue section)
- **Completed Requests**: `receipt-log.md` (Archive section)
- **Asset Tracking**: `image-tracking.md` (Overall progress)

### Asset Storage
```
frontend-visual-conversion/assets/
├── converted/          # Delivered assets go here
│   ├── characters/    # Character portraits and sprites
│   ├── ui/           # Buttons, icons, navigation
│   ├── backgrounds/  # Environment backgrounds
│   ├── items/        # Equipment and items
│   └── effects/      # Visual effects
├── original/         # Source files if needed
└── references/       # Style references
```

## Status Definitions

| Status | Description | Next Action |
|--------|-------------|-------------|
| `PENDING` | Request created, awaiting prompt | UI/UX creates prompt |
| `PROMPT_READY` | Prompt complete, ready for generation | Human generates image |
| `GENERATING` | Image being created | Human completes and delivers |
| `AWAITING_CONFIRMATION` | Asset delivered, needs verification | UI/UX confirms receipt |
| `COMPLETED` | Asset confirmed and ready | Frontend implements |

## Priority Levels

| Priority | Description | Target Turnaround |
|----------|-------------|-------------------|
| `HIGH` | Blocking development | Same day |
| `MEDIUM` | Needed soon | 1-2 days |
| `LOW` | Nice to have | 3-5 days |

## Quality Standards

### Acceptance Criteria
- [ ] Matches SNES 16-bit aesthetic
- [ ] Uses correct color palette
- [ ] Meets dimension specifications
- [ ] Has correct filename
- [ ] Pixel-perfect (no anti-aliasing)
- [ ] Appropriate dithering
- [ ] Clear at 1x scale

### Rejection Reasons
- Wrong dimensions
- Incorrect style (not SNES-like)
- Color palette violations
- Anti-aliasing present
- Filename mismatch
- Poor quality/unclear

## Notification Patterns

### Request Creation
```
🟡 Frontend Developer: "Created image request REQ-001 for [description]"
```

### Prompt Ready
```
🎮 UI/UX Game Designer: "Prompt ready for REQ-001: [filename]"
```

### Asset Uploaded (SINGLE NOTIFICATION)
```
Human: "Uploaded [filename] to inbox"
```

### Asset Processed
```
🎮 UI/UX Game Designer: "Processing [filename] from inbox"
🎮 UI/UX Game Designer: "Moved [filename] to assets/converted/[category]/"
🎮 UI/UX Game Designer: "Confirmed receipt of [filename] - Quality: PASSED"
```

### Implementation Complete
```
🟡 Frontend Developer: "Integrated [filename] into [component/page]"
```

## Escalation Process

### If Asset Needs Revision
1. UI/UX marks quality as `NEEDS_REVISION`
2. Documents specific issues in receipt-log
3. Creates new request with revision notes
4. References original request ID

### If Urgent Priority Change
1. Contact 🔵 Project Manager
2. Update priority in Active Queue
3. Notify relevant agents

### If Technical Issues
1. Frontend documents technical problems
2. Coordinates with UI/UX for specifications
3. May require new request if significant changes

## Performance Metrics

Track in weekly reviews:
- Average turnaround time per priority level
- Quality pass rate (first-time acceptance)
- Number of revisions required
- Assets delivered vs requested
- Integration success rate