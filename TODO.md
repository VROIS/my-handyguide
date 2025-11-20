# TODO - 2025-11-17 (Tomorrow)

## 🚨 URGENT: Data Recovery & Migration System
**Priority**: P0 (Blocking production issues)

### Task 1: Recover Lost Shared Pages
**Status**: ⏸️ Pending Production DB access

**Lost Data**:
- `qi6WlKKC.html` (루부르 박물관 베스트20): app-data = `[]` - 500+ views affected
- `k0Q6UEeK.html` (세느강 12): 11 out of 12 guides missing

**Recovery Options**:
1. **Production DB Backup Restore** (RECOMMENDED)
   - Access Neon Dashboard
   - Locate backup from before 2025-11-13
   - Restore `guides` table or `shared_html_pages.html_content`
   
2. **Replit Checkpoint Rollback**
   - Find checkpoint from 2025-11-12 or earlier
   - Extract HTML files from checkpoint
   
3. **Manual Recreation** (LAST RESORT)
   - User recreates content from memory
   - Use Production DB if any partial data exists

**Action Required from User**:
- [ ] Access Neon Dashboard → Backups
- [ ] Check Replit History → Checkpoints (Nov 12)
- [ ] Provide Production DB snapshot if available

---

## 🔧 Build Safe Migration System
**Priority**: P1 (Critical for future scaling)

### Task 2: Implement Step-by-Step Migration Workflow
**Goal**: Prevent bulk data loss incidents

**Requirements**:
1. **Development Testing Phase**
   ```bash
   # Dry-run mode (default)
   npm run migrate:dry-run
   
   # Shows preview of changes without applying
   # Generates migration report for user review
   ```

2. **User Confirmation Checkpoints**
   - Show migration preview with affected pages
   - Require explicit "yes" at each stage
   - Pause between stages for verification

3. **Backup Creation**
   - Auto-backup before migration
   - Store in `backups/YYYY-MM-DD/` directory
   - Include both DB snapshots and HTML files

4. **Version-Aware Templates**
   - Templates tagged: `v1`, `v2`, `v3`
   - Pages store `template_version` in metadata
   - Migration only affects specific versions

5. **Validation & Rollback**
   - Automatic data integrity checks
   - One-click rollback if issues detected
   - Migration log with timestamps

### Task 3: Create Migration Dashboard
**Admin UI for Migration Control**

Features:
- [ ] View all shared pages by template version
- [ ] Select pages for migration (not bulk "all")
- [ ] Preview changes before applying
- [ ] Monitor migration progress in real-time
- [ ] Rollback button with one-click restore

---

## 📋 Implementation Plan (Tomorrow)

### Phase 1: Recovery (Morning)
1. User provides Production DB backup access
2. Restore lost data for qi6WlKKC and k0Q6UEeK
3. Verify pages display correctly
4. Test with external shared links

### Phase 2: Migration System (Afternoon)
1. Design step-by-step migration workflow
2. Implement dry-run script with preview
3. Add user confirmation prompts
4. Create backup automation
5. Test on Development DB

### Phase 3: Documentation & Testing (Evening)
1. Document new migration process in `MIGRATION.md`
2. Update replit.md with migration checklist
3. Test full workflow on Development DB
4. Get user approval before Production use

---

## 🎯 Success Criteria

**Recovery Success**:
- ✅ qi6WlKKC.html shows 20 guides
- ✅ k0Q6UEeK.html shows 12 guides
- ✅ External users see correct content

**Migration System Success**:
- ✅ No changes applied without user confirmation
- ✅ Development DB tested first
- ✅ Automatic backups created
- ✅ One-click rollback works
- ✅ Version-specific migrations only

---

## 📝 Notes from Today (2025-11-16)

**What We Learned**:
- Automated migrations can destroy production data instantly
- Git history doesn't help if file committed after data loss
- External shared links = high blast radius (500+ users)
- "One button" migration = too risky at scale

**User's Key Insight**:
> "왜 내가 마이그레이션에 자동화를 점검점검 하느냐 이유를 알겠지"
> "이게 자동화 잘못하면 추후에 피해가 얼마나 갈지 예상이 안된다"

**Standard Established**:
- V2 Standard Template: `server/standard-template.ts`
- Migration Checklist: See replit.md "Critical Migration Principles"
- Step-by-step confirmation: Required for ALL bulk operations

**Tomorrow's Focus**:
1. Recover data (URGENT)
2. Build safe migration system (CRITICAL)
3. Document everything (ESSENTIAL)

---

## 🔐 Protected Files
**DO NOT modify without explicit user approval**:
- `server/standard-template.ts` - V2 template
- `public/shared/*.html` - User-facing pages
- Migration scripts with bulk operations

---

## ⏰ Timeline
**Tomorrow (2025-11-17)**:
- 09:00 - Recovery attempt
- 11:00 - Migration system design review
- 14:00 - Implementation start
- 17:00 - Testing & validation
- 18:00 - User review & approval

**Next Week**:
- Payment system integration (deferred from today)
- Further migration system refinements
