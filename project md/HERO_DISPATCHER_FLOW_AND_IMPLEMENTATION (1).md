# HERO Logistics — Dispatcher Portal Flow & Implementation Source of Truth

## 1. Purpose

This document is the living source-of-truth for the **HERO Logistics Dispatcher Portal**.

Dispatcher ka role **planning + assignment + monitoring + exception management** hai.

Dispatcher decide karta hai:

```text
Kya move hona hai?
Kahan jana hai?
Kab jana hai?
Kis Driver se jana hai?
Kis Truck se jana hai?
Kis Trailer se jana hai?
Warehouse/Yard ready hai?
Driver/Vehicle compliant aur available hai?
Route/schedule feasible hai?
Delay/problem aaye to kya re-plan karna hai?
```

Dispatcher normally physical pickup, delivery, POD, warehouse scan/movement, payroll ya invoice approval perform nahi karega.

---

# 2. Role Boundary

```text
COMPANY ADMIN
      ↓
resources + rules + permissions configure karta hai

DISPATCHER
      ↓
loads validate, plan, assign aur release karta hai

WAREHOUSE / YARD
      ↓
items/cars/freight receive, locate aur stage karta hai

DRIVER
      ↓
pickup → transit → delivery → POD execute karta hai

DISPATCHER
      ↓
live tracking aur exception handling karta hai

ACCOUNTS
      ↓
invoice / payment handle karta hai

COMPANY ADMIN
      ↓
overall oversight / reporting
```

Golden flow:

```text
LOAD
 ↓
VALIDATE
 ↓
PLAN
 ↓
CHECK AVAILABILITY
 ↓
CHECK COMPLIANCE
 ↓
CHECK WAREHOUSE READINESS
 ↓
ASSIGN
 ↓
DISPATCH
 ↓
TRACK
 ↓
HANDLE EXCEPTION
 ↓
MONITOR DELIVERY
 ↓
HAND OFF TO ACCOUNTS
```

---

# 3. Current Dispatcher Menu

```text
DISPATCHER PORTAL

Dispatch Dashboard
Create Load
Active Loads
Planning Board
Live GPS Map
Drivers
Vehicles / Trailers
Customers
Yard / Warehouse
Workforce Availability
Messages
Reports & Analytics
Profile
```

Overall structure correct direction me hai.

Recommended final navigation:

```text
DISPATCHER PORTAL

Dispatch Dashboard

Loads
    Create Load
    Active Loads
    Completed / History [if existing]

Planning Board
Live GPS Map
Drivers
Vehicles / Trailers
Customers
Yard / Warehouse Readiness
Workforce Availability
Messages
Reports & Analytics
Profile
```

---

# 4. Complete Dispatcher Business Flow

```text
LOAD REQUEST / DRAFT LOAD
        ↓
Dispatcher Reviews
        ↓
Customer Confirm
        ↓
Pickup + Delivery Stops Confirm
        ↓
Items / Cars / Freight Confirm
        ↓
Required Date / Time Confirm
        ↓
Branch Confirm
        ↓
Warehouse / Yard Readiness Check
        ↓
Driver Availability Check
        ↓
Driver Licence / Compliance Check
        ↓
Truck Availability / Compliance Check
        ↓
Trailer Availability / Capacity Check
        ↓
Shift / Workforce Check
        ↓
Assignment Conflict Check
        ↓
Planning Board
        ↓
Assign Driver + Truck + Trailer
        ↓
PLANNED / ASSIGNED
        ↓
DISPATCH
        ↓
Driver Receives Job
        ↓
Driver Accepts
        ↓
Driver Pickup
        ↓
Dispatcher GPS Monitoring
        ↓
IN TRANSIT
        ↓
Issue?
   /          \
 YES          NO
  ↓            ↓
Re-plan      Continue
Reassign       ↓
Swap Truck   Delivery
Swap Trailer    ↓
Change ETA     POD
  └──────────→ DELIVERED
                  ↓
                ACCOUNTS
```

---

# 5. Status Ownership

## Dispatcher Controlled

```text
DRAFT
PLANNED
ASSIGNED
DISPATCHED
ON_HOLD
CANCELLED
```

Dispatcher manages:

```text
Driver Assignment
Truck Assignment
Trailer Assignment
Schedule
Route
ETA
Reassignment
Hold
Cancel
Dispatch Release
```

## Driver Controlled Physical Statuses

```text
Accepted
En Route to Pickup
Arrived at Pickup
Picked Up
Loaded
In Transit
Arrived at Delivery
Delivered
POD Captured
```

Dispatcher should not silently set these.

## Warehouse / Yard Controlled

```text
Received
Current Location
Holding Area
Row / Bay
Staged
Load Lane
Loaded
Scanned Out
```

## Accounts Controlled

```text
Billing Ready
Invoice Draft
Invoice Approved
Invoice Sent
Paid
```

Use existing backend enums safely; do not create duplicate conflicting status models.

---

# 6. Dispatch Dashboard

Recommended cards:

```text
Total Loads
Active Loads
Planned Loads
Completed Today
Delayed Loads
Available Drivers
Available Trucks
Available Trailers
```

Attention widgets:

```text
Unassigned Loads
Loads Due Today
Delayed Loads
Driver Compliance Blocks
Drivers Near Shift Limit
Truck Maintenance Conflicts
Trailer Capacity Conflicts
Items Not Ready
Stale GPS
```

All cards/counters must use real backend/database data.

---

# 7. Create Load

Observed issue: `/dispatcher/create-load` appears to show a Loads list instead of a true create workflow.

Recommended wizard:

```text
Step 1 — Customer + Branch
Step 2 — Load Type / Niche
Step 3 — Pickup + Delivery Stops
Step 4 — Items / Cars / Freight
Step 5 — Required Date / Time + Instructions
Step 6 — Pricing Preview (permission/read-only as appropriate)
Step 7 — Driver + Truck + Trailer (optional)
Step 8 — Review
Step 9 — Save Draft / Plan Load
```

Reuse Company Admin/shared Load creation logic where valid.

---

# 8. Active Loads

Observed issue: Draft and Delivered records can appear inside Active Loads.

Active view should normally include:

```text
ASSIGNED
DISPATCHED
EN_ROUTE
AT_PICKUP
PICKED_UP
IN_TRANSIT
AT_DELIVERY
ON_HOLD
```

Exclude Draft and Completed/Delivered from active operational query.

Dashboard count, page header, tabs and rows must use the same status source.

---

# 9. Active Load Detail

Dispatcher needs shared:

```text
Overview
Stops
Items / Cars
Documents
Notes
Chain of Custody
Progress
Route & Tracking
Messages
Delivery Issues
```

Relationship:

```text
LOAD
 ├── Driver
 ├── Truck
 ├── Trailer
 ├── Stops
 ├── Items
 ├── Documents
 ├── GPS
 ├── Messages
 ├── Delivery Issues
 └── Chain of Custody
```

---

# 10. Planning Board

Planning Board is Dispatcher ka core workspace.

Decision flow:

```text
Unassigned Load
       ↓
Required Date / Time
       ↓
Driver Available?
       ↓
Correct Licence?
       ↓
Driver Compliance Valid?
       ↓
Driver Shift Available?
       ↓
Truck Available?
       ↓
Truck Compliant?
       ↓
Trailer Available?
       ↓
Capacity Enough?
       ↓
Warehouse / Yard Ready?
       ↓
Branch / Location Feasible?
       ↓
No Overlap?
       ↓
Assign
```

Conflict examples:

```text
Driver already assigned
Driver on leave
Driver off shift
Wrong licence class
Expired compliance
Truck in maintenance
Truck out of service
Trailer unavailable
Capacity insufficient
Wrong branch
Item not staged
Load lane not ready
Impossible ETA
```

Hard safety/compliance conflict should block. Operational warning can require confirmation.

---

# 11. AI / Optimise Board

AI may suggest:

```text
Suggested Driver
Suggested Truck
Suggested Trailer
Suggested Sequence
Suggested Route
Estimated ETA
Conflict Warnings
```

Mandatory:

```text
AI Suggestion
→ Dispatcher Review
→ Confirm / Edit / Reject
```

AI must not silently commit assignments.

---

# 12. Assignment / Reassignment

Assignment:

```text
Load
→ Driver
→ Truck
→ Trailer
```

Backend validation required.

Reassignment must preserve:

```text
Old Driver → New Driver
Old Truck → New Truck
Old Trailer → New Trailer
Reason
Changed By
Changed At
```

Never overwrite assignment history.

---

# 13. Live GPS Map

Connect:

```text
Driver
+ Vehicle
+ Load
+ Route
+ Current Stop
```

Show:

```text
Current Location
Speed
Heading
Last Update
GPS State
Current Load
ETA
Route
```

Do not fabricate GPS.

If unavailable, show truthful state:

```text
Not Configured
No Data
Stale
Offline
```

Use clear action wording such as:

```text
Share Stop Location
Send Destination
Request Driver Location
Refresh GPS
```

instead of misleading “Send Location to Driver” if that is not the actual behavior.

---

# 14. Drivers — Dispatcher Scope

Dispatcher mainly needs:

```text
Driver
Branch
Availability
Current Shift
Current Assignment
Licence Class
Compliance
Current Truck
Current Trailer
Skills
Phone
```

Question:

```text
Who can safely and legally take this load?
```

`Add Driver` should be permission-driven.

Default driver creation belongs to Company Admin.

Optional elevated permission:

```text
drivers.manage
```

---

# 15. Vehicles / Trailers

Dispatcher needs:

```text
Availability
Type
Capacity
Compliance
Current Driver
Current Assignment
Current Location
Maintenance Status
```

Recommended tabs:

```text
Vehicles / Trucks
Trailers
```

Create/delete/edit fleet master actions should be Company Admin by default and optional for Dispatcher via permission.

---

# 16. Fleet Data Consistency

Observed UI inconsistency:

```text
Dashboard shows available trucks/trailers
Planning Board shows fleet
Vehicle page can show 0
Compliance chart can show 32
```

Final rule:

```text
Vehicle / Trailer Backend DB
        ↓
Dashboard
Planning Board
Vehicle Page
Assignment
GPS Map
Reports
```

Same source-of-truth everywhere.

No fake/hard-coded totals.

---

# 17. Customers — Dispatcher Scope

Default:

```text
customers.view
customers.use_for_load
```

Dispatcher may view:

```text
Customer
Contacts
Addresses
Pickup / Delivery Instructions
Transport Module
Billing Terms read-only if needed
```

Optional:

```text
customers.create
customers.edit_basic
```

Dispatcher should not manage pricing/accounting policy by default.

---

# 18. Yard / Warehouse Readiness

Dispatcher needs readiness visibility, not full warehouse administration.

Recommended fields:

```text
Item / Car / Freight
Current Location
Warehouse / Yard
Holding Area
Row / Bay
Load Lane
Readiness
Last Movement
Required Load
Missing Items
```

Default Dispatcher should NOT:

```text
Create Warehouse
Adjust Stock
Move Stock
Scan In
Scan Out
Correct Inventory
```

Correct connection:

```text
Dispatcher plans Load
        ↓
Warehouse sees required items
        ↓
Warehouse stages items
        ↓
Load Lane assigned
        ↓
READY FOR PICKUP
        ↓
Dispatcher sees Ready
        ↓
Dispatcher releases Driver
```

---

# 19. Workforce Availability

Dispatcher needs:

```text
Available
On Shift
Off Shift
On Leave
Absent
Unavailable
Branch
Skills / Certifications
```

`Assign Shift` only with permission:

```text
workforce.assign_shift
```

otherwise read-only.

---

# 20. Messages

Operational participants:

```text
Driver
Dispatch Team
Warehouse / Yard
Company Admin / Supervisor
```

Messages should optionally link to:

```text
loadId
driverId
stopId
vehicleId
deliveryIssueId
```

Example:

```text
Load PO-643280
Driver Mason Brown
"Pickup gate changed to Gate 3."
```

---

# 21. Escalation

```text
Dispatcher identifies issue
        ↓
Attempts resolution
        ↓
Cannot resolve
        ↓
Escalate
        ↓
Company Admin / Operations Supervisor
```

Store reason, actor, timestamp, linked load/issue and resolution.

---

# 22. Reports & Analytics

Default Dispatcher reports:

```text
Loads by Status
Unassigned Loads
On-Time Dispatch
On-Time Delivery
Delayed Loads
Driver Utilisation
Vehicle Utilisation
Trailer Utilisation
Branch Dispatch Performance
Route Performance
Cancellation Reasons
Hold Reasons
Warehouse Readiness Delay
GPS Compliance
Delivery Issues
```

Full Finance/Payroll reports should not be visible by default.

---

# 23. Profile / Identity

Observed problem: sidebar identity and Profile identity are inconsistent.

One authenticated user must drive:

```text
Sidebar Name
Profile Name
Email
Username
Employee ID
Role
Access Level
Branch
Permissions
```

No mixed mock/test identity in production.

---

# 24. Branch-Level Access

If:

```text
Role = Dispatcher
Access Level = Branch Level
Branch = Sydney
```

then backend must scope data to Sydney unless permission exists:

```text
dispatch.cross_branch.view
```

`All Branches` UI filter must not bypass server authorization.

---

# 25. Recommended Default Permissions

```text
loads.view
loads.create
loads.edit_planning_fields
loads.assign
loads.reassign
loads.dispatch
loads.hold
loads.cancel

planning.view
planning.manage

gps.view

drivers.view
drivers.availability_view

vehicles.view
trailers.view

customers.view
customers.use_for_load

warehouse.readiness_view

workforce.view

messages.use

dispatch_reports.view

profile.manage_own
```

Optional elevated:

```text
drivers.manage
vehicles.manage
trailers.manage
customers.create
customers.edit_basic
workforce.assign_shift
dispatch.cross_branch.view
```

Adapt to existing RBAC.

---

# 26. Default Restrictions

Dispatcher should NOT receive by default:

```text
Company Settings
Super Admin Functions
Subscription / Plan Management
Payroll
Driver Payroll
Full Finance
Customer Invoice Approval
Payment Processing
Warehouse Creation
Warehouse Stock Adjustment
Warehouse Scan Actions
Physical Driver Status Actions
POD Capture on behalf of Driver
Delete Driver
Delete Vehicle
Delete Trailer
```

---

# 27. Key Current Issues to Fix

1. Create Load route/page mismatch.
2. Active Loads includes Draft/Delivered.
3. Active Load counts/tabs appear inconsistent.
4. Dashboard fleet counts vs Vehicle page inconsistent.
5. Vehicle page can show 0 while compliance shows 32.
6. Planning Board fleet source differs from Vehicle master.
7. Profile identity mismatch.
8. Branch-level Dispatcher may see All Branches.
9. Yard/Warehouse is overpowered for Dispatcher.
10. Add Driver/Add Vehicle/Add Warehouse must be permission driven.
11. Financial reports may be overexposed.
12. Mock/hard-coded counts likely exist.
13. Status ownership needs enforcement.
14. Dispatcher must not perform physical Driver/Warehouse actions.
15. All portals must use shared records.

---

# 28. Shared Record Principle

Dispatcher must reuse records shared with:

```text
Company Admin
Warehouse / Yard
Driver
Accounts
Customer
```

One source-of-truth:

```text
One Load
One Driver
One Truck
One Trailer
One Customer
One Item
One Warehouse movement history
```

---

# 29. Tenant + Branch Isolation

Every Dispatcher request must validate:

```text
companyId / tenantId
+
authorizedBranchIds
```

Protect:

```text
Loads
Customers
Drivers
Vehicles
Trailers
Warehouse/Yard
Items
Workforce
Messages
Reports
GPS
Documents
Delivery Issues
```

Do not trust body/query/path branch/company IDs without validation.

---

# 30. Audit Logging

Audit:

```text
Load Created
Load Edited
Load Planned
Driver Assigned/Reassigned
Truck Assigned/Swapped
Trailer Assigned/Swapped
Route Changed
ETA Changed
Load Dispatched
Load Held
Load Cancelled
Operational Override
Escalation
AI Suggestion Confirm/Edit/Reject
```

Store actor, timestamp, before/after and reason where applicable.

---

# 31. Recommended Implementation Order

```text
Phase 0  — Audit Only
Phase 1  — Auth + Tenant/Branch Scope + RBAC
Phase 2  — Shared Backend Data Sources
Phase 3  — Status Ownership
Phase 4  — Create Load
Phase 5  — Active Loads
Phase 6  — Planning Board
Phase 7  — Assignment/Reassignment/Conflict Engine
Phase 8  — Live GPS + Freshness
Phase 9  — Drivers/Fleet/Customers permission views
Phase 10 — Yard/Warehouse Readiness
Phase 11 — Workforce
Phase 12 — Messages/Escalation
Phase 13 — Dispatcher Reports
Phase 14 — Tests/Regression/Documentation
```

---

# 32. Required Tests

At minimum verify:

1. Dispatcher sees only own tenant.
2. Branch Dispatcher sees only authorized branch.
3. Cross-branch permission works.
4. All Branches cannot bypass backend scope.
5. Sidebar/Profile identity matches.
6. Create Load opens actual create workflow.
7. Created Load uses shared backend record.
8. Active Loads excludes Draft.
9. Active Loads excludes Delivered/Completed.
10. Dashboard counts match list queries.
11. Fleet counts match database.
12. Planning Board uses same fleet records.
13. Unavailable Driver cannot be assigned.
14. Wrong licence cannot be assigned.
15. Non-compliant Driver block works.
16. Truck maintenance block works.
17. Trailer availability block works.
18. Capacity conflict handled.
19. Overlap detected.
20. Warehouse readiness uses shared records.
21. Dispatcher cannot warehouse-scan without permission.
22. Dispatcher cannot set Driver physical statuses without override permission.
23. Driver updates appear in Dispatcher.
24. GPS stale/offline works.
25. Reassignment history preserved.
26. Add Driver permission works.
27. Vehicle/Trailer management permission works.
28. Customer management permission works.
29. Shift assignment permission works.
30. Finance/Payroll reports hidden by default.
31. Messages link to operational context.
32. Escalation audited.
33. AI optimisation requires confirmation.
34. Existing screens have no regression.

Never fabricate test results.

---

# 33. Implementation Change Log

## Current Baseline

- Dispatcher screenshots reviewed.
- Navigation mapped.
- Planning/assignment/monitoring boundary defined.
- Driver/Warehouse physical actions separated.
- Create Load mismatch identified.
- Active Load filtering issue identified.
- Fleet data inconsistency identified.
- Profile identity mismatch identified.
- Branch-level access risk identified.
- Yard/Warehouse overexposure identified.
- Permission-driven management actions required.
- Dispatcher reports should remain operational.
- Shared records across all portals are mandatory.

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
Tenant/Branch Isolation:
Data Migration:
Tests:
Result:
Known Limitations:
```

---

# 34. Files Modified Register

| File | Area | Change | Breaking? | Notes |
|---|---|---|---|---|
| _Pending implementation_ | | | | |

---

# 35. API Register

| Method | Endpoint | Purpose | Permission | Tenant/Branch Scoped? | Status |
|---|---|---|---|---|---|
| _Pending audit_ | | | | | |

---

# 36. Database / Migration Register

| Migration | Models / Fields | Purpose | Data Preserved? | Safety |
|---|---|---|---|---|
| _Pending audit_ | | | | |

---

# 37. Test Evidence

```text
Command:
Result:
Passed:
Failed:
Notes:
```

---

# 38. Deferred Role Work

Do not redesign final workflows for:

```text
Driver
Warehouse / Yard Attendant
Accounts
Customer
```

until their portals are separately audited.

---

# 39. Final Dispatcher Definition

Dispatcher = **Live Dispatch Operations Control Room**.

```text
COMPANY ADMIN CONFIGURES
        ↓
DISPATCHER PLANS + ASSIGNS
        ↓
WAREHOUSE / YARD PREPARES
        ↓
DRIVER EXECUTES
        ↓
DISPATCHER MONITORS + REPLANS
        ↓
ACCOUNTS BILLS
```
