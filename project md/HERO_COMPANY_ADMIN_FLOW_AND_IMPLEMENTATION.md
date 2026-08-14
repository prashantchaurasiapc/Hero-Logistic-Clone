# HERO Logistics — Company Admin Flow & Implementation Source of Truth

## Purpose

This is the living source-of-truth for the **HERO Logistics Company Admin Portal**.

The Company Admin is the administrator of **one transport/logistics company (tenant)** using HERO. It manages company configuration, branches, customers, loads, drivers/staff, vehicles/trailers, warehouse/yard, pricing, payroll, finance, documents, reports, messages, support, permissions, safety, and delivery issues.

The Company Admin has broad oversight and configuration authority, but must **not silently perform physical Driver or Warehouse/Yard actions** such as Arrived, Pickup, Scan In/Out, Deliver, POD, Start Work, Finish Work or signature capture. Any exceptional override must require permission, reason and audit history.

---

# 1. Role Hierarchy

```text
HERO PLATFORM
      │
      ├── Super Admin
      │      HERO SaaS / Platform Owner
      │
      ├── Sales
      │      Lead → Demo → Trial → Proposal → Won
      │
      └── TRANSPORT COMPANY / TENANT
              │
              ├── Company Admin
              ├── Dispatch
              ├── Warehouse / Yard
              ├── Driver
              ├── Accounts
              └── Customer
```

The shared operational chain is:

```text
Load
→ Stops
→ Items / Cars / Freight
→ Customer
→ Driver / Vehicle / Trailer
→ Pickup
→ In Transit
→ Delivery / POD
→ Invoice
→ Payment
→ Driver / Worker Pay
→ P&L
```

All modules must use the same underlying records. Do not create duplicate copies of Loads, Customers, Drivers, Items or invoices per module.

---

# 2. Existing Company Admin Navigation Observed

```text
COMPANY ADMIN PORTAL

Command Centre

Loads
 ├── All Loads
 ├── Load Inbox
 └── Customers

Live Tracking
Drivers
Vehicles
Branches
Assets
Warehouse
Pricing
Payroll
Finance
Documents
Reports & Analytics
Messages

Support & Knowledge Base
 ├── My Tickets
 ├── Open Tickets
 └── Knowledge Base

Roles & Permissions
Settings
Safety Checklists
Delivery Issues
```

---

# 3. Final Recommended Navigation

```text
COMPANY ADMIN PORTAL

Command Centre

Loads
    All Loads
    Load Inbox
    Planning / Dispatch Overview
    Load Templates              [only if already supported]

Customers

Live Tracking

Drivers / Staff
    Drivers
    Staff / Workforce           [if existing]
    Availability & Leave        [if existing]

Fleet
    Vehicles / Trucks
    Trailers
    Maintenance & Compliance    [reuse current fleet pages]

Branches

Assets
    Company Assets

Warehouse / Yard
    Warehouses / Yards
    Current Stock / Items
    Holding Areas
    Load Lanes
    Movements
    Scanning                    [if supported]

Pricing
Payroll

Finance
    Dashboard
    Customer Invoices
    Payments
    Expenses
    P&L / Load Profit

Documents
Reports & Analytics
Messages

Support & Knowledge Base
    My Tickets
    Open Tickets
    Knowledge Base

Roles & Permissions
Settings
Safety Checklists
Delivery Issues
```

**Important correction:** Customers should be a top-level master module, not nested under Loads.

---

# 4. Company Admin Boundary

## Company Admin CAN

- Configure company profile and tenant settings
- Manage branches
- Manage customers
- Create/review/edit Loads according to permission
- Review Load Inbox
- Oversee planning/dispatch
- Assign/reassign driver, truck and trailer if permitted
- Manage Driver/Staff master records
- Manage vehicle/trailer master records
- Manage warehouse/yard configuration
- Configure pricing
- Manage payroll rules and runs
- Manage company finance/customer billing
- Manage expenses and P&L
- Manage documents
- View reports
- Manage internal communication
- Raise HERO platform support tickets
- Configure tenant roles and permissions
- Configure safety checklist templates
- Review delivery issues

## Company Admin SHOULD NOT silently do

- Driver Arrived
- Driver Pickup
- Driver Delivery
- Driver POD/signature
- Driver Start Work / Finish Work
- Warehouse Scan In / Scan Out
- Physical Yard movement
- Physical loading/unloading confirmation

Exceptional override, if supported:

```text
Permission
→ Mandatory Reason
→ Audit Log
→ Preserve Original History
```

---

# 5. Tenant Isolation

Every tenant-owned record must be protected by `companyId` / `tenantId` at backend level.

Tenant scope applies to:

- branches
- users
- customers
- loads
- stops
- items/cargo
- drivers/staff
- vehicles/trailers
- warehouses/yards
- company assets
- pricing
- payroll
- invoices/payments
- expenses
- documents
- reports
- messages
- support visibility
- roles
- settings
- safety checklists
- delivery issues

Do not rely on frontend filtering as security.

---

# 6. Command Centre

The current Command Centre is directionally correct.

Recommended cards:

- Loads MTD
- Active Loads
- Active Fleet
- Pending Revenue / Outstanding Invoices
- Branches
- Warehouses
- Available Drivers
- Delivery Issues
- Driver Compliance Alerts
- Vehicle Maintenance Due

Quick actions:

- New Load
- Review Load Inbox
- Assign Driver
- Track Load
- Create Customer
- Create Invoice
- View Delivery Issues

All values must come from real backend data. No fake/hard-coded KPI values.

---

# 7. Load — Central Operational Record

A Load should connect to:

- company
- branch
- customer
- load reference
- niche/load type
- required date/time
- stops
- items/cars/freight
- driver
- truck
- trailer
- customer instructions
- internal notes
- documents
- GPS events
- POD
- expenses
- invoice
- delivery issues
- audit history

Recommended high-level lifecycle, mapped safely to existing schema:

```text
DRAFT
→ REQUESTED
→ PLANNED
→ ACTIVE / READY
→ PICKED_UP
→ DISPATCHED
→ IN_TRANSIT
→ DELIVERED
→ COMPLETED

Exceptional:
CANCELLED
ON_HOLD
```

Do not create conflicting duplicate status systems without a clear reason. Stop and item statuses may exist separately.

---

# 8. Stops

Driver and delivery actions must happen per Stop.

Each stop should support as applicable:

- sequence
- type: pickup/delivery/other
- address
- contact
- required time
- instructions
- assigned items
- arrival/departure timestamps
- status
- photos
- signature/POD
- issues

A multi-stop Load must not become complete until all required delivery stops are complete.

---

# 9. Load Inbox

Observed/required sources:

```text
Customer Portal
Email Booking
File Upload
Manual
AI Load Inbox
```

Correct flow:

```text
Incoming Request
→ AI Extraction or Manual Parse
→ Review AI Result
→ Confirm / Edit / Reject
→ Match Customer
→ Confirm Addresses / Stops
→ Confirm Items
→ Create Draft Load
→ Planning / Assignment
```

AI must never directly dispatch or silently finalise operational data.

Store original source, extracted data, confidence, reviewer, edits and final confirmed data.

---

# 10. Customers

Customers are independent master records and should be moved to a top-level menu.

Customer should connect to:

- company/business name
- registration/ABN where relevant
- contacts
- addresses
- billing terms
- account manager
- transport modules/niche
- delivery instructions
- pricing/rate card
- documents
- loads
- invoices
- payments
- activity history

Do not recreate a customer separately for each Load.

---

# 11. Branches

Hierarchy:

```text
Company
→ Branch
   ├── Drivers / Staff
   ├── Vehicles / Trailers
   ├── Warehouses / Yards
   ├── Assets
   ├── Loads
   ├── Revenue
   └── Costs
```

Branch should support name, code, address, timezone, manager, status, operating hours and warehouse/yard links.

---

# 12. Drivers / Staff

Driver master should include:

- Driver ID
- contact details
- branch
- licence
- licence class
- compliance documents
- expiry dates
- skills/endorsements
- availability
- leave
- pay rule
- current vehicle
- current assignment
- history

Keep these concepts separate:

```text
Availability
vs
Work Status
vs
Compliance Status
```

AI driver suggestions may recommend, but human confirmation is required before assignment.

---

# 13. Vehicles / Trucks / Trailers

Audit whether Trailer already exists before building anything new.

Final fleet model should support Truck/Vehicle and Trailer as separate assignable resources where the business requires it.

Vehicle/truck fields may include:

- Rego
- VIN
- Make/Model
- Type
- Capacity
- Branch
- Current Driver
- Odometer
- Next Service
- Compliance
- GPS
- Cost History
- Status

Trailer should support:

- Trailer ID/Rego
- Type
- Capacity
- Branch
- Status
- Compliance
- Maintenance
- Current truck/driver
- history

Trailer swaps should keep reason and history.

---

# 14. Company Assets vs Transported Items

Keep these concepts separate.

## Company Asset

Examples:

```text
Forklift
Scanner
Workshop Equipment
Material Handling Equipment
IT Device
```

## Transported Item / Cargo

Examples:

```text
Car
Vehicle being transported
Pallet
Freight Item
Dangerous Goods Item
Customer Cargo
```

Do not mix operational equipment with customer cargo in UI, API or reporting.

---

# 15. Warehouse / Yard

Core physical flow:

```text
Receive Item
→ Identify / Scan
→ Record Condition
→ Assign Current Location
→ Holding Area
→ Move
→ Load Lane
→ Confirm Loaded
→ Scan Out
```

## Car Carrying fields

- VIN
- Rego
- Stock Number
- Make/Model
- Customer
- Destination
- Current Yard
- Row
- Bay
- Holding Area
- Load Lane
- Condition
- Photos

## General Freight fields

- Item Number
- Barcode/QR
- Pallet Count
- Weight
- Dimensions
- Customer
- Destination
- Warehouse
- Zone
- Aisle
- Bin
- Holding Area
- Load Lane

Transport items must be able to exist before Load assignment.

Movement history should preserve from-location, to-location, actor, timestamp, reason and load if applicable.

---

# 16. Dispatch / Planning Oversight

Current Company Admin navigation lacks clear Dispatch/Planning oversight.

First audit whether shared Dispatcher components already exist.

Recommended Company Admin placement:

```text
Loads
    All Loads
    Load Inbox
    Planning / Dispatch Overview
```

Oversight may show:

- unassigned loads
- planned loads
- driver availability
- truck availability
- trailer availability
- required date/time
- branch
- delays
- dispatch status

Company Admin should not duplicate the full Dispatcher portal unnecessarily.

---

# 17. Live Tracking

Connect:

```text
Driver
→ Vehicle
→ Load
→ Route
→ Current Stop
→ GPS Events
```

Company Admin may view live map, current status, delay and history where permitted.

Do not let Company Admin fake GPS or physical driver status.

If GPS provider is not configured, show `Not Configured` / `No Data` rather than fake values.

---

# 18. Pricing

Current concepts are good:

- Lane Pricing
- Vehicle Type Rates
- Customer Special Rates
- Fuel Surcharge Matrix

Correct relation:

```text
Customer
+
Route / Lane
+
Load / Vehicle Type
+
Customer Special Rate
+
Fuel Surcharge
+
Approved Extra Charges
=
Load Charge
```

Pricing should support effective dates, branch, customer overrides, niche, minimum charges, tax and history/version where possible.

Pricing used for an invoice should be auditable and should not change retroactively when rules change later.

---

# 19. Delivery / POD → Invoice

Correct trigger:

```text
All Required Delivery Stops Complete
+
Required POD Complete
=
Load Ready for Billing
```

Then:

```text
Pricing
→ Draft Customer Invoice
→ Finance / Accounts Review
→ Approve
→ Send
→ Payment
```

Do not automatically mark invoices paid.

---

# 20. Finance

Company Finance is tenant operational finance, completely separate from Super Admin Platform Billing.

Core formula:

```text
Customer Revenue
-
Expenses
-
Driver / Employee Pay
-
Contractor Pay
-
Vehicle Costs
=
Company / Load Profit
```

Finance areas:

- Customer Invoices
- Payments
- Outstanding/Overdue
- Expenses
- Vehicle Costs
- Load Profit
- P&L
- GST/Tax if supported

Do not fabricate `Cash in Bank` unless connected to real accounting/bank data.

Use decimal-safe money handling.

---

# 21. Payroll

Correct flow:

```text
Start Work
→ Work / Load Activities
→ Finish Work
→ Timesheet
+
Pay Rule
+
Hours / Load / KM
+
Allowances
-
Adjustments
=
Pay Calculation
→ Payroll Run
→ Approval
→ Paid / Export
```

Worker pay must remain separate from customer billing.

Corrections must be auditable.

---

# 22. Documents

Document categories may include:

- Company Documents
- Driver Documents
- Vehicle Documents
- Trailer Documents
- Customer Documents
- Load Documents
- POD
- Delivery Photos
- Compliance Documents
- Expense Receipts
- Warehouse Proof Photos

Documents should store entity type, entity ID, category, uploader, timestamp, expiry if relevant and status.

---

# 23. Messages

Messages should support operational context.

Participants can include Company Admin, Dispatch, Driver, Warehouse/Yard, Accounts and branch teams.

Where useful, link conversation/message to Load, Stop, Driver, Warehouse Task or Delivery Issue.

Example:

```text
Message about Load HERO-10025
```

Preserve announcements/templates/scheduled messages where working.

---

# 24. Support & Knowledge Base

Company Admin support represents tenant → HERO platform support.

```text
Company Admin
→ Raise Ticket
→ HERO Super Admin / Support Queue
→ Response
→ Company Admin Sees Reply
→ Resolved / Closed
```

`My Tickets` and Super Admin Support should use the same underlying ticket records.

Do not mix tenant customer delivery complaints with HERO SaaS support.

---

# 25. Roles & Permissions

Company Admin controls tenant operational RBAC.

Possible roles:

- Company Admin
- Branch Manager
- Dispatcher
- Driver
- Warehouse Manager
- Yard Attendant
- Warehouse Attendant
- Accounts
- Payroll
- Read-only Operations
- Customer Service

Example permissions:

```text
loads.view
loads.create
loads.edit
loads.assign
loads.dispatch
customers.view
customers.manage
drivers.view
drivers.manage
vehicles.view
vehicles.manage
trailers.view
trailers.manage
warehouse.view
warehouse.manage
warehouse.move
warehouse.scan
pricing.view
pricing.manage
payroll.view
payroll.manage
finance.view
finance.manage
invoice.approve
invoice.send
documents.view
documents.manage
reports.view
messages.use
delivery_issues.view
delivery_issues.manage
settings.manage
roles.manage
```

Physical actions remain role-specific and backend enforced.

---

# 26. Settings — Correct Tenant Ownership

The following belong in Company Admin Settings:

## Company Profile
- registered company name
- registration number
- addresses
- contacts
- logo
- timezone
- currency

## Branding
- logo
- colours
- email/document branding

## Business Hours

## Niche Configuration
- Car Carrying
- General Freight
- Dangerous Goods

## GPS Providers

## Accounting Integration

## Payroll Rules

## Notification Settings

## Subscription
View current HERO plan/features/limits and only allow actions permitted by the SaaS design.

## White Label
Only show when Super Admin has enabled the effective white-label feature for this tenant.

---

# 27. Niche Configuration

HERO supports:

```text
Car Carrying
General Freight
Dangerous Goods
```

Keep a shared Load/Stop/Customer model with dynamic niche fields.

Car Carrying examples:

- VIN
- Rego
- Stock Number
- Make/Model
- Row/Bay
- condition/photos

General Freight examples:

- Item/Consignment
- Pallets
- Weight
- Dimensions
- Barcode
- Zone/Aisle/Bin

Dangerous Goods examples:

- DG class
- UN number
- compliance requirements
- safety checklist
- required documents

---

# 28. Safety Checklists

Company Admin configures checklist templates; operational roles execute them.

Examples:

- Driver pre-start
- Vehicle compliance
- Dangerous Goods
- Warehouse loading
- Yard movement
- Delivery safety

Store executor, linked entity, timestamp, result and evidence.

Do not let Company Admin silently complete another user's checklist.

---

# 29. Delivery Issues

Delivery Issue should connect to Load, Stop, Item, Driver and Customer where applicable.

Types may include:

- Damage
- Missing Item
- Failed Delivery
- Wrong Address
- Customer Unavailable
- Delay
- Vehicle Issue
- POD Issue
- Refused Delivery

Lifecycle:

```text
OPEN
→ INVESTIGATING
→ ACTION_REQUIRED
→ RESOLVED
→ CLOSED
```

Preserve reporter, evidence, notes, resolution and audit history.

---

# 30. Reports & Analytics

Current categories are directionally correct:

- Operations Reports
- Financial Reports
- Compliance Reports
- Analytics & Insights

Use real tenant DB data.

Examples:

## Operations
- loads by status
- on-time delivery
- branch performance
- driver utilization
- fleet utilization
- warehouse movements
- delivery issues

## Financial
- revenue
- expenses
- payroll
- vehicle costs
- invoice ageing
- load profitability
- P&L

## Compliance
- driver licence expiry
- vehicle registration/insurance expiry
- checklist compliance
- dangerous goods compliance

Remove fake counts/charts.

---

# 31. End-to-End Company Admin Flow

## Request to Draft Load

```text
Customer / Email / Portal / Manual
→ Load Inbox
→ Review
→ AI Result if applicable
→ Confirm / Edit / Reject
→ Draft Load
```

## Load Planning

```text
Draft Load
→ Customer
→ Stops
→ Items / Cars / Freight
→ Required Date
→ Pricing Context
→ Branch
→ Driver
→ Truck
→ Trailer
→ Review
→ Planned / Active
```

## Warehouse/Yard when applicable

```text
Item Received
→ Scan / Identify
→ Condition
→ Current Location
→ Holding Area
→ Load Lane
→ Loaded
→ Scan Out
```

## Driver Execution

```text
Start Work
→ Confirm Truck/Trailer
→ Compliance
→ Accept Job
→ Navigate
→ Arrive
→ Pickup
→ Scan/Select Items
→ Photos/Damage
→ Signature if needed
→ Leave Stop
→ In Transit
→ Delivery
→ Final Photos
→ POD / Signature
→ Complete Stop
→ Complete Load
→ Finish Work
```

## Customer Visibility

```text
Load Status
→ Tracking
→ Delivery
→ POD
→ Documents
→ Invoice
→ Payment History
```

## Finance

```text
Delivered + POD
→ Pricing
→ Draft Invoice
→ Review
→ Approve
→ Send
→ Payment
→ Revenue
```

## Payroll

```text
Start/Finish Work
→ Timesheet
→ Pay Rule
→ Payroll Calculation
→ Approval
→ Pay
```

## P&L

```text
Revenue
-
Expenses
-
Payroll
-
Contractor Pay
-
Vehicle Costs
=
Load / Branch / Company Profit
```

---

# 32. What Is Correct in Current UI

Directionally correct:

- Command Centre
- All Loads
- Load Inbox
- Live Tracking
- Drivers
- Vehicles
- Branches
- Company Assets
- Warehouse base
- Pricing
- Payroll
- Finance
- Documents
- Reports & Analytics
- Messages
- Support & Knowledge Base
- Roles & Permissions
- Safety Checklists
- Delivery Issues

Do not rebuild these from scratch where existing implementation is valid.

---

# 33. What Is Wrong / Needs Correction

1. Customers are incorrectly nested under Loads.
2. Dedicated Dispatch/Planning oversight is missing/unclear in Company Admin navigation.
3. Trailer handling must be audited and exposed separately where required.
4. Company Assets and transported Items/Cargo must be separate concepts.
5. Warehouse must align with Receive → Locate → Stage → Load Lane → Scan Out.
6. Pricing must feed real Load charge calculation.
7. Delivery/POD must feed billing-ready/invoice flow.
8. Payroll must feed from Start/Finish Work and Timesheets.
9. Company Finance must remain separate from Super Admin Platform Billing.
10. Company support tickets must use the same records as Super Admin Support.
11. Company Roles & Permissions must remain tenant-scoped.
12. Tenant-specific Settings belong here.
13. Dashboard/cards/charts must be audited for hard-coded/mock data.
14. Company Admin must not silently perform physical Driver/Warehouse actions.
15. Every tenant record must be isolated by tenant/company ID.

---

# 34. Missing / To Verify in Code Audit

Verify before building anything new:

- Dispatcher / Planning shared components
- Trailer model/routes/pages
- Staff/workforce module
- Availability / Leave
- Inter-company transfer tenant screens
- Customer Instructions / Address Instructions
- Expense capture
- Invoice detail/review workflow
- Payment recording
- Load profit
- Vehicle cost tracking
- POD models/files
- Stop-level status
- Item-level warehouse locations
- Chain of custody
- Audit history
- Company subscription self-service/read-only page
- White-label tenant config
- GPS integrations
- Accounting integration
- Notification settings

Never duplicate existing functionality.

---

# 35. Non-Destructive Rules

- Audit first.
- Reuse working components/APIs.
- Preserve routes where possible.
- Add redirects when routes/menu ownership changes.
- Do not delete tenant/customer data.
- Do not reseed production data.
- Use safe migrations.
- Preserve IDs and relationships.
- Do not hard-code business counters.
- Do not delete old fields before migration/backfill.
- Do not implement other role portals from assumptions.
- Do not claim tests passed unless executed.

---

# 36. Recommended Implementation Order

## Phase 0 — Audit Only
Map frontend, backend, DB, RBAC, tenant scope and mock data.

## Phase 1 — Navigation / Ownership
- Customers top-level
- Loads submenu cleanup
- Planning/Dispatch oversight
- Fleet/Trailer verification

## Phase 2 — Tenant Security
- companyId/tenantId scope
- permissions
- cross-tenant tests

## Phase 3 — Core Load
- one shared Load
- Stops
- Items
- Customer
- Driver
- Truck
- Trailer
- statuses

## Phase 4 — Load Inbox
- sources
- AI review/confirm/edit/reject
- draft creation

## Phase 5 — Master Data
- Customers
- Branches
- Drivers/Staff
- Fleet
- Company Assets

## Phase 6 — Warehouse/Yard
- receive
- locate
- holding
- load lane
- movement history
- niche fields

## Phase 7 — Pricing / Invoice
- pricing calculation
- billing-ready trigger
- invoice review/send

## Phase 8 — Payroll
- start/finish work
- timesheet
- pay rules
- payroll

## Phase 9 — Finance / P&L
- revenue
- expense
- vehicle cost
- payroll
- load/company P&L

## Phase 10 — Documents / Messages / Delivery Issues

## Phase 11 — Support integration

## Phase 12 — Settings / RBAC / Safety

## Phase 13 — Reports / hard-coded data cleanup

## Phase 14 — Tests / Documentation

---

# 37. Required Test Scenarios

At minimum verify:

1. Company Admin sees only own tenant.
2. Customers are tenant scoped.
3. Customers top-level route works.
4. Old customer route redirects safely if changed.
5. Load Inbox creates Draft only after review.
6. AI requires Confirm/Edit/Reject.
7. Load uses shared Customer record.
8. Stops persist correctly.
9. Items persist correctly.
10. Multi-stop Load cannot complete early.
11. Driver assignment is tenant scoped.
12. Vehicle assignment is tenant scoped.
13. Trailer assignment is tenant scoped if supported.
14. Company Asset and transported Item are distinguishable.
15. Warehouse movement changes current location.
16. Load Lane movement is persisted/logged.
17. Unauthorized Company Admin cannot perform physical Driver actions.
18. Delivered + POD triggers billing-ready logic.
19. Pricing feeds invoice amount.
20. Invoice can be reviewed before sending.
21. Company Finance does not use Super Admin SaaS billing as freight revenue.
22. Start/Finish Work feeds timesheet.
23. Timesheet feeds payroll calculation.
24. Payroll does not alter customer invoice.
25. Expenses affect P&L.
26. Vehicle costs affect P&L where supported.
27. Company Admin ticket appears in Super Admin Support.
28. Tenant roles block unauthorized actions.
29. Tenant Settings do not affect another company.
30. Existing Company Admin screens have no regression.

---

# 38. Implementation Change Log

## Current Baseline

- Company Admin screenshots reviewed.
- Existing navigation mapped.
- Core Company Admin business boundary defined.
- Customers placement issue identified.
- Missing/unclear Dispatch/Planning oversight identified.
- Trailer handling flagged for audit.
- Company Assets vs transported Items separation defined.
- Warehouse physical-flow alignment required.
- Pricing → Invoice connection required.
- Start/Finish Work → Timesheet → Payroll connection required.
- Delivery/POD → Invoice connection required.
- Support linkage to Super Admin defined.
- Tenant isolation mandatory.

## Changes Implemented

Append only; never replace history.

```text
Date:
Phase:
Files Modified:
APIs Added/Changed:
Models/Migrations:
Frontend Changes:
Backend Changes:
Security/RBAC Changes:
Data Migration:
Tests:
Result:
Known Limitations:
```

---

# 39. Files Modified Register

| File | Area | Change | Breaking? | Notes |
|---|---|---|---|---|
| [`LoadRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/LoadRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Fully secures loads API endpoint. |
| [`DriverRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/DriverRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures driver endpoints. |
| [`VehicleRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/VehicleRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures vehicle endpoints. |
| [`CustomerRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/CustomerRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures customer endpoints. |
| [`BranchRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/BranchRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures branch endpoints. |
| [`AssetRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/AssetRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures asset endpoints. |
| [`WarehouseRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/WarehouseRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures warehouse endpoints. |
| [`TimesheetRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/TimesheetRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures timesheet endpoints. |
| [`CustomerInvoiceRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/CustomerInvoiceRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures invoices. |
| [`DocumentRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/DocumentRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures documents. |
| [`SupportTicketRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/SupportTicketRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures support tickets. |
| [`PreStartChecklistRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/PreStartChecklistRoutes.js) | Backend Routing | Enabled auth & tenant resolver globally. | No | Secures safety checklists. |
| [`UserRoutes.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/routes/UserRoutes.js) | Backend Routing | Secured route with verifyToken and resolveTenant. | No | Enforces tenant scope. |
| [`DriverController.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/controllers/DriverController.js) | Backend Controller | Enforced companyId scope check on Driver creation. | No | Hardens tenant boundary. |
| [`VehicleController.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/controllers/VehicleController.js) | Backend Controller | Fixed missing `id` param reference in update and enforced req.tenantId scope. | No | Bugfix + isolation hardening. |
| [`LoadController.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/controllers/LoadController.js) | Backend Controller | Enforced companyId on create payload from context. | No | Hardens load creation boundary. |
| [`UserController.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/controllers/UserController.js) | Backend Controller | Enforced companyId context, platform role block, and random unique userCode. | No | Hardens tenant user management boundary. |
| [`CompanyAdminPortalController.js`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/backend/src/controllers/CompanyAdminPortalController.js) | Backend Controller | Validated that branchId belongs to active company in createAsset & createWarehouse. | No | Strong cross-tenant branch validation. |
| [`Sidebar.jsx`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/frontend/src/pages/Layout/Sidebar/Sidebar.jsx) | Frontend Navigation | Added User Management dropdown submenu (User, Role & Permission) and removed old link. | No | Resolves visual layout. |
| [`App.jsx`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/frontend/src/App.jsx) | Frontend Routing | Mapped direct `/users` route to CompanySettings layout. | No | Standardizes direct user lookup navigation. |
| [`CompanySettings.jsx`](file:///c:/Users/Kiaan%20technology/Desktop/kiaan-technology/Hero-Logistic-Clone-14-8-2026/frontend/src/components/CompanyAdmin/CompanySettings.jsx) | Frontend Component | Implemented settings save call and dynamic pathname path matching for currentView sync. | No | Extends setup persistence. |

---

# 40. API Register

| Method | Endpoint | Purpose | Permission | Tenant Scoped? | Status |
|---|---|---|---|---|---|
| GET | `/api/loads` | Query tenant loads list | authenticated | Yes | Active & Secure |
| POST | `/api/loads` | Create new tenant load | authenticated | Yes | Active & Secure |
| GET | `/api/drivers` | Query tenant drivers list | authenticated | Yes | Active & Secure |
| POST | `/api/drivers` | Create new tenant driver | authenticated | Yes | Active & Secure |
| GET | `/api/vehicles` | Query tenant vehicles list | authenticated | Yes | Active & Secure |
| POST | `/api/vehicles` | Create new tenant vehicle | authenticated | Yes | Active & Secure |
| GET | `/api/customers` | Query tenant customers list | authenticated | Yes | Active & Secure |
| POST | `/api/customers` | Create new tenant customer | authenticated | Yes | Active & Secure |
| PUT | `/api/company-admin/settings` | Update tenant company settings | COMPANY_ADMIN | Yes | Active & Secure |

---

# 41. Database / Migration Register

| Migration | Models / Fields | Purpose | Data Preserved? | Safety |
|---|---|---|---|---|
| N/A | None | No schema changes required; enforced checks at Prisma controller level. | Yes | Safe |

---

# 42. Test Evidence

```text
Command: node tests/company_admin.test.js
Result: SUCCESS
Passed: 4/4 Tests (9/9 Assertions)
Failed: 0
Notes:
--- STARTING COMPANY ADMIN FLOW & COMPLIANCE TESTS ---
Setup: Creating test companies and branches...
  ✓ Setup completed successfully.
Test 1: Tenant isolation on Driver operations...
  ✓ Driver created successfully under Company A.
  ✓ Driver A not returned in Company B listings.
  ✓ Update rejected with 404 under unauthorized Company B context.
Test 2: Tenant isolation on Vehicle operations...
  ✓ Vehicle created successfully under Company A.
  ✓ Vehicle A not returned in Company B listings.
Test 3: Enforcing branch boundary constraints on Warehouse/Asset creation...
  ✓ Warehouse creation rejected when branch belongs to different company.
  ✓ Asset creation rejected when branch belongs to different company.
Test 4: UserController tenant boundaries & role enforcement...
  ✓ Creation of Platform user by Tenant Admin rejected with 403.
  ✓ Tenant user (DISPATCHER) successfully created under Company A context.
  ✓ User created in Company A is not visible in Company B listings.
Cleanup: Cleaning up database records...
  ✓ Cleanup finished.
--- ALL COMPANY ADMIN COMPLIANCE TESTS PASSED SUCCESSFULLY ---
```

---

# 43. Deferred Role-Specific Work

Do not redesign these portals until separately audited:

- Dispatcher
- Driver
- Warehouse/Yard Attendant
- Accounts
- Customer
- Sales

Company Admin may reuse shared components, but role-specific execution must not be invented from assumptions.

---

# 44. Final Definition

The Company Admin is the **tenant control centre**.

It manages:

```text
Company
→ Branches
→ Customers
→ Loads
→ Drivers/Staff
→ Fleet
→ Warehouse/Yard
→ Pricing
→ Payroll
→ Finance
→ Documents
→ Reports
→ Messages
→ Support
→ Permissions
→ Settings
→ Safety
→ Delivery Issues
```

and keeps one connected operational chain:

```text
Request
→ Load
→ Stops
→ Items
→ Customer
→ Assignment
→ Warehouse/Yard
→ Pickup
→ Transit
→ Delivery/POD
→ Customer Invoice
→ Payment
→ Worker Pay
→ P&L
```

with strict tenant isolation, role-based execution and complete audit history.
