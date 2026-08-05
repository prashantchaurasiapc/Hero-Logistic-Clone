# Hero Logistics — Warehouse Portal Product Requirements Document (PRD)

**Document Version:** 1.1  
**Product Area:** Warehouse & Yard Operations  
**Portal:** Warehouse Portal  
**Primary Roles:** Warehouse Manager, Warehouse Supervisor, Warehouse Staff, Yard Staff, Forklift Operator, Gate Inspector  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Default Timezone:** Australia/Sydney unless overridden by depot configuration

---

## Document Control & Revision History

| **Version** | **Date** | **Owner** | **Change Summary** |
|---|---|---|---|
| 1.0 | 05 Aug 2026 | Product Team | Initial baseline covering complete Warehouse & Yard operations |
| 1.1 | 05 Aug 2026 | Product & Engineering Team | Comprehensive Addition: Added Yard Gate Scan-In/Scan-Out, Zebra/Honeywell Hardware Thermal Printing, 360° Vehicle Pre-Inspection Damage Marking, HAZMAT & Cold Chain Storage Segregation, Cross-Docking Manifest Scanning, Cycle Counting & Stock Audits, and Offline PWA Local Storage without deleting any original baseline content |

---

## 1. Document Purpose

This Product Requirements Document defines the functional, operational, security and technical requirements for the **Hero Logistics Warehouse Portal**.

The portal will provide a central operational workspace for receiving stock, locating items, moving and transferring inventory, staging items, managing load lanes, preparing dispatches, tracking warehouse and yard capacity, printing labels and documents, scanning QR/barcodes, communicating with teams and reviewing warehouse performance.

The supplied screens contain sample names, dates, locations, counts, loads, vehicles, inventory values and statuses. These are illustrative and must be replaced with live tenant and depot data.

---

## 2. Product Vision

Create a real-time warehouse and yard operating system that gives every authorised worker a reliable view of **what arrived, where it is, where it must move, what is staged, what is dispatch-ready and who performed every action**.

The system must reduce inventory location errors, shorten dock-to-dispatch time, improve yard utilisation, strengthen Chain of Responsibility evidence and maintain a complete audit trail for every item movement.

---

## 3. Product Goals

1. Record inbound receipts accurately and quickly.
2. Make every stock item searchable by identifier, location, customer or load.
3. Prevent invalid, unsafe or unauthorised inventory movements.
4. Support configurable depot, warehouse, zone, row, bay, position and staging hierarchies.
5. Provide real-time staging and load-lane visibility.
6. Ensure only verified and complete loads are marked dispatch-ready.
7. Support barcode, QR and VIN-based workflows.
8. Provide reliable label and document printing.
9. Maintain immutable stock-movement history.
10. Support mobile, tablet and forklift-terminal usage.
11. Provide offline-safe receiving and scanning workflows where required.
12. Improve warehouse throughput, utilisation, accuracy and dwell time.
13. Integrate Gate Check-In and Yard Scan-In/Scan-Out for arriving transporters and trailers.
14. Direct integration with Zebra/Honeywell hardware thermal label printers via ZPL/TSPL spooling.
15. Enforce Heavy Vehicle & HAZMAT dangerous goods storage segregation rules.
16. Enable rapid linehaul Cross-Docking directly to outbound load lanes without put-away delays.
17. Provide Physical Stock Auditing & Cycle Counting workflows with discrepancy reconciliation.
18. Support offline PWA local storage with background synchronization for Wi-Fi blind spots.

---

## 4. Success Metrics

| Metric | Target |
|---|---:|
| Inventory location accuracy | 99.5% or higher |
| Inbound receiving accuracy | 99.5% or higher |
| Standard item lookup response | Under 2 seconds |
| Scan-to-item-result time | Under 1 second after decode |
| Dock-to-receipt completion | Configurable operational target |
| Stock-movement audit coverage | 100% |
| Invalid location moves blocked | 100% |
| Dispatch without mandatory checks | 0 |
| Duplicate VIN/barcode active records | 0 unless explicitly permitted |
| Portal monthly availability | 99.9% |
| Label print acknowledgement | Under 3 seconds on online printer |
| Cross-depot unauthorised access | 0 |
| Gate Scan-In throughput | Under 2 minutes per transport rig |
| Cycle count discrepancy accuracy | 99.9% reconciliation tracking |

---

## 5. User Roles

### 5.1 Warehouse Manager

May supervise depot operations, receive stock, create moves, manage load lanes and staging areas, review dispatch readiness, view reports, manage authorised staff actions and handle exceptions.

### 5.2 Warehouse Supervisor

May perform operational management within assigned warehouses, zones and shifts, with limited configuration rights.

### 5.3 Warehouse Staff

May receive, scan, locate, stage, move and dispatch items according to assigned permissions.

### 5.4 Yard Staff

May manage vehicle, container, trailer and equipment movements within yard locations.

### 5.5 Forklift Operator

May receive movement tasks, scan items, confirm moves and report failures or damage.

### 5.6 Gate Inspector

May perform Gate Scan-In/Out, driver licence verification, seal checks, and initial vehicle receiving walkarounds.

### 5.7 Read-Only Operations User

May view stock, locations, load lanes, reports and history without changing records.

---

## 6. Access and Scope Principles

1. Users are tenant-scoped and depot/warehouse-scoped.
2. Access to another depot or branch requires explicit permission.
3. The backend must enforce permissions independently of frontend visibility.
4. Sensitive commercial, employee and customer fields must be masked when not operationally required.
5. Dangerous goods and restricted storage areas require additional permissions.
6. Inventory adjustments, cancellations and movement overrides require elevated permission.
7. All exports must respect the same access rules as on-screen data.

### 6.1 Suggested Permission Keys

- `warehouse.dashboard.view`
- `warehouse.stock.find`
- `warehouse.inbound.create`
- `warehouse.inbound.edit`
- `warehouse.inbound.receive`
- `warehouse.movement.create`
- `warehouse.transfer.create`
- `warehouse.lane.view`
- `warehouse.lane.manage`
- `warehouse.dispatch.view`
- `warehouse.dispatch.confirm`
- `warehouse.staging.view`
- `warehouse.staging.manage`
- `warehouse.history.view`
- `warehouse.message.send`
- `warehouse.shift.view`
- `warehouse.map.view`
- `warehouse.report.view`
- `warehouse.report.export`
- `warehouse.label.print`
- `warehouse.document.print`
- `warehouse.scanner.use`
- `warehouse.import.execute`
- `warehouse.export.execute`
- `warehouse.batch_print.manage`
- `warehouse.profile.edit`
- `warehouse.override.location`
- `warehouse.override.dispatch`
- `warehouse.gate.scan_in`
- `warehouse.gate.scan_out`
- `warehouse.hazmat.manage`
- `warehouse.cycle_count.execute`
- `warehouse.cycle_count.approve`

---

## 7. Portal Navigation

1. Dashboard
2. Find Stock
3. Receive (Inbound)
4. Move / Transfer
5. Load Lanes
6. Dispatch Ready
7. Stage (Holding Areas)
8. Gate Operations (Scan-In / Scan-Out)
9. Cross-Docking
10. Cycle Counting & Stock Audit
11. Movement History
12. Messages
13. My Shift
14. Warehouse & Yard Map
15. Reports & Analytics
16. Tools
    - Labels & Barcodes (Zebra Spooler)
    - Print Documents
    - Hardware & QR Scanner
    - Import / Export
    - Batch Printing
    - HAZMAT Storage Register
17. Profile

### 7.1 Shared Header

- company logo;
- portal title;
- logged-in user;
- role;
- notification count;
- unread message count;
- quick search;
- keyboard shortcut `Ctrl + K` / `Cmd + K`;
- current depot/warehouse context;
- online/offline state;
- last sync time;
- profile and logout menu.

---

# 8. Functional Requirements

## 8.1 Warehouse Dashboard

### 8.1.1 Purpose

Provide a real-time operational overview of inbound activity, yard stock, move tasks, load-lane progress, dispatch-ready loads, capacity, recent movements and alerts.

### 8.1.2 KPI Cards

- Inbound — Awaiting Receive
- In Yard — Vehicles / Items
- To Move — Transfer Tasks
- Load Lanes — Loads in Progress
- Dispatch Ready
- Yard Capacity
- Available Capacity
- Optional damaged/on-hold items

Each KPI must support:

- current count;
- click-through;
- current depot filter;
- last refresh time;
- loading and error state.

### 8.1.3 Dashboard Search

Search must support:

- receipt number;
- load number;
- load lane;
- VIN;
- registration number;
- barcode;
- SKU;
- container number;
- customer reference;
- warehouse location.

### 8.1.4 Dashboard Sections

- Inbound Today
- Load Lanes Overview
- Recent Movements
- Quick Actions
- Yard Capacity
- Notifications

### 8.1.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DASH-001 | Dashboard must show real-time depot-scoped operational KPIs. | Must |
| WH-DASH-002 | KPI cards must open filtered target pages. | Should |
| WH-DASH-003 | Dashboard must display last sync and connectivity status. | Must |
| WH-DASH-004 | Dashboard search must support all core identifiers. | Must |
| WH-DASH-005 | Recent movements must show item, action, location and time. | Must |
| WH-DASH-006 | Capacity utilisation must be visible by yard or warehouse. | Must |
| WH-DASH-007 | Dashboard must support tablet and forklift-terminal layouts. | Must |

### 8.1.6 Acceptance Criteria

- A warehouse user can see current inbound, movement, staging and dispatch counts.
- Selecting a KPI opens the correct filtered page.
- Last sync and online/offline state are visible.
- Users cannot see data from unauthorised depots.

---

## 8.2 Find Stock

### 8.2.1 Purpose

Allow users to locate any authorised item, vehicle, pallet, container, freight item or equipment record.

### 8.2.2 Search Identifiers

- VIN
- Registration / Plate
- Barcode
- QR Code
- SKU
- Item Number
- Load Number
- Job Number
- Receipt Number
- Customer Reference
- Container Number
- Description

### 8.2.3 Filters

- Item Type
- Location
- Status
- Load / Job
- Customer
- Date Range
- Zone
- Row
- Bay
- Position
- Staging Area
- Load Lane
- Condition
- Depot / Warehouse

### 8.2.4 Results Columns

- item / description;
- identifiers;
- item type;
- location;
- status;
- load/job;
- customer;
- updated time;
- action.

### 8.2.5 Item Detail Panel

- item name;
- identifier;
- item type;
- status;
- current location;
- load/job;
- customer;
- received date;
- condition;
- notes;
- photos;
- documents;
- move/transfer action;
- view load;
- item history.

### 8.2.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-STOCK-001 | Users can search by all supported identifiers. | Must |
| WH-STOCK-002 | Results must display the current confirmed location. | Must |
| WH-STOCK-003 | Item details must show full movement history. | Must |
| WH-STOCK-004 | Search must support combined filters. | Must |
| WH-STOCK-005 | Barcode/QR scan must open the matching item when unique. | Must |
| WH-STOCK-006 | Multiple matches must display a selection list. | Must |
| WH-STOCK-007 | Restricted items and locations must follow permissions. | Must |

---

## 8.3 Receive (Inbound)

### 8.3.1 Purpose

Record incoming inventory, confirm condition and assign the first warehouse or yard location.

### 8.3.2 Main Actions

- Cancel
- Save as Draft
- Receive Items
- Add Item
- Import Items
- Scan Barcode / QR
- Upload CSV
- Attach Documents
- Capture Photos

### 8.3.3 Section 1 — Inbound Details

Fields:

- inbound type;
- inbound number;
- supplier/from;
- reference/delivery note;
- transport type;
- driver;
- vehicle/trailer;
- date/time;
- branch/depot;
- notes.

Suggested inbound types:

- Purchase / Supplier Delivery
- Customer Delivery
- Inter-Depot Transfer
- Return
- Driver Drop-off
- Port / Container Receipt
- Other configured type

### 8.3.4 Section 2 — Location

Configurable hierarchy:

**Depot → Warehouse/Yard → Zone → Row → Bay → Position → Staging Area**

Rules:

1. Required hierarchy levels depend on company configuration.
2. Inactive, full, restricted or incompatible locations cannot be selected.
3. Dangerous goods must use compatible authorised locations.
4. Cold-chain goods must use temperature-compatible locations.
5. Location capacity must be checked before confirmation.
6. A human-readable location preview must be displayed.

### 8.3.5 Section 3 — Item Entry

Entry methods:

- manual entry;
- barcode/QR scan;
- VIN/registration lookup;
- CSV/XLSX upload;
- select from expected inbound list.

Common item fields:

- item type;
- identifier;
- barcode;
- SKU;
- description;
- quantity;
- customer/owner;
- load/job;
- condition;
- weight;
- dimensions;
- notes;
- photos required;
- damage noted.

Vehicle fields:

- VIN;
- registration;
- make;
- model;
- year;
- colour;
- fuel type;
- operable status;
- keys received;
- damage status.

### 8.3.6 Section 4 — Items to Receive

The item list must support:

- item sequence;
- item type;
- description;
- identifier;
- destination location;
- condition;
- damage;
- edit;
- remove;
- duplicate warning;
- validation state.

### 8.3.7 Section 5 — Documents and Photos

Supported examples:

- delivery note;
- invoice;
- manifest;
- transfer docket;
- inspection document;
- item-condition photos;
- damage photos.

Requirements:

- PDF, JPG and PNG minimum support;
- configurable size limits;
- malware scanning;
- uploader and timestamp stored;
- photo metadata retained;
- damage photos mandatory when damage is noted.

### 8.3.8 Receive Checklist

- item count verified;
- condition checked;
- documents verified;
- photos captured;
- location confirmed;
- restricted handling complete where applicable.

### 8.3.9 Draft vs Receive

**Save as Draft:**

- allows incomplete data;
- does not increase available stock;
- does not create final confirmed locations;
- retains validation warnings.

**Receive Items:**

- validates required fields;
- creates receipt record;
- creates item records or links expected items;
- assigns locations;
- creates movement history;
- updates stock availability;
- triggers notifications;
- generates audit records.

### 8.3.10 Offline Support

When enabled:

- drafts and scans may be stored in an encrypted local queue;
- offline records must carry device timestamp and temporary ID;
- conflicts must be resolved on sync;
- duplicate receipt protection is mandatory;
- users must see pending, synced and failed states.

### 8.3.11 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-IN-001 | User can save an inbound receipt as draft. | Must |
| WH-IN-002 | User can receive multiple items in one transaction. | Must |
| WH-IN-003 | Location capacity and compatibility must be validated. | Must |
| WH-IN-004 | Duplicate VIN/barcode/SKU rules must be enforced. | Must |
| WH-IN-005 | Damage requires evidence according to company rules. | Must |
| WH-IN-006 | Bulk import must provide row-level validation. | Must |
| WH-IN-007 | Receiving must create immutable movement history. | Must |
| WH-IN-008 | Offline queue support must prevent duplicate finalisation. | Should |
| WH-IN-009 | Every received item must have an authorised initial location. | Must |

---

## 8.4 Move / Transfer

### 8.4.1 Purpose

Move items within the same depot or transfer items to another depot, branch or warehouse.

### 8.4.2 Movement Types

1. Move Within Depot
2. Transfer to Another Depot
3. Stage to Holding Area
4. Move to Load Lane
5. Return to Storage
6. Dispatch / Pickup
7. Quarantine / Hold
8. Damage / Inspection Move

### 8.4.3 Movement Details

- reference number;
- date/time;
- reason;
- priority;
- notes;
- source depot;
- destination depot where applicable;
- assigned staff/equipment;
- required completion time.

### 8.4.4 Item Selection

- scan item;
- search identifier;
- import from list;
- select from load;
- select from staging area;
- select from movement task.

### 8.4.5 Item Movement Fields

- item;
- type;
- from location;
- to location;
- condition;
- quantity;
- handling equipment;
- action.

### 8.4.6 Movement Validation

The system must validate:

- item exists;
- current location matches source;
- destination exists and is active;
- destination has capacity;
- item-location compatibility;
- item is not locked by another active task;
- restricted-area permission;
- dangerous goods compatibility;
- cold-chain compatibility;
- load or lane relationship;
- cross-depot permission;
- no duplicate item in the same movement.

### 8.4.7 Internal Move

On completion:

- current location changes;
- movement event is recorded;
- capacity is adjusted;
- linked load/lane is updated;
- notifications are sent when configured.

### 8.4.8 Inter-Depot Transfer

An inter-depot transfer must create a transfer job with statuses:

- Draft
- Awaiting Approval
- Approved
- In Transit
- Partially Received
- Received
- Cancelled
- Exception

Source stock should move to `In Transit` only after dispatch confirmation. Destination stock becomes available only after receipt confirmation.

### 8.4.9 Confirmation

Users must confirm item correctness before creating or completing the movement.

### 8.4.10 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-MOVE-001 | User can move one or more items within a depot. | Must |
| WH-MOVE-002 | User can create an authorised inter-depot transfer. | Must |
| WH-MOVE-003 | Source location must match current system location. | Must |
| WH-MOVE-004 | Destination compatibility and capacity must be validated. | Must |
| WH-MOVE-005 | Movement must update capacity and item location atomically. | Must |
| WH-MOVE-006 | Failed partial updates must roll back safely. | Must |
| WH-MOVE-007 | Every movement must create an audit and movement record. | Must |
| WH-MOVE-008 | Cross-depot transfers must support receiving reconciliation. | Must |

---

## 8.5 Load Lanes

### 8.5.1 Purpose

Manage staging lanes used to consolidate cargo before dispatch.

### 8.5.2 Lane Data

- lane ID;
- lane name;
- area;
- depot;
- supported load type;
- capacity;
- occupancy;
- status;
- current load;
- reference;
- truck;
- trailer;
- driver;
- estimated dispatch;
- restrictions;
- notes.

### 8.5.3 Lane Statuses

- Empty
- Available
- Reserved
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Restricted
- Maintenance
- Closed

### 8.5.4 Lane Actions

- create lane;
- view lane;
- reserve lane;
- assign load;
- move items to lane;
- remove items;
- update driver/trailer;
- reorder load priority;
- mark ready;
- place on hold;
- release lane;
- print lane report;
- print labels.

### 8.5.5 Lane Detail

- current status;
- estimated dispatch;
- staged loads;
- load reference;
- sub-reference;
- driver;
- vehicle/trailer;
- staged cargo;
- verification state;
- seal state;
- exceptions;
- print action.

### 8.5.6 Lane Rules

1. Lane capacity cannot be exceeded without authorised override.
2. Restricted cargo must use compatible lanes.
3. A lane may be reserved for one or multiple loads depending on configuration.
4. A load cannot be ready until all mandatory items are present.
5. Removed items must receive a new valid location.
6. Lane status must reflect item and load state.
7. Emptying the lane must release capacity.

### 8.5.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-LANE-001 | Users can view current lane utilisation and load assignment. | Must |
| WH-LANE-002 | Users can move authorised items into a compatible lane. | Must |
| WH-LANE-003 | Lane capacity must be enforced. | Must |
| WH-LANE-004 | Lane status must update from operational events. | Must |
| WH-LANE-005 | Ready state requires configured verification checks. | Must |
| WH-LANE-006 | Lane actions must be fully audited. | Must |

---

## 8.6 Dispatch Ready

### 8.6.1 Purpose

Show staged loads that are ready or nearly ready for driver pickup and departure.

### 8.6.2 Summary Metrics

- Ready to Dispatch
- Today’s Dispatch
- Awaiting Pickup
- Exceptions
- Hold

### 8.6.3 Filters

- date;
- status;
- load lane;
- driver;
- trailer/vehicle;
- customer;
- load type;
- depot;
- exception state.

### 8.6.4 List Columns

- load/reference;
- customer;
- truck/trailer;
- driver;
- load lane;
- ready since;
- status;
- actions.

### 8.6.5 Dispatch Readiness Checklist

Configurable checks may include:

- all required items staged;
- item count verified;
- item condition accepted;
- load documents complete;
- labels applied;
- load secured;
- photos complete;
- driver assigned;
- truck assigned;
- trailer assigned;
- compliance valid;
- pre-start checklist passed;
- dangerous goods documentation complete;
- seal number recorded;
- hold/exception cleared.

### 8.6.6 Actions

- view load;
- mark as dispatched;
- print dispatch docket;
- send to driver;
- move to lane;
- place on hold;
- resolve exception;
- export.

### 8.6.7 Mark as Dispatched

On confirmation:

- dispatch timestamp stored;
- user/device stored;
- load and item statuses updated;
- load lane occupancy updated;
- driver and dispatch system notified;
- movement history created;
- documents generated where configured;
- GPS/route workflow initiated where applicable.

### 8.6.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DIS-001 | Only staged loads may enter dispatch-ready workflow. | Must |
| WH-DIS-002 | Mandatory checks must block dispatch when incomplete. | Must |
| WH-DIS-003 | Holds must display a reason and resolver. | Must |
| WH-DIS-004 | Dispatch confirmation must update all linked items atomically. | Must |
| WH-DIS-005 | Dispatch must create movement and audit records. | Must |
| WH-DIS-006 | Dispatch docket printing must use current verified data. | Must |

---

## 8.7 Stage / Holding Areas

### 8.7.1 Purpose

Manage temporary holding areas used before moving items to load lanes or final storage.

### 8.7.2 Staging Area Data

- area ID;
- name;
- depot;
- zone;
- next load lane;
- status;
- capacity;
- occupancy;
- staged item count;
- awaiting move count;
- oldest item age;
- restrictions;
- active/inactive.

### 8.7.3 Tabs

- All Staging Areas
- By Zone
- By Load Lane
- Inactive Areas

### 8.7.4 Actions

- add holding area;
- edit area;
- activate/deactivate;
- view items;
- move items;
- assign to load lane;
- print labels;
- export;
- refresh.

### 8.7.5 Dwell-Time Rules

- configurable target dwell time;
- warning threshold;
- overdue threshold;
- alert recipients;
- escalation actions.

### 8.7.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-STAGE-001 | Users can view staging occupancy and item age. | Must |
| WH-STAGE-002 | Overdue staged items must be highlighted. | Must |
| WH-STAGE-003 | Movement to a lane must validate capacity and load mapping. | Must |
| WH-STAGE-004 | Inactive areas cannot receive new items. | Must |
| WH-STAGE-005 | Staging summary must support occupancy reporting. | Should |

---

## 8.8 Movement History

### 8.8.1 Purpose

Provide the complete audit trail of item and stock movement.

### 8.8.2 Filters

- date range;
- movement type;
- source location;
- destination location;
- item type;
- item/stock;
- load/reference;
- driver/staff;
- movement reason;
- result;
- depot;
- device.

### 8.8.3 Movement Types

- Receive
- Move Within Depot
- Transfer to Another Depot
- Stage
- Move to Load Lane
- Dispatch / Pickup
- Return / Outbound
- Quarantine
- Adjustment
- Cancelled Movement

### 8.8.4 Result States

- Draft
- Pending
- In Progress
- Completed
- Failed
- Partially Completed
- Cancelled
- Reversed

### 8.8.5 Movement Detail

- movement ID;
- date/time;
- item;
- identifiers;
- from location;
- to location;
- load/reference;
- logged by;
- role;
- device;
- reason;
- result;
- before/after state;
- failure reason;
- attachments;
- audit ID.

### 8.8.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-HIST-001 | Every confirmed stock movement must appear in history. | Must |
| WH-HIST-002 | History must be searchable and filterable. | Must |
| WH-HIST-003 | Normal users cannot delete or edit movement history. | Must |
| WH-HIST-004 | Failed and reversed movements must remain visible. | Must |
| WH-HIST-005 | Exports must include applied filters and timezone. | Must |
| WH-HIST-006 | Movement details must show actor and source device. | Must |

---

## 8.9 Messages

### 8.9.1 Purpose

Enable communication between warehouse teams, dispatch, drivers, branches, maintenance and customers where authorised.

### 8.9.2 Features

- direct conversations;
- group conversations;
- team conversations;
- announcements;
- unread counts;
- attachments;
- load/item references;
- read receipts;
- online status;
- search;
- mute;
- archive;
- templates;
- scheduled messages;
- broadcast messages.

### 8.9.3 Warehouse-Specific Message Links

Messages may link to:

- inbound receipt;
- stock item;
- movement task;
- load lane;
- dispatch load;
- safety issue;
- damaged item;
- printer failure.

### 8.9.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-MSG-001 | Users can send direct and team messages. | Must |
| WH-MSG-002 | Messages may link to operational records. | Must |
| WH-MSG-003 | Shared files must be access controlled and scanned. | Must |
| WH-MSG-004 | Urgent messages may trigger escalation. | Should |
| WH-MSG-005 | Message history must follow retention policy. | Must |

---

## 8.10 My Shift

### 8.10.1 Purpose

Show the logged-in worker’s current shift, assigned tasks, breaks, expected workload and safety obligations.

### 8.10.2 Data

- shift start/end;
- break duration;
- supervisor;
- depot;
- role;
- assigned zone;
- receiving tasks;
- movement tasks;
- load-lane tasks;
- dispatch tasks;
- safety checklist;
- shift notes;
- completed task count;
- pending task count.

### 8.10.3 Actions

- clock in/out where enabled;
- start break/end break;
- open task;
- report issue;
- message supervisor;
- complete safety checklist;
- request assistance.

### 8.10.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SHIFT-001 | User can view current and upcoming shift information. | Must |
| WH-SHIFT-002 | Assigned operational tasks must be visible. | Must |
| WH-SHIFT-003 | Shift actions must be permission and policy controlled. | Must |
| WH-SHIFT-004 | Task completion must update operational dashboards. | Must |

---

## 8.11 Safety Checklist and Defect Reporting

### 8.11.1 Purpose

Support pre-start and operational safety checks for vehicles, forklifts, trailers and warehouse equipment.

### 8.11.2 Checklist Response Types

- Yes / Pass
- No / Fail
- N/A
- Not Checked

### 8.11.3 Features

- checklist progress;
- save draft;
- submit;
- upload photo;
- notes;
- report defect;
- message dispatch/supervisor;
- history;
- sync status;
- reminders.

### 8.11.4 Safety Rules

1. Required items must be completed.
2. Failed safety items must create a defect or resolution workflow.
3. Equipment may be blocked from use when a critical defect exists.
4. Checklist submissions are immutable; corrections create a new revision.
5. Offline submissions must sync with device and server timestamps.

### 8.11.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SAFE-001 | Required safety checks must be enforced before configured work. | Must |
| WH-SAFE-002 | Failed checks must create or link a defect. | Must |
| WH-SAFE-003 | Critical defects must block affected equipment. | Must |
| WH-SAFE-004 | Photos and notes must be supported. | Must |
| WH-SAFE-005 | Checklist history must be auditable. | Must |

---

## 8.12 Warehouse & Yard Map

### 8.12.1 Purpose

Provide an interactive real-time visual representation of warehouse and yard areas.

### 8.12.2 Map Locations

- receiving area;
- quality inspection;
- staging areas;
- dispatch area;
- cold storage;
- warehouse zones;
- load lanes;
- hazmat storage;
- value storage;
- workshop;
- office;
- vehicle storage;
- container yard;
- equipment parking;
- empty trailer park;
- gates and roads.

### 8.12.3 Location States

- Available
- In Use
- Staging
- On Hold
- Full
- Empty
- Maintenance
- Restricted

### 8.12.4 Interactions

Clicking a location should show:

- location name;
- hierarchy;
- capacity;
- occupancy;
- restrictions;
- current items;
- current load;
- open tasks;
- alerts;
- move/create action where authorised.

### 8.12.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-MAP-001 | Map must display configured warehouse and yard locations. | Must |
| WH-MAP-002 | Capacity and status must use live operational data. | Must |
| WH-MAP-003 | Users can open location details from the map. | Must |
| WH-MAP-004 | Restricted areas must be clearly identified. | Must |
| WH-MAP-005 | Map must support large-screen and tablet use. | Must |

---

## 8.13 Reports & Analytics

### 8.13.1 Categories

- Overview
- Inventory
- Operations
- Productivity
- Dispatch
- Compliance

### 8.13.2 KPI Examples

- Total Items Handled
- Received
- Dispatched
- Staged
- Average Dwell Time
- Accuracy Rate
- Items Received per Hour
- Items Moved per Hour
- Items Dispatched per Hour
- Staging Time per Item
- Dock-to-Dispatch Time
- Load-Lane Utilisation
- Inventory by Zone
- Damaged Items
- Failed Movements

### 8.13.3 Report Shortcuts

- Inventory Summary
- Stock Aging
- Movement History
- Load Lane Utilisation
- Receiving Performance
- Dispatch Performance
- Accuracy & Audit
- Damaged Items
- Staging Dwell Time
- Yard Capacity
- Printer Activity
- Safety Compliance

### 8.13.4 Filters

- date range;
- warehouse;
- zone;
- load lane;
- item type;
- customer;
- load type;
- worker;
- shift;
- movement type;
- status.

### 8.13.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-RPT-001 | Users can view authorised warehouse reports. | Should |
| WH-RPT-002 | Reports must respect depot and permission scope. | Must |
| WH-RPT-003 | Exported reports must show filters and generated time. | Must |
| WH-RPT-004 | Metric definitions must be consistent across reports. | Must |
| WH-RPT-005 | Alerts must link to supporting operational data. | Should |

---

## 8.14 Labels & Barcodes

### 8.14.1 Supported Label Targets

- Vehicle
- Pallet
- Container
- Item / Freight
- Load
- Location
- Holding Area
- Load Lane
- Custom

### 8.14.2 Label Types

- VIN Label
- Pallet Label
- QR Code Label
- Container Label
- Load Label
- Location Label
- Holding Area Label
- Load Lane Label
- Custom Label

### 8.14.3 Label Workflow

1. Select or scan item/location.
2. Select label type.
3. Review preview.
4. Edit permitted layout fields.
5. Select printer.
6. Select size and format.
7. Set copies and cut option.
8. Test print or print.
9. Record print event.

### 8.14.4 Label Requirements

- unique readable identifier;
- barcode or QR validation;
- configurable templates;
- printer compatibility;
- print preview;
- reprint reason;
- recently printed history;
- batch printing support.

### 8.14.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-LBL-001 | Users can generate labels from live master data. | Must |
| WH-LBL-002 | Printed identifier must match selected record. | Must |
| WH-LBL-003 | Printer online state must be visible. | Must |
| WH-LBL-004 | Reprints must be logged. | Must |
| WH-LBL-005 | Label templates must be configurable by authorised admins. | Should |

---

## 8.15 Print Documents

### 8.15.1 Document Types

- Outbound Manifest
- Inbound Receipt
- Dispatch Docket
- Transfer Docket
- Put-Away Slip
- Pick List
- Load Lane Report
- Inventory Sheet
- Damage Report
- Safety Checklist
- Custom Template

### 8.15.2 Document Generator

Fields may include:

- template;
- order/shipment reference;
- carrier;
- destination;
- operator notes;
- item summary;
- date/time;
- depot;
- generated by.

### 8.15.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DOC-001 | Documents must use current verified system data. | Must |
| WH-DOC-002 | Users can preview before printing. | Must |
| WH-DOC-003 | Generated documents must be versioned and auditable. | Must |
| WH-DOC-004 | Templates and layouts require admin permission to edit. | Must |
| WH-DOC-005 | PDF download may be supported according to permission. | Should |

---

## 8.16 QR / Barcode Scanner

### 8.16.1 Purpose

Decode item and location identifiers from mobile devices, tablets, forklift terminals or dedicated scanners.

### 8.16.2 Scan Results

- identifier;
- record type;
- stock state;
- item name/category;
- zone/bin;
- quantity;
- weight;
- dimensions;
- linked load;
- audit trail;
- available actions.

### 8.16.3 Scan Actions

- view item;
- receive item;
- relocate stock;
- move to lane;
- verify load;
- print label;
- view history;
- report exception.

### 8.16.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SCAN-001 | Scanner must support configured barcode and QR formats. | Must |
| WH-SCAN-002 | Invalid or unknown codes must show a clear error. | Must |
| WH-SCAN-003 | Duplicate matching records must require selection. | Must |
| WH-SCAN-004 | Scan actions must respect permissions. | Must |
| WH-SCAN-005 | Offline scans may queue where offline mode is enabled. | Should |

---

## 8.17 Import / Export

### 8.17.1 Import Targets

- Stock Inventory
- New Item Catalogue
- Inbound Items
- Transfer Instructions
- Location Master
- Load-Lane Assignments
- Barcode Master

### 8.17.2 Import Workflow

1. Select target schema.
2. Download template.
3. Upload CSV/XLSX.
4. Parse file.
5. Show validation preview.
6. Correct mapping if allowed.
7. Confirm import.
8. Show success/failure summary.
9. Download rejected rows.

### 8.17.3 Export Datasets

- Full Stock Catalogue
- Yard & Dock Occupancy
- Outbound Load-Lane Logs
- Safety Certification Records
- Movement History
- Inbound Receipts
- Dispatch Records
- Staging Inventory

### 8.17.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-IMP-001 | Import must provide schema validation. | Must |
| WH-IMP-002 | Invalid rows must not silently import. | Must |
| WH-IMP-003 | Large imports must run safely with progress state. | Must |
| WH-IMP-004 | Import and export events must be audited. | Must |
| WH-IMP-005 | Exports must respect active filters and scope. | Must |

---

## 8.18 Batch Printing and Printer Management

### 8.18.1 Print Queue

- job ID;
- job name;
- target printer;
- pages/labels;
- queue status;
- progress;
- action.

### 8.18.2 Queue Statuses

- Draft
- Queued
- Printing
- Paused
- Completed
- Failed
- Cancelled

### 8.18.3 Printer Data

- printer name;
- type;
- IP/connection;
- location;
- online state;
- queue length;
- supported sizes;
- last successful print;
- error.

### 8.18.4 Actions

- pause spooler;
- resume spooler;
- clear completed;
- retry failed;
- cancel job;
- reassign printer;
- test print.

### 8.18.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-PRINT-001 | Users can view print queue status. | Must |
| WH-PRINT-002 | Failed jobs must show actionable errors. | Must |
| WH-PRINT-003 | Retrying a job must not create uncontrolled duplicates. | Must |
| WH-PRINT-004 | Print events and reprints must be logged. | Must |
| WH-PRINT-005 | Printer access must be limited by depot/network configuration. | Must |

---

## 8.19 Profile

### 8.19.1 Profile Data

- employee identity;
- role;
- shift state;
- employee ID;
- contact details;
- department;
- depot;
- reporting manager;
- joining date;
- preferences;
- address;
- emergency contact;
- documents and certifications;
- skills and competencies;
- permissions;
- account security.

### 8.19.2 Security

- change password;
- two-factor authentication;
- active sessions;
- revoke session;
- logout all devices.

### 8.19.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-PRO-001 | User can view their profile and permissions. | Must |
| WH-PRO-002 | User can edit permitted contact and preference fields. | Must |
| WH-PRO-003 | Certification expiry must be visible. | Must |
| WH-PRO-004 | Active sessions can be viewed and revoked. | Must |
| WH-PRO-005 | Permission changes are read-only in the profile. | Must |

---

## 8.20 Gate Check-In & Yard Scan-In / Scan-Out

### 8.20.1 Purpose

Manage entry and exit of transport trucks, trailers, and delivery drivers at depot security gates.

### 8.20.2 Gate Workflow

1. Driver arrives at gate; Gate Inspector scans driver licence or barcode.
2. Verifies expected load reference or delivery booking.
3. Inspects security seal numbers on container/trailer.
4. Assigns initial Yard Staging Bay or Unloading Ramp.
5. Records gate check-in timestamp and updates yard occupancy.

---

## 8.21 Specialized Vehicle Inspection & 360° Scratch/Dent Marking

### 8.21.1 Purpose

Provide a visual damage marking interface for automotive receiving staff when inspecting incoming car carriers or trade-ins.

### 8.21.2 Inspection Fields

- VIN & Registration validation.
- Key presence (e.g. 2 Keys + 1 Remote).
- Fuel level (% or fraction) & Battery voltage state.
- Operable vs Non-Operable state (e.g. winch required).
- Interactive 360-degree vehicle body diagram allowing click-to-mark scratches, dents, hail damage, or missing trims with mandatory photo upload.

---

## 8.22 HAZMAT & Cold Chain Storage Management

### 8.22.1 Dangerous Goods (HAZMAT) Rules

- Segregates HAZMAT Classes 1–9 according to Australian Dangerous Goods Code.
- Verifies SDS (Safety Data Sheet) link and Hazchem placard presence.
- Prevents assignment of HAZMAT items to standard racking or unauthorized load lanes.

### 8.22.2 Cold Chain Monitoring

- Real-time °C temperature logging for cold storage zones.
- Min/Max temperature breach alerts with automatic stock quarantine trigger.
- Enforces FIFO (First-In, First-Out) stock rotation based on batch expiry dates.

---

## 8.23 Cross-Docking & Outbound Manifest Scanning

### 8.23.1 Purpose

Rapidly transfer incoming linehaul cargo directly to outbound distribution load lanes without put-away into warehouse racking storage.

### 8.23.2 Manifest Scanning

- Forklift operators scan incoming pallet barcodes directly against the assigned Outbound Load Lane manifest.
- Real-time audio-haptic feedback confirms valid match.
- Missing or misplaced items trigger immediate alert on the warehouse supervisor console.

---

## 8.24 Hardware Scanner & Audio-Haptic Feedback (Zebra/Honeywell SDK)

### 8.24.1 Hardware Integration

- Native integration with Zebra DataWedge and Honeywell SwiftDecoder SDKs for rugged Android PDA scanners.
- Continuous rapid batch scanning mode capable of decoding 50+ 2D barcodes per minute.
- Distinct audio-haptic feedback: High-pitch chime + green flash for valid scan; Low-pitch double buzzer + red flash for invalid scan or wrong bin.

---

## 8.25 Physical Stock Audit & Cycle Counting

### 8.25.1 Purpose

Perform continuous stock verification without shutting down warehouse operations.

### 8.25.2 Audit Workflow

1. Supervisor generates a blind cycle count task for specific zones or high-value SKU categories.
2. Warehouse staff scans items in assigned bin locations without seeing expected system counts.
3. System compares physical count vs system inventory.
4. Variances exceeding threshold AUD values require supervisor sign-off before inventory adjustment.

---

# 9. End-to-End Workflows

## 9.1 Inbound Receiving Workflow

1. User opens Receive.
2. Selects inbound type and supplier/source.
3. Enters reference and transport details.
4. Selects receiving depot and location.
5. Scans, imports or manually adds items.
6. Records condition and damage.
7. Attaches documents and photos.
8. Completes checklist.
9. Saves draft or confirms receipt.
10. System creates receipt, item/location records and movement history.
11. Dashboard and stock search update.
12. Relevant teams are notified.

## 9.2 Move Within Depot

1. User selects movement type.
2. Selects or scans items.
3. System confirms current locations.
4. User selects destination locations.
5. System validates capacity and compatibility.
6. User confirms movement.
7. System updates item locations and location capacity atomically.
8. Movement history and audit are created.

## 9.3 Inter-Depot Transfer

1. Source user creates transfer.
2. Items are selected and destination depot assigned.
3. Approval occurs if required.
4. Items move to dispatch staging.
5. Source confirms dispatch.
6. Items become In Transit.
7. Destination receives transfer.
8. Destination reconciles expected and actual items.
9. Exceptions are recorded.
10. Transfer closes after complete receipt.

## 9.4 Stage to Load Lane

1. User opens staged item or load.
2. Selects assigned load lane.
3. System validates lane and capacity.
4. User scans and moves items.
5. Lane progress updates.
6. Missing, extra or damaged item exceptions are shown.
7. When all checks pass, lane/load may be marked ready.

## 9.5 Dispatch Workflow

1. Load appears in Dispatch Ready.
2. System verifies checklist.
3. Warehouse user confirms item count, documents and securement.
4. Driver arrival is recorded.
5. Required safety checklist is verified.
6. User marks load as dispatched.
7. Item and load statuses change.
8. Lane capacity is released.
9. Dispatch documents and movement history are generated.
10. Driver and dispatcher are notified.

## 9.6 Damage Workflow

1. Damage is identified during receiving or movement.
2. User marks damage and adds photos/notes.
3. System creates exception/defect record.
4. Item may move to hold or inspection location.
5. Supervisor reviews.
6. Disposition is recorded: accepted, repaired, returned, quarantined or written off.
7. History remains linked to item and movement.

## 9.7 Gate Scan-In to Load Lane Workflow

1. Transport rig arrives; Gate inspector scans driver QR/licence.
2. Assigns Unloading Bay 4; Dock worker receives freight into Staging Area.
3. Items scanned into Load Lane A2; Driver signs outbound manifest.
4. Gate Scan-Out confirms trailer departure.

## 9.8 Cross-Docking Transfer Workflow

1. Linehaul vehicle arrives at Inbound Bay 1.
2. Operator scans pallet barcode; system flags item for immediate Cross-Dock to Lane C3.
3. Item moved directly to Lane C3 without put-away.
4. Outbound manifest updates automatically.

## 9.9 Cycle Count Audit Reconciliation Workflow

1. Supervisor schedules blind count for Zone B (Racks 1–5).
2. Staff scans all items in Zone B; System flags 2 missing items.
3. Supervisor reviews discrepancy, inspects staging area, and approves stock variance.
4. Inventory balances and audit logs update atomically.

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
- Quarantined
- In Transit
- Dispatched
- Returned
- Cancelled
- Archived

## 10.2 Receipt Status

- Draft
- Pending
- Receiving
- Partially Received
- Received
- Exception
- Cancelled

## 10.3 Movement Status

- Draft
- Pending
- Assigned
- In Progress
- Partially Completed
- Completed
- Failed
- Cancelled
- Reversed

## 10.4 Lane Status

- Empty
- Available
- Reserved
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Restricted
- Maintenance
- Closed

## 10.5 Dispatch Status

- Staging
- Verification Required
- Ready
- Awaiting Pickup
- Hold
- Dispatched
- Exception
- Cancelled

---

# 11. Core Business Rules

1. An item must have only one active current location.
2. A confirmed move must update item and location capacity in one transaction.
3. A destination cannot exceed capacity without authorised override.
4. Restricted goods must use compatible locations.
5. Dangerous goods cannot be staged in standard lanes unless explicitly allowed.
6. Damaged or quarantined items cannot become dispatch-ready without resolution.
7. Required documents and checks must block dispatch when incomplete.
8. Duplicate VINs, barcodes and container identifiers must follow company rules.
9. Confirmed history cannot be deleted by operational users.
10. Cross-depot actions require source and destination permissions.
11. Reversal must create a new movement; it must not erase the original movement.
12. Every manual override requires user, permission, reason and timestamp.
13. All timestamps are stored in UTC and displayed in local depot time.
14. Printed documents and labels must use the latest confirmed record version.

---

# 12. Notifications and Alerts

## 12.1 Operational Alerts

- inbound arrival due;
- receiving overdue;
- item location conflict;
- duplicate item detected;
- movement task assigned;
- movement failed;
- staging dwell exceeded;
- load lane near capacity;
- load lane full;
- dispatch pickup due;
- driver not arrived;
- dispatch checklist incomplete;
- damaged item;
- restricted-location violation;
- printer offline;
- import failure;
- sync failure;
- safety checklist failed;
- gate scan-in queue delay;
- cold storage min/max temperature breach;
- cycle count discrepancy threshold breached.

## 12.2 Channels

- in-app;
- push;
- email;
- SMS;
- team message;
- supervisor escalation.

---

# 13. Audit Requirements

Audit events must include:

- login/logout;
- receipt create/update/finalise;
- item create/update;
- condition/damage change;
- movement create/start/complete/fail/cancel/reverse;
- location override;
- load-lane assignment;
- readiness confirmation;
- dispatch confirmation;
- safety checklist submission;
- label print/reprint;
- document generation/print;
- import/export;
- message send;
- profile/security change;
- gate check-in/check-out;
- hazmat override;
- cycle count variance approval.

Each event must store event ID, tenant, depot, actor ID, role, entity, action, before/after values, reason, timestamp, IP/device, correlation ID.

---

# 14. Suggested Data Model

## 14.1 Core Entities

- Tenant
- Company
- Branch
- Depot
- Warehouse
- WarehouseLocation
- Zone
- Row
- Bay
- Position
- StagingArea
- LoadLane
- User
- Role
- Permission
- Shift
- Item
- ItemIdentifier
- ItemCondition
- ItemPhoto
- ItemDocument
- Receipt
- ReceiptItem
- Movement
- MovementItem
- Transfer
- TransferItem
- Load
- LoadItem
- DispatchReadiness
- DispatchChecklist
- SafetyChecklist
- SafetyChecklistItem
- Defect
- Message
- Conversation
- LabelTemplate
- PrintJob
- Printer
- ImportJob
- ExportJob
- Notification
- AuditLog
- GateEntry
- VehicleInspection
- HazmatDeclaration
- ColdChainLog
- CycleCountAudit
- PrintSpoolJob

---

# 15. API Requirements

Suggested API groups:

- `/api/warehouse/dashboard`
- `/api/warehouse/items`
- `/api/warehouse/receipts`
- `/api/warehouse/movements`
- `/api/warehouse/transfers`
- `/api/warehouse/load-lanes`
- `/api/warehouse/staging-areas`
- `/api/warehouse/dispatch-ready`
- `/api/warehouse/locations`
- `/api/warehouse/map`
- `/api/warehouse/scanner/decode`
- `/api/warehouse/labels`
- `/api/warehouse/documents`
- `/api/warehouse/print-jobs`
- `/api/warehouse/gate`
- `/api/warehouse/hazmat`
- `/api/warehouse/cross-dock`
- `/api/warehouse/cycle-counts`

---

# 16. Integrations

Potential integrations: transport management system, dispatch portal, driver app, barcode/QR hardware scanners (Zebra/Honeywell SDK), local thermal printers (Zebra ZPL), network laser printers, document storage, virus scanning, VIN/registration lookup, GPS/telematics.

---

# 17. Security & Offline Requirements

## 17.1 Authentication & Authorisation
MFA/2FA support, session expiration, active session revocation. Role and depot data isolation, field-level restrictions for commercial values.

## 17.2 Offline PWA Storage & Background Sync Queue
Service Worker and IndexedDB cache item catalogs, bin locations, and barcode patterns locally. Receiving scans and stock moves queue offline and auto-sync upon reconnecting with server-wins conflict resolution.

---

# 18. Non-Functional Requirements

## 18.1 Performance & Device Support
Search <2s, scan decode <1s, movement confirmation <2s, dashboard <3s. Native support for rugged Android tablets, forklift terminals, and mobile scanner browsers.

---

# 19. UX Requirements

Scan-first workflows, tablet-optimised touch targets, prominent location breadcrumbs, audio-haptic feedback for valid/invalid scans, camera capture integration.

---

# 20. Error Handling & Metric Definitions

Clear error messages with actionable resolution paths. Metrics: Inventory Accuracy (>99.5%), Dwell Time, Dock-to-Dispatch Time, Lane Utilisation, Receiving Accuracy.

---

# 21. Release Plan

- **Phase 1:** Core Warehouse Operations (Receiving, Put-away, Stock Search, Basic Lanes).
- **Phase 2:** Scanning & Printing (Zebra ZPL spooler, hardware scanner integration, VIN lookup).
- **Phase 3:** Yard & Gate Operations (Gate Check-in, Load Lane Staging, 360° Car Pre-Inspection).
- **Phase 4:** Advanced Auditing & Cross-Docking (Cycle counting, Cross-dock manifest scan, Offline PWA background sync).

---

# 22. QA Test Areas & UAT Scenarios

## UAT-01 — Receive Vehicle
**Given** an authorised user **When** valid vehicle & location data entered **Then** vehicle received & located in stock.

## UAT-02 — Block Duplicate VIN
**Given** active item uses VIN **When** user receives again **Then** system blocks duplicate.

## UAT-03 — Location Capacity
**Given** bay capacity is 2 **When** 3 items moved **Then** move blocked.

## UAT-04 — Move by Scan
**Given** item in Zone A **When** item and Zone B bin scanned **Then** locations and capacity update.

## UAT-05 — Dispatch Hold
**Given** missing item/document **When** dispatch attempted **Then** system blocks dispatch.

## UAT-06 — HAZMAT Storage Violation
**Given** a Class 3 Flammable Liquid item **When** user moves item to standard non-HAZMAT bay **Then** system blocks move.

## UAT-07 — Zebra Thermal Label Print
**Given** Zebra ZD421 printer online **When** pallet barcode label printed **Then** ZPL payload spools within 3 seconds.

## UAT-08 — Cross-Dock Manifest Scan
**Given** linehaul cargo at Inbound Dock 1 **When** scanned for Outbound Lane C3 **Then** cargo transfers directly without put-away.

## UAT-09 — Offline Receiving Sync
**Given** device offline **When** receiving saved **Then** item queues in IndexedDB and syncs cleanly upon network reconnect.

## UAT-10 — Cycle Count Discrepancy Approval
**Given** blind cycle count discovers 1 missing SKU **When** supervisor approves variance **Then** stock balance updates with audit trail.

---

# 23. Definition of Done & Sign-Off

A feature is complete when requirements are implemented, permissions enforced, business rules active, audit logs recorded, and sign-off recorded by Product, Warehouse Operations, and Technical Leads.

---

| Stakeholder | Name | Status | Date |
|---|---|---|---|
| Product Owner |  | Pending |  |
| Warehouse Operations Lead |  | Pending |  |
| Yard Operations Lead |  | Pending |  |
| Technical Lead |  | Pending |  |
| QA Lead |  | Pending |  |

---

**End of Document — Hero Logistics Warehouse Portal PRD v1.1**
