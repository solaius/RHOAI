# GitLab Merge Request Workflow - Step by Step

## ✅ Step 1: Push Branch to GitLab (COMPLETED)
**Status:** ✅ **DONE**

**What was done:**
- Pushed `model-catalog` branch to `origin` remote
- Branch commit: `829f826` - "feat(catalog): add advanced performance filtering and customize columns modal"

**Verification:**
```bash
git ls-remote --heads origin model-catalog
# Output: 829f826ba97ac0ff1fb2a946be6831824254cb32 refs/heads/model-catalog
```
✅ Branch exists on remote with correct commit hash

---

## 📝 Step 2: Create Merge Request
**Status:** ⏳ **ACTION REQUIRED**

**Direct URL to create MR:**
```
https://gitlab.cee.redhat.com/yihwang/rhoai/-/merge_requests/new?merge_request%5Bsource_branch%5D=model-catalog
```

**Instructions:**
1. Click the URL above or go to GitLab → Your project → "Create Merge Request"
2. **Source branch:** `model-catalog` (your branch)
3. **Target branch:** `main` or `3.2` (check with your team which branch to target)
4. Fill in MR details:
   - **Title:** `feat(catalog): add advanced performance filtering and customize columns modal`
   - **Description:** Include summary of changes (see commit message)
5. Click "Create merge request"

**Verification Checklist:**
- [ ] MR created successfully
- [ ] Source branch: `model-catalog`
- [ ] Target branch: (confirm with team - likely `main` or `3.2`)
- [ ] MR shows your commit: `829f826`
- [ ] MR description includes change summary

---

## 🔍 Step 3: Verify .gitlab-ci.yml File
**Status:** ⚠️ **REVIEW NEEDED**

**Current Status:**
- ✅ File exists at `.gitlab-ci.yml`
- ⚠️ **Issue Found:** CI/CD only runs on `3.2` branch (see `rules: - if: $CI_COMMIT_BRANCH == "3.2"`)

**What to check:**
1. Open `.gitlab-ci.yml` in GitLab web interface
2. Verify it matches your team's template (provided in instructions)
3. **Important:** If your team wants CI to run on `model-catalog` branch, you may need to:
   - Update the `rules` section to include your branch, OR
   - Ask your team if CI should run on feature branches

**Expected .gitlab-ci.yml content (from team instructions):**
```yaml
# GitLab Pages for Node.js Web App
image: registry.redhat.io/ubi8/nodejs-18:latest

stages:
  - build
  - deploy

variables:
  NODE_ENV: production

default:
  tags:
    - itup-alm-x86

build:
  stage: build
  script:
    - npm ci --include=dev
    - npm run build
    - mv dist public
  artifacts:
    paths:
      - public

pages:
  stage: deploy
  script:
    - echo "Deploying to GitLab Pages..."
  artifacts:
    paths:
      - public
```

**Verification Checklist:**
- [ ] `.gitlab-ci.yml` exists in your branch
- [ ] File structure matches team template
- [ ] Confirm with team if CI should run on feature branches

---

## 🚀 Step 4: Verify CI/CD Pipeline (After MR Creation)
**Status:** ⏳ **WAIT FOR MR**

**What to check:**
1. After creating MR, go to MR page
2. Look for "Pipelines" section
3. Check if pipeline runs automatically

**Possible Outcomes:**
- ✅ **Pipeline runs:** Great! Wait for it to complete
- ⚠️ **Pipeline doesn't run:** This is expected if CI only runs on `3.2` branch
  - Ask your team if this is normal for feature branches
  - Pipeline will run when MR is merged to target branch

**Verification Checklist:**
- [ ] Check MR page for pipeline status
- [ ] If pipeline runs, verify it completes successfully
- [ ] If no pipeline, confirm with team if this is expected

---

## 📄 Step 5: Verify GitLab Pages Deployment
**Status:** ⏳ **AFTER PIPELINE SUCCESS**

**Instructions:**
1. Go to GitLab project → **Deploy** → **Pages**
2. Look for the deployment URL
3. **Note:** Pages may only deploy from specific branches (like `3.2` or `main`)

**What to check:**
- [ ] Pages URL is displayed (if applicable)
- [ ] URL is accessible and shows your changes
- [ ] If no URL, check if Pages only deploy from target branch

**If Pages URL not available:**
- This is normal if Pages only deploy from `main`/`3.2` branch
- Pages will be available after MR is merged
- Share the Pages URL with stakeholders after merge

**Verification Checklist:**
- [ ] Check Deploy → Pages section
- [ ] Note the Pages URL (if available)
- [ ] Test the URL to verify deployment

---

## 📋 Final Checklist Before Submitting for Review

- [x] ✅ Branch pushed to GitLab (`model-catalog`)
- [ ] ⏳ Merge Request created
- [ ] ⏳ MR description filled out
- [ ] ⏳ `.gitlab-ci.yml` verified (or updated if needed)
- [ ] ⏳ Pipeline status checked
- [ ] ⏳ Pages URL noted (if applicable)
- [ ] ⏳ Team notified for review

---

## 🆘 Troubleshooting

### Issue: Pipeline doesn't run
**Solution:** Check if CI rules include your branch. Current rules only run on `3.2` branch.

### Issue: Pages URL not showing
**Solution:** Pages may only deploy from target branch. Will be available after merge.

### Issue: MR can't be created
**Solution:** 
- Verify branch exists: `git ls-remote --heads origin model-catalog`
- Check you have permissions in GitLab project
- Ensure target branch exists

---

## 📞 Next Steps

1. **Create the MR** using the URL provided above
2. **Tag your reviewers** in the MR description
3. **Monitor the MR** for comments and approvals
4. **Address feedback** and push updates if needed
5. **After approval**, merge the MR

---

## 🔗 Quick Links

- **Create MR:** https://gitlab.cee.redhat.com/yihwang/rhoai/-/merge_requests/new?merge_request%5Bsource_branch%5D=model-catalog
- **Your Project:** https://gitlab.cee.redhat.com/yihwang/rhoai
- **Branch:** `model-catalog`
- **Commit:** `829f826`

