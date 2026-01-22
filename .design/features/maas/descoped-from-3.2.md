# MaaS 3.4 De-scoped Features for Consideration

This document catalogs features that were removed, hidden, or de-scoped from the MaaS prototype during 3.2/3.3 development. These could potentially be re-enabled or enhanced for 3.4.

> **Note for AI Assistants**: Use the commit IDs listed below to find the exact code changes. Many features were commented out rather than deleted, so search the codebase for commented sections near the affected files. You can use `git show <commit-id>` to see the full diff of what was changed.

---

## API Keys Area

### Individual API Key Management (CRUD)

**What was de-scoped**: Full individual API key management including listing, viewing details, copying keys, and actions per key. In 3.2, only "delete all keys" was supported because the backend couldn't persist or list individual keys.

**Relevant commits**:
- `ef16f37` - Descope API Key copying, actions - removed copy button and individual actions
- `f617227` - Descope API Keys list page for 3.2 by removing some field values
- `ae0eca2` - Descope API Key Details in 3.2 to only include basic details
- `6450aee` - Remove Owner column from API Keys list
- `89f37bd` - Remove team key
- `df37610` - Rearrange API Key Details tab content and remove key copy action
- `9380187` - Add delete all API keys button and modal for 3.2 (workaround)

**Files affected**:
- `src/app/Settings/APIKeys/APIKeys.tsx`
- `src/app/Settings/APIKeys/APIKeyDetails.tsx`
- `src/app/Settings/APIKeys/components/APIKeyDetailsTab.tsx`
- `src/app/Settings/APIKeys/components/APIKeySettingsTab.tsx`

**Design history context**: Per 2025-11-12 meeting notes, "Current API keys are ephemeral and disappear after creation (cannot list or retrieve later); can invalidate all keys at once but not individual keys." Key metadata was being considered for 3.3.

---

### API Key Assets Tab - Agents and Vector DBs

**What was de-scoped**: The API Key Details page originally had an Assets tab showing Agents and Vector DBs that could be accessed via the key.

**Relevant commits**:
- `88d7693` - Remove Agents and Vector DBs from API keys area
- `eb2159a` - Remove MCP servers from API Keys and policies
- `cc859ca` - Remove cards from API Key Details page

**Files affected**:
- `src/app/Settings/APIKeys/components/APIKeyAssetsTab.tsx`
- `src/app/Settings/APIKeys/mockData.ts`
- `src/app/Settings/APIKeys/types.ts`

---

### API Key Status, Last Used, and Expiration Management

**What was de-scoped**: Columns for status (Active/Expired/Disabled), last used timestamps, and detailed expiration management.

**Design history context**: Per 2025-10-13 notes, the design included columns for "status" and "last used." The status column was to show Active, Expired, or Disabled states. Expiration dates were to be configurable when creating keys.

**Relevant commit**: `fb4c279` - Originally added these columns, but they were later de-scoped in subsequent commits.

---

## Tiers Area

### Model Selection in Tiers

**What was de-scoped**: The ability to select which specific models are available within a Tier. Models were originally selected via a multi-select dropdown in the Create/Edit Tier forms.

**Relevant commits**:
- `4f27a9f` - Remove/descope selecting models from the Create/Edit tier form for 3.2

**Files affected**:
- `src/app/Settings/Tiers/CreateTier.tsx`
- `src/app/Settings/Tiers/EditTier.tsx`
- `src/app/Settings/Tiers/components/TierForm.tsx`
- `src/app/Settings/Tiers/components/TierDetailsTab.tsx`
- `src/app/Settings/Tiers/types.ts`

**Design history context**: Per 2025-11-24 notes, the backend for frontend APIs required for full model association wasn't ready for 3.2/3.3. The models that are available to any given key are now inherited from the associated Tier implicitly.

---

### Tier YAML Tab and GitOps Support

**What was de-scoped**: A YAML tab in the Tier Details page and GitOps detection functionality.

**Relevant commits**:
- `80090a2` - Descope Tier YAML tab
- `a0854b8` - Disable Tier YAML tab  
- `e8e4216` - Descope Git detection from Tier Details

**Files affected**:
- `src/app/Settings/Tiers/CreateTier.tsx`
- `src/app/Settings/Tiers/components/TierDetailsTab.tsx`

**Design history context**: Per 2025-11-12 meeting, "Policy management (editing YAML for token rate limit policies and rate limit policies) could serve as initial admin UI with GitOps-friendly approach."

---

### Tier Badges/Labels

**What was de-scoped**: Visual badges or labels on Tiers in the list view.

**Relevant commits**:
- `fe7ce9a` - Remove Tier badges

**Files affected**:
- `src/app/Settings/Tiers/Tiers.tsx`

---

### Default Expiration Configuration in Tiers

**What was de-scoped**: The ability to configure default expiration dates for API keys within a Tier.

**Design history context**: Per 2025-11-24 notes, the "Default expiration" section was removed from the Create Tier form. Keys currently default to 4 hours expiration set at creation time.

---

## AI Asset Endpoints

### Models as a Service (MaaS) Tab

**What was de-scoped**: An entire tab on the AI Asset Endpoints page dedicated to showing "Models as a Service" separately from regular models.

**Relevant commits**:
- `95f397e` - Hide MaaS tab (commented out, not deleted)
- `5a2a86d` - Add "Generate Key" button to Models list and resurface MaaS tab for now (briefly re-added then hidden again)

**Files affected**:
- `src/app/AIAssets/AvailableAIAssets/AvailableAIAssets.tsx`

**Design history context**: Per 2025-11-03 meeting, "Scope of AI Assets Endpoints page (will list only MaaS models)" was being finalized. The experience was simplified to a single list.

---

### External Model Providers (Add Asset Modal)

**What was de-scoped**: The ability to add external AI inference providers (e.g., OpenAI, Anthropic) as AI Assets from within the platform.

**Design history context**: Per 2025-11-26 notes, "In the 'Add asset' modal, hide/comment out the code for the ability to add an external model/provider (descoped from 3.2/3.3 but likely to arrive in 3.4)."

Per 2025-10-01 notes: "We also discussed allowing admins to bring in their own external AI inference providers (e.g., OpenAI) into the platform for others to consume."

**Files to search**: Look for commented sections in `src/app/AIAssets/` related to external providers or the Add Asset modal.

---

### Model ID Column

**What was de-scoped**: A Model ID column in the AI Assets table.

**Relevant commits**:
- `4a0aac5` - Remove Model ID column from AI Assets, use existing help icon instead

**Files affected**:
- `src/app/AIAssets/`

---

## Policies Area

### MCP Servers in Policies

**What was de-scoped**: MCP (Model Context Protocol) servers were originally associated with policies.

**Relevant commits**:
- `eb2159a` - Remove MCP servers from API Keys and policies

**Files affected**:
- `src/app/Settings/Policies/components/CreatePolicyModal.tsx`
- `src/app/Settings/Policies/components/PolicyDetailsTab.tsx`
- `src/app/Settings/Policies/mockData.ts`
- `src/app/Settings/Policies/types.ts`

---

### Policies Navigation (At Risk)

**What was de-scoped**: The Policies navigation item was marked "at risk" during 3.2/3.3 development.

**Design history context**: Per 2025-11-17 notes, "Added 'At risk' badges to the API Keys and Policies nav items since we might not show them in 3.2/3.3."

---

## Model Serving / Deploy Model Wizard

### Limits and Policies Expansion in Create API Key

**What was de-scoped**: An expandable section in the Create API Key modal that allowed users to self-impose restrictions beyond the default policy.

**Design history context**: Per 2025-10-30 notes, "Removed the 'Limits and Policies' expansion from the Create API Key modal; there's a possible use case for an AIE to restrict themselves further than what the default policy imposes, but per stakeholder discussion it probably isn't essential for now. We'll revisit this in the future once we get budget controls available."

---

### VLM Support in Model Serving

**What was partially de-scoped**: VLM (Vision Language Model) backed LLM inference services.

**Design history context**: Per 2025-11-12 meeting, "VLM-backed LLM inference services technically possible but currently limited/unsupported feature through gateway API."

---

## Observability & Usage

### Quota Data and Usage Reporting

**What was de-scoped**: Per-endpoint quota data and detailed usage reporting in the dashboard.

**Design history context**: Per 2025-11-12 meeting, "Quota data for endpoints screen depends on RHCL team providing information first; usage reporting currently handled via custom Grafana dashboard."

---

### Cost Management / Chargeback

**What was de-scoped**: User management and cost-related functionality.

**Design history context**: Per 2025-10-27 notes, "Confirmed with MaaS PM that user management and cost-related functionality is out of scope for 3.2/3.3 for now, despite their mention in the 3.0 Jira."

Per 2025-11-12 meeting, "Chargeback is on the roadmap but not a current priority."

---

## Additional Items from Design History

### Per-Group/User Asset Visibility

**What was de-scoped**: The ability to share AI Assets only with certain groups or users rather than making them wide open.

**Design history context**: Per 2025-10-16 notes, "The 'Add asset' modal should include the ability to only make it available to certain groups or users. Not wide open to everyone. Some users may want to only share with certain others."

---

### BYOK (Bring Your Own Key) for External Providers

**What was de-scoped**: The ability for AI Engineers to bring their own API keys from external model providers to the AI Playground.

**Design history context**: Per 2025-10-01 notes, "AI Engineers desire to bring their own key to the AI Playground from external model providers. We still have an open question around whether AI Platform Engineers would allow this given the risk of data exfiltration."

---

## Quick Reference: Key Commits for AI Assistant

When bringing features back, these commits contain the most significant removals:

| Commit | Description | Impact |
|--------|-------------|--------|
| `4f27a9f` | Remove/descope selecting models from Tier form | High - core Tier functionality |
| `95f397e` | Hide MaaS tab | Medium - UI organization |
| `ef16f37` | Descope API Key copying, actions | High - key management |
| `88d7693` | Remove Agents and Vector DBs | Medium - asset associations |
| `eb2159a` | Remove MCP servers from API Keys and policies | Medium - policy integration |
| `80090a2` | Descope Tier YAML tab | Low - GitOps support |
| `f617227` | Descope API Keys list page | High - key visibility |
| `fe7ce9a` | Remove Tier badges | Low - visual indicator |
| `ae0eca2` | Descope API Key Details | High - key details |
| `9380187` | Add delete all API keys (workaround) | Reference for reverting |

---

## Recommended Approach for Re-enabling

1. **Check if code was commented vs deleted**: Many features were commented out using `{/* ... */}` rather than deleted. Search the current codebase first.

2. **Use git to view original implementation**: Run `git show <commit-id>~1:<filepath>` to see the file before the de-scoping change.

3. **Review design history**: Check `.design/features/maas/design-history.md` for context on why features were de-scoped and any updated requirements.

4. **Coordinate with 3.4 planning**: Cross-reference with `3.4-ux-planning-draft.md` to ensure alignment with current 3.4 scope decisions.
