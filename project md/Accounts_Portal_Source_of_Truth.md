# HERO Logistics — Accounts Portal Source of Truth

## Document Purpose

This document is the authoritative functional specification for the **Accounts Portal** in HERO Logistics.

The Accounts Portal is the company/tenant financial operations workspace. Its responsibility is to convert verified operational activity into controlled financial transactions, reconcile incoming and outgoing money, calculate payroll and tax obligations, and expose accurate financial reporting.

> **Golden Rule:** Accounts does not create operational truth. Accounts financially processes verified operational truth.

---

# 1. Role Definition

## Accounts Portal

The Accounts role belongs to a transport company/tenant.

Accounts users are created by the **Company Admin** through tenant-level user and permission management.

Typical permission levels may include:

- Accounts Manager
- Accounts Officer
- Payroll Officer
- Read-Only Accountant

These are permission levels within the same Accounts Portal, not separate portals.

### Accounts Manager — Recommended Full Access

Can:

- View Accounts Dashboard
- Review and approve invoices
- Send invoices
- Record and reconcile payments
- Allocate payments to invoices
- Process approved refunds
- Run payroll
- Approve payroll
- Review employee pay
- Review contractor claims
- Approve contractor claims
- Review expenses
- Approve reimbursements
- View GST / PAYG
- View P&L
- View vehicle costs
- Run reports
- Read linked load, POD, customer and delivery proof data

### Accounts Officer — Recommended Restricted Access

Can:

- Prepare invoices
- Review invoice details
- Record payments
- Prepare allocations
- Prepare payroll
- Review expenses
- Prepare contractor claims

Cannot by default:

- Final approve payroll
- Final approve refunds
- Final approve sensitive financial transactions
- Change global financial configuration

### Accounts must not perform operational actions by default

Accounts should not:

- Create or dispatch operational loads
- Assign drivers
- Change driver run status
- Move warehouse stock
- Edit POD or delivery evidence
- Create branches
- Manage fleet master data
- Change warehouse locations
- Manage platform subscriptions
- Manage platform-level users
- Change operational pricing rules without explicit permission

Accounts may view operational records as supporting evidence.

---

# 2. Final Menu Structure

```text
ACCOUNTS PORTAL

Accounts Dashboard

Invoice Review

Sent Invoices

Payments

Payroll

Contractor Pay

Employee Pay

Expenses

GST / PAYG

P&L

Vehicle Costs

Reports

Profile
```

Do not create extra top-level modules unless clearly required by an approved business rule.

---

# 3. Global Data Rules

Every Accounts record must be tenant scoped.

Minimum tenant isolation rule:

```text
companyId / tenantId
```

must be enforced in backend queries, writes, reports, exports and aggregates.

No Accounts user may read or mutate another company's financial data.

All sensitive write actions must be protected by backend RBAC.

Frontend visibility is not security.

Every financial mutation must generate an audit trail containing, where applicable:

- actorUserId
- actorRole
- companyId / tenantId
- action
- record type
- record id
- previous value
- new value
- reason
- timestamp
- source
- related load/customer/employee/payment/invoice
- IP/device metadata where supported

---

# 4. Accounts Dashboard

The dashboard is a financial overview, not an independent dataset.

Recommended cards:

- Draft Invoices
- In Review
- Sent Invoices
- Paid Invoices
- Overdue Invoices
- Payroll Due
- Expenses
- Gross Margin

Recommended widgets:

- Invoice Status Overview
- Invoices & Payments Trend
- Overdue Invoices
- Recent Financial Activity
- Payroll Due / Next Pay Run
- Expense Approval Queue
- Cash / Receivables summary where supported

All dashboard values must be derived from live source records.

Examples:

```text
Paid Invoices
→ invoice/payment allocation state

Payroll Due
→ approved or processing pay runs

Expenses
→ posted/approved expense transactions

Gross Margin
→ P&L calculation source
```

Never maintain separate hard-coded dashboard counts.

---

# 5. Customer Revenue Golden Flow

```text
CUSTOMER
   ↓
LOAD
   ↓
PRICING
   ↓
DISPATCHER
   ↓
DRIVER
   ↓
DELIVERY
   ↓
POD / SIGNATURE / DELIVERY EVIDENCE
   ↓
BILLABLE LOAD
   ↓
INVOICE DRAFT
   ↓
ACCOUNTS REVIEW
   ↓
READY TO SEND
   ↓
SENT
   ↓
PAYMENT
   ↓
PAYMENT ALLOCATION
   ↓
PART PAID / PAID
   ↓
REVENUE / RECEIVABLES
   ↓
GST
   ↓
P&L
```

The load should not be financially billed from unrelated manually typed data.

---

# 6. Invoice Review

Invoice Review is the main financial control point before customer billing.

Recommended invoice preparation flow:

```text
Delivered Load + POD
        ↓
Pricing calculates approved charges
        ↓
Draft Invoice
        ↓
In Review
        ↓
Accounts verifies:
- Customer
- Load
- Pricing
- Lane
- Load Type
- Base Charge
- Fuel Surcharge
- Accessorial Charges
- GST
- Billing Terms
- POD
- Signature
- Delivery Evidence
- Attachments
        ↓
Problem?
  ┌─────┴─────┐
 YES          NO
 ↓             ↓
On Hold     Ready to Send
or Reject       ↓
             Approve & Send
```

Recommended invoice statuses:

- Draft
- In Review
- Ready to Send
- On Hold
- Rejected
- Sent
- Partially Paid
- Paid
- Overdue
- Cancelled / Voided where allowed

Invoice line items should derive from approved business data.

Example:

```text
LOAD-1245

Base Freight        $4,000
Fuel Surcharge        $500
Accessorial           $300
---------------------------
Subtotal             $4,800
GST                    $480
---------------------------
Invoice Total        $5,280
```

Recommended upstream relation:

```text
Customer
+
Load
+
Pricing Rule
+
Lane
+
Load Type
+
Fuel Surcharge
+
Approved Accessorial Charges
=
Invoice
```

---

# 7. POD to Invoice Rule

Where POD is required, final customer billing should not be approved without the required delivery proof.

```text
Driver Delivery
      ↓
Signature
Photos
Damage Status
Delivery Timestamp
POD
      ↓
Load = Delivered
      ↓
Billable
      ↓
Invoice Draft
```

Accounts receives read-only operational evidence.

Accounts may view:

- Load
- Customer
- Pickup
- Delivery
- Driver
- Vehicle
- Items
- POD
- Signature
- Delivery Photos
- Approved Charges

Accounts must not silently edit the operational proof.

If correction is needed, return the issue to the correct operational role or use a controlled correction workflow.

---

# 8. Manual Invoice Creation

`Create Invoice` may exist, but it should not become the primary billing mechanism for normal delivered loads.

Primary flow:

```text
Delivered Load
→ system creates / makes eligible an invoice draft
```

Manual invoice creation should be limited to authorized cases such as:

- One-off service
- Manual adjustment
- Non-load service
- Accessorial-only invoice
- Credit/debit adjustment
- Approved miscellaneous billing

Manual invoices must require:

- reason
- source/reference
- customer
- amount
- GST treatment
- creator
- timestamp
- approval where required
- audit log

---

# 9. Sent Invoices / Accounts Receivable

Sent Invoices represents customer receivables.

Recommended lifecycle:

```text
Sent
↓
Outstanding
↓
Partially Paid
↓
Paid
```

Time-based classification:

```text
Sent
↓
Due Date Passed
↓
Overdue
```

Aging buckets should include:

- 0–30 days
- 31–60 days
- 61–90 days
- 90+ days

The table, summary cards and aging report must reconcile to the same underlying invoice/payment data.

Known audit concern from current UI:

- Sent Invoice summary shows non-zero totals while the table may show `NO MATCHING SENT INVOICES FOUND`.

Audit:

- table API/data source
- summary API/data source
- default filters
- search state
- date filters
- pagination
- tenant scoping
- frontend fallback/mock data

All views must reconcile.

---

# 10. Payments

Payments represents money received from customers.

Recommended payment fields:

- Payment Reference
- Payment Date
- Customer
- Payment Method
- Amount Received
- Currency
- Bank/reference details
- Notes
- Attachments/receipt if relevant
- Allocation status
- Created by
- Updated by

Recommended payment states:

- Unallocated
- Partially Allocated
- Fully Allocated
- Overpayment
- Refunded / Partially Refunded where applicable

Core flow:

```text
Customer Payment Received
        ↓
Payment Record
        ↓
Can Invoice Be Matched?
   ┌────┴─────┐
  YES         NO
   ↓           ↓
Allocate    Unallocated
   ↓
Invoice Balance Reduced
   ↓
Partially Paid / Paid
```

---

# 11. Payment Allocation

Payment and invoice payment status are not the same record.

Recommended relation:

```text
Payment
PAY-1077
$2,000
        ↓
Payment Allocation
        ↓
INV-1051
$2,000
```

One payment may allocate to multiple invoices.

```text
PAY-2001 = $10,000

INV-1001 = $3,000
INV-1002 = $5,000
INV-1003 = $2,000
```

One invoice may receive multiple payments.

Invoice outstanding balance must be calculated from valid allocations, refunds and adjustments.

Do not simply store a manual `paid = true` toggle disconnected from financial transactions.

---

# 12. Refunds

Refunds are controlled financial reversals.

Recommended flow:

```text
Select Payment
→ Validate Refundable Amount
→ Enter Refund Amount
→ Reason
→ Authorization / Permission Check
→ Confirm
→ Refund Transaction Created
→ Recalculate Allocation / Balance if necessary
→ Update financial reporting
→ Audit Trail
```

Do not delete the original payment.

Preserve complete history.

---

# 13. Payroll

Payroll is the payroll calculation and approval engine.

Recommended source:

```text
Employee
+
Approved Timesheet
+
Salary / Hourly Pay Rule
+
Overtime
+
Allowances
+
Load Allowances
+
Distance Allowances
+
Reimbursements
-
Deductions
-
PAYG
=
Net Pay
```

Recommended payroll statuses:

```text
Draft
→ Calculated
→ Pending Approval
→ Approved
→ Processing
→ Paid
```

Recommended payroll actions:

- Create / Run Payroll
- Pull or import approved timesheets
- Review calculations
- Review allowances
- Review deductions
- Review PAYG
- Review super where applicable
- Approve payroll
- Mark/process payment through approved integration or workflow
- Generate payslips
- Audit changes

---

# 14. Timesheet to Payroll Connection

Driver flow:

```text
Start Work
↓
Clock In
↓
Break
↓
Clock Out
↓
Timesheet
↓
Approval
↓
Payroll
```

Warehouse/Yard/Dispatcher/other staff may follow equivalent shift/timesheet flow.

Payroll must use the same approved timesheet source.

Do not create duplicate payroll hours manually when approved source timesheets already exist.

---

# 15. Payroll vs Employee Pay

These modules must have separate responsibilities.

## Payroll

Purpose:

```text
Payroll processing engine
```

Contains:

- Pay periods
- Pay groups
- Timesheets
- Calculations
- Allowances
- Deductions
- Super
- PAYG
- Approvals
- Payroll settings
- Pay run preparation

## Employee Pay

Purpose:

```text
Approved employee payment execution and history
```

Contains:

- Approved Pay Runs
- Employee-level pay records
- Payment status
- Payslips
- Payment/bank export state
- Payment history

Relationship:

```text
PAYROLL
Calculate
   ↓
Approve
   ↓
EMPLOYEE PAY
Process Payment
   ↓
Paid
   ↓
Payslip / Pay History
```

If the current code uses both modules for the exact same dataset and workflow, do not blindly duplicate them.

Audit the current backend and frontend, then either:

- separate responsibilities properly, or
- merge only if approved and there is no unique business purpose

Do not remove existing functionality before audit.

---

# 16. Contractor Pay

Contractor Pay is separate from Employee Pay.

Recommended flow:

```text
Contractor Performs Service / Load
        ↓
Contractor Claim
        ↓
Linked Load / Service
        ↓
Claim Amount
        ↓
GST if applicable
        ↓
Accounts Review
        ↓
Approve / Reject
        ↓
Payment
        ↓
Contractor Payable Cleared
        ↓
Load Cost / P&L
```

Validation before approval should verify:

- contractor assignment
- related load/service
- work completion
- POD where relevant
- approved additional charges
- duplicate claim prevention
- GST handling
- attachments/receipts

---

# 17. Expenses

Expenses captures company expenses and employee/driver claims.

Recommended categories may include:

- Fuel
- Tolls
- Repairs
- Tyres
- Maintenance
- Parking
- Accommodation
- Meals
- Insurance
- Registration
- Other

Recommended flow:

```text
Employee / Driver / Authorized User Submits Expense
        ↓
Receipt / Evidence
Amount
Category
Vehicle
Load
Date
Merchant
        ↓
Pending Approval
        ↓
Accounts Review
        ↓
Approve / Reject
        ↓
If Reimbursement Required
        ↓
Reimbursement Pending
        ↓
Reimbursed
```

Recommended statuses:

- Draft
- Submitted
- Pending Approval
- Approved
- Rejected
- Reimbursement Pending
- Reimbursed
- Cancelled

---

# 18. Driver Fuel & Expenses Integration

Driver Portal `Fuel & Expenses` must feed the Accounts Expense source.

Example:

```text
Driver: Noah Williams
Category: Fuel
Amount: $139.40
Vehicle: TRK-101
Load: LD-3987
Receipt: Uploaded
```

Accounts:

```text
Expenses
→ review
→ verify receipt
→ approve/reject
→ reimburse if applicable
```

Do not create duplicate expense records.

---

# 19. Vehicle Costs

Vehicle Costs is primarily a financial analytics view over approved vehicle-linked transactions.

Supported categories may include:

- Fuel
- Maintenance & Repairs
- Tyres
- Insurance
- Registration
- Tolls
- Other Costs

Critical rule:

> Vehicle Costs must not become a second independent expense ledger.

Example:

```text
Expense Transaction
$139.40
Category = Fuel
Vehicle = TRK-101
```

The same transaction may contribute to:

```text
Expenses
+
Vehicle Cost Analytics
+
P&L
```

but must not be duplicated three times in the database.

Recommended outputs:

- Cost by vehicle
- Cost by category
- Cost per km
- Cost per load
- Cost trend
- Top cost vehicles
- Vehicle profitability where revenue attribution exists

---

# 20. GST / PAYG

This module is the Australia-oriented tax/compliance financial view.

Expected sources:

```text
Customer Invoices
→ GST Collected

Eligible Purchases / Expenses
→ GST Credits

GST Collected
-
GST Credits
=
Net GST Payable
```

Payroll source:

```text
Employee Gross Pay
→ PAYG Withholding
→ PAYG Liability
```

Values must derive from transaction sources, not be independent manually typed totals.

Where actual external tax lodgement is not integrated, the system must clearly distinguish:

- internal calculation/reporting
from
- actual government lodgement/submission

Never claim a BAS/PAYG obligation was lodged externally unless a verified integration performed that action.

---

# 21. P&L

P&L is a consolidated output, not a manual input page.

Conceptual structure:

```text
REVENUE

Freight Income
Surcharges & Fuel Recovery
Other Income

       -

COST OF SALES

Driver Costs
Contractor Costs
Fuel
Other Direct Load Costs

       =

GROSS PROFIT

       -

OPERATING EXPENSES

Payroll
Administration
Insurance
Vehicle Maintenance
Other Operating Costs

       =

NET PROFIT
```

P&L must derive from approved/posted financial records according to the accounting rules configured for the project.

Do not manually hard-code P&L totals.

---

# 22. Reports

Reports must use the same financial source-of-truth as operational Accounts screens.

Recommended report categories:

- Financial
- Compliance
- Operations
- Payroll
- Vehicle & Assets
- Custom

Recommended reports:

- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Accounts Receivable Aging
- Accounts Payable Aging
- GST Summary
- PAYG Summary
- Payroll Summary
- Expense Summary
- Vehicle Cost Report
- Customer Revenue
- Load Profitability
- Contractor Cost
- Payment Allocation Report
- Refund Report

Exports must respect tenant scope and permissions.

---

# 23. Profile

Profile must reflect the currently authenticated Accounts user.

Recommended sections:

- Personal Information
- Security
- Preferences
- Notifications
- Role / Permission Summary

Identity must remain consistent across:

- Sidebar
- Profile
- Invoice Approver
- Payment Creator
- Payroll Creator
- Expense Approver
- Contractor Claim Approver
- Audit Log

No hard-coded demo identity may override the authenticated user.

---

# 24. Cross-Portal Connections

## Dispatcher / Driver / Accounts

```text
Dispatcher
→ Plans and assigns load

Driver
→ Executes pickup, transit and delivery

Driver
→ Captures POD

Accounts
→ Converts delivered/approved load into customer billing
```

## Driver Expenses / Accounts

```text
Driver
→ Submits fuel/toll/expense

Accounts
→ Reviews financial claim

Approved transaction
→ Expenses
→ Vehicle Costs
→ P&L
```

## Employee Timesheets / Accounts

```text
Driver / Warehouse / Yard / Staff
→ Clock in/out
→ Timesheet

Approval
→ Payroll
→ Employee Pay
→ Payslip
```

## Contractor / Accounts

```text
Contractor Assignment
→ Work Completed
→ Claim
→ Accounts Review
→ Payment
→ Cost / P&L
```

---

# 25. Backend and RBAC Requirements

All sensitive actions must be validated server-side.

Examples:

- invoice approval
- invoice send
- payment creation
- payment allocation
- refund
- payroll run
- payroll approval
- contractor claim approval
- expense approval
- reimbursement
- tax status changes
- financial export

Recommended permission concepts:

```text
accounts.dashboard.view

accounts.invoice.view
accounts.invoice.create_manual
accounts.invoice.review
accounts.invoice.approve
accounts.invoice.send

accounts.payment.view
accounts.payment.create
accounts.payment.allocate
accounts.payment.refund

accounts.payroll.view
accounts.payroll.prepare
accounts.payroll.approve
accounts.payroll.process

accounts.contractor_pay.view
accounts.contractor_pay.review
accounts.contractor_pay.approve

accounts.employee_pay.view
accounts.employee_pay.process

accounts.expense.view
accounts.expense.review
accounts.expense.approve
accounts.expense.reimburse

accounts.tax.view
accounts.tax.manage

accounts.pnl.view

accounts.vehicle_cost.view

accounts.report.view
accounts.report.export
```

Use existing project naming conventions where they already exist. Do not introduce a conflicting permission system.

---

# 26. Data Integrity Rules

## Invoices

- Invoice numbers must be unique within required scope.
- Invoice totals must equal line-item calculations.
- GST must reconcile.
- Payment allocations must never exceed valid constraints without explicit overpayment handling.
- Paid status must derive from financial balance logic.

## Payments

- Preserve original payment history.
- Refunds create separate reversal/refund records.
- Never delete payment history to simulate refund.
- Allocation totals must reconcile.

## Payroll

- Source timesheet IDs must be traceable.
- Avoid duplicate timesheet inclusion in multiple paid pay runs.
- Recalculation must be auditable.
- Paid pay runs should be immutable except through controlled adjustment/correction.

## Expenses

- Receipt requirement should be configurable.
- Duplicate expense detection should be considered.
- Reimbursement state must be independent from approval state where needed.

## Vehicle Costs

- Use linked financial transactions.
- Do not duplicate expenses.

---

# 27. Known Current UI Audit Points

Audit these before calling Accounts production-ready:

1. Sent Invoice summary/table mismatch.
2. Payroll vs Employee Pay overlap.
3. Delivered Load/POD → Invoice Draft connection.
4. Pricing → Invoice line-item connection.
5. Payment → Allocation → invoice balance/status connection.
6. Refund reversal audit flow.
7. Driver Expenses → Accounts Expenses connection.
8. Expense → Vehicle Cost analytics connection without duplicates.
9. Timesheets → Payroll connection.
10. Payroll → Driver/Employee Pay History shared data.
11. Contractor Pay → real assignment/load validation.
12. GST/PAYG → source transaction calculation.
13. P&L → consolidated financial source.
14. Reports → source-of-truth reconciliation.
15. Dashboard → live financial data.
16. Tenant isolation.
17. Backend RBAC.
18. Authenticated identity consistency.
19. Hard-coded/demo/mock numbers.
20. Full audit trail.

---

# 28. Final Architecture

```text
                    OPERATIONS
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      LOADS         TIMESHEETS      EXPENSES
        │              │              │
        ↓              ↓              ↓
 Delivery + POD      Payroll      Fuel / Toll /
        │              │          Repairs / etc.
        ↓              ↓              ↓
      Pricing       Employee Pay    Approval
        │              │              │
        ↓              ↓              ↓
 Invoice Draft       Pay          Vehicle Costs
        │              │              │
        └───────┬──────┴──────┬───────┘
                ↓             ↓
             ACCOUNTS       Contractor
                │             Claims
                │               ↓
                │          Contractor Pay
                │               │
                └───────┬───────┘
                        ↓
                 FINANCIAL SOURCE
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
       GST/PAYG        P&L          REPORTS
```

---

# 29. Final Golden Rule

```text
Driver:
"Delivery complete."

Dispatcher:
"Load completed operationally."

System/Pricing:
"These are the approved billable charges."

Accounts:
"Invoice verified, sent, payment reconciled."
```

Accounts financially processes verified operational records.

It must never silently become the operational source-of-truth.
