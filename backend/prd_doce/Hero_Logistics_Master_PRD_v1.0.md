# Hero Logistics — Enterprise Platform Master Product Requirements Document (Master PRD)

**Document Version:** 1.0 (Master PRD)  
**Product Title:** Hero Logistics Transport, Fleet, Warehouse, Yard & Financial Management Platform  
**Portals Covered:**  
1. Company Admin Portal  
2. Dispatcher Portal  
3. Warehouse Portal  
4. Yard Attendant Portal  
5. Accounts & Financial Operations Portal  
**Prepared Date:** 05 August 2026  
**Document Status:** Complete Master Specification — Ready for Architecture, Product, Design, Engineering, QA and UAT  
**Default Currency:** AUD ($)  
**Default Timezone:** Australia/Sydney (AEST/AEDT), configurable by depot/branch  

---

# Document Control & Master System Architecture

| **Item** | **Details** |
|---|---|
| **Product Owner** | Hero Logistics / Authorised Company Representative |
| **Primary Portals** | Company Admin, Dispatcher Command Centre, Warehouse Operations, Yard Attendant, Accounts & Finance |
| **Supporting Portals** | Driver Mobile Portal, Customer Portal |
| **Core Capabilities** | AI Order Parsing, Real-Time Dispatching, Multi-Deck Car Carrying, Live GPS Telematics, OBD-II DTC Fault Alerts, HVNL EWD Fatigue Compliance, Yard Staging Lanes (A1–E4), Zebra Thermal Print Spooling, HAZMAT Storage, Cross-Docking, Cycle Counting, Demurrage Logging, Invoicing, Stripe Payments, Payroll, Contractor Pay (RCTI), P&L Analytics, and Offline PWA Sync |
| **Target Architecture** | Multi-tenant, multi-branch, role-scoped cloud web & mobile application |

---

# Table of Contents

1. Executive Summary & Master Platform Vision  
2. System-Wide Objectives & Success Metrics  
3. User Roles & Unified Cross-Portal Permission Matrix  
4. Global Information Architecture & Shared UI Design System  
5. System-Wide Shared Controls (Command Palette `Ctrl+K`, Search, Filters, Notifications, Audit)  
6. **MODULE 1: Company Admin Portal** (Master Control, Rates, Users, Branches, Master Data)  
7. **MODULE 2: Dispatcher Portal** (Command Centre, AI Inbox, Multi-Deck Car Carrying, EWD Fatigue, SOS Desk, Telematics)  
8. **MODULE 3: Warehouse Portal** (Receiving, Bin Locations, Zebra Label Spooling, Cross-Docking, Cycle Counting)  
9. **MODULE 4: Yard Attendant Portal** (Gate Scan-In/Out, Lane Staging A1–E4, Rugged PDA Scan, Pre-Start Safety)  
10. **MODULE 5: Accounts & Financial Operations Portal** (Invoices, Stripe Payments, Payroll, Contractor Pay, P&L, GST)  
11. End-to-End Master Cross-Portal Workflows  
12. Unified Business Rules & Validation Engine  
13. Master Entity Relationship & Data Model (Database Schema for All 5 Portals)  
14. System Integrations & Technical API Architecture  
15. Security, Multi-Factor Auth, Privacy & Immutable Audit Requirements  
16. Non-Functional Requirements (Performance, Latency, Scalability, Device Support)  
17. Master Analytics, Reporting & Operational Success Metrics  
18. Platform Release Scope & Phased Implementation Plan  
19. Quality Assurance, UAT Scenarios & Definition of Done  
20. Risks, Mitigations & Stakeholder Sign-Off  

---

# 1. Executive Summary & Master Platform Vision

The **Hero Logistics Enterprise Platform** is a unified, end-to-end transport execution, fleet telematics, warehouse inventory, yard staging, and financial accounting operating system. It connects dispatchers, drivers, warehouse pickers, yard attendants, fleet mechanics, accountants, sales managers, and company executives into a single real-time source of operational and financial truth.

By integrating the 5 core portals (**Company Admin, Dispatcher, Warehouse, Yard Attendant, and Accounts**), Hero Logistics eliminates operational silos, prevents duplicate data entry, enforces compliance with Heavy Vehicle National Law (HVNL) and Chain of Responsibility (CoR), accelerates dock-to-dispatch turnaround, automates customer billing, and provides complete auditability from order placement to cash collection.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 HERO LOGISTICS MASTER PLATFORM                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼                    ▼
┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐      ┌───────────┐
│ COMPANY   │      │ DISPATCH  │      │ WAREHOUSE │      │   YARD    │      │ ACCOUNTS  │
│  ADMIN    │      │ COMMAND   │      │  PORTAL   │      │ ATTENDANT │      │ & FINANCE │
└───────────┘      └───────────┘      └───────────┘      └───────────┘      └───────────┘
```

---

# 2. System-Wide Objectives & Success Metrics

## 2.1 Strategic Business Objectives

- **Automate Order Ingestion:** Parse incoming customer booking PDFs, emails, rate confirmations, and EDI manifests using AI to create valid draft loads in seconds.
- **Real-Time Fleet & Dispatch Visibility:** Eliminate double-booking, schedule conflicts, and HVNL fatigue compliance breaches while maintaining >98% On-Time Pickup and Delivery (OTPD).
- **Warehouse & Yard Precision:** Achieve >99.5% inventory location accuracy, zero invalid bin movements, and rapid cross-docking without put-away delays.
- **Financial Speed & Accuracy:** Automate customer invoicing, accessorial charge logging (demurrage/detention), contractor RCTI self-billing, employee payroll processing, and Stripe payment reconciliation.
- **Complete Chain of Responsibility (CoR):** Immutable EXIF-stamped photo evidence, digital signatures, GPS coordinates, and audit logs for every load movement.

## 2.2 Key Performance Indicators (KPI Targets)

| Metric | System Target | Primary Module |
|---|---:|---|
| **AI Order Parsing Accuracy** | >92% field accuracy | AI Load Inbox (Dispatcher) |
| **Order-to-Dispatch Time** | Under 15 minutes | Dispatcher Portal |
| **On-Time Pickup & Delivery (OTPD)** | >98% | Dispatcher & Fleet |
| **HVNL EWD Fatigue Breaches** | ZERO legal breaches | Driver & Dispatcher |
| **Inventory Location Accuracy** | >99.5% | Warehouse & Yard |
| **Scan Decode & Match Latency** | Under 1.0 second | Yard & Warehouse Scanners |
| **Gate Check-In Throughput** | Under 2 minutes per rig | Yard Attendant Portal |
| **Demurrage Evidence Logging** | 100% timestamp & GPS backed | Dispatcher & Accounts |
| **Invoice Approval Error Rate** | Under 0.5% | Accounts Portal |
| **Duplicate Payment / Invoice Rate** | 0 | Accounts Portal |
| **System Uptime Availability** | 99.95% | Core Platform Architecture |

---

# 3. User Roles & Unified Cross-Portal Permission Matrix

The platform implements strict Role-Based Access Control (RBAC) and Multi-Tenant Branch Scoping across all 5 portals:

## 3.1 Primary Personas

1. **Company Admin / Super Admin:** Master platform controller; manages company settings, branches, rate cards, user permissions, and enterprise analytics.
2. **Dispatcher / Senior Dispatcher:** Fleet allocator; manages AI Load Inbox, route building, driver/asset assignment, live GPS tracking, telematics fault alerts, and Emergency SOS.
3. **Warehouse Manager / Staff:** Receives inbound stock, manages bin locations, executes transfers, operates Zebra label spoolers, and verifies dispatch readiness.
4. **Yard Attendant / Gate Inspector:** Operates handheld scanners for Gate Check-In/Out, stages trailers into Load Lanes (Lanes A1–E4), and records vehicle pre-inspection damage.
5. **Accounts Manager / Payroll Officer:** Manages invoice review, sent billing, Stripe payments, contractor pay (RCTI), employee pay runs, GST/tax compliance, and P&L reports.
6. **Employed Driver / Subcontractor (Supporting Role):** Receives load manifests via Driver App or web tracking links, records pre-trip safety, streams GPS, and uploads POD proof.

## 3.2 Master Cross-Portal Capability Matrix

| Capability / Action | Company Admin | Dispatcher | Warehouse | Yard Attendant | Accounts |
|---|:---:|:---:|:---:|:---:|:---:|
| **Manage Tenant & Branch Settings** | **Full** | View | Read-Only | Read-Only | Read-Only |
| **AI Load Inbox Approval** | **Full** | **Full** | Read-Only | No | Read-Only |
| **Create / Edit / Activate Load** | **Full** | **Full** | Read-Only | Read-Only | Read-Only |
| **Multi-Deck Car Carrying Allocation** | **Full** | **Full** | Read-Only | Read-Only | No |
| **Drag-and-Drop Planning Board** | **Full** | **Full** | Read-Only | Read-Only | No |
| **Live GPS Map & Emergency SOS Desk** | **Full** | **Full** | View | View | No |
| **Inbound Stock Receiving & Bin Moves** | View | View | **Full** | **Full** | No |
| **Gate Scan-In & Yard Lane Staging (A1–E4)** | View | View | **Full** | **Full** | No |
| **Zebra Thermal Label Spooler** | View | View | **Full** | **Full** | No |
| **Demurrage & Accessorial Logging** | View | **Full** | Read-Only | Read-Only | **Full (Approve)** |
| **Customer Invoicing & Stripe Payments** | View | Read-Only | No | No | **Full** |
| **Employee Payroll & Contractor RCTI** | View | No | No | No | **Full** |
| **Master Rate Cards & Pricing Tiers** | **Full** | Masked | No | No | **Full** |
| **View Audit Logs & System Exports** | **Full** | Scoped | Scoped | Scoped | Scoped |

---

# 4. Global Information Architecture & Shared UI Design System

All 5 portals follow a unified, modern web design system built with rich aesthetics, glassmorphism, HSL dark/light modes, smooth CSS transitions, and keyboard-first accessibility:

- **Consistent Header & Navigation:** Shared header across all portals containing Company Logo, Active Portal Title, Live Connection Status Indicator, Notifications Counter, Unread Messages Badge, Multi-Branch Selector, and User Profile Avatar.
- **Command Palette (`Ctrl+K` / `Cmd+K`):** Global modal palette allowing users to search any load reference (`LD-10583`), vehicle VIN, customer name, barcode, invoice ID, or navigation route instantly.
- **Responsive Workspace Layouts:** Optimized for 1366×768 desktop displays (Dispatch & Admin), rugged Android tablets (Warehouse & Yard), and mobile browsers.

---

# 5. System-Wide Shared Controls

## 5.1 Universal Command Palette Shortcuts

| **Hotkey** | **Action Description** | **Target Portal** |
|---|---|---|
| `Ctrl+K` / `Cmd+K` | Global System Search & Command Palette | All Portals |
| `Alt+N` | Open Quick Create Form (Load / Receipt / Invoice) | Dispatcher / Warehouse / Accounts |
| `Alt+I` | Open AI Load Inbox Queue | Dispatcher |
| `Alt+P` | Switch to Planning Board Workspace | Dispatcher |
| `Alt+M` | Open Live GPS Map & Fleet Monitor | Dispatcher / Admin |
| `Alt+S` | Emergency SOS Incident Desk | Dispatcher / Admin |
| `Alt+G` | Gate Scan-In Checkpoint | Yard Attendant / Warehouse |
| `Alt+L` | Open Load Lane Staging (Lanes A1–E4) | Warehouse / Yard |
| `Alt+B` | Batch Label Print Spooler | Warehouse / Yard |
| `Alt+R` | Open Reports & Financial Analytics | All Portals |
| `Esc` | Close Active Modal / Drawer | All Portals |

---

# 6. MODULE 1: Company Admin Portal

## 6.1 Purpose & Master Responsibilities

The **Company Admin Portal** is the central governance workspace used by executive managers and system administrators to manage overall company operations, tenant configurations, branch depots, user roles, rate cards, vehicle fleets, and compliance rules.

## 6.2 Core Modules & Features

1. **Executive Command Dashboard:** Company-wide KPI summary (Total Revenue, Active Loads, Fleet Utilisation %, Total Inventory Value, Active Compliance Warnings).
2. **Branch & Depot Governance:** Configures operating depots (Sydney, Melbourne, Brisbane, Perth), depot time zones, local warehouse bin structures, and branch permissions.
3. **Driver & Vehicle Master Directory:** Master database for all prime movers, trailers, rigid trucks, and company/contractor drivers. Manages licence classes, medical certificates, and maintenance schedules.
4. **Master Rate Cards & Pricing Tiers:** Defines customer contract pricing, distance-based rate slabs ($/km), hourly waiting rates, vehicle type surcharges, and Fuel Surcharge (FSC) matrices.
5. **System Settings & Role-Based Permissions Administration:** Defines custom roles, permission keys, API integrations, and multi-factor authentication policies.

---

# 7. MODULE 2: Dispatcher Portal

## 7.1 Purpose & Command Centre Workspace

The **Dispatcher Portal** is the real-time operational command center used by dispatchers and fleet allocators to convert customer bookings into planned loads, assign drivers and assets, monitor live GPS telematics, enforce legal fatigue limits, and manage operational exceptions.

## 7.2 AI Load Inbox & Intelligent Order Ingestion

- **Multi-Channel Ingestion:** Receives customer booking PDFs, rate confirmations, EDI messages (204/211), and emails.
- **AI Entity Extraction Engine:** Automatically parses Customer Name, Origin/Destination Addresses, Dates, Item Specifications, and Vehicle VINs.
- **Confidence Highlighting:** High-confidence parsed fields (>90%) auto-fill in green; low-confidence fields highlight for manual dispatcher review.
- **1-Click Conversion:** Dispatcher clicks **"Approve & Create Load"**, generating a `Planned` load in the system.

```
Customer Booking PDF/Email ──► AI Extraction Engine ──► AI Inbox Queue ──► [ 1-Click Approve ] ──► Planned Load
```

## 7.3 Create Load Console & Specialized Multi-Deck Car Carrying

- **Multi-Stop Route Builder:** Unlimited Pickup, Drop-off, Depot Staging, and Inspection stops with automatic distance and ETA calculations.
- **Multi-Deck Car Decking Planner:** Visual trailer deck placement mapping (Upper Deck Positions 1–4, Lower Deck Positions 5–8, Flip Ramps).
- **Axle Weight & GVM Validation:** Automatically calculates Gross Vehicle Mass (GVM) per deck and warns if front/rear axle limits exceed Heavy Vehicle National Law (HVNL) limits.
- **Vehicle Pre-Inspection Diagram:** Interactive 360-degree vehicle diagram for recording pre-existing scratches, dents, or hail damage.

## 7.4 Visual Planning Board & Automated Route Consolidation

- **Drag-and-Drop Allocation:** Timeline grid displaying driver and asset rows with an unassigned freight queue. Dragging a load card onto a driver row triggers automated validation (Licence class, EWD fatigue hours, asset compatibility, maintenance holds).
- **AI Route Consolidation:** Engine suggests combining partial corridor loads (e.g. combining two 4-car transfers into a single B-Double 8-car movement) and empty-leg return backhauls.

## 7.5 Live GPS Map, Telematics & Emergency SOS Siren Protocol

- **Real-Time GPS Map Canvas:** Live vehicle markers with speed (km/h), heading, breadcrumb playback, and geofence overlays.
- **OBD-II Telematics & DTC Error Alerts:** Ingests live engine telemetry (Fuel %, DEF %, TPMS tire pressure, battery voltage). Diagnostic Trouble Codes (DTCs, e.g. Engine Overheat `P0217`) trigger automatic dispatch holds.
- **Emergency SOS Incident Desk:** Panic button trigger activates flashing red siren banner and audio alarm across all dispatcher screens, auto-focuses live map, and opens emergency response hotline drawer (1-click call / 000 dispatch / depot alert).

## 7.6 Australian HVNL & EWD Fatigue Management Engine

- **Real-Time Fatigue Counters:** Live display of driver's remaining legal driving hours, total work time today, and countdown to mandatory rest breaks under Standard / BFM / AFM rulesets.
- **Predictive Assignment Block:** Prevents assigning a driver to a load if route duration exceeds available EWD drive time without planned rest stops.

## 7.7 Subcontractor & Cross-Hiring Allocation

- Allocates excess freight to third-party carriers, verifies active insurance/accreditation, generates Subcontractor Purchase Orders (POs), and issues secure SMS web tracking links.

---

# 8. MODULE 3: Warehouse Portal

## 8.1 Purpose & Stock Management

The **Warehouse Portal** is the operational workspace used by warehouse managers and storepersons to receive incoming stock, manage bin storage locations, execute internal moves and inter-depot transfers, stage load lanes, and spool barcode labels.

## 8.2 Inbound Stock Receiving & Location Hierarchy

- **Receiving Workflows:** Inbound receipts for Purchase Deliveries, Customer Deliveries, Inter-Depot Transfers, and Returns. Supports `Save as Draft` and `Confirm Receipt`.
- **Location Hierarchy:** Enforces structured location paths:  
  $$\text{Depot} \longrightarrow \text{Warehouse} \longrightarrow \text{Zone} \longrightarrow \text{Row} \longrightarrow \text{Bay} \longrightarrow \text{Position} \longrightarrow \text{Staging Area}$$
- **Capacity & Compatibility Validation:** Prevents moving items to full, inactive, or incompatible locations.

## 8.3 Zebra Thermal Label Spooler & Barcode Tagging

- **Direct Hardware Printing:** Spools ZPL / TSPL print payloads directly to Zebra ZD421 / S4M thermal label printers.
- **Supported Label Types:** VIN Labels, Pallet Tags, Container Labels, Load Lane Identifiers, Location Bin Tags.
- **Audit Logging:** Logs every print event, reprint reason, and operator ID.

## 8.4 HAZMAT Storage & Cold Chain Management

- **HAZMAT Segregation:** Enforces Australian Dangerous Goods (ADG) segregation rules (Classes 1–9), verifying SDS links and preventing incompatible chemical placement in adjacent bays.
- **Cold Storage Monitoring:** Logs °C temperature sensors in cold rooms; temperature breaches trigger automatic stock quarantine holds.

## 8.5 Linehaul Cross-Docking & Outbound Manifest Scanning

- Direct transfer of linehaul cargo from inbound receiving bays to outbound load lanes without warehouse racking put-away.
- Barcode scanning items directly into outbound load lane manifests with real-time missing/extra item alerts.

## 8.6 Physical Stock Auditing & Cycle Counting

- Supervisor generates blind cycle count tasks for specific zones. Warehouse staff scan items without seeing expected counts. Discrepancies exceeding threshold values require supervisor sign-off before inventory adjustment.

---

# 9. MODULE 4: Yard Attendant Portal

## 9.1 Purpose & Mobile Scanner Workspace

The **Yard Attendant Portal** is a scan-first, mobile/tablet-optimized workspace used by yard crews, gate inspectors, and tow operators working out in depot yards.

```
┌─────────────────────────────────────────────────────────────┐
│ HERO LOGISTICS — YARD ATTENDANT MOBILE                      │
│ Active Depot: Sydney Yard | Shift: ON DUTY                  │
│ [ Gate Check-In ]  [ Yard Scan ]  [ Load Lanes (A1-E4) ]    │
└─────────────────────────────────────────────────────────────┘
```

## 9.2 Gate Scan-In & Gate Scan-Out Checkpoints

- **Gate Scan-In:** Gate inspector scans incoming transport driver QR code, verifies delivery booking, checks container security seals, performs vehicle walkaround, and assigns initial Unloading Bay / Staging Lane.
- **Gate Scan-Out:** Verifies outbound trailer manifest, confirms seal numbers, records driver signature, and logs gate departure timestamp.

## 9.3 Yard Load Lane Staging (Lanes A1–E4)

- Real-time staging of cargo into designated yard load lanes (Lanes A1–E4).
- Live occupancy progress bars showing staged vs required item count per lane.
- Direct synchronization with the Dispatcher Command Centre.

## 9.4 Equipment Pre-Start Checklists & Defect Reporting

- Pre-start safety checklists for yard tugs, forklifts, tow trucks, and hydraulic ramps.
- Failed safety checks generate defect tickets and apply instant operational holds on defective equipment.

---

# 10. MODULE 5: Accounts & Financial Operations Portal

## 10.1 Purpose & Financial Operations

The **Accounts Portal** is the financial management workspace used by accountants, billing officers, and payroll managers to control invoicing, Stripe card payments, demurrage approvals, contractor self-billing (RCTI), employee payroll, tax compliance (GST/PAYG), and Profit & Loss (P&L) reporting.

## 10.2 Customer Invoicing & Automated Billing Engine

- **Invoice Review Queue:** Automatically converts completed dispatch loads into draft customer invoices based on contracted rate cards, distance ($/km), and fuel surcharges (FSC).
- **Invoice States:** `Draft`, `Pending Approval`, `Approved`, `Sent`, `Partially Paid`, `Paid`, `Overdue`, `Void`.
- **Batch Processing & PDF Generation:** Generates branded PDF invoices and emails them directly to customer billing contacts.

## 10.3 Stripe Payments & Payment Allocation

- **Stripe Integration:** Ingests customer credit card and direct debit payments directly via Stripe API.
- **Payment Allocation:** Allocates partial or full payment amounts against outstanding customer invoices with automatic ledger reconciliation.

## 10.4 Demurrage, Detention & Accessorial Approval Handoff

- Reviews waiting time logs and accessorial charge requests submitted by dispatchers (e.g. customer site waiting time >2 hours).
- Attaches geofence arrival timestamps and photo proof to customer invoices upon approval.

## 10.5 Remuneration: Employee Payroll & Contractor RCTI Pay

- **Employee Pay Runs:** Processes driver and warehouse staff wages, calculating ordinary hours, overtime, weekend penalty rates, superannuation (11.5%), and PAYG tax withholding.
- **Contractor Pay (RCTI):** Generates Recipient Created Tax Invoices (RCTI) for owner-operators and subcontractor carriers based on completed load rates, deducting fuel levies or fees.

## 10.6 Tax Compliance, Expenses & Financial Analytics

- **GST & PAYG Tracking:** Calculates GST collected on sales vs GST paid on purchases, generating BAS summary reports.
- **Vehicle Operating Costs:** Tracks fuel expenses, toll charges, tire replacements, and maintenance invoices per vehicle asset.
- **Profit & Loss (P&L) Analytics:** Real-time revenue, gross margin, operating expenditure, and net profit dashboards filterable by branch, customer, or vehicle.

---

# 11. End-to-End Master Cross-Portal Workflows

## 11.1 Master Workflow 1: Customer Order → Dispatch → Yard Staging → Execution → Invoicing → Cash

```
1. Customer Booking ──► 2. AI Order Ingestion (Dispatcher) ──► 3. Planning Board Drag-Assign
                                                                         │
                                                                         ▼
6. Outbound Delivery (Driver) ◄── 5. Yard Staging Lane A2 (Yard) ◄── 4. Load Activation
       │
       ▼
7. Electronic POD & Sign ──► 8. Demurrage Review (Accounts) ──► 9. Customer Invoice & Stripe Payment
```

1. **Order Booking:** Customer emails PDF booking confirmation.
2. **AI Order Ingestion:** Dispatcher Portal parses PDF via AI Inbox and generates Planned Load `LD-10583`.
3. **Resource Allocation:** Dispatcher drags load card onto MC Driver on Planning Board. System validates licence, EWD fatigue hours, and asset compliance.
4. **Load Activation:** Load passes 10-point Readiness Checklist and activates.
5. **Yard Staging:** Yard Attendant receives task on handheld scanner and stages trailer into Yard Lane A2.
6. **Trip Execution:** Driver accepts load on mobile app, conducts pre-trip check, and streams live GPS telematics.
7. **Delivery & POD:** Driver arrives at destination, captures customer e-signature and photo proof. Load transitions to `Delivered`.
8. **Demurrage Review:** Dispatcher logs 45 mins excess waiting time; Accounts Manager approves accessorial claim.
9. **Invoicing & Cash:** Accounts Portal generates customer invoice, emails PDF, and ingests credit card payment via Stripe.

## 11.2 Master Workflow 2: Gate Scan-In → Automotive Receiving → Cross-Docking → Gate Scan-Out

1. Transport car carrier arrives at depot security gate.
2. Yard Attendant performs Gate Scan-In, verifies driver QR code, and assigns Unloading Bay 2.
3. Car Inspector conducts receiving inspection: verifies VIN checksums, checks key count, records fuel state, and marks pre-existing body scratches on 360° digital damage diagram.
4. Forklift operator receives cross-dock instruction and moves vehicle directly to Outbound Load Lane C4 without warehouse put-away storage.
5. Outbound car carrier loads vehicle, receives seal verification, and completes Gate Scan-Out departure log.

---

# 12. Unified Business Rules & Validation Engine

- **BR-MST-001 (Unique Load Ref):** Load Reference IDs must be globally unique across all tenant operations.
- **BR-MST-002 (Atomic Stock Movements):** Every inventory movement must update item location and bin capacity in a single database transaction.
- **BR-MST-003 (CoR Proof Mandatory):** Car Carrying and Heavy Freight loads cannot be marked `Completed` without mandatory pickup/delivery proof photos.
- **BR-MST-004 (HVNL Fatigue Hard-Block):** Drivers with insufficient legal EWD drive time cannot be assigned to loads exceeding their remaining allowance.
- **BR-MST-005 (DTC Engine Fault Block):** Prime movers with critical OBD-II engine fault codes (`DTC P0217`) are automatically locked from dispatch assignment.
- **BR-MST-006 (HAZMAT Segregation):** Incompatible dangerous goods classes cannot be stored in adjacent warehouse bays or staged in non-HAZMAT load lanes.
- **BR-MST-007 (Invoice Lockdown):** Financial invoices in `Approved`, `Sent`, or `Paid` states cannot be edited or deleted by operational users.
- **BR-MST-008 (Immutable Audit Trail):** Operational state changes, overrides, payment allocations, and status transitions must generate immutable audit records.

---

# 13. Master Entity Relationship & Data Model

The master platform database is structured around core relational entities enforced across all 5 portals:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Customer   │1    * │    Load     │1    * │  LoadStop   │1    * │  LoadItem   │
└─────────────┘───────└─────────────┘───────└─────────────┘───────└─────────────┘
       │                     │                     │                     │
       │ 1                   │ 1                   │ 1                   │ 1
       ▼ *                   ▼ *                   ▼ *                   ▼ *
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Invoice   │       │ Assignment  │       │  Movement   │       │  Warehouse  │
└─────────────┘       └─────────────┘       └─────────────┘       │  Location   │
       │                     │                                    └─────────────┘
       │ 1                   ├───────────────┐                           ▲
       ▼ *                   ▼               ▼                           │ 1
┌─────────────┐       ┌─────────────┐ ┌─────────────┐                    │ *
│   Payment   │       │   Driver    │ │   Vehicle   │                    │
└─────────────┘       └─────────────┘ └─────────────┘                    │
                             │               │                           │
                             ▼               ▼                           │
                      ┌─────────────┐ ┌─────────────┐                    │
                      │  EWDRecord  │ │ Telematics  │                    │
                      └─────────────┘ └─────────────┘                    │
                                             │                           │
                                             └───────────────────────────┘
```

## Core Schema Tables
- `Tenant`, `Branch`, `User`, `Role`, `Permission`, `Customer`, `Driver`, `Vehicle`, `Trailer`, `Load`, `LoadStop`, `LoadItem`, `AILoadInboxItem`, `Assignment`, `TelematicsPing`, `EWDRecord`, `WarehouseLocation`, `Receipt`, `ReceiptItem`, `Movement`, `LoadLane`, `GateEntry`, `VehicleInspection`, `HazmatDeclaration`, `ColdChainLog`, `CycleCountAudit`, `Invoice`, `InvoiceItem`, `Payment`, `PayrollRun`, `ContractorPay`, `AccessorialLog`, `AuditLog`.

---

# 14. System Integrations & Technical API Architecture

## 14.1 Key Integration Touchpoints

- **Zebra DataWedge & Honeywell SDK:** Native Android PDA hardware 2D barcode decode integration.
- **Zebra WebPrint / ZPL Spooler:** Direct network thermal label printing engine.
- **Stripe Payments API:** Credit card processing, direct debit, and webhooks for payment reconciliation.
- **Twilio / MessageBird API:** Automated customer SMS & WhatsApp ETA tracking link delivery.
- **Mapbox / Google Maps API:** Geocoded address validation, distance matrix, and live traffic maps.
- **OBD-II CANbus Telematics Hook:** High-frequency vehicle sensor ingestion (MQTT / Webhooks).

---

# 15. Security, Multi-Factor Auth, Privacy & Immutable Audit

- **Authentication & MFA:** Secure email/password authentication with mandatory Two-Factor Authentication (2FA) for Admin, Dispatcher, and Accounts roles.
- **Data Encryption:** TLS 1.3 in transit and AES-256 encryption at rest for sensitive financial, customer, and employee data.
- **Immutable Audit Logging:** Every create, edit, status transition, payment allocation, override, and delete action records `user_id`, `ip_address`, `device_id`, `timestamp_utc`, `old_state`, `new_state`, and `reason`.

---

# 16. Non-Functional Requirements

- **System Performance:** Dashboard load <2.0s; global search (`Ctrl+K`) <300ms; barcode scan decode <1.0s; invoice generation <2.0s.
- **High Availability SLA:** 99.95% monthly uptime target across cloud infrastructure.
- **Offline PWA Local Storage:** Service Worker + IndexedDB local caching for low-connectivity depot yards and cold rooms with background sync queues and conflict resolution.

---

# 17. Master Analytics, Reporting & Operational Success Metrics

Unified analytics engine providing role-scoped operational and financial reporting:

- **Dispatcher Reports:** OTPD %, Fleet Utilisation, Delay Root Cause, EWD Drive Time, Subcontractor Costs.
- **Warehouse Reports:** Inventory Summary, Stock Aging, Dock-to-Dispatch Time, Staging Dwell Time, Cycle Count Variance.
- **Yard Reports:** Gate Scan Throughput, Load Lane Occupancy %, Equipment Pre-Start Defect Logs.
- **Accounts Reports:** Revenue by Customer, Aging Receivables (30/60/90 Days), Payroll Summary, Contractor RCTI Ledger, BAS GST Tax Summary, Vehicle Cost per Km, Profit & Loss Statements.

---

# 18. Platform Release Scope & Phased Implementation Plan

- **Phase 1 (Core Foundations):** Admin Settings, User Roles, AI Load Inbox, Quick/Full Load Creation, Basic Warehouse Receiving & Locations, Invoice Review & Payments.
- **Phase 2 (Live Dispatch & Scanning):** Live GPS Map Canvas, OBD-II Telematics, EWD Fatigue Engine, Zebra ZPL Thermal Label Spooling, Hardware Scanner SDK, Stripe Gateway.
- **Phase 3 (Yard Operations & Advanced Finance):** Gate Scan-In/Out Checkpoints, Load Lane Staging (A1–E4), 360° Automotive Inspection, Demurrage Logger Handoff, Employee Payroll & Contractor RCTI.
- **Phase 4 (Automation & Intelligence):** AI Corridor Route Consolidation, Automated Customer SMS/WhatsApp ETA Hub, Blind Cycle Counting, Full Offline PWA Sync.

---

# 19. Quality Assurance, UAT Scenarios & Definition of Done

## 19.1 Key Master UAT Scenarios

1. **UAT-MASTER-01 (Order-to-Cash):** Customer PDF emailed ──► AI Inbox parses load ──► Dispatcher assigns driver on Planning Board ──► Driver accepts & delivers ──► Accounts reviews invoice ──► Stripe processes credit card payment.
2. **UAT-MASTER-02 (HVNL Fatigue Block):** Attempting to assign a driver with <1 hr drive time remaining to a 4-hr route triggers mandatory blocking modal.
3. **UAT-MASTER-03 (Automotive Gate Receiving):** Car carrier arrives ──► Gate Scan-In ──► 360° Scratch/Dent Inspection ──► Cross-Dock to Outbound Lane C2 ──► Gate Scan-Out.
4. **UAT-MASTER-04 (Demurrage Billing):** Geofence logs 2.5 hr driver site waiting time ──► Dispatcher logs demurrage claim ──► Accounts approves and attaches proof to customer invoice.
5. **UAT-MASTER-05 (Offline Yard Sync):** Yard attendant scans 15 pallets offline in Wi-Fi blind spot ──► Actions queue in IndexedDB ──► System syncs cleanly upon network reconnection.

---

# 20. Risks, Mitigations & Stakeholder Sign-Off

| **Master Platform Risk** | **Impact** | **Mitigation Strategy** |
|---|---|---|
| **GPS / Telematics Signal Loss** | High | Fall back to mobile app pings; display stale telemetry flags on live map |
| **Incorrect AI Order PDF Parsing** | Medium | Require human dispatcher review with confidence score highlighting |
| **Offline Sync Concurrency Conflict** | High | Server-wins policy with visual diff notification for conflicting edits |
| **Unauthorised Access to Rates / Financials** | High | Enforce server-side field-level masking for non-financial roles |

---

# Sign-Off & Platform Authorization

| **Role / Stakeholder** | **Name** | **Status** | **Date** |
|---|---|---|---|
| **Product Owner** |  | Approved / Pending | 05 Aug 2026 |
| **Company Executive / Client Representative** |  | Approved / Pending | 05 Aug 2026 |
| **Dispatch Operations Lead** |  | Approved / Pending | 05 Aug 2026 |
| **Warehouse & Yard Lead** |  | Approved / Pending | 05 Aug 2026 |
| **Financial Controller / Accounts Manager** |  | Approved / Pending | 05 Aug 2026 |
| **Lead Technical Architect** |  | Approved / Pending | 05 Aug 2026 |
| **QA / Testing Lead** |  | Approved / Pending | 05 Aug 2026 |

---

**End of Master Document — Hero Logistics Enterprise Platform Master PRD v1.0**
