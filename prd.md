# Product Requirement Document (PRD)
## Hero Logistics — Enterprise SaaS Logistics OS & Multi-Tenant Platform

---

## 1. Executive Summary & Vision

**Hero Logistics** is a next-generation, multi-tenant enterprise Logistics Operating System (OS) designed for freight carriers, 3PL logistics providers, dispatchers, warehouse managers, fleet operators, drivers, and shippers. The platform unifies end-to-end supply chain execution, real-time GPS fleet telemetry, AI-assisted dispatching, warehouse management (WMS), yard operations, automated invoicing & payroll, and white-label tenant governance into a single cohesive cloud platform.

### Key Objectives
* **Unified Logistics Ecosystem:** Eliminate fragmented software stacks by combining TMS, WMS, YMS, ELD, CRM, and ERP accounting into one seamless platform.
* **Multi-Tenant SaaS Architecture:** Enable Super Admins to provision isolated tenant workspaces, manage subscription tiers (Starter, Professional, Enterprise, Custom), enforce licensing limits, and customize white-label branding.
* **Role-Based Portals:** Deliver 9 specialized, high-performing web and mobile interfaces tailored for specific operational personas.
* **Real-time Visibility & Automation:** Provide live GPS tracking, automated driver load assignments, instant POD collection, dynamic rate calculations, and automated invoice/payroll processing.

---

## 2. Platform Architecture & Multi-Tenancy

### 2.1 Multi-Tenant Isolation
* **Tenant Workspace Model:** Every carrier/company operates in an isolated SaaS workspace with dedicated data scoping (`#TEN-XXXX`).
* **Licensing & Capacity Limits:** Dynamic enforcement of active user limits, driver capacity, fleet vehicle counts, branch limits, and storage quotas based on active plans.
* **White-Label Engine:** Custom domain routing (`cname`), branded headers/logos, customizable primary accent colors, and custom PDF templates per tenant.

### 2.2 Role-Based Access Control (RBAC)
The system supports strict granular permissions across 9 core roles:
1. `Super Admin` — Platform owner & licensing manager
2. `Sales Manager` — CRM leads, trials & client onboarding
3. `Company Admin` — Tenant business owner & fleet admin
4. `Dispatcher` — Load planner & real-time fleet controller
5. `Driver` — Mobile fleet operator & ELD compliance
6. `Warehouse Manager` — Inbound/outbound stock & inventory controller
7. `Yard Attendant` — Gate scan, trailer movements & lane management
8. `Accounts Manager` — Invoices, payroll, expenses, GST/PAYG & PnL
9. `Shipper / Customer` — Self-service load booking, tracking & POD download

---

## 3. Product Scope & Detailed Personas / Portals

```
               ┌─────────────────────────────────────────┐
               │    Hero Logistics Enterprise OS        │
               └────────────────────┬────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
 ┌─────┴──────┐               ┌─────┴──────┐              ┌──────┴─────┐
 │  SaaS &    │               │  Fleet &   │              │ Warehouse  │
 │ Governance │               │ Operations │              │ & Finance  │
 └─────┬──────┘               └─────┬──────┘              └──────┬─────┘
       │                            │                            │
 ├─ Super Admin Portal        ├─ Company Admin Console     ├─ WMS Manager Portal
 ├─ Sales CRM & Trials        ├─ Dispatcher Terminal       ├─ Yard Attendant App
 └─ Shipper Customer Portal   └─ Driver Mobile App         └─ Accounts & Payroll
```

---

## 4. Detailed Module Specifications

### 4.1 Super Admin Portal (`/admin/*`)
* **Platform Dashboard:** Live SaaS MRR/ARR metrics, active vs trial tenant counts, platform health indicators (API, DB, Storage, AI jobs), and real-time audit feed.
* **Tenant Companies Management:** Provision new SaaS tenants (`#TEN-1`), update plan tiers, inspect workspace resources (Users, Drivers, Fleet, Loads), suspend/reactivate licenses, and simulate company login sessions.
* **Subscriptions & Licensing Plans:** Manage plan tiers (Starter, Professional, Enterprise, Custom Enterprise), monthly/annual pricing, user/driver thresholds, feature entitlements, promos/coupons, and overage billing settings.
* **Feature Access Matrix:** Enable/disable global system feature gates (`feat-base-shell`, `feat-ops-map`, `feat-drivers-eld`, `feat-dispatch-board`, `feat-white-labeling`, `feat-crm-leads`, etc.) with plan defaults and tenant manual overrides.
* **White-Label Customizer:** Custom domain (CNAME) manager, logo uploaders (Light/Dark/Favicon), accent color palette builder, PDF manifest/invoice templates, email SMTP envelope customizer, and login panel overrides.
* **Support Tickets & System Audit:** Ticket queue assignment (L1/L2/L3), resolution notes, and immutable system audit logs recording operator IP, timestamp, and actions.

### 4.2 Sales & CRM Portal (`/sales/*`)
* **Sales Command Dashboard:** Pipeline deal value, lead conversion rates, demo booking schedule, active trial monitor, and revenue forecasting.
* **Lead Tracker & Pipeline Board:** Drag-and-drop deal stage management (New Lead, Demo Scheduled, Proposal Sent, Trial Active, Closed Won).
* **Trial Management & Handover:** Monitor trial expiry countdowns (e.g. 14-day trials), extend trial durations, convert trial tenants to paid subscriptions, and initiate onboarding handover workflows.

### 4.3 Company Admin Console (`/company-admin/*`)
* **Command Centre:** Unified operational overview of active loads, available drivers, online vehicles, warehouse stock summary, and daily revenue.
* **Fleet & Asset Management:** Vehicle registry (Semi-trucks, Flatbeds, Refrigerated Trailers), maintenance schedules, registration renewals, inspection logs, and asset assignment.
* **Drivers & Roster Management:** Driver profiles, CDL license tracking, medical clearance records, safety checklists, and roster scheduling.
* **Branches & Depot Control:** Multi-terminal branch setup (e.g. Chicago HQ, LA Depot), branch manager assignment, and regional resource allocation.

### 4.4 Dispatcher Terminal (`/dispatcher/*`)
* **Interactive Dispatch Board:** Drag-and-drop load assignment interface mapping loads to available drivers and trucks.
* **Live GPS Fleet Monitor:** Real-time map displaying vehicle telemetry, speed, route progress, geofence arrivals, and delay alerts.
* **Load Inbox & Booking Requests:** Review inbound shipper load requests, generate rate quotes, issue Rate Confirmations, and dispatch driver manifests.
* **Communication Depot:** Real-time chat channel connecting dispatchers with drivers and customers.

### 4.5 Driver Mobile App (`/driver/*`)
* **Active Run & Navigation:** Turn-by-turn route overview, pickup/delivery instructions, special handling notes, and arrival pings.
* **Digital Proof of Delivery (POD):** E-signature capture, photo attachment of delivered freight/pallets, and instant POD sync to customer portal.
* **Safety Checklists & HOS/ELD:** Pre-trip & post-trip inspection checklists, hours of service logging, and fatigue management pings.
* **Offline Sync Queue:** Store trip events, signature captures, and photos locally when offline, automatically syncing upon network restoration.
* **Expense & Trailer Swap:** Fuel receipt uploads, toll expense logging, and trailer drop-and-hook recording.

### 4.6 Warehouse Management System (WMS) (`/warehouse/*`)
* **Inbound Receiving:** Scan inbound shipments, generate item barcodes/labels, record damaged items, and assign staging locations.
* **Current Stock & Inventory Search:** Real-time aisle/bay/rack slotting, stock quantity search, and lot/serial number tracking.
* **Movements & Stock Transfers:** Inter-aisle stock transfers, replenishment alerts, and warehouse heatmaps.
* **Outbound Dispatch & Load Lanes:** Staging outbound pallets into assigned load lanes, verifying cross-dock transfers, and loading confirmation.

### 4.7 Yard & Gate Attendant Terminal (`/yard/*`)
* **Yard Overview & Map:** Live visual mapping of yard bays, trailer locations, and dock door statuses (Occupied, Empty, Loading, Unloading).
* **Gate Check-In & Check-Out:** Fast QR/barcode scanning of arriving/departing trucks, driver license verification, and seal number checks.
* **Yard Movements & Work Status:** Assign yard hostlers to move trailers between parking slots and dock doors.
* **Incident Reporting:** Log yard damages, unauthorized access, or equipment breakdowns with photo logs.

### 4.8 Accounts & Financials Portal (`/accounts/*`)
* **Invoicing & Ledger:** Automated invoice generation from completed loads, review pending invoices, send digital receipts, and track overdue accounts.
* **Payroll & Contractor Settlements:** Process driver mileage/hourly pay, contractor revenue splits, deduction management, and paystub generation.
* **Expenses & Vehicle Cost Audit:** Expense categorization (Fuel, Maintenance, Tolls, Insurance), vehicle cost-per-mile analysis, and tax reporting (GST / PAYG).
* **Profit & Loss (P&L) Analytics:** Real-time gross margin charts, operating revenue vs cost breakdowns, and financial export reports.

### 4.9 Shipper / Customer Portal (`/customer/*`)
* **Self-Service Load Booking:** Create new freight requests, select trailer types, specify pickup/dropoff windows, and obtain instant quote estimates.
* **Live Shipment Tracking:** Interactive map tracking assigned loads with real-time ETA updates.
* **Documents & Invoices:** View, download, and store signed Proof of Delivery (POD) documents, Bills of Lading (BOL), and billing invoices.
* **Dispatcher Direct Chat & Support:** Live chat interface with assigned dispatchers and support ticket management.

---

## 5. Technology Stack & Infrastructure

| Component | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19 (Vite 8, ES Modules) |
| **Routing** | React Router DOM v7 |
| **Styling & Theme** | Vanilla CSS + TailwindCSS v4, CSS Custom Properties |
| **Icons & Visuals** | Lucide React, React Icons |
| **Maps & Telemetry** | Leaflet, React Leaflet (Interactive OpenStreetMap) |
| **Charts & Analytics** | Recharts |
| **Sliders & Motion** | Swiper, Framer Motion |
| **Backend Runtime** | Node.js (REST API / Microservices) |
| **Database** | PostgreSQL / MongoDB (Multi-Tenant Schemas) |

---

## 6. Non-Functional Requirements (NFRs)

1. **Performance & Speed:** Initial page load under 1.5s; map rendering frame rate at 60 FPS; seamless state updates.
2. **Security & Data Isolation:** Strict tenant ID validation on every API request; encrypted payload storage; HTTPS enforcement.
3. **Reliability & Offline Capability:** LocalStorage / IndexedDB fallback for Driver Mobile App during connectivity loss.
4. **Usability & Accessibility:** Modern Dark/Light glassmorphism UI, intuitive navigation, high contrast text, and responsive mobile-first views for driver/yard portals.

---

## 7. Future Enhancement Roadmap

* 🤖 **AI Autonomous Dispatcher:** Predictive route optimization matching loads to closest drivers based on HOS capacity.
* 📦 **IoT Telemetry Sensor Integration:** Live temperature and humidity sensors for cold-chain refrigerated trailers.
* 💳 **Automated Payment Gateway Connections:** Native Stripe, PayPal, and Plaid ACH integrations for instant invoice settlement.
* 📄 **OCR Document Parser:** Automatic data extraction from scanned paper Bills of Lading (BOL) and driver receipts.


# Hero Logistics Enterprise Suite
# Product Requirements Document (PRD)

Version: 1.0
Module: Super Admin Portal
Section: Overview Dashboard
Status: Draft
Priority: Critical
Access Level: Super Admin

---

# 1. Module Overview

## Module Name

Super Admin Dashboard

## Description

The Super Admin Dashboard is the central command center of the Hero Logistics Enterprise SaaS Platform. It provides a complete operational overview of the entire multi-tenant system, including tenant companies, subscriptions, revenue, platform health, AI services, billing, support tickets, analytics, and administrative actions.

The dashboard enables platform owners to monitor business performance, manage SaaS tenants, provision new companies, control licensing, monitor infrastructure health, and perform administrative actions from a single interface.

---

# 2. Business Goal

Provide one centralized dashboard that allows the platform owner to

• Monitor platform health
• Monitor SaaS revenue
• Monitor tenant activity
• Manage subscriptions
• Manage companies
• Review billing
• Review AI usage
• Track support tickets
• Monitor infrastructure
• Perform administrative actions quickly

---

# 3. User Role

Primary User

Super Admin

Permissions

✔ Full Platform Access

✔ Create Company

✔ Suspend Company

✔ Reactivate Company

✔ Manage Plans

✔ Login As Tenant

✔ View Revenue

✔ Configure Features

✔ Configure White Label

✔ Billing Management

✔ User Management

✔ Security Management

✔ Audit Logs

✔ AI Controls

---

# 4. Navigation

Sidebar

• Dashboard

• Companies

• Subscriptions

• Membership Plans

• Feature Access

• White Label

• Support Tickets

• Billing

• System Analytics

• Inter Company Transfers

• AI Controls

• User Management

• Settings

---

# 5. Dashboard Layout

The dashboard consists of the following sections.

1. Header

2. KPI Cards

3. Revenue Chart

4. Tenant Overview Table

5. Platform Actions

6. Platform Health Center

7. Subscription Monitoring

8. Recent Platform Activity

9. Provision New SaaS Tenant

10. Suspend License

11. Reactivate Company

12. Simulate Login

13. Create Plan

14. Edit Plan

15. Change Subscription

16. Enable Feature

17. Disable Feature

18. White Label Branding

19. Support Tickets

20. Tenant Workspace Inspector

---

# 6. Header Section

Display

Super Admin

Overview

Description

Configure global licensing rules, audit tenant margins, and resolve support tickets.

Button

Export Report

---

# 7. KPI Cards

The dashboard displays real-time platform statistics.

Card 1

Title

Active Companies

Value

4

Description

SaaS instances online

Status

Stable

---

Card 2

Title

Trial Companies

Value

2

Description

SaaS trial instances

Indicator

+1 MoM

---

Card 3

Title

Paid Companies

Value

3

Description

Subscribed paying contracts

Status

Stable

---

Card 4

Title

Monthly Revenue

Value

$42,910

Description

Platform cash stream baseline

Growth

+4%

---

Card 5

Title

Failed Payments

Value

1

Description

Payment gateway errors

Status

0 alerts

---

Card 6

Title

Support Tickets

Value

2

Description

Requires administrative response

Status

Alert

---

Card 7

Title

Active Users

Value

118

Description

Active platform users

Growth

+3 Active

---

Card 8

Title

Platform Usage

Value

14.2%

Description

AWS Node Limits

Status

Stable

---

# 8. Revenue Analytics

Component

MRR Revenue Timeline

Chart Type

Line Chart

XAxis

January

February

March

April

May

June

YAxis

Revenue (USD)

Purpose

Display monthly recurring revenue trend.

---

# 9. Tenant Overview

Description

Displays all registered tenant companies.

Table Columns

Company

Subscription Plan

Status

Active Users

Monthly Revenue

Trial Expiry

Last Login

Actions

Actions

View

Suspend

Login As

Billing

Sorting

Enabled

Search

Enabled

Pagination

Enabled

Column Visibility

Supported

CSV Export

Supported

Excel Export

Supported

PDF Export

Supported

---

# 10. Platform Actions

Quick administrative workflows.

Actions

Add Company

Suspend Company

Reactivate Company

Login As Company

Create Plan

Edit Plan

Change Subscription

Enable Feature

Disable Feature

White Label

Export Report

---

# 11. Platform Health Center

System Status

API Health

99.98%

Database Health

Synced

Storage Health

52.3% Free

Queue Health

0 Pending

AI Processing Health

Active

Usage Metrics

Active Sessions

42

Requests Per Minute

1250 RPM

Storage Usage

4.78 TB / 10 TB

AI Jobs

14050

Open Tickets

2

High Priority

1

Waiting Customer

1

Waiting Internal

1

Quick Actions

Open Ticket

Assign Ticket

Resolve Ticket

---

# 12. Subscription Monitoring

Displays

Active Plans

Expiring Plans

Overdue Payments

Upgrade Opportunities

Quick Actions

Renew

Upgrade

Change Subscription

---

# 13. Recent Platform Activity

Purpose

Displays latest administrative events.

Example

Company Created

Plan Changed

Subscription Upgraded

Trial Converted

Billing Updated

Login Activity

Each activity contains

Timestamp

Operator

Company

Description

---

# 14. Permissions

Only Super Admin can access this module.

Unauthorized users must receive

403 Forbidden

No menu visibility

No API access

---

# 15. Business Rules

• KPI cards refresh automatically every 60 seconds.

• Revenue charts use live billing data.

• Only Active companies appear by default.

• Trial companies are highlighted.

• Suspended companies cannot login.

• Login As generates audit logs.

• Export Report respects active filters.

• Every administrative action creates an audit log.

---

# 16. API Requirements

GET /api/super-admin/dashboard

GET /api/super-admin/platform-health

GET /api/super-admin/revenue

GET /api/super-admin/tenant-overview

GET /api/super-admin/recent-activity

POST /api/super-admin/export

---

# 17. Database Tables

companies

subscriptions

users

plans

billing

payments

support_tickets

audit_logs

system_metrics

feature_access

white_label

---

# 18. Acceptance Criteria

✅ Dashboard loads under 2 seconds.

✅ KPI values are accurate.

✅ Charts render correctly.

✅ Search and filters work.

✅ Export functions generate valid files.

✅ Audit logs record all actions.

✅ Unauthorized users cannot access dashboard.

✅ Responsive layout works on desktop, tablet, and mobile.

---

# Super Admin → Companies

## Module Purpose
- Manage all SaaS tenant companies from a single interface.
- Provision new tenant workspaces.
- Monitor company status, subscription, usage, and activity.
- Perform administrative actions like suspend, reactivate, billing, and login as tenant.

---

# User Role
- Super Admin only

---

# Permissions
- View Companies
- Create Company
- Edit Company
- Suspend Company
- Reactivate Company
- Delete Company
- Login As Company
- View Billing
- View Users
- View Branches
- View Fleet
- View Loads
- View Support Tickets
- View Audit Logs
- Export Data

---

# Header
- Page Title: Companies
- Description
- Export Report Button
- Provision Tenant Button

---

# KPI Cards

## Total Companies
- Display total registered tenants.

## Active Companies
- Display active companies.

## Trial Companies
- Display trial companies.

## Suspended Companies
- Display suspended companies.

## Expiring This Month
- Companies whose trial expires this month.

## Monthly Revenue
- Total MRR generated.

## Annual Revenue
- ARR calculation.

## Active Users
- Total users across all companies.

## Total Drivers
- Total registered drivers.

## Total Loads
- Total active loads.

## Storage Usage
- Current storage usage.

---

# Search

- Search by Company Name
- Search by Company ID
- Search by Email
- Search by Account Manager

---

# Filters

- Status
- Subscription Plan
- Trial
- Country
- Created Date
- Last Login
- Account Manager

---

# Export

- CSV
- Excel
- PDF

---

# Company Table

Columns

- Company Name
- Company ID
- Subscription Plan
- Status
- Branches
- Users
- Drivers
- Fleet Vehicles
- Active Loads
- Monthly Revenue
- Last Login
- Trial Expiry
- Created Date
- Account Manager
- Actions

---

# Actions

- View
- Edit
- Suspend
- Reactivate
- Login As
- Billing
- Tenant Inspector

---

# Provision New SaaS Tenant

Fields

- Company Name
- Workspace Manager Email
- Workspace Manager Password
- Subscription Plan

Buttons

- Finalize Setup
- Cancel

Validation

- Company name required.
- Email unique.
- Password minimum 8 characters.
- Subscription mandatory.

System Actions

- Create Workspace
- Create Database
- Create Company Admin
- Assign Subscription
- Generate Audit Log
- Send Welcome Email

---

# Suspend Company

Fields

- Select Company
- Reason
- Confirmation

Business Rules

- Only active companies can be suspended.
- Company users cannot login after suspension.
- Billing remains active.
- Audit log generated.

---

# Reactivate Company

Fields

- Select Company

Business Rules

- Only suspended companies allowed.
- Previous subscription restored.
- Login enabled.
- Audit log generated.

---

# Login As Company

Purpose

Allow Super Admin to access tenant workspace.

Rules

- Read audit log.
- Record timestamp.
- Record IP.
- Record operator.
- Session expires automatically.

---

# Tenant Workspace Inspector

Tabs

## Overview
- Company Information
- Account Manager
- Region
- Joined Date
- Last Login
- Active Users
- Drivers
- Fleet
- Branches

Actions

- Suspend Workspace
- Delete Workspace

---

## Subscription

Display

- Current Plan
- Billing Rate
- Billing Cycle
- Renewal Date
- Trial Expiry

---

## Users

Display

- Name
- Email
- Role
- Status

Actions

- View
- Suspend
- Reset Password

---

## Branches

Display

- Branch Name
- Location
- Staff Count

---

## Fleet

Display

- Vehicle Number
- Vehicle Type
- Status

---

## Loads

Display

- Load Number
- Route
- Status

---

## Billing

Display

- Monthly Revenue
- Annual Projection
- Billing Cycle
- Auto Renewal

Invoices

- Paid
- Draft
- Sent
- Overdue

Actions

- View Invoice
- Download PDF

---

## Support Tickets

Display

- Ticket Number
- Subject
- Priority
- Status

Actions

- View
- Assign
- Resolve

---

## Feature Access

Display

- Feature Name
- Status

Actions

- Enable
- Disable

---

## Audit Log

Display

- Action
- User
- Timestamp
- IP Address
- Description

---

# Business Rules

- Company ID must be unique.
- One active subscription per company.
- Trial automatically expires.
- Suspended companies cannot login.
- Deleted company cannot be recovered.
- Login As must generate audit logs.
- Billing always linked to subscription.
- Storage limits depend on subscription.
- Driver limits depend on plan.
- User limits depend on plan.

---

# Notifications

- Company Created
- Company Suspended
- Company Reactivated
- Subscription Updated
- Trial Expiring
- Billing Failed

---

# Validation Rules

- Required fields mandatory.
- Email unique.
- Password complexity required.
- Company name unique.
- Subscription required.
- Plan must exist.

---

# APIs

GET /companies

GET /companies/{id}

POST /companies

PUT /companies/{id}

DELETE /companies/{id}

POST /companies/suspend

POST /companies/reactivate

POST /companies/login-as

GET /companies/{id}/billing

GET /companies/{id}/users

GET /companies/{id}/loads

GET /companies/{id}/fleet

GET /companies/{id}/branches

GET /companies/{id}/audit

---

# Database Tables

companies

company_users

subscriptions

subscription_plans

branches

fleet

loads

billing

invoices

support_tickets

feature_access

audit_logs

storage_usage

---

# Audit Logs

Log

- Company Created
- Company Updated
- Company Deleted
- Company Suspended
- Company Reactivated
- Login As
- Billing Updated
- Subscription Changed
- User Added
- User Removed

Store

- User
- Timestamp
- IP Address
- Browser
- Old Value
- New Value

---

# Security

- RBAC enabled.
- JWT authentication.
- MFA support.
- Session timeout.
- Login audit.
- IP logging.
- Activity tracking.

---

# Error States

- Company Not Found
- Subscription Missing
- Invalid Plan
- Duplicate Company
- Duplicate Email
- Permission Denied
- Server Error

---

# Success Messages

- Company created successfully.
- Company updated successfully.
- Company suspended successfully.
- Company reactivated successfully.
- Login session started.
- Billing updated successfully.

---

# Acceptance Criteria

- Company CRUD working.
- Search working.
- Filters working.
- Export working.
- Tenant Inspector working.
- Suspend/Reactivate working.
- Login As working.
- Billing visible.
- Users visible.
- Fleet visible.
- Branches visible.
- Loads visible.
- Audit logs generated.
- RBAC enforced.
- Responsive UI.
- Performance <2 seconds.


# Super Admin → Subscriptions

## Module Purpose
- Manage all tenant subscriptions.
- Monitor active, trial, suspended, and expired subscriptions.
- Track MRR, ARR, renewals, payments, and subscription lifecycle.
- Upgrade, downgrade, renew, suspend, or cancel subscription plans.

---

# User Role
- Super Admin

---

# Permissions
- View Subscriptions
- Create Subscription
- Edit Subscription
- Upgrade Plan
- Downgrade Plan
- Renew Subscription
- Suspend Subscription
- Resume Subscription
- Cancel Subscription
- View Billing
- View Payment History
- Export Reports

---

# Header
- Page Title: Subscriptions
- Description
- Export Report Button

---

# KPI Cards

## Active Subscriptions
- Total active subscriptions.

## Trial Subscriptions
- Total trial subscriptions.

## Expiring Trials
- Trials expiring soon.

## Suspended Subscriptions
- Suspended or On-Hold subscriptions.

## Monthly Recurring Revenue (MRR)
- Current monthly revenue.

## Annual Recurring Revenue (ARR)
- Yearly projected revenue.

## Failed Payments
- Total failed payment transactions.

---

# Charts

## MRR Performance
- Monthly Revenue Trend
- Line Chart

## ARR Projection
- Annual Revenue Projection
- Area Chart

## Churn & Growth Analytics
- Upgrades
- Downgrades
- Churn Rate
- Subscription Growth

---

# Search

- Search by Company Name
- Search by Subscription ID

---

# Filters

- Plan
- Status
- Billing Cycle
- Auto Renewal
- Payment Status

---

# Subscription Table

Columns

- Subscription ID
- Company
- Plan
- Status
- Billing Period
- Start Date
- Next Renewal
- Monthly Amount
- Auto Renewal
- Actions

---

# Actions

- View Subscription
- Upgrade Plan
- Downgrade Plan
- Renew Subscription
- Suspend Subscription
- Resume Subscription
- View Billing
- View Ledger
- View Audit Logs

---

# Subscription Workspace Inspector

Tabs

## Overview
Display
- Subscription ID
- Company
- Status
- Assigned Plan
- Billing Period
- Start Date
- Auto Renewal
- Monthly MRR
- Annual Projection
- Next Renewal
- Payment Gateway

Actions
- Upgrade Plan
- View Ledger & Invoices

---

## Plan Details
Display
- Current Plan
- Version
- Features
- User Limits
- Driver Limits
- Fleet Limits
- Storage Limits

---

## Billing & Cycle
Display
- Monthly Amount
- Billing Cycle
- Renewal Date
- Auto Renewal
- Payment Method
- Invoice History

---

## Limits & Modules
Display
- Active Users
- Drivers
- Fleet
- Storage
- API Calls
- Enabled Modules

---

## Audit Log
Display
- Subscription Created
- Plan Changed
- Renewal
- Payment Success
- Payment Failed
- Suspension
- Reactivation

---

# Upgrade Subscription

Fields

- Select Company
- Current Plan
- New Plan
- Effective Date

Validation

- New plan must exist.
- Cannot downgrade automatically if restrictions apply.

Business Rules

- Calculate price difference.
- Update limits.
- Generate invoice.
- Create audit log.

---

# Downgrade Subscription

Business Rules

- Check current usage.
- Prevent downgrade if limits exceeded.
- Notify tenant.
- Create audit log.

---

# Renew Subscription

Business Rules

- Generate renewal invoice.
- Extend expiry date.
- Send confirmation email.
- Update billing records.

---

# Suspend Subscription

Business Rules

- Block tenant access.
- Keep billing history.
- Keep audit logs.
- Notify company admin.

---

# Resume Subscription

Business Rules

- Restore access.
- Restore plan features.
- Update subscription status.

---

# Validation Rules

- Company must exist.
- Plan must exist.
- Billing cycle required.
- Renewal date required.
- Auto renewal boolean only.

---

# Notifications

- Trial Expiring
- Subscription Renewed
- Subscription Suspended
- Subscription Reactivated
- Plan Upgraded
- Plan Downgraded
- Payment Failed
- Payment Successful

---

# APIs

GET /subscriptions

GET /subscriptions/{id}

POST /subscriptions

PUT /subscriptions/{id}

DELETE /subscriptions/{id}

POST /subscriptions/upgrade

POST /subscriptions/downgrade

POST /subscriptions/renew

POST /subscriptions/suspend

POST /subscriptions/resume

GET /subscriptions/{id}/billing

GET /subscriptions/{id}/audit

---

# Database Tables

subscriptions

subscription_plans

subscription_history

subscription_limits

billing

payments

payment_methods

renewals

audit_logs

companies

---

# Business Rules

- One active subscription per company.
- Plan determines feature access.
- Subscription controls user limits.
- Subscription controls driver limits.
- Subscription controls fleet limits.
- Subscription controls storage limits.
- Failed payments trigger alerts.
- Trial automatically converts or expires.
- Every change generates audit logs.

---

# Security

- Super Admin only.
- JWT authentication.
- RBAC validation.
- Audit logging enabled.
- IP logging enabled.

---

# Error States

- Subscription Not Found
- Invalid Plan
- Company Not Found
- Renewal Failed
- Payment Failed
- Permission Denied

---

# Success Messages

- Subscription created successfully.
- Subscription updated successfully.
- Subscription upgraded successfully.
- Subscription renewed successfully.
- Subscription suspended successfully.
- Subscription resumed successfully.

---

# Acceptance Criteria

- Subscription CRUD working.
- Search working.
- Filters working.
- Charts working.
- Inspector working.
- Upgrade working.
- Downgrade working.
- Renew working.
- Suspend working.
- Resume working.
- Billing integration working.
- Audit logs generated.
- Responsive UI.
- Performance under 2 seconds.


# Super Admin → Membership Plans

## Module Purpose
- Create and manage SaaS subscription plans.
- Configure licensing rules, pricing, limits, and features.
- Control plan lifecycle and versioning.
- Manage coupons, trials, billing, migrations, and payment gateways.

---

# User Role
- Super Admin

---

# Permissions
- View Plans
- Create Plan
- Edit Plan
- Clone Plan
- Version Plan
- Publish Plan
- Deprecate Plan
- Delete Draft Plan
- Manage Coupons
- Manage Trial
- Manage Payment Gateways
- Manage Billing Ledger
- Export Reports

---

# Header
- Page Title: Membership Plans
- Description
- Export Report
- Create Plan

---

# KPI Cards

## Total Licensing Plans
- Total registered plans

## Active Subscribers
- Total paying subscribers

## Trial Subscribers
- Total trial tenants

## Monthly Revenue (MRR)
- Current recurring revenue

## Annual Revenue (ARR)
- Projected annual revenue

## Upgrade Rate
- Percentage of upgraded tenants

## Downgrade Rate
- Percentage of downgraded tenants

## Churn Rate
- Monthly churn percentage

## Growth Index
- Overall SaaS growth score

---

# Billing Toggle

- Monthly Billing
- Annual Billing (15% Discount)

---

# Plans Grid

Each Plan Card Displays

- Plan Name
- Version
- Status
- Monthly Price
- Annual Price
- Trial Days
- Active Users Limit
- Driver Limit
- Fleet Limit
- Storage Limit
- Modules Included
- Subscribers Count
- Monthly Revenue
- Growth Percentage

Actions

- Configure
- Clone Plan
- Publish
- Deprecate

---

# Search

- Search by Plan Name
- Search by Plan ID

---

# Filters

- Status
- Billing Type
- Version
- Published/Draft

---

# Export

- CSV
- Excel
- PDF

---

# Plans Registry Table

Columns

- Plan ID
- Plan Name
- Version
- Status
- Monthly Price
- Annual Price
- Trial Days
- Subscribers
- Monthly Revenue
- Created By
- Last Updated
- Actions

---

# Plan Actions

- View
- Configure
- Clone
- Publish
- Deprecate
- Version History
- Delete Draft

---

# Create New Plan Wizard

## Step 1 - Information

Fields

- Plan Name
- Version
- Lifecycle Status
- Description

Validation

- Plan Name Required
- Version Required
- Unique Version

Buttons

- Cancel
- Next

---

## Step 2 - Limits

Fields

- Max Users
- Max Drivers
- Max Fleet Vehicles
- Max Branches
- Storage Limit (GB)
- API Calls Limit

Rules

- 0 = Unlimited
- Positive numbers only

Buttons

- Back
- Next

---

## Step 3 - Features

Selectable Modules

- Dispatch
- Fleet
- GPS
- Driver App
- Warehouse
- CRM
- Customer Portal
- Billing
- AI Dispatch
- Reports
- API Access
- White Label
- Integrations

Buttons

- Back
- Next

---

## Step 4 - Billing

Fields

- Monthly Price
- Annual Price
- Trial Days
- Currency

Validation

- Amount > 0
- Trial Days >=0

Buttons

- Back
- Next

---

## Step 5 - Review

Display Summary

- Plan Info
- Limits
- Features
- Pricing

Buttons

- Save Draft
- Publish
- Back

---

# Configure Existing Plan

Editable

- Description
- Limits
- Features
- Pricing
- Trial Days
- Status

---

# Version Control

Display

- Current Version
- Release History
- Created By
- Release Date
- Changelog

Actions

- Compare Versions
- Rollback
- Publish Version

---

# Lifecycle Management

States

- Draft
- Published
- Deprecated
- Archived

Rules

- Published plans cannot be deleted.
- Draft plans can be deleted.
- Deprecated plans cannot accept new subscriptions.
- Existing subscribers continue until migrated.

---

# Feature Matrix

Columns

- Feature
- Starter
- Professional
- Enterprise
- Custom Enterprise

Rows

- Dispatch
- Fleet
- GPS
- Driver App
- AI Dispatch
- Reports
- API
- White Label
- CRM
- Customer Portal
- Integrations

Limits

- Users
- Drivers
- Fleet
- Branches
- Storage
- API Calls

---

# Coupons & Promotions

Display

- Promo Code
- Campaign Name
- Discount Type
- Discount Value
- Redemption Count
- Maximum Usage
- Expiry Date
- Status

Actions

- Add Coupon
- Edit Coupon
- Disable Coupon
- Delete Coupon

Coupon Types

- Percentage Discount
- Fixed Discount
- Trial Extension

---

# Trial Management

Display

- Company
- Admin
- Trial Expiry
- Days Remaining
- Usage Limits
- Status

Actions

- Convert To Paid
- Extend Trial
- Notify Customer

Business Rules

- Auto notify before expiry.
- Expired trial becomes Hold.
- Manual conversion supported.

---

# Revenue Intelligence

Charts

- MRR Timeline
- ARR Projection
- Subscriber Mix
- Customer Lifetime Value
- CAC
- Churn
- Net Revenue Retention

---

# Overage Billing

Track

- User Limit Exceeded
- Driver Limit Exceeded
- Storage Exceeded
- API Calls Exceeded

Actions

- Generate Invoice
- Upgrade Suggestion
- Notify Company

---

# Payment Gateways

Supported

- Stripe
- PayPal
- ACH
- Wire Transfer

Settings

- API Keys
- Secret Keys
- Routing
- Payment Terms

Actions

- Save Configuration
- Test Connection

---

# Bulk Migration

Fields

- Source Plan
- Destination Plan

Rules

- Validate Limits
- Update Features
- Generate Audit Logs
- Notify Companies

---

# Billing Ledger

Display

- Invoice Number
- Company
- Plan
- Billing Period
- Status
- Payment Method
- Amount

Actions

- View Invoice
- Download Receipt
- Send Email

---

# Audit Center

Display

- Action
- Operator
- Timestamp
- IP Address
- Details

Tracked Events

- Plan Created
- Plan Updated
- Plan Published
- Plan Deprecated
- Coupon Created
- Trial Converted
- Bulk Migration
- Gateway Updated

---

# Validation Rules

- Plan Name Unique
- Version Unique
- Monthly Price Required
- Annual Price Required
- Trial Days Positive
- Limits Positive
- Feature Dependency Validation

---

# Notifications

- Plan Published
- Plan Deprecated
- Trial Expiring
- Coupon Expiring
- Payment Gateway Error
- Bulk Migration Completed

---

# APIs

GET /plans

GET /plans/{id}

POST /plans

PUT /plans/{id}

DELETE /plans/{id}

POST /plans/clone

POST /plans/publish

POST /plans/deprecate

GET /plans/version-history

POST /plans/rollback

GET /plans/feature-matrix

POST /plans/coupons

GET /plans/trials

POST /plans/convert-trial

POST /plans/extend-trial

POST /plans/bulk-migration

GET /plans/billing-ledger

GET /plans/audit

---

# Database Tables

subscription_plans

plan_versions

plan_features

plan_limits

plan_pricing

plan_trials

plan_coupons

coupon_redemptions

bulk_migrations

billing_ledger

payment_gateways

audit_logs

---

# Business Rules

- One active published version.
- Draft editable.
- Published immutable.
- Version history maintained.
- Every update logged.
- Feature dependency validation.
- Coupons expire automatically.
- Trial conversion creates invoice.
- Bulk migration updates all tenants.

---

# Security

- Super Admin only.
- RBAC enforced.
- MFA supported.
- Audit logging mandatory.

---

# Error States

- Duplicate Plan
- Invalid Version
- Invalid Pricing
- Dependency Missing
- Migration Failed
- Coupon Invalid
- Payment Gateway Error

---

# Success Messages

- Plan created successfully.
- Plan updated successfully.
- Plan published successfully.
- Plan cloned successfully.
- Coupon created successfully.
- Trial converted successfully.
- Migration completed successfully.

---

# Acceptance Criteria

- Plan CRUD working.
- Wizard working.
- Version control working.
- Feature matrix working.
- Coupons working.
- Trial management working.
- Revenue analytics working.
- Overage billing working.
- Payment gateway configuration working.
- Bulk migration working.
- Billing ledger working.
- Audit center working.
- Responsive UI.
- Performance under 2 seconds.

# Super Admin → Feature Access

## Module Purpose
- Centralized management of all SaaS platform features.
- Control feature licensing by subscription plan.
- Register new platform modules.
- Manage feature dependencies.
- Configure company-level feature overrides.
- Monitor feature adoption and usage analytics.
- Maintain feature version history and audit logs.

---

# User Role

- Super Admin

---

# Permissions

- View Features
- Create Feature
- Edit Feature
- Delete Feature
- Clone Feature
- Enable Feature
- Disable Feature
- Configure Licensing
- Configure Company Overrides
- Manage Feature Versioning
- Export Feature Reports
- View Analytics
- View Audit Logs

---

# Header

- Page Title: Feature Access
- Description
- Export Report
- Create Feature Button

---

# KPI Cards

## Total Licensed Features
- Total registered platform features.

## Active Features
- Features currently enabled.

## Premium Tier Modules
- Premium-only modules.

## Premium License Adopters
- Companies using premium modules.

## Beta Modules
- Features in beta stage.

## License Utilization
- Percentage of licensed features in use.

## Assigned Today
- Newly assigned features.

## Updated This Month
- Features modified during current month.

---

# Tabs

- Dynamic Features Matrix
- Feature Usage Analytics
- Security & Audit Center

---

# Search

- Search Feature Name
- Search Feature ID

---

# Filters

- Category
- Status
- Licensing Type
- Plan
- Version

---

# Export

- CSV
- Excel
- PDF

---

# Feature Categories

Platform

Operations

Fleet

Drivers

Dispatch

Loads

Administration

API

Developer Tools

Billing

CRM

Customer Portal

Tracking

Warehouse

Finance

HR

Reports

Integrations

---

# Feature Registry Table

Columns

- Feature Name
- Feature ID
- Description
- Category
- Licensing Type
- Status
- Usage Count
- Companies
- Version
- Dependencies
- Actions

---

# Feature Actions

- View
- Configure
- Clone
- Enable
- Disable
- Delete
- Version History

---

# Register New Feature Wizard

## Step 1

Metadata

Fields

- Feature Name
- Unique Feature ID
- Description
- Category
- Licensing Type

Validation

- Required
- Unique Feature ID

Buttons

- Cancel
- Next

---

## Step 2

Plan Entitlements

Enable by default for

- Starter
- Professional
- Enterprise
- Custom Enterprise

Buttons

- Back
- Next

---

## Step 3

Dependencies

Fields

- Required Features
- API Dependency
- Database Dependency

Validation

- Circular dependency check

Buttons

- Back
- Save Feature

---

# Feature Configuration

Editable Fields

- Feature Name
- Description
- Category
- Licensing
- Status
- Version
- Dependencies
- API Load
- Storage Requirement

---

# Licensing Policy

Overview

Display

- Description
- Licensing Category
- Required Modules
- Estimated API Load
- Storage Capacity
- Performance Footprint
- Licensing Tier
- Feature Dependencies

---

# Company Overrides

Purpose

Grant or revoke feature access for individual companies.

Fields

- Company
- Override Type
- Reason

Override Types

- Force Enabled
- Force Disabled

Actions

- Create Override
- Edit Override
- Delete Override

Business Rules

- Override takes priority over plan.
- Every override generates audit log.

---

# Feature Analytics

Display

- Adoption Rate
- Monthly Growth
- Utilization
- Estimated Revenue
- Companies Using
- API Requests
- Storage Usage

Charts

- Adoption Trend
- Usage Trend
- Revenue Contribution

---

# Version Control

Display

- Current Version
- Previous Versions
- Published Date
- Published By
- Changelog

Actions

- Bump Version
- Publish
- Rollback

Validation

- Semantic Versioning

---

# Dynamic Feature Matrix

Columns

Starter

Professional

Enterprise

Custom Enterprise

Rows

All Features

Actions

- Enable
- Disable
- Compare Plans

---

# Feature Dependencies

Display

Required Modules

Dependent Modules

Dependency Graph

Validation

- Prevent disabling parent dependency.

---

# Security & Audit Center

Audit Logs

Display

- Action
- Feature
- Operator
- Timestamp
- IP Address
- Browser
- Details

Tracked Events

- Feature Created
- Feature Updated
- Feature Deleted
- Feature Enabled
- Feature Disabled
- Feature Cloned
- Version Published
- Company Override Created

---

# Validation Rules

- Feature Name Required
- Feature ID Unique
- Version Required
- Dependency Validation
- Licensing Required

---

# Notifications

- Feature Created
- Feature Updated
- Feature Disabled
- Feature Enabled
- Version Published
- Override Applied

---

# APIs

GET /features

GET /features/{id}

POST /features

PUT /features/{id}

DELETE /features/{id}

POST /features/clone

POST /features/enable

POST /features/disable

GET /features/analytics

GET /features/audit

POST /features/version

POST /features/rollback

POST /features/company-override

GET /features/matrix

---

# Database Tables

features

feature_versions

feature_dependencies

feature_categories

feature_overrides

feature_usage

feature_analytics

feature_permissions

audit_logs

companies

plans

---

# Business Rules

- Feature ID immutable after creation.
- Version history maintained.
- Parent dependency cannot be disabled.
- Overrides supersede plan settings.
- Disabled features hidden from tenant UI.
- Every change creates audit log.
- Usage analytics updated automatically.

---

# Security

- Super Admin access only.
- RBAC validation.
- MFA supported.
- Audit logging mandatory.
- IP tracking enabled.

---

# Error States

- Duplicate Feature ID
- Dependency Missing
- Invalid Version
- Override Conflict
- Feature Not Found
- Permission Denied

---

# Success Messages

- Feature created successfully.
- Feature updated successfully.
- Feature cloned successfully.
- Feature enabled successfully.
- Feature disabled successfully.
- Override applied successfully.
- Version published successfully.

---

# Acceptance Criteria

- Feature CRUD working.
- Registration wizard working.
- Feature matrix working.
- Company overrides working.
- Versioning working.
- Dependency validation working.
- Analytics working.
- Audit logs generated.
- Export working.
- Responsive UI.
- Performance under 2 seconds.

# Super Admin → White Label

## Module Purpose

- Allow Super Admin to fully customize tenant branding.
- Support White Label SaaS deployment.
- Manage custom domains and SSL.
- Configure themes, branding assets, emails, PDFs, login pages.
- Manage deployment pipeline and API integrations.

---

# User Role

- Super Admin

---

# Permissions

- View White Label
- Manage Branding
- Manage Themes
- Manage Domains
- Manage SMTP
- Manage PDF Templates
- Manage Login Page
- Manage Assets
- Deploy Branding
- Manage Security
- Manage API Integrations
- Export Audit Logs

---

# Header

- Page Title : White Label
- Export Report

---

# KPI Cards

## Active White Label Clients
- Total tenants using white-label branding.

## Active Custom Domains
- Total configured domains.

## Pending Deployments
- Waiting deployments.

## Branding Health Score
- Branding validation percentage.

## SSL Status
- SSL certificate health.

## Active Theme Version
- Current published theme version.

## Last Deployment
- Last successful deployment.

## Failed Deployments
- Failed deployment count.

## Audit Events Today
- Branding changes today.

---

# Navigation Tabs

- Overview
- Brand Config
- Theme Builder
- Domain Manager
- Communications
- PDF Customizer
- Login & Override
- Asset Library
- Deployment Timeline
- Security & Access
- API Integrations

---

# Overview

Display

- Theme Distribution
- Branding Adoption
- Build History
- Live Preview

Charts

- Theme Usage
- Branding Adoption
- Release Timeline

---

# Brand Configuration

Fields

- Platform Name
- Portal Name
- Short Name
- Company Logo (Light)
- Company Logo (Dark)
- Loader Animation
- Favicon
- Login Background
- Dashboard Background
- Email Logo
- Invoice Logo
- Manifest Logo
- Font Family
- Typography Style
- Button Radius

Actions

- Save Branding
- Reset Branding
- Preview

Validation

- Logo Required
- Supported PNG / SVG / JPG
- Max Upload Size
- Unique Platform Name

---

# Theme Builder

Display

- Theme Name
- Accent Color
- Sidebar Color
- Header Color
- Status
- Version

Actions

- Register Theme
- Clone Theme
- Publish Theme
- Delete Draft

Rules

- Only one Published theme.
- Draft editable.
- Published immutable.

---

# Domain Manager

Display

- Domain
- CNAME
- SSL Status
- DNS Status
- Health
- Redirect Rule

Actions

- Register Domain
- Renew SSL
- Delete Domain
- Verify DNS

Validation

- Valid Domain
- Unique Domain
- SSL Required

Business Rules

- Force HTTPS
- DNS verification mandatory.

---

# Communications

Sections

## SMTP

Fields

- SMTP Host
- SMTP Port
- Username
- Password
- Encryption

## Email Templates

Templates

- Welcome Email
- Reset Password
- Driver Invitation
- Company Invitation

Fields

- Subject
- Greeting
- HTML Content

Actions

- Save
- Send Test Email

## SMS

Fields

- Test Number

Actions

- Send Test SMS

Validation

- Valid Email
- Valid Phone

---

# PDF Customizer

Fields

- Header Text
- Footer Text
- Watermark
- QR Code
- Logo
- Signature Box

Actions

- Save Layout
- Preview PDF

Business Rules

- QR generated automatically.
- Variables supported.
- Multi-page footer.

---

# Login & Override

Fields

- Login Greeting
- Background Image
- Illustration Type
- Help Center URL

Toggle

- Hide Vendor Branding
- Hide Documentation Links
- Hide Footer
- Hide Copyright

Actions

- Save
- Preview

---

# Asset Library

Supported Assets

- Logos
- Images
- Backgrounds
- PDFs
- Icons
- Videos

Actions

- Upload
- Replace
- Delete
- Download

Validation

- Supported Formats
- File Size Limit

---

# Deployment Timeline

Display

- Version
- Build Number
- Release Date
- Released By
- Duration
- Status

Actions

- Deploy
- Rollback
- Compare Builds
- View Diff

Business Rules

- Only Published versions deployable.
- Rollback creates audit log.

---

# Security & Access

Sections

## MFA

Toggle

- Enabled
- Disabled

## Session Timeout

Fields

- Minutes

## Allowed IP

Multiple IP List

## Secrets

Store

- Backend Secret
- Webhook Token
- API Secret

Actions

- Add Secret
- Rotate Secret
- Delete Secret

Validation

- Encrypted Storage
- Hidden Values

---

# API Integrations

Supported

- Cloudflare
- AWS S3
- SendGrid
- Twilio
- Stripe
- Firebase

Display

- Status
- Health
- Last Sync

Actions

- Test Connection
- Reconnect
- Disconnect
- Save

---

# Live Preview

Modes

- Portal
- Email
- PDF
- Login

Purpose

Real-time preview before deployment.

---

# Audit Logs

Track

- Branding Updated
- Theme Published
- Domain Added
- SSL Renewed
- SMTP Updated
- Email Template Updated
- Login Updated
- Deployment Completed
- Rollback
- Secret Rotated

Fields

- User
- Timestamp
- IP
- Browser
- Details

---

# Search

- Search Assets
- Search Domains
- Search Themes
- Search Builds

---

# Export

- CSV
- PDF
- Audit Logs

---

# Validation Rules

- Platform Name Required
- Domain Unique
- SSL Mandatory
- Theme Name Unique
- Logo Required
- SMTP Required
- Secret Encrypted
- API Keys Required

---

# Notifications

- Deployment Completed
- Deployment Failed
- SSL Expiring
- Domain Verified
- SMTP Failed
- Theme Published
- Secret Rotated

---

# APIs

GET /white-label

GET /white-label/themes

POST /white-label/theme

PUT /white-label/theme

POST /white-label/publish

GET /white-label/domains

POST /white-label/domain

PUT /white-label/domain

DELETE /white-label/domain

POST /white-label/smtp

POST /white-label/email-template

POST /white-label/pdf

POST /white-label/login

POST /white-label/assets

POST /white-label/deploy

POST /white-label/rollback

POST /white-label/security

POST /white-label/api

GET /white-label/audit

---

# Database Tables

branding_settings

branding_assets

theme_versions

custom_domains

ssl_certificates

smtp_settings

email_templates

pdf_templates

login_settings

deployment_history

security_settings

api_integrations

audit_logs

---

# Business Rules

- One active published branding version.
- Branding deployment affects all assigned tenants.
- SSL required for custom domains.
- Theme changes require deployment.
- Every deployment logged.
- Secrets encrypted.
- API keys masked.
- Preview available before publish.

---

# Security

- RBAC enforced.
- MFA supported.
- Secrets encrypted.
- IP whitelist supported.
- Audit logging mandatory.

---

# Error States

- Invalid Domain
- SSL Verification Failed
- Deployment Failed
- SMTP Connection Failed
- Asset Upload Failed
- Theme Conflict
- Permission Denied

---

# Success Messages

- Branding saved successfully.
- Theme published successfully.
- Domain verified successfully.
- SMTP updated successfully.
- PDF template saved successfully.
- Deployment completed successfully.
- Rollback completed successfully.

---

# Acceptance Criteria

- Branding configuration working.
- Theme builder working.
- Domain management working.
- SMTP working.
- Email templates working.
- PDF customization working.
- Login customization working.
- Asset library working.
- Deployment pipeline working.
- Security configuration working.
- API integrations working.
- Live preview working.
- Audit logs generated.
- Responsive UI.
- Performance under 2 seconds.


# Super Admin → Support Tickets

## Module Purpose

- Manage all platform support tickets.
- Handle tenant issues from a centralized support desk.
- Assign tickets to support agents.
- Track SLA and response time.
- Resolve customer issues.
- Maintain complete communication history.

---

# User Role

- Super Admin
- Support Manager
- Support Agent (Limited Access)

---

# Permissions

- View Tickets
- Create Ticket
- Edit Ticket
- Assign Ticket
- Reply Ticket
- Resolve Ticket
- Reopen Ticket
- Close Ticket
- Delete Ticket
- Export Tickets

---

# Header

- Page Title : Support Tickets
- Export Report
- New Ticket

---

# KPI Cards

## Total Tickets
- Total tickets created.

## Open Tickets
- Tickets awaiting response.

## Resolved Tickets
- Successfully closed tickets.

## High Priority Tickets
- Urgent tickets.

## Average Response Time
- Average first response.

## Average Resolution Time
- Average ticket resolution.

## Pending Customer Reply
- Waiting on customer.

## Pending Internal Action
- Waiting on support staff.

---

# Search

- Ticket ID
- Company Name
- Subject
- Customer Name

---

# Filters

- Status
- Priority
- Category
- Company
- Assigned Agent
- Created Date
- Updated Date

---

# Export

- CSV
- Excel
- PDF

---

# Ticket Queue

Columns

- Ticket ID
- Company
- Subject
- Category
- Priority
- Status
- Assigned Agent
- Created Date
- Last Updated
- Actions

---

# Ticket Status

- New
- Open
- Assigned
- In Progress
- Waiting Customer
- Waiting Internal
- Resolved
- Closed
- Reopened

---

# Ticket Priority

- Low
- Medium
- High
- Critical

---

# Ticket Categories

- General Platform
- Billing
- Subscription
- Login
- User Management
- Dispatch
- Loads
- Fleet
- Drivers
- GPS
- AI
- API
- White Label
- Integrations
- Security
- Other

---

# Actions

- View
- Reply
- Assign
- Resolve
- Reopen
- Close
- Delete

---

# Create Ticket

Fields

- Company
- Category
- Priority
- Subject
- Description
- Attachment

Buttons

- Create Ticket
- Cancel

Validation

- Company Required
- Category Required
- Priority Required
- Subject Required
- Description Required

---

# Ticket Details

Display

- Ticket Number
- Company
- Customer
- Email
- Phone
- Subject
- Description
- Category
- Priority
- Status
- Assigned Agent
- Created Date
- Last Updated
- Attachments

---

# Conversation Timeline

Display

- Customer Message
- Support Reply
- Internal Notes
- Attachments
- Timestamp
- Sender

Actions

- Reply
- Edit Reply
- Delete Reply

---

# Ticket Assignment

Fields

- Ticket
- Support Agent
- Support Level

Support Levels

- L1 Support
- L2 Senior Specialist
- L3 Engineering
- Platform Administrator

Actions

- Assign
- Reassign

Business Rules

- Only one primary assignee.
- Reassignment logged.

---

# Ticket Response

Fields

- Reply Message
- Attachment

Actions

- Send Reply
- Save Draft

Validation

- Reply Required

---

# Resolve Ticket

Fields

- Resolution Notes

Actions

- Mark Resolved

Business Rules

- Customer notified automatically.
- Resolution logged.

---

# Close Ticket

Business Rules

- Only resolved tickets can close.
- Closed tickets become read-only.

---

# Reopen Ticket

Business Rules

- Only closed tickets.
- SLA restarts.
- Customer notified.

---

# Attachments

Supported

- PDF
- DOCX
- XLSX
- JPG
- PNG
- ZIP

Max Size

- 25 MB

Actions

- Upload
- Download
- Delete

---

# Internal Notes

Purpose

Support-only comments.

Visible To

- Super Admin
- Support Team

Not Visible To

- Customer

---

# SLA Management

Display

- SLA Target
- Remaining Time
- Breached
- Resolution Time

Rules

- High Priority = 4 Hours
- Medium = 8 Hours
- Low = 24 Hours

---

# Notifications

Customer

- Ticket Created
- Ticket Assigned
- Ticket Replied
- Ticket Resolved
- Ticket Closed

Support

- New Ticket
- Ticket Escalated
- SLA Warning
- Ticket Reopened

---

# Dashboard Widgets

- Open Tickets
- Today's Tickets
- SLA Breaches
- Tickets by Priority
- Tickets by Category
- Agent Workload
- Resolution Trend

---

# Reports

- Daily Ticket Report
- Monthly Ticket Report
- Agent Performance
- SLA Report
- Resolution Report
- Customer Satisfaction Report

---

# Audit Logs

Track

- Ticket Created
- Ticket Updated
- Ticket Assigned
- Ticket Reassigned
- Reply Added
- Reply Edited
- Ticket Resolved
- Ticket Closed
- Ticket Reopened
- Attachment Uploaded

Fields

- User
- Timestamp
- IP Address
- Browser
- Action
- Details

---

# Validation Rules

- Subject Required
- Description Required
- Valid Company
- Valid Category
- Valid Priority
- Attachment Size Limit
- Attachment Format Validation

---

# APIs

GET /support/tickets

GET /support/tickets/{id}

POST /support/tickets

PUT /support/tickets/{id}

DELETE /support/tickets/{id}

POST /support/tickets/reply

POST /support/tickets/assign

POST /support/tickets/resolve

POST /support/tickets/reopen

POST /support/tickets/close

POST /support/tickets/upload

GET /support/reports

GET /support/audit

---

# Database Tables

support_tickets

ticket_messages

ticket_assignments

ticket_attachments

ticket_categories

ticket_priorities

ticket_status

support_agents

sla_rules

ticket_audit_logs

notifications

companies

users

---

# Business Rules

- Ticket number auto-generated.
- SLA starts on ticket creation.
- Assignment required before resolution.
- Every action creates audit log.
- Closed tickets cannot be edited.
- Internal notes hidden from customer.
- Attachments virus scanned.
- Email notifications automatic.

---

# Security

- RBAC enabled.
- MFA supported.
- Attachment virus scanning.
- Audit logging mandatory.
- IP tracking enabled.

---

# Error States

- Ticket Not Found
- Invalid Company
- Invalid Attachment
- SLA Configuration Missing
- Permission Denied
- Internal Server Error

---

# Success Messages

- Ticket created successfully.
- Ticket assigned successfully.
- Reply sent successfully.
- Ticket resolved successfully.
- Ticket closed successfully.
- Ticket reopened successfully.

---

# Acceptance Criteria

- Ticket CRUD working.
- Search working.
- Filters working.
- Assignment working.
- Reply system working.
- Resolution workflow working.
- SLA tracking working.
- Notifications working.
- Reports working.
- Audit logs working.
- Responsive UI.
- Performance under 2 seconds.


# Super Admin → Billing

## Module Purpose

- Centralized platform billing management.
- Monitor all invoices and payments.
- Track Monthly Recurring Revenue (MRR).
- Track Annual Recurring Revenue (ARR).
- Manage failed payments and unpaid invoices.
- Generate invoices, receipts, tax reports, and billing analytics.

---

# User Role

- Super Admin
- Finance Admin (Read/Manage)
- Accounts Manager (Limited)

---

# Permissions

- View Billing Dashboard
- View Invoices
- Generate Invoice
- Regenerate Invoice
- Download Invoice
- Send Invoice
- View Payments
- View Failed Payments
- View Tax Reports
- Export Billing Reports
- Manage Payment Status
- Manage Refunds

---

# Header

- Page Title : Billing
- Export Report

---

# KPI Cards

## Total Revenue
- Total revenue collected across all companies.

## Monthly MRR
- Current Monthly Recurring Revenue.

## Annual ARR
- Annual projected revenue.

## Paid Invoices
- Successfully paid invoices.

## Unpaid Invoices
- Outstanding invoices.

## Failed Payments
- Failed payment attempts.

## Refunds Issued
- Completed refunds.

## Average Invoice Value
- Average invoice amount.

---

# Tabs

- Invoices
- Payments
- Failed Payments
- Tax / GST Summary

---

# Revenue Analytics

Charts

## Monthly Revenue Trend
- Line Chart

## Revenue by Plan
- Bar Chart

## Payment Status
- Pie Chart

## Monthly Collections
- Area Chart

---

# Search

- Invoice Number
- Company Name
- Transaction ID

---

# Filters

- Invoice Status
- Company
- Plan
- Payment Method
- Date Range
- Currency

---

# Export

- PDF Report
- CSV Export
- Excel Export
- Tax Report

---

# Invoice Registry

Columns

- Invoice Number
- Company
- Plan
- Billing Period
- Issue Date
- Due Date
- Payment Status
- Payment Method
- Amount
- Tax
- Total
- Actions

---

# Invoice Status

- Draft
- Sent
- Paid
- Unpaid
- Overdue
- Cancelled
- Refunded

---

# Invoice Actions

- View
- Download PDF
- Send Email
- Regenerate
- Mark Paid
- Cancel
- Refund

---

# Invoice Details

Display

- Invoice Number
- Company
- Plan
- Billing Period
- Issue Date
- Due Date
- Currency
- Payment Method
- Base Amount
- Tax Amount
- Discount
- Total Amount
- Status

Buttons

- Download PDF
- Email Invoice
- Print
- Regenerate Invoice

---

# Invoice Line Items

Display

- Subscription Fee
- Add-on Charges
- API Usage
- Storage Overage
- Driver Overage
- User Overage
- Discounts
- Coupons
- Tax

---

# Payment Registry

Columns

- Payment ID
- Invoice
- Company
- Gateway
- Method
- Amount
- Transaction ID
- Status
- Date

Actions

- View
- Refund
- Retry

---

# Payment Status

- Pending
- Processing
- Paid
- Failed
- Refunded
- Cancelled

---

# Failed Payments

Display

- Invoice
- Company
- Gateway
- Error
- Failed Time
- Retry Count

Actions

- Retry Payment
- Notify Company
- Change Payment Method

Business Rules

- Maximum Retry = 3
- Notify after every failed attempt.

---

# Tax / GST Summary

Display

- Invoice
- Company
- Base Amount
- GST %
- GST Amount
- Total Amount

Reports

- GST Report
- VAT Report
- Tax Summary
- Monthly Tax Collection

---

# Payment Methods

Supported

- Stripe
- PayPal
- ACH
- Wire Transfer
- Manual Invoice

Display

- Gateway Status
- Last Transaction
- Health

Actions

- Configure
- Test
- Disable

---

# Refund Management

Fields

- Invoice
- Refund Amount
- Refund Reason

Actions

- Issue Refund

Business Rules

- Refund <= Paid Amount
- Audit Required

---

# Billing Reports

Reports

- Revenue Report
- Invoice Report
- Payment Report
- Failed Payment Report
- Tax Report
- Refund Report
- Company Billing Report
- Subscription Revenue Report

---

# Notifications

Customer

- Invoice Generated
- Invoice Sent
- Payment Received
- Payment Failed
- Invoice Overdue
- Refund Processed

Finance Team

- Failed Payment
- High Value Invoice
- Refund Issued
- Gateway Error

---

# Dashboard Widgets

- Revenue Today
- Revenue This Month
- Outstanding Balance
- Failed Payments
- Recent Transactions
- Top Paying Companies

---

# Audit Logs

Track

- Invoice Generated
- Invoice Updated
- Invoice Regenerated
- Invoice Deleted
- Payment Received
- Payment Failed
- Refund Issued
- Tax Exported
- Report Generated

Fields

- User
- Timestamp
- IP Address
- Browser
- Action
- Details

---

# Validation Rules

- Company Required
- Plan Required
- Amount > 0
- Due Date Required
- Currency Required
- Payment Method Required
- Tax Percentage Valid

---

# APIs

GET /billing/dashboard

GET /billing/invoices

GET /billing/invoices/{id}

POST /billing/invoices

PUT /billing/invoices/{id}

DELETE /billing/invoices/{id}

POST /billing/invoices/regenerate

POST /billing/invoices/send

POST /billing/invoices/download

GET /billing/payments

POST /billing/payments/retry

POST /billing/payments/refund

GET /billing/failed-payments

GET /billing/tax

GET /billing/reports

GET /billing/audit

---

# Database Tables

billing

invoices

invoice_items

payments

payment_transactions

refunds

tax_records

payment_gateways

billing_reports

audit_logs

companies

subscriptions

---

# Business Rules

- Every subscription generates an invoice.
- Invoice number auto-generated.
- Tax calculated automatically.
- Failed payment retries maximum 3.
- Refunds require completed payment.
- Every billing action creates audit log.
- Revenue updates dashboard automatically.
- Overdue invoices generate reminders.

---

# Security

- RBAC enabled.
- Finance permissions required.
- Payment data encrypted.
- PCI compliance.
- Audit logging mandatory.

---

# Error States

- Invoice Not Found
- Payment Failed
- Invalid Gateway
- Refund Failed
- Tax Calculation Error
- Permission Denied
- Internal Server Error

---

# Success Messages

- Invoice generated successfully.
- Invoice regenerated successfully.
- Payment received successfully.
- Refund issued successfully.
- Report exported successfully.
- Tax report generated successfully.

---

# Acceptance Criteria

- Invoice CRUD working.
- Payment registry working.
- Failed payment handling working.
- Refund workflow working.
- Tax summary working.
- Revenue analytics working.
- Reports export working.
- Audit logs generated.
- Notifications working.
- Responsive UI.
- Performance under 2 seconds.

---


# Super Admin → System Analytics

## Module Purpose

- Monitor overall SaaS platform performance.
- Analyze tenant growth and platform revenue.
- Track API usage, storage, active users, and system health.
- Provide operational insights for business decisions.
- Generate analytics reports for management.

---

# User Role

- Super Admin

---

# Permissions

- View Analytics Dashboard
- View Revenue Analytics
- View Company Analytics
- View User Analytics
- View API Analytics
- View Storage Analytics
- Export Reports
- Download Charts
- View Audit Logs

---

# Header

- Page Title : System Analytics
- Export Report

---

# KPI Cards

## Platform Revenue
- Annual Recurring Revenue (ARR)

## Monthly Recurring Revenue (MRR)
- Monthly revenue growth

## Company Growth
- Total Companies
- Monthly New Companies

## Active Users
- Total Active Users

## API Requests
- Requests Per Minute (RPM)

## Storage Used
- Current Storage Consumption

## Login Events
- Monthly Login Count

## SLA Score
- Platform Uptime
- Availability %

---

# Analytics Sections

## Revenue Analytics

Charts

- Monthly Revenue Trend
- Annual Revenue Trend
- Revenue by Subscription Plan
- Revenue by Company

Metrics

- MRR
- ARR
- Average Revenue Per Tenant (ARPT)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (CLV)
- Churn Revenue

---

## Company Analytics

Charts

- Monthly Company Growth
- Active vs Suspended Companies
- Trial vs Paid Companies

Metrics

- Total Companies
- New Companies
- Active Companies
- Suspended Companies
- Trial Companies
- Converted Companies

---

## User Analytics

Display

- Active Users
- New Users
- User Growth
- Login Frequency
- Role Distribution

Charts

- User Growth Timeline
- Users by Role
- Users by Company

---

## Module Usage Analytics

Display

- Dispatch Module Usage
- GPS Usage
- Driver Module Usage
- Fleet Module Usage
- Warehouse Module Usage
- Accounts Module Usage
- AI Module Usage
- Customer Portal Usage

Charts

- Top Used Modules
- Least Used Modules
- Module Adoption %

---

## API Usage Analytics

Display

- Requests Per Minute
- Requests Per Hour
- Daily API Requests
- Failed Requests
- Success Rate
- Average Response Time

Charts

- API Timeline
- API Error Rate
- Endpoint Usage
- Peak Hours

---

## Storage Analytics

Display

- Total Storage
- Used Storage
- Remaining Storage
- Company Storage Usage

Charts

- Storage Growth
- Storage by Company
- Storage by Module

Alerts

- High Usage Warning
- Limit Reached

---

## Login Analytics

Display

- Total Logins
- Last Login
- Login Success
- Failed Login

Charts

- Daily Login Trend
- Login by Company
- Login by Country
- Login by Device

---

## Performance Analytics

Display

- CPU Usage
- Memory Usage
- Queue Health
- Database Health
- Cache Usage
- Background Jobs

Charts

- CPU Timeline
- Memory Timeline
- Queue Processing

---

## SLA Analytics

Display

- Uptime %
- Downtime
- Average Response Time
- Average Resolution Time

Charts

- SLA Trend
- Incident Trend

---

## AI Analytics

Display

- AI Requests
- AI Success Rate
- AI Failures
- AI Processing Time
- AI Storage

Charts

- AI Usage
- AI Model Usage
- AI Failure Rate

---

# Dashboard Widgets

- Revenue Today
- Revenue This Month
- Top Companies
- Active Sessions
- Online Users
- API Health
- Database Health
- Queue Status
- Storage Health

---

# Search

- Company Name
- User Name
- Module Name

---

# Filters

- Date Range
- Company
- Subscription Plan
- Module
- Country
- Status

---

# Export

- CSV
- Excel
- PDF
- PNG Charts

---

# Reports

- Revenue Report
- Company Growth Report
- User Activity Report
- Storage Report
- API Report
- SLA Report
- Login Report
- AI Usage Report
- Executive Summary Report

---

# Notifications

- Revenue Target Achieved
- Storage Warning
- High API Usage
- SLA Breach
- Company Growth Milestone
- Login Spike
- AI Failure Alert

---

# Audit Logs

Track

- Analytics Viewed
- Report Exported
- Dashboard Filter Applied
- Chart Downloaded

Fields

- User
- Timestamp
- IP Address
- Browser
- Action
- Details

---

# Validation Rules

- Date Range Required
- Company Exists
- Module Exists
- Export Format Valid

---

# APIs

GET /analytics/dashboard

GET /analytics/revenue

GET /analytics/companies

GET /analytics/users

GET /analytics/modules

GET /analytics/api

GET /analytics/storage

GET /analytics/login

GET /analytics/sla

GET /analytics/ai

GET /analytics/reports

GET /analytics/export

GET /analytics/audit

---

# Database Tables

analytics_reports

analytics_cache

company_statistics

user_statistics

module_statistics

api_statistics

storage_statistics

login_statistics

sla_statistics

ai_statistics

audit_logs

---

# Business Rules

- Dashboard refresh every 60 seconds.
- Charts update in real time.
- Reports generated based on selected filters.
- Storage calculated from all tenants.
- API metrics aggregated platform-wide.
- Analytics visible only to authorized users.
- Every export creates an audit log.

---

# Security

- RBAC Enabled
- Super Admin Only
- Audit Logging Mandatory
- Export Permissions Required
- Data Encryption Enabled

---

# Error States

- Analytics Data Not Available
- Report Generation Failed
- Export Failed
- API Timeout
- Permission Denied
- Internal Server Error

---

# Success Messages

- Report generated successfully.
- Analytics exported successfully.
- Dashboard refreshed successfully.
- Chart downloaded successfully.

---

# Acceptance Criteria

- Revenue analytics working.
- Company analytics working.
- User analytics working.
- Module analytics working.
- API analytics working.
- Storage analytics working.
- Login analytics working.
- SLA analytics working.
- AI analytics working.
- Reports export working.
- Audit logs generated.
- Responsive UI.
- Performance under 2 seconds.

---


# Super Admin → Inter-Company Transfers

## Module Purpose

- Manage asset, vehicle, load, inventory, and equipment transfers between tenant companies.
- Provide approval workflow for transfers.
- Maintain complete audit history.
- Validate transfer permissions and business rules.
- Track transfer lifecycle from request to completion.

---

# User Role

- Super Admin
- Company Admin (Limited)
- Dispatcher (View Only)

---

# Permissions

- View Transfers
- Create Transfer
- Edit Transfer
- Approve Transfer
- Reject Transfer
- Cancel Transfer
- Complete Transfer
- View Audit Trail
- Configure Company Permissions
- Export Reports

---

# Header

- Page Title : Inter-Company Transfers
- Export Report

---

# KPI Cards

## Total Transfers

Display total transfer requests.

---

## Completed Transfers

Successfully completed transfers.

---

## In Transit

Transfers currently moving.

---

## Pending Approval

Awaiting Super Admin approval.

---

## Rejected Transfers

Rejected requests.

---

## Cancelled Transfers

Cancelled transfers.

---

## Transfer Value

Total asset value transferred.

---

## Active Companies

Companies participating in transfers.

---

# Search

- Transfer ID
- Asset Name
- VIN Number
- Load Number
- Source Company
- Destination Company

---

# Filters

- Status
- Asset Type
- Company
- Date Range
- Approval Status

---

# Export

- CSV
- Excel
- PDF

---

# Transfer Registry

Columns

- Transfer ID
- Asset Name
- Asset Type
- Source Company
- Destination Company
- Requested By
- Request Date
- Status
- Approval Status
- Actions

---

# Supported Transfer Types

- Vehicle
- Trailer
- Driver
- Load
- Warehouse Inventory
- Reefer Container
- Equipment
- Documents
- Customer Account
- Fleet Asset

---

# Transfer Status

- Draft
- Pending Approval
- Approved
- Rejected
- In Transit
- Completed
- Cancelled

---

# Actions

- View
- Approve
- Reject
- Cancel
- Complete
- Audit Trail

---

# Create Transfer

Fields

- Transfer Type
- Asset
- Source Company
- Destination Company
- Requested By
- Reason
- Expected Transfer Date
- Notes
- Attachments

Buttons

- Save Draft
- Submit Request
- Cancel

Validation

- Asset Required
- Source Company Required
- Destination Company Required
- Transfer Date Required

---

# Transfer Details

Display

- Transfer ID
- Asset Details
- Source Company
- Destination Company
- Status
- Approval Status
- Requested By
- Approved By
- Created Date
- Last Updated

---

# Approval Workflow

Step 1

Transfer Created

↓

Step 2

Pending Approval

↓

Step 3

Super Admin Review

↓

Step 4

Approve / Reject

↓

Step 5

Transfer Execution

↓

Step 6

Completed

---

# Approve Transfer

Fields

- Approval Notes

Actions

- Approve
- Cancel

Business Rules

- Verify permissions.
- Verify destination company.
- Generate audit log.
- Notify both companies.

---

# Reject Transfer

Fields

- Rejection Reason

Actions

- Reject

Business Rules

- Mandatory rejection reason.
- Notify requester.
- Generate audit log.

---

# Complete Transfer

Fields

- Completion Notes

Actions

- Mark Completed

Business Rules

- Asset ownership updated.
- Company inventory updated.
- Audit log generated.

---

# Transfer Permissions Matrix

Display

Columns

- Company
- Can Send
- Can Receive
- Auto Approval
- Approval Required

Actions

- Enable
- Disable
- Edit

Business Rules

- Auto Approval only for trusted companies.
- Approval Required by default.

---

# Transfer Audit Trail

Display

- Created
- Approved
- Rejected
- In Transit
- Completed

Each Event Contains

- Timestamp
- User
- Action
- Details
- IP Address

---

# Notifications

Requester

- Transfer Submitted
- Transfer Approved
- Transfer Rejected
- Transfer Completed

Destination Company

- Incoming Transfer
- Transfer Accepted

Super Admin

- Approval Required
- High Value Transfer
- Failed Transfer

---

# Reports

- Transfer Summary
- Company Transfer Report
- Asset Transfer Report
- Pending Approval Report
- Completed Transfer Report

---

# Dashboard Widgets

- Pending Transfers
- Today's Transfers
- Completed Transfers
- Top Transfer Companies
- Transfer Value
- Approval Queue

---

# Validation Rules

- Source Company Exists
- Destination Company Exists
- Asset Exists
- Asset Available
- Transfer Date Valid
- Duplicate Transfer Prevention

---

# APIs

GET /transfers

GET /transfers/{id}

POST /transfers

PUT /transfers/{id}

DELETE /transfers/{id}

POST /transfers/approve

POST /transfers/reject

POST /transfers/complete

GET /transfers/audit

GET /transfers/reports

GET /transfers/permissions

PUT /transfers/permissions

---

# Database Tables

company_transfers

transfer_assets

transfer_history

transfer_permissions

transfer_attachments

transfer_notes

companies

vehicles

loads

drivers

warehouse_inventory

audit_logs

notifications

---

# Business Rules

- Source company must own asset.
- Destination company must be active.
- Suspended companies cannot transfer.
- Every approval generates audit log.
- Ownership changes only after completion.
- Duplicate active transfers not allowed.
- High value transfers require approval.
- Auto Approval only for approved companies.

---

# Security

- RBAC Enabled
- Audit Logging Mandatory
- Approval Authorization Required
- IP Tracking Enabled
- MFA Supported

---

# Error States

- Transfer Not Found
- Asset Not Available
- Company Not Found
- Approval Failed
- Duplicate Transfer
- Permission Denied
- Internal Server Error

---

# Success Messages

- Transfer created successfully.
- Transfer approved successfully.
- Transfer rejected successfully.
- Transfer completed successfully.
- Permission updated successfully.

---

# Acceptance Criteria

- Transfer CRUD working.
- Approval workflow working.
- Permission matrix working.
- Audit trail working.
- Notifications working.
- Reports working.
- Search working.
- Filters working.
- Export working.
- Responsive UI.
- Performance under 2 seconds.

---


# Super Admin → AI Controls

## Module Purpose

- Centrally manage all Artificial Intelligence features across the SaaS platform.
- Enable or disable AI modules globally.
- Configure AI models, confidence thresholds, and processing limits.
- Monitor AI requests, latency, failures, and resource consumption.
- Track AI activity logs and system health.
- Control AI licensing and feature availability.

---

# User Role

- Super Admin

---

# Permissions

- View AI Dashboard
- Enable AI Features
- Disable AI Features
- Configure AI Models
- Configure AI Thresholds
- Configure API Limits
- View AI Analytics
- View AI Activity Logs
- Export AI Reports

---

# Header

- Page Title : AI Controls
- Export Report

---

# KPI Cards

## AI Features Active

- Total enabled AI modules.

---

## AI Requests Today

- Total AI inference requests processed.

---

## Average Latency

- Average model response time.

---

## Success Rate

- AI request success percentage.

---

## Failed Requests

- Failed AI processing jobs.

---

## AI Storage

- Storage consumed by AI models, embeddings, OCR data, and artifacts.

---

## AI Queue Size

- Pending AI jobs waiting for execution.

---

## Model Health

- Current operational status of AI services.

---

# AI Feature Management

Available Features

- Load Parse AI
- Receipt OCR
- Odometer Detection
- Smart Dispatch
- ETA Prediction
- Chat Assistant
- Route Optimization
- AI Load Builder
- Invoice OCR
- POD Recognition
- Driver Risk Detection
- Fuel Prediction
- Predictive Maintenance
- AI Chat Support

Display

- Feature Name
- Description
- Status
- Version
- Requests Today
- Success Rate

Actions

- Enable
- Disable
- Configure

---

# AI Model Configuration

Display

- Model Name
- Model Version
- Provider
- Status

Supported Providers

- OpenAI
- Azure OpenAI
- Anthropic
- Google Gemini
- AWS Bedrock
- Local LLM

Actions

- Change Model
- Update Version
- Test Model
- Rollback Model

---

# Confidence Threshold Settings

Fields

- Load Parse Confidence
- OCR Confidence
- Odometer Detection Confidence
- ETA Prediction Confidence
- Dispatch Confidence
- Invoice OCR Confidence

Validation

- Minimum 0%
- Maximum 100%

Actions

- Save Configuration
- Reset Default

---

# Daily Processing Limits

Fields

- AI API Calls Per Day
- OCR Requests Per Day
- Chat Requests Per Day
- Route Optimization Jobs
- AI Load Builder Jobs
- Maximum Concurrent AI Jobs

Business Rules

- Requests above limit are queued.
- Admin notification on threshold breach.

---

# AI Queue Monitoring

Display

- Queue Size
- Running Jobs
- Failed Jobs
- Waiting Jobs
- Completed Jobs

Actions

- Retry Job
- Cancel Job
- View Details

---

# AI Activity Logs

Display

- Feature Name
- Event
- Company
- User
- Status
- Timestamp

Examples

- Load Parse Completed
- OCR Scan Finished
- Smart Dispatch Executed
- AI Load Builder Generated
- ETA Prediction Completed
- AI Chat Session Started

Actions

- View Details
- Retry
- Export

---

# AI Usage Analytics

Charts

## Requests by Feature

- Load Parse
- OCR
- Smart Dispatch
- ETA Prediction
- AI Chat
- AI Load Builder

---

## Daily AI Requests

Line Chart

---

## Success vs Failed Requests

Pie Chart

---

## Average Response Time

Bar Chart

---

## AI Resource Consumption

Charts

- CPU Usage
- GPU Usage
- RAM Usage
- Storage Usage

---

# AI Health Monitoring

Display

- AI Service Status
- Queue Health
- API Availability
- Model Availability
- Embedding Service Status
- OCR Service Status

Health Status

- Healthy
- Warning
- Critical
- Offline

---

# AI Licensing

Display

Which subscription plans can access

- Starter
- Professional
- Enterprise
- Custom Enterprise

Actions

- Enable for Plan
- Disable for Plan

---

# AI Cost Monitoring

Display

- Total AI Cost
- Monthly AI Cost
- Cost Per Company
- Cost Per Request
- Token Consumption
- OCR Pages Processed

Charts

- Monthly AI Spend
- Cost by Company
- Cost by Feature

---

# Search

- AI Feature
- Company
- User
- Job ID

---

# Filters

- Feature
- Status
- Company
- Date
- Model
- Provider

---

# Export

- CSV
- Excel
- PDF

---

# Notifications

Super Admin

- AI Service Down
- Queue Overflow
- Daily Limit Reached
- Model Failure
- High Latency
- High AI Cost

Company Admin

- AI Limit Reached
- AI Job Failed

---

# Audit Logs

Track

- Feature Enabled
- Feature Disabled
- Model Changed
- Threshold Updated
- API Limit Changed
- AI Job Retried
- AI Job Cancelled
- Configuration Updated

Fields

- User
- Timestamp
- IP Address
- Browser
- Action
- Old Value
- New Value

---

# Validation Rules

- Confidence 0–100
- API Limit > 0
- Valid AI Provider
- Valid Model Version
- Feature Exists

---

# APIs

GET /ai/dashboard

GET /ai/features

PUT /ai/features/{id}

GET /ai/models

PUT /ai/models/{id}

POST /ai/test-model

GET /ai/jobs

POST /ai/jobs/retry

POST /ai/jobs/cancel

GET /ai/activity

GET /ai/analytics

GET /ai/cost

GET /ai/health

GET /ai/licensing

PUT /ai/licensing

GET /ai/audit

---

# Database Tables

ai_features

ai_models

ai_model_versions

ai_jobs

ai_job_queue

ai_activity_logs

ai_usage_statistics

ai_cost_reports

ai_configuration

ai_thresholds

ai_limits

ai_health_status

audit_logs

notifications

---

# Business Rules

- AI features can be enabled or disabled globally.
- AI processing follows subscription licensing.
- Queue processes jobs FIFO unless priority is assigned.
- Failed jobs may be retried up to three times.
- Configuration changes require audit logs.
- AI costs calculated per request and provider.
- Usage analytics update in real time.
- Model rollback available only for published versions.

---

# Security

- RBAC Enabled
- Super Admin Access
- API Keys Encrypted
- Audit Logging Mandatory
- IP Tracking Enabled
- MFA Supported

---

# Error States

- AI Service Offline
- Invalid Model
- Provider Not Available
- Queue Full
- API Limit Exceeded
- Permission Denied
- Internal Server Error

---

# Success Messages

- AI feature enabled successfully.
- AI feature disabled successfully.
- Configuration updated successfully.
- Model changed successfully.
- AI job retried successfully.
- AI limits updated successfully.

---

# Acceptance Criteria

- AI dashboard working.
- Feature enable/disable working.
- Model configuration working.
- Threshold configuration working.
- Queue monitoring working.
- AI analytics working.
- Cost monitoring working.
- Licensing working.
- Audit logs generated.
- Notifications working.
- Export working.
- Responsive UI.
- Performance under 2 seconds.

---

# Super Admin → User Management

## Module Purpose

- Centralized management of all platform users.
- Create, update, suspend, and delete users.
- Assign users to companies and roles.
- Control user access across the SaaS platform.
- Monitor user activity and login history.
- Support impersonation ("Login As") for troubleshooting.

---

# User Role

- Super Admin

---

# Permissions

- View Users
- Create User
- Edit User
- Delete User
- Suspend User
- Activate User
- Reset Password
- Login As User
- Assign Role
- Assign Company
- Export Users
- View Audit Logs

---

# Header

- Page Title : User Management
- Add New User
- Export Users

---

# KPI Cards

## Total Users

Display total registered users.

---

## Active Users

Users with Active status.

---

## Pending Users

Users waiting for activation.

---

## Suspended Users

Disabled users.

---

## Super Admins

Total Super Admin accounts.

---

## Company Admins

Total Company Admin accounts.

---

## Dispatchers

Total Dispatcher accounts.

---

## Drivers

Total Driver accounts.

---

## Warehouse Managers

Total Warehouse Manager accounts.

---

## Customers

Total Customer accounts.

---

# Search

- User Name
- Email
- User ID
- Company
- Role

---

# Filters

- Status
- Role
- Company
- Created Date
- Last Login

---

# Export

- CSV
- Excel
- PDF

---

# User List

Columns

- Avatar
- Full Name
- User ID
- Email
- Phone
- Company
- Role
- Status
- Last Login
- Created Date
- Actions

---

# User Status

- Active
- Pending
- Suspended
- Locked
- Deleted

---

# Actions

- View
- Edit
- Login As
- Suspend
- Activate
- Reset Password
- Delete

---

# Add New User

Fields

- Full Name
- Email
- Phone
- Password
- Confirm Password
- Status
- Role
- Company

Buttons

- Add User
- Cancel

Validation

- Name Required
- Email Required
- Email Unique
- Password Required
- Password Minimum 8 Characters
- Role Required
- Company Required

---

# Edit User

Editable Fields

- Name
- Email
- Phone
- Status
- Role
- Company

Read Only

- User ID
- Created Date

Actions

- Save
- Cancel

---

# Delete User

Confirmation

Display

- User Name
- User ID
- Role

Buttons

- Cancel
- Delete

Business Rules

- Super Admin cannot delete own account.
- System Root account cannot be deleted.
- Deleted users remain in audit history.

---

# Suspend User

Business Rules

- Login disabled immediately.
- Existing sessions terminated.
- Audit log generated.
- Notification sent.

---

# Activate User

Business Rules

- Login restored.
- Previous permissions restored.
- Audit log generated.

---

# Reset Password

Fields

- New Password
- Confirm Password

Actions

- Reset Password
- Send Password Email

Validation

- Minimum 8 Characters
- Strong Password Required

---

# Login As User

Purpose

Allow Super Admin to troubleshoot user issues.

Business Rules

- Login session recorded.
- User notified (optional).
- Audit log generated.
- Auto logout after timeout.

---

# User Profile

Display

- Avatar
- Name
- Email
- Phone
- Company
- Role
- Status
- Last Login
- Login Count
- MFA Status
- Created Date

---

# User Activity

Display

- Login History
- IP Address
- Browser
- Device
- Location
- Failed Login Attempts
- Password Changes

---

# Bulk Actions

Supported

- Activate
- Suspend
- Delete
- Change Role
- Change Company
- Export

---

# Notifications

User

- Welcome Email
- Password Reset
- Account Activated
- Account Suspended
- Role Changed

Super Admin

- New User Created
- Failed Login
- User Locked

---

# Dashboard Widgets

- Active Users
- Online Users
- New Users Today
- Failed Logins
- Suspended Users
- User Growth

---

# Audit Logs

Track

- User Created
- User Updated
- User Deleted
- User Suspended
- User Activated
- Password Reset
- Login As
- Role Changed
- Company Changed

Fields

- User
- Operator
- Timestamp
- IP Address
- Browser
- Old Value
- New Value

---

# Validation Rules

- Email Unique
- Phone Format
- Password Complexity
- Company Exists
- Role Exists

---

# APIs

GET /users

GET /users/{id}

POST /users

PUT /users/{id}

DELETE /users/{id}

POST /users/suspend

POST /users/activate

POST /users/reset-password

POST /users/login-as

GET /users/activity

GET /users/audit

POST /users/bulk-action

---

# Database Tables

users

user_profiles

user_roles

companies

user_sessions

password_resets

login_history

failed_logins

audit_logs

notifications

---

# Business Rules

- Email must be unique.
- One primary role per user.
- One company assignment per user.
- Login As always generates audit logs.
- Password encrypted using bcrypt/argon2.
- Deleted users cannot log in.
- Suspended users lose active sessions immediately.
- System Root account is protected.

---

# Security

- RBAC Enabled
- MFA Supported
- Password Encryption
- JWT Authentication
- Session Timeout
- IP Tracking
- Device Tracking
- Audit Logging Mandatory

---

# Error States

- User Not Found
- Duplicate Email
- Invalid Company
- Invalid Role
- Password Validation Failed
- Permission Denied
- Internal Server Error

---

# Success Messages

- User created successfully.
- User updated successfully.
- User suspended successfully.
- User activated successfully.
- Password reset successfully.
- User deleted successfully.
- Login session started successfully.

---

# Acceptance Criteria

- User CRUD working.
- Search working.
- Filters working.
- Bulk actions working.
- Login As working.
- Password reset working.
- User activity working.
- Audit logs working.
- Notifications working.
- Export working.
- Responsive UI.
- Performance under 2 seconds.

---



# Super Admin → Roles & Permissions

## Module Purpose

- Manage all system roles and permission policies.
- Create custom roles.
- Assign permissions to platform modules.
- Control access using Role-Based Access Control (RBAC).
- Manage permission inheritance.
- Maintain complete permission audit history.

---

# User Role

- Super Admin

---

# Permissions

- View Roles
- Create Role
- Edit Role
- Delete Role
- Clone Role
- Assign Permissions
- Assign Users
- Export Roles
- View Audit Logs

---

# Header

- Page Title : Roles & Permissions
- Create Role Button
- Export Roles

---

# KPI Cards

## Total Roles

Display total system roles.

---

## System Roles

Built-in platform roles.

---

## Custom Roles

Roles created by administrators.

---

## Active Permissions

Total enabled permissions.

---

## Assigned Users

Users assigned to roles.

---

## Recently Updated

Roles modified recently.

---

## Permission Groups

Total permission modules.

---

## Audit Events

Permission-related changes today.

---

# Search

- Role Name
- Permission Name
- User Name

---

# Filters

- Role Type
- Status
- Module
- Created By
- Updated Date

---

# Export

- CSV
- Excel
- PDF

---

# Roles Table

Columns

- Role Name
- Description
- Total Permissions
- Assigned Users
- Status
- Created By
- Last Updated
- Actions

---

# Default System Roles

- Super Admin
- Company Admin
- Dispatcher
- Driver
- Warehouse Manager
- Accounts Manager
- Yard Attendant
- Sales Representative
- Customer

---

# Role Status

- Active
- Disabled
- Archived

---

# Actions

- View
- Edit
- Clone
- Delete
- Assign Users
- View Permissions

---

# Create Role

Fields

- Role Name
- Description
- Status

Permission Matrix

Modules

- Dashboard & Analytics
- User Management
- Roles & Permissions
- Companies & Tenants
- Loads & Dispatch
- Fleet & Vehicles
- Drivers & Roster
- Warehouse & Stock
- Yard Management
- Billing & Invoices
- Inter-Company Transfers
- AI Controls
- Support Tickets
- White Label
- System Settings

Permission Types

- View
- Create
- Edit
- Delete
- Approve
- Export
- Manage

Buttons

- Save
- Cancel

Validation

- Role Name Required
- Unique Role Name

---

# Edit Role

Editable

- Role Name
- Description
- Status
- Permission Matrix

Actions

- Save Changes
- Cancel

---

# Delete Role

Display

- Role Name
- Assigned Users

Business Rules

- Cannot delete System Roles.
- Cannot delete role assigned to active users.
- Confirmation required.

Buttons

- Delete
- Cancel

---

# Clone Role

Purpose

Create a new role using an existing role as a template.

Fields

- New Role Name

Actions

- Clone
- Cancel

---

# Permission Matrix

Each Module Supports

- View
- Create
- Edit
- Delete
- Manage
- Export
- Approve

Example

Dashboard

✔ View

✔ Export

Users

✔ Create

✔ Edit

✔ Delete

Billing

✔ View

✔ Export

AI Controls

✔ Manage

✔ Configure

---

# Assign Users

Fields

- Select Users
- Select Company

Actions

- Assign
- Remove

Business Rules

- One primary role per user.
- Role update immediately refreshes permissions.

---

# Permission Groups

Platform

Administration

Operations

Fleet

Drivers

Loads

Warehouse

Finance

CRM

Customer Portal

AI

Analytics

Settings

White Label

Security

---

# Role Inheritance

Rules

- Super Admin inherits all permissions.
- Child roles cannot exceed parent permissions.
- Custom roles inherit only selected permissions.

---

# Dashboard Widgets

- Total Roles
- Active Users by Role
- Permission Distribution
- Most Used Roles
- Recently Modified Roles

---

# Audit Logs

Track

- Role Created
- Role Updated
- Role Deleted
- Role Cloned
- Permission Changed
- User Assigned
- User Removed

Fields

- User
- Operator
- Timestamp
- IP Address
- Browser
- Old Permission
- New Permission

---

# Notifications

- Role Created
- Role Updated
- Role Deleted
- Permission Changed
- User Assigned

---

# Validation Rules

- Role Name Required
- Role Name Unique
- Minimum One Permission
- Cannot Remove Own Super Admin Permission
- Cannot Delete Built-in Roles

---

# APIs

GET /roles

GET /roles/{id}

POST /roles

PUT /roles/{id}

DELETE /roles/{id}

POST /roles/clone

GET /roles/permissions

PUT /roles/permissions

POST /roles/assign-users

POST /roles/remove-users

GET /roles/audit

---

# Database Tables

roles

permissions

role_permissions

user_roles

permission_groups

role_audit_logs

audit_logs

users

companies

---

# Business Rules

- System roles are read-only.
- Custom roles can be modified.
- Permission updates take effect immediately.
- Every permission change generates an audit log.
- Role deletion blocked if assigned users exist.
- Role cloning copies all permissions.
- Export respects RBAC.

---

# Security

- RBAC Enabled
- Permission Validation on Every API
- JWT Authentication
- MFA Supported
- Audit Logging Mandatory
- IP Tracking Enabled

---

# Error States

- Role Not Found
- Duplicate Role Name
- Permission Missing
- System Role Protected
- Active Users Assigned
- Permission Denied
- Internal Server Error

---

# Success Messages

- Role created successfully.
- Role updated successfully.
- Role cloned successfully.
- Role deleted successfully.
- Permissions updated successfully.
- Users assigned successfully.

---

# Acceptance Criteria

- Role CRUD working.
- Permission matrix working.
- User assignment working.
- Clone role working.
- Search working.
- Filters working.
- Export working.
- Audit logs generated.
- Responsive UI.
- Performance under 2 seconds.

---


# Super Admin → Settings

## Module Purpose

- Manage global platform configurations.
- Configure company profile and branding.
- Manage billing and subscription settings.
- Configure White Label settings.
- Manage GPS, ELD, Accounting, Email, SMS integrations.
- Maintain platform security and audit logs.

---

# User Role

- Super Admin

---

# Permissions

- View Settings
- Edit Company Profile
- Manage Branding
- Manage White Label
- Configure Business Hours
- Manage Subscription Settings
- Configure GPS Providers
- Configure Accounting Integrations
- Configure Email Templates
- Configure SMS Templates
- View Security Logs
- Export Audit Logs

---

# Header

- Page Title : Settings
- Save Changes
- Export Settings

---

# Navigation Sections

- Company Profile
- Branding & Theme
- Business Hours
- Billing & Subscription
- White Label Setup
- Logistics Configuration
- GPS & ELD Integrations
- Email & SMS Templates
- Accounting Integrations
- Security Audit Logs

---

# Company Profile

## Purpose

Manage organization information.

### Fields

- Company Name
- Registration Number
- Admin Email
- Company Phone
- Website
- Address
- Country
- Timezone
- Currency
- Language

### Actions

- Save Company Profile
- Reset Changes

### Validation

- Company Name Required
- Email Required
- Registration Number Unique

---

# Branding & Theme

## Purpose

Customize platform appearance.

### Fields

- Primary Theme Color
- Secondary Color
- Accent Color
- Company Logo
- Favicon
- Login Background
- Dashboard Background
- Theme Mode

### Theme Options

- Light
- Dark
- System
- Custom

### Actions

- Upload Logo
- Upload Background
- Save Branding
- Reset Branding

### Validation

- PNG
- JPG
- SVG
- Maximum Upload Size

---

# Business Hours

## Purpose

Configure default operating hours.

### Fields

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Each Day

- Opening Time
- Closing Time
- Open / Closed

### Business Rules

- Individual branches can override.

---

# Billing & Subscription

Display

- Current Plan
- Subscription Status
- Billing Cycle
- Payment Method
- Renewal Date

Usage

- Users
- Branches
- Drivers
- Fleet
- Storage

Invoices

- Invoice History
- Download PDF
- Payment Status

Actions

- Update Payment Method
- Upgrade Plan
- Cancel Subscription

---

# White Label Setup

Fields

- Custom Domain
- Login Title
- Platform Name
- Brand Theme

Toggles

- Hide Hero Branding
- Hide Documentation Links
- Hide Footer

Actions

- Save White Label

Validation

- Domain Format
- SSL Required

---

# Logistics Configuration

Supported Niches

- Car Carrying
- General Freight
- HAZMAT
- Refrigerated
- Flatbed
- Container
- Courier
- LTL
- FTL

Configuration

- Enable
- Disable

Default Niche

Dropdown

Business Rules

- Enabled niche controls visible forms.
- Disabled niche hides related modules.

---

# GPS & ELD Integrations

Supported Providers

- Geotab
- Trakka
- Teletrac Navman
- Samsara
- Motive
- Verizon Connect

Fields

- Provider
- API Key
- Secret
- Status
- Last Sync

Actions

- Connect
- Disconnect
- Test Connection
- Update API Key

Validation

- API Key Required
- Secret Required

---

# Email Templates

Templates

- Welcome Email
- Password Reset
- Driver Invitation
- Company Invitation
- Invoice Email
- POD Confirmation
- Dispatch Notification

Fields

- Subject
- HTML Body
- Variables
- Footer

Actions

- Preview
- Save
- Send Test Email

---

# SMS Templates

Templates

- Dispatch SMS
- ETA Update
- Driver Alert
- OTP
- Delivery Confirmation

Fields

- Message Body
- Variables

Actions

- Save
- Send Test SMS

---

# Accounting Integrations

Supported

- Xero
- QuickBooks
- Zoho Books
- MYOB

Display

- Status
- Last Sync
- API Key

Actions

- Connect
- Disconnect
- Sync Now
- Test Connection

Business Rules

- Sync invoices automatically.
- Manual sync supported.

---

# Security Settings

Configuration

- Password Policy
- MFA
- Session Timeout
- Login Attempt Limit
- IP Whitelist
- Device Trust
- Audit Logging

Fields

- Minimum Password Length
- Password Expiry
- Session Timeout
- Failed Login Attempts

Actions

- Save Security Settings

---

# Company Security Audit Logs

Display

- Timestamp
- User
- Action
- Description
- IP Address
- Browser
- Authentication Status

Filters

- User
- Date
- Action
- Status

Actions

- View Details
- Export Logs

---

# Search

- User
- Setting
- Provider

---

# Filters

- Category
- Status
- Provider
- Date

---

# Export

- Settings Backup
- CSV
- PDF
- Audit Logs

---

# Notifications

- Subscription Renewal
- Payment Failed
- GPS Connection Failed
- Email Delivery Failed
- SMS Failed
- Security Alert
- Failed Login
- Integration Disconnected

---

# Validation Rules

- Email Format
- Domain Format
- API Keys Required
- Valid Business Hours
- Valid Theme Colors
- Valid Currency
- Required Company Details

---

# APIs

GET /settings

PUT /settings/company

PUT /settings/branding

PUT /settings/business-hours

PUT /settings/billing

PUT /settings/white-label

PUT /settings/logistics

PUT /settings/gps

PUT /settings/email

PUT /settings/sms

PUT /settings/accounting

PUT /settings/security

GET /settings/audit

POST /settings/test-email

POST /settings/test-sms

POST /settings/test-gps

POST /settings/test-accounting

---

# Database Tables

settings

company_profile

branding

business_hours

subscription_settings

white_label

logistics_configuration

gps_integrations

email_templates

sms_templates

accounting_integrations

security_settings

audit_logs

notifications

---

# Business Rules

- Only Super Admin can modify global settings.
- Branding updates apply platform-wide.
- White Label changes require deployment.
- GPS integrations validated before saving.
- Accounting sync logs every transaction.
- Email and SMS templates support dynamic variables.
- Every settings change generates an audit log.
- Security settings apply immediately.

---

# Security

- RBAC Enabled
- MFA Supported
- JWT Authentication
- Secrets Encrypted
- API Keys Masked
- Audit Logging Mandatory
- IP Tracking Enabled

---

# Error States

- Invalid Email
- Invalid Domain
- Invalid API Key
- GPS Connection Failed
- Accounting Sync Failed
- Email Failed
- SMS Failed
- Permission Denied
- Internal Server Error

---

# Success Messages

- Company profile updated successfully.
- Branding updated successfully.
- Business hours updated successfully.
- Billing settings updated successfully.
- White Label settings updated successfully.
- GPS integration connected successfully.
- Email template saved successfully.
- SMS template saved successfully.
- Accounting integration connected successfully.
- Security settings updated successfully.

---

# Acceptance Criteria

- Company profile working.
- Branding working.
- Business hours working.
- Billing settings working.
- White Label working.
- Logistics configuration working.
- GPS integrations working.
- Email templates working.
- SMS templates working.
- Accounting integrations working.
- Security settings working.
- Audit logs working.
- Search working.
- Export working.
- Responsive UI.
- Performance under 2 seconds.

---




# Company Admin → Command Centre

## Module Purpose

- Central operational dashboard for Company Admin.
- Provide a real-time overview of fleet operations, loads, drivers, revenue, invoices, support tickets, and maintenance.
- Enable quick operational actions from one screen.
- Surface alerts requiring immediate attention.

---

# User Role

- Company Admin

---

# Permissions

- View Dashboard
- View KPIs
- View Recent Loads
- View Driver Alerts
- View Pending Invoices
- View Tickets
- Create Quick Actions
- Export Dashboard

---

# Header

- Company Name
- Dashboard
- Search
- Notifications
- User Profile

---

# KPI Cards

## Loads (MTD)

Display

- Total Loads
- Monthly Growth %

---

## Active Fleet

Display

- Active Vehicles
- Total Fleet

---

## Monthly Revenue

Display

- Revenue
- Growth %

---

## Active Branches

Display

- Active Branches
- Total Depots

---

# Quick Actions

Buttons

- New Load
- Assign Driver
- Track Load
- Create Customer
- Generate Invoice
- More Actions

---

# Load Status Summary

Display

- Total Loads
- Draft
- Assigned
- Picked Up
- In Transit
- Delivered
- Cancelled

Charts

- Status Distribution
- Monthly Load Trend

---

# Recent Loads

Columns

- Load ID
- Route
- Status
- Driver
- ETA

Actions

- View
- Edit
- Track

---

# Unread Messages

Display

- Sender
- Preview
- Time
- Unread Count

Actions

- Open Conversation
- Reply

---

# Support Ticket Summary

Display

- Open
- In Progress
- Waiting
- Resolved

Actions

- View Tickets
- Create Ticket

---

# Pending Invoices

Display

- Invoice Number
- Customer
- Amount
- Due Date

Actions

- View
- Generate
- Send Reminder

---

# Driver Alerts

Display

- Driver Name
- Alert Type
- Severity
- Date

Alert Types

- License Expiry
- Fatigue Breach
- Missing Pre-start
- Compliance Warning
- Medical Expiry

Actions

- View Driver
- Notify Driver

---

# Truck Maintenance

Display

- Vehicle
- Registration
- Maintenance Type
- Due Date
- Status

Actions

- Schedule Maintenance
- View Vehicle

---

# Knowledge Base Widget

Display

- Search Articles
- Popular Articles

Actions

- Open Knowledge Base
- Create Support Ticket

---

# Dashboard Widgets

- Fleet Health
- Driver Availability
- Vehicle Availability
- Active Loads
- Revenue Summary
- Recent Activities
- Notifications
- Support Overview

---

# Search

- Loads
- Driver
- Customer
- Invoice

---

# Filters

- Date Range
- Branch
- Driver
- Status

---

# Notifications

- New Load Assigned
- Driver Alert
- Maintenance Due
- Invoice Due
- Support Ticket Updated
- New Message

---

# Audit Logs

Track

- Dashboard Viewed
- Quick Action Used
- Report Exported

---

# APIs

GET /company/dashboard

GET /company/dashboard/kpis

GET /company/dashboard/recent-loads

GET /company/dashboard/messages

GET /company/dashboard/invoices

GET /company/dashboard/alerts

GET /company/dashboard/tickets

GET /company/dashboard/maintenance

---

# Database Tables

dashboard_statistics

loads

drivers

vehicles

branches

messages

tickets

invoices

maintenance

notifications

---

# Business Rules

- Dashboard refresh every 60 seconds.
- KPI cards update automatically.
- Quick actions respect RBAC.
- Alerts shown by priority.
- Recent data sorted newest first.
- Every dashboard access logged.

---

# Security

- RBAC Enabled
- Company Isolation
- JWT Authentication
- Audit Logging

---

# Error States

- Dashboard Data Unavailable
- KPI Loading Failed
- Permission Denied
- Internal Server Error

---

# Success Messages

- Dashboard loaded successfully.
- Report exported successfully.

---

# Acceptance Criteria

- Dashboard loads successfully.
- KPI cards update correctly.
- Quick actions work.
- Recent loads visible.
- Driver alerts visible.
- Invoice widget working.
- Messages working.
- Ticket widget working.
- Responsive UI.
- Performance under 2 seconds.

---


# PRD – Sales Dashboard
Module: Sales Portal → Sales Dashboard
Version: 1.0
Status: Production Ready
Owner: Product Team
Audience: UI/UX, Frontend, Backend, QA, DevOps

---

# 1. Module Overview

Sales Dashboard is the primary workspace for the Sales Team.

It provides a complete overview of:

- Lead Pipeline
- Demo Activities
- Trial Companies
- Proposal Status
- Won/Lost Deals
- Pipeline Revenue
- Sales Activities
- Follow-up Tasks
- Monthly Performance
- Conversion Analytics

This page is the first screen after Sales user login.

---

# 2. Business Objective

The dashboard enables Sales Representatives and Sales Managers to:

- View sales performance in real time.
- Monitor pipeline movement.
- Track follow-up activities.
- Manage active prospects.
- Quickly perform sales actions.
- Monitor monthly revenue.
- Analyze conversion rate.
- Improve sales productivity.

---

# 3. User Roles

### Sales Director

Permissions

- Full Dashboard Access
- View All Leads
- View Reports
- Create Lead
- Edit Lead
- Delete Lead
- Assign Sales Rep
- View Revenue
- Export Reports

---

### Sales Manager

Permissions

- View Team Dashboard
- Manage Team Leads
- Assign Tasks
- Book Demo
- View Reports

---

### Sales Representative

Permissions

- View Assigned Leads
- Book Demo
- Update Pipeline
- Log Calls
- Add Notes
- Start Trial
- Send Proposal

---

# 4. Dashboard Header

Displays

- Page Title
- Module Description

Title

Sales Dashboard

Subtitle

Manage leads, pipeline, and sales reports.

---

# 5. KPI Cards

The first section contains KPI summary cards.

---

## Card 1

Title

NEW LEADS

Value

6

Description

6 Pending

Color

Blue

Click Action

Open Leads Module filtered by New Lead.

---

## Card 2

Title

DEMOS BOOKED

Value

12

Description

Slots Ready

Color

Purple

Click

Open Demo Bookings page.

---

## Card 3

Title

TRIALS ACTIVE

Value

21

Description

Active Usage

Color

Orange

Click

Open Trial Companies.

---

## Card 4

Title

PROPOSALS SENT

Value

10

Description

Negotiating

Color

Yellow

Click

Open Proposal module.

---

## Card 5

Title

DEALS WON

Value

5

Description

Closed & Synced

Color

Green

Click

Open Won Deals.

---

## Card 6

Title

DEALS LOST

Value

5

Description

Needs Re-engage

Color

Red

Click

Open Lost Deals.

---

## Card 7

Title

PIPELINE VALUE

Value

$306,960

Description

Potential MRR

Color

Indigo

Click

Open Revenue Report.

---

# 6. Pipeline Stage Distribution Matrix

Displays complete pipeline summary.

Stages

- New Lead
- Contacted
- Demo Booked
- Demo Completed
- Trial Started
- Proposal Sent
- Negotiation
- Won
- Lost

Each stage displays:

- Stage Name
- Lead Count
- Color Indicator
- Clickable Navigation

Clicking a stage opens Pipeline Board filtered by selected stage.

---

# 7. Selected Lead Details Workspace

Displays currently selected lead.

Example

Company

Vance Refrigeration

Contact

Robert Vance

Current Stage

New Lead

Displays

Fleet Size

12 Trucks

Transport Niche

Car Carrying

Current Software

Spreadsheets (Excel)

Estimated Value

$2,004/month

Pain Points

Manual route sheets take hours.

Next Follow-up Date

2026-07-13

---

# 8. Internal Notes

Displays latest CRM notes.

Each note contains

- User Name
- Date
- Time
- Comment

Supports

- Rich Text
- Timestamp
- Edit
- Delete
- Mention User

---

# 9. CRM Direct Dispatch Actions

Available buttons

- Recommend Plan
- Book Demo
- Start Trial
- Send Proposal
- Mark Won
- Mark Lost

Each action opens its respective modal.

---

# 10. Quick Note Box

Allows sales rep to enter activity.

Placeholder

Quick write note and press Enter...

Press Enter

Creates activity timeline entry.
---

# 11. Upcoming Follow-up Tasks

## Purpose

Displays all upcoming, overdue, and scheduled follow-up activities for the sales team.

---

## Section Title

UPCOMING FOLLOW-UP TASKS

Display total pending task count.

Example

3 Tasks

---

## Task Card Fields

Each task card contains:

- Company Name
- Task Status
- Due Date
- Due Time
- Contact Person
- Assigned Sales Representative
- Task Description
- Priority
- Task Type

---

## Example

Company

Freight-A-Way

Status

Overdue

Due Date

2026-07-16

Due Time

03:30 PM

Task

Touchpoint checklist regarding pain points:
Fuel tax calculation mistakes.

---

## Another Example

Company

QuickLoad Logistics

Status

Overdue

Due Date

2026-07-17

Task

Call regarding Driver Dispatch Automation.

---

## Another Example

Company

Vance Refrigeration

Status

Upcoming

Due Date

2026-07-19

Task

Demo Follow-up

Description

Send customized pricing deck for 12 trucks.

---

## Available Actions

- Open Task
- Edit
- Complete
- Delete
- Reschedule
- Assign User

---

## Status Types

- Pending
- Upcoming
- Overdue
- Completed
- Cancelled

---

# 12. Recent Activity Timeline

## Purpose

Shows complete sales activity history.

Every activity performed on a lead is logged here.

---

## Timeline Events

Supported Events

- Lead Created
- Phone Call
- Email Sent
- Demo Scheduled
- Demo Completed
- Trial Started
- Proposal Sent
- Proposal Revised
- Proposal Accepted
- Proposal Rejected
- Internal Note
- Follow-up Created
- Deal Won
- Deal Lost
- Company Converted

---

## Activity Card Fields

Each activity contains:

- Company Name
- Event Type
- Date
- Time
- User
- Description
- Icon

---

## Example

Company

Vance Refrigeration

Activity

Lead Created

Date

2026-07-14

Time

02:15 PM

Created By

SYSTEM HUB

Description

Inbound workspace registration processed.

---

## Example

Company

Hudson Logistics Corp

Activity

Demo Scheduled

Date

2026-07-12

User

Alex Wright

Description

Zoom Product Walkthrough booked.

---

## Example

Company

Global Shipping Co.

Activity

Deal Won

Description

Enterprise License finalized.

---

# 13. Monthly Sales Analytics

## Purpose

Displays monthly pipeline growth.

---

## Graph Type

Area Chart

---

## X Axis

Months

- Jan
- Feb
- Mar
- Apr
- May
- Jun

---

## Y Axis

Pipeline Revenue

---

## Tooltip

Displays

- Month
- Revenue
- Growth %

---

## Filters

- Current Month
- Quarter
- Year
- Custom Date

---

# 14. Conversion Funnel Chart

Displays conversion efficiency.

Stages

Lead

↓

Demo

↓

Trial

↓

Proposal

↓

Won

---

## Metrics

Conversion Rate

Demo Success Rate

Proposal Success Rate

Win Rate

Loss Rate

Average Closing Time

---

# 15. Create New Task Modal

Purpose

Create follow-up activities.

---

## Fields

Task Title *

Task Type *

Due Date *

Due Time *

Priority *

Associated Lead

Assigned User

Reminder

Notes

---

## Task Types

- Phone Call
- Email
- Zoom Meeting
- Site Visit
- Proposal Follow-up
- Trial Follow-up
- Internal Review

---

## Priority

Low

Medium

High

Critical

---

## Buttons

Cancel

Create Task

---

## Validation

Task Title Required

Due Date Required

Priority Required

---

# 16. Recommend Plan Modal

Purpose

Recommend SaaS License.

---

## Plans

Starter

Professional

Enterprise

---

Each card displays

Plan Name

Monthly Price

Features

Recommended Badge

Apply Button

---

Starter

$199

Supports

Small Fleet

---

Professional

$499

Growing Companies

---

Enterprise

$1299

Large Fleet

Unlimited Modules

---

## Button

Apply Selected Plan

---

# 17. Schedule Demo Modal

Purpose

Book Zoom Demo.

---

## Fields

Lead *

Date *

Time *

Presenter *

Meeting Agenda

Internal Notes

Timezone

Meeting Duration

---

## Buttons

Cancel

Confirm Zoom Schedule

---

## Validation

Date Required

Time Required

Presenter Required

---

# 18. Start Trial Modal

Purpose

Activate Trial Workspace.

---

## Fields

Trial Duration

Workspace Plan

Driver License Limit

Module Access

Storage Quota

Admin Email

---

## Default

14 Days

---

## Buttons

Cancel

Activate Trial

---

# 19. Send Proposal Modal

Purpose

Generate SaaS Proposal.

---

## Fields

Proposal Title

Base License

Additional Modules

Discount %

Validity

Custom Notes

---

## Buttons

Save Draft

Send Proposal

Preview

Cancel

---

# 20. Company Conversion Wizard

Purpose

Convert Won Lead into Company Workspace.

6 Step Workflow

Step 1

Subscription Plan

↓

Step 2

Company Information

↓

Step 3

Admin Information

↓

Step 4

Depot Allocation

↓

Step 5

Review

↓

Step 6

Provision Workspace

---

Each step validates before moving next.

Previous Step available.

Final step provisions tenant automatically.

---

# End of Sales Dashboard Part-2

Remaining Sections (Part-3)

- Business Rules
- Automation Rules
- Notification Rules
- API Endpoints
- Database Tables
- Permission Matrix
- Audit Logs
- Security Rules
- Error Messages
- Success Messages
- Acceptance Criteria
- QA Test Cases
- Edge Cases
- Performance Requirements
- Future Enhancements
---

# 21. Business Rules

## BR-001

Every Lead must belong to one Sales Representative.

Priority: High

---

## BR-002

A Lead cannot move directly from "New Lead" to "Won".

Allowed Flow

New Lead
↓

Contacted
↓

Demo Booked
↓

Demo Completed
↓

Trial Started
↓

Proposal Sent
↓

Negotiation
↓

Won

Alternative

Negotiation
↓

Lost

---

## BR-003

Every Demo Booking must have

- Lead
- Date
- Time
- Presenter

Mandatory.

---

## BR-004

Only Won Leads can be converted into Company Workspace.

---

## BR-005

Proposal cannot be generated until

- Demo Completed

OR

- Trial Started

---

## BR-006

Trial Workspace duration

Default

14 Days

Maximum

30 Days

---

## BR-007

Every activity performed by Sales must create Timeline history.

---

## BR-008

Deleting Lead does not remove activity history.

Status

Archived

---

## BR-009

Every Follow-up must have Due Date.

---

## BR-010

Only Sales Director can permanently delete Lead.

---

# 22. Automation Rules

System automatically performs following actions.

---

## Lead Created

Automatically

Assign Lead Number

Example

LD-000245

---

Assign Sales Representative

Round Robin

OR

Manual Assignment

---

Create Timeline Event

Lead Created

---

Send Welcome Email (Optional)

---

# Demo Booked

Automatically

Create Calendar Event

Send Email

Send SMS Reminder

Create Timeline

---

# Demo Completed

Automatically

Ask Feedback

Calculate Lead Score

Update Stage

---

# Trial Started

Automatically

Create Trial Workspace

Generate Login Credentials

Create Admin User

Assign Trial License

Send Trial Email

---

# Proposal Sent

Automatically

Generate Proposal Number

Attach PDF

Send Email

Update Timeline

---

# Proposal Accepted

Automatically

Move Lead

↓

Won

Create Company Wizard

Notify Operations Team

---

# Deal Won

Automatically

Generate Customer ID

Provision Company

Create Tenant

Assign Subscription

Generate Invoice

Notify Admin

---

# Deal Lost

Automatically

Move Lead

↓

Lost

Capture Loss Reason

Create Re-engagement Reminder

---

# 23. Notification Rules

System Notifications

Demo Reminder

24 Hours Before

---

Demo Reminder

1 Hour Before

---

Trial Expiring

7 Days

3 Days

1 Day

---

Proposal Expiry

5 Days

2 Days

1 Day

---

Follow-up Reminder

30 Minutes Before

---

Overdue Follow-up

Every Morning

09:00 AM

---

Deal Won

Notify

Sales Director

Operations

Implementation Team

Finance

---

# 24. API Requirements

GET

/api/sales/dashboard

Returns

Dashboard KPIs

---

GET

/api/leads

Returns

Lead List

---

POST

/api/leads

Create Lead

---

PUT

/api/leads/{id}

Update Lead

---

DELETE

/api/leads/{id}

Archive Lead

---

GET

/api/followups

Return Follow-up Tasks

---

POST

/api/demo

Book Demo

---

POST

/api/trial

Start Trial

---

POST

/api/proposal

Generate Proposal

---

POST

/api/company/convert

Convert Lead

↓

Company

---

GET

/api/reports/dashboard

Dashboard Analytics

---

# 25. Database Tables

sales_leads

Stores

Lead Information

---

sales_followups

Stores

Follow-up Tasks

---

sales_notes

Stores

Internal Notes

---

sales_calls

Call History

---

sales_emails

Email History

---

sales_demos

Demo Bookings

---

sales_trials

Trial Workspaces

---

sales_proposals

Proposal Records

---

sales_pipeline_history

Pipeline Movement

---

sales_activity_logs

Activity Timeline

---

sales_dashboard_metrics

Dashboard KPIs

---

sales_reports

Generated Reports

---

sales_notifications

Notification Queue

---

# 26. Permission Matrix

Sales Director

✓ Everything

---

Sales Manager

✓ Team Dashboard

✓ Team Reports

✓ Assign Leads

✓ Assign Tasks

---

Sales Representative

✓ Own Leads

✓ Book Demo

✓ Trial

✓ Proposal

✓ Notes

---

Read Only

View Dashboard Only

---

# 27. Audit Logs

Every Action Logged

Log Fields

Log ID

User

Action

Entity

Old Value

New Value

IP Address

Browser

Date

Time

---

Examples

Lead Created

Demo Booked

Proposal Sent

Proposal Accepted

Trial Started

Lead Converted

Company Created

Task Deleted

---

# 28. Error Messages

Lead Not Found

Demo Date Required

Presenter Required

Proposal Already Exists

Trial Already Active

Invalid Stage

Access Denied

Network Error

Server Error

Validation Failed

---

# 29. Success Messages

Lead Created Successfully

Demo Scheduled Successfully

Trial Activated

Proposal Sent

Company Converted Successfully

Dashboard Updated

Task Completed

Note Saved

---

# 30. Performance Requirements

Dashboard Load Time

<2 Seconds

---

API Response

<500ms

---

Search Response

<300ms

---

Charts

Load Under

1 Second

---

Support

10,000+

Leads

---

Support

100+

Concurrent Users

---

# 31. Security Requirements

JWT Authentication

Role Based Access Control

Encrypted Passwords

HTTPS Only

CSRF Protection

Rate Limiting

Audit Logging

Session Timeout

Secure File Uploads

SQL Injection Protection

XSS Protection

---

# 32. Acceptance Criteria

Dashboard loads successfully.

All KPI cards display correctly.

Pipeline updates instantly.

Charts display accurate data.

Timeline records all activities.

Tasks save successfully.

Demo booking works.

Trial activation works.

Proposal generation works.

Company conversion works.

Reports export successfully.

Notifications trigger correctly.

Permissions enforced correctly.

---

# 33. Edge Cases

Lead without Email

Duplicate Company

Duplicate Proposal

Trial Expired

Proposal Expired

Deleted Sales User

Inactive Lead

Large Revenue Values

Empty Dashboard

No Reports

No Tasks

Multiple Tabs Editing Same Lead

Lost Internet Connection

Session Timeout

---

# 34. Future Enhancements

AI Lead Scoring

AI Follow-up Suggestions

WhatsApp Integration

LinkedIn Sync

Zoom API

Google Calendar Sync

Microsoft Calendar Sync

Voice Call Recording

AI Meeting Summary

Sales Forecast AI

Revenue Prediction

Auto Proposal Generator

OpenAI Email Writer

Power BI Integration

---

END OF DOCUMENT

Module Status

Production Ready

Version

1.0

Owner

Product Team

Approval

Pending

# 02-Leads.md

> **Module:** Sales Portal → Leads\
> **Version:** 1.0\
> **Status:** Production Ready (Starter Draft)

------------------------------------------------------------------------

# Module Overview

The Leads module is the central CRM workspace used to capture, qualify,
manage, nurture, and convert prospects into active customer companies.

## Primary Objectives

-   Capture inbound and outbound leads
-   Track complete sales lifecycle
-   Assign sales representatives
-   Schedule demos
-   Start trial companies
-   Send proposals
-   Convert qualified leads into companies
-   Maintain complete activity history

------------------------------------------------------------------------

# Main Screens

1.  Leads Dashboard
2.  Lead Registry
3.  Register Inbound Carrier Lead
4.  Lead 360 Profile
5.  Demo Booking
6.  Trial Activation
7.  Proposal Generation
8.  Company Conversion Wizard

------------------------------------------------------------------------

# Lead Pipeline

New Lead → Contacted → Demo Booked → Demo Completed → Trial Started →
Proposal Sent → Negotiation → Won / Lost

------------------------------------------------------------------------

# Lead List

Each Lead Card displays:

-   Company Name
-   Contact Person
-   Email
-   Fleet Size
-   Transport Niche
-   Estimated Revenue
-   Lead Score
-   Sales Aging
-   Current Stage
-   Assigned Sales Rep

------------------------------------------------------------------------

# Search & Filters

-   Search by Company
-   Search by Contact
-   Search by Email
-   Transport Niche
-   Fleet Size
-   Lead Stage
-   Assigned Sales Rep

------------------------------------------------------------------------

# Register Lead Form

Fields:

-   Company Legal Name
-   Contact Person
-   Email
-   Phone
-   Fleet Size
-   Transport Niche
-   Revenue Estimate
-   Assigned Rep
-   Current Software
-   Pain Points
-   Priority
-   Tags
-   Next Follow-up
-   Notes

Validation:

-   Required fields cannot be empty
-   Duplicate email not allowed
-   Fleet size must be numeric

------------------------------------------------------------------------

# Lead Actions

-   View
-   Edit
-   Delete
-   Book Demo
-   Start Trial
-   Send Proposal
-   Mark Won
-   Mark Lost
-   Convert to Company

------------------------------------------------------------------------

# Business Rules

-   Every lead must have one owner.
-   Every stage change is logged.
-   Won leads can be converted into companies.
-   Lost leads remain archived.

------------------------------------------------------------------------

# APIs

GET /api/leads POST /api/leads PUT /api/leads/{id} DELETE
/api/leads/{id}

------------------------------------------------------------------------

# Database Tables

-   sales_leads
-   sales_notes
-   sales_tasks
-   sales_calls
-   sales_emails
-   sales_demos
-   sales_trials
-   sales_proposals
-   sales_activity_logs

------------------------------------------------------------------------

# Acceptance Criteria

-   Lead creation works.
-   Lead editing works.
-   Filters work correctly.
-   Pipeline updates correctly.
-   Activity timeline records all actions.
-   Conversion wizard provisions company successfully.

> **Note:** This is the initial `02-Leads.md` structure. The complete
> enterprise version will expand each section with all forms, modals,
> workflows, permissions, APIs, database schema, validations, and QA
> scenarios.


# 03-Pipeline-Board.md

**Module:** Sales Portal → Pipeline Board\
**Version:** 1.0\
**Status:** Production Ready

------------------------------------------------------------------------

# Module Overview

The Pipeline Board is a Kanban-style CRM workspace that allows the sales
team to manage every lead from first contact until conversion into an
active customer.

------------------------------------------------------------------------

# Business Objective

-   Visualize complete sales pipeline
-   Drag & drop lead movement
-   Track conversion progress
-   Manage sales activities
-   Trigger demos, trials and proposals
-   Convert won leads into active companies

------------------------------------------------------------------------

# Pipeline Stages

1.  New Lead
2.  Contacted
3.  Demo Booked
4.  Demo Completed
5.  Trial Started
6.  Proposal Sent
7.  Negotiation
8.  Won
9.  Lost

------------------------------------------------------------------------

# Lead Card

Each card displays:

-   Company Name
-   Contact Person
-   Email
-   Assigned Sales Rep
-   Fleet Size
-   Transport Niche
-   Estimated Contract Value
-   Lead Score
-   Current Stage
-   Days in Current Stage

Actions:

-   Open Lead
-   Recommend Plan
-   Schedule Demo
-   Start Trial
-   Send Proposal
-   Mark Won
-   Mark Lost

------------------------------------------------------------------------

# Lead 360 Workspace Tabs

-   Overview
-   Timeline
-   Contacts
-   Meetings
-   Calls
-   Emails
-   Tasks
-   Notes
-   Documents
-   Demo
-   Trial
-   Proposals

------------------------------------------------------------------------

# Schedule Zoom Demo

Fields

-   Lead
-   Date
-   Time
-   Presenter
-   Meeting Agenda
-   Internal Notes

Buttons

-   Cancel
-   Confirm Zoom Schedule

------------------------------------------------------------------------

# Proposal Modal

Fields

-   Proposal Title
-   Base License
-   Add-on Items
-   Discount
-   Validity
-   Notes

Buttons

-   Save Draft
-   Send Proposal

------------------------------------------------------------------------

# Convert to Company

Available only for Won leads.

Wizard Steps

1.  Select Plan
2.  Company Information
3.  Admin User
4.  Branch / Depot
5.  Review
6.  Provision Workspace

------------------------------------------------------------------------

# Business Rules

-   Every stage transition is logged.
-   Won leads can be provisioned.
-   Lost leads are archived.
-   Stage transitions follow the configured workflow.

------------------------------------------------------------------------

# APIs

GET /api/pipeline PUT /api/pipeline/{leadId}/stage GET /api/leads/{id}
POST /api/demo POST /api/trial POST /api/proposal POST
/api/company/convert

------------------------------------------------------------------------

# Database Tables

-   sales_pipeline
-   sales_pipeline_history
-   sales_leads
-   sales_activity_logs
-   sales_demos
-   sales_trials
-   sales_proposals

------------------------------------------------------------------------

# Notifications

-   Demo Reminder
-   Trial Expiry
-   Proposal Expiry
-   Follow-up Reminder
-   Deal Won Notification

------------------------------------------------------------------------

# Audit Logs

Log:

-   Stage Changed
-   Demo Booked
-   Trial Started
-   Proposal Sent
-   Deal Won
-   Deal Lost

------------------------------------------------------------------------

# Acceptance Criteria

-   Drag & drop works.
-   Stage changes persist.
-   Timeline updates automatically.
-   Proposal generation works.
-   Company conversion completes successfully.


# Demo Bookings PRD

## 1. Module Overview
The Demo Bookings module manages the complete lifecycle of product demonstrations for prospective customers. It allows the Sales Team to schedule, track, conduct, and review demos while integrating with Leads, Trial Companies, Proposals, and CRM activities.

---

## 2. Business Objectives

- Schedule product demonstrations.
- Prevent scheduling conflicts.
- Track demo status.
- Capture customer feedback.
- Convert demos into trials or proposals.
- Maintain complete audit history.

---

## 3. User Roles

### Sales Director
- Full access

### Sales Manager
- Manage team demos

### Sales Representative
- Create/Edit own demos
- Join meetings
- Submit feedback

### Read Only
- View only

---

## 4. Dashboard KPIs

- Total Demo Bookings
- Upcoming Demos
- Completed Demos
- Cancelled Demos
- Demo Conversion Rate
- Average Demo Duration
- Presenter Performance

---

## 5. Demo Booking List

Columns:

- Company
- Contact Person
- Presenter
- Date
- Time
- Status
- Meeting Link
- Rating
- Created By
- Actions

---

## 6. Search & Filters

Search:
- Company
- Contact
- Presenter
- Email

Filters:
- Upcoming
- Completed
- Cancelled
- Today
- This Week
- This Month
- Presenter

---

## 7. Schedule Zoom Product Walkthrough

Fields

- Lead Prospect
- Demo Date
- Demo Time
- Time Zone
- Meeting Agenda
- Presenter

Buttons

- Confirm Zoom Schedule
- Cancel

---

## 8. Workflow

Lead
→ Demo Booked
→ Reminder Sent
→ Demo Started
→ Demo Completed
→ Feedback Submitted
→ Trial Started OR Proposal Issued

---

## 9. Validation Rules

- Lead required
- Date required
- Time required
- No past dates
- No duplicate bookings
- No presenter conflicts

---

## 10. Demo Status

- Draft
- Scheduled
- Upcoming
- Live
- Completed
- Cancelled

---

## 11. Demo Actions

- Book Demo
- Edit Demo
- Join Zoom
- Send Reminder
- Mark Complete
- Submit Feedback
- Cancel Demo

---

## 12. Feedback Module

Fields

- Rating (1–5)
- Notes

Rules

- Rating mandatory
- One feedback per completed demo

---

## 13. Notifications

- Demo Created
- Reminder Sent
- Demo Updated
- Demo Cancelled
- Demo Completed

Delivery

- Email
- SMS
- In-App Notification

---

## 14. Reports

- Demo Report
- Presenter Report
- Conversion Report

Export

- PDF
- CSV
- Excel

---

## 15. Database

### demo_bookings

- id
- lead_id
- company_id
- presenter_id
- meeting_date
- meeting_time
- timezone
- meeting_link
- agenda
- status
- created_by
- updated_by
- created_at
- updated_at

### demo_feedback

- id
- demo_id
- rating
- feedback
- created_by
- created_at

---

## 16. APIs

GET /demo-bookings

GET /demo-bookings/{id}

POST /demo-bookings

PUT /demo-bookings/{id}

DELETE /demo-bookings/{id}

POST /demo-bookings/{id}/complete

POST /demo-bookings/{id}/feedback

POST /demo-bookings/{id}/reminder

---

## 17. Audit Logs

Track:

- Demo Created
- Demo Updated
- Reminder Sent
- Demo Joined
- Demo Completed
- Feedback Submitted
- Status Changed

Store

- User
- Timestamp
- IP Address
- Browser

---

## 18. Security

- Role Based Access
- Authentication Required
- Audit Logging Enabled
- HTTPS Required

---

## 19. Acceptance Criteria

- Demo can be scheduled successfully.
- Duplicate demos are prevented.
- Conflicts are detected.
- Feedback is stored.
- Reports export successfully.
- Audit logs record every action.


# Trial Companies PRD

# 1. Module Overview

The **Trial Companies** module manages the complete lifecycle of SaaS trial workspaces. It enables the Sales Team and Super Admin to provision trial companies, monitor usage, extend trial periods, simulate login, analyze adoption, and convert successful trials into paid subscriptions.

---

# 2. Business Objectives

- Provision new trial workspaces.
- Track all active trial companies.
- Monitor usage and engagement.
- Manage trial expiry.
- Extend trial duration.
- Login as company for support.
- Convert trial to paid subscription.
- Track trial conversion metrics.

---

# 3. User Roles

## Sales Director
- Full Access

## Sales Manager
- Manage assigned trials

## Sales Representative
- View assigned trials
- Extend trial
- Login As Company

## Super Admin
- Complete Access

## Read Only
- View only

---

# 4. Dashboard Summary Cards

- Active Trial Companies
- Expired Trials
- Expiring Soon
- Converted Trials
- Trial Conversion Rate
- Active Users
- Storage Consumption
- Most Used Modules

---

# 5. Trial Companies Registry

Columns

- Company Name
- Trial Admin
- Trial Status
- Trial Start Date
- Trial End Date
- Days Remaining
- Users
- Storage Used
- Most Used Module
- Assigned Sales Rep
- Actions

Actions

- View Details
- Login As Company
- Extend Trial
- Convert to Paid

---

# 6. Search & Filters

Search

- Company Name
- Admin Name
- Email

Filters

- Active
- Expired
- Expiring Soon
- Converted
- Fleet Size
- Sales Representative

---

# 7. Trial Company Details

Display

- Company Name
- Admin Name
- Contact Email
- Trial Period
- Status
- Days Remaining
- Subscription Recommendation
- Active Users
- Drivers
- Vehicles
- Storage Usage
- API Usage
- Most Used Module

---

# 8. Login As Company

Purpose

Securely simulate customer workspace.

Rules

- RBAC required
- Audit Log mandatory
- Read-only warning banner

---

# 9. Extend Trial

Fields

- Company
- Current Expiry Date
- Extension Days
- Extension Reason

Buttons

- Extend Trial
- Cancel

Business Rules

- Default extension +14 days
- Maximum extension configurable
- Cannot exceed policy limit

---

# 10. Convert Trial to Paid

Workflow

Trial Company
→ Select Subscription Plan
→ Billing
→ Workspace Provision
→ Activate Subscription
→ Company Active

---

# 11. Trial Usage Analytics

Track

- Users
- Drivers
- Fleet
- Branches
- Loads
- Storage
- API Calls
- AI Usage
- Login Count

---

# 12. Trial Status Lifecycle

Draft

↓

Provisioned

↓

Active

↓

Expiring Soon

↓

Expired

↓

Extended

↓

Converted

↓

Archived

---

# 13. Notifications

- Trial Started
- 7 Days Remaining
- 3 Days Remaining
- 1 Day Remaining
- Trial Expired
- Trial Extended
- Trial Converted

Delivery

- Email
- SMS
- In-App

---

# 14. Business Rules

- One active trial per company.
- Company email must be unique.
- Duplicate trials not allowed.
- Trial duration configurable.
- Trial conversion preserves all data.
- Trial extension requires authorization.

---

# 15. Validation Rules

- Company required
- Admin required
- Valid email required
- Start Date required
- End Date greater than Start Date
- Extension cannot overlap
- User quota validation

---

# 16. Reports

- Active Trial Report
- Expiry Report
- Usage Report
- Conversion Report
- Feature Adoption Report

Export

- PDF
- CSV
- Excel

---

# 17. Database Tables

## trial_companies

- id
- company_name
- admin_name
- admin_email
- start_date
- end_date
- status
- assigned_sales_rep
- created_at
- updated_at

## trial_usage

- id
- company_id
- users
- drivers
- vehicles
- storage_used
- api_calls
- ai_requests
- updated_at

## trial_extensions

- id
- company_id
- previous_end_date
- new_end_date
- reason
- approved_by
- created_at

---

# 18. APIs

GET /trial-companies

GET /trial-companies/{id}

POST /trial-companies

PUT /trial-companies/{id}

DELETE /trial-companies/{id}

POST /trial-companies/{id}/extend

POST /trial-companies/{id}/convert

POST /trial-companies/{id}/login

GET /trial-companies/report

---

# 19. Permissions

| Action | Sales Rep | Sales Manager | Sales Director | Super Admin |
|--------|-----------|---------------|----------------|-------------|
| View | ✅ | ✅ | ✅ | ✅ |
| Extend Trial | ✅ | ✅ | ✅ | ✅ |
| Login As Company | ✅ | ✅ | ✅ | ✅ |
| Convert Trial | ❌ | ✅ | ✅ | ✅ |
| Delete | ❌ | ❌ | ✅ | ✅ |

---

# 20. Audit Logs

Capture

- Trial Created
- Trial Extended
- Trial Expired
- Trial Converted
- Login Simulation
- Feature Usage
- Status Changes

Store

- User
- Timestamp
- Browser
- IP Address
- Previous Value
- New Value

---

# 21. Security

- Role Based Access Control
- HTTPS Only
- Session Timeout
- Audit Logging
- Secure Login Simulation
- Encrypted Credentials

---

# 22. Acceptance Criteria

- Trial company creation succeeds.
- Trial limits enforced.
- Extension follows policy.
- Login simulation works.
- Trial converts without data loss.
- Reports export correctly.
- Notifications trigger correctly.
- Audit logs capture every action.
- Permissions enforced.
- UI matches provided Trial Companies design.


# Follow-Ups PRD

## 1. Module Overview
The Follow-Ups module manages sales tasks, reminders, touchpoints, calls, emails and meetings until lead closure.

## 2. Business Objectives
- Manage follow-up tasks
- Track pending activities
- Improve conversions

## 3. Dashboard
- Total Follow-Ups
- Pending
- Completed
- Missed
- Due Today
- Overdue

## 4. Task List
Columns: Company, Contact, Task, Type, Due Date, Priority, Status, Assigned Rep, Actions.

## 5. Create Task
Fields: Task Title, Lead, Task Type, Due Date, Due Time, Priority, Description.

## 6. Status
Created -> Pending -> In Progress -> Completed / Missed / Cancelled.

## 7. Notifications
Email, SMS and In-App reminders before due date.

## 8. Reports
Pending, Completed, Missed and Rep Productivity reports. Export PDF/CSV/Excel.

## 9. Database
follow_up_tasks(id,lead_id,title,task_type,due_date,due_time,priority,status,assigned_to,notes,created_at).

## 10. APIs
GET/POST/PUT/DELETE /follow-ups, complete, reschedule, report.

## 11. Audit Logs
Task Created, Updated, Completed, Rescheduled, Deleted.

## 12. Acceptance Criteria
Tasks, reminders, reports and permissions work correctly.

# Onboarding Handover PRD

# 1. Module Overview
The Onboarding Handover module manages the transition of a Won Sales Opportunity into a fully operational customer workspace. It ensures every provisioning, legal, technical, training, and go-live activity is completed before handing the customer to Operations.

---

# 2. Business Objectives
- Standardize customer onboarding.
- Track onboarding progress.
- Prevent missed setup tasks.
- Ensure legal compliance.
- Coordinate Sales, Operations and Support.
- Convert Won deals into Active Companies.

---

# 3. User Roles
## Sales Director
Full Access

## Sales Manager
Manage handovers

## Sales Representative
View and update assigned handovers

## Operations Admin
Complete provisioning tasks

## Super Admin
Complete access

---

# 4. Dashboard KPIs
- Total Handovers
- Pending
- In Progress
- Completed
- High Risk
- Avg Completion Time
- Due Today
- Overdue

---

# 5. Handovers List
Columns:
- Company
- Owner
- Progress %
- Risk
- Target Date
- Status
- Actions

Actions:
- View
- Edit
- Complete Checklist
- Send Package
- Convert to Active Workspace

---

# 6. Search & Filters
Search:
- Company
- Owner

Filters:
- Pending
- In Progress
- Completed
- High Risk
- Due Today
- Overdue

---

# 7. Setup Handover Stepper
1. Company Workspace Provisioned
2. SaaS Subscription Activated
3. Company Admin Registered
4. Role Permissions Assigned
5. Customer Data Imported
6. Roster & ELD Training
7. Production Go-Live

Each step:
- Pending
- In Progress
- Completed

---

# 8. Legal Checklist
- Signed SLA
- W-9 / Tax Documents
- NDA
- Billing Approval
- Contract Verification

---

# 9. Task Management
Fields:
- Task
- Owner
- Due Date
- Priority
- Notes
- Status

Buttons:
- Add Task
- Complete
- Reassign
- Delete

---

# 10. Progress Rules
Progress auto-calculated from completed checklist items.
0-25% = High Risk
26-75% = Medium Risk
76-100% = Low Risk

---

# 11. Notifications
- Handover Created
- Task Assigned
- Due Reminder
- Overdue Reminder
- Checklist Completed
- Workspace Activated

Channels:
- Email
- In-App
- SMS

---

# 12. Business Rules
- Won deal required.
- Owner mandatory.
- All mandatory checklist items must complete before activation.
- Legal documents required before go-live.

---

# 13. Validation Rules
- Company required.
- Owner required.
- Target date required.
- Cannot activate if mandatory tasks pending.

---

# 14. Reports
- Onboarding Status
- Completion Time
- Risk Report
- Owner Performance

Export:
PDF
CSV
Excel

---

# 15. Database Tables
## onboarding_handovers
- id
- company_id
- owner_id
- progress
- risk
- target_date
- status
- created_at
- updated_at

## onboarding_tasks
- id
- handover_id
- title
- owner
- due_date
- priority
- status

## onboarding_checklist
- id
- handover_id
- item
- completed
- completed_by
- completed_at

---

# 16. APIs
GET /handover
GET /handover/{id}
POST /handover
PUT /handover/{id}
POST /handover/{id}/complete-task
POST /handover/{id}/activate
GET /handover/report

---

# 17. Permissions
| Action | Sales Rep | Sales Manager | Ops Admin | Super Admin |
|---|---|---|---|---|
| View | Yes | Yes | Yes | Yes |
| Edit | Own | Yes | Yes | Yes |
| Complete Tasks | Own | Yes | Yes | Yes |
| Activate Workspace | No | No | Yes | Yes |

---

# 18. Audit Logs
Track:
- Handover Created
- Task Added
- Task Completed
- Checklist Updated
- Package Sent
- Workspace Activated

Store:
- User
- Timestamp
- IP
- Browser

---

# 19. Security
- RBAC
- HTTPS
- Audit Logging
- Session Timeout
- Secure Workspace Activation

---

# 20. Acceptance Criteria
- Won customer appears in handover list.
- Checklist updates progress.
- Mandatory tasks enforced.
- Notifications sent.
- Reports export correctly.
- Workspace activates only after validation.
- Audit logs record all actions.


# Sales Reports PRD

## Module Overview

Sales Reports module provides complete reporting and analytics for the
Sales Portal. It enables management to monitor lead generation,
conversions, revenue, demos, trials, proposals, sales representative
performance, and activity logs.

## Navigation

Sales Portal → Sales Reports

## Tabs

-   Leads
-   Conversions
-   Revenue
-   Demos
-   Trials
-   Proposals
-   Rep Performance
-   Activities

## Leads Report

### KPIs

-   Total Leads
-   New Leads
-   Active Pipeline
-   Won
-   Lost

### Table Columns

-   Company
-   Sales Representative
-   Transport Niche
-   Estimated Revenue
-   Current Stage
-   Lead Score

### Actions

-   Search
-   Filter
-   Export PDF
-   Export CSV/Excel

## Conversion Funnel Report

### Funnel Stages

-   New Lead
-   Contacted
-   Demo Booked
-   Demo Completed
-   Trial Started
-   Proposal Sent
-   Negotiation
-   Won
-   Lost

### Metrics

-   Conversion Rate
-   Demo → Trial Rate
-   Proposal Acceptance Rate

## Revenue Analytics

### KPIs

-   Monthly MRR
-   Annual ARR
-   Pipeline Value

### Charts

-   Revenue by Stage
-   Monthly Trend

## Demo Bookings Report

### KPIs

-   Total Demos
-   Upcoming
-   Completed

### Table

-   Company
-   Presenter
-   Date
-   Time
-   Status
-   Rating

## Trial Workspaces Report

### KPIs

-   Active Trials
-   Expired Trials
-   Expiring Soon

### Details

-   Company
-   Trial Period
-   Status
-   Usage

## Licensing Proposals Report

### KPIs

-   Total Proposals
-   Sent
-   Accepted
-   Total Proposal Value

### Table

-   Company
-   Proposal Value
-   Total
-   Validity
-   Status

## Rep Performance

### KPIs

-   Active Reps
-   Leads
-   Pipeline
-   Won
-   Revenue

### Table

-   Representative
-   Total Leads
-   Pipeline
-   Won Deals
-   Monthly Revenue

## Activities Report

### KPIs

-   Total Leads
-   Demos Logged
-   Trials Provisioned
-   Proposals Issued

## Global Features

-   Date Range Filter
-   Search
-   Export PDF
-   Export CSV
-   Export Excel
-   Sorting
-   Pagination

## Business Rules

-   Reports are role-based.
-   Metrics update from live CRM data.
-   Exports respect active filters.
-   Revenue uses proposal and subscription values.
-   Funnel updates automatically after stage changes.

## Permissions

-   Sales Director: Full access
-   Sales Manager: View + Export
-   Sales Representative: Own records only

## Audit Logs

Track: - Export actions - Filter changes - Report generation - User
access

## Acceptance Criteria

-   Reports load correctly.
-   KPIs match database values.
-   Charts refresh automatically.
-   Export files are generated successfully.
-   Filters work across all tabs.



# Settings PRD

## Module Overview

The Settings module provides centralized configuration for the Sales
Portal. Sales administrators can configure email templates, sales
pipeline stages, lead acquisition sources, and default CRM behavior.

------------------------------------------------------------------------

# Navigation

Sales Portal → Settings

------------------------------------------------------------------------

# Objectives

-   Standardize sales communication.
-   Configure CRM pipeline stages.
-   Maintain lead acquisition sources.
-   Reduce manual configuration.
-   Support reusable email templates.

------------------------------------------------------------------------

# Sections

## 1. Email & Touchpoint Templates

### Purpose

Manage reusable email templates used throughout the sales lifecycle.

### Fields

-   Template Selector
-   Subject Line
-   Email Body Editor
-   Merge Tags Preview

### Supported Templates

-   Welcome Sandbox Invite
-   Trial Invitation
-   Demo Confirmation
-   Proposal Email
-   Follow-up Reminder
-   Trial Expiry Reminder
-   Deal Won Welcome

### Merge Tags

-   {{contact_name}}
-   {{company_name}}
-   {{rep_name}}
-   {{trial_end_date}}
-   {{proposal_link}}

### Actions

-   Save Template
-   Preview Template
-   Reset Default

------------------------------------------------------------------------

## 2. Pipeline Stages

### Purpose

Configure CRM workflow stages.

### Default Stages

1.  New Lead
2.  Contacted
3.  Demo Booked
4.  Demo Completed
5.  Trial Started
6.  Proposal Sent
7.  Negotiation
8.  Won
9.  Lost

### Features

-   Add Stage
-   Rename Stage
-   Reorder Stage
-   Disable Stage
-   Delete Custom Stage

### Validation

-   Default stages cannot be deleted.
-   Stage names must be unique.

------------------------------------------------------------------------

## 3. Lead Acquisition Sources

### Purpose

Manage available lead sources.

### Default Sources

-   Google Search
-   LinkedIn
-   Partner Referral
-   Cold Call

### Features

-   Add Source
-   Edit Source
-   Delete Custom Source
-   Activate/Deactivate Source

------------------------------------------------------------------------

# Business Rules

-   Template changes affect future emails only.
-   Pipeline changes apply to new CRM activities.
-   Deleted sources are hidden but preserved in history.
-   Merge tags are validated before saving.

------------------------------------------------------------------------

# Permissions

## Sales Director

-   Full access

## Sales Manager

-   View/Edit

## Sales Representative

-   View only

------------------------------------------------------------------------

# Audit Logs

Track: - Template Updated - Stage Created - Stage Modified - Stage
Deleted - Source Added - Source Updated - Settings Saved

------------------------------------------------------------------------

# Database Tables

-   email_templates
-   pipeline_stages
-   lead_sources
-   audit_logs

------------------------------------------------------------------------

# APIs

-   GET /settings/templates
-   PUT /settings/templates
-   GET /settings/pipeline
-   POST /settings/pipeline
-   GET /settings/sources
-   POST /settings/sources

------------------------------------------------------------------------

# Acceptance Criteria

-   Templates save successfully.
-   Merge tags render correctly.
-   Pipeline updates immediately.
-   Lead sources are available in Lead forms.
-   Audit logs capture every configuration change.


# Driver-Dashboard-PRD.md

# Driver Dashboard

## Module Overview

The Driver Dashboard is the primary landing page for authenticated
drivers. It provides a real-time operational overview including duty
status, assigned loads, schedule, HOS (Hours of Service), messages,
alerts, pay summary, and quick operational actions.

------------------------------------------------------------------------

# Business Objectives

-   Give drivers one centralized operational dashboard.
-   Reduce navigation time.
-   Display live dispatch information.
-   Improve HOS compliance.
-   Improve safety compliance.
-   Allow fast communication with dispatch.
-   Display current earnings and upcoming work.

------------------------------------------------------------------------

# Dashboard Header

### Display

-   Driver Name
-   Driver Initials Avatar
-   Current Duty Status
-   Last Sync Timestamp
-   Assigned Vehicle
-   Vehicle Registration
-   Odometer Reading

Example

-   Welcome back, Noah Williams
-   Vehicle: TX-ROAD88
-   Freightliner Cascadia
-   Odometer: 245,678 km

------------------------------------------------------------------------

# Driver Status

Supported Statuses

-   On Duty
-   In Transit
-   On Break
-   Off Duty

Actions

-   Change Status
-   Save Status
-   Log Status History

Business Rules

-   Only one active status.
-   Status history must be logged.
-   Dispatch sees changes instantly.

------------------------------------------------------------------------

# Primary Action Buttons

-   Start Pre-Start Checklist
-   Message Dispatch
-   View My Loads
-   Upload Document
-   Clock In / Clock Out

------------------------------------------------------------------------

# KPI Cards

## Loads Today

Displays: - Total Loads Today - Upcoming Loads - Next Load Time

## Completed This Week

Displays: - Deliveries Completed - SLA Percentage

## Drive Time Today

Displays: - Drive Time - Remaining HOS Hours

## Diesel Balance

Displays: - Fuel Remaining - Estimated Range

## Pay This Period

Displays: - Gross Pay - Before Tax

------------------------------------------------------------------------

# Status Filter

Supported Filters

-   All
-   On Duty
-   In Transit
-   Upcoming
-   Completed

------------------------------------------------------------------------

# Current Load Card

Displays

-   Load ID
-   Status
-   Pickup City
-   Delivery City
-   Pickup Time
-   Pickup Address
-   Delivery Time
-   Delivery Address
-   Load Type
-   Reference Number

Buttons

-   View Active Run
-   Upload Document

------------------------------------------------------------------------

# Today's Schedule

Display

-   Time
-   Activity
-   Location
-   Load ID

Activities

-   Pickup
-   Delivery
-   POD & Close

------------------------------------------------------------------------

# Next Load

Display

-   Date
-   Route
-   Load Number

------------------------------------------------------------------------

# HOS (Hours of Service)

Display

-   Next Break Due
-   Work Time Remaining
-   Shift Elapsed
-   Maximum Shift

Buttons

-   Log Rest Break
-   View HOS Logbook

Business Rules

-   Calculate automatically.
-   Alert before HOS violation.
-   Prevent illegal driving hours.

------------------------------------------------------------------------

# Messages

Display

-   Sender
-   Department
-   Time
-   Preview
-   Unread Count

Functions

-   Quick Reply
-   Send Message
-   View Conversation

------------------------------------------------------------------------

# Alerts

Examples

-   Pre-start Checklist Pending
-   Medical Certificate Expiring
-   Licence Expiry
-   Vehicle Maintenance
-   Document Expiry

Actions

-   View Alert
-   Mark Read

------------------------------------------------------------------------

# Pay Summary

Displays

-   Current Pay Period
-   Gross Earnings
-   Before Tax

Action

-   View Pay Summary

------------------------------------------------------------------------

# Notifications

-   New Load Assigned
-   Load Updated
-   Dispatch Message
-   HOS Warning
-   Safety Reminder
-   Payroll Ready
-   Document Expiry

------------------------------------------------------------------------

# Permissions

Driver Can

-   View Own Loads
-   Update Status
-   Upload Documents
-   Complete Checklist
-   Send Messages
-   View Pay
-   View HOS

Driver Cannot

-   Modify Loads
-   Edit Fleet
-   Change Payroll
-   Assign Drivers

------------------------------------------------------------------------

# Validation Rules

-   Driver must be Clocked In before starting work.
-   Checklist required before trip.
-   HOS must remain compliant.
-   Mandatory fields cannot be blank.
-   GPS must be enabled during active trip.

------------------------------------------------------------------------

# Database Tables

-   drivers
-   driver_status_logs
-   driver_dashboard
-   loads
-   load_assignments
-   hos_logs
-   driver_messages
-   alerts
-   payroll
-   documents

------------------------------------------------------------------------

# APIs

GET /driver/dashboard

GET /driver/loads

PUT /driver/status

GET /driver/schedule

GET /driver/messages

POST /driver/messages

GET /driver/pay

GET /driver/hos

POST /driver/documents

------------------------------------------------------------------------

# Audit Logs

Record

-   Status Changes
-   Checklist Started
-   Checklist Completed
-   Documents Uploaded
-   Messages Sent
-   Clock In
-   Clock Out
-   HOS Events

------------------------------------------------------------------------

# Acceptance Criteria

-   Dashboard loads within 3 seconds.
-   Driver sees only assigned information.
-   Status updates immediately.
-   Live load information is accurate.
-   HOS calculations are correct.
-   Alerts display correctly.
-   Messages sync successfully.
-   Pay summary matches payroll.
-   Audit logs record all actions.



# Safety-Checklist-PRD.md

# Safety Checklist (Pre-Start Inspection)

## Module Overview

The Safety Checklist module ensures every driver completes a mandatory
pre-start inspection before commencing a trip. It verifies vehicle
roadworthiness, safety equipment, driver fitness, and Chain of
Responsibility (CoR) compliance.

------------------------------------------------------------------------

# Objectives

-   Improve fleet safety.
-   Ensure legal compliance.
-   Prevent unsafe vehicle operation.
-   Capture inspection history.
-   Record defects with evidence.

------------------------------------------------------------------------

# Navigation

Driver Portal → Start Pre-Start Checklist

------------------------------------------------------------------------

# Dashboard Header

Displays: - Checklist Status - Last Saved Timestamp - Sync Status - Next
Reminder - Vehicle - Trailer - Load Reference - Date & Time

------------------------------------------------------------------------

# Key Actions

-   Save Draft
-   Submit Checklist
-   Report Defect
-   Upload Photo
-   View History
-   Message Dispatch

------------------------------------------------------------------------

# Checklist Progress

Displays: - Total Items - Completed - Passed - Failed - N/A - Not
Checked - Progress Percentage

------------------------------------------------------------------------

# Inspection Categories

## Vehicle & Equipment Checks

1.  Brakes (Service & Park Brake)
2.  Tyres -- Condition & Pressure
3.  Head / Tail / Brake / Reverse Lights
4.  Indicators & Hazard Lights
5.  Steering & Suspension
6.  Windscreen / Windows / Mirrors
7.  Wipers & Washer
8.  Horn
9.  Seat Belts / Airbags
10. Fire Extinguisher
11. First Aid Kit
12. Load Securement Equipment
13. Fluid Levels (Oil, Coolant, Brake Fluid)
14. Fuel Level
15. Oil / Fuel / Air Leaks
16. Body / Chassis / Coupling
17. Load Area Clear & Safe
18. Driver Fatigue / Fitness
19. Load Secured / Straps / Chains
20. Other Notes / Additional Checks

Each inspection item supports: - Pass (Yes) - Fail (No) - N/A - Optional
Notes - Photo Attachment

------------------------------------------------------------------------

# Defect Reporting

Fields - Defect Category - Severity - Description - Vehicle - Trailer -
Photos - GPS Location - Timestamp

Actions - Save Defect - Notify Dispatch - Create Maintenance Request

Business Rule: Any failed critical item blocks trip start until resolved
or overridden by an authorized manager.

------------------------------------------------------------------------

# Photo Upload

Supported Formats - JPG - PNG - HEIC

Rules - Maximum 10 MB per photo - Multiple photos allowed - Timestamp
stored - GPS metadata stored

Suggested Photos - Front - Rear - Left - Right - Cabin - Damage Area

------------------------------------------------------------------------

# Checklist Summary

Displays - Passed Count - Failed Count - N/A Count - Not Checked Count

------------------------------------------------------------------------

# Requirements

-   Complete all mandatory items.
-   Resolve failed safety-critical items.
-   Submit checklist before departure.
-   Keep inspection history.

------------------------------------------------------------------------

# History

Display - Inspection Date - Vehicle - Result - Pass % - Submitted By

Actions - View Details - Download PDF

------------------------------------------------------------------------

# Help & Resources

-   Safety Procedures
-   Vehicle Inspection Guide
-   Report Incident
-   Contact Support

------------------------------------------------------------------------

# Notifications

-   Daily Checklist Reminder
-   Checklist Submitted
-   Checklist Rejected
-   Critical Defect Found
-   Maintenance Created

------------------------------------------------------------------------

# Permissions

Driver - Complete Checklist - Upload Photos - Report Defect - View
History

Dispatcher - View Submitted Checklists

Fleet Manager - Review - Approve - Reject - Create Maintenance Job

------------------------------------------------------------------------

# Validation Rules

-   Mandatory items cannot remain unchecked.
-   Driver must be clocked in.
-   Vehicle must be assigned.
-   Critical failures require defect report.
-   Photos required for reported defects.

------------------------------------------------------------------------

# Database Tables

-   safety_checklists
-   checklist_items
-   checklist_photos
-   defect_reports
-   maintenance_requests
-   vehicles
-   trailers
-   audit_logs

------------------------------------------------------------------------

# APIs

-   GET /driver/checklist
-   POST /driver/checklist
-   PUT /driver/checklist
-   POST /driver/checklist/photos
-   POST /driver/defects
-   GET /driver/checklist/history

------------------------------------------------------------------------

# Audit Logs

Track: - Checklist Started - Draft Saved - Checklist Submitted - Defect
Reported - Photos Uploaded - Maintenance Triggered

------------------------------------------------------------------------

# Acceptance Criteria

-   Driver cannot start work without mandatory checklist.
-   Progress updates in real time.
-   Failed critical items create alerts.
-   Photos upload successfully.
-   Inspection history is searchable.
-   Audit trail records every action.





# Assigned-Jobs-PRD.md

# Assigned Jobs Module PRD

Version: 1.0
Module: Driver Portal → Assigned Jobs

---

# 1. Module Overview

The Assigned Jobs module is the driver's primary workspace for viewing, managing, and tracking all freight loads assigned to them.

It allows drivers to:

- View upcoming loads
- Monitor active jobs
- Review completed loads
- View cancelled jobs
- Search assigned work
- Filter loads
- Create load requests (Owner Driver Mode)
- Edit permitted load information
- Sync latest dispatch updates

This module acts as the central job management screen before Pickup & Loading begins.

---

# 2. Objectives

- Display every assigned load.
- Reduce missed pickups.
- Improve driver planning.
- Provide quick load search.
- Enable dispatch communication.
- Allow owner drivers to request loads.
- Keep job information synchronized.

---

# 3. Navigation

Driver Portal

→ Assigned Jobs

---

# 4. Dashboard Summary Cards

Display the following KPI cards.

## Upcoming Loads

Purpose

Shows upcoming scheduled jobs.

Display

- Total Upcoming Loads
- Change Indicator
- Next Pickup Time

Example

Upcoming

2

Next:
08:00 AM Today

---

## In Progress

Purpose

Displays currently active loads.

Display

- Active Loads
- Status

Example

In Progress

2

Active Loads

---

## Completed

Purpose

Shows completed deliveries.

Display

- Completed Count
- Weekly SLA

Example

Completed

3

100% SLA

---

## Cancelled

Purpose

Cancelled assignments.

Display

- Cancelled Count

---

## Total Jobs

Displays

- Total Assigned Jobs

---

# 5. Search

Search Placeholder

Search by:

- Load ID
- Reference Number
- Customer
- Pickup
- Delivery
- Route

Search updates instantly.

---

# 6. Job Tabs

Tabs

- All
- Upcoming
- In Progress
- Completed
- Cancelled

Selecting a tab filters jobs.

---

# 7. Job Table

Columns

- Load ID
- Status
- Route
- Pickup
- Delivery
- Load Type
- Stops
- Date
- Time
- Reference Number
- Actions

---

# 8. Status Definitions

Upcoming

Load not started.

In Progress

Driver has started.

Completed

Delivery finished.

Cancelled

Dispatch cancelled load.

---

# 9. Job Actions

Each job supports:

- View Details
- Edit (if permitted)
- Open Pickup Workflow
- Open Active Run
- View Route
- Contact Dispatch

---

# 10. Create New Load Request

Purpose

Owner Drivers can request new work.

Fields

Origin City

Destination City

Pickup Address

Delivery Address

Pickup Date

Pickup Time

Delivery Date

Delivery Time

Customer

Reference Number

Load Type

Stops

Notes

Buttons

Cancel

Submit Request

---

# 11. Edit Assigned Job

Editable Fields

Pickup

Delivery

Customer

Stops

Reference

Notes

Status

Buttons

Cancel

Save Changes

Only editable before dispatch.

---

# 12. Filters

Filter By

Status

Load Type

Date

Customer

Route

Stops

Reference

---

# 13. Pagination

Display

Current Page

Total Pages

Rows Per Page

Next

Previous

---

# 14. Refresh Controls

Actions

Refresh List

Sync Now

Auto Refresh

Display

Last Sync Time

Connection Status

Refresh Interval

Example

Every 5 Minutes

---

# 15. Quick Actions

Buttons

Refresh List

Message Dispatch

View Calendar

Sync Now

---

# 16. Load Detail Preview

Clicking a row opens preview.

Information

Load ID

Pickup

Delivery

Reference

Vehicle

Trailer

Stops

Load Type

Status

Customer

Assigned Date

Notes

---

# 17. Business Rules

Only assigned loads appear.

Completed loads become read-only.

Cancelled jobs cannot be started.

Only dispatch can assign loads.

Owner Driver mode can submit requests.

---

# 18. Notifications

Driver receives notifications for:

New Assignment

Load Updated

Pickup Changed

Delivery Changed

Load Cancelled

Dispatch Message

---

# 19. Permissions

Driver

View Jobs

Search

Filter

Edit Allowed Fields

Create Load Request (Owner Driver)

Dispatcher

Assign Jobs

Modify Jobs

Cancel Jobs

Fleet Manager

View All

Override

Reassign

---

# 20. Validation Rules

Pickup required.

Delivery required.

Reference must be unique.

Date cannot be invalid.

Completed jobs cannot be edited.

Cancelled jobs cannot be restarted.

---

# 21. Database Tables

loads

load_assignments

drivers

customers

vehicles

trailers

stops

load_notes

dispatch_messages

audit_logs

---

# 22. APIs

GET /driver/jobs

GET /driver/jobs/:id

POST /driver/job-request

PUT /driver/jobs/:id

GET /driver/jobs/search

GET /driver/jobs/filter

POST /driver/jobs/sync

---

# 23. Audit Logs

Track

Job Assigned

Job Edited

Request Submitted

Status Updated

Sync Executed

Dispatch Viewed

Search Performed

Filter Applied

---

# 24. Acceptance Criteria

✓ Driver sees all assigned jobs.

✓ Search returns accurate records.

✓ Filters work correctly.

✓ Summary cards update automatically.

✓ Owner Driver can submit load requests.

✓ Editing follows permission rules.

✓ Sync updates latest dispatch information.

✓ Audit logs record every important action.

✓ Responsive across Desktop, Tablet, and Mobile.

✓ Integrated with Pickup & Loading workflow.




# Pickup & Loading Module PRD

Version: 1.0
Module: Driver Portal → Pickup & Loading

---

# 1. Module Overview

The Pickup & Loading module manages the complete pickup workflow for every assigned vehicle before dispatch.

Drivers can:

- View pickup location
- Scan VIN barcodes
- Verify assigned vehicles
- Add owner-driver vehicles
- Remove incorrect vehicles
- Edit vehicle details
- Capture pickup photos
- Confirm pickup completion
- Validate load before dispatch

Every pickup action is GPS, timestamp and audit logged.

---

# 2. Objectives

- Prevent loading incorrect vehicles.
- Verify every VIN.
- Ensure all assigned vehicles are collected.
- Maintain Chain of Responsibility (CoR).
- Prepare load for dispatch.
- Capture complete pickup evidence.

---

# 3. Navigation

Driver Portal

→ Pickup & Loading

---

# 4. Header Information

Display

Load ID

Route

Pickup Time

Estimated Finish

Load Type

Truck

Trailer

Driver

Current Mode

Auto Save Status

Example

LD-3987

Melbourne

↓

Sydney

Pickup
08:00 AM

Truck

TRK-101

Trailer

TRL-205

Auto Save Enabled

---

# 5. Pickup Summary

Display

Pickup Location

Total Cars

Picked Up

Remaining

Completion %

Dispatch Status

Example

Total Cars

8

Picked Up

3

Remaining

5

38%

---

# 6. Pickup Location Card

Display

Pickup Company

Street Address

Google Map Link

Directions

Contact Person

Phone Number

Special Instructions

---

# 7. Driver Mode

Supported Modes

Assigned Driver Mode

Owner Driver Mode

Assigned Mode

Driver cannot modify assigned vehicles.

Owner Driver Mode

Driver may

Add Cars

Remove Cars

Edit Destinations

Edit Vehicle Details

Switch Modes

Assigned

↓

Owner Driver

---

# 8. Vehicle Groups

Vehicles grouped by delivery stop.

Example

DROP 1

Auto World Sydney

DROP 2

Newcastle Motors

DROP 3

Gold Coast Autos

DROP 4

Brisbane Depot

Each section displays

Number of Cars

Destination

Completion

---

# 9. Vehicle Card

Each vehicle displays

VIN

Registration

Make

Model

Colour

Destination

Pickup Status

Pickup Time

Current Deck

Photo Status

Damage Flag

Example

Toyota Camry

VIN

1HGCM82633A004352

ABC123

Picked Up

08:12 AM

---

# 10. Vehicle Status

Possible Status

Not Picked Up

Picked Up

Wrong Vehicle

Removed

Added

Damaged

---

# 11. VIN Barcode Scanner

Purpose

Scan VIN using device camera.

Scanner Features

Live Camera

Flash

Auto Focus

1080p HD

Manual VIN Entry

Barcode Recognition

Vehicle Selection

Buttons

Open Scanner

Scan VIN

Flash

Cancel

---

# 12. VIN Validation Rules

If VIN belongs to assigned load

Mark Picked Up

If VIN not assigned

Show

Wrong Vehicle

Blocked

Driver cannot continue.

Message

Vehicle not assigned to this pickup.

---

# 13. Manual VIN Entry

Fields

VIN

Search

Validate

Mark Picked Up

---

# 14. Add Vehicle

Owner Driver only.

Fields

Drop Location

Make

Model

VIN

Registration

Colour

Year

Customer

Buttons

Save

Cancel

---

# 15. Edit Vehicle

Editable

Destination

Registration

Colour

Notes

Buttons

Save

Cancel

---

# 16. Remove Vehicle

Owner Driver only.

Confirmation Required

Reason

Vehicle unavailable

Cancelled

Customer Request

Wrong Assignment

Other

---

# 17. Pickup Photos

Driver may upload

Front

Rear

Left

Right

Interior

Damage

VIN Plate

Loading Position

Rules

Maximum 10MB

JPG

PNG

HEIC

Unlimited Company Limit

GPS Tagged

Timestamp Stored

---

# 18. Damage Reporting

Fields

Damage Type

Severity

Description

Photos

Location

Customer Signature

Dispatch Notification

---

# 19. Auto Save

Every action saves automatically.

Examples

VIN Scanned

Photo Uploaded

Vehicle Added

Vehicle Removed

Vehicle Edited

GPS Updated

---

# 20. Pickup Progress

Display

Total Cars

Scanned

Remaining

Percentage

Example

8 Cars

3 Picked Up

5 Remaining

38%

Progress Bar

---

# 21. Pickup Completion Rules

Before completion

Every assigned vehicle scanned.

No invalid VIN.

Required photos uploaded.

Mandatory checks completed.

---

# 22. Confirm Pickup

Button

Confirm All Cars Picked Up

Confirmation

All assigned vehicles collected.

Continue?

Buttons

Yes

Cancel

---

# 23. Completion Workflow

Vehicle Pickup

↓

Pickup Complete

↓

Dispatch Ready

↓

Driver returns to Active Run

↓

Dispatch Button Enabled

---

# 24. Quick Actions

Scan VIN

Add Vehicle

Call Dispatch

View Load

Open Yard Map

Directions

Upload Photo

Report Damage

---

# 25. Business Rules

Wrong VIN cannot be accepted.

Every pickup recorded.

Every scan stores GPS.

Vehicle cannot be dispatched twice.

Dispatch unavailable until pickup complete.

Owner Driver permissions override vehicle editing.

---

# 26. Notifications

Vehicle Picked Up

Wrong Vehicle

Pickup Completed

Dispatch Ready

Damage Report Submitted

Photo Uploaded

Vehicle Added

Vehicle Removed

---

# 27. Permissions

Driver

Scan VIN

Upload Photos

Report Damage

Confirm Pickup

Dispatcher

View Pickup Progress

Fleet Manager

Override Pickup

Add Vehicle

Approve Changes

---

# 28. Database Tables

loads

load_items

pickup_events

pickup_photos

pickup_damage_reports

vehicles

vehicle_scans

gps_logs

audit_logs

---

# 29. APIs

GET /driver/pickup

POST /driver/pickup/scan

POST /driver/pickup/manual

POST /driver/pickup/photo

POST /driver/pickup/add-vehicle

PUT /driver/pickup/edit-vehicle

DELETE /driver/pickup/remove-vehicle

POST /driver/pickup/complete

GET /driver/pickup/status

---

# 30. Audit Logs

Track

VIN Scanned

Manual VIN Entered

Wrong Vehicle

Vehicle Added

Vehicle Removed

Vehicle Edited

Photo Uploaded

Damage Report

Pickup Completed

GPS Recorded

Dispatch Enabled

---

# 31. Acceptance Criteria

✓ Driver can scan VIN successfully.

✓ Wrong VIN is rejected.

✓ Pickup progress updates instantly.

✓ Auto Save works for every action.

✓ GPS stored for every pickup.

✓ Photos upload successfully.

✓ Owner Driver permissions work correctly.

✓ Pickup cannot complete until all assigned vehicles are collected.

✓ Dispatch activates only after pickup completion.

✓ Full audit trail maintained.




# Dispatch & Active Run Module PRD

Version: 1.0
Module: Driver Portal → Dispatch & Active Run

---

# 1. Module Overview

The Dispatch & Active Run module manages the driver's journey after completing pickup. Once all assigned vehicles have been successfully scanned and loaded, the driver dispatches the load and begins the transport journey.

This module provides:

- Dispatch Confirmation
- Active Run Dashboard
- GPS Navigation
- Route Progress
- Next Stop Management
- Vehicle Tracking
- ETA Monitoring
- Customer Notifications
- Driver Notes
- Incident Reporting
- Live Status Updates

All dispatch activities are automatically GPS and timestamp logged.

---

# 2. Objectives

- Start transport legally.
- Record dispatch location.
- Track driver progress.
- Update customers automatically.
- Provide live navigation.
- Maintain complete audit trail.

---

# 3. Navigation

Driver Portal

→ Dispatch & Active Run

---

# 4. Dashboard Header

Display

- Load ID
- Route
- Pickup Time
- Estimated Finish
- Truck
- Trailer
- Driver
- Current Status

Example

LD-3987

Melbourne VIC

↓

Sydney NSW

Truck

MAN TGX 26.580

Trailer

TRL-205

Status

Ready to Dispatch

---

# 5. Progress Tracker

Three-step workflow

✓ Picked Up

↓

Dispatch

↓

Delivered

Display

- Picked Up Vehicles
- Dispatch Status
- Delivered Vehicles

Example

Picked Up

8 / 8

Dispatch

Pending

Delivered

0 / 8

---

# 6. Dispatch Readiness

Dispatch button becomes available only when:

- All assigned vehicles picked up
- VIN validation completed
- Required photos uploaded
- Mandatory checklist completed
- No critical defects exist

---

# 7. Next Stop Card

Display

- Destination
- Address
- Contact Person
- Phone Number
- ETA
- Distance Remaining
- Delivery Instructions

Actions

- Directions
- Call Contact

---

# 8. Dispatch Confirmation Modal

Title

Confirm Leave Yard & Dispatch

Display

- Load ID
- Pickup Yard
- Pickup Status
- Total Vehicles
- GPS Location
- Current Time

Departure Checklist

- All vehicles secured
- Straps checked
- Height clearance verified
- Gate pass verified
- Shipping documents verified

Buttons

- Confirm Leave Yard & Dispatch
- Cancel

---

# 9. Dispatch Process

Workflow

Pickup Complete

↓

Dispatch Confirmation

↓

GPS Recorded

↓

Timestamp Recorded

↓

Customer Notification

↓

Dispatch Notification

↓

Load Status = In Transit

↓

Driver Navigation Starts

---

# 10. Dispatch Success Screen

Display

- Dispatch Successful
- Departure Time
- GPS Coordinates
- Origin Yard
- Total Vehicles
- Customer Notification Status

Buttons

- Open GPS Navigation
- View Active Run
- Close

---

# 11. Active Run Dashboard

Display

- Pickup Location
- Delivery Location
- Total Cars
- Truck
- Trailer
- Driver
- Status
- Distance Remaining
- ETA

---

# 12. Vehicle Summary

Display

- Total Cars
- Picked Up
- Delivered
- Remaining

Vehicle status updates automatically.

---

# 13. GPS Navigation

Display

- Destination
- Distance
- ETA
- Estimated Arrival

Buttons

- Open Google Maps
- Open Waze

---

# 14. Route Tracking

System tracks

- Current GPS
- Speed
- Heading
- Distance Travelled
- Distance Remaining
- Live ETA

Auto Refresh

Every 30 seconds

---

# 15. Driver Status

Available Status

- Ready
- Dispatched
- In Transit
- On Break
- Arrived
- Delivered
- Completed

Status updates automatically.

---

# 16. Quick Actions

Buttons

- Scan Vehicles
- Upload Photo
- Add Job Note
- Message Dispatch
- Report Issue
- Call Dispatch
- Open Navigation

---

# 17. Scan / Select Vehicles

Displays all assigned vehicles.

Information

- Make
- Model
- VIN
- Deck Position
- Scan Status

Button

Confirm All Scanned Vehicles

---

# 18. Photo Upload

Supported Photos

- Vehicle
- Damage
- Load Position
- Trailer
- Incident

Formats

- JPG
- PNG
- HEIC

Maximum Size

10 MB

GPS and Timestamp stored automatically.

---

# 19. Driver Notes

Fields

- Note
- Category
- Visibility

Categories

- Pickup
- Delivery
- Delay
- Customer
- Vehicle
- Incident

---

# 20. Report Issue

Issue Types

- Breakdown
- Traffic
- Accident
- Vehicle Damage
- Customer Delay
- Weather
- Other

Attachments

- Photos
- Notes
- GPS

Automatically notify Dispatch.

---

# 21. Customer Notifications

Automatically send

- Load Dispatched
- Driver En Route
- ETA Updated
- Delay Notification
- Arrival Notification

Methods

- SMS
- Email
- Push Notification

---

# 22. Live Sync

Display

- Last Sync Time
- Connection Status

Buttons

- Sync Now

Auto Sync

Every 30 Seconds

---

# 23. Business Rules

- Dispatch allowed only after pickup completion.
- GPS mandatory during dispatch.
- Every dispatch recorded.
- Customer notified automatically.
- Dispatch cannot be reversed without manager approval.
- ETA recalculated continuously.

---

# 24. Notifications

Driver receives

- Route Updated
- Traffic Alert
- Customer Message
- Dispatch Message
- Delay Warning
- Delivery Reminder

---

# 25. Permissions

Driver

- Dispatch Load
- Navigate
- Upload Photos
- Add Notes
- Report Issue

Dispatcher

- Monitor Run
- Send Messages
- Update Route

Fleet Manager

- Override Dispatch
- View Live Tracking
- Reassign Load

---

# 26. Database Tables

- loads
- load_dispatch
- driver_runs
- gps_tracking
- run_notes
- run_photos
- route_updates
- customer_notifications
- audit_logs

---

# 27. APIs

GET /driver/run

POST /driver/run/dispatch

POST /driver/run/photo

POST /driver/run/note

POST /driver/run/report-issue

POST /driver/run/status

GET /driver/run/navigation

GET /driver/run/tracking

POST /driver/run/sync

---

# 28. Audit Logs

Track

- Dispatch Started
- GPS Recorded
- Dispatch Confirmed
- Navigation Opened
- Route Updated
- ETA Changed
- Issue Reported
- Note Added
- Photo Uploaded
- Customer Notified

---

# 29. Acceptance Criteria

✓ Driver cannot dispatch before pickup completion.

✓ Dispatch records GPS automatically.

✓ Timestamp recorded correctly.

✓ Customer receives dispatch notification.

✓ Navigation opens correctly.

✓ Route updates in real time.

✓ Driver notes save successfully.

✓ Issues notify dispatch instantly.

✓ ETA recalculates continuously.

✓ Complete audit trail maintained.

✓ Responsive on Mobile, Tablet and Desktop.

✓ Fully integrated with Pickup & Loading and Delivery & POD modules.


# Delivery & POD Module PRD

Version: 1.0

Module:
Driver Portal → Delivery & POD

---

# 1. Module Overview

The Delivery & Proof of Delivery (POD) module manages the complete delivery workflow after the driver reaches the destination.

The module ensures:

- Correct vehicle delivery
- VIN verification
- Delivery confirmation
- Vehicle inspection
- Damage recording
- Delivery photographs
- Customer signature
- POD generation
- Customer notification
- Load completion

Every action performed inside this module is automatically GPS tagged, timestamped and audit logged.

---

# 2. Objectives

- Deliver the correct vehicle.
- Verify VIN before handover.
- Capture delivery evidence.
- Collect customer signature.
- Record damages if found.
- Generate legal Proof of Delivery.
- Close transport job.

---

# 3. Navigation

Driver Portal

↓

Delivery & POD

---

# 4. Dashboard Header

Display

- Load ID
- Route
- Driver
- Truck
- Trailer
- Total Vehicles
- Delivered Vehicles
- Remaining Vehicles
- Delivery Status

---

# 5. Delivery Summary

Display

- Total Cars
- Delivered
- Remaining
- Delivery Location
- Customer Name
- ETA
- Arrival Time

---

# 6. Delivery Stops

Display

- Stop Number
- Customer Name
- Delivery Address
- Contact Person
- Contact Number
- Instructions

Actions

- Open Navigation
- Call Customer

---

# 7. Vehicle Delivery List

Each vehicle displays

- Make
- Model
- VIN
- Registration
- Deck Position
- Delivery Status
- Damage Status

Status

- Pending
- Ready
- Delivered
- Refused
- Damaged

---

# 8. VIN Verification

Driver must scan VIN before unloading.

Methods

- Camera Scanner
- Manual VIN Entry

Rules

Correct VIN

↓

Allow Delivery

Wrong VIN

↓

Show Error

↓

Block Delivery

---

# 9. Vehicle Inspection

Driver checks

- Exterior
- Interior
- Glass
- Wheels
- Lights
- Accessories
- Existing Damage
- New Damage

---

# 10. Damage Report

Fields

Damage Type

Severity

Description

Photos

Customer Comments

Driver Notes

GPS

Timestamp

Buttons

Save Damage Report

Notify Dispatch

---

# 11. Delivery Photos

Mandatory Photos

Front

Rear

Left Side

Right Side

VIN Plate

Delivered Position

Damage Photos (If Required)

Rules

JPG

PNG

HEIC

Maximum 10MB

GPS Tagged

Timestamp Stored

---

# 12. Customer Signature POD

Purpose

Collect customer's digital signature as proof of successful delivery.

Fields

Receiver Full Name *

Example

Mark Robinson

Signature Pad *

Draw Signature

Buttons

Clear Drawing

Save Signature

Validation

Receiver name mandatory

Signature mandatory

GPS mandatory

Timestamp mandatory

Business Rules

Customer cannot complete delivery without signature unless company policy allows "Signature Exception".

---

# 13. Signature Exception

Available only for authorized users.

Reasons

Customer Refused

Contactless Delivery

After Hours Delivery

Unable to Sign

Lost Device

Manager Approval Required

---

# 14. Delivery Notes

Fields

Customer Notes

Driver Notes

Delivery Comments

Special Instructions

---

# 15. Customer Confirmation

Customer confirms

Vehicle Received

Condition Accepted

Damage Report Acknowledged

Signature Completed

---

# 16. POD Generation

Generate

Proof Of Delivery PDF

Includes

Company Logo

Driver

Vehicle

VIN

Photos

GPS

Timestamp

Receiver

Digital Signature

Notes

Damage Report

QR Verification

---

# 17. POD Preview

Driver can

View POD

Download PDF

Share PDF

Email Customer

Print POD

---

# 18. Customer Notification

Automatically send

Delivery Completed

POD PDF

Invoice Trigger

SMS

Email

Push Notification

---

# 19. Complete Delivery

Button

Complete Delivery

System performs

VIN Validation

↓

Photo Validation

↓

Signature Validation

↓

POD Generated

↓

Customer Notified

↓

Delivery Completed

---

# 20. Close Load

Available only after

All Vehicles Delivered

All POD Completed

All Signatures Saved

All Photos Uploaded

Actions

Close Load

Return Dashboard

---

# 21. Quick Actions

Scan VIN

Take Photo

Upload Photo

Capture Signature

Generate POD

Call Dispatch

Open Navigation

Report Damage

---

# 22. Business Rules

Wrong VIN cannot be delivered.

Signature mandatory.

Photos mandatory.

GPS mandatory.

Timestamp mandatory.

POD generated automatically.

Load closes only after all vehicles delivered.

---

# 23. Notifications

Delivery Completed

POD Generated

Signature Captured

Customer Notified

Damage Report Submitted

Dispatch Updated

Load Closed

---

# 24. Permissions

Driver

Deliver Vehicle

Capture Photos

Capture Signature

Generate POD

Dispatcher

View Delivery

View POD

Fleet Manager

Override Completion

Approve Exceptions

Reopen Delivery

---

# 25. Database Tables

delivery_events

delivery_items

delivery_photos

delivery_damage_reports

customer_signatures

pod_documents

vehicle_delivery_logs

gps_tracking

audit_logs

---

# 26. APIs

GET /driver/delivery

POST /driver/delivery/scan

POST /driver/delivery/photo

POST /driver/delivery/signature

POST /driver/delivery/damage

POST /driver/delivery/complete

GET /driver/pod

GET /driver/pod/pdf

POST /driver/load/close

---

# 27. Audit Logs

Track

Vehicle Delivered

VIN Verified

Photo Uploaded

Signature Captured

Damage Report

POD Generated

Customer Notified

Load Closed

---

# 28. Acceptance Criteria

✓ Driver can verify VIN.

✓ Wrong VIN blocked.

✓ Delivery photos upload successfully.

✓ Customer signature saved.

✓ GPS stored.

✓ Timestamp stored.

✓ POD PDF generated automatically.

✓ Customer receives POD.

✓ Load closes successfully.

✓ Complete audit history maintained.


# Fuel-&-Expenses-PRD.md

# Fuel & Expenses Module PRD

Version: 1.0

Module:
Driver Portal → Fuel & Expenses

---

# 1. Module Overview

The Fuel & Expenses module enables drivers to record all operating expenses during a trip, upload supporting receipts, capture odometer readings, monitor fuel consumption, and provide real-time cost visibility to Dispatch, Fleet, and Accounts teams.

All expense transactions are linked to the active load, assigned vehicle, and driver profile. Every expense entry is GPS-tagged, timestamped, and included in reimbursement and profitability reports.

---

# 2. Objectives

- Record fuel purchases.
- Record maintenance expenses.
- Record tyre expenses.
- Record toll expenses.
- Record miscellaneous operating expenses.
- Upload receipts immediately.
- Track fuel efficiency.
- Calculate cost per kilometre.
- Support reimbursement workflow.
- Improve trip profitability reporting.

---

# 3. Navigation

Driver Portal

↓

Fuel & Expenses

---

# 4. Header Information

Display

- Module Name
- Active Load
- Current Vehicle
- Current Trailer
- Driver
- Load Status

---

# 5. Vehicle & Load Information

Display

Truck

Trailer

Active Load

Load Type

Load ID

Current Route

Current Odometer

Distance Remaining

Trip Progress

Start Date

Estimated Finish Date

Status

Example

Truck

TRK-101

MAN TGX 26.580

Trailer

TRL-305

Load

LD-3987

Melbourne

↓

Sydney

---

# 6. Status Card

Display

Last Sync

Connection Status

Auto Refresh

Sync Button

Example

Online

Last Sync

29 May 2025

10:15 AM

Auto Refresh

Every 5 Minutes

---

# 7. Key Actions

Buttons

➕ Add Expense

📄 Upload Receipt

📟 Capture Odometer

📊 View Reports

🔄 Sync Now

---

# 8. Dashboard Summary Cards

Display

Fuel Used Today

Total Spent Today

Average Fuel Economy

Cost Per Kilometre

Example

Fuel Used

68 L

Today

Total Spent

$312.50

Average Economy

2.08 km/L

Cost Per KM

$1.46

---

# 9. Expense Categories

Supported Categories

Fuel

Maintenance

Tyres

Tolls

Other

Each category has

- Color Indicator
- Icon
- Total Cost
- Expense Count

---

# 10. Expense List

Each expense displays

Category

Vendor

Location

Date

Time

Odometer

Litres

Price

Status

Receipt

Approval Status

Example

Fuel

BP Service Centre

Yass NSW

68 L

$139.40

Approved

---

# 11. Add Expense

Fields

Category *

Vendor / Location *

Amount *

Fuel Quantity (L)

Current Odometer

Date

Time

Expense Notes

Receipt Attachment

Buttons

Cancel

Save Expense

---

# 12. Expense Validation

Amount Required

Category Required

Vendor Required

Receipt Optional

Fuel Quantity Required (Fuel Only)

Odometer Required

No negative values allowed.

---

# 13. Receipt Upload

Supported Formats

JPG

PNG

PDF

Maximum Size

10 MB

Driver may

Capture Photo

Browse File

Replace Receipt

Delete Receipt

View Receipt

---

# 14. Receipt Gallery

Displays

Receipt Thumbnail

Vendor

Expense Date

Amount

Upload Status

Actions

View

Replace

Delete

Download

---

# 15. Odometer Capture

Purpose

Capture latest odometer reading.

Fields

Current Odometer (km)

Buttons

Save Reading

Validation

Reading must always increase.

---

# 16. Analytics

Displays

Fuel Efficiency

Trip Range

Cost Efficiency Score

Average Fuel Consumption

Cost per Kilometre

Average Expense per Day

Fuel Trend

Expense Trend

---

# 17. Category Cost Breakdown

Displays

Fuel

Maintenance

Tyres

Tolls

Other

Shows

Dollar Value

Percentage

Pie Chart

---

# 18. Expense Summary

Displays

Fuel Total

Maintenance Total

Tyres Total

Tolls Total

Other Total

Grand Total

---

# 19. Reports

Driver can

View Trip Report

Export PDF

Export Excel

Share Report

Download Report

---

# 20. Trip Expense Report

Includes

Trip Details

Driver

Truck

Load

Fuel Used

Fuel Cost

Maintenance Cost

Tyre Cost

Toll Cost

Other Cost

Total Cost

Cost Per KM

Average Fuel Economy

Receipt Summary

Approval Status

---

# 21. Expense Alerts

Examples

Receipt Missing

Duplicate Expense

Fuel Quantity Missing

Pending Approval

Rejected Expense

Actions

Upload Receipt

Edit Expense

---

# 22. Business Rules

Every expense belongs to one load.

Every expense belongs to one driver.

Fuel entries require litres.

Receipt recommended for reimbursement.

Expenses become read-only after approval.

Managers can reject expenses.

---

# 23. Notifications

Expense Logged

Receipt Uploaded

Expense Approved

Expense Rejected

Receipt Missing

Expense Edited

---

# 24. Permissions

Driver

Create Expense

Upload Receipt

Capture Odometer

View Reports

Dispatcher

View Only

Accounts

Approve Expense

Reject Expense

Fleet Manager

View Reports

Audit Expenses

---

# 25. Database Tables

expenses

expense_categories

expense_receipts

fuel_logs

odometer_logs

trip_reports

drivers

loads

vehicles

audit_logs

---

# 26. APIs

GET /driver/expenses

POST /driver/expenses

PUT /driver/expenses/:id

DELETE /driver/expenses/:id

POST /driver/expenses/receipt

POST /driver/odometer

GET /driver/expenses/report

GET /driver/expenses/analytics

---

# 27. Audit Logs

Track

Expense Created

Expense Updated

Expense Deleted

Receipt Uploaded

Receipt Replaced

Receipt Deleted

Odometer Captured

Expense Approved

Expense Rejected

Report Exported

---

# 28. Acceptance Criteria

✓ Driver can create expenses.

✓ Fuel expenses calculate litres correctly.

✓ Cost per kilometre updates automatically.

✓ Fuel efficiency updates instantly.

✓ Receipts upload successfully.

✓ Odometer validation works.

✓ Reports export correctly.

✓ Approval workflow functions correctly.

✓ Full audit trail maintained.

✓ Responsive across Mobile, Tablet, and Desktop.


# Messages Module PRD

Version: 1.0

Module:
Driver Portal → Messages

---

# 1. Module Overview

The Messages module provides secure real-time communication between Drivers, Dispatch, Customers, Yard Staff, Fleet Managers, Safety Team, Maintenance Team, Accounts, and System Notifications.

The messaging system allows drivers to communicate instantly without leaving the application.

All conversations are encrypted, synchronized in real time, and stored with complete audit history.

---

# 2. Objectives

- Enable real-time communication.
- Reduce phone calls.
- Improve dispatch coordination.
- Keep conversations linked to loads.
- Support quick communication templates.
- Maintain secure communication records.
- Provide instant notifications.

---

# 3. Navigation

Driver Portal

↓

Messages

---

# 4. Dashboard Header

Display

- Module Name
- Current Driver
- Active Load
- Truck
- Trailer
- Online Status
- Last Sync Time

---

# 5. Vehicle & Load Information

Display

Truck

Trailer

Load ID

Load Type

Current Route

Current Status

Example

Truck

TRK-101

Trailer

TRL-305

Load

LD-3987

Melbourne

↓

Sydney

---

# 6. Status Panel

Display

Online Status

Last Sync

Auto Refresh

Sync Button

Example

Online

Last Sync

29 May 2025

10:15 AM

Auto Refresh

Every 5 Minutes

---

# 7. Key Actions

Buttons

📝 New Message

👥 Quick Contacts

📋 Message Templates

📄 View Load Details

⚠ Report Issue

🔄 Sync Now

---

# 8. Search

Search By

- Contact Name
- Company
- Load ID
- Customer
- Dispatch
- Message Text

Instant Search supported.

---

# 9. Filters

Available Filters

All

Unread

Read

Important

Groups

Archived

System Notifications

---

# 10. Conversation List

Each conversation displays

Profile Icon

Name

Role

Latest Message

Associated Load

Timestamp

Unread Count

Priority Badge

Status

Example

Dispatch Support

Unread

LD-3987

10:15 AM

2 Unread

---

# 11. Conversation Types

Supported Types

Driver ↔ Dispatch

Driver ↔ Customer

Driver ↔ Yard

Driver ↔ Fleet

Driver ↔ Accounts

Driver ↔ Maintenance

Driver ↔ Safety

Driver Groups

Broadcast Messages

System Notifications

---

# 12. Conversation Screen

Display

Recipient

Online Status

Load Reference

Message History

Read Status

Typing Indicator

Attachments

Timestamp

Delivery Status

---

# 13. Send New Message

Fields

Recipient *

Message *

Attachment

Priority

Related Load

Buttons

Cancel

Send Message

---

# 14. Message Types

Supported

Text

Photo

Document

PDF

Location

System Alert

Quick Template

---

# 15. Attachments

Supported Files

JPG

PNG

PDF

DOCX

Maximum Size

20 MB

Actions

Upload

Preview

Download

Delete

---

# 16. Quick Contacts

Categories

Dispatch

Pickup Yard

Delivery Customer

Fleet Maintenance

Safety Officer

Accounts

Branch Office

Emergency Contact

Each Contact Displays

Name

Role

Phone Number

Online Status

Call Button

Message Button

---

# 17. Message Templates

Default Templates

I am leaving the yard now.

Arrived at pickup location.

Completed delivery and POD signed.

Fuel stop required.

Traffic delay (20 minutes).

Vehicle breakdown.

Need dispatch assistance.

Arrived at delivery location.

Waiting for unloading.

Load completed successfully.

Users can also create custom templates.

---

# 18. Message Status

Possible Status

Sending

Sent

Delivered

Read

Failed

Archived

---

# 19. Read Receipts

Display

Sent Time

Delivered Time

Read Time

Reader Name

---

# 20. Notifications

Receive notifications for

New Message

Unread Message

Dispatch Update

Customer Reply

Load Update

System Alert

Maintenance Reminder

Safety Reminder

---

# 21. Push Notifications

Supported

Mobile Push

Desktop Notification

Email Alert

SMS (Critical Only)

---

# 22. Group Messaging

Supported Groups

Dispatch Team

Driver Group

Branch Team

Maintenance Team

Safety Team

Operations

Managers

---

# 23. Archive

Drivers may

Archive Conversation

Restore Conversation

Delete Local Copy

Search Archived Messages

---

# 24. Business Rules

Every message belongs to a conversation.

Messages linked to loads remain permanently searchable.

Deleted messages remain in audit logs.

System notifications cannot be deleted.

Only sender can edit messages within allowed time.

---

# 25. Security

End-to-End Encryption

TLS Communication

Role-Based Access

Message Audit Logs

Secure File Storage

Attachment Virus Scan

---

# 26. Permissions

Driver

Read Messages

Send Messages

Upload Files

Archive Conversations

Dispatcher

Broadcast Messages

View Driver Conversations

Fleet Manager

View Operational Conversations

Safety Team

Send Safety Notices

Accounts

Send Invoice Notifications

System

Generate Automated Messages

---

# 27. Database Tables

messages

message_threads

message_templates

message_attachments

message_status

contacts

groups

notifications

audit_logs

---

# 28. APIs

GET /driver/messages

GET /driver/messages/:threadId

POST /driver/messages

PUT /driver/messages/read

POST /driver/messages/template

GET /driver/contacts

POST /driver/messages/upload

GET /driver/notifications

POST /driver/messages/archive

---

# 29. Audit Logs

Track

Message Sent

Message Delivered

Message Read

Attachment Uploaded

Attachment Deleted

Conversation Archived

Template Used

Notification Sent

Group Message Sent

---

# 30. Acceptance Criteria

✓ Driver can send messages successfully.

✓ Messages deliver in real time.

✓ Unread counter updates automatically.

✓ Read receipts display correctly.

✓ Attachments upload successfully.

✓ Quick Contacts work correctly.

✓ Message Templates insert correctly.

✓ Search and filters return accurate results.

✓ Notifications appear instantly.

✓ All conversations remain encrypted.

✓ Full audit history maintained.

✓ Responsive across Mobile, Tablet, and Desktop.


# Documents-&-Compliance-PRD.md

# Driver Portal → Documents & Compliance

## Module Overview

The Documents & Compliance module allows drivers to securely manage all personal, vehicle, trailer and compliance-related documents. It tracks expiry dates, sends reminders, maintains compliance status, allows uploading/downloading documents and provides complete compliance history.

---

# Objectives

- Store all driver documents digitally.
- Track compliance status.
- Prevent expired documents.
- Upload & download documents.
- Share documents with Admin.
- Generate compliance reports.
- Maintain audit history.

---

# Dashboard

Display

- Compliance Score
- Total Documents
- Valid Documents
- Expiring Soon
- Expired Documents
- Uploaded Documents
- Active Load
- Truck
- Trailer
- Last Sync
- Online Status

---

# Tabs

## My Documents

Contains

- Driver Licence
- Medical Certificate
- Heavy Vehicle Card
- Dangerous Goods Licence
- Chain of Responsibility
- First Aid Certificate
- Fatigue Certificate
- White Card
- Other Certificates

---

## Vehicle Documents

Contains

- Vehicle Registration
- Trailer Registration
- Insurance
- Roadworthy Certificate
- Trailer Inspection
- NHVR Permit
- Over Size Permit
- Maintenance Certificate

---

## Compliance History

Shows

- Upload History
- Renewal History
- Expired Documents
- Deleted Documents
- Compliance Changes
- Reminder History

---

# Compliance Overview

Display

- Total Documents
- Valid
- Expiring Soon
- Expired
- Uploaded
- Compliance %

Status

🟢 Valid

🟡 Expiring Soon

🔴 Expired

⚪ Not Required

---

# Upload Document

Fields

- Document Title
- Category
- Expiry Date
- Description
- Upload File

Supported Files

- PDF
- JPG
- PNG
- JPEG

Maximum Size

10 MB

Buttons

- Upload & Save
- Cancel

---

# Document Categories

Personal

Vehicle

Trailer

Insurance

Permits

Certificates

Compliance

Other

---

# Document Actions

- Upload
- Download
- Preview
- Replace
- Share with Admin
- Delete (Permission Based)
- View History

---

# Expiry Tracking

Automatic reminders

- 90 Days
- 60 Days
- 30 Days
- 15 Days
- 7 Days
- 1 Day
- Expired

Notifications sent to

- Driver
- Company Admin
- Fleet Manager

---

# Expiring Soon

Displays

- Document Name
- Expiry Date
- Remaining Days
- Renew Button

---

# Expired Documents

Displays

- Document Name
- Expired Date
- Overdue Days
- Upload New Version

Mandatory documents block compliance until renewed.

---

# Compliance Report

Generate report containing

- Driver Details
- Vehicle Details
- Document Summary
- Compliance Score
- Expired Documents
- Expiring Documents
- Upload History
- Audit History

Export

- PDF
- Excel

---

# Search & Filters

Search By

- Document Name
- Category
- Vehicle
- Trailer
- Status

Filters

- All
- Valid
- Expiring Soon
- Expired
- Uploaded
- Personal
- Vehicle
- Trailer

---

# Quick Actions

- Upload Document
- Check Expiry
- View Expired
- Download All
- Share with Admin
- View Compliance Report

---

# Notifications

- Document Uploaded
- Document Updated
- Document Approved
- Document Expiring
- Document Expired
- Compliance Warning
- Compliance Restored

---

# Business Rules

- Every document belongs to one driver or vehicle.
- Duplicate documents are not allowed.
- Mandatory documents require expiry dates.
- Expired mandatory documents reduce compliance score.
- Only Admin can permanently delete documents.
- Every upload creates a new version.

---

# Permissions

## Driver

- View Documents
- Upload Documents
- Download Documents
- Share Documents

## Company Admin

- View All
- Approve
- Reject
- Archive
- Delete

## Fleet Manager

- View Reports
- Monitor Compliance
- Generate Reports

---

# Database Tables

- documents
- document_categories
- document_versions
- document_history
- compliance_status
- expiry_notifications
- audit_logs

---

# APIs

GET /driver/documents

GET /driver/documents/{id}

POST /driver/documents

PUT /driver/documents/{id}

DELETE /driver/documents/{id}

GET /driver/compliance

POST /driver/documents/share

GET /driver/compliance/report

---

# Audit Logs

Track

- Upload
- Replace
- Delete
- Download
- Share
- Approval
- Rejection
- Expiry Reminder
- Compliance Update

---

# Acceptance Criteria

- Driver can upload documents.
- Supported files upload successfully.
- Compliance score updates automatically.
- Expiry reminders trigger correctly.
- Expired documents appear automatically.
- Reports export successfully.
- Documents can be shared with Admin.
- Audit logs capture every action.
- Mobile and Desktop responsive.
- Complete compliance history maintained.


````md
# Timesheets-&-Clock-In-Out-PRD.md

# Driver Portal → Timesheets / Clock In-Out

## Module Overview

The Timesheets & Clock In-Out module allows drivers to record their working hours, break times, overtime, shift locations, attendance, and submit weekly timesheets for payroll processing. Every clock event is GPS and timestamp verified to ensure accurate attendance and fatigue compliance.

---

# Objectives

- Record work hours.
- Record clock in/out.
- Record breaks.
- Track overtime.
- Generate weekly timesheets.
- Improve payroll accuracy.
- Ensure fatigue compliance.

---

# Dashboard

Display

- Current Shift Status
- Hours Worked Today
- Weekly Hours
- Monthly Hours
- Break Time
- Overtime
- Current Location
- Last Clock Event
- Online Status

---

# Tabs

## Today

Displays

- Current Shift
- Clock In Time
- Clock Out Time
- Breaks
- Notes

---

## This Week

Displays

- Daily Hours
- Weekly Total
- Weekly Balance
- Overtime

---

## This Month

Displays

- Monthly Hours
- Total Shifts
- Overtime
- Attendance

---

## All Timesheets

Displays complete history.

---

# Weekly Summary

Display

- Total Hours
- Scheduled Hours
- Balance
- Overtime
- Break Hours
- Attendance %

---

# Current Status

Display

- Clocked In
- Clocked Out
- On Break
- Working Since
- Current Shift Duration
- GPS Location
- Geofence Status

---

# Key Actions

- Clock In
- Start Break
- End Break
- Clock Out
- Submit Timesheet
- View Timesheets
- Download PDF

---

# Clock In

Fields

- Auto Date
- Auto Time
- GPS Location
- Geofence
- Notes (Optional)

System stores

- Timestamp
- Latitude
- Longitude
- Device

---

# Break Management

Actions

- Start Break
- End Break

Display

- Break Start
- Break End
- Break Duration

Rules

Multiple breaks supported.

---

# Clock Out

System records

- End Time
- GPS
- Shift Duration
- Total Work Hours
- Total Break Time
- Overtime

---

# Timeline

Display

- Clock In
- Break Started
- Break Ended
- Notes Added
- Clock Out

Each entry contains

- Time
- GPS
- Location
- Status

---

# Notes

Driver may add

- Delay Notes
- Traffic
- Vehicle Issue
- Customer Notes
- General Notes

---

# Timesheet Summary

Displays

- Work Time
- Break Time
- Total Shift
- Overtime
- Status

Status

Draft

Submitted

Approved

Rejected

---

# Week Overview

Display

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Weekly Total

Attendance

---

# Break Rules

Configurable

Minimum Break

Maximum Daily Hours

Maximum Weekly Hours

Fatigue Rules

Compliance Status

---

# Recent Timesheets

Displays

- Date
- Total Hours
- Status
- Approval Date

---

# Reports

Generate

- Daily Report
- Weekly Report
- Monthly Report

Export

- PDF
- Excel

---

# Search & Filters

Search

- Date
- Status
- Week

Filters

- Draft
- Submitted
- Approved
- Rejected

---

# Notifications

- Shift Started
- Break Reminder
- Break Overdue
- Clock Out Reminder
- Timesheet Submitted
- Timesheet Approved
- Timesheet Rejected

---

# Business Rules

- Clock In required before Clock Out.
- GPS required for every clock event.
- Break rules follow company policy.
- Submitted timesheets become read-only.
- Admin approval required for payroll.

---

# Permissions

## Driver

- Clock In
- Clock Out
- Break
- Submit Timesheet
- View Reports

## Manager

- View Team Timesheets
- Approve
- Reject
- Edit

## Payroll

- View Approved Timesheets
- Export Payroll Data

---

# Database Tables

- timesheets
- attendance_logs
- break_logs
- overtime_logs
- gps_logs
- approvals
- audit_logs

---

# APIs

GET /driver/timesheets

POST /driver/clock-in

POST /driver/start-break

POST /driver/end-break

POST /driver/clock-out

POST /driver/timesheets/submit

GET /driver/timesheets/report

---

# Audit Logs

Track

- Clock In
- Break Started
- Break Ended
- Clock Out
- Note Added
- Timesheet Submitted
- Approved
- Rejected

---

# Acceptance Criteria

- Driver can Clock In.
- GPS captured successfully.
- Breaks calculate correctly.
- Overtime calculated automatically.
- Weekly summary updates instantly.
- Timesheet submission works.
- Reports export successfully.
- Manager approval workflow works.
- Audit logs maintained.
- Mobile & Desktop responsive.

```
````
# Payroll-&-Pay-History-PRD.md

# Driver Portal → Payroll & Pay History

## Module Overview

The Payroll & Pay History module allows drivers to view their earnings, deductions, tax information, payment history, payslips, bank details, and payroll reports. It provides complete visibility into every pay cycle and allows drivers to download official payroll documents.

---

# Objectives

- View payroll summary.
- View earnings.
- View deductions.
- Download payslips.
- View tax statements.
- Update bank details.
- Track payment status.
- Improve payroll transparency.

---

# Dashboard

Display

- Total Earnings (YTD)
- Net Pay
- Gross Pay
- Pending Payments
- Total Deductions
- Next Pay Date
- Payment Frequency
- Current Payroll Status

---

# Tabs

## Overview

Display

- Net Pay
- Gross Earnings
- Total Deductions
- Next Payment
- Current Payroll Status

---

## Pay History

Displays

- Pay Period
- Pay Date
- Status
- Net Amount
- Gross Amount
- Payslip

Status

- Paid
- Processing
- Pending
- Cancelled

---

## Earnings

Displays

- Base Salary
- Load Allowance
- Distance Allowance
- Bonus
- Overtime
- Other Allowances

Shows

Total Earnings

---

## Deductions

Displays

- PAYG Tax
- Superannuation
- Union Fees
- Loan Recovery
- Insurance
- Other Deductions

Shows

Total Deductions

---

## Tax

Displays

- Financial Year
- Gross Income
- Tax Paid
- PAYG Statement
- Income Statement

Export PDF

---

# Pay Summary

Displays

- Current Pay Period
- Gross Pay
- Net Pay
- Deductions
- Processing Status

---

# Current Pay Breakdown

Earnings

- Base Pay
- Distance Allowance
- Load Allowance
- Bonus
- Other Payments

Deductions

- PAYG
- Super
- Insurance
- Other

---

# Payment Method

Display

- Bank Name
- Account Holder
- BSB
- Account Number

Button

Update Bank Details

---

# Update Bank Details

Fields

- Account Holder Name
- Bank Name
- BSB Number
- Account Number

Buttons

- Save
- Cancel

Validation

- BSB Required
- Account Number Required

---

# Payslip Preview

Displays

- Pay Period
- Payment Date
- Net Pay
- Gross Pay
- Earnings Breakdown
- Deductions Breakdown

Buttons

- Download PDF
- Close

---

# Pay History

Shows

- Complete Payroll Archive
- Payslip PDF
- Payment Status
- Amount
- Payment Date

---

# Annual Tax Statements

Displays

- Financial Year
- Gross Earnings
- Tax Withheld

Export

- PDF

---

# Reports

Generate

- Payroll Report
- Earnings Report
- Tax Report
- Deduction Report

Export

- PDF
- Excel

---

# Search & Filters

Search

- Pay Period
- Financial Year

Filters

- Paid
- Pending
- Processing
- Cancelled

---

# Notifications

- Payroll Processed
- Payment Released
- Payslip Available
- Tax Statement Ready
- Bank Details Updated

---

# Business Rules

- Payslips cannot be edited.
- Tax statements are read-only.
- Bank changes require validation.
- Only processed payroll appears in history.

---

# Permissions

## Driver

- View Payroll
- Download Payslip
- Download Tax Statement
- Update Bank Details

## Payroll Admin

- Generate Payroll
- Process Payments
- Update Payroll
- Export Reports

---

# Database Tables

- payrolls
- payroll_items
- payslips
- tax_statements
- bank_accounts
- deductions
- earnings
- audit_logs

---

# APIs

GET /driver/payroll

GET /driver/pay-history

GET /driver/payslip/{id}

GET /driver/tax-statements

PUT /driver/bank-details

GET /driver/payroll/report

---

# Audit Logs

Track

- Payslip Downloaded
- Tax Statement Downloaded
- Bank Updated
- Payroll Viewed
- Report Exported

---

# Acceptance Criteria

- Driver can view payroll.
- Payslips download successfully.
- Tax statements available.
- Bank details update correctly.
- Reports export successfully.
- Payment history accurate.
- Audit logs maintained.
- Responsive on Mobile & Desktop.

```

# Trailer-Swap-&-Equipment-PRD.md

# Driver Portal → Trailer Swap & Equipment

## Module Overview

The Trailer Swap & Equipment module allows drivers to manage their assigned truck and trailer, perform trailer swaps, inspect equipment, report defects, and ensure all fleet equipment remains safe and compliant before continuing a trip.

The module supports both **Direct Swap** and **Approval-Based Swap** depending on company policy.

---

# Objectives

- Manage assigned equipment.
- Swap trailers safely.
- Verify equipment before use.
- Record inspection results.
- Notify dispatch automatically.
- Maintain equipment history.
- Improve fleet safety and compliance.

---

# Dashboard

Display

- Current Truck
- Current Trailer
- Driver
- Equipment Status
- Company Swap Policy
- Last Sync
- Online Status

---

# Current Equipment

Display

- Driver Name
- Driver ID
- Truck ID
- Truck Model
- Truck Registration
- Truck VIN
- Trailer ID
- Trailer Model
- Trailer Registration
- Trailer VIN

Status

- Active
- Available
- Maintenance
- In Use
- Unavailable

---

# Trailer Search

Search By

- Trailer ID
- Registration
- VIN
- Trailer Type
- Location

Filters

- All
- Available
- In Use
- Maintenance
- Unavailable

---

# Available Trailer List

Each trailer displays

- Trailer ID
- Model
- Registration
- VIN
- Capacity
- Current Yard
- Status

Buttons

- Select Trailer
- View Details

---

# Trailer Specifications

Displays

- Trailer ID
- Model
- Registration
- VIN
- Capacity
- Manufacturer
- Build Year
- Last Inspection Date
- Service Due Date

Buttons

- View Details
- Close

---

# Trailer Swap

Fields

- Swap Type
- New Trailer
- Reason
- Date & Time
- Location
- Notes

Buttons

- Confirm Swap
- Cancel

---

# Swap Types

Supported

- Direct Swap
- Approval Required
- Emergency Swap
- Workshop Replacement

---

# Equipment Inspection Checklist

Driver must verify

- Tyres & Wheels
- Lights & Indicators
- Brakes & Air Lines
- Coupling & Locks
- Deck & Ramps
- General Condition

Checkbox

"I confirm the equipment has been inspected and is roadworthy."

---

# Company Policy

Display

- Policy Type
- Approval Required
- Dispatch Notification
- Equipment Inspection Required
- Photo Required
- After Hours Allowed

---

# Swap Workflow

Current Trailer

↓

Select New Trailer

↓

Inspection Checklist

↓

Company Policy Validation

↓

Confirm Swap

↓

Dispatch Notification

↓

Equipment Updated

---

# Equipment History

Displays

- Previous Trailer
- New Trailer
- Date
- Time
- Driver
- Location
- Reason

---

# Maintenance

Quick Actions

- Report Defect
- Safety Inspection
- Service History
- Maintenance Request

---

# Equipment Alerts

Displays

- Service Due
- Inspection Due
- Damage Reported
- Registration Expiring
- Insurance Expiring

---

# Notifications

- Trailer Swapped
- Dispatch Notified
- Inspection Completed
- Service Due
- Equipment Assigned
- Equipment Removed

---

# Business Rules

- Trailer must be Available before assignment.
- Inspection required before swap.
- Approval required if company policy demands.
- Dispatch notified automatically.
- Equipment history cannot be deleted.
- Driver cannot assign unavailable trailer.

---

# Permissions

## Driver

- View Equipment
- Swap Trailer
- Complete Inspection
- Report Defect

## Dispatcher

- Approve Swap
- Assign Equipment
- Monitor Equipment

## Fleet Manager

- Manage Equipment
- View History
- Override Assignments
- Configure Policies

---

# Database Tables

- equipment
- trailers
- trucks
- equipment_assignments
- trailer_swaps
- inspection_checklists
- maintenance_logs
- equipment_history
- audit_logs

---

# APIs

GET /driver/equipment

GET /driver/trailers

POST /driver/trailer-swap

POST /driver/equipment-inspection

GET /driver/equipment-history

POST /driver/report-defect

GET /driver/company-policy

---

# Audit Logs

Track

- Trailer Assigned
- Trailer Swapped
- Inspection Completed
- Dispatch Notified
- Equipment Updated
- Defect Reported
- Service Requested
- Policy Checked

---

# Acceptance Criteria

- Driver can view assigned equipment.
- Trailer search works correctly.
- Only available trailers can be selected.
- Inspection checklist is mandatory.
- Company policy is enforced.
- Dispatch receives swap notification.
- Equipment history is maintained.
- Defects can be reported successfully.
- Audit logs capture all equipment activities.
- Responsive across Mobile, Tablet, and Desktop.

```

# Offline-Sync-PRD.md

# Driver Portal → Offline Sync

## Module Overview

The Offline Sync module allows drivers to continue working even without an internet connection. All offline activities are securely stored on the device and automatically synchronized with the server once connectivity is restored.

The module ensures no operational data is lost during poor network coverage.

---

# Objectives

- Support offline operation.
- Prevent data loss.
- Automatically synchronize data.
- Track sync status.
- Retry failed uploads.
- Improve reliability in remote areas.

---

# Dashboard

Display

- Total Sync Items
- Synced Items
- Pending Items
- Uploading Items
- Queued Items
- Failed Items
- Last Sync Time
- Connection Status
- Storage Usage

---

# Sync Status

Display

- Online
- Offline
- Syncing
- Paused
- Failed

Color Indicators

🟢 Synced

🟡 Pending

🔵 Uploading

🟠 Queued

🔴 Failed

---

# Queue Summary

Displays

- Total Queue Items
- Synced
- Pending
- Uploading
- Queued
- Failed

---

# Sync Tabs

- All Items
- Pending
- Uploading
- Queued
- Failed

---

# Offline Queue Items

Each queue item displays

- Reference Number
- Module Type
- Date
- Time
- File Size
- Current Status
- Sync Progress

Supported Item Types

- Safety Checklist
- Load Photos
- POD Signature
- Fuel Expense
- Trailer Swap
- Damage Report
- Documents
- Messages
- Timesheets

---

# Search & Filters

Search By

- Reference ID
- Module
- Notes

Filters

- All
- Pending
- Failed
- Uploading
- Synced

---

# Sync Progress

Displays

- Upload Percentage
- Current Status
- Remaining Files
- Estimated Completion Time

Example

Uploading

85%

---

# Sync Controls

Buttons

- Sync Now
- Retry Failed
- Pause Sync
- Resume Sync
- Clear Completed
- Open Sync Settings

---

# Sync Settings

Configurable Options

- Auto Sync
- Sync Every 5 Minutes
- Wi-Fi Only Sync
- Mobile Data Sync
- Background Sync
- Large File Upload
- Storage Cleanup

---

# Storage Usage

Display

- Used Storage
- Available Storage
- Offline Cache Size

Buttons

- Manage Storage
- Clear Cache

---

# Recent Sync Activity

Displays

- Module Name
- Status
- Date
- Time
- Reference ID

---

# Notifications

- Sync Started
- Sync Completed
- Sync Failed
- Connection Restored
- Queue Full
- Retry Successful
- Storage Almost Full

---

# Business Rules

- Offline data is stored locally.
- Data sync starts automatically when internet is available.
- Failed items remain in queue until successfully uploaded.
- Duplicate records are prevented.
- Sync order follows creation timestamp.
- Deleted synced records remain in audit history.

---

# Permissions

## Driver

- View Queue
- Sync Data
- Retry Failed
- Pause Sync
- Clear Completed

## Admin

- Monitor Sync Logs
- Resolve Sync Errors

## System

- Automatic Synchronization
- Conflict Resolution
- Background Upload

---

# Database Tables

- offline_queue
- sync_logs
- sync_settings
- upload_queue
- failed_uploads
- local_cache
- audit_logs

---

# APIs

GET /driver/offline-sync

POST /driver/offline-sync

POST /driver/offline-sync/retry

POST /driver/offline-sync/pause

POST /driver/offline-sync/resume

DELETE /driver/offline-sync/clear

GET /driver/offline-sync/settings

---

# Audit Logs

Track

- Queue Created
- Item Added
- Sync Started
- Sync Completed
- Sync Failed
- Retry Attempted
- Queue Cleared
- Settings Updated

---

# Acceptance Criteria

- Driver can continue working offline.
- Offline records are saved securely.
- Sync starts automatically when online.
- Failed uploads can be retried.
- Queue status updates correctly.
- Duplicate uploads are prevented.
- Storage usage is tracked.
- Sync logs are maintained.
- Audit logs capture all sync activities.
- Responsive on Mobile, Tablet, and Desktop.

```



````md
# Account-Statement-PRD.md

# Customer Portal → Account Statement

## Module Overview

The **Account Statement** module provides customers with a complete financial summary of their account. Customers can review outstanding balances, invoices, payments, credits, adjustments, and download official account statements in PDF or CSV format for accounting purposes.

This module serves as the customer's financial ledger within the Customer Portal.

---

# Objectives

- View complete account statement.
- Track outstanding balance.
- View payment history.
- Download official statements.
- Export accounting data.
- Improve financial transparency.
- Maintain billing history.

---

# Navigation

Customer Portal

↓

Finance

↓

Account Statement

---

# Screen Header

Title

Account Statement

Subtitle

Download complete billing history statement.

---

# Account Summary

Display

- Account Holder Name
- Customer Code
- Account Number
- Company Name
- Billing Email
- Statement Date
- Currency

Example

Account Holder

ABC Transport Solutions

Customer Code

ABC-1025

Currency

AUD

---

# Financial Summary Cards

Display

## Total Outstanding

Amount currently unpaid.

Example

$18,540.00 AUD

---

## Current Balance

Current account balance.

---

## Total Paid

Payments received.

---

## Credit Balance

Available credits.

---

## Overdue Amount

Outstanding overdue invoices.

---

## Last Payment

Latest payment received.

---

# Statement Period

Allow selection of

- Current Month
- Last Month
- Last 3 Months
- Last 6 Months
- Current Financial Year
- Previous Financial Year
- Custom Date Range

---

# Statement Information

Display

- Opening Balance
- Total Charges
- Total Payments
- Credits
- Adjustments
- Closing Balance

---

# Transactions Table

Columns

- Date
- Reference Number
- Transaction Type
- Description
- Debit
- Credit
- Balance
- Status

Example

27 May 2025

INV-2025-0527

Invoice

Freight Transport Charge

Debit

$5,760.50

Balance

$18,540.00

Status

Outstanding

---

# Transaction Types

Supported

- Invoice
- Payment
- Credit Note
- Debit Note
- Adjustment
- Refund
- Deposit
- Finance Charge

---

# Payment History

Display

- Payment Date
- Payment Method
- Reference
- Amount
- Status

Status

- Paid
- Pending
- Failed
- Refunded

---

# Outstanding Invoices

Display

- Invoice Number
- Due Date
- Outstanding Amount
- Days Overdue

Buttons

- View Invoice
- Pay Now

---

# Credits & Adjustments

Display

- Credit Notes
- Discounts
- Refunds
- Manual Adjustments

---

# Download Options

Buttons

Download PDF Statement

Export CSV Spreadsheet

Download Excel

Print Statement

---

# PDF Statement

Generated PDF contains

- Company Logo
- Customer Information
- Billing Address
- Statement Period
- Transaction History
- Outstanding Balance
- Payment Summary
- Closing Balance

---

# CSV Export

Include

- Transaction Date
- Reference
- Type
- Description
- Debit
- Credit
- Balance

---

# Search

Search By

- Invoice Number
- Reference
- Transaction ID
- Payment ID

---

# Filters

Filter By

- All
- Invoices
- Payments
- Credits
- Outstanding
- Paid
- Overdue

Date Filters

- Today
- This Month
- Last Month
- Custom Range

---

# Quick Actions

- Download Statement
- Export CSV
- View Invoice
- Pay Invoice
- Contact Accounts

---

# Notifications

Customer receives notifications for

- Statement Ready
- Payment Received
- New Invoice
- Credit Applied
- Refund Processed
- Overdue Reminder

---

# Business Rules

- Statement is generated from all financial transactions.
- Closing balance equals opening balance plus charges minus payments.
- Paid invoices cannot appear as outstanding.
- Credits automatically reduce outstanding balance.
- Downloaded statements are read-only.
- Only authorized customers can access their statements.

---

# Permissions

## Customer

- View Statement
- Download PDF
- Export CSV
- View Transactions

## Accounts Team

- View All Statements
- Generate Statements
- Apply Credits
- Process Adjustments

## Company Admin

- View Company Financials
- Download Reports

---

# Database Tables

- customers
- account_statements
- invoices
- invoice_payments
- payment_transactions
- credit_notes
- adjustments
- account_balances
- audit_logs

---

# APIs

GET /customer/account-statement

GET /customer/account-summary

GET /customer/account-transactions

GET /customer/account-statement/pdf

GET /customer/account-statement/csv

GET /customer/outstanding-invoices

---

# Audit Logs

Track

- Statement Viewed
- PDF Downloaded
- CSV Exported
- Invoice Opened
- Payment Initiated
- Filters Applied
- Search Performed

---

# Validation Rules

- Customer must be authenticated.
- Only own account statement is accessible.
- Date range cannot exceed configured system limit.
- PDF generation must include latest transaction data.
- CSV export must include all filtered records.

---

# Acceptance Criteria

- Customer can view complete account statement.
- Outstanding balance displays correctly.
- Opening and closing balances calculate accurately.
- Transaction history is complete.
- Payment history is visible.
- Outstanding invoices are listed.
- PDF statement downloads successfully.
- CSV export works correctly.
- Search and filters function properly.
- Audit logs record all statement activities.
- Fully responsive on Desktop, Tablet, and Mobile.

```
````
````md
# Saved-Payment-Methods-PRD.md

# Customer Portal → Saved Payment Methods

## Module Overview

The **Saved Payment Methods** module allows customers to securely manage their payment methods for invoices and account payments. Customers can add, update, remove and set default payment methods for faster checkout. All payment information is tokenized and securely managed through Stripe.

---

# Objectives

- Save payment methods securely.
- Support multiple payment methods.
- Set default payment method.
- Add new cards.
- Remove old payment methods.
- Update expiry information.
- Improve checkout experience.

---

# Navigation

Customer Portal

↓

Finance

↓

Saved Payment Methods

---

# Screen Header

Title

Saved Payment Methods

Subtitle

Manage credit cards and direct debit options.

---

# Payment Methods Summary

Display

- Total Saved Payment Methods
- Default Payment Method
- Last Updated
- Payment Gateway
- Customer Account

---

# Saved Payment Method Card

Display

## Credit Card

Fields

- Card Brand
- Last 4 Digits
- Expiry Date
- Card Holder Name
- Status

Example

Visa

Ending ****4242

Expires 12/28

Default

---

## Direct Debit

Display

- Bank Name
- Account Ending
- Status

Example

ANZ Bank

Ending ****8819

Active

---

# Payment Method Status

Supported Status

- Default
- Active
- Expired
- Disabled
- Verification Pending

---

# Supported Payment Methods

- Visa
- Mastercard
- American Express
- Debit Card
- Bank Direct Debit

Future Support

- Apple Pay
- Google Pay
- PayPal

---

# Add New Payment Method

Fields

## Payment Type

Dropdown

- Credit Card
- Direct Debit

---

## Card Holder Name

Required

---

## Card Number

Masked Input

Validation

Luhn Validation

---

## Expiry Date

MM/YY

Cannot be expired.

---

## CVV

3–4 Digits

---

## Billing Address

Optional

---

Buttons

- Save Payment Method
- Cancel

---

# Make Default

Action

Customer selects a payment method.

↓

System updates default payment method.

↓

Previous default becomes Active.

---

# Remove Payment Method

Rules

- Confirmation required.
- Default method cannot be removed until another default exists.
- Payment method used in active transactions cannot be deleted.

---

# Payment Method Details

Display

- Payment Type
- Token ID
- Created Date
- Last Used
- Expiry
- Status

---

# Payment Workflow

Customer

↓

Open Saved Payment Methods

↓

Add Card

↓

Stripe Tokenization

↓

Card Verified

↓

Saved Successfully

↓

Available During Checkout

---

# Stripe Integration

System Uses

- Stripe Customer
- Stripe Payment Method
- Stripe Setup Intent
- Stripe Tokenization

Card details are never stored inside Hero Logistics database.

---

# Security

- PCI DSS Compliant
- Stripe Tokenization
- SSL Encryption
- Secure API Communication
- Fraud Detection
- No CVV Storage

---

# Search

Search By

- Card Holder
- Card Type
- Bank Name

---

# Filters

- Active
- Default
- Expired
- Disabled

---

# Quick Actions

- Add New Payment Method
- Make Default
- Remove
- Edit Nickname
- Refresh

---

# Notifications

Customer receives

- Payment Method Added
- Payment Method Updated
- Payment Method Removed
- Default Changed
- Card Expiring Soon

Admin receives

- New Payment Method Added
- Verification Failed

---

# Business Rules

- One payment method must remain default.
- Expired cards cannot be used.
- CVV is never stored.
- Stripe manages sensitive payment data.
- Customer can store multiple payment methods.
- Duplicate payment methods are not allowed.

---

# Permissions

## Customer

- View Payment Methods
- Add Payment Method
- Remove Payment Method
- Make Default

## Accounts Team

- View Payment Methods
- Disable Payment Method

## Super Admin

- View Audit Logs
- Payment Configuration
- Gateway Management

---

# Database Tables

- customers
- payment_methods
- stripe_customers
- stripe_payment_methods
- payment_method_logs
- audit_logs

---

# APIs

GET /customer/payment-methods

POST /customer/payment-methods

PUT /customer/payment-methods/{id}

DELETE /customer/payment-methods/{id}

POST /customer/payment-methods/default

GET /customer/payment-methods/{id}

---

# Audit Logs

Track

- Payment Method Added
- Payment Method Updated
- Payment Method Deleted
- Default Changed
- Verification Completed
- Payment Method Used

---

# Validation Rules

- Card number must pass Luhn validation.
- Expiry date cannot be in the past.
- CVV required during verification.
- Duplicate payment methods blocked.
- Default payment method must always exist.

---

# Acceptance Criteria

- Customer can add a payment method.
- Stripe tokenization works correctly.
- Multiple payment methods supported.
- Default payment method updates successfully.
- Payment methods display correctly.
- Expired cards are blocked.
- Delete confirmation works.
- Audit logs are maintained.
- Payment data remains PCI compliant.
- Fully responsive on Desktop, Tablet, and Mobile.

```
````
# Dashboard-PRD.md

# Customer Portal → Dashboard

## Module Overview

The Customer Dashboard provides customers with a complete overview of their logistics operations, active shipments, deliveries, invoices, documents, and recent activities from a single screen. It acts as the landing page after login and provides quick access to all important business information.

---

# Objectives

- Provide business overview
- Display shipment status
- Track active loads
- Monitor deliveries
- View invoices & payments
- Access documents quickly
- View recent activities
- Navigate to important modules

---

# Navigation

Customer Portal

→ Dashboard

(Default Landing Page)

---

# Dashboard KPI Cards

Display following KPI cards:

- Active Loads
- Upcoming Deliveries
- Outstanding Invoices
- Outstanding Balance
- Payments This Month
- Documents

Each card displays:

- Current Value
- Trend Percentage
- Comparison with Last Month
- Quick Action Link

---

# Header Actions

Buttons

- Refresh Dashboard
- Export Dashboard
- More Actions

---

# Active Loads Widget

Display

- Load Number
- Route
- Status
- Assigned Driver
- ETA

Actions

- View Load
- Track Load

---

# Upcoming Deliveries

Display

- Delivery Date
- Load Number
- Route
- ETA
- Delivery Status

Actions

- View Details

---

# Recent Documents

Display

- POD
- Invoice
- Condition Report
- Contract
- Load Photos

Actions

- Preview
- Download

---

# Recent Activity Timeline

Display latest activities

- Load Updated
- Driver Assigned
- POD Uploaded
- Invoice Created
- Payment Received
- New Message

Each activity includes

- Date
- Time
- User
- Description

---

# Invoice Summary

Display

- Total Invoices
- Paid
- Outstanding
- Overdue
- Outstanding Amount
- Paid This Month

Actions

- View Invoices
- Make Payment

---

# Recent Invoices

Display

- Invoice Number
- Invoice Date
- Amount
- Status

Status

- Paid
- Outstanding
- Overdue
- Partially Paid

---

# Search

Search by

- Load ID
- Invoice Number
- Customer Reference
- Route

---

# Notifications

Customer receives

- New Booking Confirmation
- Load Status Updated
- Driver Assigned
- POD Uploaded
- Invoice Generated
- Payment Received
- Delivery Completed

---

# Business Rules

- Dashboard loads customer-specific data only.
- KPI cards update in real-time.
- Outstanding balance equals unpaid invoices.
- Recent activity displays latest events first.
- Only authorized customer data is visible.

---

# Permissions

Customer

- View Dashboard
- Export Dashboard
- View Widgets

Company Admin

- View Company Dashboard

---

# Database Tables

- customers
- dashboard_summary
- loads
- invoices
- payments
- documents
- notifications
- activities

---

# APIs

GET /customer/dashboard

GET /customer/dashboard/summary

GET /customer/dashboard/activities

GET /customer/dashboard/invoices

GET /customer/dashboard/loads

GET /customer/dashboard/documents

---

# Audit Logs

Track

- Dashboard Viewed
- Dashboard Exported
- Widget Opened
- Quick Action Clicked

---

# Acceptance Criteria

- Dashboard loads within 3 seconds.
- KPI cards display correct values.
- Active Loads update automatically.
- Recent Activity refreshes correctly.
- Invoice Summary is accurate.
- Documents are downloadable.
- Dashboard is fully responsive.
- Audit logs are generated.

# My-Loads-PRD.md

# Customer Portal → My Loads

## Module Overview

The **My Loads** module allows customers to view, search, filter, track, and manage all transport bookings and freight loads. Customers can monitor every shipment from booking until delivery while accessing load details, tracking, PODs, invoices, and related documents.

---

# Objectives

- View all customer loads
- Track shipment progress
- Search loads quickly
- Filter by status
- View load details
- Create new booking
- Download load information

---

# Navigation

Customer Portal

→ My Loads

---

# Dashboard Summary Cards

Display

- Total Loads
- In Transit
- Upcoming
- Completed
- Cancelled

Each card displays

- Total Count
- Quick View Link

---

# Header Actions

Buttons

- Refresh
- Download
- Create Booking

---

# Search

Search By

- Load Number
- PO Reference
- Driver Name
- Route
- Customer Reference

---

# Filters

Status

- All
- In Transit
- Upcoming
- Completed
- Cancelled

Load Type

- Car Carrier
- General Freight
- Dangerous Goods
- Warehousing / 3PL

Date Range

- Start Date
- End Date

---

# Loads Table

Display Columns

- Load ID
- PO Reference
- Route
- Load Type
- Status
- Driver
- Pickup Date
- Delivery Date
- ETA
- Actions

---

# Load Status

Supported

- Draft
- Confirmed
- Scheduled
- At Pickup
- Loaded
- Dispatched
- In Transit
- Arrived
- Delivered
- Cancelled

---

# Actions

Each Load Supports

- View Details
- Live Tracking
- View Documents
- Download POD
- View Invoice
- Message Dispatch

---

# Pagination

Supports

- Previous
- Next
- Page Numbers
- Rows Per Page

---

# Load Analytics

Display

- Total Loads
- In Transit
- Delivered
- Scheduled
- Delayed
- Cancelled

---

# Load Types

Display

- Car Carrier
- General Freight
- Dangerous Goods
- Warehousing

---

# Quick Filters

Display

- Requires Attention
- Delayed Loads
- POD Pending
- Invoice Pending

---

# Create Booking

Button

+ Create Booking

Redirects to

Create Booking Module

---

# Business Rules

- Customer sees only their own loads.
- Latest status displayed automatically.
- ETA updates in real time.
- Delivered loads become read-only.
- Cancelled loads cannot be edited.

---

# Notifications

Customer receives

- Booking Confirmed
- Driver Assigned
- Pickup Started
- Load Dispatched
- In Transit
- Delivered
- POD Uploaded
- Invoice Generated

---

# Permissions

Customer

- View Loads
- Search Loads
- Filter Loads
- Track Loads
- Download Documents

Company Admin

- View Company Loads

---

# Database Tables

- customer_loads
- loads
- load_status
- load_tracking
- load_documents
- load_items
- audit_logs

---

# APIs

GET /customer/loads

GET /customer/loads/{id}

GET /customer/loads/status

GET /customer/loads/tracking

GET /customer/loads/documents

---

# Audit Logs

Track

- Load Viewed
- Load Downloaded
- Tracking Opened
- Filters Applied
- Search Performed

---

# Acceptance Criteria

- Customer can view all loads.
- Search works correctly.
- Filters work correctly.
- Load status updates in real time.
- Tracking opens successfully.
- Documents are downloadable.
- Pagination works.
- Mobile responsive.
- Audit logs generated successfully.

```
````md id="1f9jzk"
# Create-Booking-PRD.md

# Customer Portal → Create Booking

## Module Overview

The **Create Booking** module allows customers to submit new transport requests by providing pickup, delivery, freight details, service options, and special requirements. The booking is sent directly to the Dispatch Team for review and confirmation.

---

# Objectives

- Create transport bookings
- Capture shipment details
- Add multiple freight items
- Select service options
- Save draft bookings
- Submit booking requests
- Notify dispatch automatically

---

# Navigation

Customer Portal

→ Create Booking

---

# Booking Workflow

Step 1

Booking Details

↓

Step 2

Items & Freight

↓

Step 3

Options & Requirements

↓

Step 4

Review & Submit

↓

Booking Submitted

---

# Header Actions

Buttons

- Save as Draft
- Clear Form
- Submit Booking Request
- More Actions

---

# Step 1 – Booking Details

## Pickup Details

Fields

- Pickup Location *
- Pickup Date *
- Pickup Time *
- Ready From
- Contact Name
- Contact Phone
- Pickup Instructions

---

## Delivery Details

Fields

- Delivery Location *
- Delivery Date *
- Delivery Time *
- Delivery From
- Delivery Until
- Contact Name
- Contact Phone
- Delivery Instructions

---

# Step 2 – Items & Freight

Display

Items Table

Columns

- Item Type
- Description
- Quantity
- Weight
- Dimensions
- Declared Value
- Actions

Buttons

- Add Item
- Edit Item
- Delete Item

---

# Freight Types

Supported

- Car Carrier
- General Freight
- Dangerous Goods
- Warehousing / 3PL

---

# Step 3 – Options & Requirements

Service Options

- Express Delivery
- Insurance
- Tail Lift
- Enclosed Transport
- Temperature Controlled
- Special Equipment

Additional Notes

- Dispatch Notes
- Special Instructions

---

# Step 4 – Review & Submit

Display Summary

- Route
- Pickup Details
- Delivery Details
- Total Items
- Total Weight
- Declared Value
- Service Options
- Special Instructions

---

# Confirmation Popup

Display

- Route
- Booking Date
- Total Items
- Total Weight

Buttons

- Review Form
- Submit Request

---

# Booking Status

Supported

- Draft
- Submitted
- Under Review
- Quote Sent
- Confirmed
- Scheduled
- Cancelled

---

# Search

Search Previous Drafts By

- Booking Number
- Route
- Date

---

# Validations

Required Fields

- Pickup Location
- Delivery Location
- Pickup Date
- At least One Item
- Freight Type

Validation Rules

- Pickup Date cannot be in the past.
- Delivery Date must be after Pickup Date.
- Weight must be greater than 0.
- Declared Value cannot be negative.

---

# Notifications

Customer receives

- Booking Saved
- Booking Submitted
- Booking Confirmed
- Quote Ready
- Booking Cancelled

Dispatch receives

- New Booking Request
- Booking Updated

---

# Business Rules

- Customer can save unlimited drafts.
- Booking number generated automatically.
- Booking becomes read-only after confirmation.
- Dispatch reviews every submitted booking.
- Multiple freight items are supported.

---

# Permissions

## Customer

- Create Booking
- Save Draft
- Edit Draft
- Submit Booking
- View Booking Status

## Dispatcher

- Review Booking
- Approve
- Reject
- Convert to Load

---

# Database Tables

- bookings
- booking_items
- booking_routes
- booking_services
- booking_notes
- booking_status
- audit_logs

---

# APIs

GET /customer/bookings

POST /customer/bookings

PUT /customer/bookings/{id}

POST /customer/bookings/{id}/submit

GET /customer/bookings/{id}

DELETE /customer/bookings/{id}

---

# Audit Logs

Track

- Booking Created
- Draft Saved
- Booking Updated
- Booking Submitted
- Booking Cancelled
- Item Added
- Item Removed

---

# Acceptance Criteria

- Customer can create a booking.
- Multiple items can be added.
- Draft booking saves successfully.
- Validation prevents incomplete submissions.
- Booking submits successfully.
- Dispatch receives booking instantly.
- Booking status updates correctly.
- Responsive on Desktop, Tablet, and Mobile.
```
````
# Invoices-&-Payments-PRD.md

# Customer Portal → Invoices & Payments

## Module Overview

The **Invoices & Payments** module enables customers to view all invoices, monitor payment status, download tax invoices, make secure online payments, manage saved payment methods, and access complete billing history.

---

# Objectives

- View all invoices
- Track payment status
- Download tax invoices
- Pay invoices online
- View payment history
- Manage saved payment methods
- Download account statements

---

# Navigation

Customer Portal

→ Invoices & Payments

---

# Dashboard Summary Cards

Display

- Total Invoices
- Paid
- Outstanding
- Overdue
- Outstanding Balance
- Paid This Month

---

# Header Actions

Buttons

- Refresh
- Export
- Make Payment

---

# Invoice Summary

Display

- Total Invoices
- Paid Invoices
- Outstanding Invoices
- Partially Paid
- Overdue Invoices
- Outstanding Amount

---

# Invoice List

Display Columns

- Invoice Number
- Related Load
- Invoice Date
- Due Date
- Amount
- Payment Status
- Actions

---

# Invoice Status

Supported

- Draft
- Issued
- Pending
- Partially Paid
- Paid
- Overdue
- Cancelled

---

# Invoice Details

Display

- Invoice Number
- Customer Name
- Related Load
- Invoice Date
- Due Date
- GST
- Line Items
- Total Amount
- Outstanding Balance
- Payment Status

Buttons

- Download PDF
- Pay Invoice
- Print Invoice

---

# Line Item Breakdown

Display

- Freight Charges
- Fuel Surcharge
- Insurance
- Additional Charges
- GST
- Total Amount

---

# Payment History

Display

- Payment Date
- Payment Method
- Transaction ID
- Amount
- Status

---

# Payment Status

Supported

- Pending
- Processing
- Paid
- Failed
- Refunded

---

# Pay Invoice

Supports

- Stripe Payment Gateway
- Credit Card
- Debit Card
- Saved Payment Methods

Fields

- Card Holder Name
- Card Number
- Expiry Date
- CVV

Buttons

- Confirm Payment
- Cancel

---

# Saved Payment Methods

Display

- Default Card
- Saved Cards
- Bank Accounts

Actions

- Add
- Remove
- Make Default

---

# Account Statement

Display

- Current Balance
- Outstanding Balance
- Payments Received
- Credits
- Statement Period

Buttons

- Download PDF
- Export CSV

---

# Search

Search By

- Invoice Number
- Load Number
- Reference Number

---

# Filters

- All
- Paid
- Outstanding
- Overdue
- Partially Paid
- Cancelled

Date Filters

- Today
- This Month
- Last Month
- Custom Range

---

# Quick Actions

- View Invoice
- Download PDF
- Pay Now
- View Payment History
- Download Statement

---

# Notifications

Customer receives

- Invoice Created
- Payment Successful
- Payment Failed
- Payment Reminder
- Invoice Overdue
- Receipt Generated

Accounts Team receives

- Payment Received
- Payment Failed

---

# Business Rules

- Only Outstanding invoices can be paid.
- Paid invoices become read-only.
- GST calculated automatically.
- Payment updates invoice instantly.
- Receipts generated automatically.

---

# Permissions

## Customer

- View Invoices
- Download PDF
- Pay Invoice
- View Statements

## Accounts Team

- Create Invoice
- Update Status
- View Payments
- Process Refunds

## Admin

- View All Invoices
- Export Reports
- Manage Payments

---

# Database Tables

- invoices
- invoice_items
- payments
- payment_methods
- payment_transactions
- account_statements
- audit_logs

---

# APIs

GET /customer/invoices

GET /customer/invoices/{id}

POST /customer/payments

GET /customer/payment-history

GET /customer/account-statement

GET /customer/invoices/pdf

---

# Audit Logs

Track

- Invoice Viewed
- Invoice Downloaded
- Payment Started
- Payment Successful
- Payment Failed
- Receipt Downloaded

---

# Acceptance Criteria

- Customer can view invoices.
- Invoice details load correctly.
- PDF downloads successfully.
- Online payment works securely.
- Payment history updates instantly.
- Saved payment methods function correctly.
- Account statement downloads successfully.
- Invoice status updates automatically.
- Audit logs record all payment activities.
- Fully responsive on Desktop, Tablet, and Mobile.

```
# Documents-&-PODs-PRD.md

# Customer Portal → Documents & PODs

## Module Overview

The **Documents & PODs** module allows customers to access, upload, download, preview, and manage all shipment-related documents from a single location. Customers can view Proof of Delivery (POD), Invoices, Condition Reports, Delivery Photos, Contracts, Rate Confirmations, and other logistics documents linked to their loads.

---

# Objectives

- Centralized document repository
- Download shipment documents
- View Proof of Delivery (POD)
- Upload customer documents
- Request missing documents
- Preview files online
- Search and filter documents
- Track upload history

---

# Navigation

Customer Portal

→ Documents & PODs

---

# Dashboard Summary Cards

Display

- Total Documents
- POD Documents
- Invoices
- Condition Reports
- Other Documents

Each card displays

- Total Count
- Quick View Link

---

# Header Actions

Buttons

- Upload Document
- Request Document
- Download Selected
- More Actions

---

# Search

Search By

- Document Name
- Load Number
- Reference Number
- Invoice Number

---

# Filters

Document Type

- All Documents
- POD
- Invoice
- Condition Report
- Photos
- Other Documents

Load Filter

- All Loads

Date Filter

- Upload Date
- Custom Date Range

---

# Documents Table

Display Columns

- Document Name
- Document Type
- Customer
- Related Load
- Route
- Upload Date
- Uploaded By
- File Size
- Actions

---

# Supported Document Types

- Proof of Delivery (POD)
- Tax Invoice
- Condition Report
- Pre-Load Report
- Delivery Photos
- Pickup Photos
- Load Photos
- Rate Confirmation
- Delivery Instructions
- Contract
- Bill of Lading
- Customs Documents
- Other Documents

---

# Document Status

Supported

- Uploaded
- Available
- Requested
- Pending Approval
- Archived

---

# Document Actions

Each document supports

- Preview
- Download
- Share
- Print
- View Details

---

# Upload Document

Purpose

Upload customer documents including POD, signed documents, customs paperwork and supporting files.

Fields

- Document Title *
- Document Category *
- Related Load *
- Attachment *

Supported Files

- PDF
- JPG
- PNG
- DOCX
- XLSX

Maximum Size

10 MB

Buttons

- Save & Upload
- Cancel

---

# Request Document

Purpose

Customer can request missing documents from Dispatch.

Fields

- Document Needed
- Related Load Number
- Notes / Instructions

Buttons

- Send Request
- Cancel

Request Types

- Signed POD
- Condition Report
- Invoice
- Load Photos
- Delivery Photos
- Customs Documents
- Other

---

# Document Preview

Display

- File Name
- File Type
- Upload Date
- Uploaded By
- Related Load
- File Size

Actions

- Download
- Print
- Share

---

# Recently Uploaded

Display

- File Name
- Upload Date
- File Size

---

# Document Analytics

Display

- Total Documents
- POD Percentage
- Invoice Percentage
- Report Percentage
- Other Documents Percentage

---

# Quick Actions

- Upload Document
- Request Document
- Download Statement
- Contact Dispatch

---

# Notifications

Customer receives

- Document Uploaded
- POD Available
- Invoice Uploaded
- Request Approved
- Request Completed
- New Document Added

Dispatch receives

- New Document Request
- Customer Upload

---

# Business Rules

- Customers can only view their own documents.
- Every document must belong to one customer.
- Related load is mandatory for shipment documents.
- Maximum upload size is 10 MB.
- Duplicate documents are prevented.
- Deleted documents remain in audit logs.
- POD becomes available only after delivery completion.

---

# Permissions

## Customer

- View Documents
- Download Documents
- Upload Documents
- Request Documents

## Dispatcher

- Upload Documents
- Approve Requests
- Share Documents

## Accounts

- Upload Invoices
- View Documents

## Admin

- Full Access

---

# Database Tables

- documents
- document_categories
- document_requests
- document_uploads
- document_versions
- load_documents
- audit_logs

---

# APIs

GET /customer/documents

GET /customer/documents/{id}

POST /customer/documents/upload

POST /customer/documents/request

GET /customer/documents/download/{id}

GET /customer/documents/search

DELETE /customer/documents/{id}

---

# Audit Logs

Track

- Document Uploaded
- Document Downloaded
- Document Viewed
- Document Requested
- Request Completed
- Document Shared
- Document Deleted

---

# Validation Rules

- Document Title is required.
- Category is mandatory.
- Related Load is required for shipment documents.
- Only supported file formats are accepted.
- Maximum upload size is 10 MB.
- Duplicate document names are allowed only if versioned.

---

# Acceptance Criteria

- Customer can view all available documents.
- Search and filters work correctly.
- Documents download successfully.
- Upload functionality works.
- Document requests are submitted successfully.
- PODs become available after delivery.
- Preview works for supported files.
- Notifications are sent correctly.
- Audit logs capture all document activities.
- Fully responsive on Desktop, Tablet, and Mobile.

```

# Messages-&-Support-PRD.md

# Customer Portal → Messages & Support

## Module Overview

The **Messages & Support** module enables customers to communicate directly with Dispatch, Support, and Accounts teams, manage conversations, create support tickets, track ticket status, and access self-help resources from one centralized communication hub.

---

# Objectives

- Communicate with Dispatch Team
- Raise Support Tickets
- Track Ticket Status
- Receive System Notifications
- Manage Conversations
- Access Help Articles
- Improve Customer Support Experience

---

# Navigation

Customer Portal

→ Messages & Support

---

# Dashboard Summary Cards

Display

- Unread Messages
- Open Tickets
- Awaiting Response
- Resolved Tickets (Last 30 Days)

Each card contains

- Count
- Quick View Link

---

# Header Actions

Buttons

- Message Dispatch
- Create Support Ticket
- More Actions

---

# Conversation Search

Search By

- Conversation
- Load Number
- Subject
- Team Name

---

# Filters

Conversation Type

- All
- Dispatch
- Support
- Accounts
- General

Status

- Open
- Closed
- Awaiting Reply

---

# Conversation List

Display Columns

- Team
- Subject
- Last Message
- Date & Time
- Unread Count
- Status

Supported Teams

- Dispatch Team
- Support Team
- Accounts Team
- Customer Success

---

# Conversation Window

Display

- Team Name
- Conversation Started Date
- Related Load
- Message Timeline
- Read Status
- Attachments

Actions

- Send Message
- Attach File
- View Load
- Close Conversation

---

# Messaging Features

Supported

- Real-Time Chat
- Read Receipts
- Typing Indicator
- File Attachments
- Message History
- Emoji Support (Optional)

---

# Dispatch Contact

Display

- Expected Response Time
- Contact Dispatch Button
- Related Load Information

---

# Support Tickets

Display

- Ticket Number
- Subject
- Created Date
- Category
- Priority
- Status

Supported Status

- Open
- In Progress
- Awaiting Customer
- Resolved
- Closed

---

# Create Support Ticket

Purpose

Allow customers to report issues directly to Hero Logistics Support.

Fields

- Subject Heading *
- Category *
- Priority *
- Problem Description *
- Attachment (Optional)

Supported Categories

- Portal Support
- Billing
- Invoice
- Booking
- Documents
- Tracking
- Technical Issue
- General Enquiry

Priority Levels

- Low
- Normal
- High
- Critical

Buttons

- Submit Ticket
- Cancel

---

# Ticket Workflow

Create Ticket

↓

Support Review

↓

Assigned Agent

↓

In Progress

↓

Customer Reply (If Required)

↓

Resolved

↓

Closed

---

# Attachments

Supported Files

- PDF
- JPG
- PNG
- DOCX
- XLSX

Maximum Size

10 MB

---

# Help Resources

Display

- Customer Portal Guide
- Frequently Asked Questions
- How to Track a Load
- Contact Support
- Knowledge Base

---

# Notifications

Customer receives

- New Message
- Dispatch Reply
- Ticket Created
- Ticket Updated
- Ticket Resolved
- Ticket Closed

Support Team receives

- New Ticket
- Customer Reply
- Attachment Uploaded

---

# Business Rules

- Customers can only view their own conversations.
- Every support ticket receives a unique ticket number.
- Closed tickets become read-only.
- Attachments must not exceed 10 MB.
- Every ticket is linked to one customer account.
- Message history cannot be deleted.

---

# Permissions

## Customer

- View Conversations
- Send Messages
- Create Tickets
- Reply to Tickets
- Upload Attachments

## Dispatch Team

- Reply to Dispatch Messages
- Update Load Conversations

## Support Team

- View Tickets
- Respond
- Resolve Tickets
- Close Tickets

## Accounts Team

- Respond to Billing Queries

## Admin

- Full Access

---

# Database Tables

- conversations
- conversation_messages
- support_tickets
- ticket_comments
- ticket_attachments
- help_articles
- notifications
- audit_logs

---

# APIs

GET /customer/messages

POST /customer/messages

GET /customer/messages/{id}

GET /customer/support-tickets

POST /customer/support-tickets

PUT /customer/support-tickets/{id}

POST /customer/support-tickets/reply

GET /customer/help-articles

---

# Audit Logs

Track

- Conversation Opened
- Message Sent
- Message Read
- Ticket Created
- Ticket Updated
- Ticket Resolved
- Attachment Uploaded
- Help Article Viewed

---

# Validation Rules

- Subject is required.
- Category is mandatory.
- Problem Description is required.
- Priority must be selected.
- Maximum attachment size is 10 MB.
- Only supported file formats are accepted.

---

# Acceptance Criteria

- Customer can send messages to Dispatch.
- Conversations update in real-time.
- Support tickets are created successfully.
- Ticket status updates correctly.
- File attachments upload successfully.
- Help articles are accessible.
- Notifications are delivered properly.
- Search and filters work correctly.
- Audit logs record all communication activities.
- Fully responsive on Desktop, Tablet, and Mobile.

```

# Account-&-User-Management-PRD.md

# Customer Portal → Account & User Management

## Module Overview

The **Account & User Management** module allows customers to manage their company profile, portal users, roles, permissions, account settings, notification preferences, and login security. Company administrators can invite team members, assign portal roles, activate/deactivate users, and maintain secure access to the Customer Portal.

---

# Objectives

- Manage company users
- Invite new portal users
- Assign portal roles
- Activate/Deactivate users
- Manage profile information
- Improve account security
- Track user activity

---

# Navigation

Customer Portal

→ Account & User Management

---

# Dashboard Summary

Display

- Total Users
- Active Users
- Pending Invitations
- Disabled Users
- Company Administrator

---

# Header Actions

Buttons

- Add New User
- Export Users
- Refresh
- More Actions

---

# User List

Display Columns

- User Name
- Email
- Phone
- Role
- Status
- Last Login
- Created Date
- Actions

---

# User Status

Supported

- Active
- Pending Invitation
- Disabled
- Locked
- Deleted

---

# Portal Roles

Supported Roles

### Company Administrator

Permissions

- Full Customer Portal Access
- Manage Users
- Create Bookings
- View All Loads
- Pay Invoices
- Download Documents
- Manage Company Settings

---

### Booking User

Permissions

- Create Booking
- View Loads
- View Documents
- Message Dispatch

Cannot

- Manage Users
- Pay Invoices
- Change Company Settings

---

### Finance User

Permissions

- View Invoices
- Pay Invoices
- Download Statements
- View Payment History

---

### Read Only User

Permissions

- View Loads
- View Documents
- View Dashboard

Cannot Edit Any Data

---

# Add New Portal User

Purpose

Invite a new employee to access the Customer Portal.

Fields

## Full Name *

Text

Required

Maximum 100 Characters

Example

Sarah Jenkins

---

## Email Address *

Email

Required

Must be unique.

Example

sarah.jenkins@abctransport.com.au

---

## Phone Number

Optional

Australian Mobile Validation

Example

0400 123 456

---

## Portal Role *

Dropdown

- Company Administrator
- Booking User
- Finance User
- Read Only User

---

## Account Status

Dropdown

- Active
- Pending Invitation
- Disabled

Default

Active

---

Buttons

- Invite User
- Cancel

---

# Invite User Workflow

Company Admin

↓

Enter User Details

↓

Validate Email

↓

Generate Invitation

↓

Send Email Invitation

↓

User Accepts Invitation

↓

Create Password

↓

Account Activated

---

# Edit User

Fields

- Full Name
- Phone Number
- Role
- Status

Actions

- Save Changes
- Cancel

---

# Reset Password

Actions

- Send Reset Email
- Force Password Change
- Unlock Account

---

# Disable User

Confirmation Required

Display

"Are you sure you want to disable this user?"

Buttons

- Disable
- Cancel

---

# Company Profile

Display

- Company Name
- ABN
- Email
- Phone
- Billing Address
- Company Logo

Actions

- Edit
- Save

---

# Notification Settings

Customer Can Configure

- Email Notifications
- SMS Notifications
- Booking Updates
- Invoice Notifications
- POD Notifications
- Marketing Emails

---

# Security Settings

Display

- Change Password
- Two-Factor Authentication (2FA)
- Login Sessions
- Device History
- Login Activity

---

# User Activity

Track

- Last Login
- Last Logout
- Browser
- Device
- IP Address

---

# Notifications

Users receive

- Invitation Email
- Welcome Email
- Password Reset
- Account Activated
- Account Disabled
- Role Changed

Admin receives

- User Joined
- Invitation Accepted
- Failed Login Alerts

---

# Business Rules

- Email address must be unique.
- Invitation expires after 7 days.
- Only Company Administrator can manage users.
- Disabled users cannot log in.
- One company must always have at least one Administrator.
- Deleted users remain in audit logs.

---

# Permissions

## Company Administrator

Full Access

## Booking User

Booking Only

## Finance User

Finance Modules Only

## Read Only User

View Only

---

# Database Tables

- users
- user_roles
- user_permissions
- invitations
- login_history
- notification_settings
- company_profiles
- audit_logs

---

# APIs

GET /customer/users

POST /customer/users

PUT /customer/users/{id}

DELETE /customer/users/{id}

POST /customer/users/invite

POST /customer/users/reset-password

GET /customer/company-profile

PUT /customer/company-profile

---

# Audit Logs

Track

- User Created
- Invitation Sent
- Invitation Accepted
- User Updated
- Role Changed
- User Disabled
- Password Reset
- Login Success
- Login Failed

---

# Validation Rules

- Full Name is required.
- Email must be valid and unique.
- Phone number must be valid.
- Role selection is mandatory.
- Administrator role cannot be removed from the last active admin.

---

# Acceptance Criteria

- Company Admin can invite new users.
- Invitation email is sent successfully.
- User can activate account from email.
- Roles are assigned correctly.
- User status updates properly.
- Password reset works.
- Security settings function correctly.
- Audit logs record all user activities.
- Responsive on Desktop, Tablet, and Mobile.

```


