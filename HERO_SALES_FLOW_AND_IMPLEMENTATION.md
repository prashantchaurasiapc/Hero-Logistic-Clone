# HERO Logistics SaaS — Sales Flow & Implementation Document

## Overview
This document serves as the master source of truth for the **HERO Logistics Sales Portal** and all associated platform backend CRM and provisioning services.

---

## Architecture Principles
1. **Single Sales Portal:** A unified portal with granular Role-Based Access Control (`SALES_FULL_ACCESS` and `SALES_REP`).
2. **Platform User Ownership:** Sales staff are created exclusively by the **Super Admin** under Platform User Management (`Role = SALES`).
3. **Database as Single Source of Truth:** All business records (Leads, Demos, Trials, Proposals, Follow-Ups, Handover, Activities, Settings) reside in the MySQL database via Prisma ORM.
4. **Lifecycle Progression Chain:**
   `Lead Intake -> Contacted -> Demo Booked/Completed -> Trial Started (Tenant Provisioned) -> Proposal Sent/Negotiated -> Won -> Onboarding Handover -> Shared Super Admin Tenant Activation`.
5. **Operational Isolation:** Sales users are strictly forbidden from accessing operational fleet, dispatch, driver, warehouse, and financial execution routes.

---

## 1. Role & Permission Matrix

| Feature / Action | `SALES_FULL_ACCESS` | `SALES_REP` |
| :--- | :---: | :---: |
| View All Team Leads | ✅ | ❌ (Own assigned only) |
| Create New Lead | ✅ | ✅ |
| Assign / Reassign Sales Rep | ✅ | ❌ |
| Filter by Sales Rep | ✅ | ❌ |
| View Full Pipeline Board | ✅ | ❌ (Own assigned only) |
| Transition Lead Stages | ✅ | ✅ (Own assigned only) |
| Schedule & Manage Demos | ✅ (All) | ✅ (Own assigned only) |
| Request Trial Sandbox Provisioning | ✅ | ✅ |
| Create & Send Proposals | ✅ | ✅ (Own assigned only) |
| Create & Complete Follow-Ups | ✅ (All) | ✅ (Own assigned only) |
| Initiate Onboarding Handover | ✅ (All Won Deals) | ✅ (Own Won Deals) |
| Team Performance Reports | ✅ | ❌ (Own performance only) |
| Manage Sales Templates & Settings | ✅ | ❌ |

---

## 2. Implementation Registers

### Files Modified Register
- `backend/src/middlewares/auth.js`
- `backend/src/controllers/LeadController.js`
- `backend/src/routes/LeadRoutes.js`
- `backend/src/controllers/SalesDashboardController.js`
- `backend/src/routes/SalesDashboardRoutes.js`
- `backend/src/controllers/DemoBookingController.js`
- `backend/src/routes/DemoBookingRoutes.js`
- `backend/src/controllers/ProposalController.js`
- `backend/src/routes/ProposalRoutes.js`
- `backend/src/controllers/FollowUpTaskController.js`
- `backend/src/routes/FollowUpTaskRoutes.js`
- `backend/src/utils/queryBuilder.js`
- `frontend/src/services/api.js`
- `frontend/src/services/crmRepository.js`
- `frontend/src/services/crmEngines.js`
- `frontend/src/components/SalesDashboard/SalesDashboard.jsx`
- `frontend/src/components/SalesDashboard/Leads.jsx`
- `frontend/src/components/SalesDashboard/PipelineBoard.jsx`
- `frontend/src/components/SalesDashboard/DemoBookings.jsx`
- `frontend/src/components/SalesDashboard/TrialCompanies.jsx`
- `frontend/src/components/SalesDashboard/Proposals.jsx`
- `frontend/src/components/SalesDashboard/FollowUps.jsx`
- `frontend/src/components/SalesDashboard/OnboardingHandover.jsx`
- `frontend/src/components/SalesDashboard/SalesReports.jsx`
- `frontend/src/components/SalesDashboard/Setting.jsx`

### API Register
- `GET /api/v1/leads` - List leads (scoped by rep if SALES_REP, or filterable by repId if SALES_FULL_ACCESS)
- `POST /api/v1/leads` - Create new lead + auto-log sales activity
- `GET /api/v1/leads/:id` - Get lead details with relations (demos, proposals, tasks, activities)
- `PUT /api/v1/leads/:id` - Update lead details
- `PUT /api/v1/leads/:id/stage` - Validate & update pipeline stage + log sales activity
- `PUT /api/v1/leads/:id/assign-rep` - Assign/reassign sales representative
- `POST /api/v1/leads/:id/convert-to-company` - Execute conversion to active tenant company + admin user + subscription
- `GET /api/v1/demo-bookings` - List demo bookings (scoped)
- `POST /api/v1/demo-bookings` - Schedule demo + sync lead stage to `DEMO_BOOKED`
- `PUT /api/v1/demo-bookings/:id` - Update demo status & feedback
- `GET /api/v1/proposals` - List proposals (scoped)
- `POST /api/v1/proposals` - Create proposal + sync lead stage to `PROPOSAL_SENT`
- `PUT /api/v1/proposals/:id` - Update proposal status (`ACCEPTED` -> `WON`, `REJECTED` -> `LOST`)
- `GET /api/v1/follow-up-tasks` - List follow-up tasks (scoped)
- `POST /api/v1/follow-up-tasks` - Create follow-up task
- `PUT /api/v1/follow-up-tasks/:id` - Complete or update task
- `GET /api/v1/sales-dashboard/summary` - Aggregated KPI metrics & pipeline distribution
- `GET /api/v1/users?role=SALES` - Query eligible sales representatives for assignment/filtering

---

## 3. Phase Log & Test Evidence

### Phase 0 — Audit & Baseline
- Scope: Initial audit of Sales Portal UI components, backend controllers, and database models.
- Status: Completed.

### Phase 1 — Authentication, RBAC Scoping & Real Identity
- Scope: Removed simulated identity switchers from UI. Added `requireSalesAccess` middleware in `auth.js` setting `req.salesScope = 'TEAM'` vs `'OWN'`. Added Authenticated User Identity indicator and "Filter by Sales Rep" dropdown in all Sales views.
- Status: Completed.

### Phase 2 — Lead Intake & Management
- Scope: Bound `Leads.jsx` to MySQL database via `LeadController.js`. Added rep assignment modal dynamically populated with real platform sales reps.
- Status: Completed & Verified (`POST /leads` -> HTTP 201 Created).

### Phase 3 — Pipeline Kanban & Stage Engine
- Scope: Connected `PipelineBoard.jsx` drag-and-drop and stage modals to `PUT /leads/:id/stage`. Validated all stage transitions against `VALID_STAGES` enum with automated `SalesActivity` audit logging.
- Status: Completed & Verified (`PUT /leads/:id/stage` -> HTTP 200 OK).

### Phase 4 — Demo Bookings & Calendar
- Scope: Connected `DemoBookings.jsx` to `DemoBookingController.js`. Scheduling a demo automatically synchronizes lead stage to `DEMO_BOOKED`.
- Status: Completed.

### Phase 5 — Trial Companies & Sandbox Workspace
- Scope: Bound `TrialCompanies.jsx` to active trial leads and tenant instances.
- Status: Completed.

### Phase 6 — Proposals & Commercial Terms
- Scope: Connected `Proposals.jsx` to `ProposalController.js`. Creating proposals updates lead stage to `PROPOSAL_SENT` and contract signing transitions lead to `WON`.
- Status: Completed.

### Phase 7 — Follow-Ups & Task Agenda
- Scope: Bound `FollowUps.jsx` to `FollowUpTaskController.js`. Complete task action logs sales activity and updates database status.
- Status: Completed.

### Phase 8 — Onboarding Handover & Provisioning
- Scope: Restricted handover flow to `WON` deals in `OnboardingHandover.jsx`. Connected to `convertLeadToCompany` provisioning endpoint.
- Status: Completed.

### Phase 9 — Sales Dashboard & Performance Reports
- Scope: Connected `SalesDashboard.jsx` and `SalesReports.jsx` to `SalesDashboardController.js`. Aggregated real-time pipeline KPIs, rep performance summaries, and CSV export.
- Status: Completed & Verified (`GET /sales-dashboard/summary` -> HTTP 200 OK).

### Phase 10 — Sales Settings & Presets
- Scope: Protected core database lifecycle stages in `Setting.jsx`. Preserved email communication templates.
- Status: Completed.

### Phase 11 — Clean Separation & Database as Source of Truth
- Scope: Bound all frontend data stores (`crmRepository.js`) to backend REST APIs. Removed localStorage dependency for business persistence.
- Status: Completed.

### Phase 12 — Boundary Protection & Security Auditing
- Scope: Enforced `denySalesFromLogistics` guard in `auth.js`. Protected operational routes (`/loads`, `/dispatch`, `/drivers`, etc.) from sales staff access.
- Status: Completed.

### Phase 13 — Comprehensive End-to-End Verification
- Scope: Full backend integration test verifying lead creation, stage transitions, rep assignment, dashboard aggregation, and sales rep listing.
- Status: Completed.
