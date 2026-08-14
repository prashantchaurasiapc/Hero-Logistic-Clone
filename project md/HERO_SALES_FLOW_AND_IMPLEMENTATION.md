# HERO Logistics — Sales Portal Flow & Implementation Source of Truth

## 1. Purpose

This document is the living source-of-truth for the **HERO Logistics Sales Portal**.

The Sales Portal is the HERO SaaS sales CRM used to manage:

```text
Lead
→ Contact
→ Demo
→ Trial
→ Proposal
→ Negotiation
→ Won / Lost
→ Onboarding Handover
→ Company Provisioning
```

The Sales Portal is **not** a logistics operations portal.

Sales must never manage:

```text
Freight Loads
Driver Dispatch
Warehouse / Yard Movement
Pickup
Delivery
POD
Customer Freight Invoice
Driver Payroll
Transport Company P&L
```

---

# 2. Critical Role Clarification

The HERO specification defines **ONE Sales Panel**.

There is no requirement for separate:

```text
Sales Director Portal
Sales Manager Portal
Sales Rep Portal
```

Use a single Sales Portal with permission levels.

Recommended model:

```text
Platform Role = SALES
```

with permission/access profiles such as:

```text
SALES_FULL_ACCESS
SALES_REP
```

Do not create unnecessary separate portals.

---

# 3. Who Creates Sales Users?

Sales users are HERO platform employees, not transport-company employees.

Therefore:

```text
SUPER ADMIN
     ↓
Platform User Management
     ↓
Create Platform User
     ↓
Role = SALES
     ↓
Access = SALES_FULL_ACCESS or SALES_REP
     ↓
Sales User Logs Into Sales Portal
```

Company Admin must NOT create HERO Sales users.

Company Admin creates tenant operational users such as:

```text
Dispatcher
Driver
Warehouse / Yard
Accounts
Branch Staff
```

---

# 4. Sales Full Access vs Sales Rep

## SALES_FULL_ACCESS

Can:

- View all leads
- Create leads
- Assign/reassign Sales Reps
- View all pipeline records
- Manage demos
- Manage trials
- Create/send proposals
- Manage team follow-ups
- Mark Won / Lost
- Create onboarding handover
- View team reports
- View Sales Rep performance
- Manage Sales settings
- Manage pipeline settings subject to protected system stages

## SALES_REP

Can:

- View assigned leads
- Update assigned leads
- Contact assigned prospects
- Book/manage own demos
- Manage own follow-ups
- View own trials
- Create/request proposal according to permission
- View own proposals
- Update valid pipeline stages for assigned leads
- View own activity/performance

Cannot by default:

- View unrestricted team pipeline
- Assign/reassign leads to other reps
- Manage Sales Settings
- Delete protected pipeline stages
- View unrestricted team performance reports
- Switch identity to another Sales Rep

---

# 5. Current Identity Dropdown Correction

Current UI may show values such as:

```text
Sales Director (Full Access)
Alex Wright (Sales Rep)
Sarah K. (Sales Rep)
Michael Scott (Sales Rep)
```

This must NOT behave as a production identity switcher.

Authenticated login identity must come from backend auth.

Correct behavior:

```text
Logged-in User:
Alex Wright

Platform Role:
SALES

Sales Access:
SALES_REP
```

If a Full Access user needs team filtering, rename the dropdown to:

```text
Filter by Sales Rep
```

or:

```text
View Sales Rep
```

Options:

```text
All Sales Reps
Alex Wright
Sarah K.
Michael Scott
Ryan Howard
```

This changes the displayed data filter only.

It must never change:

- auth token
- authenticated user
- audit actor
- backend user identity

---

# 6. Existing Sales Portal Navigation

Observed current menu:

```text
SALES PORTAL

Sales Dashboard

Leads

Pipeline Board

Demo Bookings

Trial Companies

Proposals

Follow-Ups

Onboarding Handover

Sales Reports

Settings
```

This overall structure is correct and should be preserved unless the code audit finds broken/duplicate pages.

---

# 7. Final Recommended Sales Navigation

```text
SALES PORTAL

Sales Dashboard

Leads

Pipeline Board

Demo Bookings

Trial Companies

Proposals

Follow-Ups

Onboarding Handover

Sales Reports

Settings
```

No Sales User Management module is required inside Sales Portal.

Sales users are created by Super Admin Platform User Management.

---

# 8. Sales Dashboard

Dashboard should answer:

- How many new leads?
- How many demos booked?
- How many trials active?
- How many proposals sent?
- How many deals won?
- How many deals lost?
- What is current pipeline value?
- Which follow-ups are due?
- What recent sales activity occurred?

Required KPI concepts:

```text
New Leads
Demos Booked
Trials Active
Proposals Sent
Deals Won
Deals Lost
Pipeline Value
```

Additional panels:

```text
Pipeline Stage Distribution
Upcoming Follow-Up Tasks
Recent Activity Timeline
Selected Lead Details
```

All values must come from backend/database.

No fake or hard-coded sales metrics.

---

# 9. Lead Master Record

A Sales Lead is a **prospective transport company that may buy HERO SaaS**.

It is NOT a transport company's freight customer.

Recommended lead fields:

```text
Lead ID
Prospect Company Name
Primary Contact
Email
Phone
Transport Niche
Fleet Size
Current Software
Pain Points
Lead Source
Estimated Revenue / Expected Contract Value
Assigned Sales Rep
Lead Score / Health
Pipeline Stage
Notes
Last Contact
Next Follow-Up
Created At
Updated At
Activity History
```

Lead must be the central CRM record.

Related records:

```text
Lead
 ├── Assigned Sales Rep
 ├── Activities
 ├── Demo Bookings
 ├── Trial
 ├── Proposals
 ├── Follow-Ups
 └── Onboarding Handover
```

---

# 10. Lead Assignment

`Assign Sales Rep` means:

```text
Existing HERO Sales Users
        ↓
Filter role = SALES
        ↓
Choose SALES_REP
        ↓
Assign Lead
```

It does NOT mean create a new Sales Rep from the Lead page.

Example:

```text
Lead: ABC Transport Pty Ltd
Assigned Sales Rep: Alex Wright
```

When Alex logs in:

```text
My Leads
→ ABC Transport Pty Ltd
```

Assignment/reassignment must be:

- permission controlled
- backend validated
- audit logged

---

# 11. Pipeline Stages

Approved core lifecycle:

```text
NEW_LEAD
    ↓
CONTACTED
    ↓
DEMO_BOOKED
    ↓
DEMO_COMPLETED
    ↓
TRIAL_STARTED
    ↓
PROPOSAL_SENT
    ↓
NEGOTIATION
    ↓
WON
```

Alternative terminal stage:

```text
LOST
```

Recommended controlled transition rules:

```text
NEW_LEAD → CONTACTED
CONTACTED → DEMO_BOOKED
DEMO_BOOKED → DEMO_COMPLETED
DEMO_COMPLETED → TRIAL_STARTED
TRIAL_STARTED → PROPOSAL_SENT
PROPOSAL_SENT → NEGOTIATION
NEGOTIATION → WON
ANY APPROVED ACTIVE STAGE → LOST
```

Do not allow uncontrolled frontend-only drag/drop updates.

Backend must validate transitions.

If additional pipeline stages are configurable, keep core system stages protected where needed.

---

# 12. Pipeline Board

The Pipeline Board must use the same backend Lead records.

Drag/drop should call backend transition APIs.

Each transition may trigger:

- validation
- audit log
- activity timeline entry
- related workflow requirement

Examples:

## Demo Booked

Should require/demo-link where appropriate.

## Trial Started

Should link to Trial record/provisioning request.

## Proposal Sent

Should link to actual Proposal.

## Won

Should allow/create Onboarding Handover.

Do not let the board and Leads list maintain separate copies of stage.

---

# 13. Demo Bookings

Demo must be linked to Lead.

Recommended fields:

```text
Demo ID
Lead ID
Prospect Company
Contact
Assigned Sales Rep
Date
Time
Timezone
Meeting Method
Meeting Link / Location
Status
Notes
Outcome
Created By
```

Statuses:

```text
SCHEDULED
COMPLETED
CANCELLED
NO_SHOW
RESCHEDULED
```

Flow:

```text
Lead
→ Book Demo
→ Schedule
→ Reminder
→ Demo Complete / No Show / Cancel
```

On successful completion:

```text
DEMO_BOOKED
→ DEMO_COMPLETED
```

Use backend workflow, not manual disconnected statuses.

---

# 14. Trial Companies

Trial Companies are Sales prospects evaluating HERO.

Important: trial records must not use browser localStorage as business source-of-truth.

Correct architecture:

```text
Frontend
→ Authenticated Sales API
→ Backend
→ Database
```

Trial flow:

```text
Demo Completed
      ↓
Sales clicks Start Trial
      ↓
Choose / Recommend Plan
      ↓
Trial Provision Request
      ↓
Platform Provisioning Service
      ↓
Trial Tenant / Workspace
      ↓
Trial Subscription
      ↓
Trial Active
      ↓
Expiring / Converted / Expired
```

Recommended statuses:

```text
PENDING_PROVISIONING
ACTIVE
EXPIRING
EXPIRED
CONVERTED
CANCELLED
```

---

# 15. Trial Provisioning Ownership

Sales **initiates** the trial.

Super Admin/platform provisioning authority **creates/governs** the SaaS tenant/subscription.

Correct flow:

```text
SALES
→ Start Trial
→ Create Trial Provision Request

            ↓

SHARED PLATFORM PROVISIONING

            ↓

Company/Tenant
+ Trial Subscription
+ Plan
+ Limits
+ Features
+ Primary Admin
```

Do not create duplicate Trial/Company records in Sales and Super Admin.

Sales and Super Admin must reference the same provisioning/company/subscription records.

---

# 16. Proposals

Proposal should be a real CRM/commercial record linked to Lead.

Recommended fields:

```text
Proposal ID / Number
Lead ID
Prospect Company
Recommended Plan
Billing Frequency
Monthly / Annual Price
Discount
Add-ons
Implementation Fee
Trial Credit
Contract Term
Valid Until
Prepared By
Sent At
Viewed At
Accepted At
Status
Notes
Document / PDF reference
```

Recommended statuses:

```text
DRAFT
READY
SENT
VIEWED
REVISION_REQUESTED
ACCEPTED
REJECTED
EXPIRED
```

A licensing agreement may be generated/linked after proposal acceptance if business rules require it.

Do not force Proposal and legal Agreement to be one record unless the existing project architecture explicitly does so.

---

# 17. Proposal → Pipeline Connection

Correct flow:

```text
Create Proposal
      ↓
Send Proposal
      ↓
Pipeline = PROPOSAL_SENT
      ↓
Client Response
      ↓
NEGOTIATION
```

Accepted final commercial terms:

```text
NEGOTIATION
→ WON
```

Rejected:

```text
→ LOST
```

Every important proposal action should create a Lead Activity event.

---

# 18. Follow-Ups

Follow-ups must link to Lead and responsible Sales Rep.

Recommended fields:

```text
Follow-Up ID
Lead ID
Assigned Sales Rep
Type
Due Date
Due Time
Priority
Notes
Status
Outcome
Next Action
Completed At
Created By
```

Types:

```text
CALL
EMAIL
DEMO_FOLLOW_UP
TRIAL_FOLLOW_UP
PROPOSAL_FOLLOW_UP
NEGOTIATION
INTERNAL_TASK
```

Statuses:

```text
PENDING
COMPLETED
MISSED
CANCELLED
```

Completing a follow-up should append to Lead Activity History.

---

# 19. Onboarding Handover

Only qualified Won deals should become onboarding handovers.

Correct flow:

```text
Lead = WON
      ↓
Create Onboarding Handover
      ↓
Validate Required Commercial + Company Data
      ↓
READY_FOR_PROVISIONING
      ↓
Send to Platform Provisioning / Super Admin
```

Recommended handover data:

```text
Lead ID
Prospect Company Name
Primary Contact
Primary Admin Name
Primary Admin Email
Primary Admin Phone

Transport Niche
Fleet Size
Expected Users
Expected Branches

Selected Plan
Billing Frequency
Agreed Price
Discount
Trial Details
Add-ons

White Label Requirement
Integration Requirements
Special Requirements

Sales Notes
Implementation Notes
Proposal / Agreement
Created By Sales Rep
Approved By if required
Handover Status
```

---

# 20. Sales → Super Admin Connection

Sales and Super Admin must not re-enter the same company data independently.

Correct flow:

```text
SALES

WON
 ↓
Onboarding Handover
 ↓
READY_FOR_PROVISIONING

          ↓

SUPER ADMIN / PLATFORM PROVISIONING

Review Handover
 ↓
Confirm Plan
 ↓
Confirm Subscription
 ↓
Create / Activate Company
 ↓
Create Primary Company Admin
 ↓
Apply Limits
 ↓
Apply Features
 ↓
Send Credentials / Onboarding
```

After provisioning, Sales Lead should store/reference:

```text
Converted Company ID
Subscription ID
Provisioning Status
Converted / Onboarded At
```

---

# 21. Convert to Company

If Sales has a `Convert to Company` action, interpret it as:

```text
Sales confirms Won deal
→ Creates/updates provisioning request
→ Platform provisioning creates tenant
```

Do not let Sales bypass:

- tenant provisioning rules
- subscription rules
- plan limits
- feature access
- platform audit
- Super Admin governance

---

# 22. Sales Reports

Current categories are appropriate:

```text
Leads
Conversions
Revenue
Demos
Trials
Proposals
Rep Performance
Activities
```

## Leads

- new leads
- by source
- by niche
- by rep
- by stage

## Conversion

```text
Lead → Demo
Demo → Trial
Trial → Proposal
Proposal → Won
```

## Revenue

Sales Revenue should represent:

```text
Expected Contract Value
Expected MRR
Expected ARR
Won Deal Value
Pipeline Value
```

Actual collected HERO SaaS revenue belongs to Super Admin Platform Billing.

Do not mix collected payments with expected sales revenue unless clearly labeled.

## Rep Performance

- assigned leads
- contacted
- demos
- trials
- proposals
- wins
- losses
- conversion rate
- pipeline value
- follow-up completion

---

# 23. Sales Settings

Valid Sales Settings:

## Email / Touchpoint Templates

Examples:

```text
Demo Invite
Trial Welcome
Trial Expiring
Proposal Sent
Follow-Up
Won / Handover
```

## Pipeline Stages

Allow configuration only within safe boundaries.

Protect core system stages where required:

```text
NEW_LEAD
WON
LOST
```

and any stage required by system workflows.

## Lead Acquisition Sources

Examples:

```text
Google Search
LinkedIn
Partner Referral
Cold Call
Website
Campaign
Referral
Other
```

Sales Settings should not contain:

- platform payment settings
- tenant logistics settings
- company warehouse settings
- driver settings

---

# 24. localStorage Correction — High Priority

Current Sales screens reference localStorage-based registry tables.

That is not acceptable as the production source-of-truth for Sales CRM business data.

Business records that must move to backend/database:

```text
Leads
Pipeline Stages per Lead
Demo Bookings
Trials
Proposals
Follow-Ups
Deals Won/Lost
Onboarding Handovers
Sales Activities
Assignments
Sales Reports source data
```

localStorage may only be used for non-critical UI state such as:

```text
Sidebar collapsed state
Filter preference
Table layout
Temporary unsaved draft
```

Migration must preserve any meaningful existing test/development records where possible.

Do not silently discard existing localStorage data if it is still required for migration/testing.

---

# 25. RBAC / Permission Model

Recommended platform role:

```text
SALES
```

Recommended permission groups:

```text
sales.leads.view_all
sales.leads.view_assigned
sales.leads.create
sales.leads.edit
sales.leads.assign

sales.pipeline.view_all
sales.pipeline.view_assigned
sales.pipeline.transition

sales.demos.view_all
sales.demos.view_own
sales.demos.manage

sales.trials.view_all
sales.trials.view_own
sales.trials.start

sales.proposals.view_all
sales.proposals.view_own
sales.proposals.create
sales.proposals.send

sales.followups.view_all
sales.followups.view_own
sales.followups.manage

sales.onboarding.create
sales.onboarding.view
sales.onboarding.submit

sales.reports.team
sales.reports.own

sales.settings.view
sales.settings.manage
```

The exact permission names may be adapted to the existing RBAC system.

Do not create duplicate RBAC systems if one already exists.

Backend must enforce all access.

---

# 26. Sales Rep Data Scoping

For SALES_REP:

Default access should be:

```text
assignedSalesRepId = authenticatedUser.id
```

for:

- My Leads
- own follow-ups
- own demos
- own proposals
- own trial activity
- own performance

Do not trust frontend query filters.

Backend must restrict the results.

Full Access Sales can view team data according to permission.

---

# 27. Activity Timeline

Create/reuse one activity stream for Lead-related events.

Examples:

```text
Lead Created
Assigned to Alex
Contacted
Demo Booked
Demo Rescheduled
Demo Completed
Trial Started
Trial Expiring
Proposal Created
Proposal Sent
Proposal Viewed
Follow-Up Completed
Stage Changed
Marked Won
Onboarding Handover Submitted
Company Provisioned
```

Store:

```text
Lead ID
Actor User ID
Activity Type
Timestamp
Metadata / Details
```

---

# 28. Audit Logging

At minimum audit:

- lead create/edit/delete/archive
- Sales Rep assignment/reassignment
- pipeline stage transition
- demo create/reschedule/cancel/complete
- trial start
- trial provisioning request
- proposal create/edit/send/accept/reject
- follow-up create/complete/missed
- Won/Lost transition
- onboarding handover create/update/submit
- Sales settings changes
- protected pipeline stage changes
- full-access team filter should not alter actor identity

---

# 29. Data Model Relationships

Conceptual model:

```text
SalesUser
   │
   └── Assigned Leads

Lead
 ├── Assigned Sales Rep
 ├── Lead Activities
 ├── Demo Bookings
 ├── Trial / Trial Provision Request
 ├── Proposals
 ├── Follow-Ups
 ├── Pipeline Stage
 └── Onboarding Handover
          ↓
     Provisioned Company
          ↓
       Subscription
```

Do not duplicate Company Prospect and Provisioned Company as disconnected records.

Preserve conversion reference.

---

# 30. Correct Full HERO Acquisition Flow

```text
Marketing / Referral / Manual Entry
              ↓
             Lead
              ↓
       Sales Rep Assigned
              ↓
           Contacted
              ↓
         Demo Booked
              ↓
        Demo Completed
              ↓
         Trial Started
              ↓
        Proposal Sent
              ↓
         Negotiation
              ↓
          Won / Lost
              ↓
       Onboarding Handover
              ↓
       Platform Provisioning
              ↓
       Company / Subscription
              ↓
        Company Admin Login
              ↓
     Transport Operations Begin
```

---

# 31. What Is Correct in Current Sales UI

Directionally correct:

- Sales Dashboard
- Leads
- Pipeline Board
- Demo Bookings
- Trial Companies
- Proposals
- Follow-Ups
- Onboarding Handover
- Sales Reports
- Sales Settings

Preserve valid UI/components.

Do not rebuild from scratch.

---

# 32. What Needs Correction

1. Remove localStorage as business source-of-truth.
2. Connect all Sales modules to backend/database.
3. Keep one Sales Portal.
4. Super Admin creates Sales users.
5. Use SALES_FULL_ACCESS vs SALES_REP permissions.
6. Remove identity-switch behavior from current user dropdown.
7. Replace with `Filter by Sales Rep` for authorized users.
8. Enforce Sales Rep data scope in backend.
9. Enforce pipeline transitions in backend.
10. Demo must link to Lead.
11. Trial must link to shared provisioning.
12. Avoid duplicate Trial/Company records.
13. Proposal must link to Lead and pipeline.
14. Follow-Ups must update Lead Activity History.
15. Only Won deals should enter onboarding handover.
16. Handover data must flow to Super Admin provisioning.
17. Store provisioned Company reference back on Lead.
18. Remove fake/hard-coded report/dashboard data.
19. Protect required pipeline stages.
20. Keep Sales isolated from logistics operations.

---

# 33. Recommended Implementation Order

## Phase 0 — Audit Only

Map:

- Sales routes/pages
- sidebar
- localStorage usage
- APIs
- database
- auth
- RBAC
- Super Admin Platform Users
- company provisioning
- subscription/trial models
- support services

## Phase 1 — Sales Auth & RBAC

- Platform role SALES
- SALES_FULL_ACCESS
- SALES_REP
- backend permissions
- remove identity switching

## Phase 2 — Backend CRM Source of Truth

- Lead
- Activity
- Assignment
- Pipeline state

## Phase 3 — Demo Bookings

- backend
- Lead linkage
- status transition

## Phase 4 — Trials

- backend trial request
- shared provisioning
- no duplicate tenant

## Phase 5 — Proposals

- backend records
- pipeline linkage
- status handling

## Phase 6 — Follow-Ups

- backend tasks
- Lead activity history

## Phase 7 — Onboarding Handover

- Won only
- same data to Super Admin
- provisioning status/reference

## Phase 8 — Reports / Dashboard

- real backend data
- team vs own scopes

## Phase 9 — Settings

- templates
- sources
- protected stages

## Phase 10 — localStorage Cleanup

- migrate/remove business data usage
- retain harmless UI preferences only

## Phase 11 — Tests / Docs

- RBAC
- workflow
- provisioning
- regression
- documentation

---

# 34. Required Test Scenarios

At minimum verify:

1. Super Admin can create Sales user.
2. Company Admin cannot create HERO Sales user.
3. SALES_FULL_ACCESS can view all leads.
4. SALES_REP sees assigned leads only.
5. SALES_REP cannot change identity to another rep.
6. Full Access Sales Rep filter does not change authenticated user.
7. Lead assignment is permission protected.
8. Lead reassignment is audit logged.
9. Pipeline stage transition is backend validated.
10. Demo is linked to Lead.
11. Demo Complete updates valid pipeline stage.
12. Trial start creates shared provisioning request.
13. Trial does not create duplicate company records.
14. Proposal links to Lead.
15. Proposal Sent updates pipeline.
16. Follow-Up links to Lead/Rep.
17. Follow-Up completion adds Lead Activity.
18. Won deal can create Onboarding Handover.
19. Non-Won lead cannot enter provisioning handover unless explicitly allowed by workflow.
20. Super Admin can see provisioning handover.
21. Provisioning uses handover data without re-entry.
22. Provisioned Company ID is stored on Sales conversion record.
23. Sales reports respect own/team permissions.
24. Sales cannot access logistics operation APIs.
25. Sales business records persist after browser refresh/logout.
26. Sales business records are not dependent on localStorage.
27. Existing working Sales UI has no regression.

---

# 35. Non-Destructive Rules

- Audit first.
- Preserve IDs and records.
- Do not reseed production DB.
- Use safe migrations.
- Do not delete localStorage data until migration/replacement is verified.
- Preserve current UI where valid.
- Do not create duplicate Sales users.
- Do not duplicate Lead records.
- Do not duplicate Trial/Company records.
- Do not create a separate Sales Director Portal.
- Do not create a separate Sales Rep Portal.
- Do not implement logistics operations in Sales.
- Never claim tests passed without running them.

---

# 36. Implementation Change Log

Antigravity must append completed implementation changes.

## Current Baseline

- One Sales Portal confirmed.
- Current menu is broadly correct.
- Full Access vs Sales Rep should be permission-based in the same portal.
- Super Admin is responsible for Sales user creation.
- Current Sales Rep/Director dropdown must not act as identity switcher.
- `Filter by Sales Rep` is the correct management behavior.
- localStorage business source-of-truth is a high-priority architecture issue.
- Sales modules must connect through one backend CRM chain.
- Trial/Company provisioning must connect to Super Admin/platform provisioning.
- Won → Onboarding Handover → Company Provisioning is the final conversion flow.

## Changes Implemented

Append only:

```text
Date:
Phase:
Files Modified:
APIs Added/Changed:
Models/Migrations:
Frontend Changes:
Backend Changes:
RBAC Changes:
Data Migration:
Tests:
Result:
Known Limitations:
```

---

# 37. Files Modified Register

| File | Area | Change | Breaking? | Notes |
|---|---|---|---|---|
| _Pending implementation_ | | | | |

---

# 38. API Register

| Method | Endpoint | Purpose | Permission | Scope | Status |
|---|---|---|---|---|---|
| _Pending audit_ | | | | | |

---

# 39. Database / Migration Register

| Migration | Models / Fields | Purpose | Data Preserved? | Safety |
|---|---|---|---|---|
| _Pending audit_ | | | | |

---

# 40. Test Evidence

```text
Command:
Result:
Passed:
Failed:
Notes:
```

Never claim test success without execution.

---

# 41. Final Sales Definition

Sales is HERO's acquisition/conversion CRM.

It owns:

```text
Prospect
→ Lead
→ Demo
→ Trial
→ Proposal
→ Follow-Up
→ Negotiation
→ Won
→ Onboarding Handover
```

Super Admin owns:

```text
Sales User Creation
Platform Roles
Tenant Provisioning
Plan
Subscription
Features
Platform Billing
```

Company Admin owns:

```text
Transport Company Operations
```

Final rule:

```text
ONE SALES PORTAL
+
SAME SALES DATABASE
+
DIFFERENT PERMISSIONS
=
SALES_FULL_ACCESS / SALES_REP
```
