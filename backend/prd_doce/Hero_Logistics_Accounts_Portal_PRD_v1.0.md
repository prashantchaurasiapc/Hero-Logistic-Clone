# Hero Logistics — Accounts Portal Product Requirements Document (PRD)

**Document Version:** 1.0  
**Product Area:** Accounts Portal  
**Platform:** Hero Logistics Transport & Fleet Management System  
**Primary Role:** Accounts Manager / Accounts User  
**Prepared Date:** 05 August 2026  
**Document Status:** Ready for Product, Design, Development, QA and UAT  
**Primary Currency:** AUD  
**Primary Timezone:** Australia/Sydney unless overridden by company settings  

---

## 1. Document Purpose

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

## 2. Product Vision

Provide finance and accounts teams with a secure, auditable and highly accurate financial operations portal that connects billing, payments, payroll, expenses, tax obligations and profitability in one workflow-driven system.

The portal must reduce manual spreadsheet work, prevent duplicate or incorrect transactions, improve cash collection visibility and maintain complete financial auditability.

---

## 3. Product Goals

### 3.1 Primary Goals

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

### 3.2 Success Metrics

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

## 4. User Roles

### 4.1 Accounts Manager

Primary portal user with access to invoice review, payment allocation, payroll, expenses, tax and reports, subject to role permissions.

### 4.2 Accounts Officer

Operational finance user who may:

- create or edit draft invoices;
- record payments;
- process expenses;
- prepare payroll;
- run reports.

Approval rights may be restricted.

### 4.3 Payroll Officer

Focused role for:

- timesheet review;
- pay-run preparation;
- employee pay;
- contractor pay;
- PAYG and superannuation summaries.

### 4.4 Finance Manager

Senior role with approval rights for:

- invoices;
- payment refunds;
- pay runs;
- contractor claims;
- tax lodgement;
- financial reports.

### 4.5 Company Admin

May configure:

- users;
- roles;
- accounting integrations;
- tax settings;
- invoice settings;
- company details;
- payment accounts.

### 4.6 Auditor / Read-Only

Read-only access to authorised financial records, reports and audit history.

---

## 5. Role and Permission Model

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

## 6. Portal Navigation

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

# 7. Functional Requirements

## 7.1 Accounts Dashboard

### 7.1.1 Purpose

Provide a real-time summary of receivables, payroll, expenses, cash flow and profitability.

### 7.1.2 Dashboard Date Control

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

### 7.1.3 KPI Cards

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

### 7.1.4 Dashboard Sections

- Invoice Status Overview
- Invoices & Payments Trend
- Overdue Invoices
- Upcoming Payroll
- Expenses Summary
- Cash Flow Overview
- Profit & Loss Summary
- Recent Activity

### 7.1.5 Dashboard Requirements

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

### 7.1.6 Acceptance Criteria

- User can view invoice, payroll, expense and margin summary.
- Date range changes update dashboard values.
- Overdue invoice card opens the overdue invoices list.
- Figures match underlying records.
- Unauthorised financial data is hidden.

---

## 7.2 Invoice Review

### 7.2.1 Purpose

Review, verify and approve invoices before sending to customers.

### 7.2.2 Invoice Statuses

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

### 7.2.3 Summary Cards

- Draft Invoices
- In Review
- Ready to Send
- On Hold
- Rejected
- Total In Review

### 7.2.4 Filters

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

### 7.2.5 Invoice Table

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

### 7.2.6 Invoice Types

- Freight
- Accessorial
- Fuel Surcharge
- Storage
- Waiting Time
- Damage / Repair
- Other configured types

### 7.2.7 Invoice Detail

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

### 7.2.8 Invoice Items

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

### 7.2.9 Invoice Actions

- Approve & Send
- Save & Mark Ready
- Hold Invoice
- Reject Invoice
- Edit Draft
- Duplicate
- Export PDF
- Download Attachments
- Add Note

### 7.2.10 Invoice Validation

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

### 7.2.11 Approval Rules

1. Draft may be edited.
2. In Review requires reviewer action.
3. Ready to Send may be sent by authorised users.
4. On Hold requires reason.
5. Reject requires reason.
6. Sent invoices cannot be freely edited.
7. Correction after send must use credit note, void or controlled amendment.
8. Approval and sending must be audited.

### 7.2.12 Requirements

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

## 7.3 Sent Invoices

### 7.3.1 Purpose

Manage all invoices sent to customers and monitor collection status.

### 7.3.2 Summary Metrics

- Sent Invoices
- Paid Invoices
- Part Paid
- Overdue
- Average Days to Pay
- Collection Rate
- Total Including GST

### 7.3.3 Filters

- invoice number;
- customer;
- reference;
- invoice type;
- status;
- date range;
- aging bucket;
- branch;
- amount range.

### 7.3.4 Table Columns

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

### 7.3.5 Aging Buckets

- Current
- 0–30 Days
- 31–60 Days
- 61–90 Days
- 90+ Days

### 7.3.6 Actions

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

### 7.3.7 Collection Rules

- invoice becomes overdue after due date if outstanding amount > 0;
- part-paid invoices remain open;
- full payment marks invoice paid;
- overpayment must not reduce invoice below zero;
- credit note allocation must be recorded;
- reminders follow configured schedule;
- customer communication must be logged.

### 7.3.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-SENT-001 | Sent invoices must show payment and aging status. | Must |
| ACC-SENT-002 | Outstanding amount must update after allocation. | Must |
| ACC-SENT-003 | Reminder history must be stored. | Should |
| ACC-SENT-004 | Statements must use authorised invoice data only. | Must |
| ACC-SENT-005 | Aging summary must reconcile with invoice list. | Must |
| ACC-SENT-006 | Overdue days must calculate from due date. | Must |

---

## 7.4 Payments

### 7.4.1 Purpose

Track incoming customer payments, allocate funds and manage refunds.

### 7.4.2 Payment Statuses

- Allocated
- Partially Allocated
- Unallocated
- Overpayment
- Refunded
- Partially Refunded
- Reversed
- Failed

### 7.4.3 Summary Metrics

- Payments Received
- Unallocated Payments
- Overpayments
- Refunds
- Average Days to Pay
- Collection Rate

### 7.4.4 Filters

- payment reference;
- customer;
- invoice number;
- payment method;
- status;
- date range;
- amount;
- bank account;
- branch.

### 7.4.5 Table Columns

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

### 7.4.6 Payment Methods

- Bank Transfer
- EFT
- Credit Card
- Cash
- Cheque
- Direct Debit
- Other configured method

### 7.4.7 Payment Details

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

### 7.4.8 Payment Allocation

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

### 7.4.9 Refund Workflow

1. User selects refundable payment or credit.
2. System calculates available refundable amount.
3. User enters amount and reason.
4. User selects payment method/account.
5. Approval is required where configured.
6. Refund is processed or recorded.
7. Payment and invoice balances are updated.
8. Audit log is created.
9. Customer notification may be sent.

### 7.4.10 Refund Rules

- cannot refund more than available amount;
- refund requires reason;
- processed refunds cannot be deleted;
- failed refunds must retain gateway or bank response;
- manual refund status requires proof or reference;
- high-value refunds may require dual approval.

### 7.4.11 Reconciliation

Support:

- payment-to-invoice reconciliation;
- bank statement import;
- manual reconciliation;
- reconciliation status;
- unmatched transaction queue;
- duplicate bank transaction detection;
- reconciliation report.

### 7.4.12 Requirements

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

## 7.5 Payroll

### 7.5.1 Purpose

Manage payroll periods, timesheets, deductions, approvals and payments.

### 7.5.2 Payroll Statuses

- Draft
- Pending Approval
- Approved
- Processing
- Paid
- Failed
- Cancelled

### 7.5.3 Summary Metrics

- Upcoming Payroll
- Employees Paid
- Total Payroll
- Taxes & Deductions
- Net Pay
- Payroll YTD

### 7.5.4 Filters

- week ending;
- payroll type;
- pay group;
- employment type;
- status;
- branch;
- created by;
- date range.

### 7.5.5 Payroll Table

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

### 7.5.6 Payroll Components

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

### 7.5.7 Payroll Workflow

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

### 7.5.8 Payroll Validation

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

### 7.5.9 Payroll Requirements

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

## 7.6 Contractor Pay

### 7.6.1 Purpose

Review contractor claims, approve payments and track disbursements.

### 7.6.2 Statuses

- Draft
- Pending Approval
- Approved
- Scheduled
- Paid
- Overdue
- Rejected
- Cancelled

### 7.6.3 Summary Metrics

- Total Payable
- Approved
- Pending Approval
- Paid
- Overdue Payments
- Period Growth

### 7.6.4 Table Columns

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

### 7.6.5 Claim Details

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

### 7.6.6 Claim Validation

- contractor must be active;
- ABN and payment details required;
- duplicate claim check;
- linked load must exist where required;
- line-item total must reconcile;
- GST rules must be applied;
- supporting document must exist where configured;
- bank details must be protected;
- approved claim cannot be edited without controlled reversal.

### 7.6.7 Actions

- Approve Claim
- Edit Claim
- Reject Claim
- Schedule Payment
- Mark Paid
- Export
- Bulk Actions

### 7.6.8 Requirements

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

## 7.7 Employee Pay

### 7.7.1 Purpose

Manage employee pay runs, timesheets, deductions and employee payments.

### 7.7.2 Summary Metrics

- Total Net Pay
- Upcoming Pay Run
- Employees Paid
- Taxes & Deductions
- Superannuation
- Payroll YTD

### 7.7.3 Pay Run Table

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

### 7.7.4 Pay Run Detail

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

### 7.7.5 Actions

- Create Pay Run
- Import Timesheets
- Approve Pay Run
- Edit Pay Run
- Delete Draft
- Export
- Bulk Actions

### 7.7.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-EMP-001 | Pay runs must be uniquely numbered. | Must |
| ACC-EMP-002 | Draft pay runs may be edited or deleted. | Must |
| ACC-EMP-003 | Approved pay runs require controlled reversal to change. | Must |
| ACC-EMP-004 | Employee-level calculations must be available. | Must |
| ACC-EMP-005 | Timesheet imports must provide row-level validation. | Must |
| ACC-EMP-006 | Pay-run totals must reconcile to employee totals. | Must |

---

## 7.8 Expenses

### 7.8.1 Purpose

Track, review, approve and reimburse expenses.

### 7.8.2 Statuses

- Draft
- Pending Approval
- Approved
- Rejected
- Reimbursed
- Overdue
- Cancelled

### 7.8.3 Payment Status

- Unpaid
- Scheduled
- Paid
- Reimbursed
- Failed

### 7.8.4 Summary Metrics

- Total Expenses
- Pending Approval
- Approved
- Reimbursed
- Overdue
- Period Comparison

### 7.8.5 Expense Table

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

### 7.8.6 Expense Categories

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

### 7.8.7 Receipt Capture

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

### 7.8.8 Expense Workflow

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

### 7.8.9 Expense Rules

- receipt mandatory above configured threshold;
- duplicate receipt detection;
- GST must be validated;
- claimant must be active;
- rejected expense requires reason;
- approval limits by role;
- self-approval may be blocked;
- paid expense cannot be deleted.

### 7.8.10 Requirements

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

## 7.9 GST / PAYG

### 7.9.1 Purpose

Track GST liabilities, credits, PAYG withholding and lodgement obligations.

### 7.9.2 Summary Metrics

- GST Collected
- GST Credits
- Net GST Payable
- PAYG Withholding
- Outstanding Liabilities
- YTD Net GST Payable

### 7.9.3 Tabs

- GST Obligations
- PAYG Withholding
- Activity History

### 7.9.4 Filters

- financial year;
- from date;
- to date;
- status;
- branch;
- entity.

### 7.9.5 GST Obligation Table

- BAS period;
- period end;
- due date;
- GST collected;
- GST credits;
- net GST;
- status;
- lodgement date;
- action.

### 7.9.6 Statuses

- Draft
- Preparing
- Ready
- Due Soon
- Lodged
- Paid
- Overdue
- Amended

### 7.9.7 Actions

- Prepare BAS
- Lodge with ATO
- Record GST Payment
- PAYG Payment
- View
- Export

### 7.9.8 Tax Rules

- calculations must be based on posted transactions only;
- GST codes must be configurable;
- locked periods cannot be edited without authorised adjustment;
- lodgement requires approval;
- ATO submission response must be stored;
- amendment must preserve original submission;
- tax payment reference must be retained.

### 7.9.9 Requirements

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

## 7.10 Profit & Loss

### 7.10.1 Purpose

Display business income, cost of sales, operating expenses and profitability.

### 7.10.2 Summary Metrics

- Net Profit
- Total Revenue
- Total Expenses
- Gross Profit
- Gross Profit Margin

### 7.10.3 Views

- P&L Statement
- Monthly Trend
- Comparison
- YTD Overview

### 7.10.4 Controls

- financial year;
- period;
- comparison period;
- show percentage;
- branch;
- company;
- export.

### 7.10.5 P&L Structure

#### Revenue

- Freight Income
- Surcharges & Fuel Recovery
- Storage Income
- Accessorial Income
- Other Income
- Total Revenue

#### Cost of Sales

- Driver Costs
- Fuel Costs
- Contractor Costs
- Vehicle Costs
- Tolls & Road Charges
- Other Direct Costs
- Total Cost of Sales

#### Gross Profit

- Gross Profit
- Gross Profit Margin

#### Operating Expenses

- Administration
- Marketing
- Depreciation
- Insurance
- Office
- Other Expenses
- Total Operating Expenses

#### Net Profit

- Net Profit
- Net Profit Margin

### 7.10.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PNL-001 | P&L must derive from posted financial transactions. | Must |
| ACC-PNL-002 | Current and comparison periods must be supported. | Must |
| ACC-PNL-003 | Users can drill down to source transactions. | Should |
| ACC-PNL-004 | Branch and consolidated views must be supported. | Should |
| ACC-PNL-005 | Export must match displayed values. | Must |
| ACC-PNL-006 | Closed-period values must remain stable. | Must |

---

## 7.11 Vehicle Costs

### 7.11.1 Purpose

Track operating costs for trucks, trailers and other assets.

### 7.11.2 Summary Metrics

- Total Vehicle Costs
- Fuel Costs
- Maintenance & Repairs
- Tyres
- Insurance
- Other Costs

### 7.11.3 Tabs

- Vehicle Summary
- Transactions
- Upcoming Costs
- Service History

### 7.11.4 Filters

- vehicle;
- registration;
- vehicle type;
- date;
- branch;
- category;
- cost range.

### 7.11.5 Vehicle Summary Columns

- vehicle;
- type;
- registration/ID;
- total cost excluding GST;
- total cost including GST;
- cost per kilometre;
- cost per day;
- comparison percentage;
- action.

### 7.11.6 Cost Categories

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

### 7.11.7 Vehicle Cost Rules

- cost transaction may link to vehicle, trailer or asset;
- odometer may be required;
- duplicate supplier invoice must be detected;
- scheduled cost may become actual transaction;
- cost per km requires valid distance;
- cost allocations must be auditable;
- expenses and supplier bills may feed this module.

### 7.11.8 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-VEH-001 | Vehicle costs must aggregate by asset and category. | Must |
| ACC-VEH-002 | Cost per km and cost per day must be calculated. | Should |
| ACC-VEH-003 | Upcoming costs must support due-date alerts. | Should |
| ACC-VEH-004 | Source transaction drill-down must be available. | Must |
| ACC-VEH-005 | Vehicle cost totals must reconcile to P&L accounts. | Must |
| ACC-VEH-006 | Trailer costs must be separately supported. | Must |

---

## 7.12 Reports

### 7.12.1 Purpose

Provide financial, payroll, compliance, vehicle and custom reports.

### 7.12.2 Summary Metrics

- Reports Generated
- Scheduled Reports
- Last Report Run
- Exports
- Data Updated

### 7.12.3 Categories

- Financial
- Compliance
- Operations
- Payroll
- Vehicle & Assets
- Custom

### 7.12.4 Standard Reports

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

### 7.12.5 Report Functions

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

### 7.12.6 Scheduled Reports

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

### 7.12.7 Requirements

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

## 7.13 Profile

### 7.13.1 Tabs

- Personal Information
- Security
- Preferences
- Notifications

### 7.13.2 Personal Information

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

### 7.13.3 Company Information

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

### 7.13.4 Account Summary

- role;
- user ID;
- department;
- joined date;
- last login.

### 7.13.5 Security

- change password;
- 2FA;
- active sessions;
- login history;
- revoke session;
- logout all devices.

### 7.13.6 Requirements

| ID | Requirement | Priority |
|---|---|---|
| ACC-PRO-001 | User can edit permitted personal details. | Must |
| ACC-PRO-002 | Email and phone changes require verification. | Must |
| ACC-PRO-003 | User can manage password and 2FA. | Must |
| ACC-PRO-004 | User can view active sessions. | Must |
| ACC-PRO-005 | Company financial identity is read-only by default. | Must |
| ACC-PRO-006 | Profile changes must be audited. | Must |

---

# 8. End-to-End Workflows

## 8.1 Invoice-to-Cash

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

## 8.2 Payment Reconciliation

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

## 8.3 Payroll Processing

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

## 8.4 Contractor Claim

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

## 8.5 Expense Reimbursement

1. Employee submits expense.
2. Receipt uploaded.
3. Expense reviewed.
4. Approver approves or rejects.
5. Approved expense enters reimbursement queue.
6. Payment processed.
7. Expense marked Reimbursed.
8. Transaction flows to P&L and GST reports.

---

## 8.6 BAS / PAYG Preparation

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

# 9. Financial Business Rules

## 9.1 Invoice Rules

1. Invoice number must be unique.
2. Invoice total must equal line items plus tax.
3. Sent invoices cannot be directly overwritten.
4. Credit notes must reference original invoice.
5. Rejected and held invoices require reason.
6. Duplicate load billing must be detected.
7. Currency must remain consistent per invoice.

## 9.2 Payment Rules

1. Allocation cannot exceed received amount.
2. Allocation cannot exceed invoice outstanding amount.
3. Overpayment becomes customer credit.
4. Refund cannot exceed available balance.
5. Reconciled payments require elevated permission to modify.
6. Payment reversal must preserve original transaction.

## 9.3 Payroll Rules

1. Approved timesheets only.
2. Employee must be active for pay period.
3. Pay rates must be effective for the period.
4. Approved payroll cannot be edited without reversal.
5. Paid payroll is locked.
6. Bank data must be encrypted.
7. Employee net pay cannot be negative unless policy allows.

## 9.4 Tax Rules

1. Posted transactions only.
2. GST tax code required.
3. PAYG reconciles to payroll.
4. Lodged period is locked.
5. Amendment creates new version.
6. Tax submission and payment references are mandatory.

## 9.5 Closed Financial Periods

- Transactions in closed periods cannot be edited.
- Adjustments must use authorised journal or correction workflow.
- Closed-period reports remain stable.
- Reopening requires high-level permission and audit reason.

---

# 10. Notifications and Alerts

## 10.1 Accounts Alerts

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

## 10.2 Channels

- in-app;
- email;
- SMS where configured;
- push notification.

## 10.3 Escalation

Configurable escalation for:

- overdue invoice days;
- unallocated payment age;
- payroll deadline;
- tax due date;
- high-value refund;
- high-value expense;
- failed bank or gateway transaction.

---

# 11. Audit Logging

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

# 12. Suggested Data Model

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

# 13. API Requirements

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

# 14. Integrations

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

# 15. Security Requirements

## 15.1 Authentication

- secure password policy;
- 2FA;
- session timeout;
- refresh token rotation where used;
- brute-force protection;
- login audit;
- device/session controls.

## 15.2 Financial Data Protection

- TLS in transit;
- encryption at rest;
- field-level encryption for bank and tax data;
- masked account numbers;
- restricted exports;
- signed document URLs;
- secure backups;
- retention policy;
- no plaintext secrets.

## 15.3 Authorisation

- server-side RBAC;
- company isolation;
- branch scope;
- object-level permissions;
- approval limits;
- maker-checker separation;
- export permissions;
- refund permissions;
- tax permissions.

## 15.4 Application Security

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

# 16. Non-Functional Requirements

## 16.1 Performance

- dashboard under 3 seconds;
- list filtering under 2 seconds;
- invoice detail under 2 seconds;
- payment allocation under 2 seconds;
- P&L report under 5 seconds for standard period;
- large exports processed asynchronously.

## 16.2 Availability

- 99.9% monthly target;
- backup and restore;
- monitoring;
- integration health;
- graceful degradation.

## 16.3 Scalability

Support:

- multiple companies;
- multiple branches;
- large invoice volumes;
- high payroll volumes;
- multi-year history;
- large report exports;
- concurrent accounts users.

## 16.4 Accessibility

- keyboard navigation;
- semantic labels;
- accessible validation;
- colour contrast;
- focus states;
- screen-reader support;
- status not colour-only.

## 16.5 Responsiveness

- desktop;
- tablet;
- limited mobile monitoring;
- horizontally scrollable financial tables on smaller screens;
- no data clipping;
- sticky headers where useful.

---

# 17. UX Requirements

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

# 18. Error Handling

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

# 19. Reporting Definitions

## 19.1 Collection Rate

`Total amount collected / Total amount due during the selected period × 100`

## 19.2 Average Days to Pay

Average difference between invoice date and final payment date for fully paid invoices.

## 19.3 Gross Margin

`Gross Profit / Total Revenue × 100`

## 19.4 Net Profit Margin

`Net Profit / Total Revenue × 100`

## 19.5 Outstanding Amount

`Invoice Total - Allocated Payments - Applied Credits`

## 19.6 Cost per Kilometre

`Total Vehicle Cost / Distance Travelled`

---

# 20. Release Plan

## Phase 1 — Core Accounts

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

## Phase 2 — Payroll and Payables

- payroll;
- employee pay;
- contractor pay;
- timesheet import;
- payslips;
- payment files;
- approval workflows.

## Phase 3 — Compliance and Financial Reporting

- GST/PAYG;
- BAS preparation;
- P&L;
- vehicle costs;
- scheduled reports;
- reconciliation.

## Phase 4 — Advanced Automation

- bank feeds;
- automated matching;
- reminder automation;
- OCR receipt capture;
- anomaly detection;
- cash-flow forecasting;
- advanced custom reports.

---

# 21. Out of Scope for Initial Release

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

# 22. QA Test Areas

## 22.1 Functional

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

## 22.2 Negative Testing

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

## 22.3 Permission Testing

- direct URL access;
- direct API access;
- company isolation;
- branch restriction;
- hidden button bypass;
- export restriction;
- refund restriction;
- payroll restriction;
- tax lodgement restriction.

## 22.4 Security Testing

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

## 22.5 Performance Testing

- large invoice dataset;
- large payment import;
- payroll for many employees;
- large expense upload;
- multi-year P&L;
- large report export;
- concurrent approvals.

---

# 23. UAT Scenarios

## UAT-01 — Invoice Approval

**Given** a valid invoice is In Review  
**When** an authorised user approves and sends it  
**Then** the invoice becomes Sent, PDF is generated and history is recorded.

## UAT-02 — Duplicate Invoice

**Given** an invoice already exists for the same unique reference  
**When** another invoice is created  
**Then** the system warns or blocks according to policy.

## UAT-03 — Partial Payment

**Given** an open invoice  
**When** a partial payment is allocated  
**Then** status becomes Part Paid and outstanding balance updates.

## UAT-04 — Overpayment

**Given** payment exceeds invoice outstanding amount  
**When** allocation is completed  
**Then** excess becomes customer credit.

## UAT-05 — Refund Control

**Given** a refundable payment exists  
**When** a user requests more than available  
**Then** refund is blocked.

## UAT-06 — Payroll Approval

**Given** payroll is Draft  
**When** it is submitted and approved  
**Then** status becomes Approved and calculation history is retained.

## UAT-07 — Closed Period

**Given** a financial period is closed  
**When** a user attempts to edit a transaction  
**Then** the action is blocked.

## UAT-08 — Expense Approval

**Given** a pending expense with receipt  
**When** an authorised reviewer approves it  
**Then** it moves to reimbursement queue.

## UAT-09 — BAS Lodgement

**Given** tax period is prepared and approved  
**When** authorised user lodges it  
**Then** lodgement response is stored and period locks.

## UAT-10 — Report Export

**Given** filters are applied  
**When** report is exported  
**Then** exported totals match the filtered screen.

---

# 24. Definition of Done

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

# 25. Open Product Decisions

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

# 26. Risks and Mitigations

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

# 27. Appendix A — Default Permission Matrix

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

# 28. Appendix B — Example Audit Event

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

# 29. Sign-Off

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

**End of Document**
