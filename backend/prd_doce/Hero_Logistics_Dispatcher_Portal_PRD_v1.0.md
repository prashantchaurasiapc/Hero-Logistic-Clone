Hero Logistics — Dispatcher Portal Product Requirements Document (PRD)

Document Version: 1.0Product Area: Dispatcher PortalPlatform: Hero Logistics Transport & Fleet Management SystemPrimary Role: DispatcherPrepared Date: 05 August 2026Document Status: Ready for Product, Design, Development, QA and UATTimezone Reference: AEST / Australia-Sydney unless configured otherwise

1. Document Purpose

This PRD defines the complete functional and non-functional requirements for the Hero Logistics Dispatcher Portal.

The portal is the operational workspace used by dispatchers to:

create, schedule, assign and activate loads;

monitor active deliveries;

plan driver, truck and trailer allocation;

track drivers and vehicles through live GPS;

manage load stops, transported items and proof photos;

review driver, vehicle and compliance availability;

coordinate yard, warehouse and workforce resources;

communicate with drivers and internal teams;

access operational reports;

manage their profile and security settings.

The UI values, names, counts, routes, dates and IDs shown in the supplied screens are sample data. The production system must use live tenant and branch data.

2. Product Vision

Provide dispatchers with a single real-time command centre that reduces manual coordination, improves resource utilisation, prevents unsafe assignments and maintains traceability from load creation to delivery completion.

3. Goals and Success Metrics

3.1 Goals

Enable fast creation and activation of valid loads.

Give dispatchers clear visibility of active, planned and delayed operations.

Prevent assignments involving unavailable or non-compliant resources.

Provide real-time driver, truck, trailer and route tracking.

Centralise dispatcher-driver communication.

Support branch-level workforce and load planning.

Maintain complete operational and audit history.

Improve on-time delivery and reduce avoidable delays.

3.2 Success Metrics

Metric

Target

Average time to create a standard load

Under 3 minutes

Average assignment time

Under 60 seconds

Invalid hard-rule assignments prevented

100%

Critical delay alert delivery

Under 60 seconds after detection

Dispatcher portal availability

99.9% monthly

Load activation with missing mandatory data

0

Unauthorised cross-branch access

0

Audit coverage for load-changing actions

100%

Standard filtered list response

Under 2 seconds

4. Users and Access Scope

4.1 Primary User — Dispatcher

The dispatcher coordinates daily transport operations for one or more authorised branches.

Main responsibilities:

create and schedule loads;

assign drivers, trucks and trailers;

monitor active loads and exceptions;

coordinate pickup and delivery windows;

communicate with drivers;

monitor GPS and delays;

allocate available workforce;

review operational reports;

verify operational compliance before assignment.

4.2 Supporting Roles

Company Admin

Operations Manager

Driver

Warehouse Manager

Yard Staff

Compliance Officer

Maintenance Team

Customer Contact

4.3 Default Dispatcher Scope

The Dispatcher role is branch-scoped by default. A dispatcher may access only records linked to authorised branches unless multi-branch access is explicitly granted.

4.4 Restricted Areas

A dispatcher must not automatically access:

tenant or company management;

role and permission administration;

subscription and billing settings;

company-wide finance;

payroll processing;

pricing administration;

security settings for other users;

destructive company-level settings.

Sensitive payroll, financial and commercial data must require explicit permission.

4.5 Suggested Permission Keys

dispatch.dashboard.view

dispatch.load.create

dispatch.load.edit

dispatch.load.activate

dispatch.load.cancel

dispatch.load.assign

dispatch.load.transfer

dispatch.load.export

dispatch.planning.view

dispatch.planning.optimise

dispatch.gps.view

dispatch.gps.send_location

dispatch.driver.view

dispatch.driver.create

dispatch.driver.edit

dispatch.vehicle.view

dispatch.customer.view

dispatch.customer.create

dispatch.warehouse.view

dispatch.workforce.view

dispatch.workforce.assign_shift

dispatch.message.send

dispatch.report.view

dispatch.report.export

dispatch.profile.edit

All backend endpoints must enforce permissions independently of frontend visibility.

5. Portal Navigation

Dispatch Dashboard

Create Load

Active Loads

Planning Board

Live GPS Map

Drivers

Vehicles / Trailers

Customers

Yard / Warehouse

Workforce Availability

Messages

Reports & Analytics

Profile

5.1 Shared Header

company logo;

portal name;

user identity and role;

notifications;

unread messages;

global quick search;

Ctrl + K / Cmd + K shortcut;

branch selector where authorised;

timezone-aware date and time;

account menu and logout.

5.2 Global Search

Search must support authorised results for:

load ID or reference;

customer;

driver;

vehicle or trailer;

registration number;

VIN;

route or destination;

conversation;

document.

Search must never expose data outside tenant or branch scope.

6. Functional Requirements

6.1 Dispatch Dashboard

Purpose

Provide a real-time operational overview and quick access to critical dispatch actions.

KPI Cards

Total Loads

Active Loads

Planned Loads

Completed Today

Delayed Loads

Available Drivers

Available Trucks

Available Trailers

Each KPI should support count, comparison, trend, click-through and last refresh time.

Filters

Branch

Status

Driver

Customer

Destination

Required Date

Load Type

Vehicle / Trailer

Available Workers

Reset Filters

Dashboard Load List

Each card or row must show:

load ID;

status;

date;

customer;

origin and destination;

assigned driver;

truck or trailer;

delay state;

action to open details.

Embedded Planning Board

The dashboard board must show branch/depot columns, load cards, customer, route, date, driver, stop count, item count and an Add Load action.

Embedded GPS and Driver Status

The dashboard must show active driver markers and driver cards with:

driver name;

duty status;

vehicle;

load ID;

current location;

latest telemetry;

last GPS update.

Requirements

ID

Requirement

Priority

DSP-DASH-001

Show branch-scoped operational KPIs.

Must

DSP-DASH-002

Filters update all compatible widgets.

Must

DSP-DASH-003

KPI click opens the related filtered list.

Should

DSP-DASH-004

Delayed and pending-dispatch loads are highlighted.

Must

DSP-DASH-005

Resource availability is displayed.

Must

DSP-DASH-006

Last refresh time is visible.

Must

DSP-DASH-007

Auto-refresh interval is configurable.

Should

DSP-DASH-008

Dashboard is responsive on desktop and tablet.

Must

Acceptance Criteria

Dispatcher sees live counts for active, planned, completed and delayed loads.

Branch and status filters update the page.

Delayed loads are visually distinguishable.

Clicking a load opens load details.

Data outside authorised branches is not visible.

6.2 Quick Create Load

Fields

Customer

Status

Pickup Location

Delivery Location

Assigned Driver

Vehicle / Trailer

Required Date

Required Time

Actions

Open Full Console

Cancel

Create Load

Business Rules

Customer, pickup, delivery, required date and time are mandatory.

Selected driver and assets must be available and compatible.

Driver must hold required licence and certifications.

Conflicts must block creation or require an authorised override.

Open Full Console must carry forward entered values.

Duplicate submissions must be prevented.

ID

Requirement

Priority

DSP-QLOAD-001

Support fast standard load creation.

Must

DSP-QLOAD-002

Validate selected resources before save.

Must

DSP-QLOAD-003

Preserve values when opening full console.

Must

DSP-QLOAD-004

Show field-specific validation errors.

Must

DSP-QLOAD-005

Prevent duplicate submission.

Must

6.3 Full Create Load Console

Operational Principle

Load → Stops → Items

A load contains an ordered route. Every transported item must link to one pickup stop and one drop-off stop.

Main Actions

Save Draft

Activate Load

Add Stop

Add Item

Bulk Import

Cancel / Exit

Section 1 — Load Information

Fields:

Booking Customer

Load Type / Service

Load Reference

Priority

Load Date

Branch

Booking Channel

Customer Purchase Order

Special Handling Flag

Dangerous Goods Flag

Temperature-Controlled Flag

Initial load types:

Car Carrying

General Freight

Dangerous Goods

Warehousing Transfer

Other configured types

The form must change dynamically by load type.

Section 2 — Route Stops

Each stop supports:

sequence;

type;

address;

suburb;

state;

postcode;

country;

latitude and longitude;

contact name and phone;

scheduled date;

time window;

instructions;

notes;

geofence radius;

status.

Stop types:

Pickup

Drop-off

Depot

Warehouse

Rest / Checkpoint

Other

Functions:

add;

edit;

delete;

drag to reorder;

duplicate;

geocode;

route validation;

distance and ETA calculation.

Route Rules

Activation requires at least one pickup and one drop-off.

Pickup must occur before the linked drop-off.

A stop cannot be deleted while linked items remain assigned to it.

Reordering recalculates route and ETA.

Invalid addresses create a warning or block based on configuration.

Section 3 — Items

Common fields:

item number;

customer / owner;

pickup stop;

drop-off stop;

reference;

description;

quantity;

dimensions;

weight;

handling instructions;

notes.

Car-carrying fields:

registration number;

VIN / chassis number;

stock number;

make;

model;

year;

colour;

length;

width;

height;

weight;

vehicle type;

keys available;

damage report required;

operable / non-operable;

special loading requirement.

Vehicle Lookup

When registration or VIN lookup is configured:

returned data may auto-fill;

values remain editable;

the lookup response is logged;

the user verifies data before activation;

a failed lookup does not remove manually entered data.

Proof Photos

Photo stages:

Pickup Photos — before loading

Loading Photos — Chain of Responsibility

Delivery Photos — after unloading

Rules:

photo requirements are configurable by load type;

timestamp, uploader and GPS metadata are stored;

unsupported or oversized files are rejected;

delivery completion can be blocked when mandatory proof is missing.

Section 4 — Assign Truck and Driver

Fields:

Truck

Trailer

Primary Driver

Secondary Driver / Team

Driver Instructions

Dispatch Notes

Required Certifications

Required Vehicle Capabilities

Assignment Validation

Validate:

driver status and availability;

shift and leave;

licence class;

driver compliance;

fatigue and hours-of-service limits;

existing assignment conflicts;

truck status and compliance;

truck maintenance;

trailer status and compliance;

truck-trailer compatibility;

trailer capacity;

item capacity;

branch access;

route restrictions.

Draft vs Activation

Save Draft permits incomplete non-critical fields and does not notify the driver.

Activate Load must:

enforce all mandatory data;

validate resources;

reserve assignments;

create dispatch event;

notify driver;

add status history;

create audit log;

trigger required pre-trip checklist.

ID

Requirement

Priority

DSP-LOAD-001

Create and save load as draft.

Must

DSP-LOAD-002

Activate a valid load.

Must

DSP-LOAD-003

Reorder stops by drag and drop.

Must

DSP-LOAD-004

Link every item to pickup and drop-off stops.

Must

DSP-LOAD-005

Validate all assigned resources.

Must

DSP-LOAD-006

Configure photo requirements by load type.

Must

DSP-LOAD-007

Block configured milestones when proof is missing.

Must

DSP-LOAD-008

Handle duplicate references.

Must

DSP-LOAD-009

Support dynamic fields by load type.

Should

DSP-LOAD-010

Show driver instructions in driver application.

Must

DSP-LOAD-011

Audit every create, edit and activation.

Must

DSP-LOAD-012

Bulk import returns row-level validation.

Should

Activation Acceptance Criteria

A load can activate only when:

reference and type are valid;

route is valid;

items are correctly mapped;

customer and schedule are complete;

selected resources pass hard checks;

mandatory compliance is valid;

overrides have permission and reason;

duplicate booking policy is satisfied.

6.4 All Loads

Status Tabs

All Loads

Draft

Planned

Active

Completed

Cancelled

Filters

search;

date from / to;

status;

type;

customer;

driver;

vehicle;

location;

branch;

more filters.

Table Columns

selection;

load reference;

primary and operational status;

type;

customer;

route and stops;

driver;

truck;

pickup date;

ETA / delivery;

progress;

actions.

Functions

import;

export;

AI Loads / Inbox;

new load;

columns;

group by;

sort;

pagination;

page size;

saved filters;

bulk actions.

Bulk Actions

assign driver;

assign truck or trailer;

mark completed;

place on hold;

cancel;

transfer branch;

export selected;

notify driver.

Every bulk action must return success count, failure count and row-level reasons.

ID

Requirement

Priority

DSP-LIST-001

Support combined filters.

Must

DSP-LIST-002

Allow per-user column configuration.

Should

DSP-LIST-003

Search by load ID, customer, driver, rego and VIN.

Must

DSP-LIST-004

Validate each selected row in bulk actions.

Must

DSP-LIST-005

Exports respect filters and permissions.

Must

DSP-LIST-006

Support configurable pagination.

Must

DSP-LIST-007

Keep all results branch scoped.

Must

6.5 Active Loads

Operational Categories

In Transit

En Route to Pickup

At Pickup

At Delivery

On Hold

Table

Load ID

Status

Driver / Team

Route

Customer

Vehicle / Trailer

Required Date

Progress

Actions

Load Details

Header:

load ID;

current status;

customer;

required date;

origin and destination.

Tabs:

Overview

Stops

Items / Cars

Documents

Notes

Panels:

assigned driver;

assigned truck and trailer;

compliance state;

progress timeline;

route tracking;

latest GPS;

quick actions.

Quick Actions

Message Driver

Call Driver

View Instructions

Swap Trailer

Transfer Load

Add Note

View Live Map

Open Route

View GPS History

Send Location

Refresh GPS

Place on Hold

Resume Load

Raise Delivery Issue

Suggested Milestones

Accepted

En Route

At Pickup

Loaded

In Transit

At Delivery

Delivered

Completed

ID

Requirement

Priority

DSP-ACT-001

Show only operationally active loads.

Must

DSP-ACT-002

Show milestone progress.

Must

DSP-ACT-003

Provide GPS, route and communication actions.

Must

DSP-ACT-004

Validate trailer swap.

Must

DSP-ACT-005

Preserve history during load transfer.

Must

DSP-ACT-006

Store actor, time and location for status changes.

Must

6.6 Planning Board

Controls

Branch

Date

Day / Week View

Vehicle Type

Driver

Vehicle / Trailer

Status

Optimise Board

Create Load

Drivers & Assets / List View

Components

unassigned load pool;

resource rows;

timeline;

load cards;

available blocks;

shifts;

capacity;

conflict indicators.

Drag-and-Drop Actions

unassigned load to driver;

load between drivers;

load to another time;

load to another vehicle or trailer;

load back to unassigned.

Before save, validate:

time overlap;

route feasibility;

shift and leave;

compliance;

asset status;

capacity;

fatigue;

branch access.

Optimise Board

Optimisation should consider:

time windows;

driver availability;

shifts;

licence and certification;

vehicle capability;

current location;

load priority;

capacity;

maintenance and compliance;

fatigue limits;

empty kilometres;

depot constraints.

Optimisation produces suggestions only until confirmed.

ID

Requirement

Priority

DSP-PLAN-001

Display assigned and unassigned loads.

Must

DSP-PLAN-002

Allow drag-and-drop assignment.

Must

DSP-PLAN-003

Block invalid assignments with reasons.

Must

DSP-PLAN-004

Display shifts and availability.

Must

DSP-PLAN-005

Explain optimisation recommendations.

Should

DSP-PLAN-006

Never auto-apply without confirmation.

Must

DSP-PLAN-007

Audit planning changes.

Must

DSP-PLAN-008

Detect concurrent editing conflicts.

Must

Concurrency

The system must prevent silent overwrite when multiple dispatchers edit the same plan. Use optimistic locking or record locking with a clear stale-data message.

6.7 Live GPS Map

Filters

Branch

Driver

Driver Status

Load Status

Search

More Filters

Driver List

Display:

driver;

load ID;

status;

route;

last update;

delay;

offline indicator.

Map Tools

Track Driver

View Live Map

Open Route

View History

Refresh GPS

Traffic Overlay

Geofences

Weather

Full Screen

Map / Satellite

Send Location to Driver

Selected Driver Panel

driver identity;

status;

current load;

customer;

route;

speed;

heading;

last update;

distance remaining;

route stops;

vehicle;

documents;

notes;

latest events.

GPS Freshness

Suggested defaults:

Live: within 2 minutes

Recent: within 5 minutes

Stale: 5–15 minutes

Offline: more than 15 minutes

Thresholds must be configurable.

Route and Geofence Events

departed depot;

arrived at stop;

departed stop;

route deviation;

extended stop;

geofence entry or exit;

speeding;

device offline;

ETA change.

Send Location to Driver

Fields:

target driver;

destination preset;

address;

latitude and longitude;

instructions;

channel;

attach navigation link;

require confirmation.

Channels:

Push + SMS

App Only

WhatsApp where integrated

Broadcast where authorised

Record sender, recipient, coordinates, channel, sent time, delivery state and confirmation.

ID

Requirement

Priority

DSP-GPS-001

Show authorised tracked drivers and assets.

Must

DSP-GPS-002

Always show last update time.

Must

DSP-GPS-003

Clearly identify stale and offline data.

Must

DSP-GPS-004

Store route and geofence events.

Must

DSP-GPS-005

Allow dispatcher to send destination.

Must

DSP-GPS-006

Support required driver confirmation.

Should

DSP-GPS-007

Permission-control GPS history.

Must

DSP-GPS-008

Apply GPS retention policy.

Must

6.8 Drivers

Driver List

Summary cards:

total drivers;

on duty;

off duty;

on leave;

unavailable;

expiring documents.

Filters:

search;

status;

licence type;

compliance;

branch;

more filters.

Columns:

driver;

ID;

phone;

licence;

status;

branch;

assignment;

compliance;

actions.

AI Driver Insights

Optional recommendations:

expiring documents;

suggested drivers;

performance watch.

AI output must never bypass hard compliance rules.

Add Driver

Personal Information

photo;

first and last name;

employee ID;

date of birth;

gender;

nationality;

phone and email;

emergency contact;

residential address.

Employment

role;

employment type;

branch;

manager;

joining date;

status;

shift;

category.

Licence

type;

number;

state;

issue date;

expiry date;

class;

uploaded document.

Compliance Documents

medical certificate;

police verification;

background check;

drug and alcohol certificate;

first aid;

training;

other.

Payroll Information

Only with permission:

pay type and rate;

bank;

account number;

BSB;

tax number;

superannuation fund.

Sensitive data must be encrypted and masked.

Vehicle Preferences

preferred vehicle;

routes;

regions;

maximum trip distance;

dangerous goods certification;

heavy vehicle certification.

Availability

available from;

preferred shift;

weekly hours limit;

maximum daily hours;

rest days;

working days.

Account

username;

secure invitation or password setup;

send credentials option.

Passwords must never be stored or shown in plaintext.

Driver Details

Header and summary:

identity and status;

employee ID;

personal and contact details;

licence;

branch;

employment type;

overall compliance;

completed loads;

on-time delivery;

total distance;

incidents and accidents.

Tabs:

Overview

Documents & Compliance

Assignments & Availability

Performance

Payroll

Activity Timeline

Driver Audit Trail

Categories:

Assignments

Safety

Documents

Payroll

Compliance

Leave

Status Changes

Functions:

search;

date filters;

category filters;

manual note;

export;

print;

view audit details.

Each entry must include title, state, category, exact date and time, description, performer, source and audit ID.

ID

Requirement

Priority

DSP-DRV-001

Show driver status, assignment and compliance.

Must

DSP-DRV-002

Validate required fields and uniqueness on create.

Must

DSP-DRV-003

Block assignment for expired mandatory documents.

Must

DSP-DRV-004

Protect and mask payroll data.

Must

DSP-DRV-005

Keep audit trail immutable to normal users.

Must

DSP-DRV-006

Store author and time for manual notes.

Must

DSP-DRV-007

Use secure account invitation.

Must

DSP-DRV-008

AI suggestions cannot bypass compliance.

Must

6.9 Vehicles and Trailers

Vehicle List

Summary:

total vehicles;

active;

maintenance;

out of service;

compliance due.

Tabs:

All

Active

In Maintenance

Out of Service

Sold / Inactive

Columns:

vehicle and registration;

type, make and model;

year;

status;

current driver;

odometer;

compliance;

next service;

actions.

Vehicle Compliance

registration;

insurance;

roadworthy;

accreditation;

dangerous goods;

maintenance;

custom documents.

States:

Compliant

Expiring Soon

Overdue

Not Uploaded

Under Review

Not Applicable

Trailer Data

trailer ID;

registration;

type;

capacity;

branch;

status;

current truck;

current load;

compliance;

next service;

dimensions;

supported load types.

Assignment Rules

An asset cannot be assigned when:

out of service;

under maintenance;

compliance expired;

already assigned;

incompatible;

capacity insufficient;

branch transfer incomplete;

manually locked.

ID

Requirement

Priority

DSP-VEH-001

Show vehicle and trailer availability.

Must

DSP-VEH-002

Use compliance in assignment eligibility.

Must

DSP-VEH-003

Block maintenance and out-of-service assets.

Must

DSP-VEH-004

Validate truck-trailer compatibility.

Must

DSP-VEH-005

Show odometer and next service.

Should

DSP-VEH-006

Retain assignment history.

Must

6.10 Customers

Customer List

Summary:

total customers;

active;

new this month;

inactive;

top customer where permitted.

Filters:

search;

status;

customer type;

transport module;

account manager;

state;

created date.

Columns:

customer;

type;

contact;

transport modules;

billing terms;

account manager;

status;

actions.

Add Customer

Minimum fields:

company name;

ABN / ACN;

customer type.

Extended data may include contact, billing and operational locations, billing terms, status and enabled transport modules.

Dispatchers may view operational customer data and create a basic customer when permitted. Credit, pricing and financial terms require explicit access.

ID

Requirement

Priority

DSP-CUS-001

Search authorised customers.

Must

DSP-CUS-002

Create basic customer when permitted.

Should

DSP-CUS-003

Check duplicate ABN and company.

Must

DSP-CUS-004

Permission-control restricted commercial fields.

Must

DSP-CUS-005

Customer status affects load creation policy.

Must

6.11 Yard and Warehouse

Dashboard Metrics

total warehouses;

inventory value where permitted;

stock items;

pending pick tasks;

incoming shipments;

outgoing shipments.

Warehouse List

warehouse name;

code;

branch and location;

type;

status;

stock items;

inventory value;

utilisation;

actions.

Alerts

low stock;

stock expiry;

overdue pick tasks;

incoming shipment;

operational exception.

Dispatcher Actions

Depending on permission:

view warehouse;

view stock availability;

create pick request;

link warehouse task to load;

coordinate outgoing shipment;

view incoming load;

initiate transfer request;

message warehouse team.

ID

Requirement

Priority

DSP-WH-001

Show operational warehouse status.

Should

DSP-WH-002

Link warehouse tasks to loads.

Should

DSP-WH-003

Reflect task state in load context.

Should

DSP-WH-004

Hide financial inventory values without permission.

Must

DSP-WH-005

Keep warehouse data branch scoped.

Must

6.12 Workforce Availability

Filters

Branch

View

Workforce Type

Role / Position

Status

Date

More Filters

Summary

Total Workforce

Available Today

On Shift

On Leave

Absent / Unavailable

Views

Schedule View

List View

Unavailability

Leave Calendar

Workforce Groups

Drivers

Warehouse Staff

Yard Crew

Mechanics

Administrators

Configured groups

Schedule States

On Shift

Available

Leave

En Route

Break / Off Duty

Unavailable

Selected Worker Panel

name and status;

role;

employee ID;

mobile;

skills and certifications;

shifts;

notes;

upcoming availability;

quick actions.

Assign Shift

Fields:

date;

shift type;

start and end time;

role;

notes.

Validation:

overlapping shift;

approved leave;

unavailable period;

maximum working hours;

minimum rest;

qualification;

branch;

active load conflict.

Auto Fill Shifts

Auto Fill may suggest qualified available workers but must not apply without confirmation.

ID

Requirement

Priority

DSP-WF-001

Show weekly workforce availability.

Must

DSP-WF-002

Assign a valid shift when permitted.

Must

DSP-WF-003

Block shift conflicts.

Must

DSP-WF-004

Reflect leave and unavailability immediately.

Must

DSP-WF-005

Auto-fill provides suggestions only.

Should

DSP-WF-006

Notify workers of shift changes.

Should

DSP-WF-007

Audit every shift change.

Must

6.13 Messages

Conversation List

Tabs:

All

Unread

Groups

Archived

Each conversation shows participant or group, last message, time, unread count, linked load and operational state.

Chat Functions

send text;

attach file;

attach location;

link load;

reply;

mark read;

mute;

archive;

search;

call or video action where integrated.

New Message

Fields:

recipient;

subject;

priority;

message;

attachment;

location.

Delivery States

Queued

Sent

Delivered

Read

Failed

ID

Requirement

Priority

DSP-MSG-001

Send direct messages.

Must

DSP-MSG-002

Create authorised group conversations.

Should

DSP-MSG-003

Link messages to a load.

Must

DSP-MSG-004

Display delivery and read status where supported.

Should

DSP-MSG-005

Scan and protect attachments.

Must

DSP-MSG-006

Retain message history according to policy.

Must

DSP-MSG-007

Search archived conversations.

Should

6.14 Reports and Analytics

Dashboard Metrics

total reports;

recently viewed;

scheduled reports;

favourites;

downloads.

Categories

Operations Reports

Compliance Reports

Analytics & Insights

Financial Reports only when explicitly permitted

Recommended Dispatcher Reports

Daily Load Activity

Active Load Status

Delayed Loads

Load Performance Summary

On-Time Delivery

Driver Availability

Driver Compliance Expiry

Vehicle Availability

Vehicle Compliance

Trailer Utilisation

Fleet Utilisation

Empty Kilometres

Route Performance

Warehouse Dispatch Activity

Unassigned Loads

Cancelled Loads

Dispatcher Activity

Communication Response

Delivery Issues

Proof of Delivery Completion

Functions

search;

filters;

date range;

view;

export;

favourite;

schedule;

custom report where permitted.

Export Formats

CSV

XLSX

PDF

Exports must include report name, generated by, generated time, timezone, branch scope and active filters.

ID

Requirement

Priority

DSP-RPT-001

Access authorised operational reports.

Should

DSP-RPT-002

Respect branch and permission scope.

Must

DSP-RPT-003

Export only filtered data.

Must

DSP-RPT-004

Validate scheduled recipients.

Must

DSP-RPT-005

Hide financial reports by default.

Must

DSP-RPT-006

Audit report generation and exports.

Must

6.15 Dispatcher Profile

Profile Data

full name;

avatar;

online status;

job title;

employee ID;

mobile;

email;

address;

working hours;

break duration;

language;

timezone;

emergency contact.

Role and Permissions

Display role, access level, branch and granted permissions. Permission data is read-only.

Recent Activity

login;

load creation;

load update;

assignment;

message;

export;

security event.

Account and Security

username;

change password;

2FA state;

active devices;

revoke session;

logout all devices.

Changing mobile or email should require verification.

ID

Requirement

Priority

DSP-PRO-001

View profile and access scope.

Must

DSP-PRO-002

Edit permitted personal fields.

Must

DSP-PRO-003

Verify email and phone changes.

Must

DSP-PRO-004

View and revoke sessions.

Must

DSP-PRO-005

Support 2FA.

Must

DSP-PRO-006

Prevent permission editing from profile.

Must

6.16 AI Loads / Inbox

Sources

Email

Customer Portal

File Upload

Driver / Field Submission

AI Extraction

Inbox Card

draft ID;

source;

booking reference;

urgency;

confidence;

received time;

driver;

vehicle;

cargo;

route;

review action.

Workflow

Open draft.

Compare extracted data with source.

Review field-level confidence.

Correct low-confidence values.

check duplicates.

validate customer and route.

add stops and items.

assign resources.

save draft or activate.

AI Rules

AI must not auto-activate without configured approval.

Original source remains attached.

Extracted and corrected values remain traceable.

Confidence scores are stored.

Dangerous goods, urgent and low-confidence drafts are highlighted.

Normal activation rules always apply.

ID

Requirement

Priority

DSP-AI-001

Review AI-generated drafts.

Should

DSP-AI-002

Show source and extracted values together.

Must

DSP-AI-003

Highlight low-confidence fields.

Must

DSP-AI-004

Apply normal activation validation.

Must

DSP-AI-005

Prevent unapproved auto-dispatch.

Must

7. End-to-End Workflows

7.1 Standard Load Dispatch

Dispatcher creates a load.

Customer and load type are selected.

Route stops are added.

Items are entered or imported.

Each item is mapped to pickup and drop-off.

Driver, truck and trailer are selected.

System validates compliance and conflicts.

Dispatcher saves draft or activates.

On activation, resources are reserved and driver notified.

Driver accepts assignment.

Driver completes safety checklist.

GPS and milestone updates begin.

Dispatcher handles exceptions.

Driver uploads delivery proof.

Load is delivered and completed.

7.2 Planning Board Assignment

Dispatcher opens branch and date.

System loads shifts, resources and loads.

Dispatcher reviews unassigned loads.

Load is dragged to a resource row.

System validates the assignment.

Dispatcher confirms.

Driver and asset assignment is updated.

Notifications and audit entries are generated.

7.3 Delayed Load Management

System detects ETA breach, route deviation or manual delay.

Load is marked delayed.

Dashboard and GPS alert dispatcher.

Dispatcher contacts driver and records reason.

Dispatcher may update ETA, send route, contact customer, swap resource or raise issue.

All actions are recorded.

Delay is cleared only through valid resolution.

7.4 Driver or Asset Swap

Dispatcher selects swap action.

System shows eligible replacements.

Selected replacement is validated.

Dispatcher enters reason.

Assignment updates.

Relevant users are notified.

Old and new assignments remain in history.

7.5 Send GPS Destination

Dispatcher selects driver.

Destination preset or address is chosen.

Coordinates are resolved.

Instructions and channel are selected.

Confirmation may be required.

Driver receives navigation link.

Delivery and confirmation states are stored.

7.6 Shift Assignment

Dispatcher selects worker.

Date and shift are entered.

Conflicts and qualifications are validated.

Shift is confirmed.

Worker is notified.

Audit entry is created.

8. Status Models

8.1 Load Primary Status

Draft

Planned

Active

Completed

Cancelled

8.2 Load Operational Status

Not Ready

Ready

Pending Dispatch

Assigned

Accepted

En Route to Pickup

At Pickup

Loaded

In Transit

At Stop

At Delivery

Delivered

On Hold

Delayed

Cancelled

Transitions must be enforced by a server-side state machine.

8.3 Driver Status

Available

On Duty

En Route

At Pickup

At Delivery

Break

Off Duty

On Leave

Unavailable

Delayed

Offline

8.4 Vehicle / Trailer Status

Available

Active

Assigned

In Transit

Maintenance

Out of Service

Sold

Inactive

8.5 Compliance Status

Compliant

Expiring Soon

Overdue

Not Uploaded

Under Review

Rejected

Not Applicable

9. Business Rules

9.1 Assignment Rules

Only available and compliant resources can be assigned.

Driver must hold the required licence.

Dangerous goods requires valid certification.

Drivers and assets cannot have overlapping assignments.

Maintenance and out-of-service assets cannot be assigned.

Truck-trailer compatibility is mandatory.

Capacity cannot be exceeded.

Rest and working-hour rules apply.

Hard-rule override requires permission, reason and audit.

9.2 Load Rules

Reference uniqueness follows company policy.

Activation requires valid route, schedule and items.

Every item requires stop mapping.

Cancellation requires reason.

Completed loads require controlled correction workflow.

Status history cannot be deleted.

Required proof must exist before completion.

Branch must be within user access.

9.3 Data Visibility

Branch users see authorised branches only.

Payroll and bank data are masked.

Financial reports are hidden by default.

GPS history is permission controlled.

Customer commercial terms require permission.

Exports follow the same access rules as screens.

9.4 Dates and Timezones

Store timestamps in UTC.

Display in user or branch timezone.

Show timezone for operational schedules.

Support daylight-saving transitions.

Preserve exact timestamp even when relative time is displayed.

10. Notifications and Alerts

Dispatcher Alerts

urgent unassigned load;

delayed load;

route deviation;

driver offline;

rejected assignment;

resource conflict;

compliance expiry;

maintenance due;

failed checklist;

missed pickup or delivery window;

missing proof;

new message;

delivery issue;

shift shortage.

Driver Notifications

new assignment;

assignment change or cancellation;

route change;

location sent;

dispatcher message;

pickup or delivery instruction;

safety checklist requirement;

shift assignment or change.

Channels may include in-app, push, email, SMS and WhatsApp.

11. Audit Logging

Audit these events:

login and logout;

failed authentication;

profile changes;

load create, update, activate and cancel;

status changes;

assignments and swaps;

planning board moves;

overrides;

GPS destinations sent;

messages;

file uploads;

reports and exports;

driver changes;

shift assignments;

session revocation.

Each audit record must include:

event ID;

tenant and branch;

module and action;

actor and role;

target entity;

before and after values where applicable;

reason;

IP and user agent;

timestamp;

correlation ID;

source application.

Normal users cannot alter audit records.

12. Suggested Data Model

Core entities:

Tenant

Company

Branch

User

Role

Permission

Customer

Customer Contact

Customer Location

Load

Load Stop

Load Item

Load Assignment

Load Status History

Load Note

Load Document

Load Photo

Delivery Issue

Driver

Driver Licence

Driver Document

Driver Certification

Driver Availability

Driver Shift

Driver Activity

Vehicle

Trailer

Compliance Document

Maintenance Record

GPS Device

GPS Position

Geofence

Geofence Event

Route Event

Conversation

Message

Message Attachment

Warehouse

Inventory Item

Warehouse Task

Workforce Member

Unavailability

Report Definition

Report Schedule

Notification

Audit Log

Key relationships:

Company has many branches.

Branch has many loads, drivers, vehicles, trailers and warehouses.

Load has many stops and items.

Load has assignment and status history.

Driver has shifts, documents and activity.

Vehicle and trailer have compliance and maintenance records.

GPS positions may link to driver, vehicle, load and device.

Warehouse tasks may link to loads and stops.

13. API Requirements

Suggested API groups:

/api/dispatcher/dashboard

/api/loads

/api/loads/:id

/api/loads/:id/stops

/api/loads/:id/items

/api/loads/:id/assignments

/api/loads/:id/status

/api/loads/:id/photos

/api/loads/:id/documents

/api/loads/:id/notes

/api/planning-board

/api/planning-board/optimise

/api/gps/positions

/api/gps/history

/api/gps/send-location

/api/drivers

/api/drivers/:id

/api/vehicles

/api/trailers

/api/customers

/api/warehouses

/api/workforce

/api/workforce/shifts

/api/messages

/api/reports

/api/profile

/api/audit

API standards:

secure authentication;

tenant and branch validation;

permission enforcement;

request schema validation;

pagination, filtering and sorting;

idempotency for create/activate actions;

optimistic concurrency;

standard error format;

correlation IDs;

audit hooks;

rate limiting;

secure file uploads.

14. Integrations

Potential integrations:

GPS / telematics;

map and geocoding;

traffic;

weather;

SMS;

email;

WhatsApp Business;

push notification;

identity provider;

document storage;

malware scanning;

registration or VIN lookup;

accounting or payroll read access where authorised.

Integration failure must not silently discard data. The system must show actionable status, safely retry where possible and log all failures without exposing secrets.

15. Security Requirements

Authentication

secure login;

strong password policy;

2FA;

session expiry;

refresh-token rotation where JWT is used;

session and device management;

brute-force protection;

login audit.

Authorisation

server-side RBAC;

tenant isolation;

branch scoping;

object-level access checks;

action-level permissions;

export permissions;

sensitive-field masking.

Data Protection

TLS in transit;

encryption at rest;

secret management;

protected file URLs;

malware scanning;

secure backups;

configurable retention;

no plaintext passwords;

bank and tax data encrypted and masked.

Application Security

input validation;

output encoding;

CSRF protection where applicable;

XSS and injection protection;

secure headers;

file validation;

dependency scanning;

audit monitoring.

16. Non-Functional Requirements

Performance

dashboard initial load under 3 seconds;

common filters under 2 seconds;

load detail under 2 seconds;

planning board under 4 seconds for normal branch volume;

message acknowledgement under 2 seconds;

GPS freshness within provider interval;

large exports processed asynchronously.

Availability

99.9% monthly target;

graceful degradation for GPS or messaging outage;

health monitoring and alerts;

backup and recovery procedures.

Scalability

Support multiple companies and branches, thousands of daily loads, hundreds of active drivers, high-frequency GPS events and concurrent dispatchers.

Accessibility

keyboard navigation;

visible focus;

semantic labels;

sufficient contrast;

status not represented by colour only;

accessible form errors.

Responsiveness

Desktop and tablet are mandatory. Mobile browser must support essential monitoring and messaging. Complex planning may use a mobile-optimised view.

Browser Support

Latest stable Chrome, Edge, Safari and Firefox.

17. UX Requirements

Keep primary dispatch actions visible.

Use consistent status labels.

Distinguish warnings from hard blocks.

Preserve filters when navigating back.

Confirm destructive actions.

Use drawers/modals for quick actions.

Use full pages for complex creation and planning.

Show exact assignment failure reasons.

Warn about unsaved changes.

Provide loading, empty and error states.

Show timezone for schedules.

Keep branch context visible.

18. Error Handling

Standard API error example:

{
  "success": false,
  "code": "RESOURCE_CONFLICT",
  "message": "The selected driver already has an overlapping assignment.",
  "details": {
    "driverId": "DRV-0021",
    "conflictingLoadId": "LD-10583"
  },
  "correlationId": "COR-..."
}

Errors must explain the problem, show resolution steps, preserve form data, avoid exposing stack traces and provide safe retry actions.

19. Reporting Definitions

On-Time Delivery

A completed load is on time when delivery occurs on or before the approved delivery deadline, including authorised revisions.

Delayed Load

A load is delayed when ETA exceeds threshold, a milestone deadline is missed, a dispatcher or driver reports delay, or an exception rule is triggered.

Available Driver

A driver is available only when active, compliant, not on leave, within working-hour rules, not assigned to conflicting work and branch compatible.

Available Asset

A truck or trailer is available only when active, compliant, not assigned, not under maintenance, not out of service and operationally compatible.

20. Release Plan

Phase 1 — Core Dispatch

authentication and RBAC;

dashboard;

create load;

all and active loads;

driver list;

vehicle/trailer list;

manual planning board;

messages;

profile;

audit logs.

Phase 2 — Real-Time Operations

live GPS;

history;

geofences;

send location;

ETA and delay alerts;

driver confirmations;

proof photo workflow.

Phase 3 — Workforce and Warehouse

workforce scheduling;

shift assignment;

leave and unavailability;

yard/warehouse visibility;

linked warehouse tasks;

customer enhancements.

Phase 4 — Optimisation and AI

planning optimiser;

AI Loads / Inbox;

suggested drivers;

delay prediction;

utilisation insights;

scheduled and custom reports.

21. Out of Scope for Initial Dispatcher Release

Unless separately approved:

subscription management;

full finance dashboard;

payroll processing;

pricing administration;

tenant creation;

role editing;

company settings;

accounting reconciliation;

unrestricted HR data;

AI auto-dispatch without human approval.

22. QA Coverage

Functional QA

load create, draft and activation;

stops and item mapping;

photo upload;

driver/truck/trailer assignment;

conflicts;

status transitions;

planning drag and drop;

GPS;

location sending;

messaging;

shifts;

filters;

exports;

profile updates.

Permission QA

Test allowed and denied actions, wrong branch, wrong tenant, direct API requests, hidden controls, exports and sensitive fields.

Negative QA

duplicate reference;

missing route;

unmapped item;

expired licence;

driver on leave;

vehicle maintenance;

overlapping assignment;

invalid file;

stale record update;

GPS outage;

messaging failure;

invalid transfer.

Security QA

authentication bypass;

cross-tenant or cross-branch access;

IDOR;

injection;

XSS;

malicious uploads;

token replay;

privilege escalation;

sensitive data leakage.

23. UAT Scenarios

UAT-01 — Create Standard Load

Given an authorised dispatcher, when valid customer, route, item and assignment data are entered, then the load activates and the driver is notified.

UAT-02 — Block Expired Driver

Given a driver with expired mandatory licence, when assignment is attempted, then the system blocks it and displays the expiry reason.

UAT-03 — Planning Conflict

Given an overlapping driver assignment, when another load is dragged into the same time, then the board rejects it and identifies the conflicting load.

UAT-04 — Required Photos

Given delivery photos are mandatory, when completion is attempted without them, then completion is blocked.

UAT-05 — Delayed Load

Given ETA exceeds the threshold, when GPS updates, then the load becomes delayed and an alert appears.

UAT-06 — Send Location

Given an active driver, when the dispatcher sends a destination requiring confirmation, then delivery and confirmation states are shown.

UAT-07 — Branch Restriction

Given Sydney-only access, when a Melbourne-only load is requested directly, then access is denied.

UAT-08 — Shift Conflict

Given a worker has an overlapping shift, when another is assigned, then the assignment is blocked.

UAT-09 — Load Transfer

Given transfer permission, when a load is transferred to an eligible branch, then ownership updates and full history remains.

UAT-10 — Export

Given active filters, when loads are exported, then only authorised filtered records are included.

24. Definition of Done

A feature is complete only when:

requirements are implemented;

server-side permissions exist;

validation is enforced;

audit events are recorded;

loading, empty and error states exist;

responsive and accessible behaviour is complete;

automated tests pass;

security review passes;

QA and UAT pass;

API and user documentation are updated;

monitoring and logs are available;

no critical or high defects remain.

25. Open Product Decisions

Which load types are enabled at launch?

Can dispatchers create or edit drivers?

Can dispatchers view payroll information?

Which rules are hard blocks versus warnings?

Who can approve overrides?

Which GPS provider will be used?

What GPS update interval is required?

Is WhatsApp required?

Which photos are mandatory by load type?

Is AI Load Inbox in the first release?

Can dispatchers create customers?

Are cross-branch transfers allowed?

What GPS retention period applies?

Which reports can dispatchers schedule?

Is optimisation rules-based, AI-based or hybrid?

Is fatigue management required at launch?

Which compliance standards and policies apply?

Is offline driver-app operation required?

Which fields vary by load type?

What is the official timezone strategy?

26. Risks and Mitigations

Risk

Impact

Mitigation

Incorrect assignment

Safety and operational failure

Hard validation and audit

Stale GPS shown as live

Wrong decisions

Freshness status and warnings

Cross-branch leakage

Security breach

Server-side scope checks

Concurrent planning edits

Conflicting assignments

Optimistic locking

AI extraction error

Incorrect load

Human review and validation

Payroll exposure

Privacy breach

Permissions and masking

GPS data volume

Cost and performance

Retention and aggregation

Missing proof photos

Dispute risk

Milestone blocking

Integration outage

Dispatch interruption

Retry and fallback

Unclear statuses

Operational confusion

Server-side state machine

27. Suggested Dispatcher Permission Matrix

Module / Action

Default

Dashboard View

Allow

Create Load

Allow

Edit Draft Load

Allow

Activate Load

Allow

Cancel Load

Conditional

Transfer Load

Conditional

Assign Driver

Allow

Assign Truck / Trailer

Allow

Override Compliance

Deny

View GPS

Allow

View GPS History

Conditional

Send Location

Allow

View Drivers

Allow

Create Driver

Conditional

Edit Driver

Conditional

View Driver Payroll

Deny

View Vehicles / Trailers

Allow

Edit Vehicle

Conditional

View Customers

Allow

Create Customer

Conditional

View Warehouse

Allow

Adjust Inventory

Deny

View Workforce

Allow

Assign Shift

Allow

Approve Leave

Deny

Send Messages

Allow

Export Operational Reports

Allow

View Financial Reports

Deny

Edit Own Profile

Allow

Manage Roles

Deny

Manage Company Settings

Deny

28. Sample Validation Messages

Pickup location is required.

At least one drop-off stop is required.

Item 3 does not have a pickup stop.

Item 3 does not have a drop-off stop.

Driver licence expired on 21 July 2026.

Driver is unavailable during the selected time.

Driver has a conflicting assignment: LD-10578.

Truck T405 is currently in maintenance.

Trailer TR-02 capacity is insufficient.

Required pickup photos are missing.

The selected driver is not certified for dangerous goods.

You do not have access to the selected branch.

This load was updated by another dispatcher. Refresh before saving.

29. Sign-Off

Stakeholder

Name

Status

Date

Product Owner



Pending



Operations Lead



Pending



Dispatch Lead



Pending



Technical Lead



Pending



Security Reviewer



Pending



QA Lead



Pending



Client Representative



Pending



End of Document