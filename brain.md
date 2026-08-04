# Hero Logistics System - Core Knowledge Base (Brain)

> [!IMPORTANT]
> **Core Rule:** Hero must follow this workflow across all panels: 
> **Load → Stops → Items/Assets → Customer → Driver → Delivery → Invoice → Pay/P&L**
> Every panel should support this flow without breaking the operational chain.

---

## 1. Shared Features Across Panels

### Niche Configuration
Hero must support:
- **Car carrying**
- **General freight**
- **Dangerous goods**

*The front end should allow fields and wording to change depending on the selected niche.*

### Permissions
Every button must be permission-based. Examples:
- **Driver:** Can create a draft load only if enabled.
- **Dispatch:** Can assign loads but cannot complete delivery actions.
- **Accounts:** Can approve invoices but may not edit operational load details.
- **Customer:** Can view only their own records.

### AI Confirmation
All AI actions must require user confirmation.
- **Examples:** AI Load Inbox, AI receipt reading, AI odometer reading, Auto-filled asset details
- **Required buttons:** Review AI Result, Confirm, Edit, Reject

### Start / Finish Work
Required roles: Driver, Yard staff, Warehouse staff, Dispatch, Admin.
*This feeds into: Payroll, Time tracking, Reporting, Operational costing, and P&L.*

### Inter-Company Transfers
- **Required screens:** Transfer load, Transfer item/car, Transfer delivery section, Accept transfer, Reject transfer, View chain of custody.

---

## 2. Global Front-End Layout

### Standard Desktop Layout
- **Left Sidebar:** Used for main navigation (Dashboard, Loads, Customers, Staff, Drivers, Vehicles, Trailers, Warehouse/Yard, Accounts, Reports, Settings).
- **Top Bar:** Used for fast actions (Global Search, Create New, Notifications, Messages, Branch Selector, Profile, Help/Support).

### Global Search
Must search by: VIN, Rego, Stock number, Customer reference, Load ID, Driver, Customer, Destination, Current location, Status, Required delivery time, Suburb/postcode.

---

## 3. Panels Specification

### 3.1 Super Admin Panel
**Purpose:** Manages the Hero SaaS platform, companies, subscriptions, feature access, billing, support, and white-label settings. *(Note: This is only for the Hero platform owner. Do not confuse with Transport Company Admin).*
- **Sidebar:** Platform Dashboard, Companies, Subscriptions, Membership Plans, Feature Access, White Label, Support Tickets, Billing, System Analytics, Inter-Company Transfers, AI Controls, Settings.
- **Dashboard:** Active/Trial/Paid companies, Monthly revenue, Failed payments, Support tickets, Active users, Platform usage. Main sections include Company table, Subscription health, Support queue, Feature usage, System alerts.
- **Actions:** Add/Suspend/Reactivate Company, Login as Company, Create/Edit Plan, Manage White Label, Enable/Disable Feature, View Transfer Chain, etc.

### 3.2 Sales Panel
**Purpose:** Manages leads, demos, trials, proposals, and conversion into paying transport companies.
- **Sidebar:** Sales Dashboard, Leads, Pipeline Board, Demo Bookings, Trial Companies, Proposals, Follow-Ups, Onboarding Handover, Sales Reports, Settings.
- **Dashboard:** New leads, Demos booked, Trials active, Deals won/lost, Pipeline value. Kanban pipeline (Left), Lead details (Right), Follow-up tasks (Bottom).
- **Pipeline Columns:** New Lead → Contacted → Demo Booked → Demo Completed → Trial Started → Proposal Sent → Negotiation → Won → Lost.
- **Actions:** Add Lead, Assign Sales Rep, Book Demo, Start Trial, Send Proposal, Convert to Company, etc. (When Won, convert to company account and hand to onboarding).

### 3.3 Transport Company Admin Panel
**Purpose:** The main admin panel for each transport business using Hero.
- **Sidebar:** Company Dashboard, Branches, Loads, Dispatch, Customers, Drivers/Staff, Vehicles, Trailers, Warehouse/Yard, Workforce/Rostering, Availability/Leave, Accounts, Payroll, Expenses/Alerts, Asset Register, Customer Instructions, Inter-Company Transfers, Reports, Permissions, Settings.
- **Dashboard:** Active/Completed loads, Revenue, Expenses, Gross margin, Available drivers, Vehicles active, Overdue invoices. Branch selector included.
- **Actions:** Add Branch, Add/Assign User, Create Role, Set Permissions, Add Vehicle/Trailer/Customer/Asset, Configure Niche Fields, View Branch P&L, etc.

### 3.4 Dispatch Panel
**Purpose:** Controls daily operations, load creation, planning, assignment, GPS tracking, driver communication, and urgent job handling.
- **Layout:** Left: Load list | Centre: Planning board | Right: Live GPS map | Bottom: Driver status bar.
- **Filters:** Branch, Status, Driver, Customer, Destination, Required date, Niche type, Vehicle/trailer, Available workers.
- **Create Load Flow:** Header → Stops → Items/Cars → Link Items to Stops → Link to Customer → Assign Driver/Truck/Trailer → Documents/Photos → Review → Activate/Dispatch.
- **AI Load Inbox Actions:** Review AI Extract, Confirm AI Load, Match Customer/Address, Create Draft, Reject, Assign.
- **Note:** Dispatch controls planning and assignment only. No physical driver actions (e.g., arrive, pickup, signature capture).

### 3.5 Driver Panel
**Purpose:** Mobile-first workflow for completing assigned jobs step by step.
- **Mobile Home:** Current job, Next job, Job status, Pickup/drop location, Next action. Floating communication button (Call/Message Dispatch, Voice Note, Voice-to-Text).
- **Workflow:** Start Work → Confirm truck/trailer → Odometer photo → Compliance → Accept job → Navigate → Arrive → Pickup → Scan items → Photos/Damage/Signature → Leave → Deliver → Final photos/Signature → Complete → Finish Work.
- **Note:** Actions must happen per stop, not just per load. The driver should only see items assigned to the specific stop they are at.

### 3.6 Warehouse / Yard Management Panel
**Purpose:** Manages stock, cars, freight, yard locations, warehouse zones, holding areas, load lanes, scanning, and movement history.
- **Layout:** Split layout (Left: Stock/item table | Centre: Yard/Warehouse map | Right: Selected item details).
- **Fields (Car Carrying):** VIN, Rego, Stock number, Make/model, Yard location, Load lane, Destination, Customer, Status.
- **Fields (General Freight):** Item number, Pallet count, Weight, Dimensions, Barcode/QR, Zone, Aisle/bin, Customer, Destination, Status.
- **Note:** Cars/items must exist as assets independent of loads. Yard/warehouse movements must be tracked even before the item is assigned to a load.

### 3.7 Yard / Warehouse Attendant Panel
**Purpose:** Mobile-first panel for staff physically scanning, moving, loading, and confirming items.
- **Mobile Layout:** Start/Finish Work, Assigned tasks, Scan button. Cards for Move item, Scan in/out, Load lane assignment, Report issue.
- **Actions:** Scan VIN/Barcode/QR, Scan In/Out, Move to Location/Load Lane, Confirm Loaded/Unloaded, Upload Proof Photo, Report Damage/Missing.
- **Note:** Simple, fast, PDA/mobile-friendly. The attendant does not need full admin access.

### 3.8 Accounts Panel
**Purpose:** Manages invoice review, sending, payments, payroll, contractor pay, expenses, GST/PAYG, and P&L.
- **Sidebar:** Accounts Dashboard, Invoice Review, Sent Invoices, Payments, Payroll, Contractor/Employee Pay, Expenses, GST/PAYG, P&L, Vehicle Costs, Reports.
- **Invoice Table:** Invoice number, Customer, Load ID, Items, Amount, GST, Status, Due date.
- **Actions:** Review/Approve/Send Invoice, Record Payment, Process Payroll, Approve AI Receipt, View Load Profit, View P&L, Configure billing/pay rates.
- **Note:** Invoices must be created per customer and reviewed before sending. Worker pay must be separate from customer billing.

### 3.9 Customer Panel
**Purpose:** Customers can view their own jobs, track deliveries, access documents, view invoices, and submit load requests.
- **Sidebar:** Dashboard, My Loads, Track Delivery, Documents, Invoices, Payments, Load Requests, Support, Settings.
- **Dashboard:** Active/Delivered jobs, Pending/Paid invoices, Open requests.
- **Note:** Customers should only see their own loads, invoices, and documents. They must not see other customers or internal company financials.

---

## 5. Final Developer Note

> [!TIP]
> The platform must feel like a live logistics operating system, not just an admin dashboard. 
> Every screen should clearly answer:
> - What needs to move?
> - Where is it now?
> - Who is responsible?
> - What is the next action?
> - Has it been delivered?
> - Has it been invoiced?
> - Has the worker been paid?
