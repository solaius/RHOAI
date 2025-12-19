# GitLab Merge Request - Complete Beginner's Guide

## 🎯 What We're Doing
You've made changes to the code and committed them. Now we need to:
1. Send your changes to GitLab (cloud)
2. Create a "Merge Request" (MR) so your team can review your code
3. Make sure everything is set up correctly

---

## ✅ STEP 1: Verify Your Work is Saved Locally
**What this means:** Make sure all your changes are committed (saved) in git.

**Run this command:**
```bash
cd /Users/haleywang/Projects/rhoai
git status
```

**What to look for:**
- ✅ **Good:** "nothing to commit, working tree clean" - means everything is saved
- ❌ **Bad:** If you see files listed under "Changes not staged" or "Untracked files"

**If you see uncommitted changes:**
- Don't worry, we already committed everything in the previous step
- But if you made new changes, let me know and we'll commit them

**✅ VERIFICATION:** 
- [ ] Run `git status` 
- [ ] See "working tree clean" or only see files you don't need to commit

---

## ✅ STEP 2: Check What Branch You're On
**What this means:** Git uses "branches" to keep different versions of code separate. You're on a branch called `model-catalog`.

**Run this command:**
```bash
cd /Users/haleywang/Projects/rhoai
git branch --show-current
```

**Expected output:**
```
model-catalog
```

**What this means:**
- You're working on a branch called `model-catalog`
- This is your feature branch where you made all your changes
- This is correct! ✅

**✅ VERIFICATION:**
- [ ] Run the command above
- [ ] See `model-catalog` as output

---

## ✅ STEP 3: Verify Your Commit Exists
**What this means:** Check that your commit (the saved version of your changes) is there.

**Run this command:**
```bash
cd /Users/haleywang/Projects/rhoai
git log --oneline -1
```

**Expected output:**
```
829f826 feat(catalog): add advanced performance filtering and customize columns modal
```

**What this means:**
- `829f826` = unique ID for your commit (like a serial number)
- The text after = description of what you changed
- This confirms your work is saved ✅

**✅ VERIFICATION:**
- [ ] Run the command above
- [ ] See your commit with the message about "performance filtering"

---

## ✅ STEP 4: Check Your GitLab Connection
**What this means:** Make sure your computer knows where to send your code (to GitLab).

**Run this command:**
```bash
cd /Users/haleywang/Projects/rhoai
git remote -v
```

**Expected output:**
```
origin	git@gitlab.cee.redhat.com:yihwang/rhoai.git (fetch)
origin	git@gitlab.cee.redhat.com:yihwang/rhoai.git (push)
```

**What this means:**
- `origin` = nickname for your GitLab repository
- The URL = where your code lives on GitLab
- `yihwang/rhoai` = your personal project on GitLab
- This is correct! ✅

**✅ VERIFICATION:**
- [ ] Run the command above
- [ ] See `yihwang/rhoai.git` in the output

---

## ✅ STEP 5: Push Your Branch to GitLab (ALREADY DONE!)
**What this means:** "Push" = send your local changes to GitLab (cloud). This was already completed!

**What happened:**
- Your `model-catalog` branch was sent to GitLab
- GitLab gave us a link to create a Merge Request

**Verify it worked:**
```bash
cd /Users/haleywang/Projects/rhoai
git ls-remote --heads origin model-catalog
```

**Expected output:**
```
829f826ba97ac0ff1fb2a946be6831824254cb32	refs/heads/model-catalog
```

**What this means:**
- The long number = your commit ID (matches the one from Step 3)
- This confirms your branch is on GitLab ✅

**✅ VERIFICATION:**
- [x] Branch pushed successfully (already done)
- [x] Branch exists on GitLab remote

---

## 📝 STEP 6: Create the Merge Request (DO THIS NOW!)
**What this means:** A "Merge Request" (MR) is like asking "Can I add my changes to the main code?" It lets your team review your work.

### 6A: Open the MR Creation Page

**Option 1: Use the direct link (EASIEST)**
Click this link:
```
https://gitlab.cee.redhat.com/yihwang/rhoai/-/merge_requests/new?merge_request%5Bsource_branch%5D=model-catalog
```

**Option 2: Manual method**
1. Go to: https://gitlab.cee.redhat.com/yihwang/rhoai
2. You should see a yellow banner saying "Create merge request" for `model-catalog`
3. Click "Create merge request"

### 6B: Fill Out the Merge Request Form

**You'll see a form with these fields:**

1. **Source branch:** Should already say `model-catalog` ✅
   - This is YOUR branch with your changes

2. **Target branch:** This is IMPORTANT! 
   - **Question:** Which branch should your code be merged into?
   - **Common options:**
     - `main` or `master` = main codebase
     - `3.2` = version 3.2 branch (your CI file mentions this)
   - **Action:** Ask your team lead or check other MRs to see what they use
   - **Default if unsure:** Try `main` first

3. **Title:** Should auto-fill, but verify it says:
   ```
   feat(catalog): add advanced performance filtering and customize columns modal
   ```

4. **Description:** Add a brief summary:
   ```
   This MR adds advanced performance filtering capabilities to the model catalog:
   
   - Performance filters (workload, latency, RPS, hardware)
   - Customize columns modal with expandable groups
   - Real-time filter sync between catalog and details pages
   - Chip bar for active filters
   - Sortable table columns
   - Varied benchmark data generation
   ```

5. **Assignees:** (Optional) Tag people who should review:
   - Click "Assignees" dropdown
   - Select team members who should review

6. **Labels:** (Optional) Add labels like `feature`, `catalog`, etc.

### 6C: Submit the MR

1. Review all fields
2. Click **"Create merge request"** button (usually green, at bottom)

**✅ VERIFICATION:**
- [ ] Opened MR creation page
- [ ] Source branch = `model-catalog`
- [ ] Target branch = (confirmed with team - likely `main` or `3.2`)
- [ ] Title filled in
- [ ] Description added
- [ ] Clicked "Create merge request"
- [ ] MR page opened successfully

---

## 🔍 STEP 7: Verify the Merge Request Page
**What this means:** After creating the MR, check that everything looks correct.

**What you should see on the MR page:**

1. **Title:** Your MR title at the top
2. **Status:** Usually shows "Open" or "Draft"
3. **Source/Target:** Shows `model-catalog` → `[target branch]`
4. **Commits:** Should show 1 commit (your commit `829f826`)
5. **Changes:** Tab showing all files you modified
6. **Pipelines:** Section showing CI/CD status (may be empty - that's OK)

**Check the "Changes" tab:**
- Click "Changes" tab
- You should see 7 files listed:
  - `ModelCatalog.tsx`
  - `ModelDetails.tsx`
  - `models.ts`
  - `useColumnPreferences.ts`
  - `usePerformanceFilters.ts`
  - `benchmarks.ts`
  - `columnConfig.ts`
- Green lines = code you added
- Red lines = code you removed

**✅ VERIFICATION:**
- [ ] MR page loaded successfully
- [ ] Shows correct source branch (`model-catalog`)
- [ ] Shows correct target branch
- [ ] Shows 1 commit
- [ ] "Changes" tab shows 7 files modified
- [ ] Can see your code changes

---

## 📋 STEP 8: Check the CI/CD Pipeline (Optional - May Not Run)
**What this means:** CI/CD = automated tests/builds. Your `.gitlab-ci.yml` file controls this.

**Current situation:**
- Your `.gitlab-ci.yml` file exists ✅
- BUT it's configured to only run on `3.2` branch
- So it might NOT run automatically for your `model-catalog` branch
- **This is OK!** It will run when your MR is merged

**What to check:**

1. On your MR page, look for a "Pipelines" section
2. You might see:
   - ✅ **"Pipeline #XXX passed"** = Great! Everything worked
   - ⏸️ **"Pipeline #XXX running"** = Wait for it to finish
   - ⚠️ **"No pipelines"** = Expected if CI only runs on `3.2` branch
   - ❌ **"Pipeline #XXX failed"** = Need to check errors

**If pipeline doesn't run:**
- This is likely **normal** for your setup
- Ask your team: "Should I see a pipeline for my MR, or will it only run after merge?"
- Don't worry - your code is fine, it's just a configuration thing

**✅ VERIFICATION:**
- [ ] Checked "Pipelines" section on MR page
- [ ] Noted the status (running/passed/failed/none)
- [ ] If no pipeline, confirmed with team if this is expected

---

## 📄 STEP 9: Check GitLab Pages (After Merge)
**What this means:** GitLab Pages = where your app gets deployed so people can see it.

**Important:** Pages usually only deploy from the target branch (like `main` or `3.2`), NOT from feature branches. So you might not see a Pages URL until your MR is merged.

**How to check (after your MR is merged):**

1. Go to your GitLab project: https://gitlab.cee.redhat.com/yihwang/rhoai
2. Click **"Deploy"** in the left sidebar
3. Click **"Pages"**
4. Look for a URL like: `https://yihwang.gitlab.cee.redhat.com/rhoai/`

**What you might see:**
- ✅ **URL displayed:** Great! Click it to see your deployed app
- ⏳ **"Deploying..."** or **"Building..."**: Wait a few minutes
- ⚠️ **No URL:** This is normal if Pages only deploy from target branch

**For now (before merge):**
- You probably won't see a Pages URL yet
- This is expected and OK
- After merge, the Pages URL will appear

**✅ VERIFICATION:**
- [ ] Went to Deploy → Pages
- [ ] Noted if URL is available (may not be until after merge)
- [ ] If URL exists, tested it to see the app

---

## 🎯 STEP 10: Share Your MR for Review
**What this means:** Now that your MR is created, get your team to review it.

**What to do:**

1. **Copy the MR URL:**
   - On your MR page, copy the URL from your browser
   - It looks like: `https://gitlab.cee.redhat.com/yihwang/rhoai/-/merge_requests/123`

2. **Notify your team:**
   - Send the MR URL to your team lead or reviewers
   - Say something like: "Hi! I've created an MR for the performance filtering feature. Could you please review when you have a chance? [MR URL]"

3. **Add reviewers (if you didn't already):**
   - On the MR page, click "Edit" button
   - Add people to "Assignees" or mention them in a comment

**✅ VERIFICATION:**
- [ ] MR URL copied
- [ ] Team notified about the MR
- [ ] Reviewers assigned (if applicable)

---

## 📊 Summary Checklist

Use this checklist to make sure you completed everything:

### Pre-Submission (Already Done ✅)
- [x] All changes committed locally
- [x] Branch name confirmed (`model-catalog`)
- [x] Commit exists and looks correct
- [x] GitLab remote configured correctly
- [x] Branch pushed to GitLab

### MR Creation (Do Now)
- [ ] Opened MR creation page
- [ ] Selected source branch (`model-catalog`)
- [ ] Selected target branch (confirmed with team)
- [ ] Filled in MR title
- [ ] Added MR description
- [ ] Created the MR
- [ ] Verified MR page shows correct information
- [ ] Checked "Changes" tab shows your files

### Post-Creation (Optional Checks)
- [ ] Checked pipeline status (may not run - that's OK)
- [ ] Noted Pages URL status (may not exist until merge)
- [ ] Shared MR with team for review

---

## 🆘 Common Issues & Solutions

### Issue 1: "Can't create MR - branch not found"
**Solution:**
- Run: `git push -u origin model-catalog`
- Wait a minute, then try the MR link again

### Issue 2: "Don't know which target branch to use"
**Solution:**
- Check other MRs in your project to see what they use
- Ask your team lead
- Common: `main`, `master`, or `3.2`

### Issue 3: "Pipeline failed"
**Solution:**
- Click on the failed pipeline
- Read the error messages
- Common issues:
  - Build errors (check the build log)
  - Test failures (check test output)
- Share the error with your team for help

### Issue 4: "Can't see Pages URL"
**Solution:**
- This is normal! Pages usually only deploy from target branch
- Wait until your MR is merged
- Then check Deploy → Pages again

### Issue 5: "MR page shows wrong files"
**Solution:**
- Make sure you're looking at the right MR
- Check the source branch is `model-catalog`
- Verify your commit is listed

---

## 📞 Need Help?

If you get stuck at any step:
1. **Take a screenshot** of what you see
2. **Note the error message** (if any)
3. **Tell me which step** you're on
4. I'll help you troubleshoot!

---

## 🎉 You're Done!

Once you complete Step 6 (Create MR), you're essentially done! The rest is just verification and waiting for review.

**Next steps after MR is created:**
1. Wait for team review
2. Address any feedback they give
3. Make changes if needed (we'll commit and push again)
4. Once approved, merge the MR
5. Celebrate! 🎊

