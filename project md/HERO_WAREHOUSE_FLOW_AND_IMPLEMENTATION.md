# HERO Logistics — Warehouse / Yard Portal Flow & Implementation Source of Truth

## 1. Purpose

This document is the living source-of-truth for the **HERO Logistics Warehouse / Yard Portal**.

The Warehouse / Yard role owns **physical custody, storage location, movement, staging and handover readiness** of transported items, vehicles and freight inside the company depot/warehouse/yard.

Core principle:

```text
COMPANY ADMIN
configures company / branches / depots / warehouse rules
        ↓
DISPATCHER
decides what must move, where, when, and on which load
        ↓
WAREHOUSE / YARD
receives, identifies, locates, moves, stages and prepares items
        ↓
DRIVER
picks up, dispatches, transports and delivers
        ↓
ACCOUNTS
uses completed delivery/POD for billing
```

Warehouse does **not** normally own customer pricing, customer invoicing, payroll approval, driver assignment policy, route planning, customer delivery completion, final road dispatch or platform administration.

---

## 2. Current Warehouse Portal Menu

```text
WAREHOUSE PORTAL

Dashboard
Find Stock
Receive (Inbound)
Move / Transfer
Load Lanes
Dispatch Ready
Stage (Holding Areas)
Movement History
Messages
My Shift
Warehouse & Yard Map
Reports & Analytics
Tools
 ├── Labels & Barcodes
 ├── Print Documents
 ├── QR Scanner
 ├── Import / Export
 └── Batch Printing
Profile
```

The base menu is broadly correct. The main work is shared backend state, warehouse RBAC, location truth, chain-of-custody, load-lane integration, handover boundary and real vs simulated tooling.

---

## 3. Warehouse Golden Flow

```text
INBOUND ARRIVAL
        ↓
RECEIVE INBOUND
        ↓
SCAN / IDENTIFY
VIN / Rego / Barcode / QR / SKU / Container ID
        ↓
VERIFY EXPECTED ITEM
        ↓
CONDITION CHECK
        ↓
DAMAGE / PHOTOS / NOTES
        ↓
ASSIGN PHYSICAL LOCATION
Depot → Warehouse/Yard → Zone → Row/Aisle → Bay/Bin → Position
        ↓
RECEIVED / IN STORAGE
        ↓
DISPATCHER ASSIGNS ITEM TO LOAD
        ↓
MOVE / TRANSFER
        ↓
HOLDING / STAGING AREA
        ↓
MOVE TO REQUIRED LOAD LANE
        ↓
VERIFY ALL REQUIRED LOAD ITEMS
        ↓
READY FOR PICKUP / HANDOVER READY
        ↓
DRIVER ARRIVES
        ↓
SCAN OUT / HANDOVER CONFIRMATION
        ↓
DRIVER PICKUP & LOADING
        ↓
DRIVER DISPATCHES
        ↓
IN TRANSIT
```

Warehouse owns the warehouse-side physical custody chain. Driver owns the road-execution chain after handover.

---

## 4. Chain of Custody

Every transported item should have one traceable movement history.

```text
Item ABC123

Received at Sydney Depot
→ Main Yard
→ Zone A
→ Row 4
→ Bay 12
→ Position 01
→ Staging Area 1
→ Load Lane 3
→ Handed to Driver
→ Scan Out
```

Each movement should store:

```text
Movement ID
Tenant / Company
Branch / Depot
Warehouse / Yard
Item
Load / Reference
Movement Type
From Location
To Location
Performed By
Role
Reason
Condition
Damage State
Timestamp
Device / Scanner
Photos / Attachments where relevant
Notes
Result
```

Do not fabricate indoor GPS accuracy. Store facility/device GPS only where meaningful.

---

## 5. One Shared Warehouse Context

Use one authoritative context:

```text
Authenticated Warehouse User
        ↓
Tenant / Company
        ↓
Assigned Branch
        ↓
Assigned Depot / Warehouse / Yard
        ↓
Assigned Zone / Shift Scope where applicable
```

All Warehouse pages must use this same context. Do not hard-code a different warehouse, depot or user per page.

---

## 6. Identity Issue

Current screenshots show:

```text
Sidebar: James Patel / WAREHOUSE MANAGER
Profile: W. Smith / Warehouse Staff
```

Production must use one authenticated backend identity across Sidebar, Profile, Shift, Permissions, Receiving, Movement History, Messages, Reports and Tool actions.

---

## 7. Warehouse Manager vs Warehouse Staff RBAC

Use the same Warehouse Portal with permissions.

### Warehouse Manager

```text
View all warehouse activity within authorized scope
Assign warehouse tasks
Manage receiving
Manage stock location
Create/disable holding areas
Create/manage load lanes where allowed
Use controlled overrides
View team activity
View warehouse reports
View movement audit
Manage dispatch-ready queue
Use warehouse tools
```

### Warehouse Staff

```text
View own/assigned tasks
Receive authorized inbound items
Scan items
Move items
Stage items
Move to load lanes
Confirm handover/scan-out if authorized
View own shift
Send operational messages
Use assigned tools
```

Backend permissions are mandatory; hiding buttons is not enough.

---

## 8. Tenant / Branch / Depot Security

Every Warehouse API request must be scoped server-side to:

```text
authenticated tenant/company
+
authorized branch
+
authorized depot/warehouse/yard
+
role permission
```

A user must not access another tenant or unauthorized depot by changing IDs in URLs or query strings.

---

## 9. Transported Stock vs Company Assets

Keep separate.

### Transported Inventory / Custody Items

```text
Customer Car
Pallet
Container
Freight Item
Dangerous Goods Item
Cargo Unit
```

### Company Operational Assets

```text
Forklift
Scanner
Printer
Warehouse Equipment
Workshop Equipment
```

Do not merge these concepts.

---

## 10. Physical Location Hierarchy

Recommended hierarchy:

```text
Company
  ↓
Branch
  ↓
Depot
  ↓
Warehouse / Yard
  ↓
Zone
  ↓
Row / Aisle
  ↓
Bay / Bin
  ↓
Position
```

Special location types may include:

```text
Receiving Area
QC Inspection Area
Holding / Staging Area
Load Lane
Dispatch Area
Cold Storage
Hazmat Storage
Value Storage
Workshop
Restricted Area
```

Prefer a canonical `currentLocationId` plus location metadata rather than duplicated location text fields.

---

## 11. Find Stock

`Find Stock` is a master lookup. Search can support:

```text
VIN
Rego
Barcode
QR
SKU
Item Number
Pallet ID
Container ID
Load Number
Customer Reference
Customer
```

The item detail must use the same record used by Dashboard, Move, Load Lanes, Holding Areas, Yard Map, Movement History, Dispatcher and Driver Pickup.

---

## 12. Stock Identity Rules

For car carrying:

```text
VIN
Rego
Stock Number
Make
Model
Year
Colour
Condition
Photos
```

For general freight:

```text
Barcode
SKU
Pallet ID
Container ID
Quantity
Weight
Dimensions
Hazmat flags
Temperature requirement
```

Do not force car-specific fields onto all freight.

---

## 13. Receive (Inbound)

Inbound sources may include:

```text
Supplier
Customer
Driver
Another Depot
Inter-branch Transfer
External Carrier
```

Correct flow:

```text
Inbound Notice / Manual Receive
        ↓
Receiving Depot
        ↓
Inbound Reference
        ↓
Identify Items
        ↓
Scan / Manual Entry / File Import
        ↓
Expected Item Match
        ↓
Count Verification
        ↓
Condition Check
        ↓
Damage Check
        ↓
Required Photos
        ↓
Assign Initial Location
        ↓
Confirm Receive
```

Every confirmed receive must set current location and write a Receive movement event.

---

## 14. Duplicate Receive Protection

The same physical item should not be received twice silently.

Example:

```text
VIN already active in depot
        ↓
Show existing stock record
        ↓
Require authorized reconciliation
```

---

## 15. Condition / Damage at Receive

Store:

```text
Condition
Damage Status
Damage Description
Photos
Notes
Received By
Timestamp
Inbound Reference
Location
```

This becomes part of the item chain-of-custody for later pickup and delivery comparison.

---

## 16. Move / Transfer

### A. Move Within Depot

```text
Current Location
        ↓
Scan / Select Item
        ↓
Choose New Location
        ↓
Validate Capacity / Restrictions
        ↓
Move
        ↓
Update currentLocationId
        ↓
Write Movement Event
```

### B. Transfer to Another Depot / Branch

```text
Source Depot
        ↓
Transfer Request
        ↓
Destination Depot
        ↓
Items
        ↓
Approval if required
        ↓
Transfer Out
        ↓
In Transfer / In Transit
        ↓
Destination Receive
```

Inter-depot transfer must not be treated as a local location update.

---

## 17. Inter-Company Transfer Boundary

Super Admin owns platform-level transfer permission/policy. Warehouse may execute warehouse-side transfer steps only after authorization. Warehouse must not change cross-company `Can Send`, `Can Receive` or approval rules.

---

## 18. Location Capacity / Restrictions

Before a move validate:

```text
Location active?
Capacity available?
Allowed item type?
Weight limit?
Hazmat restriction?
Temperature requirement?
Vehicle size?
Restricted zone permission?
Load lane compatibility?
```

Server validation is required.

---

## 19. Holding / Staging Areas

Use holding areas for temporary operational custody such as:

```text
Awaiting Load Assignment
Awaiting Lane
Awaiting Driver
QC Hold
Exception Hold
Priority Staging
Hazmat Staging
```

Each area should support:

```text
Area ID
Warehouse / Yard
Zone
Capacity
Allowed Item Types
Current Occupancy
Status
Next Load Lane
Dwell Threshold
```

---

## 20. Staging Dwell / Overdue

Calculate overdue from actual timestamps:

```text
Staged At + Dwell Threshold → Overdue?
```

Overdue items should trigger warehouse alerts, dispatcher visibility where load-impacting, and reporting.

---

## 21. Load Lanes

Load Lane is the physical preparation area associated with the Dispatcher’s real Load.

```text
Dispatcher Load
      ↓
Required Items
      ↓
Warehouse Load Lane
      ↓
Items Staged
```

Example:

```text
LD-3987
Required Items = 10
Lane 4
3/10 → 7/10 → 10/10 → Ready
```

No separate fake load-lane progress disconnected from the Load.

---

## 22. Load Lane Ownership Boundary

Dispatcher decides:

```text
what moves
which Load
schedule
driver/truck/trailer assignment
```

Warehouse decides:

```text
where items are physically stored
how items are staged
whether required items are physically ready
```

---

## 23. Load Lane Status Logic

Possible logical states:

```text
EMPTY
IN_PROGRESS
STAGING
READY
HOLD
FULL
CLOSED
```

Use existing backend enums where possible. `Ready` should not be possible while required items are missing or blocked.

---

## 24. Dispatch Ready

`Dispatch Ready` means warehouse-side preparation is complete.

Recommended checks:

```text
Correct Load
Correct Load Lane
All required items staged
No critical hold
Required warehouse documents ready
Required warehouse checks complete
Driver/truck/trailer visible if assigned
```

---

## 25. Critical Boundary — Warehouse Does Not Normally Perform Road Dispatch

Warehouse owns:

```text
READY_FOR_PICKUP
HANDOVER_READY
HANDED_TO_DRIVER
SCANNED_OUT
GATE_RELEASED
```

Driver owns:

```text
DISPATCHED
IN_TRANSIT
```

If current code has a Warehouse `Mark as Dispatched`, audit it carefully. Do not conflate warehouse handover with road departure.

---

## 26. Driver Handover

Recommended handover:

```text
Driver Arrives
        ↓
Verify Driver / Load / Truck / Trailer
        ↓
Verify Load Lane
        ↓
Scan Item(s)
        ↓
Confirm Count
        ↓
Confirm Condition / Exceptions
        ↓
Warehouse Handover
        ↓
Scan Out / Gate Release
        ↓
Driver Pickup & Loading
```

Handover should update shared Driver and Dispatcher views.

---

## 27. Movement History

Movement History is an immutable/auditable event ledger, not an editable summary table.

Event examples:

```text
Receive
Move
Stage
Unstage
Load Lane Move
Transfer Out
Transfer In
Handover
Scan Out
Return
Exception Hold
Damage Hold
```

Corrections should create a correction/adjustment event rather than silently rewriting history.

---

## 28. Location + Movement Atomicity

Every physical state change should update:

```text
Current Item Location
+
Movement Event
```

preferably in one database transaction.

Never update one without reconciling the other.

---

## 29. Warehouse & Yard Map

Map/yard occupancy must use the same live location records.

Examples:

```text
Zone A Capacity
Load Lane 1 Occupancy
Cold Storage Count
Vehicle Storage Count
Container Count
Hazmat Count
Workshop Count
```

No separate production demo occupancy model.

---

## 30. Customer Privacy Boundary

Exact internal locations such as Row/Bay/Position should not automatically appear in Customer Portal.

Customer-safe milestones may be:

```text
Received at Depot
In Storage
Staged
Ready for Pickup
In Transit
```

---

## 31. Messages

Warehouse messages should support operational context:

```text
loadId
itemId
movementId
warehouseId
locationId
exceptionId
```

Participants may include Dispatcher, Driver, Warehouse Team, Branch Manager, Company Admin, Maintenance and Safety.

---

## 32. My Shift — Current Page Is Wrong

Current screenshot shows a Driver truck/trailer pre-start checklist inside Warehouse `My Shift`. This is incorrect.

Warehouse My Shift should support:

```text
Clock In
Break
Clock Out
Assigned Depot / Zone
Assigned Tasks
Receiving Tasks
Movement Tasks
Staging Tasks
Handover Tasks
Shift Activity
```

If warehouse equipment safety checks are needed, use Forklift/Pallet Jack/Dock Equipment/Scanner checks — not Driver roadworthiness checks.

---

## 33. Reports & Analytics

Use real warehouse records for:

```text
Received Inbound
Handed Over / Outbound
Items Handled
Current Inventory
Staged Items
Average Dwell Time
Movement Accuracy
Damage / Exceptions
Load Lane Utilization
Receiving Performance
Dispatch Preparation Performance
Stock Aging
Capacity by Zone
```

Do not use disconnected mock charts where live data should exist.

---

## 34. Labels & Barcodes

Useful label types:

```text
VIN Label
QR Code Label
Pallet Label
Container Label
Load Label
Location Label
Holding Area Label
Load Lane Label
Custom Label
```

Labels must reference real records.

---

## 35. QR / Barcode Scanner

Production scan flow:

```text
Camera / Hardware Input
        ↓
Decode
        ↓
Lookup Identifier
        ↓
Authorized Warehouse Scope?
        ↓
Show Stock
        ↓
Allowed Action
```

Current simulated scanner may remain for development/demo, but it must be clearly separated from production scanning.

---

## 36. Print Documents

Warehouse documents can include:

```text
Inbound Receipt
Outbound Manifest
Transfer Manifest
Load Lane Sheet
Handover Sheet
Putaway Slip
Damage / Exception Record
```

Generate from live Load/Item/Location data instead of retyping existing data.

---

## 37. Printer Integration Boundary

Audit what printer integration actually exists.

Possible modes/states:

```text
SIMULATED
CONFIGURED
ONLINE
OFFLINE
ERROR
```

Do not fabricate network printer connectivity or job progress.

---

## 38. Batch Printing

If a real print queue exists, persist:

```text
Print Job ID
Job Type
Target Printer
Records
Page/Label Count
Created By
Created At
Queue Status
Progress
Failure Reason
Completed At
```

If no real backend printer queue exists, do not fake completed print jobs.

---

## 39. Import / Export

Safe import flow:

```text
Upload
        ↓
Parse
        ↓
Validate
        ↓
Preview
        ↓
Errors / Duplicates
        ↓
User Confirmation
        ↓
Commit
```

Never commit unvalidated CSV/Excel rows directly.

---

## 40. Warehouse RBAC

Recommended concepts:

```text
warehouse.dashboard.view
warehouse.stock.find
warehouse.receive.create
warehouse.receive.edit_draft
warehouse.receive.confirm
warehouse.move.within_depot
warehouse.transfer.create
warehouse.holding.view
warehouse.holding.manage
warehouse.load_lanes.view
warehouse.load_lanes.manage
warehouse.dispatch_ready.view
warehouse.handover.confirm
warehouse.movements.view
warehouse.messages.use
warehouse.shift.view_own
warehouse.shift.clock_in
warehouse.shift.clock_out
warehouse.map.view
warehouse.reports.view
warehouse.labels.print
warehouse.documents.print
warehouse.scanner.use
warehouse.import.use
warehouse.export.use
warehouse.batch_print.use
warehouse.profile.view
warehouse.profile.edit_own
```

Manager/elevated permissions:

```text
warehouse.tasks.assign
warehouse.team.view
warehouse.overrides.use
warehouse.locations.manage
warehouse.holding.create
warehouse.load_lanes.create
warehouse.reports.team
warehouse.transfer.approve
```

Adapt to the existing RBAC architecture rather than creating a duplicate permission system.

---

## 41. Warehouse Default Restrictions

Normal Warehouse Staff should NOT be able to:

```text
Create arbitrary customer Loads
Assign Drivers
Change pricing
Generate/approve customer invoices
Approve payroll
Modify company subscription
Manage Super Admin features
Mark road journey In Transit
Delete chain-of-custody history
Move stock outside authorized tenant/depot
Override restricted locations without permission
```

---

## 42. Cross-Portal — Dispatcher

```text
Dispatcher assigns LD-3987
        ↓
Warehouse sees required items
        ↓
Warehouse stages items
        ↓
Lane 4 progress 3/10 → 10/10
        ↓
Ready
        ↓
Dispatcher sees Ready
```

No duplicate manual status update.

---

## 43. Cross-Portal — Driver

```text
Warehouse Handover / Scan Out
        ↓
Driver sees Pickup Ready / Correct Items
        ↓
Driver Pickup & Loading
        ↓
Driver Dispatch
        ↓
In Transit
```

Warehouse should not impersonate Driver road events.

---

## 44. Cross-Portal — Company Admin

Company Admin should see high-level warehouse KPIs from shared data:

```text
Capacity
Inbound backlog
Staging backlog
Dispatch-ready count
Movement exceptions
Damaged items
Load lane utilization
Dwell time
```

---

## 45. Cross-Portal — Customer

Warehouse events may update customer-safe milestones such as Received at Depot, Staged and Ready for Pickup. Internal Row/Bay/Position remains internal unless company policy explicitly allows otherwise.

---

## 46. Cross-Portal — Accounts

Warehouse records operational facts. Accounts may later use them for storage/handling/dwell/special-handling fees. Warehouse does not calculate or approve financial charges by default.

---

## 47. Audit Logging

Audit at minimum:

```text
Inbound Draft Created
Inbound Received
Item Scanned
Condition Updated
Damage Reported
Item Moved
Item Staged
Item Unstaged
Item Moved to Load Lane
Holding Area Created/Changed
Load Lane Created/Changed
Item Marked Ready
Handover Confirmed
Item Scanned Out
Transfer Created
Transfer Received
Movement Correction
Label Printed
Document Printed
Import Committed
Override Used
```

Store Actor, Role, Tenant, Branch/Depot, Timestamp, Item, Load, From, To, Reason, Before/After and Device/Scanner where relevant.

---

## 48. High-Priority Current Issues

```text
1. Sidebar/Profile Warehouse identity mismatch.
2. Warehouse Manager vs Staff RBAC is not clearly separated.
3. My Shift incorrectly shows Driver truck/trailer pre-start checklist.
4. Dispatch Ready may incorrectly perform road DISPATCHED.
5. Find Stock location must be the single source used everywhere.
6. Transported inventory and company equipment must remain separate.
7. Load Lane progress must come from real Load required items.
8. Holding/Load Lane capacity must be validated server-side.
9. Movement History must be immutable/auditable.
10. Receive must prevent duplicate active stock.
11. Move/Transfer must validate location restrictions/capacity.
12. Inter-depot transfer must not be a simple local move.
13. Handover/scan-out must connect to Driver Pickup.
14. Warehouse & Yard Map must use real location inventory.
15. Reports must use actual backend data rather than mock totals.
16. Scanner simulation must be separated from real scanner integration.
17. Printer simulation must be separated from real network printer state.
18. Import must validate/preview before commit.
19. Every warehouse action must be tenant/branch/depot scoped.
20. Every physical movement must update location + movement event consistently.
```

---

## 49. Recommended Implementation Order

```text
Phase 0  — Audit Only
Phase 1  — Authenticated Identity + Tenant/Branch/Depot Scope
Phase 2  — Warehouse Manager vs Staff RBAC
Phase 3  — Canonical Physical Location Model
Phase 4  — Find Stock
Phase 5  — Receive Inbound
Phase 6  — Move / Transfer
Phase 7  — Holding / Staging Areas
Phase 8  — Load Lanes
Phase 9  — Dispatch Ready + Handover Boundary
Phase 10 — Movement History / Chain of Custody
Phase 11 — My Shift / Warehouse Tasks
Phase 12 — Warehouse & Yard Map
Phase 13 — Messages
Phase 14 — Reports & Analytics
Phase 15 — Tools: Labels / Documents / Scanner / Import / Printing
Phase 16 — Cross-Portal Integration
Phase 17 — Tests / Regression / Documentation
```

---

## 50. Required Tests

At minimum verify:

1. Warehouse user sees only own tenant.
2. Branch/depot scope is enforced server-side.
3. URL manipulation cannot expose another tenant/depot inventory.
4. Sidebar/Profile use the same authenticated user.
5. Manager vs Staff permissions differ correctly.
6. Staff cannot use manager-only overrides.
7. My Shift no longer shows Driver truck/trailer checklist.
8. Warehouse shift uses the warehouse user identity.
9. Find Stock returns the same current location shown elsewhere.
10. Duplicate active VIN/barcode receive is blocked/reconciled.
11. Receiving writes movement history.
12. Receiving assigns valid initial location.
13. Damage/photos persist with item.
14. Move validates source location.
15. Move validates destination capacity.
16. Move validates restricted-location rules.
17. Move updates current location.
18. Move writes immutable movement event.
19. Inter-depot transfer has transfer-out/in lifecycle.
20. Holding area occupancy is real.
21. Overdue staging uses actual dwell time.
22. Load Lane item list matches real Load requirements.
23. Load Lane Ready blocks missing required items.
24. Warehouse cannot falsely mark road IN_TRANSIT.
25. Handover/scan-out updates Driver/Dispatcher view.
26. Driver pickup can consume handed-over items.
27. Movement History cannot be silently edited.
28. Yard Map counts reconcile with location records.
29. Reports reconcile with warehouse transactions.
30. Labels use real records.
31. Simulated scanner is clearly separate from production scanner mode.
32. Scanner blocks unauthorized item scope.
33. Print documents use real data.
34. Printer status is not fabricated.
35. Import validates and previews before commit.
36. Import duplicate/error rows are reported.
37. Audit logs capture privileged overrides.
38. Existing working Warehouse screens have no regression.

Never fabricate test results.

---

## 51. Documentation Change Log

Antigravity must append implementation evidence below.

### Current Baseline

- Warehouse screenshots reviewed.
- Warehouse menu mapped.
- Warehouse defined as physical custody/location/staging/handover role.
- Golden flow locked.
- Sidebar/Profile identity mismatch identified.
- Warehouse Manager vs Staff RBAC separation required.
- My Shift wrong Driver checklist identified.
- Dispatch Ready vs Driver Dispatch boundary identified.
- Single physical location source required.
- Transported inventory vs company equipment distinction required.
- Load Lane ↔ Dispatcher integration required.
- Movement History immutable chain-of-custody required.
- Scanner/printing simulation vs real integration must be distinguished.
- Tenant/branch/depot scoping required.

### Changes Implemented

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
Security Scope Changes:
Cross-Portal Changes:
Tools/Printing/Scanner Changes:
Tests:
Result:
Known Limitations:
```

---

## 52. Files Modified Register

| File | Area | Change | Breaking? | Notes |
|---|---|---|---|---|
| _Pending implementation_ | | | | |

---

## 53. API Register

| Method | Endpoint | Purpose | Permission | Tenant/Depot Scoped? | Status |
|---|---|---|---|---|---|
| _Pending audit_ | | | | | |

---

## 54. Database / Migration Register

| Migration | Models / Fields | Purpose | Data Preserved? | Safety |
|---|---|---|---|---|
| _Pending audit_ | | | | |

---

## 55. Test Evidence

```text
Command:
Result:
Passed:
Failed:
Notes:
```

Never claim a test passed unless it was actually executed.

---

## 56. Deferred Role-Specific Work

Do not redesign final dedicated Accounts or Customer workflows until those portals are separately audited. Only make shared changes required for Warehouse correctness/integration.

---

## 57. Final Warehouse Definition

Warehouse / Yard = **Physical Custody + Location + Staging + Handover Layer**.

```text
COMPANY ADMIN CONFIGURES
        ↓
DISPATCHER PLANS / ASSIGNS
        ↓
WAREHOUSE / YARD:
RECEIVE
→ IDENTIFY
→ INSPECT
→ LOCATE
→ MOVE
→ STAGE
→ LOAD LANE
→ READY
→ HANDOVER / SCAN OUT
        ↓
DRIVER:
PICKUP
→ DISPATCH
→ IN TRANSIT
→ DELIVERY
        ↓
ACCOUNTS:
BILLING / PAYMENTS
```
