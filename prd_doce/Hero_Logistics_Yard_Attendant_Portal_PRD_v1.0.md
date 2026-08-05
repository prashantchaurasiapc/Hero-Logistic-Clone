# Hero Logistics — Yard Attendant Portal Product Requirements Document (PRD)

**Document Version:** 1.0  
**Product Area:** Yard Attendant Portal  
**Platform:** Hero Logistics Transport, Warehouse & Yard Management System  
**Primary Role:** Yard Attendant  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Default Timezone:** Australia/Sydney (AEST/AEDT), configurable by depot  

---

## 1. Document Purpose

This Product Requirements Document defines the complete functional, operational, security and technical requirements for the **Hero Logistics Yard Attendant Portal**.

The portal is the daily operational workspace used by yard attendants to:

- start and finish work shifts;
- receive inbound vehicles, pallets, freight, containers and equipment;
- search and locate stock within yards and warehouses;
- move items between locations;
- stage inventory in holding areas;
- manage load lanes;
- verify outbound dispatch readiness;
- scan QR codes and barcodes;
- review yard and warehouse maps;
- view vehicle, location and load information;
- maintain a complete movement activity trail;
- print labels and barcodes;
- report safety, damage and missing-item issues;
- review role-scoped reports and analytics.

All names, dates, IDs, counts, locations and sample records shown in the supplied UI references are illustrative. Production screens must use live tenant and branch data.

---

## 2. Product Vision

Provide yard attendants with a fast, mobile-friendly and scan-first operational system that keeps every item traceable from inbound receipt through movement, staging and outbound dispatch, while preventing unsafe, unauthorised or inaccurate stock movements.

---

## 3. Product Goals

### 3.1 Primary Goals

1. Reduce manual yard paperwork and duplicated data entry.
2. Allow stock to be received and located quickly.
3. Ensure every movement creates a traceable audit event.
4. Improve load-lane readiness and outbound turnaround time.
5. Prevent items from being moved into invalid, restricted or full locations.
6. Support barcode/QR-driven operations on handheld devices and yard tablets.
7. Provide reliable offline capture where yard connectivity is weak.
8. Make safety and damage reporting immediate and evidence-based.
9. Restrict attendants to assigned depots, locations and operational actions.

### 3.2 Success Metrics

| Metric | Target |
|---|---:|
| Average inbound item processing time | Under 60 seconds per scanned item |
| Search-to-location time | Under 20 seconds |
| Movement records with complete source/destination data | 100% |
| Unauthorised location access | 0 |
| Duplicate item receipt prevention | 100% of detected duplicates blocked or reviewed |
| Dispatch-ready loads with missing mandatory checks | 0 |
| Barcode/QR scan success rate | At least 98% for supported labels |
| Offline action sync success | At least 99.5% |
| Critical issue notification time | Under 60 seconds |
| Inventory accuracy | At least 98% |
| Standard list response time | Under 2 seconds |

---

## 4. Primary User Persona

### 4.1 Yard Attendant

A yard attendant performs physical stock, vehicle, trailer, container and freight movements at an assigned depot or warehouse.

**Typical responsibilities:**

- clock in and clock out;
- receive inbound loads;
- inspect and record item condition;
- scan stock identifiers;
- locate stock;
- move stock within the depot;
- stage items for outbound loads;
- manage assigned load lanes;
- verify outbound pickups;
- print labels;
- report damage, defects and missing items;
- maintain safe and accurate yard records.

### 4.2 Related Roles

| Role | Relationship to Yard Attendant |
|---|---|
| Warehouse Manager | Supervises operations and approves configured exceptions |
| Yard Supervisor | Assigns tasks, locations and lanes |
| Dispatcher | Coordinates load timing, driver and vehicle arrival |
| Driver | Delivers or collects items |
| Warehouse Staff | Supports storage, picking and staging |
| Compliance Officer | Reviews safety, damage and restricted-item records |
| Maintenance Team | Handles vehicle, trailer and equipment defects |
| Company Admin | Configures locations, permissions and company rules |

---

## 5. Role Scope and Access Principles

### 5.1 Default Scope

The Yard Attendant role is **depot-scoped and task-scoped by default**.

The user may access only:

- assigned company;
- assigned branch or depot;
- authorised yard, warehouse, zones, rows, bays and load lanes;
- assigned inbound, movement, staging and outbound work;
- permitted operational records and reports.

### 5.2 Default Restrictions

A yard attendant must not automatically be allowed to:

- create or manage branches;
- create company-wide locations;
- change system settings;
- manage roles or permissions;
- view payroll or finance;
- edit customer billing data;
- approve compliance overrides;
- delete movement history;
- alter completed audit records;
- create unrestricted loads;
- edit vehicle compliance documents;
- access another depot without permission.

### 5.3 Permission Examples

- `yard.shift.start`
- `yard.shift.finish`
- `yard.dashboard.view`
- `yard.inbound.view`
- `yard.inbound.create`
- `yard.inbound.draft`
- `yard.inbound.complete`
- `yard.stock.search`
- `yard.stock.view`
- `yard.stock.move`
- `yard.stock.transfer_request`
- `yard.staging.view`
- `yard.staging.assign`
- `yard.lane.view`
- `yard.lane.manage`
- `yard.vehicle.view`
- `yard.location.view`
- `yard.load.view`
- `yard.activity.view`
- `yard.scan.execute`
- `yard.dispatch.view`
- `yard.dispatch.confirm`
- `yard.label.view`
- `yard.label.print`
- `yard.report.view`
- `yard.issue.create`
- `yard.issue.view_own`

All permissions must be enforced server-side.

---

## 6. Portal Navigation

1. Start Work / Finish Work
2. Dashboard
3. Receive (Inbound Intake)
4. Find & Search
5. Move
6. Stage Inventory
7. Load Lane Management
8. Vehicles
9. Locations
10. Loads
11. Activities
12. QR / Barcode Scan
13. Yard & Warehouse Map
14. Outbound Dispatch
15. Labels & Barcodes
16. Reports & Analytics
17. Report Issue
18. Profile / Account Menu

---

## 7. Shared Header and Global Functions

### 7.1 Header Elements

- company logo;
- portal name;
- current user;
- role label;
- current depot;
- online/offline state;
- notification count;
- quick search;
- keyboard shortcut `Ctrl + K` or `Cmd + K`;
- account menu;
- logout.

### 7.2 Global Search

Search must support authorised matching for:

- VIN;
- registration number;
- barcode;
- QR code;
- SKU;
- item number;
- stock number;
- container number;
- trailer number;
- vehicle number;
- load number;
- receipt number;
- movement reference;
- customer reference;
- location;
- lane;
- staging area.

### 7.3 Global Status Indicators

The portal should show:

- online;
- syncing;
- offline;
- sync failed;
- last successful sync time;
- local queued action count.

---

# 8. Functional Requirements

## 8.1 Start Work / Finish Work

### 8.1.1 Purpose

Track attendance and operational shift status for the yard attendant.

### 8.1.2 Start Work

The system may capture:

- user ID;
- depot;
- timestamp;
- device;
- GPS location where permitted;
- assigned shift;
- selected role or work area;
- safety acknowledgement;
- equipment assignment;
- supervisor assignment.

### 8.1.3 Finish Work

The system may require:

- outstanding task review;
- uncompleted movement review;
- unsynced action review;
- assigned equipment return;
- issue handover note;
- final confirmation.

### 8.1.4 Business Rules

1. A user cannot start multiple overlapping shifts.
2. Starting outside the configured depot geofence may warn or block.
3. Required induction or certification expiry may block work start.
4. Finish Work must not silently discard unsynced actions.
5. Shift status must be available to supervisors.

### 8.1.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SHIFT-001 | Yard attendant can start an authorised shift. | Must |
| YARD-SHIFT-002 | Yard attendant can finish an active shift. | Must |
| YARD-SHIFT-003 | System must prevent overlapping active shifts. | Must |
| YARD-SHIFT-004 | Unsynced or incomplete work must be shown before finish. | Must |
| YARD-SHIFT-005 | Shift start and finish must be audited. | Must |

---

## 8.2 Yard Dashboard

### 8.2.1 Purpose

Provide a real-time operational overview of the assigned yard or depot.

### 8.2.2 KPI Cards

- Inbound Awaiting Receive
- In Yard Vehicles / Items
- To Move Tasks
- Load Lanes in Progress
- Dispatch Ready
- Yard Capacity

Each KPI should support click-through to the relevant filtered page.

### 8.2.3 Inbound Today

Columns:

- time;
- receipt number;
- supplier or source;
- item count;
- status.

### 8.2.4 Load Lane Overview

Columns:

- lane;
- load;
- progress;
- status.

### 8.2.5 Recent Movements

Columns:

- time;
- item;
- action;
- location.

### 8.2.6 Quick Actions

- Receive Inbound
- Find Stock
- Move / Transfer
- Load Lanes
- Dispatch Ready
- Report Issue

### 8.2.7 Notifications

Examples:

- load assigned to lane;
- item received;
- items ready to move;
- lane full;
- dispatch due;
- damage issue created;
- sync failed.

### 8.2.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-DASH-001 | Dashboard must show depot-scoped operational KPIs. | Must |
| YARD-DASH-002 | KPI cards must link to filtered operational screens. | Should |
| YARD-DASH-003 | Dashboard must show last sync time. | Must |
| YARD-DASH-004 | Dashboard must show offline and pending-sync states. | Must |
| YARD-DASH-005 | Notifications must be role and location scoped. | Must |

---

## 8.3 Receive — Inbound Intake

### 8.3.1 Purpose

Record and confirm incoming vehicles, freight, pallets, containers, equipment and other inventory.

### 8.3.2 Main Actions

- Cancel
- Save as Draft
- Receive Items
- Add Item
- Scan Barcode / QR
- Upload CSV
- Add Photos
- Add Documents

### 8.3.3 Section 1 — Inbound Details

Fields:

- Inbound Type;
- Inbound Number;
- Supplier / From;
- Reference / Delivery Note;
- Transport Type;
- Driver;
- Vehicle / Trailer;
- Date / Time;
- Notes.

Supported inbound types may include:

- supplier delivery;
- customer delivery;
- branch transfer;
- return;
- port intake;
- driver handover;
- purchase receipt;
- other configured type.

### 8.3.4 Section 2 — Location

Location hierarchy is configurable, with possible levels:

- company;
- branch;
- depot;
- warehouse or yard;
- zone;
- row or aisle;
- bay;
- position or slot;
- staging area.

The UI must show a full location preview.

### 8.3.5 Section 3 — Item Entry

Entry methods:

- manual entry;
- barcode scan;
- QR scan;
- VIN or registration lookup;
- CSV import.

Supported item types:

- vehicle;
- pallet;
- carton;
- dangerous goods item;
- container;
- machinery;
- equipment;
- spare parts;
- custom item type.

### 8.3.6 Vehicle Fields

- VIN;
- registration / plate;
- make;
- model;
- year;
- colour;
- condition;
- fuel type;
- damage noted;
- photos required;
- keys received;
- odometer where applicable.

### 8.3.7 Generic Freight Fields

- SKU or item number;
- barcode;
- description;
- quantity;
- unit;
- weight;
- dimensions;
- batch or lot;
- expiry date;
- dangerous goods code;
- condition;
- damage noted.

### 8.3.8 Items to Receive Table

Columns:

- sequence;
- item type;
- description;
- identifier;
- destination location;
- condition;
- damage;
- actions.

### 8.3.9 Documents and Photos

Supported uploads:

- delivery note;
- invoice;
- manifest;
- transfer document;
- condition photo;
- damage photo;
- seal photo;
- other supporting document.

Rules:

- permitted formats configurable;
- default maximum file size 10 MB;
- uploader identity stored;
- timestamp stored;
- malware scan required;
- photo metadata retained where available.

### 8.3.10 Receive Checklist

- item count verified;
- condition checked;
- documents verified;
- photos captured;
- location confirmed;
- dangerous goods checks completed where applicable.

### 8.3.11 Inbound Business Rules

1. Mandatory fields must be completed before final receive.
2. Duplicate VIN, barcode, container or item identifier must trigger review.
3. Destination must be valid, active and not restricted.
4. Capacity rules must be checked.
5. Dangerous goods may only be placed in authorised locations.
6. Damaged items must require issue or damage evidence according to policy.
7. Completing receipt creates inventory records and movement history.
8. Draft receipts do not create final stock availability unless configured.
9. Offline receipts must queue safely and prevent duplicate sync.

### 8.3.12 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-IN-001 | Yard attendant can create an inbound receipt. | Must |
| YARD-IN-002 | Yard attendant can save an incomplete receipt as draft. | Must |
| YARD-IN-003 | System must support manual and scan-based item entry. | Must |
| YARD-IN-004 | System must validate VIN and item identifiers. | Must |
| YARD-IN-005 | System must detect duplicate identifiers. | Must |
| YARD-IN-006 | Final receipt must create inventory and movement records. | Must |
| YARD-IN-007 | Damage evidence rules must be configurable. | Must |
| YARD-IN-008 | CSV import must provide row-level validation. | Should |
| YARD-IN-009 | Offline inbound capture must use an idempotent sync queue. | Must |

---

## 8.4 Find & Search Stock

### 8.4.1 Purpose

Locate vehicles, freight and inventory across authorised yard and warehouse locations.

### 8.4.2 Search Inputs

- VIN;
- registration;
- barcode;
- QR code;
- SKU;
- item number;
- stock number;
- load number;
- customer reference;
- container number.

### 8.4.3 Filters

- Item Type
- Location
- Status
- Load / Job
- Customer
- Date Range
- Zone
- Row
- Bay
- Staging Area

### 8.4.4 Result Columns

- item / description;
- type;
- current location;
- status;
- load / job;
- customer;
- updated time;
- action.

### 8.4.5 Item Details

Display:

- item name;
- identifier;
- VIN or barcode;
- type;
- current location;
- status;
- load / job;
- customer;
- received date;
- condition;
- notes;
- movement history.

Actions:

- Move / Transfer;
- View Load;
- View Item History;
- Report Issue;
- Print Label where permitted.

### 8.4.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SEARCH-001 | Search must support exact and partial identifiers. | Must |
| YARD-SEARCH-002 | Scan result must open the matching item quickly. | Must |
| YARD-SEARCH-003 | Results must show current authoritative location. | Must |
| YARD-SEARCH-004 | Search must be restricted to authorised locations. | Must |
| YARD-SEARCH-005 | Item details must show latest movement state. | Must |
| YARD-SEARCH-006 | Search filters must be combinable. | Must |

---

## 8.5 Move

### 8.5.1 Purpose

Move items within the depot or request transfer to another depot.

### 8.5.2 Movement Types

- Move Within Depot
- Transfer to Another Depot
- Stage to Holding Area
- Move to Load Lane
- Return to Storage
- Move to Inspection
- Move to Maintenance / Hold

### 8.5.3 Movement Details

Fields:

- reference number;
- date / time;
- reason;
- priority;
- notes;
- assigned equipment;
- assigned worker;
- source;
- destination.

### 8.5.4 Items to Move

Entry methods:

- scan;
- manual identifier;
- import from list;
- selected search results.

Columns:

- item;
- type;
- current location;
- destination location;
- condition;
- actions.

### 8.5.5 Special Instructions

- requires equipment;
- notify after move;
- fragile;
- dangerous goods;
- temperature-controlled;
- security escort;
- free-text instructions.

### 8.5.6 Validation Rules

1. Item must exist and be accessible.
2. Current location must match server state.
3. Destination must be active and permitted.
4. Destination capacity must be sufficient.
5. Restricted categories must match destination rules.
6. Item cannot be in a conflicting active movement.
7. Move confirmation must create a movement event.
8. Transfer to another depot creates a transfer job, not an immediate final location update.
9. Failed movements must preserve reason and original state.

### 8.5.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-MOVE-001 | Yard attendant can move authorised items within a depot. | Must |
| YARD-MOVE-002 | System must validate source and destination. | Must |
| YARD-MOVE-003 | Capacity and restriction rules must be enforced. | Must |
| YARD-MOVE-004 | Cross-depot movement must use transfer workflow. | Must |
| YARD-MOVE-005 | Bulk movement must validate every item individually. | Must |
| YARD-MOVE-006 | Every result must create an immutable movement record. | Must |
| YARD-MOVE-007 | Stale item location must block finalisation. | Must |

---

## 8.6 Stage Inventory — Holding Areas

### 8.6.1 Purpose

Manage temporary holding areas used before items are moved to load lanes or other destinations.

### 8.6.2 Summary Metrics

- total staging areas;
- active and inactive areas;
- staged items;
- awaiting move;
- overdue items.

### 8.6.3 Views

- All Staging Areas
- By Zone
- By Load Lane
- Inactive Areas

### 8.6.4 Columns

- staging area;
- zone;
- next load lane;
- status;
- capacity;
- occupancy;
- staged items;
- awaiting move;
- oldest item;
- actions.

### 8.6.5 Staging Statuses

- Active
- Inactive
- Available
- Near Capacity
- Full
- Restricted
- Maintenance

### 8.6.6 Staged Item Statuses

- Staged
- Awaiting Move
- Ready for Lane
- On Hold
- Overdue
- Damaged
- Restricted

### 8.6.7 Business Rules

1. Holding-area capacity must be enforced.
2. Dwell-time thresholds must be configurable.
3. Overdue items must generate alerts.
4. Dangerous goods must use authorised staging areas.
5. Items cannot be assigned to inactive areas.
6. Moving staged items must update occupancy in real time.
7. Yard attendants may not create a new holding area unless explicitly permitted.

### 8.6.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-STAGE-001 | Staging areas must show capacity and occupancy. | Must |
| YARD-STAGE-002 | Yard attendant can assign eligible items to staging. | Must |
| YARD-STAGE-003 | Full or restricted staging areas must block movement. | Must |
| YARD-STAGE-004 | Dwell-time alerts must be generated. | Must |
| YARD-STAGE-005 | Staging assignment must create movement history. | Must |
| YARD-STAGE-006 | Staging actions must update load-lane readiness. | Should |

---

## 8.7 Load Lane Management

### 8.7.1 Purpose

Manage lanes where items are organised for outbound loading and dispatch.

### 8.7.2 Summary Metrics

- total lanes;
- loads in progress;
- ready to dispatch;
- overdue / hold.

### 8.7.3 Lane List Columns

- lane / area;
- status;
- load count;
- current load / reference;
- trailer / vehicle;
- driver;
- estimated dispatch;
- actions.

### 8.7.4 Lane Statuses

- Empty
- Assigned
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Closed
- Maintenance

### 8.7.5 Lane Detail

Display:

- lane name;
- location;
- lane status;
- capacity;
- occupancy;
- assigned load;
- sub-reference;
- staged item count;
- item list;
- driver;
- vehicle / trailer;
- estimated dispatch;
- verification state;
- sealing state;
- notes.

Actions:

- Move Items to Lane;
- Assign / Update Driver;
- Print Lane Report;
- Print Labels;
- Place on Hold;
- Release Hold;
- Mark Ready;
- View Dispatch Ready.

### 8.7.6 Business Rules

1. Lane capacity must be enforced.
2. Items must belong to the assigned load unless authorised exception exists.
3. Lane readiness requires all configured items and checks.
4. Hold reasons must be recorded.
5. Lane cannot be marked ready with unresolved mandatory issues.
6. Emptying a lane must preserve item movement history.
7. Creating or deleting lanes is supervisor-level by default.

### 8.7.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LANE-001 | Lane status and occupancy must update in real time. | Must |
| YARD-LANE-002 | Items can be moved into eligible lanes. | Must |
| YARD-LANE-003 | Wrong-load items must be blocked or require approved override. | Must |
| YARD-LANE-004 | Ready status must enforce configured checklist. | Must |
| YARD-LANE-005 | Hold and release actions must be audited. | Must |
| YARD-LANE-006 | Lane detail must show staged item list. | Must |

---

## 8.8 Vehicles

### 8.8.1 Purpose

Provide operational visibility into vehicles relevant to yard work.

### 8.8.2 Summary

- total vehicles;
- active;
- in maintenance;
- out of service;
- compliance due.

### 8.8.3 Columns

- vehicle / registration;
- type / make / model;
- year;
- status;
- current driver;
- odometer;
- compliance;
- next service;
- actions.

### 8.8.4 Yard Attendant Access

Default actions:

- view vehicle;
- scan vehicle label;
- see current yard location;
- report defect;
- see operational status;
- link vehicle to inbound or outbound work.

Restricted by default:

- edit compliance documents;
- approve maintenance;
- add or delete vehicles;
- alter ownership or registration.

### 8.8.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-VEH-001 | Yard attendant can view operational vehicle data. | Must |
| YARD-VEH-002 | Out-of-service vehicles must be clearly identified. | Must |
| YARD-VEH-003 | Vehicle location must match movement records. | Must |
| YARD-VEH-004 | Defect reporting must be available from vehicle details. | Must |

---

## 8.9 Locations

### 8.9.1 Purpose

Allow attendants to view authorised depot, yard, warehouse and location structure.

### 8.9.2 Location Types

- branch;
- depot;
- warehouse;
- yard;
- receiving area;
- inspection area;
- zone;
- row;
- aisle;
- bay;
- position;
- staging area;
- load lane;
- container stack;
- hazardous storage;
- cold storage;
- dispatch area;
- maintenance area;
- restricted area.

### 8.9.3 Required Data

- location ID;
- name;
- code;
- type;
- parent location;
- capacity;
- occupancy;
- status;
- restriction rules;
- item categories allowed;
- map coordinates;
- QR/barcode identifier.

### 8.9.4 Default Access

The yard attendant may view locations and occupancy. Creation, deletion and configuration are supervisor or admin functions unless permission is granted.

### 8.9.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LOC-001 | Location hierarchy must be configurable. | Must |
| YARD-LOC-002 | Location occupancy must update after movements. | Must |
| YARD-LOC-003 | Restricted locations must show clear access rules. | Must |
| YARD-LOC-004 | Location QR codes must resolve to location details. | Must |
| YARD-LOC-005 | Yard attendant must not create branches by default. | Must |

---

## 8.10 Loads

### 8.10.1 Purpose

Provide read-focused access to loads relevant to receiving, staging, lanes and outbound dispatch.

### 8.10.2 Filters

- date range;
- status;
- type;
- customer;
- driver;
- vehicle;
- location;
- branch;
- search.

### 8.10.3 Columns

- load reference;
- status;
- load type;
- customer;
- route;
- driver / truck;
- pickup date;
- ETA / delivery;
- progress;
- actions.

### 8.10.4 Yard Attendant Actions

Default permitted actions may include:

- view load;
- view assigned items;
- view pickup and dispatch instructions;
- view documents;
- stage items;
- move items to lane;
- mark physical milestones where assigned;
- report issue.

Restricted by default:

- create unrestricted load;
- change customer;
- alter pricing;
- assign driver;
- cancel load;
- modify route.

### 8.10.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LOAD-001 | Yard attendant can view authorised load data. | Must |
| YARD-LOAD-002 | Load detail must show expected and staged items. | Must |
| YARD-LOAD-003 | Physical milestone updates must be permission controlled. | Must |
| YARD-LOAD-004 | Yard actions must update dispatcher-visible load state. | Must |
| YARD-LOAD-005 | Load financial data must be hidden. | Must |

---

## 8.11 Activities / Movement History

### 8.11.1 Purpose

Provide a complete audit trail of physical stock and yard actions.

### 8.11.2 Filters

- date range;
- movement type;
- from location;
- to location;
- item type;
- item;
- load / reference;
- driver / staff;
- reason;
- result.

### 8.11.3 Columns

- date / time;
- movement type;
- item / description;
- from location;
- to location;
- load / reference;
- performed by;
- result;
- details.

### 8.11.4 Movement Types

- Receive
- Move
- Transfer
- Stage
- Dispatch
- Pickup
- Return
- Inspection
- Hold
- Release Hold
- Adjustment

### 8.11.5 Result States

- Completed
- Failed
- In Progress
- Cancelled
- Pending Sync

### 8.11.6 Movement Detail

- movement ID;
- date / time;
- item;
- source;
- destination;
- load or receipt reference;
- performed by;
- device;
- reason;
- notes;
- result;
- sync state;
- evidence;
- audit reference.

### 8.11.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-ACT-001 | All successful and failed movements must be recorded. | Must |
| YARD-ACT-002 | History must be immutable to normal users. | Must |
| YARD-ACT-003 | Activity filters must support audit investigation. | Must |
| YARD-ACT-004 | Offline actions must show pending and final sync states. | Must |
| YARD-ACT-005 | Export and print must require permission. | Must |

---

## 8.12 QR / Barcode Scan

### 8.12.1 Purpose

Support fast operational execution using handheld scanners, mobile cameras and forklift tablets.

### 8.12.2 Supported Actions

- Scan In
- Scan Out
- Find Item
- Verify Item
- Receive Item
- Move Item
- Stage Item
- Assign to Lane
- Confirm Dispatch
- Scan Location
- Manual Entry

### 8.12.3 Supported Identifiers

- VIN barcode;
- registration barcode;
- item barcode;
- QR code;
- SKU;
- pallet ID;
- container number;
- location code;
- load ID;
- lane ID.

### 8.12.4 Device State

- connected;
- online;
- ready;
- scanning;
- disconnected;
- error;
- camera permission denied.

### 8.12.5 Scan Workflow

1. User selects action or uses configured default.
2. Device captures code.
3. System decodes identifier.
4. System identifies entity.
5. System displays key data.
6. User confirms operation.
7. Server validates permission and state.
8. Inventory and movement record update.
9. Success or failure feedback appears.

### 8.12.6 Scan Rules

- duplicate rapid scans must be debounced;
- unknown codes must not create records automatically unless permitted;
- wrong item or location combination must block;
- scan action must retain device and user metadata;
- offline scans must have idempotency keys;
- audible and visual feedback should be supported.

### 8.12.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SCAN-001 | Portal must support hardware scanner and camera input. | Must |
| YARD-SCAN-002 | Scan response must be optimised for fast use. | Must |
| YARD-SCAN-003 | Duplicate scan protection must be implemented. | Must |
| YARD-SCAN-004 | Unknown or conflicting codes must show clear errors. | Must |
| YARD-SCAN-005 | Scan actions must create audit and movement records. | Must |
| YARD-SCAN-006 | Offline scans must sync safely without duplication. | Must |

---

## 8.13 Yard & Warehouse Map

### 8.13.1 Purpose

Provide a visual representation of yard and warehouse capacity, inventory and operational status.

### 8.13.2 Map Areas

- receiving;
- QC inspection;
- staging;
- dispatch;
- cold storage;
- zones;
- load lanes;
- hazardous storage;
- value storage;
- workshop;
- office;
- vehicle storage;
- container yard;
- equipment parking;
- empty trailer park;
- in gate;
- out gate;
- access road.

### 8.13.3 Map Statuses

- Available
- In Use
- Staging
- On Hold
- Full
- Empty
- Maintenance
- Restricted

### 8.13.4 Interactions

Clicking a map location should show:

- location name;
- code;
- capacity;
- occupancy;
- status;
- current items;
- pending work;
- restrictions;
- quick actions.

### 8.13.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-MAP-001 | Map must reflect current location states. | Must |
| YARD-MAP-002 | Location drill-down must show current items. | Must |
| YARD-MAP-003 | Full and restricted areas must be visually distinct. | Must |
| YARD-MAP-004 | Map data must be depot scoped. | Must |
| YARD-MAP-005 | Refresh and last-updated time must be visible. | Must |

---

## 8.14 Outbound Dispatch

### 8.14.1 Purpose

Verify and record loads or items leaving the yard.

### 8.14.2 Summary Metrics

- ready to dispatch;
- today’s dispatch;
- awaiting pickup;
- exceptions.

### 8.14.3 Filters

- date;
- status;
- load lane;
- driver;
- trailer / vehicle;
- more filters.

### 8.14.4 Columns

- load / reference;
- customer;
- trailer / vehicle;
- driver;
- load lane;
- ready since;
- status;
- actions.

### 8.14.5 Statuses

- Ready
- Awaiting Pickup
- Driver Arrived
- Loading
- Hold
- Exception
- Dispatched
- Cancelled

### 8.14.6 Dispatch Checklist

Possible configured checks:

- correct load;
- correct items;
- item count verified;
- condition verified;
- documents complete;
- labels complete;
- lane verified;
- vehicle and trailer verified;
- driver verified;
- seal recorded;
- safety check complete;
- hold cleared;
- departure time captured.

### 8.14.7 Mark as Dispatched

The action must:

- confirm driver, vehicle and trailer;
- validate required documents;
- validate mandatory checks;
- update load status;
- update item status;
- clear or update lane occupancy;
- create movement records;
- capture departure timestamp;
- notify dispatch team;
- create audit event.

### 8.14.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-OUT-001 | Only eligible staged loads may appear as dispatch ready. | Must |
| YARD-OUT-002 | Mandatory dispatch checks must block departure confirmation. | Must |
| YARD-OUT-003 | Marking dispatched must update load, items and lane. | Must |
| YARD-OUT-004 | Hold items must not be dispatched. | Must |
| YARD-OUT-005 | Departure confirmation must be audited. | Must |
| YARD-OUT-006 | Dispatch docket printing must be supported where permitted. | Should |

---

## 8.15 Labels & Barcodes

### 8.15.1 Purpose

Generate and print operational labels for stock and locations.

### 8.15.2 Label Types

- Vehicle / VIN Label
- Pallet Label
- QR Code Label
- Container Label
- Load Label
- Location Label
- Holding Area Label
- Load Lane Label
- Custom Label

### 8.15.3 Label Data

Depending on type:

- label ID;
- barcode or QR;
- VIN or item number;
- stock number;
- description;
- customer;
- asset type;
- location;
- load;
- lane;
- staging area;
- printed by;
- print time;
- copies;
- print status.

### 8.15.4 Print Statuses

- Generated
- Pending
- Printing
- Printed
- Failed
- Reprinted
- Cancelled

### 8.15.5 Print Functions

- print single;
- print all pending;
- reprint;
- select printer;
- select label size;
- test print;
- number of copies;
- preview.

### 8.15.6 Business Rules

1. Reprint must be recorded.
2. Duplicate active tags must be prevented according to label type.
3. Failed print jobs must not mark a label printed.
4. Printer errors must show actionable detail.
5. Printed labels must link to the correct entity.

### 8.15.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LABEL-001 | Yard attendant can print authorised labels. | Must |
| YARD-LABEL-002 | Label preview must show encoded and readable data. | Must |
| YARD-LABEL-003 | Reprints must be audited. | Must |
| YARD-LABEL-004 | Printer state must be visible. | Should |
| YARD-LABEL-005 | Failed jobs must remain retryable. | Must |

---

## 8.16 Reports & Analytics

### 8.16.1 Purpose

Provide yard attendants and supervisors with operational metrics relevant to assigned depots.

### 8.16.2 Tabs

- Overview
- Inventory
- Operations
- Productivity
- Dispatch
- Compliance

### 8.16.3 KPI Examples

- total items handled;
- received inbound;
- dispatched outbound;
- staged items;
- average dwell time;
- accuracy rate.

### 8.16.4 Report Filters

- date range;
- warehouse;
- zone;
- load lane;
- item type;
- status.

### 8.16.5 Report Shortcuts

- Inventory Summary
- Stock Aging Report
- Movement History Report
- Load Lane Utilisation
- Receiving Performance
- Dispatch Performance
- Accuracy & Audit Report
- Damaged Items Report

### 8.16.6 Yard Attendant Report Scope

Default:

- view assigned depot reports;
- view personal productivity where enabled;
- export only if permitted;
- no company-wide financial reporting.

### 8.16.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-RPT-001 | Reports must respect depot and permission scope. | Must |
| YARD-RPT-002 | Metrics must use defined calculation rules. | Must |
| YARD-RPT-003 | Export must respect active filters. | Must |
| YARD-RPT-004 | Financial information must not be shown. | Must |
| YARD-RPT-005 | Report generation and export must be audited. | Must |

---

## 8.17 Report Issue

### 8.17.1 Purpose

Allow attendants to report safety, damage, defect, missing item and operational issues immediately.

### 8.17.2 Issue Categories

- Vehicle Damage
- Trailer Damage
- Container Damage
- Freight Damage
- Missing Item
- Missing Equipment
- Location Hazard
- Safety Incident
- Spill / Leak
- Seal Issue
- Label Issue
- Scanner Issue
- Printer Issue
- Other

### 8.17.3 Fields

- category;
- related entity ID;
- load or reference;
- location;
- title;
- description;
- severity;
- inspection checklist;
- photo evidence;
- document evidence;
- immediate action taken;
- person notified.

### 8.17.4 Severity

- Low
- Medium
- High
- Critical

### 8.17.5 Inspection Checklist Examples

- doors checked;
- tyres checked;
- lights checked;
- seals checked;
- brakes checked;
- item count checked;
- surrounding area made safe.

### 8.17.6 Business Rules

1. High and critical issues must alert supervisors immediately.
2. Required evidence depends on category and severity.
3. Unsafe vehicles, trailers or locations may be placed on hold automatically.
4. Missing item reports must link to the last known movement.
5. Issue deletion is not allowed for normal users.
6. Resolution requires authorised role.

### 8.17.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-ISSUE-001 | Yard attendant can report an issue. | Must |
| YARD-ISSUE-002 | Issue can be linked to item, vehicle, trailer, load or location. | Must |
| YARD-ISSUE-003 | High and critical issues must trigger escalation. | Must |
| YARD-ISSUE-004 | Evidence rules must be configurable. | Must |
| YARD-ISSUE-005 | Issue reporting must create an audit event. | Must |
| YARD-ISSUE-006 | Unsafe entities may be automatically placed on hold. | Must |

---

## 8.18 Profile and Account Security

### 8.18.1 Profile Data

- name;
- employee ID;
- email;
- phone;
- department;
- depot;
- role;
- reports to;
- joining date;
- language;
- timezone;
- date format;
- time format;
- address;
- emergency contact;
- certifications;
- skills;
- granted permissions.

### 8.18.2 Security

- password change;
- two-factor authentication;
- active sessions;
- logout other devices;
- device history;
- recent activity.

### 8.18.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-PRO-001 | User can view their profile and permissions. | Must |
| YARD-PRO-002 | User can update permitted preference fields. | Must |
| YARD-PRO-003 | User can manage password and 2FA. | Must |
| YARD-PRO-004 | User can view and revoke active sessions. | Must |
| YARD-PRO-005 | Certification expiry must be visible. | Must |

---

# 9. End-to-End Workflows

## 9.1 Start Shift and Receive Inbound Vehicle

1. Yard attendant starts work.
2. System confirms depot, shift and user eligibility.
3. Attendant opens inbound receipt.
4. Attendant scans or enters delivery reference.
5. Supplier, driver and truck details are recorded.
6. Destination location is selected.
7. Vehicle VIN and registration are scanned.
8. System checks for duplicates.
9. Condition is recorded.
10. Photos and delivery note are attached.
11. Checklist is completed.
12. Receipt is confirmed.
13. Inventory record is created.
14. Vehicle location is updated.
15. Receive movement is logged.
16. Dashboard counts update.

---

## 9.2 Search and Move Item

1. Attendant scans item or searches identifier.
2. System shows current location and status.
3. Attendant selects Move.
4. Destination location is scanned or selected.
5. System validates capacity, category and current state.
6. Attendant confirms move.
7. Item location updates.
8. Movement history is created.
9. Source and destination occupancy update.

---

## 9.3 Stage Item to Holding Area

1. Attendant opens staging module.
2. Attendant selects or scans item.
3. System shows eligible staging areas.
4. Attendant selects destination.
5. Capacity and restriction checks run.
6. Item is moved.
7. Staged timestamp is recorded.
8. Dwell-time tracking begins.
9. Load-lane readiness updates if linked.

---

## 9.4 Move Items to Load Lane

1. Attendant opens assigned load lane.
2. Attendant reviews expected load items.
3. Each item is scanned.
4. System verifies item-load-lane match.
5. Item is confirmed into lane.
6. Lane occupancy and progress update.
7. Incorrect items are blocked.
8. When all required items and checks are complete, lane can be marked ready.

---

## 9.5 Outbound Dispatch

1. Driver arrives.
2. Attendant verifies driver, truck and trailer.
3. Load and item list are checked.
4. Required documents and seals are confirmed.
5. Safety and hold checks pass.
6. Attendant marks load dispatched.
7. Item statuses update to in transit.
8. Lane occupancy clears or reduces.
9. Departure time is recorded.
10. Dispatcher receives update.
11. Movement and audit records are created.

---

## 9.6 Report Damage

1. Attendant opens Report Issue from item, vehicle or general menu.
2. Category and entity are selected.
3. Description and severity are entered.
4. Checklist is completed.
5. Evidence is uploaded.
6. System creates issue.
7. High severity triggers escalation.
8. Entity may be placed on hold.
9. Issue appears in active issue list.

---

## 9.7 Offline Movement Sync

1. Device loses network connection.
2. Portal switches to offline mode.
3. User performs permitted offline action.
4. Action is stored with local ID and idempotency key.
5. UI shows pending sync.
6. Connection returns.
7. Server validates latest state.
8. Valid action syncs once.
9. Conflict action is flagged for review.
10. User receives result.

---

# 10. Status Models

## 10.1 Item Status

- Expected
- Receiving
- Received
- In Storage
- To Move
- Moving
- Staged
- Ready
- On Hold
- Damaged
- Missing
- Dispatched
- In Transit
- Returned
- Cancelled

## 10.2 Movement Status

- Draft
- Pending
- In Progress
- Completed
- Failed
- Cancelled
- Pending Sync
- Sync Conflict

## 10.3 Location Status

- Active
- Available
- In Use
- Near Capacity
- Full
- Empty
- On Hold
- Maintenance
- Restricted
- Inactive

## 10.4 Load Lane Status

- Empty
- Assigned
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Closed
- Maintenance

## 10.5 Issue Status

- Open
- Assigned
- In Progress
- Waiting
- Resolved
- Closed
- Rejected

## 10.6 Shift Status

- Not Started
- On Shift
- Break
- Finished
- Absent
- Unavailable

---

# 11. Core Business Rules

## 11.1 Inventory Rules

1. Each trackable item must have a unique identifier.
2. Current item location is derived from the latest valid completed movement.
3. A failed movement must not change current location.
4. A pending offline movement must not be treated as final server state.
5. Duplicate active records require review.
6. Damaged or hold items cannot be dispatched.
7. Restricted goods require compatible storage.

## 11.2 Location Rules

1. Location must be active.
2. Capacity must not be exceeded.
3. Item category must be allowed.
4. User must have location access.
5. Dangerous goods and cold-storage rules must be enforced.
6. Source and destination cannot be identical unless action is a verification.

## 11.3 Dispatch Rules

1. Only ready and verified loads can be dispatched.
2. Correct driver, truck and trailer must be confirmed.
3. Mandatory documentation must exist.
4. All required items must be present.
5. Open critical issues must block dispatch.
6. Departure action must be auditable.

## 11.4 Date and Time Rules

1. Store timestamps in UTC.
2. Display in local depot timezone.
3. Exact timestamps must be retained.
4. Offline device timestamps must be stored with sync timestamps.
5. Daylight-saving changes must be supported.

---

# 12. Notifications and Alerts

## 12.1 Yard Attendant Notifications

- inbound arrival assigned;
- move task assigned;
- item ready for lane;
- lane full;
- dispatch due;
- driver arrived;
- item mismatch;
- issue update;
- supervisor message;
- sync failed;
- certification expiring;
- shift ending.

## 12.2 Supervisor Alerts

- critical issue;
- failed inbound validation;
- missing item;
- restricted location attempt;
- overdue staged item;
- lane over capacity;
- repeated failed scan;
- offline queue conflict;
- dispatch blocked.

---

# 13. Audit and Activity Logging

Events to log:

- login and logout;
- start and finish work;
- inbound draft creation;
- inbound completion;
- item creation;
- scan action;
- item move;
- transfer request;
- staging assignment;
- lane assignment;
- lane readiness change;
- outbound dispatch;
- label print;
- label reprint;
- issue creation;
- file upload;
- report view or export;
- offline sync;
- sync conflict;
- failed validation.

Each audit record must contain:

- event ID;
- tenant;
- branch;
- depot;
- module;
- action;
- actor;
- role;
- entity type;
- entity ID;
- source location;
- destination location;
- before value where appropriate;
- after value where appropriate;
- reason;
- timestamp;
- device;
- IP address where available;
- GPS where permitted;
- correlation ID;
- sync state.

---

# 14. Suggested Data Model

## 14.1 Core Entities

- Tenant
- Company
- Branch
- Depot
- User
- Role
- Permission
- Shift
- WorkSession
- Warehouse
- Yard
- Location
- LocationType
- LocationRestriction
- LocationCapacity
- InventoryItem
- VehicleInventoryItem
- FreightInventoryItem
- ContainerInventoryItem
- InboundReceipt
- InboundReceiptItem
- Movement
- MovementItem
- TransferJob
- StagingArea
- StagingAssignment
- LoadLane
- LoadLaneAssignment
- Load
- LoadItem
- DispatchRecord
- ScanEvent
- BarcodeLabel
- PrintJob
- Printer
- Issue
- IssueEvidence
- Notification
- Attachment
- AuditLog
- OfflineQueueRecord

## 14.2 Key Relationships

- Branch has many Depots.
- Depot has many Locations.
- Location belongs to a parent location.
- InventoryItem has one current authoritative location.
- InventoryItem has many Movements.
- InboundReceipt has many Receipt Items.
- StagingArea and LoadLane are specialised locations.
- Load has many expected items.
- DispatchRecord belongs to a Load.
- Issue may link to item, vehicle, trailer, load or location.
- ScanEvent may trigger a movement or verification.

---

# 15. API Requirements

Suggested endpoint groups:

- `/api/yard/shift/start`
- `/api/yard/shift/finish`
- `/api/yard/dashboard`
- `/api/inbound-receipts`
- `/api/inbound-receipts/:id`
- `/api/inbound-receipts/:id/items`
- `/api/inventory/search`
- `/api/inventory/:id`
- `/api/movements`
- `/api/movements/:id`
- `/api/staging-areas`
- `/api/staging-areas/:id/items`
- `/api/load-lanes`
- `/api/load-lanes/:id`
- `/api/load-lanes/:id/items`
- `/api/yard/vehicles`
- `/api/yard/locations`
- `/api/yard/loads`
- `/api/yard/activities`
- `/api/scans/resolve`
- `/api/scans/execute`
- `/api/yard/map`
- `/api/outbound-dispatch`
- `/api/labels`
- `/api/print-jobs`
- `/api/yard/reports`
- `/api/issues`
- `/api/offline/sync`

API requirements:

- secure authentication;
- tenant isolation;
- depot and location scope enforcement;
- RBAC;
- idempotency for scan, receive, move and dispatch actions;
- optimistic concurrency;
- request validation;
- pagination;
- filtering;
- sorting;
- standard errors;
- audit hooks;
- correlation IDs;
- file upload security;
- rate limiting;
- offline sync support.

---

# 16. Offline and Sync Requirements

### 16.1 Offline-Capable Actions

Configured actions may include:

- scan lookup from cached data;
- receive draft;
- photo capture;
- movement draft;
- issue report;
- shift note;
- label request draft.

### 16.2 Offline Queue Record

Must contain:

- local ID;
- idempotency key;
- action type;
- payload;
- user;
- depot;
- device;
- device timestamp;
- attachments;
- retry count;
- sync status.

### 16.3 Conflict Handling

If server state changed:

- do not silently overwrite;
- show conflict reason;
- preserve local evidence;
- provide supervisor review where needed;
- mark final resolution.

### 16.4 Security

- cached data encrypted;
- device session expires;
- logout clears sensitive cache;
- lost device sessions can be revoked;
- offline permissions use latest cached policy with safe limits.

---

# 17. Integrations

Potential integrations:

- handheld barcode scanners;
- mobile camera scanning;
- Zebra label printers;
- network print spooler;
- document storage;
- malware scanning;
- VIN or registration lookup;
- telematics or gate systems;
- weighbridge;
- SMS / push notifications;
- email;
- warehouse management system;
- transport management system;
- identity provider.

Integration failures must be visible, logged and safely retryable.

---

# 18. Security Requirements

## 18.1 Authentication

- secure login;
- strong password policy;
- 2FA support;
- session timeout;
- device management;
- brute-force protection;
- login audit.

## 18.2 Authorisation

- server-side RBAC;
- tenant isolation;
- depot scope;
- location scope;
- object-level checks;
- action permissions;
- export permissions.

## 18.3 Data Protection

- TLS in transit;
- encryption at rest;
- encrypted offline cache;
- protected file URLs;
- malware scanning;
- secret management;
- secure backups;
- configurable retention.

## 18.4 Application Security

- input validation;
- output encoding;
- SQL injection prevention;
- XSS prevention;
- CSRF protection where applicable;
- secure headers;
- file type validation;
- upload size limits;
- dependency scanning;
- audit monitoring.

---

# 19. Non-Functional Requirements

## 19.1 Performance

- dashboard load under 3 seconds;
- search under 2 seconds;
- scan resolve target under 1 second on good network;
- movement confirmation under 2 seconds;
- inbound save under 3 seconds excluding uploads;
- map load under 4 seconds;
- background exports for large datasets.

## 19.2 Availability

- target 99.9% monthly;
- graceful offline capability;
- health monitoring;
- operational alerting;
- backup and disaster recovery.

## 19.3 Scalability

Support:

- multiple companies;
- multiple depots;
- thousands of inventory items per depot;
- high scan volume;
- many concurrent attendants;
- large photo storage;
- high movement-event volume.

## 19.4 Responsiveness

Priority devices:

- rugged handheld scanner;
- mobile phone;
- forklift tablet;
- desktop terminal;
- standard tablet.

The portal must be touch-friendly and support large action targets.

## 19.5 Accessibility

- keyboard support;
- visible focus;
- accessible forms;
- status not shown by colour alone;
- readable contrast;
- screen-reader labels;
- clear validation messages.

---

# 20. UX Requirements

1. Scan-first actions must require minimal taps.
2. Primary action buttons must remain visible.
3. Success and failure feedback must be immediate.
4. Use large touch targets for yard devices.
5. Preserve entered data after validation errors.
6. Clearly show current depot and location.
7. Show full location path.
8. Distinguish warnings from hard blocks.
9. Show offline and pending-sync state persistently.
10. Confirm destructive or irreversible actions.
11. Use simple language for operational errors.
12. Display exact item and location before confirmation.
13. Prevent accidental duplicate submissions.
14. Support camera capture directly inside relevant forms.

---

# 21. Error Handling

Standard response example:

```json
{
  "success": false,
  "code": "LOCATION_CAPACITY_EXCEEDED",
  "message": "Zone B / Row 2 / Bay 05 has no available capacity.",
  "details": {
    "locationId": "LOC-B-2-05",
    "capacity": 5,
    "occupied": 5
  },
  "correlationId": "COR-..."
}
```

Required user-facing errors:

- item not found;
- duplicate identifier;
- wrong current location;
- destination full;
- restricted destination;
- permission denied;
- load mismatch;
- item on hold;
- missing mandatory evidence;
- printer offline;
- scan failed;
- offline sync conflict;
- stale record.

---

# 22. Analytics Definitions

## 22.1 Items Handled

Count of completed receive, move, stage or dispatch operations according to report configuration. Duplicate scans do not count.

## 22.2 Inventory Accuracy

Percentage of audited items whose actual location and quantity match the system record.

## 22.3 Dwell Time

Time between entering a staging or holding area and leaving that area.

## 22.4 Dock-to-Dispatch Time

Time from completed inbound or load-ready milestone to recorded outbound departure, according to report configuration.

## 22.5 Lane Utilisation

Occupied lane capacity divided by configured lane capacity over the selected period.

---

# 23. Release Plan

## Phase 1 — Core Yard Operations

- authentication and RBAC;
- start / finish work;
- dashboard;
- inbound receiving;
- find and search;
- move within depot;
- movement history;
- basic locations;
- issue reporting;
- profile and audit logs.

## Phase 2 — Staging and Dispatch

- staging areas;
- load lanes;
- load visibility;
- outbound dispatch;
- vehicle view;
- labels and barcode printing;
- yard map.

## Phase 3 — Scan and Offline Operations

- hardware scanner support;
- camera scanning;
- offline queue;
- conflict resolution;
- advanced printer integration;
- batch operations.

## Phase 4 — Analytics and Optimisation

- reports and analytics;
- dwell-time alerts;
- productivity metrics;
- occupancy insights;
- advanced supervisor workflows;
- automated gate and telematics integrations.

---

# 24. Out of Scope for Initial Yard Attendant Release

Unless separately approved:

- company or tenant administration;
- branch creation;
- location master configuration;
- pricing;
- invoicing;
- payroll;
- finance;
- role and permission management;
- compliance approval;
- unrestricted load creation;
- driver assignment;
- customer account management;
- issue closure approval;
- deletion of movement history.

---

# 25. QA Test Areas

## 25.1 Functional QA

- shift start and finish;
- inbound draft and completion;
- manual item entry;
- scan item entry;
- duplicate validation;
- location selection;
- movement;
- staging;
- load lane assignment;
- dispatch confirmation;
- barcode scan;
- map drill-down;
- label print;
- issue report;
- report filtering;
- profile and session controls.

## 25.2 Permission QA

Test:

- correct depot;
- wrong depot;
- correct location;
- restricted location;
- direct API access;
- hidden frontend action;
- report export;
- branch creation attempt;
- movement history deletion attempt.

## 25.3 Negative QA

- duplicate VIN;
- unknown barcode;
- full destination;
- inactive location;
- wrong-load item;
- damaged item dispatch;
- offline duplicate sync;
- stale item location;
- missing required photo;
- printer offline;
- file too large;
- scanner disconnected;
- high-severity issue without evidence.

## 25.4 Security QA

- cross-tenant access;
- cross-depot access;
- IDOR;
- privilege escalation;
- injection;
- XSS;
- malicious upload;
- session replay;
- offline cache extraction;
- unauthorised export.

## 25.5 Performance QA

- rapid scan bursts;
- large inbound CSV;
- many movement records;
- high map item count;
- concurrent movements;
- large photo uploads;
- offline queue replay.

---

# 26. UAT Scenarios

## UAT-01 — Start Work

**Given** an authorised yard attendant has an assigned shift  
**When** they start work at the correct depot  
**Then** an active work session is created.

## UAT-02 — Receive Vehicle

**Given** a valid inbound delivery  
**When** VIN, condition, location and required evidence are entered  
**Then** the vehicle is received and appears at the selected location.

## UAT-03 — Duplicate VIN

**Given** a vehicle VIN already exists as active inventory  
**When** the VIN is entered again  
**Then** final receipt is blocked or sent to configured review.

## UAT-04 — Move to Full Location

**Given** a bay is at capacity  
**When** an item is moved to it  
**Then** the move is blocked with the capacity reason.

## UAT-05 — Wrong Load Lane

**Given** an item belongs to Load A  
**When** it is scanned into Load B’s lane  
**Then** the assignment is blocked.

## UAT-06 — Dispatch with Hold Issue

**Given** a load has an unresolved critical issue  
**When** the attendant marks it dispatched  
**Then** dispatch is blocked.

## UAT-07 — Offline Movement

**Given** the device is offline  
**When** an authorised move is captured  
**Then** it is queued and synced once when connectivity returns.

## UAT-08 — Sync Conflict

**Given** an item was moved by another user before offline sync  
**When** the queued move syncs  
**Then** the system creates a conflict instead of overwriting state.

## UAT-09 — Critical Damage Report

**Given** a trailer has critical damage  
**When** the issue is submitted  
**Then** supervisors are alerted and the trailer is placed on hold according to policy.

## UAT-10 — Label Reprint

**Given** an existing label is reprinted  
**When** print succeeds  
**Then** the reprint is recorded with user, printer and time.

## UAT-11 — Depot Restriction

**Given** the attendant has Sydney Depot access only  
**When** they request Melbourne inventory via direct API  
**Then** access is denied.

## UAT-12 — Finish Work with Pending Sync

**Given** unsynced actions exist  
**When** the attendant attempts to finish work  
**Then** the system warns and applies configured completion rules.

---

# 27. Definition of Done

A feature is complete only when:

- functional requirements are implemented;
- server-side permissions exist;
- location and capacity rules are enforced;
- offline and duplicate protections are tested;
- audit events are recorded;
- loading, empty and error states exist;
- responsive behaviour is complete;
- handheld usability is verified;
- accessibility checks pass;
- automated tests pass;
- security review passes;
- QA passes;
- UAT acceptance criteria pass;
- API documentation is updated;
- user guidance is updated;
- monitoring and logs are available;
- no critical or high-severity defects remain.

---

# 28. Open Product Decisions

1. Which item types are enabled at launch?
2. Which inbound types are required?
3. Which actions must work offline?
4. What is the maximum offline queue age?
5. Which scanners and printer models will be supported?
6. Are attendants allowed to create holding areas or load lanes?
7. Can attendants mark loads dispatched, or only prepare them?
8. Which issue categories automatically create holds?
9. Which evidence is mandatory by item type and severity?
10. What are the dwell-time thresholds?
11. Which dangerous-goods standards and storage rules apply?
12. Is geofenced shift start required?
13. Are attendants allowed to export reports?
14. Which identifiers are globally unique versus depot unique?
15. What is the official location hierarchy?
16. Is gate-system integration required?
17. Is weighbridge integration required?
18. Can users transfer inventory across depots directly or only request it?
19. What is the movement correction workflow?
20. What data retention applies to scans, movements and evidence?

---

# 29. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Wrong physical location recorded | Inventory inaccuracy | Scan location and server validation |
| Duplicate offline action | Duplicate movement | Idempotency keys and sync reconciliation |
| Item placed in restricted area | Safety/compliance risk | Location-category hard rules |
| Dispatch with missing item | Customer and operational failure | Item-level dispatch checklist |
| Scanner or printer outage | Operational delay | Manual fallback and retry queue |
| Cross-depot data leakage | Security breach | Server-side scope enforcement |
| Stale map occupancy | Wrong movement decision | Refresh state and authoritative validation |
| Incomplete damage evidence | Dispute risk | Configurable mandatory evidence |
| High volume movement history | Performance degradation | Partitioning, pagination and archiving |
| Untrained user performs restricted action | Safety risk | Certification checks and RBAC |

---

# 30. Suggested Yard Attendant Permission Matrix

| Module / Action | Yard Attendant Default |
|---|---|
| Start / Finish Work | Allow |
| View Dashboard | Allow |
| Create Inbound Receipt | Allow |
| Save Inbound Draft | Allow |
| Complete Inbound | Allow |
| Search Stock | Allow |
| View Item Details | Allow |
| Move Within Depot | Allow |
| Transfer to Another Depot | Request / Conditional |
| View Staging Areas | Allow |
| Assign Item to Staging | Allow |
| Create Holding Area | Deny |
| View Load Lanes | Allow |
| Move Item to Lane | Allow |
| Create Load Lane | Deny |
| Mark Lane Ready | Conditional |
| View Vehicles | Allow |
| Add Vehicle | Deny |
| Edit Vehicle Compliance | Deny |
| View Locations | Allow |
| Create Branch / Location | Deny |
| View Loads | Allow |
| Create Load | Deny |
| Change Driver Assignment | Deny |
| View Activities | Allow |
| Export Activities | Conditional |
| Scan In / Out | Allow |
| View Yard Map | Allow |
| Mark Dispatched | Conditional |
| Print Labels | Allow |
| View Reports | Allow |
| Export Reports | Conditional |
| Report Issue | Allow |
| Resolve Issue | Deny |
| Manage Roles | Deny |
| View Finance / Payroll | Deny |

---

# 31. Sample Validation Messages

- “VIN already exists in active inventory.”
- “This location is full.”
- “You do not have access to Zone D.”
- “Dangerous goods cannot be stored in this location.”
- “The item is currently recorded at another location. Refresh before moving.”
- “This item belongs to Load LD-3987 and cannot be added to Lane 2.”
- “Required condition photos are missing.”
- “This load has an unresolved critical issue.”
- “The selected trailer is on hold.”
- “Printer is offline. The job has been queued.”
- “Barcode could not be recognised.”
- “This offline action conflicts with a newer server movement.”
- “You cannot finish work while unsynced critical actions remain.”

---

# 32. Sample Movement Audit Event

```json
{
  "eventId": "MOV-100245",
  "tenantId": "TEN-001",
  "branchId": "SYD-HO",
  "depotId": "SYD-DEPOT",
  "action": "move_completed",
  "actorId": "YA-0017",
  "actorRole": "YARD_ATTENDANT",
  "itemId": "ITEM-ABC123",
  "fromLocationId": "YARD-A-R4-B12-P01",
  "toLocationId": "LANE-1",
  "loadId": "LD-3985",
  "reason": "Move to assigned load lane",
  "deviceId": "ZEBRA-TC52-019",
  "timestampUtc": "2026-08-05T09:45:00Z",
  "syncState": "synced",
  "correlationId": "COR-..."
}
```

---

# 33. Sign-Off

| Stakeholder | Name | Status | Date |
|---|---|---|---|
| Product Owner |  | Pending |  |
| Operations Lead |  | Pending |  |
| Yard Manager |  | Pending |  |
| Warehouse Manager |  | Pending |  |
| Technical Lead |  | Pending |  |
| Security Reviewer |  | Pending |  |
| QA Lead |  | Pending |  |
| Client Representative |  | Pending |  |

---

**End of Document**
