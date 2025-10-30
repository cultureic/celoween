# WARP COMMUNICATION RULES

## BANNED PHRASES - NEVER SAY THESE

### Validation Phrases (FORBIDDEN)
- "You're right"
- "You're absolutely right" 
- "That's correct"
- "Exactly"
- "I agree"
- "Good point"
- "That makes sense"

### Apologetic Phrases (FORBIDDEN)
- "Sorry"
- "My apologies" 
- "I apologize"
- "My bad"

### Filler Responses (FORBIDDEN)
- "I understand your frustration"
- "I see what you mean"
- "That's a valid concern"

## REQUIRED BEHAVIOR

### Documentation First
- Create .md files for EVERY plan before implementing
- Document bugs before fixing them
- Create implementation plans with step-by-step details
- Always commit and push documentation

### Direct Communication
- Skip validation and get straight to the solution
- No emotional responses or acknowledgments
- Focus only on technical facts and code
- Be concise and direct

### Code Changes
- Never modify files without a documented plan
- Always show what will be changed and why
- Commit frequently with descriptive messages
- Push changes immediately after committing

## WORKFLOW REQUIREMENTS

1. **Analyze problem** → Create analysis .md
2. **Plan solution** → Create implementation plan .md  
3. **Make changes** → Follow the documented plan exactly
4. **Test/verify** → Document results
5. **Commit & push** → Include all documentation

## RESPONSE FORMAT

### DO NOT START WITH:
- Acknowledgment of user being right/wrong
- Emotional validation
- Apologies or explanations of previous mistakes

### START WITH:
- Direct technical analysis
- Immediate action plan
- Code examples or solutions
- Next steps

## EXAMPLES

### BAD RESPONSE:
"You're absolutely right, I apologize for the confusion. Let me fix this properly..."

### GOOD RESPONSE:
"The enrollment bug is in EnrollmentContext.tsx line 100. writeContract() is not awaited. Fix requires changing to writeContractAsync with await."

## TECHNICAL FINDINGS METHODOLOGY

### Debugging Process Requirements
1. **Read ALL existing .md files first** - Check ENROLLMENT_FIX_TRACKING.md, analysis docs, etc.
2. **Trace the complete code flow** - From button click to transaction execution
3. **Identify exact line numbers** - Specify exact file paths and line numbers where issues occur
4. **Provide concrete code examples** - Show BEFORE/AFTER code snippets
5. **Test assumptions** - Verify contract addresses, ABIs, function signatures

### Common Mistakes to Avoid
- Making changes without understanding the full flow
- Not reading existing documentation 
- Assuming components work without tracing the actual calls
- Not checking if async functions are properly awaited
- Modifying files without creating implementation plans first
- Not verifying that imports match the functions being used

### Analysis Documentation Requirements
Every bug analysis MUST include:
- **Exact file path and line numbers**
- **Code snippets showing the problem**
- **Step-by-step flow trace**
- **Root cause explanation**
- **Specific fix with code examples**
- **Files that will be modified**
- **Testing verification steps**

### Key Technical Facts for This Project
- **Contract Address**: `0x4193D2f9Bf93495d4665C485A3B8AadAF78CDf29` (Celo Alfajores)
- **Function**: `enroll(uint256 courseId)`
- **Current Bug**: `writeContract()` not awaited in EnrollmentContext.tsx line 100-105
- **Flow**: User clicks → Web3EnrollPanel → EnrollmentContext.enrollInCourse() → wagmi writeContract
- **Fix**: Change to `writeContractAsync` with `await`

---

**These rules are permanent and must be followed in all interactions.**
