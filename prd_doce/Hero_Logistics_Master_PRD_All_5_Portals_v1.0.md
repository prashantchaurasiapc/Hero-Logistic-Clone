# Hero Logistics Platform — Master Product Requirements Document

**Document Version:** 1.0  
**Prepared For:** Hero Logistics Product, Operations, Finance, Warehouse, Yard, Design, Engineering, Security and QA Teams  
**Prepared Date:** 05 August 2026  
**Product Type:** Multi-tenant, multi-company, multi-branch logistics operations platform  
**Included Portals:** Admin, Dispatcher, Warehouse, Yard Attendant and Accounts  
**Document Status:** Consolidated baseline PRD for architecture, UX, implementation, API design, QA and UAT  
**Default Region Context:** Australia and New Zealand  
**Default Currency:** AUD, configurable by company  
**Default Timezone:** Australia/Sydney, configurable by branch/depot  

**CONFIDENTIAL**

---

## Document Control

| Item | Details |
|---|---|
| Product Owner | Hero Logistics / Authorised Company Representative |
| Master Document Purpose | Consolidate five role-based portal PRDs into one implementation baseline |
| Primary Stakeholders | Company Admin, Operations, Dispatch, Warehouse, Yard, Accounts, Compliance, Engineering, QA and Security |
| Source Portals | Admin Portal, Dispatcher Portal, Warehouse Portal, Yard Attendant Portal and Accounts Portal |
| Decision Rule | Shared platform rules apply across portals; portal-specific requirements apply within that portal |
| Conflict Rule | The stricter security, validation, audit or compliance rule applies until the Product Owner confirms otherwise |
| Sample Data Rule | All names, dates, IDs, routes, financial values and counts shown in source screens are illustrative |

### Revision History

| Version | Date | Change Summary |
|---|---|---|
| 1.0 | 05 Aug 2026 | Consolidated the five approved portal PRDs into one master product specification |

---

## 1. Executive Summary

Hero Logistics is a unified transport, fleet, warehouse, yard and financial operations platform delivered through role-based portals. The platform coordinates the complete business lifecycle from company setup and load creation through physical inventory handling, transport dispatch, delivery completion, invoicing, payment collection, payroll and reporting.

The five included portals are designed around distinct responsibilities while operating on shared master data and workflow records:

| Portal | Primary Responsibility |
|---|---|
| Admin Portal | Company-wide control, branches, users, roles, fleet, loads, warehouse, finance, compliance and settings |
| Dispatcher Portal | Load planning, driver and asset assignment, live dispatch, GPS monitoring and communication |
| Warehouse Portal | Inbound receiving, inventory control, movements, staging, load lanes, printing and dispatch preparation |
| Yard Attendant Portal | Scan-first physical yard execution, location updates, outbound checks and issue reporting |
| Accounts Portal | Invoices, payments, payroll, expenses, GST/PAYG, P&L, vehicle costs and financial reports |

The system must maintain one authoritative record for each shared entity and expose only the actions and fields required by the authenticated user's company, branch, depot, role and permissions.

---

## 2. Consolidated Product Vision

Create a secure, real-time logistics operating system that connects commercial, operational, physical and financial workflows without duplicate data entry.

The platform must provide:

- a single source of truth for loads, customers, drivers, vehicles, trailers, inventory and financial records;
- branch- and depot-scoped role access;
- real-time operational status and exception visibility;
- safe and compliant assignment and movement rules;
- complete auditability across all portals;
- shared notifications, documents, messages and reports;
- responsive desktop, tablet and handheld workflows;
- configurable company rules without hard-coded sample values.

---

## 3. Platform-Wide Objectives

1. Reduce manual coordination across administration, dispatch, warehouse, yard and accounts.
2. Prevent invalid assignments, movements, dispatches and financial transactions.
3. Improve load, asset and workforce utilisation.
4. Maintain accurate inventory and location records.
5. Improve on-time pickup, delivery and customer billing.
6. Support compliance, safety and Chain of Responsibility evidence.
7. Protect tenant, company, branch, employee, customer and financial data.
8. Provide complete operational and financial audit trails.
9. Support scalable multi-company and multi-branch growth.
10. Deliver reliable reporting from shared authoritative data.

---

## 4. Scope of This Master PRD

### 4.1 Included Portals

- Company Admin Portal
- Dispatcher Portal
- Warehouse Portal
- Yard Attendant Portal
- Accounts Portal

### 4.2 Shared Platform Capabilities

- authentication and session management;
- multi-tenant and multi-company isolation;
- branch and depot scope;
- role-based access control;
- global search;
- notifications;
- messages;
- documents and file storage;
- audit logs;
- reporting and export;
- configurable statuses and workflows;
- integration monitoring;
- responsive layouts;
- offline-safe yard and warehouse actions where enabled.

### 4.3 Related but Separately Specified Portals

The Driver Portal, Customer Portal, Super Admin SaaS Portal and public-facing booking experiences may consume shared workflows but require their own detailed PRDs unless explicitly included in a later revision.

---

## 5. Portal Relationship and Ownership Model

| Shared Domain | Authoritative Owner / Primary Management Portal | Consuming Portals |
|---|---|---|
| Companies, branches and settings | Admin | All portals |
| Users, roles and permissions | Admin | All portals |
| Customers | Admin / authorised Accounts or Dispatcher users | Dispatcher, Accounts, Warehouse |
| Loads and stops | Dispatcher / Admin | Warehouse, Yard, Accounts |
| Drivers | Admin / authorised Operations roles | Dispatcher, Accounts |
| Vehicles and trailers | Admin / Fleet | Dispatcher, Warehouse, Yard, Accounts |
| Warehouse and yard locations | Admin / Warehouse Manager | Warehouse, Yard, Dispatcher |
| Inventory and item location | Warehouse / Yard execution | Dispatcher, Admin |
| Load lanes and staging | Warehouse / Yard | Dispatcher, Admin |
| GPS and route telemetry | Dispatcher / telematics integration | Admin |
| Invoices and payments | Accounts | Admin reporting |
| Payroll and contractor pay | Accounts | Admin reporting |
| Compliance and safety policies | Admin / Compliance | Dispatcher, Warehouse, Yard, Accounts |
| Reports | Shared reporting service | Permission-based access across portals |

---

## 6. Cross-Portal End-to-End Workflows

### 6.1 Load-to-Cash

1. Customer and pricing data are available from authorised master records.
2. Dispatcher or authorised Admin creates a load.
3. The system validates load, route, items, dates and resources.
4. Warehouse and Yard users receive, locate, move and stage related items.
5. Yard/Warehouse marks the load dispatch-ready after required checks.
6. Dispatcher confirms assignment and monitors active transport.
7. Driver and operational teams submit milestones, GPS, documents and proof.
8. Load reaches Delivered and then Completed status.
9. Accounts creates or reviews the related invoice.
10. Invoice is approved and sent.
11. Customer payment is recorded and allocated.
12. Reports and P&L update from posted transactions.

### 6.2 Inbound-to-Inventory

1. Expected inbound receipt or transfer is created.
2. Warehouse Manager or Yard Attendant receives items by manual entry, import or scan.
3. Condition, documents, photos and identifiers are validated.
4. A valid initial location is assigned.
5. Inventory and movement history are created atomically.
6. Items become available, staged, held or restricted based on rules.

### 6.3 Inventory-to-Outbound Dispatch

1. Load requirements identify required items.
2. Items are moved from storage to holding/staging areas.
3. Items are assigned to a compatible load lane.
4. Required item count, documents, condition and restrictions are verified.
5. Driver, truck and trailer information is confirmed.
6. Load becomes Dispatch Ready.
7. Yard/Warehouse records physical departure.
8. Dispatcher sees updated active-load and GPS status.

### 6.4 Compliance and Safety

1. Admin configures required documents, expiry rules and safety checklists.
2. Driver, vehicle, trailer and staff compliance are evaluated.
3. Non-compliant resources are blocked from assignment or work.
4. Yard/Warehouse issues and safety defects are reported with evidence.
5. Authorised supervisors resolve or override according to permission.
6. All decisions remain auditable.

### 6.5 Payroll and Workforce

1. Workforce shifts and attendance are captured.
2. Approved timesheets and pay rules feed Accounts.
3. Accounts prepares employee or contractor pay.
4. Approval, payment, PAYG and superannuation records are created.
5. Admin and authorised reports receive summary data.

---

## 7. Shared Role and Access Principles

- Every user belongs to one tenant/company.
- Users may be assigned to one or more branches or depots.
- Access is calculated from role, permissions, scope and record relationship.
- Backend permission checks are mandatory.
- Sensitive fields must be masked unless specifically required.
- View, create, edit, approve, export, override and delete permissions must be distinct.
- Maker-checker separation must apply to high-risk financial and compliance actions.
- Completed operational history and posted financial records must not be physically deleted by normal users.
- Cross-branch and cross-depot access must be explicitly granted.

---

## 8. Shared Status and Data Consistency Rules

1. Shared entities must have one canonical identifier.
2. Portal-specific labels must map to canonical backend statuses.
3. Status changes must use server-side transition rules.
4. Updates affecting multiple records must be transactional.
5. Concurrent edits must use optimistic locking or equivalent conflict detection.
6. All timestamps must be stored in UTC and displayed in configured local time.
7. All financial values must store currency and precision.
8. Every movement must preserve source and destination.
9. Every assignment must preserve prior and new resources.
10. Every posted financial event must preserve its accounting and audit reference.

---

## 9. Shared Data Model

Core shared entities include:

- Tenant
- Company
- Branch
- Depot
- Warehouse
- Yard
- Location
- Zone
- Row / Aisle
- Bay / Position
- Staging Area
- Load Lane
- User
- Role
- Permission
- User Scope
- Customer
- Customer Contact
- Load
- Load Stop
- Load Item
- Load Assignment
- Load Status History
- Driver
- Workforce Shift
- Vehicle
- Trailer
- Compliance Document
- Inventory Item
- Inbound Receipt
- Movement
- Transfer
- Dispatch Confirmation
- GPS Position
- Geofence Event
- Message
- Notification
- Document
- Photo
- Safety Checklist
- Issue Report
- Invoice
- Payment
- Payroll Run
- Contractor Claim
- Expense
- Tax Period
- Vehicle Cost
- Report Definition
- Report Run
- Audit Log

The detailed portal chapters define additional fields, states and relationships.

---

## 10. Shared Integration Requirements

Potential integrations include:

- telematics and GPS;
- mapping, routing and geocoding;
- email, SMS, push and WhatsApp;
- accounting platforms;
- payment gateways;
- bank feeds;
- payroll and timesheets;
- ATO/BAS lodgement;
- document storage and PDF generation;
- barcode, QR and network printers;
- VIN or registration lookup;
- antivirus and file scanning;
- weather and traffic services.

Every integration must support:

- encrypted credentials;
- environment-specific configuration;
- health status;
- retry and idempotency;
- duplicate protection;
- structured logs and correlation IDs;
- visible failure state;
- manual fallback where operationally required.

---

## 11. Shared Security and Audit Requirements

### 11.1 Security

- TLS for all communications;
- encryption at rest;
- field-level protection for bank, tax and sensitive identity data;
- secure password hashing;
- optional or enforced 2FA;
- session expiration and device management;
- CSRF protection where applicable;
- XSS and injection prevention;
- secure file upload and malware scanning;
- rate limiting;
- secure secret management;
- backup encryption;
- tenant and branch isolation.

### 11.2 Audit

The platform must audit:

- authentication;
- role and permission changes;
- load and assignment changes;
- inventory receipts and movements;
- dispatch confirmations;
- compliance and safety decisions;
- messages where required by policy;
- invoice and payment actions;
- payroll and tax actions;
- exports and reports;
- overrides;
- security changes.

Audit records must include actor, role, entity, action, prior value, new value, reason, timestamp, IP/device and correlation ID where applicable.

---

## 12. Shared Non-Functional Requirements

| Area | Requirement |
|---|---|
| Availability | Target 99.9% monthly availability |
| Performance | Standard filtered lists under 2 seconds under normal load |
| Search | Common indexed searches should return within 1 second |
| Scalability | Support multiple companies, branches, depots and high transaction volumes |
| Responsiveness | Desktop, tablet and task-appropriate handheld layouts |
| Accessibility | Keyboard support, labels, contrast, focus states and non-colour status cues |
| Reliability | Transactional updates and safe retry behaviour |
| Offline | Configurable encrypted queue for supported yard/warehouse actions |
| Observability | Logs, metrics, traces, health checks and alerting |
| Recovery | Documented backup, restore, RPO and RTO targets |
| Browser Support | Current stable Chrome, Edge, Safari and Firefox |

---

## 13. Unified Release Approach

### Phase 1 — Shared Foundation and Admin

- tenant/company/branch model;
- authentication;
- RBAC;
- users and roles;
- core master data;
- Admin dashboard and settings;
- audit and notifications.

### Phase 2 — Dispatch Operations

- load creation;
- planning;
- assignment;
- active loads;
- driver and vehicle views;
- communication.

### Phase 3 — Warehouse and Yard Execution

- inbound receiving;
- search;
- movement;
- staging;
- load lanes;
- dispatch ready;
- scanning;
- map and issue reporting.

### Phase 4 — Real-Time and Automation

- live GPS;
- geofences;
- optimisation;
- offline sync;
- advanced printing;
- AI load inbox and operational insights.

### Phase 5 — Accounts and Compliance

- invoices;
- payments;
- payroll;
- expenses;
- GST/PAYG;
- P&L;
- vehicle costs;
- scheduled reports and integrations.

---

## 14. Master Definition of Done

The complete platform is ready only when:

- portal-specific functional requirements are implemented;
- shared entity and status mappings are consistent;
- server-side RBAC and scope checks pass;
- cross-portal workflows pass integration testing;
- audit logs cover all high-risk actions;
- financial and operational totals reconcile;
- responsive and accessibility checks pass;
- performance targets pass;
- backup and recovery are verified;
- security testing passes;
- QA and UAT pass;
- API and user documentation are updated;
- monitoring and support procedures are live;
- no critical or high-severity defects remain.

---

## 15. Detailed Portal Specifications

The following parts preserve the complete detailed requirements from each approved portal PRD. Repeated global requirements should be implemented as shared platform capabilities rather than separate duplicated systems.

---

## Part 1 — Admin Portal

**Portal Scope:** Central company administration, fleet, branches, loads, warehouse, finance, compliance, roles and settings.

**Source File:** `Hero_Logistics_Admin_Portal_PRD_v1.0.md`

### Product Requirements Document

#### Hero Logistics Admin Portal

**Fleet, Load, Warehouse, Finance, Compliance and Operations Management Platform**

| **Document Version** | 1.0                                               |
|----------------------|---------------------------------------------------|
| **Prepared For**     | Hero Logistics - Company Admin & Engineering Team |
| **Prepared Date**    | 5 August 2026                                     |
| **Product Type**     | Multi-branch logistics operations web application |
| **Document Status**  | Baseline PRD for design, development, QA and UAT  |

**CONFIDENTIAL**

### Document Control

| **Item**                 | **Details**                                                                                                                                        |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Owner**                | Product Owner / Company Admin                                                                                                                      |
| **Primary Users**        | Company Admin, Dispatcher, Accounts Manager, Warehouse Manager, Yard Attendant, Sales Representative and operational support staff                 |
| **Related User Portals** | Driver Portal and Customer Portal consume selected data and workflows governed by this Admin Portal.                                               |
| **Source Material**      | Admin portal menu structure, dashboard content, module screens, sample tables, alerts, roles and permission examples supplied by the stakeholder.  |
| **Decision Rule**        | Where the supplied screen copy did not define detailed behaviour, this PRD records a reasonable product assumption and labels it for confirmation. |

> **Important sample-data note:** Dates, names, load references, invoice values, vehicle registrations, branches, counts and financial figures shown in the supplied screens are illustrative test data. Some sample records contain dates after the document date; they must not be interpreted as production records or system time requirements.

#### Revision History

| **Version** | **Date**   | **Author/Owner** | **Change Summary**                                           |
|-------------|------------|------------------|--------------------------------------------------------------|
| 1.0         | 5 Aug 2026 | Product Team     | Initial baseline covering the complete Company Admin portal. |

### Contents

> 1\. Executive Summary
>
> 2\. Product Vision and Objectives
>
> 3\. Product Scope
>
> 4\. Users, Roles and Permissions
>
> 5\. Information Architecture and Navigation
>
> 6\. Command Centre
>
> 7\. Loads and Dispatch
>
> 8\. AI Load Inbox
>
> 9\. Customers
>
> 10\. Live Tracking
>
> 11\. Drivers
>
> 12\. Vehicles
>
> 13\. Branches
>
> 14\. Assets
>
> 15\. Warehouse
>
> 16\. Pricing and Rate Cards
>
> 17\. Payroll
>
> 18\. Finance
>
> 19\. Documents Repository
>
> 20\. Reports and Analytics
>
> 21\. Messages
>
> 22\. Support and Knowledge Base
>
> 23\. Roles and Permissions Administration
>
> 24\. Settings
>
> 25\. Safety Checklists
>
> 26\. Delivery Issues
>
> 27\. End-to-End Workflows
>
> 28\. Data and Entity Model
>
> 29\. Integrations
>
> 30\. Notifications and Automation
>
> 31\. Non-Functional Requirements
>
> 32\. Audit, Security and Compliance
>
> 33\. Analytics and Success Metrics
>
> 34\. Release Scope and Prioritisation
>
> 35\. QA, UAT and Definition of Done
>
> 36\. Risks, Dependencies and Open Decisions
>
> Appendix A. Status Definitions
>
> Appendix B. Permission Catalogue
>
> Appendix C. Screen Inventory

### 1. Executive Summary

Hero Logistics Admin Portal is a central operational command platform for managing logistics loads, dispatch, drivers, fleet vehicles, branch operations, warehouses, assets, pricing, payroll, finance, compliance documents, reports, messaging, support, safety enforcement and delivery exceptions. The portal is intended to provide a single source of truth across multiple branches and countries while preserving role-based access and auditable actions.

- The portal must support day-to-day execution: create and dispatch loads, assign resources, track trips, resolve exceptions and collect proof of delivery.

- The portal must support business control: pricing, payroll, invoicing, cash position, compliance, reporting and approval workflows.

- The portal must support distributed operations across Australia and New Zealand, including branch-level segregation, local time zones and currencies.

- AI-assisted features may recommend or extract information, but users remain accountable for review and approval of operational decisions.

### 2. Product Vision and Objectives

#### 2.1 Vision

Create a secure, reliable and intuitive logistics operations platform that gives authorised users real-time visibility and control from load intake to final delivery, financial settlement and compliance reporting.

#### 2.2 Business Objectives

- Reduce manual dispatch effort and duplicate data entry.

- Improve on-time delivery and fleet utilisation through live telemetry and proactive alerts.

- Prevent non-compliant trips through enforced driver, vehicle and safety checks.

- Accelerate invoicing, payroll preparation and financial reconciliation.

- Provide consistent processes across branches while allowing branch-specific access and configuration.

- Create measurable audit trails for sensitive actions and regulatory evidence.

- Improve customer and driver communication through a central message and support hub.

#### 2.3 Product Principles

- Operational clarity: every load, vehicle, driver and issue has a visible status and owner.

- Exception-first design: overdue, blocked, urgent and non-compliant items are prioritised.

- Least privilege: users see and change only what their assigned role and branch allow.

- Human-controlled AI: AI outputs are suggestions or drafts until an authorised user confirms them.

- Traceability: critical changes include who, what, when, prior value and resulting value.

### 3. Product Scope

#### 3.1 In Scope

- Company Admin portal modules listed in the primary navigation.

- Multi-branch and multi-country operational views.

- Load lifecycle, dispatch, live tracking, safety, delivery exception and completion workflows.

- Driver, vehicle, asset, warehouse and compliance management.

- Pricing, payroll, finance, documents, reports, messages and support.

- Role-based access control, settings, audit logs and integration health.

- Administrative interactions with Driver and Customer portals.

#### 3.2 Out of Scope for This Baseline

- Native mobile application UX specifications; this PRD defines the admin web portal and related workflow contracts only.

- Detailed accounting ledger implementation replacing Xero or another accounting system.

- Hardware procurement or installation for GPS, telematics, temperature sensors, scanners or warehouse devices.

- Exact AI model/vendor selection and model-training strategy.

- Country-specific legal advice; compliance functions must be reviewed by qualified legal, payroll and safety specialists.

- Full customer-facing and driver-facing screen designs except where required to complete an admin workflow.

#### 3.3 Assumptions

- The system is multi-tenant or at minimum company-isolated, and the Company Admin operates only within the assigned company.

- Branches may operate in different time zones and currencies; all records store UTC plus the applicable local time zone.

- The platform exposes APIs or integration services for Driver and Customer portals.

- A load may contain multiple pickup/delivery stops and may be associated with general freight, car carrying or dangerous goods.

- Compliance expiry calculations use configurable warning windows, with 30 days as the default.

- Financial amounts are stored with explicit currency codes and appropriate decimal precision.

### 4. Users, Roles and Permissions

The platform shall use role-based access control (RBAC) with optional custom roles. Permissions are module- and action-specific (show, view, create, edit, delete, manage, export, approve and specialised workflow actions). Branch and company scope must be applied in addition to the assigned role.

| **Role**                 | **Primary Responsibility**                                                                                         |
|--------------------------|--------------------------------------------------------------------------------------------------------------------|
| **Super Admin**          | Platform-wide governance, tenant/company management, global settings and unrestricted support/audit access.        |
| **Company Admin**        | Full company-level administration across operations, users, branches, finance, compliance and settings.            |
| **Dispatcher**           | Create, plan, assign and monitor loads; view drivers, vehicles and yard/warehouse availability.                    |
| **Driver**               | Limited access to assigned loads, vehicle information, checklists, support and own messages through Driver Portal. |
| **Warehouse Manager**    | Manage warehouse stock, tasks, transfers, yard activities and related operational visibility.                      |
| **Accounts Manager**     | Manage invoices, finance, inter-company transfers, payroll-related outputs and financial reporting.                |
| **Yard Attendant**       | Manage yard activities and update relevant vehicle/stock movements with limited operational access.                |
| **Sales Representative** | Manage customers, view loads and invoices, and coordinate support or account communication.                        |
| **Customer**             | Create/view authorised loads, view invoices and create/view support tickets through Customer Portal.               |
| **Custom Role**          | Administrator-defined permission bundle with company and branch scope.                                             |

#### 4.1 Permission Enforcement Rules

- The backend must enforce permissions for every API action; hidden UI controls are not sufficient security.

- A user with view permission but no edit permission may inspect details but cannot save changes.

- Delete, cancel, approve, payroll export, finance export, permission change and checklist enforcement actions require explicit permissions.

- Branch-restricted users can access only records associated with authorised branches unless a cross-branch permission is granted.

- Role and permission changes take effect immediately or on token refresh according to the security architecture, and must be audited.

### 5. Information Architecture and Navigation

The left navigation shall provide clear access to the modules below. Menu visibility is permission-driven. Modules with unread or urgent items may display badges, such as unread Messages or pending AI Load Inbox items.

| **Navigation Item**          | **Purpose**                                                                       |
|------------------------------|-----------------------------------------------------------------------------------|
| **Command Centre**           | Operational overview and high-priority actions.                                   |
| **Loads**                    | All loads, statuses, filters, bulk actions and load details.                      |
| **Load Inbox**               | AI-assisted and field-submitted draft loads awaiting review.                      |
| **Customers**                | Customer master records, contacts, contracts and related activity.                |
| **Live Tracking**            | Real-time fleet map, telemetry and route monitoring.                              |
| **Drivers**                  | Driver profiles, availability, compliance, assignments and performance.           |
| **Vehicles**                 | Fleet inventory, assignments, service and compliance.                             |
| **Branches**                 | Company branch list, configuration, summary and setup.                            |
| **Assets**                   | Non-vehicle asset register, assignments, condition and maintenance.               |
| **Warehouse**                | Warehouses, inventory, movements, shipments and tasks.                            |
| **Pricing**                  | Rate cards, freight lanes, vehicle rates, fuel surcharge and customer rates.      |
| **Payroll**                  | Driver/staff earnings, pay runs, timesheets and compliant exports.                |
| **Finance**                  | Revenue, expenses, invoices, cash flow and transactions.                          |
| **Documents**                | Central document vault across company, driver, vehicle and customer folders.      |
| **Reports & Analytics**      | Operational, financial, compliance and AI insight reports.                        |
| **Messages**                 | Conversations, announcements, templates and communication analytics.              |
| **Support & Knowledge Base** | Tickets, open requests, articles and FAQs.                                        |
| **Roles & Permissions**      | Role creation and module/action permission administration.                        |
| **Settings**                 | Company, users, workflows, integrations, AI, notifications, security and billing. |
| **Safety Checklists**        | Pre-trip checklist configuration and trip-block enforcement.                      |
| **Delivery Issues**          | Operational exceptions, severity, status, owner and resolution history.           |

### 6. Command Centre

**Purpose.** Provide an executive and operational overview of fleet activity, workload, revenue, messages, support, invoice exposure, driver alerts and maintenance due items.

**Primary data displayed or captured.** Aggregated load counts, active/total fleet, revenue, branches, depots, messages, tickets, invoices, driver compliance alerts and vehicle maintenance alerts.

**Key business rules.**

- MTD comparisons use the previous equivalent calendar period unless the organisation configures another rule.

- Monetary KPIs must display the company or branch currency.

| **ID** | **Area**         | **Requirement**                                                                                                             | **Priority** |
|--------|------------------|-----------------------------------------------------------------------------------------------------------------------------|--------------|
| CC-001 | KPIs             | Display Loads MTD, Active Fleet, Monthly Revenue, active Branches and Total Depots with period comparison where applicable. | Must         |
| CC-002 | Actions          | Provide quick actions for New Load, Assign Driver, Track Load, Create Customer, Create Invoice and a More Actions launcher. | Must         |
| CC-003 | Load Status      | Show current-month status breakdown for Draft, Assigned/Planned, In Transit/Active, Delivered/Completed and Cancelled.      | Must         |
| CC-004 | Operational Feed | Show recent loads, unread messages, support ticket summary, driver alerts and maintenance due cards.                        | Must         |
| CC-005 | Finance Snapshot | Show pending invoice total and near-due invoices with customer, amount and due timing.                                      | Must         |
| CC-006 | Navigation       | Each card and View All action must open the relevant filtered module.                                                       | Must         |
| CC-007 | Refresh          | Dashboard data must show last refresh time and support automatic refresh without resetting user context.                    | Should       |

###### Acceptance Criteria

- Authorised users see only KPI values and records within their company and branch scope.

- Clicking a status count opens Loads pre-filtered to that status and reporting period.

- Critical/overdue alerts are visually distinct and sorted ahead of informational items.

- Dashboard totals reconcile with the source modules for the same filters and date range.

### 7. Loads and Dispatch

**Purpose.** Create, plan, assign, monitor, complete, cancel, import and export loads across the organisation.

**Primary data displayed or captured.** Load reference/PO, customer, type, cargo, stops, addresses/geocodes, pickup windows, delivery window, driver, vehicle, branch, progress, pricing, documents, issues and timestamps.

**Key business rules.**

- Load references must be unique within the company.

- Dangerous Goods loads trigger specialised driver, vehicle, document and checklist requirements.

- All changes after dispatch are audited.

| **ID** | **Area**       | **Requirement**                                                                                                                                 | **Priority** |
|--------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| LD-001 | List           | Display load reference, status/sub-status, type, customer, route/stops, driver/vehicle, pickup date, ETA/delivery, progress and actions.        | Must         |
| LD-002 | Statuses       | Support Draft, Planned/Assigned, Active, Completed and Cancelled with configured sub-statuses such as Ready, En Route, At Stop and Delivered.   | Must         |
| LD-003 | Filters        | Filter by status, load type, customer, driver, vehicle, location, date and advanced criteria; support reset.                                    | Must         |
| LD-004 | Table Controls | Support column selection, grouping, sorting, pagination and selectable rows.                                                                    | Should       |
| LD-005 | Bulk Actions   | Allow authorised users to assign a driver, mark completed, cancel or export selected loads with validation.                                     | Must         |
| LD-006 | Create/Edit    | New Load must capture customer, load type, references, origin, destination, stops, cargo, dates, service requirements, pricing and attachments. | Must         |
| LD-007 | Assignment     | Assign an available and compliant driver and suitable vehicle; warn or block invalid assignments.                                               | Must         |
| LD-008 | Progress       | Calculate route/load progress based on completed stops or live trip state and show exceptions.                                                  | Must         |
| LD-009 | Import/Export  | Import loads from a validated template and export the current view or selected rows.                                                            | Should       |
| LD-010 | Alerts         | Show load-specific delay risk, missing documents, break warnings and other operational alerts.                                                  | Must         |
| LD-011 | History        | Maintain status, assignment, pricing, stop and document change history.                                                                         | Must         |

###### Acceptance Criteria

- A Draft load can be saved without assignment; an Active trip cannot begin until required validations pass.

- A driver or vehicle cannot be assigned if unavailable, out of service or blocked by mandatory compliance, unless a permitted override exists and is audited.

- Cancelling a load requires a reason and prevents further trip updates unless restored by an authorised role.

- Completing a load requires all mandatory stops and proof-of-delivery requirements to be satisfied or an audited exception approval.

- Bulk actions return per-record success/failure results rather than silently skipping invalid loads.

### 8. AI Load Inbox

**Purpose.** Collect field-submitted, email, portal and file-upload load drafts, extract structured details and route them to an authorised reviewer for dispatch.

**Primary data displayed or captured.** Source type, original content/attachment, extracted fields, field confidence, urgency, validation issues, reviewer, review time and resulting load ID.

**Key business rules.**

- AI outputs are advisory and must never bypass role, safety, compliance or financial controls.

- Uploaded content must be malware-scanned and access-controlled.

| **ID** | **Area**            | **Requirement**                                                                                                   | **Priority** |
|--------|---------------------|-------------------------------------------------------------------------------------------------------------------|--------------|
| AI-001 | Sources             | Support draft creation from Email Booking, Customer Portal, PDF/File Upload and manual entry.                     | Must         |
| AI-002 | Queue               | Display draft ID, source reference, urgency, confidence, received time, driver, vehicle, cargo and route summary. | Must         |
| AI-003 | Filters             | Filter by All Inbox, source, urgency and confidence; search by draft ID, driver, route or PO reference.           | Must         |
| AI-004 | Review              | Open a review screen showing original source content beside extracted fields and validation warnings.             | Must         |
| AI-005 | Correction          | Allow authorised users to edit extracted data before conversion to a real load.                                   | Must         |
| AI-006 | Confidence          | Assign High, Medium or Low confidence at field and draft level, with configurable review thresholds.              | Should       |
| AI-007 | Dispatch            | Convert an approved draft into a load and optionally assign/dispatch it in one controlled workflow.               | Must         |
| AI-008 | Duplicate Detection | Warn when source reference, PO, customer, route and dates indicate a possible duplicate.                          | Should       |
| AI-009 | Audit               | Retain source file/message, extracted values, reviewer changes and approval result.                               | Must         |

###### Acceptance Criteria

- No AI-generated draft becomes an active operational load without an authorised human confirmation.

- Required fields and compliance validations must pass before dispatch.

- Low-confidence fields are highlighted and reviewer correction is recorded.

- Urgent drafts are sorted above normal drafts and may generate notifications.

- Converting a draft creates a link between the inbox record and final load.

### 9. Customers

**Purpose.** Maintain customer accounts, contacts, service preferences, contracts, pricing relationships, billing data and operational history.

**Primary data displayed or captured.** Customer identity, contacts, billing and service addresses, tax/registration details, credit/payment terms, branches, contracts, rate cards, portal users and status.

**Key business rules.**

- A customer may operate across multiple branches and have multiple authorised contacts.

- Customer-specific rates override standard rates only when active and date-valid.

| **ID** | **Area**        | **Requirement**                                                                                                                  | **Priority** |
|--------|-----------------|----------------------------------------------------------------------------------------------------------------------------------|--------------|
| CU-001 | Customer Master | Create, view, edit, archive and search customer records.                                                                         | Must         |
| CU-002 | Profile         | Store legal name, trading name, account code, addresses, contacts, tax details, payment terms and assigned sales representative. | Must         |
| CU-003 | Operations      | Show customer loads, active shipments, delivery issues, PODs and service notes.                                                  | Must         |
| CU-004 | Commercial      | Associate customer rate cards, contracts, credit terms, discounts and fuel surcharge rules.                                      | Must         |
| CU-005 | Finance         | Show invoices, outstanding amount, overdue balance and payment history subject to permission.                                    | Must         |
| CU-006 | Portal Access   | Invite, suspend and manage customer portal users.                                                                                | Should       |
| CU-007 | Documents       | Link contracts, PODs, insurance, account forms and other customer documents.                                                     | Must         |
| CU-008 | Status          | Support Prospect, Active, On Hold and Archived customer states.                                                                  | Should       |

###### Acceptance Criteria

- Customer account codes are unique within the company.

- Archived customers remain available for historical reporting but cannot be selected for new loads unless reactivated.

- Credit hold or overdue rules can warn or block new bookings based on configured workflow.

- Sensitive financial/tax fields are visible only to authorised roles.

### 10. Live Tracking

**Purpose.** Provide real-time map visibility, telemetry, route monitoring, fleet state and actionable alerts.

**Primary data displayed or captured.** Vehicle ID, driver, coordinates, event timestamp, speed, state, heading, sensor readings, load, route, ETA and alert state.

**Key business rules.**

- Telemetry frequency depends on the connected provider and plan; the UI must not claim “live” when data is stale.

- All timestamps are stored in UTC and displayed in the relevant local time zone.

| **ID** | **Area**      | **Requirement**                                                                                                        | **Priority** |
|--------|---------------|------------------------------------------------------------------------------------------------------------------------|--------------|
| TR-001 | Map           | Display active vehicles on a map with pan, zoom, reset and map settings.                                               | Must         |
| TR-002 | Fleet KPIs    | Show active vehicles, on-time rate, critical alerts and average fleet speed.                                           | Must         |
| TR-003 | Vehicle Panel | Search and filter vehicles by All, In Transit, Idle, Alert and Maintenance.                                            | Must         |
| TR-004 | Telemetry     | Show last location, timestamp, speed, heading, ignition/state and available sensor information.                        | Must         |
| TR-005 | Load Context  | Link tracked vehicle to current driver, active load, route, stops, ETA and issues.                                     | Must         |
| TR-006 | Alerts        | Generate geofence, route deviation, excessive idle, sensor, speed, connectivity and ETA alerts based on configuration. | Should       |
| TR-007 | History       | Provide authorised playback or location history for a selected period.                                                 | Should       |
| TR-008 | Privacy       | Apply retention, role access and masking rules to driver/location data.                                                | Must         |

###### Acceptance Criteria

- The map displays a clear “last updated” time and stale/offline state.

- Selecting a vehicle opens its current load and telemetry summary.

- Critical alerts can be acknowledged, assigned and linked to a delivery issue.

- Tracking data is restricted by company and branch scope.

- Temporary telemetry loss does not overwrite the last known valid position.

### 11. Drivers

**Purpose.** Manage driver identity, contact details, licences, employment/engagement status, branch, availability, assignments, compliance and performance.

**Primary data displayed or captured.** Driver ID, name, DOB/age display, phone/email, address, branch, licence number/class/state/expiry, status, documents, training, assignments and performance.

**Key business rules.**

- Age should be calculated from DOB rather than stored as an independent value.

- Driver recommendations must consider availability, qualifications, location, hours/fatigue, route experience and branch rules when data is available.

| **ID** | **Area**     | **Requirement**                                                                                                   | **Priority** |
|--------|--------------|-------------------------------------------------------------------------------------------------------------------|--------------|
| DR-001 | List         | Display driver name, ID, contact, licence, status, branch, assignment, compliance and action menu.                | Must         |
| DR-002 | Profile      | Create and maintain personal/contact details, licence classes, employment details, emergency contacts and branch. | Must         |
| DR-003 | Availability | Support On Duty, Off Duty, On Leave and Unavailable states with effective dates/reasons.                          | Must         |
| DR-004 | Compliance   | Track licence, medical, fatigue, training, dangerous goods and other required documents with expiry.              | Must         |
| DR-005 | Assignment   | Show current and upcoming load assignments and prevent conflicting assignment.                                    | Must         |
| DR-006 | Performance  | Calculate/display compliance and operational performance indicators with transparent definitions.                 | Should       |
| DR-007 | Insights     | Provide expiring-document alerts, suggested drivers and performance watch lists.                                  | Should       |
| DR-008 | Bulk         | Support driver import, document upload, availability calendar and export.                                         | Should       |
| DR-009 | Portal       | Manage driver portal access, activation and reset/security actions.                                               | Should       |

###### Acceptance Criteria

- A driver cannot start a load when a mandatory licence, medical or checklist requirement is invalid.

- Availability changes immediately affect assignment suggestions and validation.

- Expiring soon uses the configured warning threshold and shows the exact expiry date.

- Compliance score calculation is documented and does not hide the underlying missing/expiring items.

- Sensitive personal fields are restricted and audited when viewed or edited.

### 12. Vehicles

**Purpose.** Maintain the fleet register, current assignments, status, odometer, service schedules, compliance and operating condition.

**Primary data displayed or captured.** Vehicle ID, registration, VIN/chassis, type, make, model, year, branch, status, driver, odometer, capacity, service schedule, compliance and documents.

**Key business rules.**

- Maintenance due may be time-based, distance-based or both.

- Vehicle type and capacity must be validated against load requirements.

| **ID** | **Area**      | **Requirement**                                                                                                      | **Priority** |
|--------|---------------|----------------------------------------------------------------------------------------------------------------------|--------------|
| VH-001 | List          | Display vehicle ID/name, registration, type/make/model, year, status, driver, odometer, compliance and next service. | Must         |
| VH-002 | Profile       | Store ownership, specifications, capacity, branch, registration, insurance, roadworthy and operational attributes.   | Must         |
| VH-003 | Status        | Support Active, In Maintenance, Out of Service, Sold and Inactive states.                                            | Must         |
| VH-004 | Assignment    | Associate current driver/load and retain assignment history.                                                         | Must         |
| VH-005 | Maintenance   | Track scheduled and corrective maintenance, odometer thresholds, costs and due/overdue status.                       | Must         |
| VH-006 | Compliance    | Track registration, insurance, roadworthy and configured compliance documents.                                       | Must         |
| VH-007 | Insights      | Show overdue compliance, upcoming service and maintenance recommendations.                                           | Should       |
| VH-008 | Import/Export | Support controlled bulk import and export of the fleet register.                                                     | Should       |

###### Acceptance Criteria

- Out-of-service, sold or inactive vehicles cannot be assigned to new loads.

- A compliance or maintenance block prevents trip start unless an explicit, authorised exception process is configured.

- Odometer updates retain source and timestamp.

- Vehicle list totals reconcile with status and compliance summaries.

- Registration numbers are unique within the relevant jurisdiction/company rule.

### 13. Branches

**Purpose.** Configure and manage organisational branches, depots and operational locations across countries.

**Primary data displayed or captured.** Name, code, legal company, address, country, region, manager, status, branch type, phone, time zone, currency, established date and setup state.

**Key business rules.**

- Depots may be represented as branches or subordinate locations depending on final data architecture; this requires confirmation.

- Branch deletion is not allowed after transactional activity; use status-based closure.

| **ID** | **Area** | **Requirement**                                                                                        | **Priority** |
|--------|----------|--------------------------------------------------------------------------------------------------------|--------------|
| BR-001 | List     | Display branch name/code, company, country, state/region, manager, status and recent load volume.      | Must         |
| BR-002 | Profile  | Capture address, contact, time zone, currency, branch type, manager and operating details.             | Must         |
| BR-003 | Status   | Support Active, Inactive, Pending Setup and Closed.                                                    | Must         |
| BR-004 | Summary  | Show branch totals, top branches by load volume and location map.                                      | Should       |
| BR-005 | Setup    | Provide branch setup checklist covering users, warehouse, pricing, integrations and required settings. | Should       |
| BR-006 | Bulk     | Support branch import and export with validation.                                                      | Could        |
| BR-007 | Scope    | Use branch assignments to restrict data access and default module filters.                             | Must         |

###### Acceptance Criteria

- Branch code is unique within the company.

- A branch cannot be closed while active loads, payroll runs or uncompleted operational tasks remain unless a migration/closure workflow is completed.

- Branch local time zone and currency are applied to relevant displays and records.

- Pending Setup branches are not available for normal operational assignment until mandatory setup items are complete.

### 14. Assets

**Purpose.** Manage non-vehicle operational assets such as forklifts, containers, material-handling equipment, generators, scanners, workshop equipment and PPE.

**Primary data displayed or captured.** Asset ID, QR value, name, category, type/model, serial number, branch, location, assignee, status, condition, service dates, compliance and documents.

**Key business rules.**

- Category-specific fields and maintenance schedules may be configurable.

- PPE may require per-user issue and expiry tracking.

| **ID** | **Area**    | **Requirement**                                                                                               | **Priority** |
|--------|-------------|---------------------------------------------------------------------------------------------------------------|--------------|
| AS-001 | Register    | Create and manage an asset register with asset ID, QR code, name, category, type, branch/location and status. | Must         |
| AS-002 | Assignment  | Assign assets to warehouses, yards, teams, users or other supported entities and retain history.              | Must         |
| AS-003 | Condition   | Track condition such as Good, Fair and Poor with inspection notes.                                            | Must         |
| AS-004 | Maintenance | Track next service, due, overdue and repair-required states.                                                  | Must         |
| AS-005 | Compliance  | Track certifications, inspections and expiry alerts where applicable.                                         | Must         |
| AS-006 | QR          | Generate and scan asset QR codes to open or update authorised asset records.                                  | Should       |
| AS-007 | Categories  | Allow authorised management of asset categories and types.                                                    | Should       |
| AS-008 | Bulk        | Support CSV import and export.                                                                                | Should       |

###### Acceptance Criteria

- Asset IDs are unique within the company.

- Out-of-service assets cannot be assigned to active operational use.

- Failed or overdue maintenance is clearly visible and may block task assignment according to category rules.

- Assignment and location changes are auditable.

- Compliance summaries reconcile with item-level records.

### 15. Warehouse

**Purpose.** Manage warehouse locations, inventory, stock movements, incoming/outgoing shipments, picking, put-away, transfers, cycle counts and operational alerts.

**Primary data displayed or captured.** Warehouse, item/SKU, unit, bin/location, lot/serial, expiry, quantities, cost/value, movement, task, shipment, branch and user.

**Key business rules.**

- Whether the warehouse is a full WMS or a lighter operational inventory module must be confirmed.

- Barcode support is recommended alongside QR where hardware permits.

| **ID** | **Area**       | **Requirement**                                                                                           | **Priority** |
|--------|----------------|-----------------------------------------------------------------------------------------------------------|--------------|
| WH-001 | Warehouse List | Display warehouse name/code, branch/location, type, status, stock items, inventory value and utilisation. | Must         |
| WH-002 | Inventory      | Track item/SKU, quantities by Available, Reserved, In Transit and On Order, location/bin and value.       | Must         |
| WH-003 | Movements      | Record stock in, stock out, transfers and adjustments with reason, user and timestamp.                    | Must         |
| WH-004 | Tasks          | Create and manage pick, put-away, transfer and cycle-count tasks with due times and owners.               | Must         |
| WH-005 | Shipments      | Track incoming and outgoing shipments and link to loads or purchase orders where applicable.              | Must         |
| WH-006 | Alerts         | Generate low-stock, expiry, overdue-task and shipment-arrival alerts.                                     | Must         |
| WH-007 | Dashboard      | Show warehouse KPIs, locations, inventory summary, movements, pending tasks and recent activity.          | Must         |
| WH-008 | Controls       | Prevent negative inventory unless authorised adjustment rules allow it.                                   | Must         |
| WH-009 | Export         | Export warehouse and stock views subject to permission.                                                   | Should       |

###### Acceptance Criteria

- Every stock movement changes inventory through a controlled transaction and creates an immutable movement record.

- Reserved quantity cannot exceed available stock unless backorder/on-order rules are enabled.

- Transfers show source decrement and destination in-transit/receipt states.

- Inventory value uses the configured costing method and currency.

- Overdue tasks appear in alerts and may be escalated to supervisors.

### 16. Pricing and Rate Cards

**Purpose.** Configure company-wide and customer-specific pricing for freight lanes, vehicle classes, fuel surcharge and contract rates.

**Primary data displayed or captured.** Rate card, customer, origin, destination, distance band, vehicle/load type, base rate, minimum charge, per-km rate, fuel surcharge, currency, tax and effective dates.

**Key business rules.**

- Tax calculation may be delegated to Finance/accounting configuration.

- Route distance source and rounding rules must be configured.

| **ID** | **Area**       | **Requirement**                                                                                     | **Priority** |
|--------|----------------|-----------------------------------------------------------------------------------------------------|--------------|
| PR-001 | Lane Pricing   | Manage origin/destination, minimum charge, base linehaul, per-kilometre rate, fuel levy and status. | Must         |
| PR-002 | Vehicle Matrix | Configure rates by vehicle type/class and applicable load/service conditions.                       | Must         |
| PR-003 | Customer Rates | Create customer-specific rate cards with effective dates and priority over standard rates.          | Must         |
| PR-004 | Fuel Matrix    | Configure surcharge percentages by fuel index, region, date range or rule.                          | Must         |
| PR-005 | Calculation    | Calculate quoted/load charge using the applicable rate hierarchy and retain a pricing breakdown.    | Must         |
| PR-006 | Import/Export  | Import validated rate sheets and export pricing to Excel.                                           | Should       |
| PR-007 | Approval       | Optionally require approval for new or changed rate cards.                                          | Should       |
| PR-008 | Versioning     | Retain effective dates, version history and who changed a rate.                                     | Must         |

###### Acceptance Criteria

- The pricing engine selects the most specific active rate in a documented order: customer special rate, contract rate, lane/vehicle rate, then manual permitted rate.

- Expired or future rates do not apply outside their effective period.

- Pricing changes do not retroactively alter an approved load or invoice unless an authorised repricing action is completed.

- Manual overrides require reason and permission and are audited.

- Imported rows return clear validation errors.

### 17. Payroll

**Purpose.** Manage driver and staff payroll runs, approved timesheets, mileage and allowances, payslips, bank export and Single Touch Payroll readiness.

**Primary data displayed or captured.** Pay run, employee/driver, pay period, branch, hours, trips, mileage, rates, allowances, deductions, gross, tax/super fields, net, approval, payslip and export status.

**Key business rules.**

- Actual payroll and STP implementation must be validated by an Australian payroll specialist and supported provider.

- The system may integrate with a payroll platform instead of calculating every statutory value internally.

| **ID** | **Area**   | **Requirement**                                                                        | **Priority** |
|--------|------------|----------------------------------------------------------------------------------------|--------------|
| PY-001 | Runs       | Create weekly, fortnightly or configured payroll runs by branch and pay period.        | Must         |
| PY-002 | Timesheets | Import or calculate approved hours, trips, mileage, overtime and other earning inputs. | Must         |
| PY-003 | Rates      | Apply employee/driver pay rates, allowances, deductions and configured rules.          | Must         |
| PY-004 | Review     | Provide draft, pending review, approved, completed and failed/cancelled states.        | Must         |
| PY-005 | Breakdown  | Show driver/employee pay breakdown and exceptions before approval.                     | Must         |
| PY-006 | Payslips   | Generate downloadable payslips after approval/completion.                              | Must         |
| PY-007 | ABA        | Generate an authorised ABA/bank payment file with validation and audit.                | Must         |
| PY-008 | STP        | Prepare STP-compliant output or integration status and lodgement readiness.            | Must         |
| PY-009 | Export     | Export payroll summaries and reconciliation reports.                                   | Should       |

###### Acceptance Criteria

- Only approved timesheets and earnings inputs are included in an approvable pay run.

- A completed pay run is locked from direct editing; corrections use adjustment or reversal workflows.

- ABA and STP exports require explicit permission and are logged.

- Payroll totals reconcile to individual employee/driver breakdowns.

- Sensitive payroll data is not visible to operational roles without finance/payroll permission.

### 18. Finance

**Purpose.** Provide financial visibility and operational transaction management for revenue, expenses, invoices, receivables, payables, cash position and profitability.

**Primary data displayed or captured.** Invoice, customer, load, line items, tax, due date, status, payment, transaction, expense category, branch, bank/accounting reference and currency.

**Key business rules.**

- The accounting system of record must be designated during implementation.

- Cross-currency consolidation rules require confirmation.

| **ID** | **Area**         | **Requirement**                                                                                                           | **Priority** |
|--------|------------------|---------------------------------------------------------------------------------------------------------------------------|--------------|
| FN-001 | Dashboard        | Show total revenue, expenses, net profit, outstanding invoices, cash in bank and overdue invoices with period comparison. | Must         |
| FN-002 | Charts           | Show revenue, expenses and cash flow trends for the selected date range.                                                  | Must         |
| FN-003 | Invoices         | Create, view, issue, send, mark/record payment, credit and cancel invoices according to workflow.                         | Must         |
| FN-004 | Transactions     | Record authorised income/expense transactions with category, branch, reference and attachments.                           | Must         |
| FN-005 | Receivables      | Track outstanding and overdue invoices, ageing and reminders.                                                             | Must         |
| FN-006 | Expense Analysis | Show expense category breakdown such as fuel, staff, maintenance, warehouse and other.                                    | Must         |
| FN-007 | Cash Position    | Show cash in bank, accounts receivable, accounts payable and available credit when connected data exists.                 | Should       |
| FN-008 | Filters/Export   | Filter by branch, payment status and date; export authorised reports.                                                     | Must         |
| FN-009 | Integration      | Synchronise with configured accounting/payment systems and surface sync status/errors.                                    | Should       |

###### Acceptance Criteria

- Financial dashboard values reconcile to the underlying transactions or connected accounting source.

- Invoice totals match line items, tax, surcharge, discounts and payments/credits.

- Editing an issued invoice follows controlled revision/credit rules rather than silent overwrite.

- Payment gateway status is not treated as final settlement until the system receives a verified result.

- Currency and branch scope are explicit in all financial totals.

### 19. Documents Repository

**Purpose.** Provide a secure, searchable document vault for company, driver, vehicle and customer documents, including compliance status and entity linkage.

**Primary data displayed or captured.** Document ID, title, file, MIME type, size, checksum, category, entity, tags, issue/expiry, verification status, access scope, uploader and versions.

**Key business rules.**

- Retention policies may differ for PODs, contracts, payroll and safety evidence.

- Electronic signature requirements are not fully specified and may require a later integration.

| **ID** | **Area**   | **Requirement**                                                                                          | **Priority** |
|--------|------------|----------------------------------------------------------------------------------------------------------|--------------|
| DO-001 | Folders    | Organise documents under Company, Driver, Vehicle and Customer categories with optional subfolders/tags. | Must         |
| DO-002 | Upload     | Upload supported file types with title, category, entity, status, issue/expiry dates and access scope.   | Must         |
| DO-003 | List       | Display title, category, associated entity, size, uploaded by, upload date, status and actions.          | Must         |
| DO-004 | Search     | Search by document title, entity, category, reference or tags and filter by status/expiry.               | Must         |
| DO-005 | Versioning | Support replacement/new versions without losing historical evidence.                                     | Must         |
| DO-006 | Compliance | Generate expiry alerts and feed driver/vehicle/company compliance state.                                 | Must         |
| DO-007 | Security   | Scan uploads, enforce role/entity access and prevent public unauthorised URLs.                           | Must         |
| DO-008 | Audit      | Log upload, view/download where required, change, verify and delete/archive actions.                     | Must         |

###### Acceptance Criteria

- A document linked to a required compliance item affects compliance status after verification according to configuration.

- Deleting an in-use compliance record uses archive/retention rules rather than irreversible removal.

- File type, size and malware validation occurs before the document becomes available.

- Users cannot access documents outside company/branch/entity permissions even with a guessed URL.

- Version history identifies the active version.

### 20. Reports and Analytics

**Purpose.** Enable authorised users to access, generate, export, schedule and analyse operational, financial, compliance and AI insight reports.

**Primary data displayed or captured.** Report definition, category, parameters, filters, dataset, owner, schedule, recipients, format, run history, download and status.

**Key business rules.**

- Emailing reports containing sensitive data must follow data classification rules.

- Exact report catalogue should be maintained as a separate report specification.

| **ID** | **Area**      | **Requirement**                                                                              | **Priority** |
|--------|---------------|----------------------------------------------------------------------------------------------|--------------|
| RP-001 | Catalogue     | Organise reports into Operations, Financial, Compliance and Analytics & Insights categories. | Must         |
| RP-002 | Search/Filter | Search by name/category/keyword and filter by type, status and date range.                   | Must         |
| RP-003 | Run           | Generate reports with user-selected parameters and branch/company scope.                     | Must         |
| RP-004 | Export        | Export supported formats such as PDF, CSV and Excel based on report type.                    | Must         |
| RP-005 | Schedule      | Schedule reports with recurrence, recipients, filters, format and active status.             | Must         |
| RP-006 | Favourites    | Allow users to favourite reports and view recent history.                                    | Should       |
| RP-007 | Custom Report | Provide a controlled custom report builder using approved datasets/fields.                   | Should       |
| RP-008 | Insights      | Surface AI-generated or rule-based trends and risks with supporting data links.              | Should       |
| RP-009 | Audit         | Track generated, downloaded and scheduled report activity.                                   | Must         |

###### Acceptance Criteria

- Report results respect the requesting user’s permissions and branch scope.

- Scheduled reports do not send data to unauthorised recipients.

- Every report displays report period, data refresh time, filters and currency/time-zone context.

- AI insights link to the data or records supporting the statement and are labelled as insights, not audited facts.

- Large exports are processed reliably with status and error reporting.

### 21. Messages

**Purpose.** Provide a central communication hub for direct messages, teams, drivers, warehouses, branches, customers, announcements and message analytics.

**Primary data displayed or captured.** Conversation, participant, entity, message body, channel, attachments, timestamps, delivery/read status, branch, announcement audience and template.

**Key business rules.**

- Email/SMS/portal delivery may be represented in one conversation with channel-specific statuses.

- Moderation and retention rules require company policy confirmation.

| **ID** | **Area**      | **Requirement**                                                                              | **Priority** |
|--------|---------------|----------------------------------------------------------------------------------------------|--------------|
| MS-001 | Inbox         | Show unread-first inbox with participant, role/entity, preview, time and unread count.       | Must         |
| MS-002 | Conversations | Create and continue authorised one-to-one or group conversations.                            | Must         |
| MS-003 | Participants  | Support users, drivers, teams, branches, warehouses and customers according to access rules. | Must         |
| MS-004 | Announcements | Create and publish targeted announcements with author, date and audience.                    | Must         |
| MS-005 | Broadcast     | Send broadcast/alert messages to permitted audiences with confirmation.                      | Should       |
| MS-006 | Templates     | Create and use approved message templates and automated message content.                     | Should       |
| MS-007 | Attachments   | Attach authorised documents/images with secure storage and scanning.                         | Should       |
| MS-008 | Status        | Track sent, delivered, failed and read state where supported.                                | Should       |
| MS-009 | Analytics     | Show message activity, replies, read rate and delivery success.                              | Should       |

###### Acceptance Criteria

- Unread counts update when messages are opened/read and reconcile with the menu badge.

- Users can message only participants available within their permission and company scope.

- Broadcasts require confirmation and are audited.

- Delivery status accurately reflects the connected channel and does not falsely indicate read state.

- Archived or deleted conversation behaviour follows retention policy.

### 22. Support and Knowledge Base

**Purpose.** Allow users to raise, track, triage and resolve support requests while providing searchable self-service articles and FAQs.

**Primary data displayed or captured.** Ticket ID, requester, subject, description, category, priority, status, owner, related entity, comments, attachments, SLA timestamps and resolution.

**Key business rules.**

- Support ownership may be internal staff or platform support; escalation paths require confirmation.

- Ticket dates in supplied examples are sample data.

| **ID** | **Area**       | **Requirement**                                                                               | **Priority** |
|--------|----------------|-----------------------------------------------------------------------------------------------|--------------|
| SP-001 | My Tickets     | Show a user’s tickets with ID, subject, status, priority, created/updated dates and details.  | Must         |
| SP-002 | Open Tickets   | Provide authorised company-wide queue with search and priority/status filtering.              | Must         |
| SP-003 | Create         | Raise a ticket with category, subject, description, priority, attachments and related entity. | Must         |
| SP-004 | Workflow       | Support Open, In Progress, Waiting and Resolved/Closed statuses with owner and history.       | Must         |
| SP-005 | Comments       | Support requester/support replies, internal notes and attachments.                            | Must         |
| SP-006 | SLA            | Track response and resolution targets by priority where configured.                           | Should       |
| SP-007 | Knowledge Base | Search and browse categories and popular articles.                                            | Must         |
| SP-008 | Article Admin  | Authorised users can create, edit, publish, unpublish and categorise articles.                | Should       |
| SP-009 | Linking        | Link tickets to loads, invoices, drivers, vehicles, branches or system errors.                | Should       |

###### Acceptance Criteria

- A requester can view only their own tickets unless assigned broader support permission.

- Status changes and replies generate configured notifications.

- Resolved tickets retain full history and may be reopened according to policy.

- Internal notes are never visible to customer/driver requesters.

- Knowledge base search returns relevant published articles only.

### 23. Roles and Permissions Administration

**Purpose.** Create and maintain roles and granular module-level permissions while protecting system-defined roles and auditability.

**Primary data displayed or captured.** Role, description, system/custom flag, permissions, company, branch scope, assigned users, status and audit history.

**Key business rules.**

- Whether multiple roles combine permissions additively should be confirmed; additive access is recommended unless explicit deny rules are implemented.

- Permission naming must use a stable machine identifier plus user-friendly label.

| **ID** | **Area**   | **Requirement**                                                                            | **Priority** |
|--------|------------|--------------------------------------------------------------------------------------------|--------------|
| RB-001 | List       | Display role names, permission summary and actions.                                        | Must         |
| RB-002 | Create     | Create custom company roles with name, description and permission set.                     | Must         |
| RB-003 | Actions    | Support show, view, create, edit, delete, manage, export and module-specific permissions.  | Must         |
| RB-004 | Scope      | Support company-wide or branch-scoped roles and assignments.                               | Must         |
| RB-005 | Assign     | Assign one or more permitted roles to users according to the chosen access model.          | Must         |
| RB-006 | Protection | Prevent deletion of protected system roles and prevent removal of the final Company Admin. | Must         |
| RB-007 | Impact     | Show how many users are assigned before a role is changed or archived.                     | Should       |
| RB-008 | Audit      | Log role creation, permission changes, assignment and revocation.                          | Must         |

###### Acceptance Criteria

- A user cannot grant permissions they do not possess unless they hold a dedicated privilege administration permission.

- Backend endpoints enforce the same permission catalogue as the UI.

- Changing a role affects assigned users according to the documented session/token refresh rule.

- The system prevents lockout by protecting at least one active company administrator.

- Permission descriptions are human-readable and grouped by module.

### 24. Settings

**Purpose.** Centralise company configuration, setup progress, users, branches, integrations, AI, communication, workflow rules, notifications, security, audit logs and subscription details.

**Primary data displayed or captured.** Company profile, defaults, setup checklist, users, roles, branch configuration, integrations, credentials reference, workflows, notifications, security policy, plan and system status.

**Key business rules.**

- System health details visible to Company Admin must not expose sensitive infrastructure information.

- AI subscription and feature availability depend on plan and configuration.

| **ID** | **Area**       | **Requirement**                                                                                                                               | **Priority** |
|--------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| ST-001 | Dashboard      | Show company setup completion, active users, branches, integrations, AI subscription and system health.                                       | Must         |
| ST-002 | Checklist      | Provide setup checklist for Company Profile, Users & Roles, Branches, Integrations, Financial Settings, AI, Communication and Workflow Rules. | Must         |
| ST-003 | Company        | Manage company identity, branding, addresses, contacts, time zones, currency and defaults.                                                    | Must         |
| ST-004 | Integrations   | Connect/configure integrations and show connected, warning, failed and last-sync status.                                                      | Must         |
| ST-005 | Workflow Rules | Create controlled automation and approval rules with enable/disable state.                                                                    | Should       |
| ST-006 | Notifications  | Configure event/channel preferences, templates and escalation rules.                                                                          | Must         |
| ST-007 | Security       | Manage authentication policy, sessions, MFA policy, IP/session controls where supported and security logs.                                    | Must         |
| ST-008 | Audit Logs     | Search and export authorised system activity logs.                                                                                            | Must         |
| ST-009 | Subscription   | Show plan, usage, billing status and permitted subscription actions.                                                                          | Should       |
| ST-010 | System Health  | Show database, backup, storage, API and version/update status appropriate to the user role.                                                   | Should       |

###### Acceptance Criteria

- Only authorised administrators can change organisation-wide settings.

- Integration secrets are masked after save and never returned in plaintext.

- Disabling an integration or automation clearly shows downstream impact.

- Critical configuration changes require confirmation and audit logging.

- Setup percentage is based on documented checklist rules, not a hard-coded display value.

### 25. Safety Checklists

**Purpose.** Create and enforce pre-trip safety checklists that may block a driver from starting a trip until all mandatory items are completed.

**Primary data displayed or captured.** Checklist, version, applicability rules, item, response type, required flag, evidence, result, trip/load, driver, vehicle, timestamps and override.

**Key business rules.**

- Regulatory content must be approved by the organisation’s safety/compliance owner.

- Offline driver completion and later synchronisation may be required for remote operations.

| **ID** | **Area**      | **Requirement**                                                                                                 | **Priority** |
|--------|---------------|-----------------------------------------------------------------------------------------------------------------|--------------|
| SC-001 | Create        | Create checklists with name, code, description, target audience, trigger and items.                             | Must         |
| SC-002 | Items         | Configure item text, required/optional status, response type, evidence/photo requirement and failure behaviour. | Must         |
| SC-003 | Applicability | Target all drivers, qualifications, load types, vehicle types, branches or other supported conditions.          | Must         |
| SC-004 | Enforcement   | Enable strict execution that blocks trip start when required items are incomplete or failed.                    | Must         |
| SC-005 | Versioning    | Version published checklists and retain the exact version completed for each trip.                              | Must         |
| SC-006 | Preview       | Preview the driver experience before activation.                                                                | Should       |
| SC-007 | Status        | Activate, disable and view checklist usage without deleting historical results.                                 | Must         |
| SC-008 | Audit         | Record responses, evidence, device/user, time, location where permitted and any override.                       | Must         |
| SC-009 | Metrics       | Show total active/enforced checklists and trips blocked today.                                                  | Should       |

###### Acceptance Criteria

- A trip subject to an active strict checklist cannot start until all required items pass.

- A failed safety-critical item creates a blocking result and may create a delivery/maintenance issue.

- Disabling a checklist affects future triggers only and preserves prior responses.

- Overrides require a dedicated permission, reason and audit event.

- The driver sees clear guidance on incomplete or failed items.

### 26. Delivery Issues

**Purpose.** Capture, prioritise, assign and resolve delivery exceptions such as location problems, temperature alerts and customer refusals.

**Primary data displayed or captured.** Issue ID, load/shipment, stop, type, source, priority, status, owner, driver, vehicle, customer, evidence, notes, actions, timestamps and resolution.

**Key business rules.**

- The displayed “middle status column” requirement is included in the list view.

- Exact issue catalogue and automatic rules should be configurable.

| **ID** | **Area**  | **Requirement**                                                                                                | **Priority** |
|--------|-----------|----------------------------------------------------------------------------------------------------------------|--------------|
| DI-001 | Feed      | Display issue time, shipment/load reference, priority, source, issue type, summary, driver and current status. | Must         |
| DI-002 | Sources   | Support GPS, sensor, driver, customer, system and manual issue creation.                                       | Must         |
| DI-003 | Priority  | Support configurable severity such as Critical, High, Medium and Low.                                          | Must         |
| DI-004 | Status    | Support New/Open, Acknowledged, In Progress, Waiting, Resolved and Closed with a visible status column.        | Must         |
| DI-005 | Ownership | Assign issue owner/team, due time and escalation.                                                              | Must         |
| DI-006 | Details   | Show related load, stop, customer, driver, vehicle, telemetry/evidence, notes and timeline.                    | Must         |
| DI-007 | Actions   | Update status, add resolution notes, contact stakeholders, reattempt/reschedule and create related tasks.      | Must         |
| DI-008 | Logs      | Maintain status and resolution logs for tracking and audit.                                                    | Must         |
| DI-009 | Alerts    | Notify relevant users for critical/high issues and escalations.                                                | Must         |

###### Acceptance Criteria

- Critical issues are placed at the top and notify the configured escalation group.

- Resolving an issue requires a resolution category and note.

- Issue status changes are timestamped with actor and prior/new state.

- Sensor/GPS issues retain source data and do not become resolved solely because a later reading is normal unless the configured rule allows auto-resolution.

- A customer refusal can initiate reschedule, return, charge or cancellation workflow according to policy.

### 27. End-to-End Workflows

#### 27.1 New Load to Delivery Completion

1\. Authorised user creates a new load or reviews an AI Load Inbox draft.

2\. System validates customer, addresses/stops, dates, load type, cargo and required documents.

3\. Pricing engine calculates charges or a permitted user applies an audited override.

4\. Dispatcher selects a compliant, available driver and suitable active vehicle.

5\. System runs driver, vehicle, fatigue/availability, safety and dangerous-goods validations.

6\. Driver completes required pre-trip checklist; trip start remains blocked until mandatory checks pass.

7\. Live Tracking receives telemetry and updates ETA, route state and operational alerts.

8\. Driver completes stops and uploads required POD/evidence.

9\. Delivery issues are resolved or approved as exceptions.

10\. Load becomes Completed; invoice eligibility, payroll inputs, documents and reporting are updated.

#### 27.2 AI Draft Review and Dispatch

1\. A booking arrives by email, customer portal, file upload or manual intake.

2\. System stores the original source, extracts structured fields and calculates confidence.

3\. Duplicate, missing field, compliance and route warnings are displayed.

4\. Reviewer compares source and extracted data, corrects fields and records decision.

5\. Approved draft converts to a load; rejected/duplicate draft records a reason.

6\. Optional assignment/dispatch occurs only after standard load validations.

#### 27.3 Driver Assignment

1\. Dispatcher opens an unassigned load and requests driver suggestions or searches manually.

2\. System filters by branch, availability, licence/qualification, compliance, fatigue/hours, location and schedule conflicts.

3\. Vehicle suitability and availability are validated in parallel.

4\. Dispatcher confirms assignment; notifications are sent to the driver and relevant team.

5\. Reassignment records previous and new assignment plus reason.

#### 27.4 Safety Block and Override

1\. At trip start, system determines applicable active checklist version(s).

2\. Driver completes required items and provides evidence where configured.

3\. Incomplete or failed mandatory item blocks the trip and generates clear remediation guidance.

4\. Where policy permits, an authorised supervisor may override with reason and evidence.

5\. Trip starts only after successful completion or valid override; the result is permanently linked to the load.

#### 27.5 Delivery Issue Resolution

1\. Issue is created automatically or manually and classified by source/type/severity.

2\. System assigns or alerts the appropriate operational team.

3\. Owner acknowledges, investigates and records actions/communications.

4\. Issue may cause ETA update, reschedule, return, maintenance, customer refusal or other workflow.

5\. Resolution requires category and notes; status history remains visible.

#### 27.6 Invoice and Payment

1\. Completed/eligible load creates an invoice draft using approved load pricing and extras.

2\. Accounts user reviews tax, customer terms, line items, POD and references.

3\. Invoice is approved/issued and delivered to the customer through configured channels.

4\. Payment status is updated by gateway/accounting sync or authorised reconciliation.

5\. Overdue rules send reminders and update receivables reporting.

6\. Credits/cancellations use controlled finance workflows and retain audit history.

#### 27.7 Payroll Run

1\. Payroll user creates a run for branch and pay period.

2\. Approved timesheets, trips, mileage, allowances and deductions are loaded.

3\. System flags missing or inconsistent inputs.

4\. Authorised reviewer approves the run.

5\. Payslips, ABA/bank file and STP output/integration are generated as permitted.

6\. Completed run is locked; adjustments occur through a controlled process.

#### 27.8 Support Ticket

1\. User searches the Knowledge Base or raises a ticket.

2\. Ticket is categorised, prioritised and routed to an owner/team.

3\. Replies, internal notes, attachments and related entities are recorded.

4\. SLA/escalation events notify responsible users.

5\. Resolution is shared with requester and ticket is resolved/closed with history retained.

### 28. Data and Entity Model

The final physical database design may differ, but the product requires the following logical entities and relationships.

| **Entity**                                               | **Description**                                                          |
|----------------------------------------------------------|--------------------------------------------------------------------------|
| **Company / Tenant**                                     | Top-level data isolation, branding, defaults, subscription and settings. |
| **Branch / Depot / Location**                            | Operational scope, address, time zone, currency, manager and status.     |
| **User / Role / Permission**                             | Identity, authentication, company/branch scope and authorised actions.   |
| **Customer / Contact / Contract**                        | Customer master, portal users, terms, rate cards and agreements.         |
| **Load / Stop / Cargo / Assignment**                     | Shipment lifecycle, route, resources, status, pricing and history.       |
| **Driver / Driver Compliance / Availability**            | Driver identity, licences, documents, status and assignments.            |
| **Vehicle / Maintenance / Vehicle Compliance**           | Fleet register, service, odometer, status and documents.                 |
| **Asset / Asset Assignment / Asset Maintenance**         | Non-vehicle assets, condition, assignment and service.                   |
| **Warehouse / Inventory Item / Stock Balance**           | Locations, SKUs, quantities, value and bins.                             |
| **Stock Movement / Warehouse Task / Shipment**           | Transactional inventory and operational task history.                    |
| **Rate Card / Pricing Rule / Price Calculation**         | Commercial configuration, versioning and calculated breakdown.           |
| **Invoice / Payment / Credit / Transaction**             | Receivables, settlement and finance records.                             |
| **Payroll Run / Timesheet / Earning / Payslip**          | Payroll inputs, approvals, outputs and lock history.                     |
| **Document / Document Version / Compliance Requirement** | Files, metadata, entity linkage, expiry and verification.                |
| **Checklist / Checklist Version / Response**             | Safety configuration and immutable trip completion evidence.             |
| **Telemetry Event / Tracking Alert**                     | Location/sensor events, freshness and alert workflow.                    |
| **Delivery Issue / Issue Log**                           | Exception, priority, owner, status history and resolution.               |
| **Conversation / Message / Announcement**                | Communication records and delivery/read state.                           |
| **Support Ticket / Ticket Comment / KB Article**         | Support and self-service knowledge records.                              |
| **Report / Schedule / Report Run**                       | Report definitions, parameters, recipients and audit history.            |
| **Audit Event / Notification / Integration Sync**        | Traceability, alerts and external-system health.                         |

#### 28.1 Data Integrity Rules

- Every transactional entity includes company/tenant ID and, where relevant, branch ID.

- Soft delete/archive is used for records with historical or compliance value.

- Statuses use controlled enumerations and transitions rather than arbitrary free text.

- Money includes amount and ISO currency code; dates/times include time zone context.

- Files store checksum, MIME type, size, storage reference and access classification.

- All external identifiers and integration mappings are unique within their provider/company scope.

- Audit records are append-only and tamper-evident according to the selected architecture.

### 29. Integrations

| **Integration**                    | **Product Requirement**                                                                                                             |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **GPS / Telematics**               | Vehicle location, speed, state, route/ETA and alerts. Must support token rotation, last-sync status, retry and stale-data handling. |
| **Maps / Geocoding**               | Address lookup, route display, distance and geofence support. Provider quotas and map attribution must be respected.                |
| **Accounting (e.g., Xero)**        | Invoices, payments, accounts and reconciliation depending on system-of-record decision.                                             |
| **Payment Gateway (e.g., Stripe)** | Customer payments and verified payment status; secrets must be encrypted/masked.                                                    |
| **Email / SMTP**                   | Transactional email, report delivery, notifications and support communication.                                                      |
| **SMS Gateway**                    | Urgent alerts and configured operational/customer notifications.                                                                    |
| **Payroll / STP Provider**         | STP lodgement or compliant output, payroll reconciliation and status.                                                               |
| **Bank / ABA Export**              | File-based payment workflow with permissions, validation and audit.                                                                 |
| **AI / Document Extraction**       | Load intake extraction, recommendations and insights with human review and data controls.                                           |
| **File/Object Storage**            | Private document, POD, image and report storage with signed access and retention.                                                   |
| **Identity / MFA**                 | Secure user authentication, password policy, MFA and session controls.                                                              |
| **Sensors / IoT**                  | Temperature and other telemetry events where specialised loads require them.                                                        |

#### 29.1 Integration Behaviour

- Each integration exposes connection state, last successful sync, last error and a safe reconnect/test action.

- Transient failures use retry with backoff and do not create duplicate transactions.

- Inbound webhooks/events are authenticated, idempotent and logged.

- Outbound requests use correlation IDs and redact secrets/personal data from logs.

- The UI distinguishes connected, warning, failed and disabled states.

- Integration outages degrade gracefully and do not corrupt internal records.

### 30. Notifications and Automation

Notifications may be delivered through in-app, email, SMS and portal channels. Users can configure preferences subject to mandatory safety, security and compliance notifications.

| **Domain**          | **Example Events**                                                                                        |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| **Load**            | Created, assigned, reassigned, delayed, stop reached, completed, cancelled or missing required documents. |
| **Driver**          | Assignment, licence/medical expiry, compliance block, fatigue warning or availability change.             |
| **Vehicle**         | Maintenance due/overdue, compliance expiry, out-of-service state or telemetry alert.                      |
| **Warehouse**       | Low stock, expiry, overdue task, incoming shipment or transfer exception.                                 |
| **Finance**         | Invoice issued, due soon, overdue, paid, payment failed, sync error or approval required.                 |
| **Payroll**         | Timesheet missing, run ready for review, approved, completed or export failure.                           |
| **Documents**       | Upload verification, expiry warning, rejection or access request.                                         |
| **Support**         | Ticket created, assigned, replied, escalated, resolved or reopened.                                       |
| **Safety / Issues** | Checklist block, critical delivery issue, unresolved escalation or authorised override.                   |
| **System**          | Integration failure, backup warning, security event, permission change or maintenance notice.             |

### 31. Non-Functional Requirements

| **ID**  | **Area**           | **Requirement**                                                                                                                                                                              | **Priority** |
|---------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| NFR-001 | Availability       | Target service availability of at least 99.9% monthly for core admin operations, excluding planned maintenance agreed in the service policy.                                                 | Must         |
| NFR-002 | Performance        | Typical authenticated list/dashboard API responses should complete within 2 seconds at the 95th percentile under expected load; live tracking and heavy reports may use progressive loading. | Must         |
| NFR-003 | Scalability        | Architecture must scale by companies, branches, users, vehicles, telemetry events, loads, messages and documents without cross-tenant degradation.                                           | Must         |
| NFR-004 | Responsiveness     | Support modern desktop and tablet layouts; core workflows must remain usable at standard laptop resolutions.                                                                                 | Must         |
| NFR-005 | Accessibility      | Target WCAG 2.1 AA for keyboard access, contrast, labels, focus, error messages and screen-reader semantics.                                                                                 | Must         |
| NFR-006 | Browser Support    | Support current and previous major versions of Chrome, Edge and Safari unless contractually narrowed.                                                                                        | Must         |
| NFR-007 | Time/Currency      | Store time in UTC, display using branch/user time zone, and store/display ISO currency. AEST labels must account for daylight-saving zones where applicable.                                 | Must         |
| NFR-008 | Data Retention     | Retention must be configurable by document and data class, with legal hold where required.                                                                                                   | Must         |
| NFR-009 | Backup/Recovery    | Automated encrypted backups with tested restore process; target RPO/RTO must be agreed before production launch.                                                                             | Must         |
| NFR-010 | Observability      | Structured logs, metrics, tracing/correlation IDs, integration health and alerting are required for production support.                                                                      | Must         |
| NFR-011 | Import Reliability | Bulk imports provide pre-validation, row-level results, downloadable error file and idempotency/duplicate controls.                                                                          | Must         |
| NFR-012 | Export Reliability | Exports preserve filters and permissions and protect sensitive data; large exports use queued generation when needed.                                                                        | Must         |
| NFR-013 | Search             | Search is permission-aware and returns results within a usable response time for expected data volumes.                                                                                      | Must         |
| NFR-014 | Localisation       | Initial UI language may be English, with formatting designed to support future localisation.                                                                                                 | Must         |
| NFR-015 | Usability          | Destructive actions require confirmation; forms preserve user input after validation errors and provide clear success/failure feedback.                                                      | Must         |

### 32. Audit, Security and Compliance

| **ID**  | **Area**       | **Requirement**                                                                                                                        | **Priority** |
|---------|----------------|----------------------------------------------------------------------------------------------------------------------------------------|--------------|
| SEC-001 | Authentication | Secure password hashing, configurable password policy, MFA support for privileged users and account lock/rate-limit protections.       | Must         |
| SEC-002 | Authorisation  | Server-side RBAC and company/branch/object-level access checks on every protected action.                                              | Must         |
| SEC-003 | Sessions       | Secure, HttpOnly, SameSite cookies or equivalently protected tokens; session revocation and inactivity/absolute expiry.                | Must         |
| SEC-004 | Data Isolation | Prevent cross-company/tenant access in queries, storage paths, caches, exports and background jobs.                                    | Must         |
| SEC-005 | Encryption     | TLS in transit; encryption at rest for databases, backups and object storage; protect sensitive secrets using a secrets manager.       | Must         |
| SEC-006 | Input/Uploads  | Validate inputs, apply CSRF protections where applicable, scan uploads and prevent unsafe file execution.                              | Must         |
| SEC-007 | Audit          | Record privileged actions, finance/payroll exports, permission changes, overrides, document verification and security events.          | Must         |
| SEC-008 | Logging        | Redact credentials, tokens, payment data, personal documents and AI-extracted confidential content from logs.                          | Must         |
| SEC-009 | Privacy        | Apply least-data access, retention, export/deletion workflows and location-data controls aligned with applicable privacy requirements. | Must         |
| SEC-010 | Vulnerability  | Use dependency scanning, secure headers, rate limiting, penetration testing and remediation before production.                         | Must         |
| SEC-011 | Backups        | Encrypt backups, limit access, monitor completion and test restoration on a documented schedule.                                       | Must         |
| SEC-012 | Audit Export   | Only authorised roles may search/export audit logs; audit evidence must be protected from alteration.                                  | Must         |

#### 32.1 Minimum Audit Event Fields

- Event ID and timestamp

- Actor user/service and role

- Company and branch scope

- Action and affected module/entity

- Entity ID/reference

- Previous and new values for sensitive changes where appropriate

- Source IP/device/session correlation where lawful

- Outcome (success/failure) and failure reason

- Approval/override reason and linked evidence

- Integration correlation/reference when applicable

### 33. Analytics and Success Metrics

| **Metric Group** | **Representative Measures**                                                                                                      |
|------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Operational**  | On-time delivery rate, active load count, average dispatch time, load completion time, delays, issue rate and stop adherence.    |
| **Fleet**        | Vehicle utilisation, idle time, maintenance compliance, out-of-service time, average speed and telemetry coverage.               |
| **Driver**       | Compliance rate, document expiry risk, assignment utilisation, safety checklist completion and issue involvement.                |
| **Warehouse**    | Inventory accuracy, low-stock count, task cycle time, overdue tasks, stock turns and transfer accuracy.                          |
| **Commercial**   | Quote/load margin, rate override frequency, customer profitability, revenue by branch/type/customer and fuel surcharge recovery. |
| **Finance**      | Revenue, expenses, net profit, ageing, DSO, overdue exposure, cash position and invoice cycle time.                              |
| **Payroll**      | Timesheet approval rate, payroll correction rate, run completion time and export success.                                        |
| **Support**      | First response time, resolution time, SLA attainment, reopen rate and knowledge-base deflection.                                 |
| **Adoption**     | Active users, feature usage, report downloads, scheduled reports and completion of setup checklist.                              |
| **Quality**      | API error rate, integration sync failure, failed imports/exports, stale telemetry and security incidents.                        |

### 34. Release Scope and Prioritisation

#### 34.1 Must-Have Production Baseline

- Authentication, company/branch data isolation, RBAC and audit logging.

- Command Centre, Loads, Load Inbox review, Customers, Drivers, Vehicles and Branches.

- Live Tracking integration with freshness/alert handling.

- Safety Checklist trip blocking and Delivery Issue workflow.

- Documents and core compliance expiry tracking.

- Pricing, invoice/finance essentials and payroll run controls or validated external integrations.

- Warehouse core inventory transactions and task visibility.

- Messages, notifications and support tickets.

- Settings, integrations, backup/health visibility and export/import controls.

#### 34.2 Should-Have Enhancements

- AI extraction confidence, duplicate detection and driver/vehicle suggestions.

- Advanced warehouse utilisation, stock forecasting and scanner workflows.

- Custom report builder, report scheduling and AI insight explanations.

- Location history playback and advanced telemetry rules.

- Workflow rule builder and configurable approval chains.

- Customer and driver self-service enhancements.

#### 34.3 Future Opportunities

- Route optimisation and dynamic replanning.

- Predictive maintenance and parts forecasting.

- Automated proof-of-delivery validation and damage detection.

- Carbon/emissions reporting.

- Advanced mobile offline workflows.

- Marketplace/carrier partner integrations and inter-company load exchange.

### 35. QA, UAT and Definition of Done

#### 35.1 Test Coverage

- Unit tests for calculations, state transitions, permission checks and validation rules.

- API/integration tests for core services, webhooks, idempotency and error handling.

- End-to-end tests for major workflows defined in Section 27.

- Cross-role authorisation tests for allowed and forbidden actions.

- Cross-company/branch isolation tests including direct URL/API attempts.

- Import/export tests with valid, invalid, duplicate and large files.

- Accessibility, responsive layout and supported-browser tests.

- Performance/load tests for lists, dashboards, telemetry and reports.

- Security tests including OWASP controls, upload security and session management.

- Backup restoration and production rollback rehearsals.

#### 35.2 Definition of Done

- Functional requirement and acceptance criteria are implemented and demonstrably pass.

- Backend permissions and data isolation are tested; no reliance on UI-only restrictions.

- Error, empty, loading, offline/stale and permission-denied states are designed and implemented.

- Audit events exist for all identified sensitive actions.

- Automated tests pass and critical flows are covered by regression tests.

- No open critical/high severity defects for the release scope.

- Operational monitoring, alerts, backup and recovery steps are documented.

- User/admin guidance is updated and UAT sign-off is recorded.

- Production migration, rollback and integration credentials are controlled and reviewed.

### 36. Risks, Dependencies and Open Decisions

| **ID** | **Risk / Dependency**                                                                  | **Mitigation / Decision**                                                        |
|--------|----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| R-01   | Telemetry provider quality and frequency may vary, affecting “real-time” accuracy.     | Define freshness thresholds, offline state and provider SLA.                     |
| R-02   | Payroll/STP and finance rules carry regulatory and financial risk.                     | Use certified integrations or specialist validation; restrict and audit exports. |
| R-03   | Role and branch scope complexity can cause data leakage if implemented inconsistently. | Centralise authorisation and enforce tenant/branch filters server-side.          |
| R-04   | AI extraction may produce incorrect load details.                                      | Require review, field confidence, source comparison and validation.              |
| R-05   | Large telemetry, document and message volumes may increase cost/performance load.      | Define retention, tiered storage, indexing and asynchronous processing.          |
| R-06   | Mock screens contain inconsistent labels/status naming.                                | Adopt canonical status definitions in Appendix A and map display aliases.        |
| R-07   | Multi-country currency/tax/payroll treatment is not fully specified.                   | Confirm system of record and country-specific scope before build sign-off.       |
| R-08   | Warehouse scope may expand into full WMS complexity.                                   | Confirm SKU, lot, serial, bin, costing and barcode requirements.                 |
| R-09   | Integration outages can interrupt operations.                                          | Use queues, retry, idempotency, manual fallback and visible health status.       |
| R-10   | Sensitive personal, financial and location data increases privacy exposure.            | Implement data classification, least privilege, retention and monitoring.        |

#### 36.1 Open Decisions Requiring Stakeholder Confirmation

- Is the product strictly single-company or a SaaS multi-tenant platform managed by a Super Admin?

- Are depots separate entities under branches, or represented as branches/locations?

- Which accounting and payroll systems are the final systems of record?

- Which GPS/telematics and sensor providers will be supported at launch?

- Does the warehouse module require lot/serial tracking, barcode scanning and purchase-order management?

- What are the exact driver fatigue, dangerous-goods and safety compliance rules?

- What approvals are required for pricing changes, invoice issue, payroll, overrides and cancellations?

- What are the legal data retention periods by document/data category?

- Are Driver and Customer portals part of the same release and codebase?

- What is the final canonical status vocabulary shown in Appendix A?

### Appendix A. Canonical Status Definitions

| **Status**                         | **Definition**                                                                              |
|------------------------------------|---------------------------------------------------------------------------------------------|
| **Load - Draft**                   | Created but not ready for dispatch; may be incomplete or unassigned.                        |
| **Load - Planned / Assigned**      | Validated and scheduled; driver/vehicle may be assigned; trip not started.                  |
| **Load - Active**                  | Trip has started and is in progress, including En Route or At Stop.                         |
| **Load - Completed**               | Delivery obligations are complete and required evidence is available or exception-approved. |
| **Load - Cancelled**               | Load terminated with reason; operational execution stopped.                                 |
| **Driver - On Duty**               | Available or currently assigned within working rules.                                       |
| **Driver - Off Duty**              | Not currently working/assigned but not on approved leave.                                   |
| **Driver - On Leave**              | Unavailable due to approved leave.                                                          |
| **Driver - Unavailable**           | Unavailable for another reason such as medical restriction or suspension.                   |
| **Vehicle - Active**               | Operational and assignable subject to compliance/maintenance.                               |
| **Vehicle - In Maintenance**       | Temporarily unavailable while maintenance is in progress.                                   |
| **Vehicle - Out of Service**       | Blocked from operational use.                                                               |
| **Compliance - Compliant**         | All mandatory current requirements are valid.                                               |
| **Compliance - Expiring Soon**     | One or more requirements expire within the configured warning period.                       |
| **Compliance - Overdue / Expired** | At least one mandatory requirement is expired or overdue.                                   |
| **Support - Open**                 | Submitted and awaiting or undergoing initial handling.                                      |
| **Support - In Progress**          | Assigned and actively being worked.                                                         |
| **Support - Waiting**              | Blocked awaiting requester, third party or dependency.                                      |
| **Support - Resolved**             | Resolution provided; may transition to Closed after policy period.                          |
| **Issue - Acknowledged**           | Responsible user has accepted ownership/awareness.                                          |
| **Issue - Closed**                 | Resolution is complete and no further action remains.                                       |

### Appendix B. Permission Catalogue

The detailed permission list should be maintained as configuration, but the following actions form the baseline catalogue.

| **Module / Domain** | **Representative Permissions**                                                                        |
|---------------------|-------------------------------------------------------------------------------------------------------|
| **Common**          | show, view, create, edit, delete/archive, manage, export, import                                      |
| **Loads**           | assign driver, assign vehicle, dispatch, start override, complete, cancel, reprice, bulk action       |
| **Tracking**        | view current location, view history, acknowledge alert, manage geofences                              |
| **Drivers**         | manage personal data, manage compliance, manage availability, manage portal access                    |
| **Vehicles/Assets** | manage assignment, update odometer, manage maintenance, manage compliance                             |
| **Warehouse**       | manage stock, adjust inventory, create tasks, complete tasks, approve transfer                        |
| **Pricing**         | create rate, edit rate, approve rate, override price, import/export rates                             |
| **Payroll**         | view payroll, create run, approve run, complete run, generate ABA, generate STP, view payslip         |
| **Finance**         | create invoice, approve/issue invoice, record payment, credit/cancel, add transaction, export finance |
| **Documents**       | upload, download, verify, archive, manage access, view sensitive category                             |
| **Reports**         | run, export, schedule, manage recipients, create custom report                                        |
| **Messages**        | send, broadcast, manage templates, manage announcements, view analytics                               |
| **Support**         | create, view own, view company, assign, internal note, resolve, manage knowledge base                 |
| **Roles/Security**  | manage users, manage roles, grant permissions, view/export audit, manage security settings            |
| **Safety/Issues**   | manage checklist, enforce checklist, override block, acknowledge issue, assign issue, resolve issue   |
| **Settings**        | manage company, integrations, workflows, notifications, AI configuration, subscription and billing    |

### Appendix C. Screen Inventory

| **Module**            | **Required Screens / Views**                                                                                             |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Command Centre**    | Dashboard overview, KPI cards, quick actions, load status, messages, tickets, invoices, alerts, maintenance.             |
| **Loads**             | All Loads list, filters, columns/group/sort, bulk actions, overview and alerts.                                          |
| **Load Inbox**        | Inbox queue, source/confidence filters, draft review and dispatch.                                                       |
| **Customers**         | Customer list, profile, contacts, rates/contracts, loads, finance, documents and portal users.                           |
| **Live Tracking**     | Map, fleet list, telemetry card, load/route context and alerts.                                                          |
| **Drivers**           | Driver list, driver profile, documents/compliance, availability, assignments and insights.                               |
| **Vehicles**          | Vehicle list, profile, assignments, compliance and maintenance.                                                          |
| **Branches**          | Branch list, branch detail/setup, summary and location map.                                                              |
| **Assets**            | Asset list, asset profile, assignment, service, compliance and QR actions.                                               |
| **Warehouse**         | Warehouse dashboard/list, stock, movements, shipments, tasks and alerts.                                                 |
| **Pricing**           | Lane pricing, vehicle rates, customer rates, fuel surcharge and import/export.                                           |
| **Payroll**           | Payroll runs, pay breakdown, timesheets, rates/allowances and exports.                                                   |
| **Finance**           | Dashboard, invoices, transactions, receivables/payables and reports.                                                     |
| **Documents**         | Repository list, upload, view, verification, versioning and expiry.                                                      |
| **Reports**           | Dashboard, catalogue, run parameters, export centre, schedules and custom report.                                        |
| **Messages**          | Dashboard, inbox, conversation, announcements, templates, broadcast and analytics.                                       |
| **Support**           | My Tickets, Open Tickets, ticket detail, create ticket, KB home, category and article.                                   |
| **Roles**             | Role list, role detail, create/edit permission matrix and user assignment.                                               |
| **Settings**          | Dashboard, company, users, branches, integrations, financial, AI, communication, workflows, security, audit and billing. |
| **Safety Checklists** | Checklist list, builder, preview, applicability, enforcement and response history.                                       |
| **Delivery Issues**   | Issue list/feed, issue detail, status log, assignment and resolution.                                                    |

### Approval and Sign-Off

This PRD becomes the baseline for detailed UX specifications, technical architecture, estimates, sprint planning, QA test cases and UAT after stakeholder review and approval of open decisions.

| **Role**              | **Name / Signature** | **Date** |
|-----------------------|----------------------|----------|
| Product Owner         |                      |          |
| Operations Owner      |                      |          |
| Finance/Payroll Owner |                      |          |
| Engineering Lead      |                      |          |

---

## Part 2 — Dispatcher Portal

**Portal Scope:** Load creation, resource planning, active dispatch, driver communication and live GPS coordination.

**Source File:** `Hero_Logistics_Dispatcher_Portal_PRD_v1.0(2).md`

### Product Requirements Document

#### Hero Logistics Dispatcher Portal

**Real-Time Load Planning, Dispatch, Fleet Coordination and Driver Communication Platform**

| **Document Version** | 1.0 |
|---|---|
| **Prepared For** | Hero Logistics Product, Operations, Design, Engineering and QA Teams |
| **Prepared Date** | 5 August 2026 |
| **Product Type** | Role-based multi-branch logistics dispatch web application |
| **Primary Role** | Dispatcher |
| **Document Status** | Baseline PRD for UX, development, API design, QA and UAT |

**CONFIDENTIAL**

---

### Document Control

| **Item** | **Details** |
|---|---|
| **Product Owner** | Hero Logistics / Authorised Company Representative |
| **Primary User** | Dispatcher / Senior Dispatcher |
| **Supporting Users** | Company Admin, Drivers, Yard Staff, Warehouse Staff, Fleet Team, Branch Managers and Support Staff |
| **Related Portals** | Company Admin Portal, Driver Portal and authorised Customer Portal workflows |
| **Source Material** | Dispatcher portal menus, dashboards, forms, tables, filters, maps, planning screens and sample data supplied by the stakeholder |
| **Decision Rule** | Where exact behaviour was not specified, this PRD records a recommended product rule and identifies items requiring confirmation |

> **Sample-data notice:** Names, dates, load IDs, routes, registration numbers, customers, financial values, counts and telemetry shown in the supplied screens are illustrative. The source material contains examples from 2025 and 2026. Production logic must use live data, the company time zone and the authenticated user's branch scope rather than hard-coded sample values.

#### Revision History

| **Version** | **Date** | **Owner** | **Change Summary** |
|---|---|---|---|
| 1.0 | 5 Aug 2026 | Product Team | Initial baseline covering the complete Dispatcher Portal supplied by the stakeholder |

---

### Contents

1. Executive Summary  
2. Product Vision and Objectives  
3. Scope and Assumptions  
4. User Role, Access and Permissions  
5. Information Architecture  
6. Global UX and Shared Behaviour  
7. Dispatch Dashboard  
8. Load Lifecycle and Status Model  
9. Loads List  
10. Create Load — Quick Form  
11. Create Load Console  
12. Active Loads and Load Details  
13. Planning Board  
14. Live GPS Map  
15. Drivers  
16. Vehicles and Trailers  
17. Customers  
18. Yard and Warehouse  
19. Workforce Availability  
20. Messages  
21. Reports and Analytics  
22. Dispatcher Profile  
23. Notifications, Alerts and Escalations  
24. End-to-End Operational Workflows  
25. Business Rules and Validations  
26. Data and Entity Model  
27. Integration and API Requirements  
28. Security, Privacy and Audit  
29. Non-Functional Requirements  
30. Analytics and Success Metrics  
31. Release Scope and Priorities  
32. QA, UAT and Definition of Done  
33. Risks, Dependencies and Open Decisions  
Appendix A. Status Definitions  
Appendix B. Dispatcher Permission Matrix  
Appendix C. Screen Inventory  
Appendix D. Acceptance Checklist

---

### 1. Executive Summary

The Hero Logistics Dispatcher Portal is the operational workspace used to create, plan, assign, monitor and complete transport loads across company branches. It provides dispatchers with real-time visibility of active and planned loads, driver availability, vehicle and trailer availability, live GPS locations, route progress, delivery risks, yard and warehouse activity, workforce scheduling and driver communication.

The portal must serve as the dispatcher's single source of truth during live operations. It must enable rapid decision-making while preventing invalid or unsafe assignments. Load activation must be blocked when mandatory route, item, driver, vehicle, compliance or safety requirements are incomplete.

The product must support:

- Quick load creation for simple operational cases.
- A full load console based on the principle **Load → Stops → Items → Resources → Activation**.
- Multi-stop and multi-item transport, including car-carrying workflows.
- Real-time planning and drag-and-drop load allocation.
- Driver, vehicle, trailer and workforce availability checks.
- GPS tracking, route history, ETA monitoring and location sharing.
- Chain of Responsibility proof photos with time and GPS evidence.
- Exception management for delays, missing documents, compliance failures and unavailable resources.
- Dispatcher-to-driver and internal team communication.
- Role- and branch-scoped reporting.

---

### 2. Product Vision and Objectives

#### 2.1 Vision

Provide dispatch teams with a fast, reliable and highly visible command environment that turns load demand into safe, compliant and traceable transport execution.

#### 2.2 Business Objectives

- Reduce time required to create and dispatch a valid load.
- Improve utilisation of available drivers, trucks and trailers.
- Reduce assignment conflicts and double-booking.
- Improve on-time pickup and delivery performance.
- Detect and escalate delays before service commitments are breached.
- Ensure all mandatory safety, compliance and proof requirements are completed.
- Provide accurate and timely communication between dispatch, drivers, yards and warehouses.
- Maintain complete operational audit trails for load changes and dispatch decisions.
- Allow branch-level dispatch operations while supporting authorised cross-branch visibility.

#### 2.3 Product Principles

- **Operations first:** critical live information must be visible without excessive navigation.
- **Exception first:** delayed, blocked, urgent and non-compliant work must be prioritised.
- **Safe assignment:** unavailable, expired, unqualified or conflicting resources cannot be assigned without authorised override.
- **One source of truth:** every load must have a single current status, responsible branch and active assignment record.
- **Human-controlled optimisation:** automated or AI recommendations assist dispatchers but do not silently activate or modify loads.
- **Traceability:** all operationally significant actions must record actor, time, previous value, new value and reason where applicable.

---

### 3. Scope and Assumptions

#### 3.1 In Scope

- Dispatcher authentication and branch-scoped access.
- Dispatch Dashboard.
- Quick search and global operational filters.
- Create Load quick form.
- Full Create Load Console.
- All Loads and Active Loads.
- Load details, route, stops, items, documents, photos, notes and assignment.
- Planning Board and load optimisation recommendations.
- Live GPS Map, GPS history, route status and location sharing.
- Driver list, compliance visibility and limited driver creation where permission is granted.
- Vehicle and trailer availability, assignment and compliance visibility.
- Customer lookup, creation and operational details where permission is granted.
- Yard and warehouse operational visibility.
- Workforce availability and shift assignment.
- Messaging with drivers and operational teams.
- Dispatcher-authorised operational, fleet and compliance reports.
- Dispatcher profile, security and device management.
- Notifications, alerts, escalation and audit logs.

#### 3.2 Out of Scope for the Dispatcher Role by Default

- Company-wide pricing configuration.
- Finance, payroll, accounts payable or accounts receivable management.
- Subscription and billing administration.
- Company settings and integration credentials.
- Role and permission administration.
- Tenant or company administration.
- Destructive deletion of completed loads or legal evidence.
- Unrestricted editing of driver payroll or bank details.
- Final compliance waiver approval unless a specific permission is granted.

#### 3.3 Assumptions

- The organisation supports multiple branches and may operate in different time zones.
- The authenticated dispatcher has a home branch and optional additional branch access.
- Drivers use a related Driver Portal or mobile application to accept loads, complete checklists, upload proof and share GPS.
- Vehicles and trailers are maintained as separate assignable resources.
- A load may have multiple pickup and drop-off stops.
- A load may contain one or more freight items or transported vehicles.
- The product supports load types including Car Carrying, General Freight and Dangerous Goods; additional types may be configured.
- GPS telemetry is received from a mobile application, telematics provider or both.
- All timestamps are stored in UTC and displayed in the applicable branch/user time zone.
- Dispatch recommendations may use rules or AI, but activation requires authorised confirmation.

---

### 4. User Role, Access and Permissions

#### 4.1 Primary Persona

##### Dispatcher / Senior Dispatcher

The dispatcher manages day-to-day movement of loads and resources. Typical responsibilities include:

- Creating and validating loads.
- Planning routes and schedules.
- Assigning drivers, trucks and trailers.
- Monitoring active operations and ETAs.
- Responding to delays and exceptions.
- Communicating with drivers, yards, warehouses and customers through authorised channels.
- Reviewing operational reports.

#### 4.2 Access Scope

Access must be calculated from all of the following:

1. Tenant/company membership.
2. Assigned role.
3. Explicit permissions.
4. Branch scope.
5. Record ownership or assignment where applicable.
6. Data sensitivity classification.

#### 4.3 Recommended Dispatcher Permissions

| **Module** | **Default Access** | **Notes** |
|---|---|---|
| Dispatch Dashboard | View | Branch-scoped operational metrics |
| Loads | View, Create, Edit, Assign, Activate | Cancellation and completion may require reason |
| Planning Board | View, Plan, Assign | Optimisation remains confirm-before-apply |
| Live GPS | View, Track, Send Location | GPS history access must be audited |
| Drivers | View | Create/edit only when explicitly granted |
| Vehicles / Trailers | View | Assignment allowed; master-data edits restricted |
| Customers | View | Create limited customer record when explicitly granted |
| Yard / Warehouse | View | Task creation only where operationally required |
| Workforce Availability | View, Assign Shift | Subject to branch and workforce permissions |
| Messages | View, Send | Communication retention applies |
| Reports | View, Export authorised reports | Financial and payroll reports hidden unless separately granted |
| Profile | View, Edit own profile | Role, branch and permissions are read-only |

#### 4.4 Permission Enforcement Requirements

- **DSP-PERM-001:** The server must enforce permissions; hiding UI controls alone is insufficient.
- **DSP-PERM-002:** A dispatcher must not retrieve out-of-scope branch records through query manipulation or direct API access.
- **DSP-PERM-003:** Sensitive driver fields such as bank, tax and full identity documents must be masked or unavailable unless separately authorised.
- **DSP-PERM-004:** Overrides must require a dedicated permission and a mandatory reason.
- **DSP-PERM-005:** Export permissions must be separate from view permissions.
- **DSP-PERM-006:** The system must record denied access attempts for security review.

---

### 5. Information Architecture

#### 5.1 Primary Navigation

1. Dispatch Dashboard
2. Create Load
3. Active Loads
4. Planning Board
5. Live GPS Map
6. Drivers
7. Vehicles / Trailers
8. Customers
9. Yard / Warehouse
10. Workforce Availability
11. Messages
12. Reports & Analytics
13. Profile

#### 5.2 Header

The common header should include:

- Company logo.
- Portal label: **Dispatcher Portal**.
- Current operational context: **Live Dispatch Operations**.
- Global quick search with keyboard shortcut `Ctrl+K` or `Cmd+K`.
- Notifications count.
- Unread messages count.
- Current branch or branch selector where permitted.
- User avatar, name and role.

#### 5.3 Routing and Deep Links

- Every list row and operational card must support a stable deep link.
- Browser refresh must preserve the active screen and record context.
- Filterable pages should store supported filters in the URL query string.
- Opening a load from the dashboard, map, planning board or messages must navigate to the same canonical load record.

---

### 6. Global UX and Shared Behaviour

#### 6.1 Responsive Behaviour

- Desktop is the primary dispatcher experience.
- Minimum supported operational viewport should be defined by the design team; 1366×768 should remain usable.
- Tables must support horizontal scrolling without hiding primary identifiers and actions.
- Planning Board and Live Map may use full-screen modes.
- Tablet support should preserve critical monitoring and messaging functions.

#### 6.2 Global Search

Global search should find authorised records by:

- Load ID or reference.
- Purchase order reference.
- Customer name.
- Driver name or employee ID.
- Vehicle registration or fleet ID.
- Trailer registration or asset ID.
- VIN or chassis number.
- Route, city or destination.
- Message participant.

**Acceptance criteria:**

- Results appear within 500 ms for indexed/common searches under normal load.
- Results are grouped by entity type.
- Results never expose records outside the user's permission or branch scope.
- Keyboard navigation and Enter-to-open are supported.

#### 6.3 Filters

Common filters include:

- Branch.
- Status.
- Driver.
- Customer.
- Destination/location.
- Required date/date range.
- Load/transport type.
- Vehicle/trailer.
- Available workers.

Filters must:

- Support reset.
- Show active filter count.
- Persist when navigating into a record and returning.
- Be reflected in exports.
- Use server-side filtering for large datasets.

#### 6.4 Tables

All major tables should support:

- Search.
- Sorting.
- Pagination.
- Configurable columns.
- Grouping where specified.
- Export where permitted.
- Empty, loading and error states.
- Row-level actions.
- Bulk actions only for compatible statuses.

#### 6.5 Date and Time

- Display dates in the configured company/user format, with `dd-mm-yyyy` recommended for the supplied Australian context.
- Display time zone on schedule-sensitive pages.
- Use local branch time for pickup, delivery and shift schedules.
- Preserve original time zone and UTC timestamps in the data model.
- Warn when a route crosses time zones.

#### 6.6 Status Presentation

- Status must never rely on colour alone.
- Each status requires a text label and, where useful, an icon.
- Status names must be consistent across dashboard, lists, map, board, messages and reports.

#### 6.7 Auto Refresh

- Live dashboard metrics: configurable, recommended 30–60 seconds.
- GPS telemetry: near real time based on provider capability.
- Standard lists: manual refresh or configurable interval.
- Reports: display data freshness timestamp.
- The interface must not overwrite an unsaved form during auto-refresh.

---

### 7. Dispatch Dashboard

#### 7.1 Purpose

Provide a real-time overview of workload, fleet capacity, active exceptions and immediate actions.

#### 7.2 KPI Cards

The dashboard should display:

- Total Loads.
- Active Loads.
- Planned Loads.
- Completed Today.
- Delayed Loads.
- Available Drivers.
- Available Trucks.
- Available Trailers.

Each KPI should show:

- Current value.
- Comparison or context where applicable.
- Click-through to a pre-filtered list.
- Last refreshed time.
- Branch scope.

#### 7.3 Dashboard Filters

The dashboard must support the common filters defined in Section 6.3. Changing filters must update metrics, load cards, planning data and driver summary consistently.

#### 7.4 Loads Panel

The Loads panel must support:

- Tabs: All, Active, Planned, Completed and On Hold.
- Search by load ID, customer, driver, registration, VIN or route.
- Summary cards showing ID, status, date, customer, origin, destination and vehicle.
- View all loads action.
- Direct open into load details.

#### 7.5 Planning Board Preview

The dashboard preview should show:

- Selected day.
- Depot/branch columns.
- Load cards with status, customer, route, date, driver, item count and worker count.
- Add Load action per authorised depot.
- Optimise Load action.
- Link to full Planning Board.

#### 7.6 Live GPS Preview

The map preview should include:

- Active vehicle markers.
- Status-based marker distinction.
- Zoom controls.
- Link to full map.
- GPS tools access.
- Clear telemetry freshness indicator.

#### 7.7 Driver Status Panel

Driver categories may include:

- All.
- On Duty.
- En Route.
- At Pickup.
- Break.
- Off Duty.
- Unavailable.

A driver card should show:

- Driver name.
- Duty/operational status.
- Assigned vehicle.
- Active load.
- Last known location.
- Telemetry summary.

#### 7.8 Requirements

- **DSP-DASH-001:** Dashboard counts must be derived from the same status rules used by load and resource lists.
- **DSP-DASH-002:** Clicking a KPI must open the corresponding filtered result.
- **DSP-DASH-003:** Delayed loads must be visually prioritised.
- **DSP-DASH-004:** Availability counts must exclude non-compliant, conflicting, off-duty and unavailable resources.
- **DSP-DASH-005:** Dashboard data must respect branch access.
- **DSP-DASH-006:** The system must show a stale-data warning when telemetry or operational data has not refreshed within a configurable threshold.

---

### 8. Load Lifecycle and Status Model

#### 8.1 Recommended High-Level Lifecycle

`Draft → Planned → Pending Dispatch → Assigned → Accepted → En Route to Pickup → At Pickup → Loaded → In Transit → At Delivery → Delivered → Completed`

Exception statuses:

- On Hold.
- Delayed.
- Cancelled.
- Rejected by Driver.
- Failed Delivery.
- Returned / Return in Progress.

#### 8.2 Status Rules

- Draft loads may be incomplete and must not appear as available driver work.
- Planned loads contain sufficient scheduling information but may be unassigned.
- Pending Dispatch means operationally prepared but awaiting final dispatch/acceptance.
- Active is an umbrella category, not necessarily a stored atomic status.
- Delivered indicates physical delivery evidence has been recorded.
- Completed indicates all required operational closure checks have passed.
- Cancelled records remain auditable and are not physically deleted.
- On Hold and Delayed require a reason and timestamp.

#### 8.3 Progress Calculation

Progress may be represented as:

- Workflow stages completed, e.g. `3/5`.
- Stops completed, e.g. `2/4`.
- Percentage for list views.

The UI must label the calculation basis to avoid ambiguity. The product team should confirm whether the canonical progress basis is workflow stage, stops, or a combined model.

#### 8.4 Valid Transition Enforcement

- **DSP-LOAD-001:** Only valid status transitions may be submitted.
- **DSP-LOAD-002:** The API must reject stale transitions when another user or system has already updated the load.
- **DSP-LOAD-003:** A reason is mandatory for cancellation, hold, delayed, transfer, failed delivery and manual completion override.
- **DSP-LOAD-004:** Completion must be blocked until mandatory delivery evidence is present.
- **DSP-LOAD-005:** Every status transition must be added to a timeline/audit history.

---

### 9. Loads List

#### 9.1 Purpose

Provide a searchable, filterable and exportable register of all authorised loads.

#### 9.2 Tabs and Counts

Recommended tabs:

- All Loads.
- Draft.
- Planned.
- Active.
- Completed.
- Cancelled.

Counts must update with the selected branch and date scope.

#### 9.3 Table Columns

- Load Reference.
- Status and operational sub-status.
- Load Type.
- Customer.
- Route and stop count.
- Driver.
- Truck and trailer.
- Pickup date/time.
- ETA or delivery date/time.
- Progress.
- Actions.

#### 9.4 Actions

Depending on status and permission:

- View.
- Edit.
- Duplicate.
- Assign resources.
- Activate/dispatch.
- Place on hold.
- Cancel.
- Export.
- Open tracking.
- Message driver.

#### 9.5 Bulk Actions

Bulk actions may include:

- Assign driver where valid.
- Mark selected records for planning.
- Cancel with reason.
- Export selected.

The system must validate every selected load individually and report partial failures clearly.

#### 9.6 Requirements

- **DSP-LIST-001:** Sorting and pagination must be server-side for production-scale datasets.
- **DSP-LIST-002:** Selected rows must be cleared when filters make them unavailable.
- **DSP-LIST-003:** Export must include active filters and user time zone.
- **DSP-LIST-004:** Draft records must be clearly distinguished from dispatch-ready records.
- **DSP-LIST-005:** The list must identify unassigned loads.
- **DSP-LIST-006:** The Actions menu must only show valid operations for the current status and user permission.

---

### 10. Create Load — Quick Form

#### 10.1 Purpose

Allow a dispatcher to create a straightforward load quickly from the dashboard or planning context.

#### 10.2 Fields

- Customer.
- Status or initial scheduling state.
- Pickup location.
- Delivery location.
- Assigned driver.
- Vehicle/trailer.
- Required date.
- Required time.

#### 10.3 Rules

- The quick form should create a draft or planned load, not silently bypass mandatory full-console requirements.
- If the dispatcher selects an active status, the system must validate all mandatory activation requirements or redirect to the full console.
- Customer, route, date and time are mandatory.
- Driver and asset assignment may be optional for planned loads.
- Assignment controls must show availability and compliance indicators.

#### 10.4 Outcomes

- **Create Load:** creates the record and opens its details or planning context.
- **Open Full Console:** transfers entered values into the detailed load console without data loss.
- **Cancel:** closes without creating a record.

#### 10.5 Acceptance Criteria

- Duplicate submission is prevented.
- A clear success confirmation displays the new load reference.
- Validation errors appear next to the relevant fields.
- Entered values remain after a correctable API error.

---

### 11. Create Load Console

#### 11.1 Operational Principle

The full load model follows:

**Load → Stops → Items → Proof Requirements → Truck/Trailer/Driver → Validation → Activation**

#### 11.2 Step 1 — Load Information

Fields should include:

- Booking customer, optional where permitted.
- Load type/service.
- Load reference.
- Priority.
- Load date.
- Branch/operating depot.
- Internal reference or purchase order number.
- Customer instructions.
- Optional pricing/rate reference visible only if permitted.

Dynamic behaviour:

- Fields may change by load type.
- Dangerous Goods must reveal regulatory and certification fields.
- Car Carrying must enable vehicle/item-specific attributes.
- General Freight must enable package, pallet, weight and dimension fields.

#### 11.3 Step 2 — Route Stops

Each stop should support:

- Stop type: Pickup, Drop-off, Depot, Yard, Inspection or Other configured type.
- Sequence number.
- Address and geocode.
- Contact name.
- Contact phone/email.
- Scheduled date and time window.
- Instructions.
- Proof requirements.
- Geofence radius.
- Status.

Rules:

- At least one pickup and one delivery/drop-off are required for activation.
- Stops may be drag-reordered before activation.
- Reordering after dispatch must trigger route recalculation and audit logging.
- Item pickup/drop-off mappings must remain valid after reordering.
- The system should warn, not silently fail, when pickup/drop-off ordering is operationally unusual.

#### 11.4 Step 3 — Items

For Car Carrying, each item should support:

- Customer/owner.
- Pickup stop.
- Drop-off stop.
- Registration.
- VIN/chassis number.
- Stock/reference number.
- Make.
- Model.
- Year.
- Colour.
- Length, width and height.
- Weight.
- Vehicle type.
- Keys available.
- Damage report required.
- Additional notes.

General requirements:

- Add item.
- Add another item.
- Bulk import.
- Duplicate item where appropriate.
- Remove item before activation.
- Validation of stop mapping.
- VIN/registration lookup where an authorised data provider exists.
- Auto-filled fields must be reviewable and editable.

#### 11.5 Proof Photos and Chain of Responsibility

Photo stages may include:

1. Pickup photos before loading.
2. Loading/restraint photos.
3. Delivery photos after unloading.

Each uploaded proof file must store:

- File ID and secure storage path.
- Load ID and item ID.
- Proof stage.
- Uploader.
- Capture/upload timestamp.
- GPS coordinates where available.
- Device metadata where permitted.
- Optional annotation/damage notes.
- Verification status.

Rules:

- Mandatory proof requirements are configurable by company, load type, customer and item.
- The system must not claim a photo is GPS-stamped when location data was unavailable.
- Missing mandatory proof must block the relevant workflow transition unless an authorised override is recorded.
- Evidence must not be silently replaced; superseded files remain auditable.

#### 11.6 Step 4 — Assign Truck, Trailer and Driver

Fields:

- Truck.
- Trailer, optional based on load type.
- Primary driver.
- Secondary driver/team where enabled.
- Driver-visible notes.

Assignment engine must evaluate:

- Duty status and shift availability.
- Existing schedule conflicts.
- Licence class.
- Dangerous Goods or other certification.
- Document compliance.
- Vehicle/trailer status.
- Vehicle/trailer compliance.
- Maintenance and out-of-service status.
- Capacity and item fit.
- Branch/location compatibility.
- Maximum working hours and required rest where configured.

#### 11.7 Save Draft and Activate Load

##### Save Draft

- Allows incomplete data.
- Must validate field formats but not all activation requirements.
- Must record creator and last editor.

##### Activate Load

Before activation, the system must run a readiness checklist covering:

- Required load fields.
- Valid pickup/drop-off structure.
- Item mapping.
- Required customer information.
- Driver eligibility.
- Truck and trailer availability.
- Compliance status.
- Schedule conflicts.
- Mandatory documents.
- Mandatory safety checklist configuration.

The result should show pass, warning or blocking failure for each check.

#### 11.8 Requirements

- **DSP-CREATE-001:** Draft saving must support incomplete records.
- **DSP-CREATE-002:** Activation must be atomic; partial activation is not allowed.
- **DSP-CREATE-003:** Resource conflicts must be rechecked at the exact moment of activation.
- **DSP-CREATE-004:** Bulk import must provide row-level validation errors.
- **DSP-CREATE-005:** The dispatcher must be warned about unsaved changes before leaving.
- **DSP-CREATE-006:** The system should autosave a recoverable draft at a configurable interval without creating duplicate records.
- **DSP-CREATE-007:** Customer-specific requirements must be displayed before activation.
- **DSP-CREATE-008:** Activation must generate a timeline event and notify the assigned driver according to workflow settings.

---

### 12. Active Loads and Load Details

#### 12.1 Active Loads List

Tabs may include:

- All Active.
- In Transit.
- En Route to Pickup.
- At Pickup.
- At Delivery.
- On Hold.

Columns:

- Load ID.
- Status.
- Driver/team.
- Route.
- Customer.
- Vehicle/trailer.
- Required date/time.
- Progress.
- Actions.

#### 12.2 Load Detail Header

Must show:

- Load ID/reference.
- Current status.
- Customer.
- Required date/time.
- Origin and destination.
- Branch.
- Priority.
- Exception indicators.

#### 12.3 Detail Tabs

- Overview.
- Stops.
- Items/Cars.
- Documents.
- Notes.
- Chain of Custody or Chain of Responsibility.
- Activity history, recommended.

#### 12.4 Assignment Summary

Show:

- Driver and duty status.
- Truck details.
- Trailer details.
- Registrations.
- Capacity.
- Compliance status.
- Contact actions.

#### 12.5 Progress Timeline

The timeline should show timestamped stages such as:

- Accepted.
- En Route.
- At Pickup.
- Loaded.
- In Transit.
- At Delivery.
- Delivered.
- Completed.

Each event should identify the source: driver, dispatcher, system, GPS/geofence or integration.

#### 12.6 Route and Tracking

Actions:

- View Live Map.
- Open Route.
- View GPS History.
- Send Location.
- Refresh GPS.

#### 12.7 Quick Actions

- Message Driver.
- Call Driver.
- View Instructions.
- Swap Trailer.
- Transfer Load.
- Add Note.
- Place on Hold.
- Record Delay.
- Escalate Issue.

#### 12.8 Transfer and Swap Rules

- A replacement resource must pass the same eligibility checks as a new assignment.
- The current driver must be notified where applicable.
- The load timeline must record old and new assignments.
- In-progress transfer requires location, custody and item condition confirmation.
- Trailer swap may require updated restraint/loading proof.

#### 12.9 Requirements

- **DSP-ACTIVE-001:** Load detail must display the latest committed state across all entry points.
- **DSP-ACTIVE-002:** Concurrent edits must be detected and handled safely.
- **DSP-ACTIVE-003:** Notes must identify whether they are internal or driver-visible.
- **DSP-ACTIVE-004:** Operational evidence and timeline events cannot be permanently deleted by a dispatcher.
- **DSP-ACTIVE-005:** The system must calculate and display late/at-risk indicators against scheduled commitments.

---

### 13. Planning Board

#### 13.1 Purpose

Provide a schedule-oriented workspace to allocate loads to drivers, trucks, trailers and time windows.

#### 13.2 Views and Filters

- Branch.
- Date.
- Day/Week view.
- Vehicle type.
- Driver.
- Vehicle/trailer.
- Status.
- List or board mode where supported.

#### 13.3 Board Structure

Recommended layout:

- Time axis across the selected day.
- Driver/resource rows.
- Driver duty and compliance indicator.
- Assigned truck and trailer.
- Load cards positioned by start/end time.
- Unassigned loads panel.
- Available time blocks.

#### 13.4 Load Card Information

- Load ID.
- Customer.
- Route.
- Scheduled time.
- Item/vehicle count.
- Priority/status.
- Conflict or delay warnings.

#### 13.5 Drag-and-Drop Assignment

Dragging a load to a driver/resource row must:

1. Create a proposed assignment.
2. Validate availability, conflicts, compliance, capacity and working-hour rules.
3. Show warnings/errors.
4. Require confirmation where specified.
5. Save the assignment atomically.
6. Update all relevant views.

#### 13.6 Optimise Board

Optimisation may recommend:

- Driver assignment.
- Vehicle/trailer assignment.
- Sequence changes.
- Load consolidation.
- Empty-leg reduction.
- Cross-branch resource rebalance.

Rules:

- Recommendations must include rationale and any constraints.
- No recommendation may be applied silently.
- The dispatcher must be able to accept individually or in bulk.
- Applied changes must be audited.
- The optimiser must not assign non-compliant or unavailable resources.

#### 13.7 Create Load from Board

The board form should capture:

- Customer.
- Load type.
- Pickup.
- Drop-off.
- Start time.
- End time.
- Optional driver.
- Internal notes.

New board loads should be created as Draft or Planned based on completeness and company configuration.

#### 13.8 Requirements

- **DSP-PLAN-001:** Overlapping assignments must be visually identified.
- **DSP-PLAN-002:** The board must support an unassigned-load queue.
- **DSP-PLAN-003:** Changes must be reversible before final confirmation.
- **DSP-PLAN-004:** Board updates must appear in active loads and driver schedules without manual data duplication.
- **DSP-PLAN-005:** The system must prevent assignment to unavailable periods.
- **DSP-PLAN-006:** Cross-time-zone routes must display schedule context clearly.

---

### 14. Live GPS Map

#### 14.1 Purpose

Track drivers and active loads, inspect route progress, identify delays and communicate location instructions.

#### 14.2 Filters

- Branch.
- Driver.
- Driver status.
- Load status.
- Search by driver, load ID, vehicle or registration.
- Additional filters for vehicle type, exception and telemetry freshness.

#### 14.3 Driver List

Each row/card should show:

- Driver.
- Active load.
- Operational status.
- Route.
- Last update age.
- Delay/exception indicator.

#### 14.4 Map Capabilities

- Map and satellite layers.
- Driver/vehicle markers.
- Marker clustering.
- Route line.
- Current stop and next stop.
- Traffic overlay where provider supports it.
- Geofences.
- Full-screen mode.
- Selected-driver focus.
- Manual refresh.

Weather may be shown only through a configured and licensed provider. Weather data must display source and timestamp.

#### 14.5 On-Road Summary

Columns:

- Load ID.
- Driver.
- Status.
- Route.
- Vehicle/trailer.
- Last update.
- ETA next stop.
- ETA delivery.
- Progress.
- Actions.

#### 14.6 Selected Driver Panel

Should show:

- Driver and status.
- Load and customer.
- Route.
- Speed.
- Heading.
- Last update.
- Distance to destination.
- Stops and completion state.
- Latest events.
- Vehicle, documents and notes tabs.

#### 14.7 GPS History

GPS history should support:

- Date/time range.
- Route playback.
- Stops and dwell time.
- Gaps in telemetry.
- Source/provider.
- Export only with explicit permission.

#### 14.8 Send Location to Driver

Fields:

- Target driver/load.
- Destination preset.
- Target address.
- Latitude and longitude.
- Driver instructions.
- Channel: Push + SMS, App Only, WhatsApp where configured, or broadcast where authorised.
- Attach navigation link.
- Require confirmation.

Rules:

- The dispatcher must confirm the intended target.
- Navigation links must be generated from validated coordinates.
- Message delivery status must be recorded.
- Broadcast requires elevated permission and recipient preview.
- Driver acknowledgement must be visible when confirmation is required.

#### 14.9 GPS Data Rules

- **DSP-GPS-001:** Last update time must always be displayed.
- **DSP-GPS-002:** Stale or offline markers must not appear as current without warning.
- **DSP-GPS-003:** Speed, heading and position must include telemetry timestamp.
- **DSP-GPS-004:** GPS access and export must be logged.
- **DSP-GPS-005:** The system must distinguish device-reported, telematics-reported and manually entered locations.
- **DSP-GPS-006:** Geofence events must not automatically complete delivery unless required evidence and workflow rules are satisfied.

---

### 15. Drivers

#### 15.1 Drivers List

Dashboard metrics may include:

- Total Drivers.
- On Duty.
- Off Duty.
- On Leave.
- Unavailable.
- Documents Expiring Soon.

Filters:

- Name, phone or licence search.
- Status.
- Licence type.
- Compliance.
- Branch.
- More filters.

Columns:

- Driver.
- Driver ID.
- Phone.
- Licence.
- Status.
- Branch.
- Current assignment.
- Compliance score/status.
- Actions.

#### 15.2 Dispatcher-Visible Driver Information

- Name and photo/avatar.
- Employee ID.
- Contact details needed for operations.
- Branch.
- Duty/availability status.
- Licence class and expiry status.
- Required operational certifications.
- Current assignment.
- Compliance summary.
- Skills and route preferences where used for assignment.

Sensitive payroll, banking, tax and background-check content must be restricted.

#### 15.3 AI/Rule-Based Driver Insights

Possible insights:

- Documents expiring soon.
- Suggested drivers for unassigned loads.
- Low compliance score.
- Schedule conflict risk.
- Route familiarity.

Recommendations must state the main factors and must not override hard compliance blocks.

#### 15.4 Add Driver

The supplied screen includes a full driver profile form. Dispatcher access to this form must be permission-controlled.

Sections:

1. Personal Information.
2. Employment Information.
3. Licence Information.
4. Compliance Documents.
5. Payroll Information.
6. Vehicle Preferences.
7. Availability.
8. Account Information.
9. Notes and Comments.

Recommended access rule:

- Dispatcher may create a draft operational driver profile if granted.
- Company Admin/HR must approve sensitive employment, payroll, identity and account fields.
- Dispatcher should not view or edit bank account, tax number or full background documents by default.

#### 15.5 Driver Availability Rules

A driver is considered assignable only when:

- Status is operationally available/on duty for the required period.
- No overlapping assignment exists.
- Required licence and certifications are valid.
- Mandatory compliance documents are valid.
- Applicable working-hour and rest rules pass configured checks.
- The driver belongs to an allowed branch or cross-branch assignment is authorised.

#### 15.6 Requirements

- **DSP-DRV-001:** Compliance status must be recalculated from current documents and requirements.
- **DSP-DRV-002:** Expiry warnings must use configurable thresholds.
- **DSP-DRV-003:** Assigning a driver must perform real-time eligibility checks.
- **DSP-DRV-004:** Sensitive information must be field-level permission controlled.
- **DSP-DRV-005:** Driver status changes must be audited and propagated to planning availability.

---

### 16. Vehicles and Trailers

#### 16.1 Vehicle List

Metrics:

- Total Vehicles.
- Active.
- In Maintenance.
- Out of Service.
- Compliance Due.

Tabs:

- All Vehicles.
- Active.
- In Maintenance.
- Out of Service.
- Sold/Inactive.

Columns:

- Vehicle/fleet ID and registration.
- Type, make and model.
- Year.
- Status.
- Current driver.
- Odometer.
- Compliance.
- Next service.
- Actions.

#### 16.2 Trailer Requirements

Trailers must be managed as separate assets with:

- Trailer ID.
- Registration.
- Type and capacity.
- Branch/location.
- Status.
- Assigned truck/load.
- Compliance.
- Service schedule.
- Configuration attributes, such as car capacity.

#### 16.3 Availability Rules

A vehicle/trailer is assignable only when:

- Status is Active/Available.
- It is not already assigned during the required period.
- It is not in maintenance or out of service.
- Required compliance is valid.
- Capacity and type meet load requirements.
- It is at a compatible branch/location or repositioning is planned.

#### 16.4 Compliance and Maintenance

The dispatcher may view:

- Registration status.
- Insurance status.
- Roadworthy status.
- Next service.
- Overdue service.
- Blocking defects.

The dispatcher must not be able to dismiss a maintenance or compliance block without appropriate override permission.

#### 16.5 Requirements

- **DSP-FLEET-001:** Truck and trailer availability must be checked independently.
- **DSP-FLEET-002:** Assignment must reserve the resource for the scheduled period.
- **DSP-FLEET-003:** Odometer and maintenance warnings must show the source and update time.
- **DSP-FLEET-004:** Out-of-service assets cannot be assigned.
- **DSP-FLEET-005:** Vehicle/trailer swaps must preserve assignment history.

---

### 17. Customers

#### 17.1 Purpose

Allow dispatchers to find customer operational information, create authorised customer records and view service requirements relevant to load execution.

#### 17.2 Customer List

Metrics may include:

- Total Customers.
- Active Customers.
- New This Month.
- Inactive Customers.
- Top Customer, only if authorised.

Filters:

- Name or ABN.
- Status.
- Customer type.
- Transport modules.
- Account manager.
- State.
- Created date.

Columns:

- Customer.
- Type.
- Primary operational contact.
- Transport modules.
- Billing terms, view-only if authorised.
- Account manager.
- Status.
- Actions.

#### 17.3 Add Customer — Quick Form

Fields:

- Company name.
- ABN/ACN.
- Customer type.

Recommended behaviour:

- Quick creation should produce a provisional customer record.
- Duplicate checks must compare name, ABN/ACN, email and phone.
- A Company Admin or Sales role may be required to complete commercial terms.
- Dispatcher may use the provisional customer for a load only if company rules permit.

#### 17.4 Customer Operational Rules

Customer records may define:

- Allowed load types.
- Required documents.
- Proof photo requirements.
- Site instructions.
- Contact and notification preferences.
- Time-window rules.
- Preferred depots/routes.
- Dangerous Goods requirements.

#### 17.5 Requirements

- **DSP-CUST-001:** Duplicate customer warnings must be shown before creation.
- **DSP-CUST-002:** Suspended/inactive customers must be blocked or warned according to company policy.
- **DSP-CUST-003:** Billing data must not be editable by dispatcher unless separately granted.
- **DSP-CUST-004:** Customer-specific load requirements must flow into the Create Load Console.

---

### 18. Yard and Warehouse

#### 18.1 Purpose

Give dispatchers operational visibility into warehouses, inventory, pick tasks, incoming/outgoing shipments and yard readiness.

#### 18.2 Warehouse Dashboard

Metrics:

- Total Warehouses.
- Total Inventory Value, only if authorised.
- Total Stock Items.
- Pending Pick Tasks.
- Incoming Shipments.
- Outgoing Shipments.

Warehouse list columns:

- Warehouse name and address.
- Code.
- Branch/location.
- Type.
- Status.
- Stock items.
- Inventory value, permission-controlled.
- Utilisation.
- Actions.

#### 18.3 Alerts

- Low stock.
- Expiring stock.
- Overdue pick tasks.
- Incoming shipment arrival.
- Yard congestion.
- Missing dispatch readiness.

#### 18.4 Dispatcher Actions

Depending on permission:

- View warehouse/yard status.
- View stock availability.
- View incoming/outgoing shipments.
- Create or request pick task.
- View task progress.
- Coordinate load arrival/departure.
- Message warehouse or yard team.

#### 18.5 Integration with Loads

- A load requiring stock or yard preparation must show readiness status.
- Activation or pickup may be blocked when a mandatory pick/yard task is incomplete.
- Arrival ETA should be visible to the relevant warehouse/yard team.
- Completion of loading tasks should update the load timeline.

#### 18.6 Requirements

- **DSP-WH-001:** Dispatcher visibility must be branch and permission scoped.
- **DSP-WH-002:** Inventory values must be hidden unless financial visibility is granted.
- **DSP-WH-003:** Load-linked tasks must display the load reference.
- **DSP-WH-004:** Warehouse task delays must generate operational alerts.

---

### 19. Workforce Availability

#### 19.1 Purpose

View workforce capacity, assign shifts and identify shortages affecting dispatch operations.

#### 19.2 Filters and Metrics

Filters:

- Branch.
- View: Day/Week.
- Workforce type.
- Role/position.
- Status.
- Date.

Metrics:

- Total Workforce.
- Available Today.
- On Shift.
- On Leave.
- Absent/Unavailable.

#### 19.3 Views

- Schedule View.
- List View.
- Unavailability.
- Leave Calendar.

Grouping options:

- Role.
- Branch.
- Team.
- Skill/certification, recommended.

#### 19.4 Schedule Grid

The weekly grid should show:

- Worker.
- Role.
- Certifications/skills.
- Daily state.
- Shift time.
- Leave reason where permitted.
- Available/unavailable periods.
- Assigned versus required counts for grouped teams.

#### 19.5 Selected Worker Panel

- Worker name.
- Status.
- Role.
- Employee ID.
- Mobile number.
- Overview.
- Skills and certifications.
- Shifts.
- Notes.
- Upcoming availability.
- Quick actions.

#### 19.6 Assign Shift

Fields:

- Date.
- Shift type.
- Start time.
- End time.
- Role/position.
- Notes.

Validation:

- End time must be after start time, accounting for overnight shifts.
- Overlapping shifts must be blocked or require authorised override.
- Leave/unavailability conflicts must be blocked.
- Working-hour rules must be checked.
- Assignment must notify the worker where configured.

#### 19.7 Auto Fill Shifts

Auto Fill may recommend shift assignments based on:

- Required headcount.
- Role and skills.
- Availability.
- Existing hours.
- Branch.
- Fair distribution.
- Cost constraints only if authorised.

Recommendations must require confirmation.

#### 19.8 Requirements

- **DSP-WF-001:** Availability changes must update planning resource availability.
- **DSP-WF-002:** Shift assignments must be audited.
- **DSP-WF-003:** Personal leave details must be minimised according to permission.
- **DSP-WF-004:** The schedule must clearly distinguish availability from confirmed shift assignment.
- **DSP-WF-005:** Auto Fill must never override hard conflicts.

---

### 20. Messages

#### 20.1 Purpose

Provide a central communication workspace for drivers, yard staff, warehouse staff and internal teams.

#### 20.2 Conversation List

Tabs/categories:

- All.
- Unread.
- Groups.
- Archived.

Each conversation should show:

- Participant/group.
- Last message preview.
- Time.
- Unread count.
- Related load and status where applicable.
- Participant type.

#### 20.3 Conversation Workspace

- Message history.
- Date separators.
- Sender identity.
- Timestamp.
- Delivery/read status.
- Attachments.
- Location attachments.
- Message input.
- Enter to send and Shift+Enter for new line.

#### 20.4 Conversation Details

- Participant details.
- Current load.
- Route.
- Required date.
- Vehicle/trailer.
- Progress.
- Contact information.
- Role, employee ID and licence summary where authorised.
- Actions: call, video where configured, view load, mute.

#### 20.5 New Message

Fields:

- Recipient.
- Optional subject.
- Priority.
- Message.
- Attach file.
- Attach location.

#### 20.6 Groups

Dispatchers may create operational groups when permitted, such as:

- Yard Team — Melbourne.
- Maintenance Team.
- Branch Dispatch Team.
- Load-specific conversation.

Group membership changes must be audited.

#### 20.7 Requirements

- **DSP-MSG-001:** Messages linked to a load must be accessible from the load timeline or communication tab.
- **DSP-MSG-002:** Read/unread counts must update consistently.
- **DSP-MSG-003:** Attachments must be virus-scanned and permission checked.
- **DSP-MSG-004:** Delivery failures must be visible with retry options where appropriate.
- **DSP-MSG-005:** Message retention must follow company policy.
- **DSP-MSG-006:** The system must distinguish internal messages from customer-visible communication.

---

### 21. Reports and Analytics

#### 21.1 Dispatcher Reporting Scope

The supplied Reports Dashboard includes operational, financial, compliance and analytics categories. For the Dispatcher role, the default scope should include:

- Loads performance.
- On-time pickup/delivery.
- Delay and exception reports.
- Driver utilisation and availability.
- Vehicle/trailer utilisation.
- Fleet compliance summary.
- Yard/warehouse operational reports.
- Route and depot performance.
- Message/response metrics where relevant.

Financial, payroll, profitability and accounts reports must be hidden unless separately granted.

#### 21.2 Dashboard Features

- Search reports.
- Category filter.
- Report type filter.
- Status filter.
- Date range.
- Recently viewed.
- Favourites.
- Scheduled reports.
- Downloads.
- Export Centre.
- Create Custom Report, permission-controlled.

#### 21.3 Scheduled Reports

A dispatcher with permission may schedule authorised reports by:

- Frequency.
- Date/time.
- Branch scope.
- Format.
- Recipients.

The system must validate recipient access and avoid sending unauthorised data.

#### 21.4 AI Insights

Operational insights may include:

- Delay trends.
- Under-utilised resources.
- Repeated route issues.
- Compliance expiry risk.
- Capacity shortage predictions.

Insights must show data period, source metrics and confidence or limitations where appropriate.

#### 21.5 Requirements

- **DSP-RPT-001:** Dispatcher must only see authorised report categories.
- **DSP-RPT-002:** Report exports must record actor, filters, row count and time.
- **DSP-RPT-003:** Scheduled recipients must be validated against access scope.
- **DSP-RPT-004:** Reports must display data freshness and time zone.
- **DSP-RPT-005:** Financial information must be excluded by default from dispatcher reporting.

---

### 22. Dispatcher Profile

#### 22.1 Profile Overview

Display:

- Name.
- Online/offline presence.
- Job title.
- Employee ID.
- Contact information.
- Address.
- Working hours.
- Preferences.
- Role and permissions.
- Branch and access level.
- Recent activity.
- Account and security.
- Active devices.
- Shortcuts.

#### 22.2 Editable Fields

A dispatcher may edit:

- Full name, subject to company policy.
- Mobile number.
- Date of birth, where policy permits.
- Email address, with verification.
- Address.
- Emergency contact.
- Notification preferences.
- Language.
- Time zone, subject to company policy.

Role, access level, branch and permissions must be read-only.

#### 22.3 Account and Security

- Username.
- Password change.
- Two-factor authentication status and management.
- Active devices/sessions.
- Revoke session.
- Login activity.

#### 22.4 Requirements

- **DSP-PROF-001:** Email and phone changes may require verification.
- **DSP-PROF-002:** Password changes must invalidate sessions according to security policy.
- **DSP-PROF-003:** Role and permissions cannot be self-modified.
- **DSP-PROF-004:** Recent activity must include security-sensitive actions.
- **DSP-PROF-005:** Session revocation must take effect promptly.

---

### 23. Notifications, Alerts and Escalations

#### 23.1 Notification Types

- New load assignment.
- Driver acceptance/rejection.
- Driver or vehicle becomes unavailable.
- Compliance expiry or block.
- Delayed load or ETA risk.
- Geofence arrival/departure.
- Missing proof/document.
- Driver break/rest alert.
- Yard/warehouse task delay.
- New message.
- GPS offline/stale.
- Delivery issue.
- Load completion.

#### 23.2 Severity

- Informational.
- Low.
- Medium.
- High.
- Critical.

Severity must be based on configurable rules.

#### 23.3 Escalation

Critical or unresolved alerts may escalate to:

- Senior Dispatcher.
- Branch Manager.
- Company Admin.
- Safety/Compliance role.
- Maintenance team.

Escalation rules should consider severity, elapsed time, branch and issue type.

#### 23.4 Requirements

- **DSP-ALERT-001:** Every alert must have source, entity, severity, creation time and status.
- **DSP-ALERT-002:** Acknowledgement must not equal resolution.
- **DSP-ALERT-003:** Critical alerts cannot be silently dismissed.
- **DSP-ALERT-004:** Notification preferences cannot disable mandatory safety alerts.
- **DSP-ALERT-005:** Duplicate alerts should be grouped to reduce noise while preserving event history.

---

### 24. End-to-End Operational Workflows

#### 24.1 Create and Activate a Load

1. Dispatcher opens Quick Create or Full Console.
2. Selects or creates authorised customer.
3. Selects load type and enters reference/priority/date.
4. Adds pickup and drop-off stops.
5. Adds items and maps them to stops.
6. Defines proof and document requirements.
7. Assigns driver, truck and trailer or leaves planned/unassigned.
8. System validates route, items, compliance, capacity, availability and conflicts.
9. Dispatcher saves Draft, saves Planned or selects Activate.
10. System revalidates resources atomically.
11. Load status changes to Pending Dispatch/Assigned according to configuration.
12. Driver receives assignment.
13. Timeline and audit records are created.

#### 24.2 Driver Accepts or Rejects

1. Driver receives load assignment.
2. Driver reviews instructions and required resources.
3. Driver accepts or rejects with reason.
4. Acceptance updates status and planning board.
5. Rejection returns load to unassigned/pending queue and alerts dispatcher.
6. Dispatcher reassigns or edits the load.

#### 24.3 Pickup and Loading

1. Driver starts trip after required safety checks.
2. GPS tracking begins or is confirmed active.
3. Driver arrives at pickup; geofence may suggest status.
4. Driver confirms arrival.
5. Required pickup condition photos are captured.
6. Items are loaded and restraint/loading proof is captured.
7. Dispatcher sees updated timeline and evidence status.
8. Load transitions to Loaded/In Transit.

#### 24.4 Delay Management

1. System or driver identifies a delay.
2. Delay alert shows load, reason, current location and ETA impact.
3. Dispatcher reviews route, driver status and customer commitment.
4. Dispatcher records action: reroute, update ETA, contact customer, swap resources, hold or escalate.
5. Affected participants receive authorised notifications.
6. Delay remains open until resolved or load completed.
7. Timeline stores cause, duration and resolution.

#### 24.5 Resource Swap

1. Dispatcher selects Swap Driver, Truck or Trailer.
2. System lists eligible replacements.
3. Dispatcher selects resource and effective time/location.
4. System checks conflicts, compliance and custody requirements.
5. Affected drivers/teams confirm where required.
6. Assignment changes atomically.
7. Old and new assignments remain in history.

#### 24.6 Delivery and Completion

1. Driver arrives at delivery location.
2. Delivery evidence and required photos are captured.
3. Recipient/POD details are recorded where required.
4. Failed/refused/damaged delivery creates an issue instead of normal completion.
5. When all stops and proof requirements pass, load becomes Delivered.
6. Final operational checks run.
7. Load becomes Completed automatically or after authorised review, based on configuration.

#### 24.7 Send Location/Instructions

1. Dispatcher selects driver/load.
2. Selects a preset or enters validated coordinates/address.
3. Adds instructions and communication channel.
4. Chooses whether confirmation is required.
5. System sends the message/navigation link.
6. Delivery and acknowledgement status are recorded.

#### 24.8 Workforce Shift Assignment

1. Dispatcher opens Workforce Availability.
2. Selects worker and date.
3. Enters shift time and role.
4. System checks leave, overlap, skills and working-hour constraints.
5. Dispatcher confirms assignment.
6. Worker and planning capacity are updated.

---

### 25. Business Rules and Validations

#### 25.1 Load Rules

- Load reference must be unique within configured company scope.
- Customer, load type, operating branch, pickup and delivery are mandatory for planned/active states.
- At least one item is required unless the load type explicitly allows item-less movement.
- Every item must map to valid pickup and drop-off stops.
- Completed or cancelled loads cannot be edited through normal edit actions.
- Material post-dispatch changes require reason and audit trail.

#### 25.2 Schedule Rules

- Pickup/delivery dates must follow logical sequence unless an overnight/time-zone condition explains the difference.
- Resource assignments cannot overlap.
- Required date/time must be stored with time zone.
- Schedule changes affecting an assigned driver must trigger notification.

#### 25.3 Driver Rules

- Licence class and certification must meet load requirements.
- Expired or missing mandatory documents create a hard block unless an authorised override policy exists.
- Driver must be available for the full assignment period plus configured buffer.
- Leave, unavailable or off-duty status blocks assignment unless status is changed through an authorised process.

#### 25.4 Vehicle and Trailer Rules

- Out-of-service and maintenance vehicles/trailers cannot be assigned.
- Capacity must meet item count, dimensions and weight rules.
- Trailer requirements are based on load type and configuration.
- Compliance must be valid through the planned completion date where policy requires.

#### 25.5 Evidence Rules

- Mandatory photo and document stages are configurable.
- Evidence deletion must be prohibited or tightly controlled.
- Evidence must retain capture/upload metadata.
- Completion must be blocked when mandatory evidence is missing.

#### 25.6 Communication Rules

- Messages must preserve sender and timestamp.
- Location sharing requires explicit target and channel.
- Broadcast communication requires additional permission.
- Customer-visible and internal communication must be separated.

#### 25.7 Error Handling

- Validation errors must be actionable and field-specific.
- API failures must not lose unsaved user input.
- Partial bulk-action failures must identify successful and failed records.
- Users must be told when data is stale or changed by another user.

---

### 26. Data and Entity Model

#### 26.1 Core Entities

##### Company/Tenant

- ID.
- Legal/display name.
- Time zone and currency settings.
- Feature configuration.
- Proof and compliance rules.

##### Branch

- ID.
- Code.
- Name.
- Address/geocode.
- Time zone.
- Status.

##### User

- ID.
- Name.
- Email/phone.
- Role.
- Branch scope.
- Status.
- Authentication and 2FA metadata.

##### Driver

- ID/employee ID.
- User/account link.
- Branch.
- Operational status.
- Licence classes.
- Certifications.
- Availability.
- Compliance summary.

##### Vehicle

- ID/fleet number.
- Registration.
- Type/make/model/year.
- Branch/location.
- Status.
- Capacity.
- Odometer.
- Compliance and service status.

##### Trailer

- ID.
- Registration.
- Type/capacity/configuration.
- Branch/location.
- Status.
- Compliance/service status.

##### Customer

- ID.
- Company name.
- ABN/ACN.
- Type.
- Status.
- Operational contacts.
- Customer-specific service rules.

##### Load

- ID and reference.
- Company and branch.
- Customer.
- Load type.
- Priority.
- Status/sub-status.
- Required date/time/time zone.
- Assigned driver, truck and trailer.
- Progress.
- Delay and exception flags.
- Creator and timestamps.

##### Load Stop

- ID.
- Load ID.
- Type.
- Sequence.
- Address/geocode.
- Contact.
- Scheduled/actual times.
- Status.
- Geofence.

##### Load Item

- ID.
- Load ID.
- Item type.
- Pickup/drop-off stop IDs.
- Vehicle/freight details.
- Dimensions and weight.
- Condition/damage requirements.

##### Assignment

- ID.
- Load ID.
- Driver/vehicle/trailer.
- Effective start/end.
- Status.
- Assignment source.
- Replaced assignment link.

##### Proof/Evidence

- ID.
- Load/item/stop.
- Stage/type.
- Secure file reference.
- Capture/upload metadata.
- GPS metadata.
- Verification status.

##### GPS Telemetry

- Driver/vehicle.
- Coordinates.
- Speed.
- Heading.
- Accuracy.
- Source.
- Recorded timestamp.
- Received timestamp.

##### Shift/Availability

- Worker.
- Date/time range.
- Status/type.
- Role.
- Notes.
- Source.

##### Message/Conversation

- Conversation ID.
- Participants.
- Related load.
- Visibility type.
- Messages and attachments.
- Delivery/read status.

##### Alert/Issue

- ID.
- Entity type and ID.
- Category.
- Severity.
- Status.
- Owner.
- Timeline.

##### Audit Event

- Actor.
- Action.
- Entity.
- Prior/new values or change summary.
- Timestamp.
- IP/device.
- Reason.

#### 26.2 Data Integrity

- Use immutable unique IDs in addition to human-readable references.
- Enforce tenant/company ID on all operational records.
- Use optimistic locking or version numbers for frequently edited records.
- Use soft deletion/archival where records require retention.
- Store money with currency code even where dispatcher cannot view financial values.
- Store times in UTC with source time zone.

---

### 27. Integration and API Requirements

#### 27.1 Required/Expected Integrations

- Driver mobile/web portal.
- GPS/telematics provider.
- Mapping, routing and geocoding provider.
- Push notification provider.
- SMS provider.
- Email provider.
- WhatsApp provider where contractually configured.
- Secure object storage for documents and proof photos.
- Warehouse/yard module.
- Vehicle compliance and maintenance module.
- Reporting/export service.

#### 27.2 API Principles

- REST or documented equivalent architecture.
- Versioned endpoints.
- Tenant and permission enforcement at service layer.
- Idempotency for create/activate/send actions where duplicate requests are harmful.
- Pagination and server-side filters.
- Standard error structure.
- Request correlation IDs.
- Audit context.
- Rate limiting.

#### 27.3 Key API Domains

- Authentication and profile.
- Dashboard metrics.
- Loads and status transitions.
- Stops and items.
- Assignments and availability.
- Drivers.
- Vehicles and trailers.
- Customers.
- Planning board.
- GPS telemetry/history.
- Warehouse/yard status.
- Workforce shifts.
- Conversations/messages.
- Reports and exports.
- Alerts and notifications.
- Evidence/document upload.

#### 27.4 Real-Time Updates

Use WebSocket, Server-Sent Events or an equivalent mechanism for:

- GPS updates.
- Load status changes.
- Driver availability.
- Planning assignment changes.
- New messages.
- Critical alerts.

The client must recover from connection loss and reconcile missed events from the server.

#### 27.5 File Upload

- Use signed upload URLs or secure streamed upload.
- Validate type, size and malware scan status.
- Store metadata separately from file binary.
- Prevent executable content from being served inline.
- Support upload retry.

---

### 28. Security, Privacy and Audit

#### 28.1 Authentication

- Secure username/email and password authentication.
- MFA/2FA support.
- Session expiration and refresh controls.
- Device/session visibility and revocation.
- Account lockout/rate limiting.

#### 28.2 Authorisation

- Role- and permission-based access.
- Branch and tenant data isolation.
- Field-level restrictions for sensitive driver/customer information.
- Export permissions.
- Override permissions.

#### 28.3 Data Protection

- TLS in transit.
- Encryption at rest for sensitive data.
- Secure secret management.
- Mask sensitive values in logs.
- Signed and expiring evidence/document URLs.
- Configurable retention policies.

#### 28.4 GPS Privacy

- GPS access is limited to authorised operational need.
- Off-duty tracking behaviour must follow company policy and applicable privacy requirements.
- GPS history access and exports are audited.
- The UI must show telemetry source and freshness.

#### 28.5 Audit Events

At minimum audit:

- Login/logout and failed authentication.
- Load create/edit/activate/cancel/complete.
- Status changes.
- Assignment and resource swap.
- Route/stop changes after activation.
- Evidence upload, supersede and verification.
- GPS history access/export.
- Shift assignment.
- Message broadcast.
- Report export.
- Profile/security changes.
- Override use.

#### 28.6 Audit Record Requirements

- Audit records must be tamper-resistant.
- Dispatchers cannot edit or delete audit entries.
- Sensitive values should be redacted while retaining meaningful change context.
- Audit search must support entity, actor, action and date range for authorised administrators.

---

### 29. Non-Functional Requirements

#### 29.1 Performance

- Standard page initial load target: under 3 seconds on a typical business connection.
- Common API read target: 95th percentile under 800 ms, excluding external provider latency.
- Search target: under 500 ms for indexed/common queries.
- Load activation target: under 3 seconds excluding large file uploads.
- Planning drag/drop validation target: under 1 second for common scenarios.
- GPS UI update should reflect provider data within the agreed telemetry SLA.

#### 29.2 Availability and Resilience

- Target service availability should be defined in the commercial SLA; recommended minimum for operational production is 99.9% excluding planned maintenance.
- Critical writes must be transactional.
- Retriable external calls must use safe retry and idempotency.
- Real-time connection loss must fall back to polling or show degraded mode.
- The UI must display service degradation clearly.

#### 29.3 Scalability

The architecture must support growth in:

- Branches.
- Concurrent dispatchers.
- Active drivers and vehicles.
- Daily loads.
- GPS events.
- Photos/documents.
- Messages.
- Report volume.

High-volume telemetry should be stored separately from core transactional queries where necessary.

#### 29.4 Accessibility

- Keyboard-operable forms and navigation.
- Visible focus states.
- Labels for controls.
- Status not conveyed by colour alone.
- Sufficient contrast.
- Screen-reader-friendly validation.
- Accessible table and modal structures.

#### 29.5 Browser Support

- Current supported versions of Chrome and Edge.
- Safari support where required by company devices.
- Browser support policy must be documented and tested.

#### 29.6 Observability

- Structured application logs.
- Error monitoring.
- API latency metrics.
- Real-time connection health.
- GPS ingestion health.
- Queue/notification delivery health.
- External integration status.
- Correlation IDs across services.

#### 29.7 Backup and Recovery

- Automated database backups.
- Secure evidence/document backup or durable storage policy.
- Defined Recovery Point Objective and Recovery Time Objective.
- Periodic restore testing.
- Audit retention independent of user deletion.

---

### 30. Analytics and Success Metrics

#### 30.1 Operational KPIs

- Loads created per dispatcher.
- Median load creation time.
- Planned-to-activated conversion time.
- Percentage of loads dispatched without manual rework.
- Driver acceptance rate.
- On-time pickup rate.
- On-time delivery rate.
- Delay frequency and average duration.
- Resource utilisation.
- Unassigned load ageing.
- Average time to resolve critical alerts.
- GPS coverage/freshness rate.
- Proof completion rate.
- Assignment conflict rate.

#### 30.2 Product Usage Metrics

- Dashboard usage.
- Planning Board usage.
- Quick Create versus Full Console usage.
- Search success.
- Filter usage.
- Message response time.
- Report views and exports.
- Optimisation recommendation acceptance rate.

#### 30.3 Quality Metrics

- Failed activation attempts by cause.
- Duplicate load rate.
- API error rate.
- GPS stale/offline incidents.
- File upload failure rate.
- Permission-denied incidents.
- UAT defect escape rate.

#### 30.4 Metric Rules

- Metrics must be defined consistently.
- Operational dashboards must identify date/time zone and branch scope.
- AI or recommendation metrics must not be used to penalise staff without validated governance.

---

### 31. Release Scope and Priorities

#### 31.1 Phase 1 — Core Dispatch MVP

**Must Have**

- Authentication, branch scope and role permissions.
- Dispatch Dashboard.
- Loads List.
- Quick Create and Full Create Load Console.
- Stops and item mapping.
- Driver, truck and trailer assignment.
- Active Loads and load details.
- Basic Planning Board.
- Driver and fleet availability checks.
- Messages.
- Basic alerts.
- Audit logs.

#### 31.2 Phase 2 — Live Operations

**Must/Should Have**

- Live GPS Map.
- GPS history.
- ETA and delay alerts.
- Location sharing.
- Proof photos and evidence workflow.
- Resource swap/transfer.
- Warehouse/yard readiness integration.
- Workforce Availability.
- Operational reports.

#### 31.3 Phase 3 — Optimisation and Advanced Automation

**Should/Could Have**

- Planning optimisation.
- Suggested driver/resource assignments.
- Route and utilisation insights.
- Predictive delay risk.
- Auto Fill Shifts.
- Advanced scheduled reports.
- Weather and traffic overlays through configured providers.

#### 31.4 Future Considerations

- Native mobile dispatcher experience.
- Voice-assisted dispatch commands.
- Customer live tracking share links.
- Advanced load consolidation.
- Automated customer ETA communication.
- Cross-company/inter-company load exchange.

---

### 32. QA, UAT and Definition of Done

#### 32.1 Test Coverage

Testing must include:

- Unit tests for business rules.
- API integration tests.
- Permission and tenant-isolation tests.
- Load lifecycle transition tests.
- Resource conflict and compliance tests.
- Planning Board interaction tests.
- GPS freshness and offline tests.
- File upload security tests.
- Message delivery tests.
- Report permission tests.
- Accessibility tests.
- Cross-browser tests.
- Performance/load tests.
- Backup/restore validation.

#### 32.2 Critical UAT Scenarios

1. Create a draft car-carrying load with multiple stops and items.
2. Validate item pickup/drop-off mapping.
3. Attempt activation without required proof configuration or compliant resource.
4. Assign an available driver/truck/trailer successfully.
5. Attempt double-booking and confirm rejection.
6. Activate and notify driver.
7. Driver accepts and begins trip.
8. GPS appears with correct freshness.
9. Dispatcher sends a destination and receives acknowledgement.
10. Record a delay and update ETA.
11. Swap trailer and confirm history.
12. Upload pickup/loading/delivery proof.
13. Complete load only after mandatory evidence.
14. Verify all events appear in timeline and audit log.
15. Confirm dispatcher cannot access unauthorised finance/payroll data.
16. Confirm branch-scoped user cannot access another branch through direct API or URL manipulation.
17. Assign a workforce shift and verify planning availability updates.
18. Export an authorised report and verify audit record.

#### 32.3 Definition of Done

A feature is complete only when:

- Approved UX is implemented.
- Functional requirements and acceptance criteria pass.
- Server-side permission enforcement is verified.
- Validation and error states are implemented.
- Audit events are present.
- Automated tests pass.
- Accessibility checks pass.
- Performance is within agreed targets.
- Product Owner/UAT approval is recorded.
- Operational documentation is updated.
- No unresolved critical or high-severity defects remain.

---

### 33. Risks, Dependencies and Open Decisions

#### 33.1 Key Risks

| **Risk** | **Impact** | **Mitigation** |
|---|---|---|
| GPS provider latency or outages | Incorrect live view and ETA decisions | Display freshness, provider health and degraded mode |
| Inconsistent load status names | Confusing dashboards and incorrect reporting | Approve one canonical status model |
| Resource data not updated | Invalid assignments | Real-time revalidation at activation and assignment |
| Excess dispatcher access | Privacy/security exposure | Least privilege and field-level permissions |
| Planning concurrency | Double-booking or overwritten assignments | Optimistic locking and transactional reservations |
| Large photo volume | Storage/performance cost | Direct secure upload, compression and lifecycle policy |
| AI/optimiser errors | Unsafe or inefficient assignments | Hard-rule validation and human confirmation |
| Mixed sample dates/time zones | Scheduling errors | UTC storage, branch time zone and explicit display |
| Financial reports visible to dispatcher | Data exposure | Category-level report permissions |
| Manual status changes | Broken operational truth | Transition rules, reason codes and audit history |

#### 33.2 Dependencies

- Approved Admin Portal role and permission framework.
- Driver Portal status and proof APIs.
- GPS/telematics provider selection.
- Mapping/routing provider selection.
- Vehicle, trailer and driver master data quality.
- Compliance and maintenance rules.
- Warehouse/yard module integration.
- SMS/push/email/WhatsApp provider configuration.
- Object storage and malware scanning.
- Approved load status taxonomy.

#### 33.3 Open Decisions Requiring Stakeholder Confirmation

1. Is the quick load form allowed to create an Active load, or only Draft/Planned?
2. What is the canonical progress calculation: stages, stops or combined?
3. Which load statuses are stored versus displayed as grouped categories?
4. Can dispatchers create full driver profiles, or only view operational data?
5. Can dispatchers create customers directly, or only provisional records?
6. Which proof photos are mandatory by load type and customer?
7. Does geofence arrival automatically suggest or update status?
8. Which GPS source is authoritative when mobile and vehicle telematics differ?
9. What working-hour/fatigue rules must the assignment engine enforce?
10. Can a dispatcher cancel or complete a load without supervisor approval?
11. Which report categories are available to dispatchers?
12. Is WhatsApp an approved communication channel?
13. What data retention applies to GPS history, messages and proof photos?
14. Are cross-branch assignments allowed, and who approves them?
15. What are the target GPS update interval and stale/offline thresholds?
16. Are route optimisation and Auto Fill features required for initial release?
17. Is the portal multi-company SaaS or a single-company deployment with multiple branches?
18. Which customer and driver fields are considered sensitive under company policy?

---

### Appendix A — Status Definitions

#### A.1 Load Statuses

| **Status** | **Definition** |
|---|---|
| Draft | Incomplete or unvalidated load not ready for dispatch |
| Planned | Scheduled load that may still require assignment or final validation |
| Pending Dispatch | Ready for assignment/acceptance or awaiting final release |
| Assigned | Driver/resources assigned; not yet accepted or started |
| Accepted | Driver has accepted the assignment |
| En Route to Pickup | Driver travelling to pickup |
| At Pickup | Driver arrived at pickup |
| Loaded | Required items loaded and relevant proof captured |
| In Transit | Load travelling between stops |
| At Delivery | Driver arrived at delivery location |
| Delivered | Delivery evidence recorded and physical delivery completed |
| Completed | Operational closure checks passed |
| Delayed | Schedule impact identified; may coexist as exception flag with active state |
| On Hold | Operationally paused with reason |
| Cancelled | Load cancelled and retained for audit |
| Failed Delivery | Delivery could not be completed and requires resolution |

#### A.2 Driver Statuses

- Available.
- On Duty.
- Assigned.
- En Route.
- At Pickup.
- At Delivery.
- Break.
- Off Duty.
- On Leave.
- Unavailable.
- Offline.

#### A.3 Vehicle/Trailer Statuses

- Available.
- Assigned.
- Active/In Use.
- In Maintenance.
- Out of Service.
- Compliance Blocked.
- Inactive/Sold.

#### A.4 Alert Statuses

- Open.
- Acknowledged.
- In Progress.
- Waiting.
- Resolved.
- Closed.

---

### Appendix B — Dispatcher Permission Matrix

| **Capability** | **Default** | **Elevated Permission** |
|---|---:|---:|
| View own authorised branches | Yes | No |
| View all company branches | No | Yes |
| Create load | Yes | No |
| Edit draft/planned load | Yes | No |
| Edit in-progress load | Limited | Yes for material changes |
| Activate/dispatch load | Yes | No |
| Cancel load | Limited | May require approval |
| Complete load manually | No | Yes |
| Assign driver/truck/trailer | Yes | No |
| Override compliance block | No | Yes |
| View GPS live | Yes | No |
| Export GPS history | No | Yes |
| Message driver/team | Yes | No |
| Broadcast message | No | Yes |
| View driver operational data | Yes | No |
| View driver payroll/bank/tax data | No | Yes, usually not dispatcher |
| Create driver | No | Yes |
| Edit vehicle master data | No | Yes |
| Create provisional customer | Configurable | Yes |
| Edit customer billing terms | No | Yes, usually Accounts/Sales |
| Assign workforce shift | Configurable | Yes |
| View operational reports | Yes | No |
| View financial/payroll reports | No | Yes |
| Export authorised reports | Configurable | Yes |
| Edit own profile | Yes | No |
| Edit own role/branch/permissions | No | Never self-service |

---

### Appendix C — Screen Inventory

| **Screen** | **Primary Purpose** |
|---|---|
| Dispatch Dashboard | Operational metrics, load cards, planning preview, GPS and driver status |
| Quick Create Load | Rapid simple load creation |
| All Loads | Search, filter, group, sort and manage loads |
| Create Load Console | Detailed multi-stop, multi-item and resource assignment workflow |
| Active Loads | Monitor current work and exceptions |
| Load Details | Review progress, route, items, evidence, assignments and actions |
| Planning Board | Schedule and assign loads to drivers/assets |
| Planning Quick Create | Create planned load from board context |
| Live GPS Map | Real-time map and on-road monitoring |
| Send Location | Send coordinates/navigation instructions to driver |
| Drivers List | Driver availability, assignment and compliance overview |
| Add Driver | Permission-controlled driver onboarding |
| Vehicles / Trailers | Fleet availability, assignment and compliance |
| Customers | Operational customer lookup and limited creation |
| Yard / Warehouse | Facility, stock and task readiness visibility |
| Workforce Availability | Shift, availability and resource capacity planning |
| Assign Shift | Create a worker shift |
| Messages | Driver/team conversations and load communication |
| New Message | Compose direct/group communication |
| Reports Dashboard | Authorised operational analytics and exports |
| Dispatcher Profile | Personal information, permissions, activity and security |
| Edit Profile | Update allowed personal fields |

---

### Appendix D — Acceptance Checklist

#### Authentication and Access

- [ ] Dispatcher signs in and sees only authorised branches.
- [ ] Direct API/URL access to another branch is rejected.
- [ ] Financial, payroll and settings modules are hidden by default.
- [ ] Role and permissions are read-only in the dispatcher profile.

#### Loads

- [ ] Dispatcher can create and save an incomplete draft.
- [ ] Dispatcher can add multiple stops and reorder them.
- [ ] Dispatcher can add multiple items and map each item to stops.
- [ ] Activation blocks missing mandatory information.
- [ ] Assignment blocks unavailable or non-compliant resources.
- [ ] Status transitions follow the approved lifecycle.
- [ ] Cancellation and hold require a reason.
- [ ] Completed/cancelled records remain auditable.

#### Planning

- [ ] Board shows resource schedule and unassigned loads.
- [ ] Drag-and-drop validates conflicts before saving.
- [ ] Optimisation suggestions require confirmation.
- [ ] Board updates appear in load and driver views.

#### GPS

- [ ] Live marker shows source and freshness.
- [ ] Offline/stale telemetry is clearly identified.
- [ ] GPS history is permission controlled and audited.
- [ ] Dispatcher can send validated location instructions.
- [ ] Driver acknowledgement is shown when required.

#### Drivers and Fleet

- [ ] Driver compliance and availability are visible.
- [ ] Sensitive driver data is masked/restricted.
- [ ] Vehicles and trailers are validated separately.
- [ ] Maintenance/out-of-service assets cannot be assigned.
- [ ] Resource swaps retain history.

#### Evidence

- [ ] Pickup, loading and delivery proof stages are configurable.
- [ ] Evidence stores time, uploader and available GPS metadata.
- [ ] Missing mandatory evidence blocks completion.
- [ ] Superseded evidence remains auditable.

#### Workforce and Warehouse

- [ ] Shift conflicts and leave conflicts are blocked.
- [ ] Shift assignments update resource availability.
- [ ] Load-linked warehouse/yard tasks are visible.
- [ ] Delayed readiness generates alerts.

#### Messages and Reports

- [ ] Load-linked messages are accessible from the load context.
- [ ] Message delivery/read state is visible.
- [ ] Dispatcher sees only authorised report categories.
- [ ] Exports reflect filters and create audit events.

#### Security and Quality

- [ ] MFA/2FA is supported.
- [ ] Sessions can be viewed and revoked.
- [ ] File uploads are validated and scanned.
- [ ] Critical actions are audited.
- [ ] Major pages have loading, empty and error states.
- [ ] Accessibility and keyboard navigation pass agreed checks.
- [ ] No unresolved critical or high-severity UAT defects remain.

---

### Sign-Off

| **Role** | **Name** | **Decision** | **Date** |
|---|---|---|---|
| Product Owner |  | Approved / Changes Required |  |
| Operations Lead |  | Approved / Changes Required |  |
| Dispatch Lead |  | Approved / Changes Required |  |
| Engineering Lead |  | Approved / Changes Required |  |
| QA/UAT Lead |  | Approved / Changes Required |  |
| Security/Compliance Representative |  | Approved / Changes Required |  |

---

**End of Document — Hero Logistics Dispatcher Portal PRD v1.0**

---

## Part 3 — Warehouse Portal

**Portal Scope:** Inbound receiving, inventory location, movements, staging, load lanes, dispatch preparation and warehouse tooling.

**Source File:** `Hero_Logistics_Warehouse_Portal_PRD_v1.0(1).md`

### Hero Logistics — Warehouse Portal Product Requirements Document (PRD)

**Document Version:** 1.0  
**Product Area:** Warehouse & Yard Operations  
**Portal:** Warehouse Portal  
**Primary Roles:** Warehouse Manager, Warehouse Supervisor, Warehouse Staff, Yard Staff, Forklift Operator  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Default Timezone:** Australia/Sydney unless overridden by depot configuration

---

#### 1. Document Purpose

This Product Requirements Document defines the functional, operational, security and technical requirements for the **Hero Logistics Warehouse Portal**.

The portal will provide a central operational workspace for receiving stock, locating items, moving and transferring inventory, staging items, managing load lanes, preparing dispatches, tracking warehouse and yard capacity, printing labels and documents, scanning QR/barcodes, communicating with teams and reviewing warehouse performance.

The supplied screens contain sample names, dates, locations, counts, loads, vehicles, inventory values and statuses. These are illustrative and must be replaced with live tenant and depot data.

---

#### 2. Product Vision

Create a real-time warehouse and yard operating system that gives every authorised worker a reliable view of **what arrived, where it is, where it must move, what is staged, what is dispatch-ready and who performed every action**.

The system must reduce inventory location errors, shorten dock-to-dispatch time, improve yard utilisation, strengthen Chain of Responsibility evidence and maintain a complete audit trail for every item movement.

---

#### 3. Product Goals

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

---

#### 4. Success Metrics

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

---

#### 5. User Roles

##### 5.1 Warehouse Manager

May supervise depot operations, receive stock, create moves, manage load lanes and staging areas, review dispatch readiness, view reports, manage authorised staff actions and handle exceptions.

##### 5.2 Warehouse Supervisor

May perform operational management within assigned warehouses, zones and shifts, with limited configuration rights.

##### 5.3 Warehouse Staff

May receive, scan, locate, stage, move and dispatch items according to assigned permissions.

##### 5.4 Yard Staff

May manage vehicle, container, trailer and equipment movements within yard locations.

##### 5.5 Forklift Operator

May receive movement tasks, scan items, confirm moves and report failures or damage.

##### 5.6 Read-Only Operations User

May view stock, locations, load lanes, reports and history without changing records.

---

#### 6. Access and Scope Principles

1. Users are tenant-scoped and depot/warehouse-scoped.
2. Access to another depot or branch requires explicit permission.
3. The backend must enforce permissions independently of frontend visibility.
4. Sensitive commercial, employee and customer fields must be masked when not operationally required.
5. Dangerous goods and restricted storage areas require additional permissions.
6. Inventory adjustments, cancellations and movement overrides require elevated permission.
7. All exports must respect the same access rules as on-screen data.

##### 6.1 Suggested Permission Keys

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

---

#### 7. Portal Navigation

1. Dashboard
2. Find Stock
3. Receive (Inbound)
4. Move / Transfer
5. Load Lanes
6. Dispatch Ready
7. Stage (Holding Areas)
8. Movement History
9. Messages
10. My Shift
11. Warehouse & Yard Map
12. Reports & Analytics
13. Tools
    - Labels & Barcodes
    - Print Documents
    - QR Scanner
    - Import / Export
    - Batch Printing
14. Profile

##### 7.1 Shared Header

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

### 8. Functional Requirements

#### 8.1 Warehouse Dashboard

##### 8.1.1 Purpose

Provide a real-time operational overview of inbound activity, yard stock, move tasks, load-lane progress, dispatch-ready loads, capacity, recent movements and alerts.

##### 8.1.2 KPI Cards

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

##### 8.1.3 Dashboard Search

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

##### 8.1.4 Dashboard Sections

- Inbound Today
- Load Lanes Overview
- Recent Movements
- Quick Actions
- Yard Capacity
- Notifications

##### 8.1.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DASH-001 | Dashboard must show real-time depot-scoped operational KPIs. | Must |
| WH-DASH-002 | KPI cards must open filtered target pages. | Should |
| WH-DASH-003 | Dashboard must display last sync and connectivity status. | Must |
| WH-DASH-004 | Dashboard search must support all core identifiers. | Must |
| WH-DASH-005 | Recent movements must show item, action, location and time. | Must |
| WH-DASH-006 | Capacity utilisation must be visible by yard or warehouse. | Must |
| WH-DASH-007 | Dashboard must support tablet and forklift-terminal layouts. | Must |

##### 8.1.6 Acceptance Criteria

- A warehouse user can see current inbound, movement, staging and dispatch counts.
- Selecting a KPI opens the correct filtered page.
- Last sync and online/offline state are visible.
- Users cannot see data from unauthorised depots.

---

#### 8.2 Find Stock

##### 8.2.1 Purpose

Allow users to locate any authorised item, vehicle, pallet, container, freight item or equipment record.

##### 8.2.2 Search Identifiers

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

##### 8.2.3 Filters

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

##### 8.2.4 Results Columns

- item / description;
- identifiers;
- item type;
- location;
- status;
- load/job;
- customer;
- updated time;
- action.

##### 8.2.5 Item Detail Panel

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

##### 8.2.6 Requirements

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

#### 8.3 Receive (Inbound)

##### 8.3.1 Purpose

Record incoming inventory, confirm condition and assign the first warehouse or yard location.

##### 8.3.2 Main Actions

- Cancel
- Save as Draft
- Receive Items
- Add Item
- Import Items
- Scan Barcode / QR
- Upload CSV
- Attach Documents
- Capture Photos

##### 8.3.3 Section 1 — Inbound Details

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

##### 8.3.4 Section 2 — Location

Configurable hierarchy:

**Depot → Warehouse/Yard → Zone → Row → Bay → Position → Staging Area**

Rules:

1. Required hierarchy levels depend on company configuration.
2. Inactive, full, restricted or incompatible locations cannot be selected.
3. Dangerous goods must use compatible authorised locations.
4. Cold-chain goods must use temperature-compatible locations.
5. Location capacity must be checked before confirmation.
6. A human-readable location preview must be displayed.

##### 8.3.5 Section 3 — Item Entry

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

##### 8.3.6 Section 4 — Items to Receive

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

##### 8.3.7 Section 5 — Documents and Photos

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

##### 8.3.8 Receive Checklist

- item count verified;
- condition checked;
- documents verified;
- photos captured;
- location confirmed;
- restricted handling complete where applicable.

##### 8.3.9 Draft vs Receive

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

##### 8.3.10 Offline Support

When enabled:

- drafts and scans may be stored in an encrypted local queue;
- offline records must carry device timestamp and temporary ID;
- conflicts must be resolved on sync;
- duplicate receipt protection is mandatory;
- users must see pending, synced and failed states.

##### 8.3.11 Requirements

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

#### 8.4 Move / Transfer

##### 8.4.1 Purpose

Move items within the same depot or transfer items to another depot, branch or warehouse.

##### 8.4.2 Movement Types

1. Move Within Depot
2. Transfer to Another Depot
3. Stage to Holding Area
4. Move to Load Lane
5. Return to Storage
6. Dispatch / Pickup
7. Quarantine / Hold
8. Damage / Inspection Move

##### 8.4.3 Movement Details

- reference number;
- date/time;
- reason;
- priority;
- notes;
- source depot;
- destination depot where applicable;
- assigned staff/equipment;
- required completion time.

##### 8.4.4 Item Selection

- scan item;
- search identifier;
- import from list;
- select from load;
- select from staging area;
- select from movement task.

##### 8.4.5 Item Movement Fields

- item;
- type;
- from location;
- to location;
- condition;
- quantity;
- handling equipment;
- action.

##### 8.4.6 Movement Validation

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

##### 8.4.7 Internal Move

On completion:

- current location changes;
- movement event is recorded;
- capacity is adjusted;
- linked load/lane is updated;
- notifications are sent when configured.

##### 8.4.8 Inter-Depot Transfer

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

##### 8.4.9 Confirmation

Users must confirm item correctness before creating or completing the movement.

##### 8.4.10 Requirements

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

#### 8.5 Load Lanes

##### 8.5.1 Purpose

Manage staging lanes used to consolidate cargo before dispatch.

##### 8.5.2 Lane Data

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

##### 8.5.3 Lane Statuses

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

##### 8.5.4 Lane Actions

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

##### 8.5.5 Lane Detail

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

##### 8.5.6 Lane Rules

1. Lane capacity cannot be exceeded without authorised override.
2. Restricted cargo must use compatible lanes.
3. A lane may be reserved for one or multiple loads depending on configuration.
4. A load cannot be ready until all mandatory items are present.
5. Removed items must receive a new valid location.
6. Lane status must reflect item and load state.
7. Emptying the lane must release capacity.

##### 8.5.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-LANE-001 | Users can view current lane utilisation and load assignment. | Must |
| WH-LANE-002 | Users can move authorised items into a compatible lane. | Must |
| WH-LANE-003 | Lane capacity must be enforced. | Must |
| WH-LANE-004 | Lane status must update from operational events. | Must |
| WH-LANE-005 | Ready state requires configured verification checks. | Must |
| WH-LANE-006 | Lane actions must be fully audited. | Must |

---

#### 8.6 Dispatch Ready

##### 8.6.1 Purpose

Show staged loads that are ready or nearly ready for driver pickup and departure.

##### 8.6.2 Summary Metrics

- Ready to Dispatch
- Today’s Dispatch
- Awaiting Pickup
- Exceptions
- Hold

##### 8.6.3 Filters

- date;
- status;
- load lane;
- driver;
- trailer/vehicle;
- customer;
- load type;
- depot;
- exception state.

##### 8.6.4 List Columns

- load/reference;
- customer;
- truck/trailer;
- driver;
- load lane;
- ready since;
- status;
- actions.

##### 8.6.5 Dispatch Readiness Checklist

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

##### 8.6.6 Actions

- view load;
- mark as dispatched;
- print dispatch docket;
- send to driver;
- move to lane;
- place on hold;
- resolve exception;
- export.

##### 8.6.7 Mark as Dispatched

On confirmation:

- dispatch timestamp stored;
- user/device stored;
- load and item statuses updated;
- load lane occupancy updated;
- driver and dispatch system notified;
- movement history created;
- documents generated where configured;
- GPS/route workflow initiated where applicable.

##### 8.6.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DIS-001 | Only staged loads may enter dispatch-ready workflow. | Must |
| WH-DIS-002 | Mandatory checks must block dispatch when incomplete. | Must |
| WH-DIS-003 | Holds must display a reason and resolver. | Must |
| WH-DIS-004 | Dispatch confirmation must update all linked items atomically. | Must |
| WH-DIS-005 | Dispatch must create movement and audit records. | Must |
| WH-DIS-006 | Dispatch docket printing must use current verified data. | Must |

---

#### 8.7 Stage / Holding Areas

##### 8.7.1 Purpose

Manage temporary holding areas used before moving items to load lanes or final storage.

##### 8.7.2 Staging Area Data

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

##### 8.7.3 Tabs

- All Staging Areas
- By Zone
- By Load Lane
- Inactive Areas

##### 8.7.4 Actions

- add holding area;
- edit area;
- activate/deactivate;
- view items;
- move items;
- assign to load lane;
- print labels;
- export;
- refresh.

##### 8.7.5 Dwell-Time Rules

- configurable target dwell time;
- warning threshold;
- overdue threshold;
- alert recipients;
- escalation actions.

##### 8.7.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-STAGE-001 | Users can view staging occupancy and item age. | Must |
| WH-STAGE-002 | Overdue staged items must be highlighted. | Must |
| WH-STAGE-003 | Movement to a lane must validate capacity and load mapping. | Must |
| WH-STAGE-004 | Inactive areas cannot receive new items. | Must |
| WH-STAGE-005 | Staging summary must support occupancy reporting. | Should |

---

#### 8.8 Movement History

##### 8.8.1 Purpose

Provide the complete audit trail of item and stock movement.

##### 8.8.2 Filters

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

##### 8.8.3 Movement Types

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

##### 8.8.4 Result States

- Draft
- Pending
- In Progress
- Completed
- Failed
- Partially Completed
- Cancelled
- Reversed

##### 8.8.5 Movement Detail

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

##### 8.8.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-HIST-001 | Every confirmed stock movement must appear in history. | Must |
| WH-HIST-002 | History must be searchable and filterable. | Must |
| WH-HIST-003 | Normal users cannot delete or edit movement history. | Must |
| WH-HIST-004 | Failed and reversed movements must remain visible. | Must |
| WH-HIST-005 | Exports must include applied filters and timezone. | Must |
| WH-HIST-006 | Movement details must show actor and source device. | Must |

---

#### 8.9 Messages

##### 8.9.1 Purpose

Enable communication between warehouse teams, dispatch, drivers, branches, maintenance and customers where authorised.

##### 8.9.2 Features

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

##### 8.9.3 Warehouse-Specific Message Links

Messages may link to:

- inbound receipt;
- stock item;
- movement task;
- load lane;
- dispatch load;
- safety issue;
- damaged item;
- printer failure.

##### 8.9.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-MSG-001 | Users can send direct and team messages. | Must |
| WH-MSG-002 | Messages may link to operational records. | Must |
| WH-MSG-003 | Shared files must be access controlled and scanned. | Must |
| WH-MSG-004 | Urgent messages may trigger escalation. | Should |
| WH-MSG-005 | Message history must follow retention policy. | Must |

---

#### 8.10 My Shift

##### 8.10.1 Purpose

Show the logged-in worker’s current shift, assigned tasks, breaks, expected workload and safety obligations.

##### 8.10.2 Data

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

##### 8.10.3 Actions

- clock in/out where enabled;
- start break/end break;
- open task;
- report issue;
- message supervisor;
- complete safety checklist;
- request assistance.

##### 8.10.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SHIFT-001 | User can view current and upcoming shift information. | Must |
| WH-SHIFT-002 | Assigned operational tasks must be visible. | Must |
| WH-SHIFT-003 | Shift actions must be permission and policy controlled. | Must |
| WH-SHIFT-004 | Task completion must update operational dashboards. | Must |

---

#### 8.11 Safety Checklist and Defect Reporting

##### 8.11.1 Purpose

Support pre-start and operational safety checks for vehicles, forklifts, trailers and warehouse equipment.

##### 8.11.2 Checklist Response Types

- Yes / Pass
- No / Fail
- N/A
- Not Checked

##### 8.11.3 Features

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

##### 8.11.4 Safety Rules

1. Required items must be completed.
2. Failed safety items must create a defect or resolution workflow.
3. Equipment may be blocked from use when a critical defect exists.
4. Checklist submissions are immutable; corrections create a new revision.
5. Offline submissions must sync with device and server timestamps.

##### 8.11.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SAFE-001 | Required safety checks must be enforced before configured work. | Must |
| WH-SAFE-002 | Failed checks must create or link a defect. | Must |
| WH-SAFE-003 | Critical defects must block affected equipment. | Must |
| WH-SAFE-004 | Photos and notes must be supported. | Must |
| WH-SAFE-005 | Checklist history must be auditable. | Must |

---

#### 8.12 Warehouse & Yard Map

##### 8.12.1 Purpose

Provide an interactive real-time visual representation of warehouse and yard areas.

##### 8.12.2 Map Locations

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

##### 8.12.3 Location States

- Available
- In Use
- Staging
- On Hold
- Full
- Empty
- Maintenance
- Restricted

##### 8.12.4 Interactions

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

##### 8.12.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-MAP-001 | Map must display configured warehouse and yard locations. | Must |
| WH-MAP-002 | Capacity and status must use live operational data. | Must |
| WH-MAP-003 | Users can open location details from the map. | Must |
| WH-MAP-004 | Restricted areas must be clearly identified. | Must |
| WH-MAP-005 | Map must support large-screen and tablet use. | Must |

---

#### 8.13 Reports & Analytics

##### 8.13.1 Categories

- Overview
- Inventory
- Operations
- Productivity
- Dispatch
- Compliance

##### 8.13.2 KPI Examples

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

##### 8.13.3 Report Shortcuts

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

##### 8.13.4 Filters

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

##### 8.13.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-RPT-001 | Users can view authorised warehouse reports. | Should |
| WH-RPT-002 | Reports must respect depot and permission scope. | Must |
| WH-RPT-003 | Exported reports must show filters and generated time. | Must |
| WH-RPT-004 | Metric definitions must be consistent across reports. | Must |
| WH-RPT-005 | Alerts must link to supporting operational data. | Should |

---

#### 8.14 Labels & Barcodes

##### 8.14.1 Supported Label Targets

- Vehicle
- Pallet
- Container
- Item / Freight
- Load
- Location
- Holding Area
- Load Lane
- Custom

##### 8.14.2 Label Types

- VIN Label
- Pallet Label
- QR Code Label
- Container Label
- Load Label
- Location Label
- Holding Area Label
- Load Lane Label
- Custom Label

##### 8.14.3 Label Workflow

1. Select or scan item/location.
2. Select label type.
3. Review preview.
4. Edit permitted layout fields.
5. Select printer.
6. Select size and format.
7. Set copies and cut option.
8. Test print or print.
9. Record print event.

##### 8.14.4 Label Requirements

- unique readable identifier;
- barcode or QR validation;
- configurable templates;
- printer compatibility;
- print preview;
- reprint reason;
- recently printed history;
- batch printing support.

##### 8.14.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-LBL-001 | Users can generate labels from live master data. | Must |
| WH-LBL-002 | Printed identifier must match selected record. | Must |
| WH-LBL-003 | Printer online state must be visible. | Must |
| WH-LBL-004 | Reprints must be logged. | Must |
| WH-LBL-005 | Label templates must be configurable by authorised admins. | Should |

---

#### 8.15 Print Documents

##### 8.15.1 Document Types

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

##### 8.15.2 Document Generator

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

##### 8.15.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-DOC-001 | Documents must use current verified system data. | Must |
| WH-DOC-002 | Users can preview before printing. | Must |
| WH-DOC-003 | Generated documents must be versioned and auditable. | Must |
| WH-DOC-004 | Templates and layouts require admin permission to edit. | Must |
| WH-DOC-005 | PDF download may be supported according to permission. | Should |

---

#### 8.16 QR / Barcode Scanner

##### 8.16.1 Purpose

Decode item and location identifiers from mobile devices, tablets, forklift terminals or dedicated scanners.

##### 8.16.2 Scan Results

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

##### 8.16.3 Scan Actions

- view item;
- receive item;
- relocate stock;
- move to lane;
- verify load;
- print label;
- view history;
- report exception.

##### 8.16.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-SCAN-001 | Scanner must support configured barcode and QR formats. | Must |
| WH-SCAN-002 | Invalid or unknown codes must show a clear error. | Must |
| WH-SCAN-003 | Duplicate matching records must require selection. | Must |
| WH-SCAN-004 | Scan actions must respect permissions. | Must |
| WH-SCAN-005 | Offline scans may queue where offline mode is enabled. | Should |

---

#### 8.17 Import / Export

##### 8.17.1 Import Targets

- Stock Inventory
- New Item Catalogue
- Inbound Items
- Transfer Instructions
- Location Master
- Load-Lane Assignments
- Barcode Master

##### 8.17.2 Import Workflow

1. Select target schema.
2. Download template.
3. Upload CSV/XLSX.
4. Parse file.
5. Show validation preview.
6. Correct mapping if allowed.
7. Confirm import.
8. Show success/failure summary.
9. Download rejected rows.

##### 8.17.3 Export Datasets

- Full Stock Catalogue
- Yard & Dock Occupancy
- Outbound Load-Lane Logs
- Safety Certification Records
- Movement History
- Inbound Receipts
- Dispatch Records
- Staging Inventory

##### 8.17.4 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-IMP-001 | Import must provide schema validation. | Must |
| WH-IMP-002 | Invalid rows must not silently import. | Must |
| WH-IMP-003 | Large imports must run safely with progress state. | Must |
| WH-IMP-004 | Import and export events must be audited. | Must |
| WH-IMP-005 | Exports must respect active filters and scope. | Must |

---

#### 8.18 Batch Printing and Printer Management

##### 8.18.1 Print Queue

- job ID;
- job name;
- target printer;
- pages/labels;
- queue status;
- progress;
- action.

##### 8.18.2 Queue Statuses

- Draft
- Queued
- Printing
- Paused
- Completed
- Failed
- Cancelled

##### 8.18.3 Printer Data

- printer name;
- type;
- IP/connection;
- location;
- online state;
- queue length;
- supported sizes;
- last successful print;
- error.

##### 8.18.4 Actions

- pause spooler;
- resume spooler;
- clear completed;
- retry failed;
- cancel job;
- reassign printer;
- test print.

##### 8.18.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-PRINT-001 | Users can view print queue status. | Must |
| WH-PRINT-002 | Failed jobs must show actionable errors. | Must |
| WH-PRINT-003 | Retrying a job must not create uncontrolled duplicates. | Must |
| WH-PRINT-004 | Print events and reprints must be logged. | Must |
| WH-PRINT-005 | Printer access must be limited by depot/network configuration. | Must |

---

#### 8.19 Profile

##### 8.19.1 Profile Data

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

##### 8.19.2 Security

- change password;
- two-factor authentication;
- active sessions;
- revoke session;
- logout all devices.

##### 8.19.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| WH-PRO-001 | User can view their profile and permissions. | Must |
| WH-PRO-002 | User can edit permitted contact and preference fields. | Must |
| WH-PRO-003 | Certification expiry must be visible. | Must |
| WH-PRO-004 | Active sessions can be viewed and revoked. | Must |
| WH-PRO-005 | Permission changes are read-only in the profile. | Must |

---

### 9. End-to-End Workflows

#### 9.1 Inbound Receiving Workflow

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

#### 9.2 Move Within Depot

1. User selects movement type.
2. Selects or scans items.
3. System confirms current locations.
4. User selects destination locations.
5. System validates capacity and compatibility.
6. User confirms movement.
7. System updates item locations and location capacity atomically.
8. Movement history and audit are created.

#### 9.3 Inter-Depot Transfer

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

#### 9.4 Stage to Load Lane

1. User opens staged item or load.
2. Selects assigned load lane.
3. System validates lane and capacity.
4. User scans and moves items.
5. Lane progress updates.
6. Missing, extra or damaged item exceptions are shown.
7. When all checks pass, lane/load may be marked ready.

#### 9.5 Dispatch Workflow

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

#### 9.6 Damage Workflow

1. Damage is identified during receiving or movement.
2. User marks damage and adds photos/notes.
3. System creates exception/defect record.
4. Item may move to hold or inspection location.
5. Supervisor reviews.
6. Disposition is recorded: accepted, repaired, returned, quarantined or written off.
7. History remains linked to item and movement.

---

### 10. Status Models

#### 10.1 Item Status

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

#### 10.2 Receipt Status

- Draft
- Pending
- Receiving
- Partially Received
- Received
- Exception
- Cancelled

#### 10.3 Movement Status

- Draft
- Pending
- Assigned
- In Progress
- Partially Completed
- Completed
- Failed
- Cancelled
- Reversed

#### 10.4 Lane Status

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

#### 10.5 Dispatch Status

- Staging
- Verification Required
- Ready
- Awaiting Pickup
- Hold
- Dispatched
- Exception
- Cancelled

---

### 11. Core Business Rules

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

### 12. Notifications and Alerts

#### 12.1 Operational Alerts

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
- safety checklist failed.

#### 12.2 Channels

- in-app;
- push;
- email;
- SMS;
- team message;
- supervisor escalation.

---

### 13. Audit Requirements

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
- profile/security change.

Each event must store:

- event ID;
- tenant;
- depot/warehouse;
- actor ID and role;
- entity type and ID;
- action;
- before/after values when appropriate;
- reason;
- timestamp;
- IP/device;
- correlation ID;
- source application.

---

### 14. Suggested Data Model

#### 14.1 Core Entities

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

#### 14.2 Key Relationships

- Depot has many warehouses, zones, staging areas and load lanes.
- Item has one current active location and many historical movements.
- Receipt has many receipt items.
- Movement has many movement items.
- Transfer links source and destination depots.
- Load has many items and may use one or more load lanes.
- Print jobs target a printer and one or more records.
- Safety defects may block equipment, items or dispatch.

---

### 15. API Requirements

Suggested API groups:

- `/api/warehouse/dashboard`
- `/api/warehouse/items`
- `/api/warehouse/items/:id`
- `/api/warehouse/items/:id/history`
- `/api/warehouse/receipts`
- `/api/warehouse/receipts/:id/receive`
- `/api/warehouse/movements`
- `/api/warehouse/transfers`
- `/api/warehouse/load-lanes`
- `/api/warehouse/staging-areas`
- `/api/warehouse/dispatch-ready`
- `/api/warehouse/dispatch/:id/confirm`
- `/api/warehouse/locations`
- `/api/warehouse/map`
- `/api/warehouse/scanner/decode`
- `/api/warehouse/labels`
- `/api/warehouse/documents`
- `/api/warehouse/print-jobs`
- `/api/warehouse/printers`
- `/api/warehouse/imports`
- `/api/warehouse/exports`
- `/api/warehouse/reports`
- `/api/warehouse/safety-checklists`
- `/api/warehouse/messages`
- `/api/profile`
- `/api/audit`

API requirements:

- secure authentication;
- tenant and depot checks;
- RBAC;
- validation;
- idempotency for receive, movement and dispatch operations;
- optimistic concurrency;
- pagination/filter/sort;
- transaction safety;
- standard errors;
- correlation IDs;
- audit hooks;
- secure file upload;
- rate limiting.

---

### 16. Integrations

Potential integrations:

- transport management system;
- dispatch portal;
- driver app;
- barcode/QR scanners;
- local thermal printers;
- network laser printers;
- document storage;
- virus scanning;
- VIN/registration lookup;
- GPS/telematics;
- email/SMS/push;
- accounting/ERP where required;
- label rendering service;
- identity provider.

Integration failures must show actionable status and must not silently lose operational records.

---

### 17. Security Requirements

#### 17.1 Authentication

- strong password rules;
- optional/required 2FA;
- secure session expiry;
- device/session management;
- brute-force protection;
- audit logging.

#### 17.2 Authorisation

- server-side RBAC;
- tenant isolation;
- depot/warehouse scope;
- restricted-zone permission;
- object-level access checks;
- export and printing permissions.

#### 17.3 Data Protection

- TLS in transit;
- encryption at rest;
- secure secrets;
- protected attachments;
- malware scanning;
- data retention;
- backup and restore;
- PII minimisation.

#### 17.4 Offline Security

- encrypted local storage;
- automatic expiry;
- logout wipe;
- device registration where required;
- conflict-safe sync;
- no sensitive unencrypted cache.

---

### 18. Non-Functional Requirements

#### 18.1 Performance

- common search under 2 seconds;
- scan result under 1 second after decode;
- movement confirmation under 2 seconds;
- dashboard load under 3 seconds;
- map load under 4 seconds;
- large exports processed asynchronously;
- print queue state updates near real time.

#### 18.2 Availability

- 99.9% monthly target;
- graceful degradation for printer/scanner integrations;
- retry-safe operations;
- health monitoring;
- backups and disaster recovery.

#### 18.3 Scalability

Support:

- multi-tenant companies;
- multiple depots;
- thousands of locations;
- millions of movement records;
- high scan frequency;
- concurrent mobile devices;
- large attachment storage;
- multiple print queues.

#### 18.4 Device Support

- desktop;
- standard tablet;
- rugged tablet;
- forklift terminal;
- mobile scanner browser;
- dedicated scanner integration where available.

#### 18.5 Accessibility

- keyboard navigation;
- visible focus;
- accessible labels;
- high contrast;
- status not based only on colour;
- large touch targets;
- screen-reader-friendly forms.

---

### 19. UX Requirements

1. Prioritise scan-first workflows.
2. Keep key actions visible on tablet and mobile.
3. Show exact current location prominently.
4. Distinguish warning, hold and hard-block states.
5. Preserve form entries after validation errors.
6. Provide clear offline, pending-sync and failed-sync states.
7. Use confirmation for dispatch, cancellation and reversal.
8. Display the depot timezone.
9. Use human-readable location breadcrumbs.
10. Prevent double submission.
11. Show item counts and progress continuously.
12. Support camera capture directly from mobile devices.

---

### 20. Error Handling

Example:

```json
{
  "success": false,
  "code": "LOCATION_CAPACITY_EXCEEDED",
  "message": "Zone B / Row 2 / Bay 05 does not have enough available capacity.",
  "details": {
    "locationId": "LOC-B-R2-B05",
    "availableCapacity": 2,
    "requestedItems": 3
  },
  "correlationId": "COR-..."
}
```

User-facing errors must:

- explain the issue;
- provide the resolution where possible;
- preserve entered data;
- avoid stack traces;
- support safe retry;
- show row-level import errors.

---

### 21. Metric Definitions

#### 21.1 Inventory Accuracy

Percentage of audited item records whose system location and quantity match the physical result.

#### 21.2 Dwell Time

Time from entry into a staging or holding location until movement out of that location.

#### 21.3 Dock-to-Dispatch Time

Time from receipt/check-in at the depot to confirmed dispatch.

#### 21.4 Lane Utilisation

Occupied lane capacity divided by configured lane capacity for the selected period.

#### 21.5 Receiving Accuracy

Percentage of received items matching expected identifiers, quantity and condition without correction.

---

### 22. Release Plan

#### Phase 1 — Core Warehouse Operations

- authentication and permissions;
- dashboard;
- find stock;
- inbound receiving;
- movement within depot;
- movement history;
- basic load lanes;
- dispatch-ready workflow;
- profile;
- audit logs.

#### Phase 2 — Mobile and Scanning

- QR/barcode scanner;
- VIN lookup;
- camera capture;
- rugged tablet layouts;
- offline queue;
- label printing;
- document printing.

#### Phase 3 — Advanced Yard and Staging

- interactive map;
- staging-area management;
- inter-depot transfers;
- printer spooler;
- batch printing;
- safety checklist and defects.

#### Phase 4 — Analytics and Optimisation

- productivity analytics;
- dwell alerts;
- lane balancing insights;
- advanced reports;
- automated task suggestions;
- predictive capacity alerts.

---

### 23. Out of Scope for Initial Warehouse Release

Unless separately approved:

- full accounting;
- payroll processing;
- tenant subscription administration;
- role/permission creation by warehouse staff;
- autonomous robot control;
- fully automatic dispatch without human confirmation;
- unrestricted inventory write-offs;
- company-wide pricing management.

---

### 24. QA Test Areas

#### 24.1 Functional

- search and filters;
- receive draft/finalise;
- manual item entry;
- scans;
- CSV import;
- damage evidence;
- internal move;
- inter-depot transfer;
- staging;
- load-lane assignment;
- dispatch confirmation;
- history;
- labels;
- documents;
- print queue;
- safety checklist;
- profile.

#### 24.2 Negative

- duplicate VIN;
- invalid barcode;
- inactive location;
- full location;
- restricted location;
- wrong source location;
- duplicate item in move;
- dispatch with missing item;
- damaged item dispatch;
- printer offline;
- invalid import schema;
- stale record update;
- offline duplicate sync.

#### 24.3 Permission

- wrong tenant;
- wrong depot;
- direct API access;
- restricted zone;
- dispatch override;
- data export;
- printer access;
- audit access.

#### 24.4 Security

- IDOR;
- injection;
- XSS;
- file upload abuse;
- privilege escalation;
- token replay;
- local offline storage inspection;
- cross-tenant leakage.

#### 24.5 Performance

- large inventory;
- rapid scanning;
- concurrent receiving;
- large movement history;
- high-volume imports;
- batch label printing;
- multiple printer queues.

---

### 25. UAT Scenarios

#### UAT-01 — Receive Vehicle

**Given** an authorised warehouse user  
**When** valid inbound, vehicle, condition and location data are entered  
**Then** the vehicle is received, located and visible in Find Stock with history.

#### UAT-02 — Block Duplicate VIN

**Given** an active item already uses the VIN  
**When** the user tries to receive it again  
**Then** the system blocks or routes to an approved duplicate workflow.

#### UAT-03 — Location Capacity

**Given** a bay has insufficient capacity  
**When** three items are moved into space for two  
**Then** movement is blocked with capacity details.

#### UAT-04 — Move by Scan

**Given** an item exists in Zone A  
**When** the user scans the item and destination location  
**Then** the item moves and both capacities update.

#### UAT-05 — Dispatch Hold

**Given** a required item or document is missing  
**When** dispatch is attempted  
**Then** the system blocks dispatch and displays the missing requirement.

#### UAT-06 — Restricted Goods

**Given** a dangerous-goods item  
**When** a user selects a standard lane  
**Then** the system blocks the move.

#### UAT-07 — Offline Receiving

**Given** the device is offline and offline mode is enabled  
**When** the user saves a receipt  
**Then** it is queued and safely synchronised without duplication.

#### UAT-08 — Print Label

**Given** a matching item and online printer  
**When** a VIN label is printed  
**Then** the print job is logged and the identifier matches the item.

#### UAT-09 — Cross-Depot Restriction

**Given** a Sydney-only user  
**When** they request a Melbourne transfer through the API  
**Then** access is denied.

#### UAT-10 — Movement History

**Given** an item has received, moved, staged and dispatched events  
**When** its history is opened  
**Then** all events appear chronologically with actor and location.

---

### 26. Definition of Done

A feature is done only when:

- requirements are implemented;
- server-side permissions exist;
- business rules are enforced;
- audit events are recorded;
- responsive layouts are complete;
- offline behaviour is tested where included;
- error, loading and empty states exist;
- accessibility checks pass;
- automated tests pass;
- security review passes;
- QA and UAT pass;
- API documentation is updated;
- user documentation exists;
- monitoring is configured;
- no critical or high-severity defects remain.

---

### 27. Open Product Decisions

1. Which item types are enabled at launch?
2. What is the final location hierarchy for each depot?
3. Are positions mandatory within bays?
4. What capacity unit is used: item count, volume, weight or mixed?
5. Which goods require restricted zones?
6. Is offline receiving required in Phase 1?
7. Which barcode and QR formats are supported?
8. Which scanner hardware is used?
9. Which printer models and protocols are supported?
10. Which inbound documents are mandatory?
11. Are item photos mandatory for every vehicle?
12. What damage workflow and approval roles apply?
13. Who may override location and dispatch blocks?
14. Which safety checklists are warehouse-specific?
15. How are inter-depot transfer discrepancies resolved?
16. Can one load use multiple load lanes?
17. Can one lane hold multiple loads?
18. What is the staging dwell threshold?
19. What inventory and GPS retention policies apply?
20. Which reports are required for initial launch?

---

### 28. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Wrong item location | Lost stock and delays | Scan confirmation and atomic moves |
| Duplicate inbound item | Inventory duplication | Unique identifier rules and idempotency |
| Capacity overrun | Unsafe operations | Hard capacity validation |
| Restricted cargo misplacement | Compliance breach | Compatibility and permission rules |
| Offline sync conflict | Duplicate or stale data | Encrypted queue and conflict resolution |
| Dispatch with missing cargo | Customer failure | Readiness checklist and scan verification |
| Printer duplication | Label/document confusion | Controlled retry and print audit |
| Cross-depot leakage | Security breach | Server-side tenant/depot scope |
| Unclear movement reversal | Audit weakness | Reversal as a new linked transaction |
| High-volume history slowdown | Poor performance | Partitioning, indexes and archiving |

---

### 29. Suggested Permission Matrix

| Action | Warehouse Manager | Supervisor | Staff | Read Only |
|---|---:|---:|---:|---:|
| View Dashboard | Yes | Yes | Yes | Yes |
| Find Stock | Yes | Yes | Yes | Yes |
| Create Inbound Draft | Yes | Yes | Yes | No |
| Confirm Receipt | Yes | Yes | Conditional | No |
| Move Within Depot | Yes | Yes | Yes | No |
| Inter-Depot Transfer | Yes | Conditional | No | No |
| Manage Load Lanes | Yes | Yes | Conditional | No |
| Confirm Dispatch | Yes | Yes | Conditional | No |
| Override Hold | Conditional | Conditional | No | No |
| View Movement History | Yes | Yes | Yes | Yes |
| Export History | Yes | Conditional | No | Conditional |
| Print Labels | Yes | Yes | Yes | Conditional |
| Manage Print Queue | Yes | Yes | Conditional | No |
| Run Imports | Yes | Conditional | No | No |
| View Reports | Yes | Yes | Conditional | Yes |
| Edit Own Profile | Yes | Yes | Yes | Yes |
| Manage Roles | No | No | No | No |

---

### 30. Sample Validation Messages

- “VIN already exists on active item ITEM-10234.”
- “The selected bay has capacity for only 2 additional items.”
- “This item is currently locked by movement MT-1045.”
- “Dangerous goods cannot be placed in Lane 2.”
- “The scanned source location does not match the system location.”
- “Delivery note is required before receiving this inbound type.”
- “Damage photos are required because damage was noted.”
- “Dispatch is blocked: 2 required items are missing.”
- “Printer Zebra ZD421 is offline.”
- “This receipt was already finalised from another device.”
- “You do not have access to Melbourne Depot.”
- “This record was updated by another user. Refresh and retry.”

---

### 31. Sample Movement Audit Event

```json
{
  "eventId": "AUD-WH-1004",
  "tenantId": "TEN-001",
  "depotId": "SYD-DEPOT",
  "module": "warehouse_movements",
  "action": "item_moved",
  "actorId": "WS-1007",
  "actorRole": "WAREHOUSE_STAFF",
  "movementId": "MT-1045",
  "itemId": "ITEM-ABC123",
  "before": {
    "locationId": "ZONE-A-R4-B12-P01",
    "status": "IN_STORAGE"
  },
  "after": {
    "locationId": "ZONE-B-R2-B05-P03",
    "status": "IN_STORAGE"
  },
  "reason": "Repositioning",
  "timestampUtc": "2026-07-21T01:35:00Z",
  "deviceId": "FORKLIFT-TAB-07",
  "correlationId": "COR-..."
}
```

---

### 32. Sign-Off

| Stakeholder | Name | Status | Date |
|---|---|---|---|
| Product Owner |  | Pending |  |
| Warehouse Operations Lead |  | Pending |  |
| Yard Operations Lead |  | Pending |  |
| Technical Lead |  | Pending |  |
| Security Reviewer |  | Pending |  |
| QA Lead |  | Pending |  |
| Client Representative |  | Pending |  |

---

---

## Part 4 — Yard Attendant Portal

**Portal Scope:** Shift-based, scan-first yard execution for receiving, moving, staging, outbound verification and issue reporting.

**Source File:** `Hero_Logistics_Yard_Attendant_Portal_PRD_v1.0(1).md`

### Hero Logistics — Yard Attendant Portal Product Requirements Document (PRD)

**Document Version:** 1.0  
**Product Area:** Yard Attendant Portal  
**Platform:** Hero Logistics Transport, Warehouse & Yard Management System  
**Primary Role:** Yard Attendant  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Default Timezone:** Australia/Sydney (AEST/AEDT), configurable by depot  

---

#### 1. Document Purpose

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

#### 2. Product Vision

Provide yard attendants with a fast, mobile-friendly and scan-first operational system that keeps every item traceable from inbound receipt through movement, staging and outbound dispatch, while preventing unsafe, unauthorised or inaccurate stock movements.

---

#### 3. Product Goals

##### 3.1 Primary Goals

1. Reduce manual yard paperwork and duplicated data entry.
2. Allow stock to be received and located quickly.
3. Ensure every movement creates a traceable audit event.
4. Improve load-lane readiness and outbound turnaround time.
5. Prevent items from being moved into invalid, restricted or full locations.
6. Support barcode/QR-driven operations on handheld devices and yard tablets.
7. Provide reliable offline capture where yard connectivity is weak.
8. Make safety and damage reporting immediate and evidence-based.
9. Restrict attendants to assigned depots, locations and operational actions.

##### 3.2 Success Metrics

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

#### 4. Primary User Persona

##### 4.1 Yard Attendant

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

##### 4.2 Related Roles

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

#### 5. Role Scope and Access Principles

##### 5.1 Default Scope

The Yard Attendant role is **depot-scoped and task-scoped by default**.

The user may access only:

- assigned company;
- assigned branch or depot;
- authorised yard, warehouse, zones, rows, bays and load lanes;
- assigned inbound, movement, staging and outbound work;
- permitted operational records and reports.

##### 5.2 Default Restrictions

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

##### 5.3 Permission Examples

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

#### 6. Portal Navigation

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

#### 7. Shared Header and Global Functions

##### 7.1 Header Elements

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

##### 7.2 Global Search

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

##### 7.3 Global Status Indicators

The portal should show:

- online;
- syncing;
- offline;
- sync failed;
- last successful sync time;
- local queued action count.

---

### 8. Functional Requirements

#### 8.1 Start Work / Finish Work

##### 8.1.1 Purpose

Track attendance and operational shift status for the yard attendant.

##### 8.1.2 Start Work

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

##### 8.1.3 Finish Work

The system may require:

- outstanding task review;
- uncompleted movement review;
- unsynced action review;
- assigned equipment return;
- issue handover note;
- final confirmation.

##### 8.1.4 Business Rules

1. A user cannot start multiple overlapping shifts.
2. Starting outside the configured depot geofence may warn or block.
3. Required induction or certification expiry may block work start.
4. Finish Work must not silently discard unsynced actions.
5. Shift status must be available to supervisors.

##### 8.1.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SHIFT-001 | Yard attendant can start an authorised shift. | Must |
| YARD-SHIFT-002 | Yard attendant can finish an active shift. | Must |
| YARD-SHIFT-003 | System must prevent overlapping active shifts. | Must |
| YARD-SHIFT-004 | Unsynced or incomplete work must be shown before finish. | Must |
| YARD-SHIFT-005 | Shift start and finish must be audited. | Must |

---

#### 8.2 Yard Dashboard

##### 8.2.1 Purpose

Provide a real-time operational overview of the assigned yard or depot.

##### 8.2.2 KPI Cards

- Inbound Awaiting Receive
- In Yard Vehicles / Items
- To Move Tasks
- Load Lanes in Progress
- Dispatch Ready
- Yard Capacity

Each KPI should support click-through to the relevant filtered page.

##### 8.2.3 Inbound Today

Columns:

- time;
- receipt number;
- supplier or source;
- item count;
- status.

##### 8.2.4 Load Lane Overview

Columns:

- lane;
- load;
- progress;
- status.

##### 8.2.5 Recent Movements

Columns:

- time;
- item;
- action;
- location.

##### 8.2.6 Quick Actions

- Receive Inbound
- Find Stock
- Move / Transfer
- Load Lanes
- Dispatch Ready
- Report Issue

##### 8.2.7 Notifications

Examples:

- load assigned to lane;
- item received;
- items ready to move;
- lane full;
- dispatch due;
- damage issue created;
- sync failed.

##### 8.2.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-DASH-001 | Dashboard must show depot-scoped operational KPIs. | Must |
| YARD-DASH-002 | KPI cards must link to filtered operational screens. | Should |
| YARD-DASH-003 | Dashboard must show last sync time. | Must |
| YARD-DASH-004 | Dashboard must show offline and pending-sync states. | Must |
| YARD-DASH-005 | Notifications must be role and location scoped. | Must |

---

#### 8.3 Receive — Inbound Intake

##### 8.3.1 Purpose

Record and confirm incoming vehicles, freight, pallets, containers, equipment and other inventory.

##### 8.3.2 Main Actions

- Cancel
- Save as Draft
- Receive Items
- Add Item
- Scan Barcode / QR
- Upload CSV
- Add Photos
- Add Documents

##### 8.3.3 Section 1 — Inbound Details

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

##### 8.3.4 Section 2 — Location

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

##### 8.3.5 Section 3 — Item Entry

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

##### 8.3.6 Vehicle Fields

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

##### 8.3.7 Generic Freight Fields

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

##### 8.3.8 Items to Receive Table

Columns:

- sequence;
- item type;
- description;
- identifier;
- destination location;
- condition;
- damage;
- actions.

##### 8.3.9 Documents and Photos

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

##### 8.3.10 Receive Checklist

- item count verified;
- condition checked;
- documents verified;
- photos captured;
- location confirmed;
- dangerous goods checks completed where applicable.

##### 8.3.11 Inbound Business Rules

1. Mandatory fields must be completed before final receive.
2. Duplicate VIN, barcode, container or item identifier must trigger review.
3. Destination must be valid, active and not restricted.
4. Capacity rules must be checked.
5. Dangerous goods may only be placed in authorised locations.
6. Damaged items must require issue or damage evidence according to policy.
7. Completing receipt creates inventory records and movement history.
8. Draft receipts do not create final stock availability unless configured.
9. Offline receipts must queue safely and prevent duplicate sync.

##### 8.3.12 Requirements

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

#### 8.4 Find & Search Stock

##### 8.4.1 Purpose

Locate vehicles, freight and inventory across authorised yard and warehouse locations.

##### 8.4.2 Search Inputs

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

##### 8.4.3 Filters

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

##### 8.4.4 Result Columns

- item / description;
- type;
- current location;
- status;
- load / job;
- customer;
- updated time;
- action.

##### 8.4.5 Item Details

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

##### 8.4.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SEARCH-001 | Search must support exact and partial identifiers. | Must |
| YARD-SEARCH-002 | Scan result must open the matching item quickly. | Must |
| YARD-SEARCH-003 | Results must show current authoritative location. | Must |
| YARD-SEARCH-004 | Search must be restricted to authorised locations. | Must |
| YARD-SEARCH-005 | Item details must show latest movement state. | Must |
| YARD-SEARCH-006 | Search filters must be combinable. | Must |

---

#### 8.5 Move

##### 8.5.1 Purpose

Move items within the depot or request transfer to another depot.

##### 8.5.2 Movement Types

- Move Within Depot
- Transfer to Another Depot
- Stage to Holding Area
- Move to Load Lane
- Return to Storage
- Move to Inspection
- Move to Maintenance / Hold

##### 8.5.3 Movement Details

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

##### 8.5.4 Items to Move

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

##### 8.5.5 Special Instructions

- requires equipment;
- notify after move;
- fragile;
- dangerous goods;
- temperature-controlled;
- security escort;
- free-text instructions.

##### 8.5.6 Validation Rules

1. Item must exist and be accessible.
2. Current location must match server state.
3. Destination must be active and permitted.
4. Destination capacity must be sufficient.
5. Restricted categories must match destination rules.
6. Item cannot be in a conflicting active movement.
7. Move confirmation must create a movement event.
8. Transfer to another depot creates a transfer job, not an immediate final location update.
9. Failed movements must preserve reason and original state.

##### 8.5.7 Requirements

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

#### 8.6 Stage Inventory — Holding Areas

##### 8.6.1 Purpose

Manage temporary holding areas used before items are moved to load lanes or other destinations.

##### 8.6.2 Summary Metrics

- total staging areas;
- active and inactive areas;
- staged items;
- awaiting move;
- overdue items.

##### 8.6.3 Views

- All Staging Areas
- By Zone
- By Load Lane
- Inactive Areas

##### 8.6.4 Columns

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

##### 8.6.5 Staging Statuses

- Active
- Inactive
- Available
- Near Capacity
- Full
- Restricted
- Maintenance

##### 8.6.6 Staged Item Statuses

- Staged
- Awaiting Move
- Ready for Lane
- On Hold
- Overdue
- Damaged
- Restricted

##### 8.6.7 Business Rules

1. Holding-area capacity must be enforced.
2. Dwell-time thresholds must be configurable.
3. Overdue items must generate alerts.
4. Dangerous goods must use authorised staging areas.
5. Items cannot be assigned to inactive areas.
6. Moving staged items must update occupancy in real time.
7. Yard attendants may not create a new holding area unless explicitly permitted.

##### 8.6.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-STAGE-001 | Staging areas must show capacity and occupancy. | Must |
| YARD-STAGE-002 | Yard attendant can assign eligible items to staging. | Must |
| YARD-STAGE-003 | Full or restricted staging areas must block movement. | Must |
| YARD-STAGE-004 | Dwell-time alerts must be generated. | Must |
| YARD-STAGE-005 | Staging assignment must create movement history. | Must |
| YARD-STAGE-006 | Staging actions must update load-lane readiness. | Should |

---

#### 8.7 Load Lane Management

##### 8.7.1 Purpose

Manage lanes where items are organised for outbound loading and dispatch.

##### 8.7.2 Summary Metrics

- total lanes;
- loads in progress;
- ready to dispatch;
- overdue / hold.

##### 8.7.3 Lane List Columns

- lane / area;
- status;
- load count;
- current load / reference;
- trailer / vehicle;
- driver;
- estimated dispatch;
- actions.

##### 8.7.4 Lane Statuses

- Empty
- Assigned
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Closed
- Maintenance

##### 8.7.5 Lane Detail

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

##### 8.7.6 Business Rules

1. Lane capacity must be enforced.
2. Items must belong to the assigned load unless authorised exception exists.
3. Lane readiness requires all configured items and checks.
4. Hold reasons must be recorded.
5. Lane cannot be marked ready with unresolved mandatory issues.
6. Emptying a lane must preserve item movement history.
7. Creating or deleting lanes is supervisor-level by default.

##### 8.7.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LANE-001 | Lane status and occupancy must update in real time. | Must |
| YARD-LANE-002 | Items can be moved into eligible lanes. | Must |
| YARD-LANE-003 | Wrong-load items must be blocked or require approved override. | Must |
| YARD-LANE-004 | Ready status must enforce configured checklist. | Must |
| YARD-LANE-005 | Hold and release actions must be audited. | Must |
| YARD-LANE-006 | Lane detail must show staged item list. | Must |

---

#### 8.8 Vehicles

##### 8.8.1 Purpose

Provide operational visibility into vehicles relevant to yard work.

##### 8.8.2 Summary

- total vehicles;
- active;
- in maintenance;
- out of service;
- compliance due.

##### 8.8.3 Columns

- vehicle / registration;
- type / make / model;
- year;
- status;
- current driver;
- odometer;
- compliance;
- next service;
- actions.

##### 8.8.4 Yard Attendant Access

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

##### 8.8.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-VEH-001 | Yard attendant can view operational vehicle data. | Must |
| YARD-VEH-002 | Out-of-service vehicles must be clearly identified. | Must |
| YARD-VEH-003 | Vehicle location must match movement records. | Must |
| YARD-VEH-004 | Defect reporting must be available from vehicle details. | Must |

---

#### 8.9 Locations

##### 8.9.1 Purpose

Allow attendants to view authorised depot, yard, warehouse and location structure.

##### 8.9.2 Location Types

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

##### 8.9.3 Required Data

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

##### 8.9.4 Default Access

The yard attendant may view locations and occupancy. Creation, deletion and configuration are supervisor or admin functions unless permission is granted.

##### 8.9.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LOC-001 | Location hierarchy must be configurable. | Must |
| YARD-LOC-002 | Location occupancy must update after movements. | Must |
| YARD-LOC-003 | Restricted locations must show clear access rules. | Must |
| YARD-LOC-004 | Location QR codes must resolve to location details. | Must |
| YARD-LOC-005 | Yard attendant must not create branches by default. | Must |

---

#### 8.10 Loads

##### 8.10.1 Purpose

Provide read-focused access to loads relevant to receiving, staging, lanes and outbound dispatch.

##### 8.10.2 Filters

- date range;
- status;
- type;
- customer;
- driver;
- vehicle;
- location;
- branch;
- search.

##### 8.10.3 Columns

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

##### 8.10.4 Yard Attendant Actions

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

##### 8.10.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LOAD-001 | Yard attendant can view authorised load data. | Must |
| YARD-LOAD-002 | Load detail must show expected and staged items. | Must |
| YARD-LOAD-003 | Physical milestone updates must be permission controlled. | Must |
| YARD-LOAD-004 | Yard actions must update dispatcher-visible load state. | Must |
| YARD-LOAD-005 | Load financial data must be hidden. | Must |

---

#### 8.11 Activities / Movement History

##### 8.11.1 Purpose

Provide a complete audit trail of physical stock and yard actions.

##### 8.11.2 Filters

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

##### 8.11.3 Columns

- date / time;
- movement type;
- item / description;
- from location;
- to location;
- load / reference;
- performed by;
- result;
- details.

##### 8.11.4 Movement Types

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

##### 8.11.5 Result States

- Completed
- Failed
- In Progress
- Cancelled
- Pending Sync

##### 8.11.6 Movement Detail

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

##### 8.11.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-ACT-001 | All successful and failed movements must be recorded. | Must |
| YARD-ACT-002 | History must be immutable to normal users. | Must |
| YARD-ACT-003 | Activity filters must support audit investigation. | Must |
| YARD-ACT-004 | Offline actions must show pending and final sync states. | Must |
| YARD-ACT-005 | Export and print must require permission. | Must |

---

#### 8.12 QR / Barcode Scan

##### 8.12.1 Purpose

Support fast operational execution using handheld scanners, mobile cameras and forklift tablets.

##### 8.12.2 Supported Actions

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

##### 8.12.3 Supported Identifiers

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

##### 8.12.4 Device State

- connected;
- online;
- ready;
- scanning;
- disconnected;
- error;
- camera permission denied.

##### 8.12.5 Scan Workflow

1. User selects action or uses configured default.
2. Device captures code.
3. System decodes identifier.
4. System identifies entity.
5. System displays key data.
6. User confirms operation.
7. Server validates permission and state.
8. Inventory and movement record update.
9. Success or failure feedback appears.

##### 8.12.6 Scan Rules

- duplicate rapid scans must be debounced;
- unknown codes must not create records automatically unless permitted;
- wrong item or location combination must block;
- scan action must retain device and user metadata;
- offline scans must have idempotency keys;
- audible and visual feedback should be supported.

##### 8.12.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-SCAN-001 | Portal must support hardware scanner and camera input. | Must |
| YARD-SCAN-002 | Scan response must be optimised for fast use. | Must |
| YARD-SCAN-003 | Duplicate scan protection must be implemented. | Must |
| YARD-SCAN-004 | Unknown or conflicting codes must show clear errors. | Must |
| YARD-SCAN-005 | Scan actions must create audit and movement records. | Must |
| YARD-SCAN-006 | Offline scans must sync safely without duplication. | Must |

---

#### 8.13 Yard & Warehouse Map

##### 8.13.1 Purpose

Provide a visual representation of yard and warehouse capacity, inventory and operational status.

##### 8.13.2 Map Areas

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

##### 8.13.3 Map Statuses

- Available
- In Use
- Staging
- On Hold
- Full
- Empty
- Maintenance
- Restricted

##### 8.13.4 Interactions

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

##### 8.13.5 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-MAP-001 | Map must reflect current location states. | Must |
| YARD-MAP-002 | Location drill-down must show current items. | Must |
| YARD-MAP-003 | Full and restricted areas must be visually distinct. | Must |
| YARD-MAP-004 | Map data must be depot scoped. | Must |
| YARD-MAP-005 | Refresh and last-updated time must be visible. | Must |

---

#### 8.14 Outbound Dispatch

##### 8.14.1 Purpose

Verify and record loads or items leaving the yard.

##### 8.14.2 Summary Metrics

- ready to dispatch;
- today’s dispatch;
- awaiting pickup;
- exceptions.

##### 8.14.3 Filters

- date;
- status;
- load lane;
- driver;
- trailer / vehicle;
- more filters.

##### 8.14.4 Columns

- load / reference;
- customer;
- trailer / vehicle;
- driver;
- load lane;
- ready since;
- status;
- actions.

##### 8.14.5 Statuses

- Ready
- Awaiting Pickup
- Driver Arrived
- Loading
- Hold
- Exception
- Dispatched
- Cancelled

##### 8.14.6 Dispatch Checklist

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

##### 8.14.7 Mark as Dispatched

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

##### 8.14.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-OUT-001 | Only eligible staged loads may appear as dispatch ready. | Must |
| YARD-OUT-002 | Mandatory dispatch checks must block departure confirmation. | Must |
| YARD-OUT-003 | Marking dispatched must update load, items and lane. | Must |
| YARD-OUT-004 | Hold items must not be dispatched. | Must |
| YARD-OUT-005 | Departure confirmation must be audited. | Must |
| YARD-OUT-006 | Dispatch docket printing must be supported where permitted. | Should |

---

#### 8.15 Labels & Barcodes

##### 8.15.1 Purpose

Generate and print operational labels for stock and locations.

##### 8.15.2 Label Types

- Vehicle / VIN Label
- Pallet Label
- QR Code Label
- Container Label
- Load Label
- Location Label
- Holding Area Label
- Load Lane Label
- Custom Label

##### 8.15.3 Label Data

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

##### 8.15.4 Print Statuses

- Generated
- Pending
- Printing
- Printed
- Failed
- Reprinted
- Cancelled

##### 8.15.5 Print Functions

- print single;
- print all pending;
- reprint;
- select printer;
- select label size;
- test print;
- number of copies;
- preview.

##### 8.15.6 Business Rules

1. Reprint must be recorded.
2. Duplicate active tags must be prevented according to label type.
3. Failed print jobs must not mark a label printed.
4. Printer errors must show actionable detail.
5. Printed labels must link to the correct entity.

##### 8.15.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-LABEL-001 | Yard attendant can print authorised labels. | Must |
| YARD-LABEL-002 | Label preview must show encoded and readable data. | Must |
| YARD-LABEL-003 | Reprints must be audited. | Must |
| YARD-LABEL-004 | Printer state must be visible. | Should |
| YARD-LABEL-005 | Failed jobs must remain retryable. | Must |

---

#### 8.16 Reports & Analytics

##### 8.16.1 Purpose

Provide yard attendants and supervisors with operational metrics relevant to assigned depots.

##### 8.16.2 Tabs

- Overview
- Inventory
- Operations
- Productivity
- Dispatch
- Compliance

##### 8.16.3 KPI Examples

- total items handled;
- received inbound;
- dispatched outbound;
- staged items;
- average dwell time;
- accuracy rate.

##### 8.16.4 Report Filters

- date range;
- warehouse;
- zone;
- load lane;
- item type;
- status.

##### 8.16.5 Report Shortcuts

- Inventory Summary
- Stock Aging Report
- Movement History Report
- Load Lane Utilisation
- Receiving Performance
- Dispatch Performance
- Accuracy & Audit Report
- Damaged Items Report

##### 8.16.6 Yard Attendant Report Scope

Default:

- view assigned depot reports;
- view personal productivity where enabled;
- export only if permitted;
- no company-wide financial reporting.

##### 8.16.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-RPT-001 | Reports must respect depot and permission scope. | Must |
| YARD-RPT-002 | Metrics must use defined calculation rules. | Must |
| YARD-RPT-003 | Export must respect active filters. | Must |
| YARD-RPT-004 | Financial information must not be shown. | Must |
| YARD-RPT-005 | Report generation and export must be audited. | Must |

---

#### 8.17 Report Issue

##### 8.17.1 Purpose

Allow attendants to report safety, damage, defect, missing item and operational issues immediately.

##### 8.17.2 Issue Categories

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

##### 8.17.3 Fields

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

##### 8.17.4 Severity

- Low
- Medium
- High
- Critical

##### 8.17.5 Inspection Checklist Examples

- doors checked;
- tyres checked;
- lights checked;
- seals checked;
- brakes checked;
- item count checked;
- surrounding area made safe.

##### 8.17.6 Business Rules

1. High and critical issues must alert supervisors immediately.
2. Required evidence depends on category and severity.
3. Unsafe vehicles, trailers or locations may be placed on hold automatically.
4. Missing item reports must link to the last known movement.
5. Issue deletion is not allowed for normal users.
6. Resolution requires authorised role.

##### 8.17.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-ISSUE-001 | Yard attendant can report an issue. | Must |
| YARD-ISSUE-002 | Issue can be linked to item, vehicle, trailer, load or location. | Must |
| YARD-ISSUE-003 | High and critical issues must trigger escalation. | Must |
| YARD-ISSUE-004 | Evidence rules must be configurable. | Must |
| YARD-ISSUE-005 | Issue reporting must create an audit event. | Must |
| YARD-ISSUE-006 | Unsafe entities may be automatically placed on hold. | Must |

---

#### 8.18 Profile and Account Security

##### 8.18.1 Profile Data

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

##### 8.18.2 Security

- password change;
- two-factor authentication;
- active sessions;
- logout other devices;
- device history;
- recent activity.

##### 8.18.3 Requirements

| ID | Requirement | Priority |
|---|---|---|
| YARD-PRO-001 | User can view their profile and permissions. | Must |
| YARD-PRO-002 | User can update permitted preference fields. | Must |
| YARD-PRO-003 | User can manage password and 2FA. | Must |
| YARD-PRO-004 | User can view and revoke active sessions. | Must |
| YARD-PRO-005 | Certification expiry must be visible. | Must |

---

### 9. End-to-End Workflows

#### 9.1 Start Shift and Receive Inbound Vehicle

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

#### 9.2 Search and Move Item

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

#### 9.3 Stage Item to Holding Area

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

#### 9.4 Move Items to Load Lane

1. Attendant opens assigned load lane.
2. Attendant reviews expected load items.
3. Each item is scanned.
4. System verifies item-load-lane match.
5. Item is confirmed into lane.
6. Lane occupancy and progress update.
7. Incorrect items are blocked.
8. When all required items and checks are complete, lane can be marked ready.

---

#### 9.5 Outbound Dispatch

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

#### 9.6 Report Damage

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

#### 9.7 Offline Movement Sync

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

### 10. Status Models

#### 10.1 Item Status

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

#### 10.2 Movement Status

- Draft
- Pending
- In Progress
- Completed
- Failed
- Cancelled
- Pending Sync
- Sync Conflict

#### 10.3 Location Status

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

#### 10.4 Load Lane Status

- Empty
- Assigned
- Staging
- In Progress
- Ready to Dispatch
- Hold
- Full
- Closed
- Maintenance

#### 10.5 Issue Status

- Open
- Assigned
- In Progress
- Waiting
- Resolved
- Closed
- Rejected

#### 10.6 Shift Status

- Not Started
- On Shift
- Break
- Finished
- Absent
- Unavailable

---

### 11. Core Business Rules

#### 11.1 Inventory Rules

1. Each trackable item must have a unique identifier.
2. Current item location is derived from the latest valid completed movement.
3. A failed movement must not change current location.
4. A pending offline movement must not be treated as final server state.
5. Duplicate active records require review.
6. Damaged or hold items cannot be dispatched.
7. Restricted goods require compatible storage.

#### 11.2 Location Rules

1. Location must be active.
2. Capacity must not be exceeded.
3. Item category must be allowed.
4. User must have location access.
5. Dangerous goods and cold-storage rules must be enforced.
6. Source and destination cannot be identical unless action is a verification.

#### 11.3 Dispatch Rules

1. Only ready and verified loads can be dispatched.
2. Correct driver, truck and trailer must be confirmed.
3. Mandatory documentation must exist.
4. All required items must be present.
5. Open critical issues must block dispatch.
6. Departure action must be auditable.

#### 11.4 Date and Time Rules

1. Store timestamps in UTC.
2. Display in local depot timezone.
3. Exact timestamps must be retained.
4. Offline device timestamps must be stored with sync timestamps.
5. Daylight-saving changes must be supported.

---

### 12. Notifications and Alerts

#### 12.1 Yard Attendant Notifications

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

#### 12.2 Supervisor Alerts

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

### 13. Audit and Activity Logging

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

### 14. Suggested Data Model

#### 14.1 Core Entities

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

#### 14.2 Key Relationships

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

### 15. API Requirements

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

### 16. Offline and Sync Requirements

##### 16.1 Offline-Capable Actions

Configured actions may include:

- scan lookup from cached data;
- receive draft;
- photo capture;
- movement draft;
- issue report;
- shift note;
- label request draft.

##### 16.2 Offline Queue Record

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

##### 16.3 Conflict Handling

If server state changed:

- do not silently overwrite;
- show conflict reason;
- preserve local evidence;
- provide supervisor review where needed;
- mark final resolution.

##### 16.4 Security

- cached data encrypted;
- device session expires;
- logout clears sensitive cache;
- lost device sessions can be revoked;
- offline permissions use latest cached policy with safe limits.

---

### 17. Integrations

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

### 18. Security Requirements

#### 18.1 Authentication

- secure login;
- strong password policy;
- 2FA support;
- session timeout;
- device management;
- brute-force protection;
- login audit.

#### 18.2 Authorisation

- server-side RBAC;
- tenant isolation;
- depot scope;
- location scope;
- object-level checks;
- action permissions;
- export permissions.

#### 18.3 Data Protection

- TLS in transit;
- encryption at rest;
- encrypted offline cache;
- protected file URLs;
- malware scanning;
- secret management;
- secure backups;
- configurable retention.

#### 18.4 Application Security

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

### 19. Non-Functional Requirements

#### 19.1 Performance

- dashboard load under 3 seconds;
- search under 2 seconds;
- scan resolve target under 1 second on good network;
- movement confirmation under 2 seconds;
- inbound save under 3 seconds excluding uploads;
- map load under 4 seconds;
- background exports for large datasets.

#### 19.2 Availability

- target 99.9% monthly;
- graceful offline capability;
- health monitoring;
- operational alerting;
- backup and disaster recovery.

#### 19.3 Scalability

Support:

- multiple companies;
- multiple depots;
- thousands of inventory items per depot;
- high scan volume;
- many concurrent attendants;
- large photo storage;
- high movement-event volume.

#### 19.4 Responsiveness

Priority devices:

- rugged handheld scanner;
- mobile phone;
- forklift tablet;
- desktop terminal;
- standard tablet.

The portal must be touch-friendly and support large action targets.

#### 19.5 Accessibility

- keyboard support;
- visible focus;
- accessible forms;
- status not shown by colour alone;
- readable contrast;
- screen-reader labels;
- clear validation messages.

---

### 20. UX Requirements

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

### 21. Error Handling

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

### 22. Analytics Definitions

#### 22.1 Items Handled

Count of completed receive, move, stage or dispatch operations according to report configuration. Duplicate scans do not count.

#### 22.2 Inventory Accuracy

Percentage of audited items whose actual location and quantity match the system record.

#### 22.3 Dwell Time

Time between entering a staging or holding area and leaving that area.

#### 22.4 Dock-to-Dispatch Time

Time from completed inbound or load-ready milestone to recorded outbound departure, according to report configuration.

#### 22.5 Lane Utilisation

Occupied lane capacity divided by configured lane capacity over the selected period.

---

### 23. Release Plan

#### Phase 1 — Core Yard Operations

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

#### Phase 2 — Staging and Dispatch

- staging areas;
- load lanes;
- load visibility;
- outbound dispatch;
- vehicle view;
- labels and barcode printing;
- yard map.

#### Phase 3 — Scan and Offline Operations

- hardware scanner support;
- camera scanning;
- offline queue;
- conflict resolution;
- advanced printer integration;
- batch operations.

#### Phase 4 — Analytics and Optimisation

- reports and analytics;
- dwell-time alerts;
- productivity metrics;
- occupancy insights;
- advanced supervisor workflows;
- automated gate and telematics integrations.

---

### 24. Out of Scope for Initial Yard Attendant Release

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

### 25. QA Test Areas

#### 25.1 Functional QA

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

#### 25.2 Permission QA

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

#### 25.3 Negative QA

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

#### 25.4 Security QA

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

#### 25.5 Performance QA

- rapid scan bursts;
- large inbound CSV;
- many movement records;
- high map item count;
- concurrent movements;
- large photo uploads;
- offline queue replay.

---

### 26. UAT Scenarios

#### UAT-01 — Start Work

**Given** an authorised yard attendant has an assigned shift  
**When** they start work at the correct depot  
**Then** an active work session is created.

#### UAT-02 — Receive Vehicle

**Given** a valid inbound delivery  
**When** VIN, condition, location and required evidence are entered  
**Then** the vehicle is received and appears at the selected location.

#### UAT-03 — Duplicate VIN

**Given** a vehicle VIN already exists as active inventory  
**When** the VIN is entered again  
**Then** final receipt is blocked or sent to configured review.

#### UAT-04 — Move to Full Location

**Given** a bay is at capacity  
**When** an item is moved to it  
**Then** the move is blocked with the capacity reason.

#### UAT-05 — Wrong Load Lane

**Given** an item belongs to Load A  
**When** it is scanned into Load B’s lane  
**Then** the assignment is blocked.

#### UAT-06 — Dispatch with Hold Issue

**Given** a load has an unresolved critical issue  
**When** the attendant marks it dispatched  
**Then** dispatch is blocked.

#### UAT-07 — Offline Movement

**Given** the device is offline  
**When** an authorised move is captured  
**Then** it is queued and synced once when connectivity returns.

#### UAT-08 — Sync Conflict

**Given** an item was moved by another user before offline sync  
**When** the queued move syncs  
**Then** the system creates a conflict instead of overwriting state.

#### UAT-09 — Critical Damage Report

**Given** a trailer has critical damage  
**When** the issue is submitted  
**Then** supervisors are alerted and the trailer is placed on hold according to policy.

#### UAT-10 — Label Reprint

**Given** an existing label is reprinted  
**When** print succeeds  
**Then** the reprint is recorded with user, printer and time.

#### UAT-11 — Depot Restriction

**Given** the attendant has Sydney Depot access only  
**When** they request Melbourne inventory via direct API  
**Then** access is denied.

#### UAT-12 — Finish Work with Pending Sync

**Given** unsynced actions exist  
**When** the attendant attempts to finish work  
**Then** the system warns and applies configured completion rules.

---

### 27. Definition of Done

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

### 28. Open Product Decisions

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

### 29. Risks and Mitigations

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

### 30. Suggested Yard Attendant Permission Matrix

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

### 31. Sample Validation Messages

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

### 32. Sample Movement Audit Event

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

### 33. Sign-Off

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

---

## Part 5 — Accounts Portal

**Portal Scope:** Invoice-to-cash, payroll, contractor and employee pay, expenses, tax, P&L and financial reporting.

**Source File:** `Hero_Logistics_Accounts_Portal_PRD_v1.0(1).md`

### Hero Logistics — Accounts Portal Product Requirements Document (PRD)

**Document Version:** 1.0  
**Product Area:** Accounts Portal  
**Platform:** Hero Logistics Transport & Fleet Management System  
**Primary Role:** Accounts Manager / Accounts User  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Primary Currency:** AUD  
**Primary Timezone:** Australia/Sydney unless overridden by company settings  

---

#### 1. Document Purpose

This Product Requirements Document defines the complete requirements for the **Hero Logistics Accounts Portal**.

The Accounts Portal is the financial operations workspace used to:

- review and approve invoices;
- send invoices to customers;
- record and allocate customer payments;
- process payroll;
- manage contractor payments;
- manage employee pay runs;
- review and reimburse expenses;
- track GST and PAYG obligations;
- view Profit & Loss reporting;
- analyse vehicle costs;
- generate and schedule reports;
- manage profile, security and preferences.

All customer names, invoice references, dates, amounts, payroll figures and sample values shown in UI references are illustrative and must be replaced with live data.

---

#### 2. Product Vision

Provide finance and accounts teams with a secure, auditable and highly accurate financial operations portal that connects billing, payments, payroll, expenses, tax obligations and profitability in one workflow-driven system.

The portal must reduce manual spreadsheet work, prevent duplicate or incorrect transactions, improve cash collection visibility and maintain complete financial auditability.

---

#### 3. Product Goals

##### 3.1 Primary Goals

1. Standardise invoice review and approval.
2. Improve visibility into sent, paid, part-paid and overdue invoices.
3. Enable reliable payment allocation and reconciliation.
4. Support controlled payroll and pay-run processing.
5. Separate contractor claims from employee payroll.
6. Streamline expense approval and reimbursement.
7. Track GST, PAYG and statutory obligations.
8. Provide real-time P&L and vehicle cost visibility.
9. Maintain strict financial permissions and audit logs.
10. Support export, reporting and scheduled delivery.

##### 3.2 Success Metrics

| Metric | Target |
|---|---:|
| Invoice approval error rate | Less than 0.5% |
| Duplicate invoice creation | 0 |
| Duplicate payment allocation | 0 |
| Payment allocation accuracy | 99.9% |
| Payroll calculation accuracy | 99.9% |
| Financial action audit coverage | 100% |
| Report generation success | 99.5% |
| Dashboard load time | Under 3 seconds |
| List filtering response | Under 2 seconds |
| Unauthorised financial access | 0 |
| Export accuracy | 100% against filtered data |
| Overdue invoice visibility | Real-time after due-date breach |

---

#### 4. User Roles

##### 4.1 Accounts Manager

Primary portal user with access to invoice review, payment allocation, payroll, expenses, tax and reports, subject to role permissions.

##### 4.2 Accounts Officer

Operational finance user who may:

- create or edit draft invoices;
- record payments;
- process expenses;
- prepare payroll;
- run reports.

Approval rights may be restricted.

##### 4.3 Payroll Officer

Focused role for:

- timesheet review;
- pay-run preparation;
- employee pay;
- contractor pay;
- PAYG and superannuation summaries.

##### 4.4 Finance Manager

Senior role with approval rights for:

- invoices;
- payment refunds;
- pay runs;
- contractor claims;
- tax lodgement;
- financial reports.

##### 4.5 Company Admin

May configure:

- users;
- roles;
- accounting integrations;
- tax settings;
- invoice settings;
- company details;
- payment accounts.

##### 4.6 Auditor / Read-Only

Read-only access to authorised financial records, reports and audit history.

---

#### 5. Role and Permission Model

Permissions must be enforced at frontend and backend.

Suggested permission keys:

- `accounts.dashboard.view`
- `accounts.invoice.create`
- `accounts.invoice.edit`
- `accounts.invoice.review`
- `accounts.invoice.approve`
- `accounts.invoice.send`
- `accounts.invoice.hold`
- `accounts.invoice.reject`
- `accounts.invoice.export`
- `accounts.payment.view`
- `accounts.payment.create`
- `accounts.payment.allocate`
- `accounts.payment.edit`
- `accounts.payment.refund`
- `accounts.payment.reconcile`
- `accounts.payroll.view`
- `accounts.payroll.create`
- `accounts.payroll.approve`
- `accounts.payroll.process`
- `accounts.payroll.cancel`
- `accounts.contractor.view`
- `accounts.contractor.create`
- `accounts.contractor.approve`
- `accounts.contractor.pay`
- `accounts.employee_pay.view`
- `accounts.employee_pay.create`
- `accounts.employee_pay.approve`
- `accounts.expense.view`
- `accounts.expense.create`
- `accounts.expense.approve`
- `accounts.expense.reject`
- `accounts.expense.reimburse`
- `accounts.tax.view`
- `accounts.tax.prepare`
- `accounts.tax.lodge`
- `accounts.tax.record_payment`
- `accounts.pnl.view`
- `accounts.vehicle_cost.view`
- `accounts.report.view`
- `accounts.report.export`
- `accounts.report.schedule`
- `accounts.profile.edit`

Sensitive actions must require higher privileges or approval.

---

#### 6. Portal Navigation

1. Accounts Dashboard
2. Invoice Review
3. Sent Invoices
4. Payments
5. Payroll
6. Contractor Pay
7. Employee Pay
8. Expenses
9. GST / PAYG
10. P&L
11. Vehicle Costs
12. Reports
13. Profile

Shared header:

- logo;
- portal name;
- quick search;
- notification count;
- unread messages count where enabled;
- user avatar;
- role label;
- account menu;
- logout;
- timezone display.

---

### 7. Functional Requirements

#### 7.1 Accounts Dashboard

##### 7.1.1 Purpose

Provide a real-time summary of receivables, payroll, expenses, cash flow and profitability.

##### 7.1.2 Dashboard Date Control

The dashboard must support:

- current period;
- comparison period;
- custom date range;
- weekly;
- monthly;
- quarterly;
- financial year;
- branch;
- company;
- currency where multi-currency is enabled.

##### 7.1.3 KPI Cards

Required KPIs:

- Draft Invoices
- In Review
- Sent Invoices
- Paid Invoices
- Overdue Invoices
- Payroll Due
- Expenses Pending
- Gross Margin

Each card should support:

- count or amount;
- comparison value;
- trend indicator;
- click-through;
- last updated time.

##### 7.1.4 Dashboard Sections

- Invoice Status Overview
- Invoices & Payments Trend
- Overdue Invoices
- Upcoming Payroll
- Expenses Summary
- Cash Flow Overview
- Profit & Loss Summary
- Recent Activity

##### 7.1.5 Dashboard Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-DASH-001 | Dashboard must show current financial operational KPIs. | Must |
| ACC-DASH-002 | Date range must update all compatible widgets. | Must |
| ACC-DASH-003 | KPI click-through must open filtered module views. | Should |
| ACC-DASH-004 | Overdue invoices must be clearly highlighted. | Must |
| ACC-DASH-005 | Payroll due date and amount must be visible. | Must |
| ACC-DASH-006 | Dashboard values must reconcile with source modules. | Must |
| ACC-DASH-007 | Financial figures must display currency. | Must |
| ACC-DASH-008 | Last refresh time must be visible. | Must |

##### 7.1.6 Acceptance Criteria

- User can view invoice, payroll, expense and margin summary.
- Date range changes update dashboard values.
- Overdue invoice card opens the overdue invoices list.
- Figures match underlying records.
- Unauthorised financial data is hidden.

---

#### 7.2 Invoice Review

##### 7.2.1 Purpose

Review, verify and approve invoices before sending to customers.

##### 7.2.2 Invoice Statuses

- Draft
- In Review
- Ready to Send
- On Hold
- Rejected
- Sent
- Part Paid
- Paid
- Overdue
- Cancelled
- Voided

##### 7.2.3 Summary Cards

- Draft Invoices
- In Review
- Ready to Send
- On Hold
- Rejected
- Total In Review

##### 7.2.4 Filters

- invoice number;
- customer;
- load/reference;
- invoice type;
- status;
- invoice date;
- due date;
- branch;
- date range;
- amount range;
- created by.

##### 7.2.5 Invoice Table

Columns:

- selection checkbox;
- invoice number;
- customer;
- invoice date;
- due date;
- reference/load number;
- type;
- subtotal;
- GST;
- total;
- status;
- actions.

##### 7.2.6 Invoice Types

- Freight
- Accessorial
- Fuel Surcharge
- Storage
- Waiting Time
- Damage / Repair
- Other configured types

##### 7.2.7 Invoice Detail

Header:

- invoice number;
- status;
- customer;
- invoice date;
- due date;
- reference/load;
- subtotal;
- GST;
- total;
- invoice type.

Tabs:

- Items
- Attachments
- Notes
- History

##### 7.2.8 Invoice Items

Fields:

- description;
- quantity;
- unit rate;
- amount excluding GST;
- GST rate;
- GST amount;
- total including GST;
- account code;
- tax code;
- source reference.

##### 7.2.9 Invoice Actions

- Approve & Send
- Save & Mark Ready
- Hold Invoice
- Reject Invoice
- Edit Draft
- Duplicate
- Export PDF
- Download Attachments
- Add Note

##### 7.2.10 Invoice Validation

Before approval:

- customer must be active;
- customer billing details must exist;
- invoice number must be unique;
- invoice date must be valid;
- due date must be valid;
- at least one line item must exist;
- subtotal must equal line-item total;
- GST must match configured tax rules;
- total must reconcile;
- linked load/reference must be valid where required;
- mandatory documents must exist;
- duplicate billing check must pass.

##### 7.2.11 Approval Rules

1. Draft may be edited.
2. In Review requires reviewer action.
3. Ready to Send may be sent by authorised users.
4. On Hold requires reason.
5. Reject requires reason.
6. Sent invoices cannot be freely edited.
7. Correction after send must use credit note, void or controlled amendment.
8. Approval and sending must be audited.

##### 7.2.12 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-INV-001 | Users can create and edit draft invoices. | Must |
| ACC-INV-002 | Invoices must support review and approval workflow. | Must |
| ACC-INV-003 | GST calculations must be system validated. | Must |
| ACC-INV-004 | Duplicate invoice detection must run before save. | Must |
| ACC-INV-005 | Approved invoices can be sent electronically. | Must |
| ACC-INV-006 | Hold and reject actions require reason. | Must |
| ACC-INV-007 | Sent invoices must become controlled records. | Must |
| ACC-INV-008 | Invoice history must be immutable. | Must |
| ACC-INV-009 | Bulk actions must validate every selected invoice. | Should |
| ACC-INV-010 | PDF invoice must use configured company template. | Must |

---

#### 7.3 Sent Invoices

##### 7.3.1 Purpose

Manage all invoices sent to customers and monitor collection status.

##### 7.3.2 Summary Metrics

- Sent Invoices
- Paid Invoices
- Part Paid
- Overdue
- Average Days to Pay
- Collection Rate
- Total Including GST

##### 7.3.3 Filters

- invoice number;
- customer;
- reference;
- invoice type;
- status;
- date range;
- aging bucket;
- branch;
- amount range.

##### 7.3.4 Table Columns

- invoice number;
- customer;
- invoice date;
- due date;
- invoice amount;
- amount paid;
- outstanding amount;
- status;
- days outstanding;
- actions.

##### 7.3.5 Aging Buckets

- Current
- 0–30 Days
- 31–60 Days
- 61–90 Days
- 90+ Days

##### 7.3.6 Actions

- view invoice;
- resend invoice;
- send reminder;
- download PDF;
- view payment history;
- create statement;
- record dispute;
- place on hold;
- create credit note;
- export.

##### 7.3.7 Collection Rules

- invoice becomes overdue after due date if outstanding amount > 0;
- part-paid invoices remain open;
- full payment marks invoice paid;
- overpayment must not reduce invoice below zero;
- credit note allocation must be recorded;
- reminders follow configured schedule;
- customer communication must be logged.

##### 7.3.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-SENT-001 | Sent invoices must show payment and aging status. | Must |
| ACC-SENT-002 | Outstanding amount must update after allocation. | Must |
| ACC-SENT-003 | Reminder history must be stored. | Should |
| ACC-SENT-004 | Statements must use authorised invoice data only. | Must |
| ACC-SENT-005 | Aging summary must reconcile with invoice list. | Must |
| ACC-SENT-006 | Overdue days must calculate from due date. | Must |

---

#### 7.4 Payments

##### 7.4.1 Purpose

Track incoming customer payments, allocate funds and manage refunds.

##### 7.4.2 Payment Statuses

- Allocated
- Partially Allocated
- Unallocated
- Overpayment
- Refunded
- Partially Refunded
- Reversed
- Failed

##### 7.4.3 Summary Metrics

- Payments Received
- Unallocated Payments
- Overpayments
- Refunds
- Average Days to Pay
- Collection Rate

##### 7.4.4 Filters

- payment reference;
- customer;
- invoice number;
- payment method;
- status;
- date range;
- amount;
- bank account;
- branch.

##### 7.4.5 Table Columns

- payment date;
- payment reference;
- customer;
- invoices paid;
- payment method;
- amount received;
- allocated amount;
- unallocated amount;
- status;
- action.

##### 7.4.6 Payment Methods

- Bank Transfer
- EFT
- Credit Card
- Cash
- Cheque
- Direct Debit
- Other configured method

##### 7.4.7 Payment Details

- payment reference;
- customer;
- date;
- method;
- amount;
- notes;
- bank/account;
- created by;
- created on;
- allocated invoices;
- notes;
- history.

##### 7.4.8 Payment Allocation

The user may allocate one payment to:

- one invoice;
- multiple invoices;
- partial invoice amount;
- credit balance;
- customer account.

The system must validate:

- allocated total does not exceed payment amount;
- invoice belongs to the customer;
- invoice is open;
- duplicate allocation is prevented;
- allocation currency matches;
- closed financial period rules are respected.

##### 7.4.9 Refund Workflow

1. User selects refundable payment or credit.
2. System calculates available refundable amount.
3. User enters amount and reason.
4. User selects payment method/account.
5. Approval is required where configured.
6. Refund is processed or recorded.
7. Payment and invoice balances are updated.
8. Audit log is created.
9. Customer notification may be sent.

##### 7.4.10 Refund Rules

- cannot refund more than available amount;
- refund requires reason;
- processed refunds cannot be deleted;
- failed refunds must retain gateway or bank response;
- manual refund status requires proof or reference;
- high-value refunds may require dual approval.

##### 7.4.11 Reconciliation

Support:

- payment-to-invoice reconciliation;
- bank statement import;
- manual reconciliation;
- reconciliation status;
- unmatched transaction queue;
- duplicate bank transaction detection;
- reconciliation report.

##### 7.4.12 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PAY-001 | Users can record incoming payments. | Must |
| ACC-PAY-002 | Payments can be allocated across invoices. | Must |
| ACC-PAY-003 | Unallocated amount must calculate automatically. | Must |
| ACC-PAY-004 | Overpayment must create customer credit. | Must |
| ACC-PAY-005 | Refunds must follow controlled approval. | Must |
| ACC-PAY-006 | Duplicate payment reference detection must run. | Must |
| ACC-PAY-007 | Reconciliation history must be retained. | Must |
| ACC-PAY-008 | Payment edits after reconciliation must be restricted. | Must |

---

#### 7.5 Payroll

##### 7.5.1 Purpose

Manage payroll periods, timesheets, deductions, approvals and payments.

##### 7.5.2 Payroll Statuses

- Draft
- Pending Approval
- Approved
- Processing
- Paid
- Failed
- Cancelled

##### 7.5.3 Summary Metrics

- Upcoming Payroll
- Employees Paid
- Total Payroll
- Taxes & Deductions
- Net Pay
- Payroll YTD

##### 7.5.4 Filters

- week ending;
- payroll type;
- pay group;
- employment type;
- status;
- branch;
- created by;
- date range.

##### 7.5.5 Payroll Table

- week ending;
- pay group/branch;
- payroll type;
- employees;
- gross pay;
- deductions;
- net pay;
- status;
- created by;
- created on;
- action.

##### 7.5.6 Payroll Components

- Base Pay
- Allowances
- Overtime
- Reimbursements
- Bonus
- Commission
- PAYG
- Superannuation
- Salary Sacrifice
- Other Deductions
- Net Pay

##### 7.5.7 Payroll Workflow

1. Create payroll period.
2. Import or retrieve timesheets.
3. Validate hours, rates and employment status.
4. Calculate gross pay.
5. Calculate deductions.
6. Calculate net pay.
7. Review exceptions.
8. Submit for approval.
9. Approve payroll.
10. Generate payment file.
11. Process payment.
12. Generate payslips.
13. Record PAYG and super liabilities.
14. Mark paid.
15. Lock payroll period.

##### 7.5.8 Payroll Validation

- employee active during period;
- pay rate exists;
- timesheet approved;
- duplicate timesheet not included;
- overtime policy applied;
- leave accounted for;
- deductions valid;
- bank details valid;
- negative net pay blocked unless explicitly allowed;
- payroll totals reconcile.

##### 7.5.9 Payroll Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PR-001 | Users can create payroll runs. | Must |
| ACC-PR-002 | Payroll must calculate gross, deductions and net pay. | Must |
| ACC-PR-003 | Approval must be separate from creation where configured. | Must |
| ACC-PR-004 | Paid payroll must be locked. | Must |
| ACC-PR-005 | Payslips must be generated per employee. | Must |
| ACC-PR-006 | Payment files must be generated securely. | Should |
| ACC-PR-007 | Payroll must maintain complete calculation history. | Must |
| ACC-PR-008 | Failed employee payments must be individually traceable. | Must |
| ACC-PR-009 | Payroll cancellation must require reason. | Must |
| ACC-PR-010 | Sensitive payroll fields must be masked. | Must |

---

#### 7.6 Contractor Pay

##### 7.6.1 Purpose

Review contractor claims, approve payments and track disbursements.

##### 7.6.2 Statuses

- Draft
- Pending Approval
- Approved
- Scheduled
- Paid
- Overdue
- Rejected
- Cancelled

##### 7.6.3 Summary Metrics

- Total Payable
- Approved
- Pending Approval
- Paid
- Overdue Payments
- Period Growth

##### 7.6.4 Table Columns

- claim number;
- contractor;
- load/reference;
- claim date;
- amount excluding GST;
- GST;
- total;
- status;
- payment method;
- action.

##### 7.6.5 Claim Details

- contractor;
- load/reference;
- claim date;
- payment method;
- bank name;
- masked account;
- line items;
- documents;
- notes;
- history.

##### 7.6.6 Claim Validation

- contractor must be active;
- ABN and payment details required;
- duplicate claim check;
- linked load must exist where required;
- line-item total must reconcile;
- GST rules must be applied;
- supporting document must exist where configured;
- bank details must be protected;
- approved claim cannot be edited without controlled reversal.

##### 7.6.7 Actions

- Approve Claim
- Edit Claim
- Reject Claim
- Schedule Payment
- Mark Paid
- Export
- Bulk Actions

##### 7.6.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-CON-001 | Users can create contractor claims. | Must |
| ACC-CON-002 | Claims must support approval workflow. | Must |
| ACC-CON-003 | GST must be calculated according to contractor tax setup. | Must |
| ACC-CON-004 | Duplicate claim detection must run. | Must |
| ACC-CON-005 | Paid claims must be locked. | Must |
| ACC-CON-006 | Contractor bank details must be encrypted and masked. | Must |
| ACC-CON-007 | Bulk payment preparation must support validation. | Should |

---

#### 7.7 Employee Pay

##### 7.7.1 Purpose

Manage employee pay runs, timesheets, deductions and employee payments.

##### 7.7.2 Summary Metrics

- Total Net Pay
- Upcoming Pay Run
- Employees Paid
- Taxes & Deductions
- Superannuation
- Payroll YTD

##### 7.7.3 Pay Run Table

- pay run number;
- pay period;
- frequency;
- employees;
- gross pay;
- deductions;
- net pay;
- status;
- created by;
- created on;
- action.

##### 7.7.4 Pay Run Detail

- pay run number;
- employee count;
- department;
- pay period;
- frequency;
- creator;
- summary;
- employees;
- deductions;
- payments;
- gross pay;
- net pay;
- super;
- line items.

##### 7.7.5 Actions

- Create Pay Run
- Import Timesheets
- Approve Pay Run
- Edit Pay Run
- Delete Draft
- Export
- Bulk Actions

##### 7.7.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-EMP-001 | Pay runs must be uniquely numbered. | Must |
| ACC-EMP-002 | Draft pay runs may be edited or deleted. | Must |
| ACC-EMP-003 | Approved pay runs require controlled reversal to change. | Must |
| ACC-EMP-004 | Employee-level calculations must be available. | Must |
| ACC-EMP-005 | Timesheet imports must provide row-level validation. | Must |
| ACC-EMP-006 | Pay-run totals must reconcile to employee totals. | Must |

---

#### 7.8 Expenses

##### 7.8.1 Purpose

Track, review, approve and reimburse expenses.

##### 7.8.2 Statuses

- Draft
- Pending Approval
- Approved
- Rejected
- Reimbursed
- Overdue
- Cancelled

##### 7.8.3 Payment Status

- Unpaid
- Scheduled
- Paid
- Reimbursed
- Failed

##### 7.8.4 Summary Metrics

- Total Expenses
- Pending Approval
- Approved
- Reimbursed
- Overdue
- Period Comparison

##### 7.8.5 Expense Table

- date;
- description;
- category;
- employee/contractor;
- reference/receipt;
- amount excluding GST;
- GST;
- total;
- approval status;
- payment status;
- action.

##### 7.8.6 Expense Categories

- Fuel
- Tolls
- Parking
- Repairs
- Maintenance
- Accommodation
- Meals
- Office
- Phone
- Insurance
- Other configured categories

##### 7.8.7 Receipt Capture

- JPG;
- PNG;
- PDF;
- maximum size configurable;
- malware scanning;
- OCR optional;
- original file retained;
- upload timestamp;
- uploader identity;
- receipt hash.

##### 7.8.8 Expense Workflow

1. Create expense.
2. Upload receipt.
3. Enter category and claimant.
4. Enter GST details.
5. Submit for approval.
6. Reviewer approves or rejects.
7. Approved expense enters reimbursement queue.
8. Payment is processed.
9. Expense marked reimbursed.
10. Audit and payment history stored.

##### 7.8.9 Expense Rules

- receipt mandatory above configured threshold;
- duplicate receipt detection;
- GST must be validated;
- claimant must be active;
- rejected expense requires reason;
- approval limits by role;
- self-approval may be blocked;
- paid expense cannot be deleted.

##### 7.8.10 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-EXP-001 | Users can create and submit expenses. | Must |
| ACC-EXP-002 | Receipt upload must be supported. | Must |
| ACC-EXP-003 | Approval limits must be configurable. | Must |
| ACC-EXP-004 | Duplicate receipt detection should be supported. | Should |
| ACC-EXP-005 | Reimbursement status must be tracked. | Must |
| ACC-EXP-006 | Paid expenses must be locked. | Must |
| ACC-EXP-007 | Bulk approval must validate permission and limits. | Should |

---

#### 7.9 GST / PAYG

##### 7.9.1 Purpose

Track GST liabilities, credits, PAYG withholding and lodgement obligations.

##### 7.9.2 Summary Metrics

- GST Collected
- GST Credits
- Net GST Payable
- PAYG Withholding
- Outstanding Liabilities
- YTD Net GST Payable

##### 7.9.3 Tabs

- GST Obligations
- PAYG Withholding
- Activity History

##### 7.9.4 Filters

- financial year;
- from date;
- to date;
- status;
- branch;
- entity.

##### 7.9.5 GST Obligation Table

- BAS period;
- period end;
- due date;
- GST collected;
- GST credits;
- net GST;
- status;
- lodgement date;
- action.

##### 7.9.6 Statuses

- Draft
- Preparing
- Ready
- Due Soon
- Lodged
- Paid
- Overdue
- Amended

##### 7.9.7 Actions

- Prepare BAS
- Lodge with ATO
- Record GST Payment
- PAYG Payment
- View
- Export

##### 7.9.8 Tax Rules

- calculations must be based on posted transactions only;
- GST codes must be configurable;
- locked periods cannot be edited without authorised adjustment;
- lodgement requires approval;
- ATO submission response must be stored;
- amendment must preserve original submission;
- tax payment reference must be retained.

##### 7.9.9 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-TAX-001 | GST collected and credits must derive from transactions. | Must |
| ACC-TAX-002 | Net GST must calculate automatically. | Must |
| ACC-TAX-003 | PAYG withholding must reconcile with payroll. | Must |
| ACC-TAX-004 | Lodgement workflow must be permission controlled. | Must |
| ACC-TAX-005 | Lodged periods must be locked. | Must |
| ACC-TAX-006 | Amendments must retain prior values. | Must |
| ACC-TAX-007 | Tax actions must be fully audited. | Must |

---

#### 7.10 Profit & Loss

##### 7.10.1 Purpose

Display business income, cost of sales, operating expenses and profitability.

##### 7.10.2 Summary Metrics

- Net Profit
- Total Revenue
- Total Expenses
- Gross Profit
- Gross Profit Margin

##### 7.10.3 Views

- P&L Statement
- Monthly Trend
- Comparison
- YTD Overview

##### 7.10.4 Controls

- financial year;
- period;
- comparison period;
- show percentage;
- branch;
- company;
- export.

##### 7.10.5 P&L Structure

###### Revenue

- Freight Income
- Surcharges & Fuel Recovery
- Storage Income
- Accessorial Income
- Other Income
- Total Revenue

###### Cost of Sales

- Driver Costs
- Fuel Costs
- Contractor Costs
- Vehicle Costs
- Tolls & Road Charges
- Other Direct Costs
- Total Cost of Sales

###### Gross Profit

- Gross Profit
- Gross Profit Margin

###### Operating Expenses

- Administration
- Marketing
- Depreciation
- Insurance
- Office
- Other Expenses
- Total Operating Expenses

###### Net Profit

- Net Profit
- Net Profit Margin

##### 7.10.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PNL-001 | P&L must derive from posted financial transactions. | Must |
| ACC-PNL-002 | Current and comparison periods must be supported. | Must |
| ACC-PNL-003 | Users can drill down to source transactions. | Should |
| ACC-PNL-004 | Branch and consolidated views must be supported. | Should |
| ACC-PNL-005 | Export must match displayed values. | Must |
| ACC-PNL-006 | Closed-period values must remain stable. | Must |

---

#### 7.11 Vehicle Costs

##### 7.11.1 Purpose

Track operating costs for trucks, trailers and other assets.

##### 7.11.2 Summary Metrics

- Total Vehicle Costs
- Fuel Costs
- Maintenance & Repairs
- Tyres
- Insurance
- Other Costs

##### 7.11.3 Tabs

- Vehicle Summary
- Transactions
- Upcoming Costs
- Service History

##### 7.11.4 Filters

- vehicle;
- registration;
- vehicle type;
- date;
- branch;
- category;
- cost range.

##### 7.11.5 Vehicle Summary Columns

- vehicle;
- type;
- registration/ID;
- total cost excluding GST;
- total cost including GST;
- cost per kilometre;
- cost per day;
- comparison percentage;
- action.

##### 7.11.6 Cost Categories

- Fuel
- Maintenance
- Repairs
- Tyres
- Registration
- Insurance
- Tolls
- Cleaning
- Depreciation
- Finance
- Other

##### 7.11.7 Vehicle Cost Rules

- cost transaction may link to vehicle, trailer or asset;
- odometer may be required;
- duplicate supplier invoice must be detected;
- scheduled cost may become actual transaction;
- cost per km requires valid distance;
- cost allocations must be auditable;
- expenses and supplier bills may feed this module.

##### 7.11.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-VEH-001 | Vehicle costs must aggregate by asset and category. | Must |
| ACC-VEH-002 | Cost per km and cost per day must be calculated. | Should |
| ACC-VEH-003 | Upcoming costs must support due-date alerts. | Should |
| ACC-VEH-004 | Source transaction drill-down must be available. | Must |
| ACC-VEH-005 | Vehicle cost totals must reconcile to P&L accounts. | Must |
| ACC-VEH-006 | Trailer costs must be separately supported. | Must |

---

#### 7.12 Reports

##### 7.12.1 Purpose

Provide financial, payroll, compliance, vehicle and custom reports.

##### 7.12.2 Summary Metrics

- Reports Generated
- Scheduled Reports
- Last Report Run
- Exports
- Data Updated

##### 7.12.3 Categories

- Financial
- Compliance
- Operations
- Payroll
- Vehicle & Assets
- Custom

##### 7.12.4 Standard Reports

- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Accounts Receivable Aging
- Accounts Payable Aging
- GST Summary
- PAYG Withholding
- Payroll Summary
- Employee Payroll Detail
- Contractor Payments
- Expense Summary
- Vehicle Cost
- Invoice Register
- Payment Reconciliation
- Customer Statement
- Cash Collection
- Refund Report
- Audit Report

##### 7.12.5 Report Functions

- run report;
- select period;
- apply filters;
- preview;
- export PDF;
- export Excel;
- save favourite;
- schedule;
- email;
- download;
- duplicate custom report.

##### 7.12.6 Scheduled Reports

Schedule fields:

- report;
- frequency;
- run time;
- timezone;
- date rule;
- recipients;
- output format;
- active/inactive;
- failure notification.

##### 7.12.7 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-RPT-001 | Users can run authorised reports. | Must |
| ACC-RPT-002 | Reports must respect role and branch scope. | Must |
| ACC-RPT-003 | PDF and Excel export must be supported. | Must |
| ACC-RPT-004 | Scheduled reports must validate recipients. | Must |
| ACC-RPT-005 | Report parameters must be stored in history. | Must |
| ACC-RPT-006 | Custom reports require explicit permission. | Should |
| ACC-RPT-007 | Generated reports must include timestamp and currency. | Must |

---

#### 7.13 Profile

##### 7.13.1 Tabs

- Personal Information
- Security
- Preferences
- Notifications

##### 7.13.2 Personal Information

- profile photo;
- full name;
- job title;
- email;
- phone;
- mobile;
- date of birth;
- preferred language;
- timezone;
- address.

##### 7.13.3 Company Information

Read-only by default:

- company name;
- verification status;
- ABN;
- ACN;
- industry;
- phone;
- email;
- website;
- address.

##### 7.13.4 Account Summary

- role;
- user ID;
- department;
- joined date;
- last login.

##### 7.13.5 Security

- change password;
- 2FA;
- active sessions;
- login history;
- revoke session;
- logout all devices.

##### 7.13.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PRO-001 | User can edit permitted personal details. | Must |
| ACC-PRO-002 | Email and phone changes require verification. | Must |
| ACC-PRO-003 | User can manage password and 2FA. | Must |
| ACC-PRO-004 | User can view active sessions. | Must |
| ACC-PRO-005 | Company financial identity is read-only by default. | Must |
| ACC-PRO-006 | Profile changes must be audited. | Must |

---

### 8. End-to-End Workflows

#### 8.1 Invoice-to-Cash

1. Invoice created from load or manually.
2. Invoice saved as Draft.
3. Reviewer verifies line items, GST and customer details.
4. Invoice moves to In Review.
5. Invoice is approved.
6. Invoice marked Ready to Send.
7. Invoice PDF generated.
8. Invoice sent to customer.
9. Invoice status becomes Sent.
10. Payment received.
11. Payment allocated.
12. Invoice becomes Part Paid or Paid.
13. Unpaid invoice becomes Overdue after due date.
14. Reminder or statement may be sent.
15. Full history retained.

---

#### 8.2 Payment Reconciliation

1. Payment imported or manually recorded.
2. Customer is matched.
3. Candidate invoices are suggested.
4. User allocates payment.
5. System validates allocation.
6. Remaining amount becomes unallocated or customer credit.
7. Reconciliation completed.
8. Invoice balances update.
9. Audit and reconciliation history stored.

---

#### 8.3 Payroll Processing

1. Payroll run created.
2. Timesheets imported.
3. Employee data validated.
4. Gross and deductions calculated.
5. Exceptions reviewed.
6. Payroll submitted.
7. Approver approves.
8. Payment file generated.
9. Payments processed.
10. Payslips generated.
11. PAYG and super liabilities recorded.
12. Payroll marked Paid and locked.

---

#### 8.4 Contractor Claim

1. Claim created.
2. Load/reference linked.
3. Supporting documents uploaded.
4. GST calculated.
5. Claim submitted.
6. Reviewer approves or rejects.
7. Approved claim scheduled for payment.
8. Payment processed.
9. Claim marked Paid.
10. Audit trail retained.

---

#### 8.5 Expense Reimbursement

1. Employee submits expense.
2. Receipt uploaded.
3. Expense reviewed.
4. Approver approves or rejects.
5. Approved expense enters reimbursement queue.
6. Payment processed.
7. Expense marked Reimbursed.
8. Transaction flows to P&L and GST reports.

---

#### 8.6 BAS / PAYG Preparation

1. System aggregates posted transactions.
2. GST collected and credits calculated.
3. PAYG withholding reconciled.
4. Accounts user reviews exceptions.
5. BAS prepared.
6. Authorised user approves.
7. Lodgement sent or recorded.
8. ATO response stored.
9. Payment recorded.
10. Period locked.

---

### 9. Financial Business Rules

#### 9.1 Invoice Rules

1. Invoice number must be unique.
2. Invoice total must equal line items plus tax.
3. Sent invoices cannot be directly overwritten.
4. Credit notes must reference original invoice.
5. Rejected and held invoices require reason.
6. Duplicate load billing must be detected.
7. Currency must remain consistent per invoice.

#### 9.2 Payment Rules

1. Allocation cannot exceed received amount.
2. Allocation cannot exceed invoice outstanding amount.
3. Overpayment becomes customer credit.
4. Refund cannot exceed available balance.
5. Reconciled payments require elevated permission to modify.
6. Payment reversal must preserve original transaction.

#### 9.3 Payroll Rules

1. Approved timesheets only.
2. Employee must be active for pay period.
3. Pay rates must be effective for the period.
4. Approved payroll cannot be edited without reversal.
5. Paid payroll is locked.
6. Bank data must be encrypted.
7. Employee net pay cannot be negative unless policy allows.

#### 9.4 Tax Rules

1. Posted transactions only.
2. GST tax code required.
3. PAYG reconciles to payroll.
4. Lodged period is locked.
5. Amendment creates new version.
6. Tax submission and payment references are mandatory.

#### 9.5 Closed Financial Periods

- Transactions in closed periods cannot be edited.
- Adjustments must use authorised journal or correction workflow.
- Closed-period reports remain stable.
- Reopening requires high-level permission and audit reason.

---

### 10. Notifications and Alerts

#### 10.1 Accounts Alerts

- invoice awaiting review;
- invoice rejected;
- invoice ready to send;
- invoice overdue;
- payment unallocated;
- payment overpaid;
- refund awaiting approval;
- payroll due;
- payroll exception;
- contractor claim awaiting approval;
- expense awaiting approval;
- BAS due soon;
- PAYG due;
- scheduled report failed;
- accounting integration failed.

#### 10.2 Channels

- in-app;
- email;
- SMS where configured;
- push notification.

#### 10.3 Escalation

Configurable escalation for:

- overdue invoice days;
- unallocated payment age;
- payroll deadline;
- tax due date;
- high-value refund;
- high-value expense;
- failed bank or gateway transaction.

---

### 11. Audit Logging

Mandatory events:

- login;
- invoice creation;
- invoice edit;
- invoice approval;
- invoice send;
- invoice hold/reject;
- payment creation;
- payment allocation;
- reconciliation;
- refund;
- payroll creation;
- payroll approval;
- payroll payment;
- contractor claim action;
- expense action;
- tax preparation;
- tax lodgement;
- report generation;
- export;
- profile and security change.

Audit fields:

- event ID;
- company;
- branch;
- user;
- role;
- action;
- entity type;
- entity ID;
- before value;
- after value;
- reason;
- timestamp;
- IP;
- user agent;
- correlation ID.

Audit logs must be immutable for standard users.

---

### 12. Suggested Data Model

Core entities:

- Company
- Branch
- User
- Role
- Permission
- Customer
- CustomerContact
- Invoice
- InvoiceLine
- InvoiceAttachment
- InvoiceStatusHistory
- CreditNote
- Payment
- PaymentAllocation
- PaymentRefund
- BankTransaction
- Reconciliation
- PayrollRun
- PayrollEmployee
- PayrollEarning
- PayrollDeduction
- Payslip
- Contractor
- ContractorClaim
- ContractorClaimLine
- EmployeePayRun
- Expense
- ExpenseReceipt
- ExpenseApproval
- TaxPeriod
- GSTTransaction
- PAYGTransaction
- BASLodgement
- VehicleCost
- VehicleCostTransaction
- ReportDefinition
- ReportRun
- ReportSchedule
- Notification
- AuditLog
- FinancialPeriod
- AccountCode
- TaxCode
- Currency

---

### 13. API Requirements

Suggested endpoints:

- `/api/accounts/dashboard`
- `/api/invoices`
- `/api/invoices/:id`
- `/api/invoices/:id/review`
- `/api/invoices/:id/approve`
- `/api/invoices/:id/send`
- `/api/invoices/:id/hold`
- `/api/invoices/:id/reject`
- `/api/payments`
- `/api/payments/:id/allocate`
- `/api/payments/:id/refund`
- `/api/reconciliation`
- `/api/payroll`
- `/api/payroll/:id/approve`
- `/api/payroll/:id/process`
- `/api/contractor-claims`
- `/api/contractor-claims/:id/approve`
- `/api/employee-pay-runs`
- `/api/expenses`
- `/api/expenses/:id/approve`
- `/api/expenses/:id/reimburse`
- `/api/tax/gst`
- `/api/tax/payg`
- `/api/tax/bas`
- `/api/pnl`
- `/api/vehicle-costs`
- `/api/reports`
- `/api/profile`
- `/api/audit`

API standards:

- authentication;
- RBAC;
- branch/company scope;
- pagination;
- filtering;
- sorting;
- idempotency;
- optimistic concurrency;
- request validation;
- standard errors;
- audit hooks;
- secure uploads;
- correlation IDs;
- rate limits.

---

### 14. Integrations

Potential integrations:

- accounting software;
- payment gateway;
- bank feed;
- payroll provider;
- ATO lodgement service;
- email service;
- SMS service;
- document storage;
- PDF generation;
- antivirus scanning;
- fleet and vehicle system;
- HR and timesheet platform.

Integration requirements:

- failure visibility;
- retry handling;
- duplicate protection;
- idempotency;
- response logging;
- secure secret management;
- sync status;
- manual fallback.

---

### 15. Security Requirements

#### 15.1 Authentication

- secure password policy;
- 2FA;
- session timeout;
- refresh token rotation where used;
- brute-force protection;
- login audit;
- device/session controls.

#### 15.2 Financial Data Protection

- TLS in transit;
- encryption at rest;
- field-level encryption for bank and tax data;
- masked account numbers;
- restricted exports;
- signed document URLs;
- secure backups;
- retention policy;
- no plaintext secrets.

#### 15.3 Authorisation

- server-side RBAC;
- company isolation;
- branch scope;
- object-level permissions;
- approval limits;
- maker-checker separation;
- export permissions;
- refund permissions;
- tax permissions.

#### 15.4 Application Security

- input validation;
- SQL injection prevention;
- XSS protection;
- CSRF protection where applicable;
- secure headers;
- malware scanning;
- dependency scanning;
- audit monitoring;
- tamper detection for financial records.

---

### 16. Non-Functional Requirements

#### 16.1 Performance

- dashboard under 3 seconds;
- list filtering under 2 seconds;
- invoice detail under 2 seconds;
- payment allocation under 2 seconds;
- P&L report under 5 seconds for standard period;
- large exports processed asynchronously.

#### 16.2 Availability

- 99.9% monthly target;
- backup and restore;
- monitoring;
- integration health;
- graceful degradation.

#### 16.3 Scalability

Support:

- multiple companies;
- multiple branches;
- large invoice volumes;
- high payroll volumes;
- multi-year history;
- large report exports;
- concurrent accounts users.

#### 16.4 Accessibility

- keyboard navigation;
- semantic labels;
- accessible validation;
- colour contrast;
- focus states;
- screen-reader support;
- status not colour-only.

#### 16.5 Responsiveness

- desktop;
- tablet;
- limited mobile monitoring;
- horizontally scrollable financial tables on smaller screens;
- no data clipping;
- sticky headers where useful.

---

### 17. UX Requirements

1. Currency must always be visible.
2. GST-inclusive and GST-exclusive values must be clearly labelled.
3. Approval and destructive actions require confirmation.
4. Financial totals must reconcile visibly.
5. Validation errors must explain resolution.
6. Unsaved changes warning required.
7. Filters must persist during navigation.
8. Sensitive data must remain masked.
9. Closed-period records must show lock state.
10. Loading, empty and error states required.
11. Exported figures must match screen filters.
12. Status labels must be consistent across modules.

---

### 18. Error Handling

Standard error format:

```json
{
  "success": false,
  "code": "PAYMENT_ALLOCATION_EXCEEDS_BALANCE",
  "message": "Allocated amount exceeds the payment balance.",
  "details": {
    "paymentId": "PAY-1078",
    "availableAmount": 5280,
    "requestedAmount": 6000
  },
  "correlationId": "..."
}
```

User-facing errors must:

- explain the issue;
- preserve form data;
- show correction steps;
- never expose stack traces;
- provide retry when safe.

---

### 19. Reporting Definitions

#### 19.1 Collection Rate

`Total amount collected / Total amount due during the selected period × 100`

#### 19.2 Average Days to Pay

Average difference between invoice date and final payment date for fully paid invoices.

#### 19.3 Gross Margin

`Gross Profit / Total Revenue × 100`

#### 19.4 Net Profit Margin

`Net Profit / Total Revenue × 100`

#### 19.5 Outstanding Amount

`Invoice Total - Allocated Payments - Applied Credits`

#### 19.6 Cost per Kilometre

`Total Vehicle Cost / Distance Travelled`

---

### 20. Release Plan

#### Phase 1 — Core Accounts

- dashboard;
- invoice review;
- sent invoices;
- payments;
- payment allocation;
- expenses;
- basic reports;
- profile;
- RBAC;
- audit logs.

#### Phase 2 — Payroll and Payables

- payroll;
- employee pay;
- contractor pay;
- timesheet import;
- payslips;
- payment files;
- approval workflows.

#### Phase 3 — Compliance and Financial Reporting

- GST/PAYG;
- BAS preparation;
- P&L;
- vehicle costs;
- scheduled reports;
- reconciliation.

#### Phase 4 — Advanced Automation

- bank feeds;
- automated matching;
- reminder automation;
- OCR receipt capture;
- anomaly detection;
- cash-flow forecasting;
- advanced custom reports.

---

### 21. Out of Scope for Initial Release

Unless separately approved:

- full general ledger;
- advanced journal entry module;
- fixed asset register;
- inventory accounting;
- multi-entity consolidation;
- foreign exchange revaluation;
- statutory tax advice;
- direct banking without approval controls;
- automatic tax lodgement without authorised confirmation.

---

### 22. QA Test Areas

#### 22.1 Functional

- invoice creation;
- approval;
- sending;
- overdue calculation;
- payment allocation;
- partial payment;
- overpayment;
- refund;
- payroll calculation;
- contractor claim;
- expense approval;
- GST calculation;
- P&L totals;
- vehicle cost calculation;
- exports;
- scheduled reports.

#### 22.2 Negative Testing

- duplicate invoice;
- invalid GST;
- payment over-allocation;
- duplicate payment;
- excessive refund;
- payroll without rate;
- payroll with missing bank account;
- duplicate expense receipt;
- closed-period edit;
- unauthorised approval;
- invalid report recipient.

#### 22.3 Permission Testing

- direct URL access;
- direct API access;
- company isolation;
- branch restriction;
- hidden button bypass;
- export restriction;
- refund restriction;
- payroll restriction;
- tax lodgement restriction.

#### 22.4 Security Testing

- IDOR;
- injection;
- XSS;
- CSRF;
- session attacks;
- privilege escalation;
- insecure file upload;
- data leakage;
- sensitive logs;
- token replay.

#### 22.5 Performance Testing

- large invoice dataset;
- large payment import;
- payroll for many employees;
- large expense upload;
- multi-year P&L;
- large report export;
- concurrent approvals.

---

### 23. UAT Scenarios

#### UAT-01 — Invoice Approval

**Given** a valid invoice is In Review  
**When** an authorised user approves and sends it  
**Then** the invoice becomes Sent, PDF is generated and history is recorded.

#### UAT-02 — Duplicate Invoice

**Given** an invoice already exists for the same unique reference  
**When** another invoice is created  
**Then** the system warns or blocks according to policy.

#### UAT-03 — Partial Payment

**Given** an open invoice  
**When** a partial payment is allocated  
**Then** status becomes Part Paid and outstanding balance updates.

#### UAT-04 — Overpayment

**Given** payment exceeds invoice outstanding amount  
**When** allocation is completed  
**Then** excess becomes customer credit.

#### UAT-05 — Refund Control

**Given** a refundable payment exists  
**When** a user requests more than available  
**Then** refund is blocked.

#### UAT-06 — Payroll Approval

**Given** payroll is Draft  
**When** it is submitted and approved  
**Then** status becomes Approved and calculation history is retained.

#### UAT-07 — Closed Period

**Given** a financial period is closed  
**When** a user attempts to edit a transaction  
**Then** the action is blocked.

#### UAT-08 — Expense Approval

**Given** a pending expense with receipt  
**When** an authorised reviewer approves it  
**Then** it moves to reimbursement queue.

#### UAT-09 — BAS Lodgement

**Given** tax period is prepared and approved  
**When** authorised user lodges it  
**Then** lodgement response is stored and period locks.

#### UAT-10 — Report Export

**Given** filters are applied  
**When** report is exported  
**Then** exported totals match the filtered screen.

---

### 24. Definition of Done

A feature is complete only when:

- functional requirements are implemented;
- server-side permissions exist;
- financial calculations are tested;
- audit logs are written;
- loading, empty and error states exist;
- responsive design is complete;
- accessibility checks pass;
- automated tests pass;
- security review passes;
- QA passes;
- UAT passes;
- API documentation is updated;
- user documentation is available;
- monitoring is configured;
- no critical or high-severity defects remain.

---

### 25. Open Product Decisions

1. Which accounting platform will integrate?
2. Is Xero, MYOB or QuickBooks required?
3. Is direct ATO lodgement required?
4. Which payment gateway is used?
5. Is bank-feed integration required?
6. What approval limits apply?
7. Is dual approval required for refunds?
8. Which payroll engine is authoritative?
9. Is Single Touch Payroll required?
10. How are contractor tax rules configured?
11. Are financial periods manually closed?
12. Is multi-currency required?
13. Are customer statements automatic?
14. Are overdue reminders automatic?
15. What receipt threshold requires attachment?
16. Which users may view bank details?
17. Which users may export payroll data?
18. Are branch-level P&L reports required?
19. Which vehicle cost source systems are authoritative?
20. What retention period applies to financial records?

---

### 26. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate billing | Customer dispute | Duplicate detection |
| Incorrect GST | Compliance issue | Tax validation |
| Payment misallocation | Incorrect receivables | Controlled allocation |
| Payroll error | Employee impact | Validation and approval |
| Refund fraud | Financial loss | Dual approval and audit |
| Sensitive data exposure | Privacy breach | Encryption and masking |
| Closed-period changes | Reporting inconsistency | Period locking |
| Integration failure | Delayed processing | Retry and manual fallback |
| Incorrect P&L mapping | Bad decisions | Account-code validation |
| Unauthorised exports | Data leakage | Export permission controls |

---

### 27. Appendix A — Default Permission Matrix

| Action | Accounts Officer | Accounts Manager | Finance Manager | Auditor |
|---|---:|---:|---:|---:|
| View Dashboard | Yes | Yes | Yes | Yes |
| Create Invoice | Yes | Yes | Yes | No |
| Approve Invoice | No | Yes | Yes | No |
| Send Invoice | Conditional | Yes | Yes | No |
| Record Payment | Yes | Yes | Yes | No |
| Allocate Payment | Yes | Yes | Yes | No |
| Issue Refund | No | Conditional | Yes | No |
| Create Payroll | Conditional | Yes | Yes | No |
| Approve Payroll | No | Conditional | Yes | No |
| Create Contractor Claim | Yes | Yes | Yes | No |
| Approve Contractor Claim | No | Yes | Yes | No |
| Approve Expense | Conditional | Yes | Yes | No |
| Prepare BAS | No | Yes | Yes | No |
| Lodge BAS | No | No | Yes | No |
| View P&L | Conditional | Yes | Yes | Yes |
| Export Reports | Conditional | Yes | Yes | Conditional |
| View Audit Logs | No | Conditional | Yes | Yes |

---

### 28. Appendix B — Example Audit Event

```json
{
  "eventId": "AUD-ACC-10021",
  "companyId": "COMP-001",
  "branchId": "SYD-HO",
  "module": "payments",
  "action": "payment_refund_approved",
  "actorId": "USR-10024",
  "actorRole": "FINANCE_MANAGER",
  "entityType": "payment",
  "entityId": "PAY-1078",
  "before": {
    "refundedAmount": 0
  },
  "after": {
    "refundedAmount": 1250
  },
  "reason": "Duplicate customer payment",
  "timestampUtc": "2026-08-05T10:10:00Z",
  "ipAddress": "203.26.45.12",
  "correlationId": "COR-..."
}
```

---

### 29. Sign-Off

| Stakeholder | Name | Status | Date |
|---|---|---|---|
| Product Owner |  | Pending |  |
| Finance Lead |  | Pending |  |
| Accounts Lead |  | Pending |  |
| Payroll Lead |  | Pending |  |
| Technical Lead |  | Pending |  |
| Security Reviewer |  | Pending |  |
| QA Lead |  | Pending |  |
| Client Representative |  | Pending |  |

---

---

## 16. Consolidated Sign-Off

| Stakeholder | Name | Status | Date |
|---|---|---|---|
| Product Owner |  | Pending |  |
| Company Administration Lead |  | Pending |  |
| Dispatch Operations Lead |  | Pending |  |
| Warehouse Operations Lead |  | Pending |  |
| Yard Operations Lead |  | Pending |  |
| Finance / Accounts Lead |  | Pending |  |
| Technical Lead |  | Pending |  |
| Security Reviewer |  | Pending |  |
| QA Lead |  | Pending |  |
| Client Representative |  | Pending |  |

**End of Master Document**
