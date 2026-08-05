# Product Requirements Document

## Hero Logistics Admin Portal

**Fleet, Load, Warehouse, Finance, Compliance and Operations Management Platform**

| **Document Version** | 1.0                                               |
|----------------------|---------------------------------------------------|
| **Prepared For**     | Hero Logistics - Company Admin & Engineering Team |
| **Prepared Date**    | 5 August 2026                                     |
| **Product Type**     | Multi-branch logistics operations web application |
| **Document Status**  | Baseline PRD for design, development, QA and UAT  |

**CONFIDENTIAL**

# Document Control

| **Item**                 | **Details**                                                                                                                                        |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Owner**                | Product Owner / Company Admin                                                                                                                      |
| **Primary Users**        | Company Admin, Dispatcher, Accounts Manager, Warehouse Manager, Yard Attendant, Sales Representative and operational support staff                 |
| **Related User Portals** | Driver Portal and Customer Portal consume selected data and workflows governed by this Admin Portal.                                               |
| **Source Material**      | Admin portal menu structure, dashboard content, module screens, sample tables, alerts, roles and permission examples supplied by the stakeholder.  |
| **Decision Rule**        | Where the supplied screen copy did not define detailed behaviour, this PRD records a reasonable product assumption and labels it for confirmation. |

> **Important sample-data note:** Dates, names, load references, invoice values, vehicle registrations, branches, counts and financial figures shown in the supplied screens are illustrative test data. Some sample records contain dates after the document date; they must not be interpreted as production records or system time requirements.

## Revision History

| **Version** | **Date**   | **Author/Owner** | **Change Summary**                                           |
|-------------|------------|------------------|--------------------------------------------------------------|
| 1.0         | 5 Aug 2026 | Product Team     | Initial baseline covering the complete Company Admin portal. |

# Contents

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

# 1. Executive Summary

Hero Logistics Admin Portal is a central operational command platform for managing logistics loads, dispatch, drivers, fleet vehicles, branch operations, warehouses, assets, pricing, payroll, finance, compliance documents, reports, messaging, support, safety enforcement and delivery exceptions. The portal is intended to provide a single source of truth across multiple branches and countries while preserving role-based access and auditable actions.

- The portal must support day-to-day execution: create and dispatch loads, assign resources, track trips, resolve exceptions and collect proof of delivery.

- The portal must support business control: pricing, payroll, invoicing, cash position, compliance, reporting and approval workflows.

- The portal must support distributed operations across Australia and New Zealand, including branch-level segregation, local time zones and currencies.

- AI-assisted features may recommend or extract information, but users remain accountable for review and approval of operational decisions.

# 2. Product Vision and Objectives

## 2.1 Vision

Create a secure, reliable and intuitive logistics operations platform that gives authorised users real-time visibility and control from load intake to final delivery, financial settlement and compliance reporting.

## 2.2 Business Objectives

- Reduce manual dispatch effort and duplicate data entry.

- Improve on-time delivery and fleet utilisation through live telemetry and proactive alerts.

- Prevent non-compliant trips through enforced driver, vehicle and safety checks.

- Accelerate invoicing, payroll preparation and financial reconciliation.

- Provide consistent processes across branches while allowing branch-specific access and configuration.

- Create measurable audit trails for sensitive actions and regulatory evidence.

- Improve customer and driver communication through a central message and support hub.

## 2.3 Product Principles

- Operational clarity: every load, vehicle, driver and issue has a visible status and owner.

- Exception-first design: overdue, blocked, urgent and non-compliant items are prioritised.

- Least privilege: users see and change only what their assigned role and branch allow.

- Human-controlled AI: AI outputs are suggestions or drafts until an authorised user confirms them.

- Traceability: critical changes include who, what, when, prior value and resulting value.

# 3. Product Scope

## 3.1 In Scope

- Company Admin portal modules listed in the primary navigation.

- Multi-branch and multi-country operational views.

- Load lifecycle, dispatch, live tracking, safety, delivery exception and completion workflows.

- Driver, vehicle, asset, warehouse and compliance management.

- Pricing, payroll, finance, documents, reports, messages and support.

- Role-based access control, settings, audit logs and integration health.

- Administrative interactions with Driver and Customer portals.

## 3.2 Out of Scope for This Baseline

- Native mobile application UX specifications; this PRD defines the admin web portal and related workflow contracts only.

- Detailed accounting ledger implementation replacing Xero or another accounting system.

- Hardware procurement or installation for GPS, telematics, temperature sensors, scanners or warehouse devices.

- Exact AI model/vendor selection and model-training strategy.

- Country-specific legal advice; compliance functions must be reviewed by qualified legal, payroll and safety specialists.

- Full customer-facing and driver-facing screen designs except where required to complete an admin workflow.

## 3.3 Assumptions

- The system is multi-tenant or at minimum company-isolated, and the Company Admin operates only within the assigned company.

- Branches may operate in different time zones and currencies; all records store UTC plus the applicable local time zone.

- The platform exposes APIs or integration services for Driver and Customer portals.

- A load may contain multiple pickup/delivery stops and may be associated with general freight, car carrying or dangerous goods.

- Compliance expiry calculations use configurable warning windows, with 30 days as the default.

- Financial amounts are stored with explicit currency codes and appropriate decimal precision.

# 4. Users, Roles and Permissions

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

## 4.1 Permission Enforcement Rules

- The backend must enforce permissions for every API action; hidden UI controls are not sufficient security.

- A user with view permission but no edit permission may inspect details but cannot save changes.

- Delete, cancel, approve, payroll export, finance export, permission change and checklist enforcement actions require explicit permissions.

- Branch-restricted users can access only records associated with authorised branches unless a cross-branch permission is granted.

- Role and permission changes take effect immediately or on token refresh according to the security architecture, and must be audited.

# 5. Information Architecture and Navigation

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

# 6. Command Centre

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

#### Acceptance Criteria

- Authorised users see only KPI values and records within their company and branch scope.

- Clicking a status count opens Loads pre-filtered to that status and reporting period.

- Critical/overdue alerts are visually distinct and sorted ahead of informational items.

- Dashboard totals reconcile with the source modules for the same filters and date range.

# 7. Loads and Dispatch

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

#### Acceptance Criteria

- A Draft load can be saved without assignment; an Active trip cannot begin until required validations pass.

- A driver or vehicle cannot be assigned if unavailable, out of service or blocked by mandatory compliance, unless a permitted override exists and is audited.

- Cancelling a load requires a reason and prevents further trip updates unless restored by an authorised role.

- Completing a load requires all mandatory stops and proof-of-delivery requirements to be satisfied or an audited exception approval.

- Bulk actions return per-record success/failure results rather than silently skipping invalid loads.

# 8. AI Load Inbox

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

#### Acceptance Criteria

- No AI-generated draft becomes an active operational load without an authorised human confirmation.

- Required fields and compliance validations must pass before dispatch.

- Low-confidence fields are highlighted and reviewer correction is recorded.

- Urgent drafts are sorted above normal drafts and may generate notifications.

- Converting a draft creates a link between the inbox record and final load.

# 9. Customers

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

#### Acceptance Criteria

- Customer account codes are unique within the company.

- Archived customers remain available for historical reporting but cannot be selected for new loads unless reactivated.

- Credit hold or overdue rules can warn or block new bookings based on configured workflow.

- Sensitive financial/tax fields are visible only to authorised roles.

# 10. Live Tracking

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

#### Acceptance Criteria

- The map displays a clear “last updated” time and stale/offline state.

- Selecting a vehicle opens its current load and telemetry summary.

- Critical alerts can be acknowledged, assigned and linked to a delivery issue.

- Tracking data is restricted by company and branch scope.

- Temporary telemetry loss does not overwrite the last known valid position.

# 11. Drivers

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

#### Acceptance Criteria

- A driver cannot start a load when a mandatory licence, medical or checklist requirement is invalid.

- Availability changes immediately affect assignment suggestions and validation.

- Expiring soon uses the configured warning threshold and shows the exact expiry date.

- Compliance score calculation is documented and does not hide the underlying missing/expiring items.

- Sensitive personal fields are restricted and audited when viewed or edited.

# 12. Vehicles

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

#### Acceptance Criteria

- Out-of-service, sold or inactive vehicles cannot be assigned to new loads.

- A compliance or maintenance block prevents trip start unless an explicit, authorised exception process is configured.

- Odometer updates retain source and timestamp.

- Vehicle list totals reconcile with status and compliance summaries.

- Registration numbers are unique within the relevant jurisdiction/company rule.

# 13. Branches

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

#### Acceptance Criteria

- Branch code is unique within the company.

- A branch cannot be closed while active loads, payroll runs or uncompleted operational tasks remain unless a migration/closure workflow is completed.

- Branch local time zone and currency are applied to relevant displays and records.

- Pending Setup branches are not available for normal operational assignment until mandatory setup items are complete.

# 14. Assets

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

#### Acceptance Criteria

- Asset IDs are unique within the company.

- Out-of-service assets cannot be assigned to active operational use.

- Failed or overdue maintenance is clearly visible and may block task assignment according to category rules.

- Assignment and location changes are auditable.

- Compliance summaries reconcile with item-level records.

# 15. Warehouse

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

#### Acceptance Criteria

- Every stock movement changes inventory through a controlled transaction and creates an immutable movement record.

- Reserved quantity cannot exceed available stock unless backorder/on-order rules are enabled.

- Transfers show source decrement and destination in-transit/receipt states.

- Inventory value uses the configured costing method and currency.

- Overdue tasks appear in alerts and may be escalated to supervisors.

# 16. Pricing and Rate Cards

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

#### Acceptance Criteria

- The pricing engine selects the most specific active rate in a documented order: customer special rate, contract rate, lane/vehicle rate, then manual permitted rate.

- Expired or future rates do not apply outside their effective period.

- Pricing changes do not retroactively alter an approved load or invoice unless an authorised repricing action is completed.

- Manual overrides require reason and permission and are audited.

- Imported rows return clear validation errors.

# 17. Payroll

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

#### Acceptance Criteria

- Only approved timesheets and earnings inputs are included in an approvable pay run.

- A completed pay run is locked from direct editing; corrections use adjustment or reversal workflows.

- ABA and STP exports require explicit permission and are logged.

- Payroll totals reconcile to individual employee/driver breakdowns.

- Sensitive payroll data is not visible to operational roles without finance/payroll permission.

# 18. Finance

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

#### Acceptance Criteria

- Financial dashboard values reconcile to the underlying transactions or connected accounting source.

- Invoice totals match line items, tax, surcharge, discounts and payments/credits.

- Editing an issued invoice follows controlled revision/credit rules rather than silent overwrite.

- Payment gateway status is not treated as final settlement until the system receives a verified result.

- Currency and branch scope are explicit in all financial totals.

# 19. Documents Repository

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

#### Acceptance Criteria

- A document linked to a required compliance item affects compliance status after verification according to configuration.

- Deleting an in-use compliance record uses archive/retention rules rather than irreversible removal.

- File type, size and malware validation occurs before the document becomes available.

- Users cannot access documents outside company/branch/entity permissions even with a guessed URL.

- Version history identifies the active version.

# 20. Reports and Analytics

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

#### Acceptance Criteria

- Report results respect the requesting user’s permissions and branch scope.

- Scheduled reports do not send data to unauthorised recipients.

- Every report displays report period, data refresh time, filters and currency/time-zone context.

- AI insights link to the data or records supporting the statement and are labelled as insights, not audited facts.

- Large exports are processed reliably with status and error reporting.

# 21. Messages

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

#### Acceptance Criteria

- Unread counts update when messages are opened/read and reconcile with the menu badge.

- Users can message only participants available within their permission and company scope.

- Broadcasts require confirmation and are audited.

- Delivery status accurately reflects the connected channel and does not falsely indicate read state.

- Archived or deleted conversation behaviour follows retention policy.

# 22. Support and Knowledge Base

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

#### Acceptance Criteria

- A requester can view only their own tickets unless assigned broader support permission.

- Status changes and replies generate configured notifications.

- Resolved tickets retain full history and may be reopened according to policy.

- Internal notes are never visible to customer/driver requesters.

- Knowledge base search returns relevant published articles only.

# 23. Roles and Permissions Administration

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

#### Acceptance Criteria

- A user cannot grant permissions they do not possess unless they hold a dedicated privilege administration permission.

- Backend endpoints enforce the same permission catalogue as the UI.

- Changing a role affects assigned users according to the documented session/token refresh rule.

- The system prevents lockout by protecting at least one active company administrator.

- Permission descriptions are human-readable and grouped by module.

# 24. Settings

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

#### Acceptance Criteria

- Only authorised administrators can change organisation-wide settings.

- Integration secrets are masked after save and never returned in plaintext.

- Disabling an integration or automation clearly shows downstream impact.

- Critical configuration changes require confirmation and audit logging.

- Setup percentage is based on documented checklist rules, not a hard-coded display value.

# 25. Safety Checklists

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

#### Acceptance Criteria

- A trip subject to an active strict checklist cannot start until all required items pass.

- A failed safety-critical item creates a blocking result and may create a delivery/maintenance issue.

- Disabling a checklist affects future triggers only and preserves prior responses.

- Overrides require a dedicated permission, reason and audit event.

- The driver sees clear guidance on incomplete or failed items.

# 26. Delivery Issues

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

#### Acceptance Criteria

- Critical issues are placed at the top and notify the configured escalation group.

- Resolving an issue requires a resolution category and note.

- Issue status changes are timestamped with actor and prior/new state.

- Sensor/GPS issues retain source data and do not become resolved solely because a later reading is normal unless the configured rule allows auto-resolution.

- A customer refusal can initiate reschedule, return, charge or cancellation workflow according to policy.

# 27. End-to-End Workflows

## 27.1 New Load to Delivery Completion

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

## 27.2 AI Draft Review and Dispatch

1\. A booking arrives by email, customer portal, file upload or manual intake.

2\. System stores the original source, extracts structured fields and calculates confidence.

3\. Duplicate, missing field, compliance and route warnings are displayed.

4\. Reviewer compares source and extracted data, corrects fields and records decision.

5\. Approved draft converts to a load; rejected/duplicate draft records a reason.

6\. Optional assignment/dispatch occurs only after standard load validations.

## 27.3 Driver Assignment

1\. Dispatcher opens an unassigned load and requests driver suggestions or searches manually.

2\. System filters by branch, availability, licence/qualification, compliance, fatigue/hours, location and schedule conflicts.

3\. Vehicle suitability and availability are validated in parallel.

4\. Dispatcher confirms assignment; notifications are sent to the driver and relevant team.

5\. Reassignment records previous and new assignment plus reason.

## 27.4 Safety Block and Override

1\. At trip start, system determines applicable active checklist version(s).

2\. Driver completes required items and provides evidence where configured.

3\. Incomplete or failed mandatory item blocks the trip and generates clear remediation guidance.

4\. Where policy permits, an authorised supervisor may override with reason and evidence.

5\. Trip starts only after successful completion or valid override; the result is permanently linked to the load.

## 27.5 Delivery Issue Resolution

1\. Issue is created automatically or manually and classified by source/type/severity.

2\. System assigns or alerts the appropriate operational team.

3\. Owner acknowledges, investigates and records actions/communications.

4\. Issue may cause ETA update, reschedule, return, maintenance, customer refusal or other workflow.

5\. Resolution requires category and notes; status history remains visible.

## 27.6 Invoice and Payment

1\. Completed/eligible load creates an invoice draft using approved load pricing and extras.

2\. Accounts user reviews tax, customer terms, line items, POD and references.

3\. Invoice is approved/issued and delivered to the customer through configured channels.

4\. Payment status is updated by gateway/accounting sync or authorised reconciliation.

5\. Overdue rules send reminders and update receivables reporting.

6\. Credits/cancellations use controlled finance workflows and retain audit history.

## 27.7 Payroll Run

1\. Payroll user creates a run for branch and pay period.

2\. Approved timesheets, trips, mileage, allowances and deductions are loaded.

3\. System flags missing or inconsistent inputs.

4\. Authorised reviewer approves the run.

5\. Payslips, ABA/bank file and STP output/integration are generated as permitted.

6\. Completed run is locked; adjustments occur through a controlled process.

## 27.8 Support Ticket

1\. User searches the Knowledge Base or raises a ticket.

2\. Ticket is categorised, prioritised and routed to an owner/team.

3\. Replies, internal notes, attachments and related entities are recorded.

4\. SLA/escalation events notify responsible users.

5\. Resolution is shared with requester and ticket is resolved/closed with history retained.

# 28. Data and Entity Model

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

## 28.1 Data Integrity Rules

- Every transactional entity includes company/tenant ID and, where relevant, branch ID.

- Soft delete/archive is used for records with historical or compliance value.

- Statuses use controlled enumerations and transitions rather than arbitrary free text.

- Money includes amount and ISO currency code; dates/times include time zone context.

- Files store checksum, MIME type, size, storage reference and access classification.

- All external identifiers and integration mappings are unique within their provider/company scope.

- Audit records are append-only and tamper-evident according to the selected architecture.

# 29. Integrations

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

## 29.1 Integration Behaviour

- Each integration exposes connection state, last successful sync, last error and a safe reconnect/test action.

- Transient failures use retry with backoff and do not create duplicate transactions.

- Inbound webhooks/events are authenticated, idempotent and logged.

- Outbound requests use correlation IDs and redact secrets/personal data from logs.

- The UI distinguishes connected, warning, failed and disabled states.

- Integration outages degrade gracefully and do not corrupt internal records.

# 30. Notifications and Automation

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

# 31. Non-Functional Requirements

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

# 32. Audit, Security and Compliance

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

## 32.1 Minimum Audit Event Fields

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

# 33. Analytics and Success Metrics

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

# 34. Release Scope and Prioritisation

## 34.1 Must-Have Production Baseline

- Authentication, company/branch data isolation, RBAC and audit logging.

- Command Centre, Loads, Load Inbox review, Customers, Drivers, Vehicles and Branches.

- Live Tracking integration with freshness/alert handling.

- Safety Checklist trip blocking and Delivery Issue workflow.

- Documents and core compliance expiry tracking.

- Pricing, invoice/finance essentials and payroll run controls or validated external integrations.

- Warehouse core inventory transactions and task visibility.

- Messages, notifications and support tickets.

- Settings, integrations, backup/health visibility and export/import controls.

## 34.2 Should-Have Enhancements

- AI extraction confidence, duplicate detection and driver/vehicle suggestions.

- Advanced warehouse utilisation, stock forecasting and scanner workflows.

- Custom report builder, report scheduling and AI insight explanations.

- Location history playback and advanced telemetry rules.

- Workflow rule builder and configurable approval chains.

- Customer and driver self-service enhancements.

## 34.3 Future Opportunities

- Route optimisation and dynamic replanning.

- Predictive maintenance and parts forecasting.

- Automated proof-of-delivery validation and damage detection.

- Carbon/emissions reporting.

- Advanced mobile offline workflows.

- Marketplace/carrier partner integrations and inter-company load exchange.

# 35. QA, UAT and Definition of Done

## 35.1 Test Coverage

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

## 35.2 Definition of Done

- Functional requirement and acceptance criteria are implemented and demonstrably pass.

- Backend permissions and data isolation are tested; no reliance on UI-only restrictions.

- Error, empty, loading, offline/stale and permission-denied states are designed and implemented.

- Audit events exist for all identified sensitive actions.

- Automated tests pass and critical flows are covered by regression tests.

- No open critical/high severity defects for the release scope.

- Operational monitoring, alerts, backup and recovery steps are documented.

- User/admin guidance is updated and UAT sign-off is recorded.

- Production migration, rollback and integration credentials are controlled and reviewed.

# 36. Risks, Dependencies and Open Decisions

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

## 36.1 Open Decisions Requiring Stakeholder Confirmation

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

# Appendix A. Canonical Status Definitions

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

# Appendix B. Permission Catalogue

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

# Appendix C. Screen Inventory

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

# Approval and Sign-Off

This PRD becomes the baseline for detailed UX specifications, technical architecture, estimates, sprint planning, QA test cases and UAT after stakeholder review and approval of open decisions.

| **Role**              | **Name / Signature** | **Date** |
|-----------------------|----------------------|----------|
| Product Owner         |                      |          |
| Operations Owner      |                      |          |
| Finance/Payroll Owner |                      |          |
| Engineering Lead      |                      |          |
| QA Lead               |                      |          |
| Compliance Owner      |                      |          |
| Security Officer      |                      |          |
| UX Designer           |                      |          |
| Project Sponsor       |                      |          |

**End of Document**
## Revision History (Addendum)

| Version | Date       | Author/Owner | Change Summary |
|---------|------------|--------------|----------------|
| 1.1     | 10 Aug 2026| Product Team | Added Safety Checklist details (Section 25) |
| 1.2     | 15 Aug 2026| QA Lead      | Updated acceptance criteria for Load module |

## Glossary (Optional)

- **RBAC** – Role‑Based Access Control  
- **AI** – Artificial Intelligence (used for load‑inbox extraction)  
- **UAT** – User Acceptance Testing  

*This document is controlled; any changes require formal revision and stakeholder approval.*

## Admin Module – A to Z Overview

### Menus & Buttons

| Menu | Description | Primary Buttons |
|------|------------|-----------------|
| Dashboard | Overview of key metrics, system health, recent activity. | Refresh, Export CSV, Filter |
| Users | Manage company users, roles, permissions. | Add User, Edit, Delete, Assign Role, Reset Password |
| Roles & Permissions | Define and assign roles, set granular permissions. | Create Role, Edit, Delete, Clone, Export |
| Settings | Global configuration for company, branches, integrations. | Save, Test Connection, Reset to Default |
| Reports | Generate and schedule operational reports. | Create Report, Schedule, Export PDF/Excel |
| Notifications | Configure event triggers, templates, channels. | Add Template, Edit, Delete, Test Send |
| Audit Log | View and export audit events. | Filter, Export CSV |
| Integrations | Manage third‑party integrations (GPS, accounting, payment). | Add Integration, Edit, Delete, Test Sync |
| Safety Checklists | Define pre‑trip safety checklists. | Create Checklist, Edit, Activate/Deactivate |
| Delivery Issues | Track and resolve delivery exceptions. | Create Issue, Assign, Update Status, Close |
| Support & Knowledge Base | Manage support tickets and knowledge articles. | Open Ticket, Respond, Close, Publish Article |
| Payroll & Finance | Oversee payroll runs, invoices, payments. | Run Payroll, Approve Invoice, Export |
| Data Management | Import/Export data, manage master data entities. | Import CSV, Export Template, Validate |
| System Health & Backup | Monitor system health, backup status, restore options. | View Health, Run Backup, Restore |

### Common Buttons Across Modules
- **Save** – Persist changes.
- **Cancel** – Discard changes and return.
- **Delete** – Remove selected entity after confirmation.
- **Export** – Download data in CSV/Excel/PDF.
- **Refresh** – Reload current view.
- **Test** – Validate configuration (e.g., integration connection).
- **Assign** – Allocate resources (users, drivers, vehicles).
- **Activate / Deactivate** – Enable or disable a feature.

### Access Control
All admin features are gated by RBAC. Only users with the **Admin** or specific **Permission** (e.g., `admin.users.manage`, `admin.reports.view`) can see the corresponding menus and buttons.

---

