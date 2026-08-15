Haan, **Driver Portal ka flow ab kaafi clearly samajh aa gaya hai**. Aapke screenshots se ye bhi clear hai ki Driver role HERO ke actual ground-level execution ka main actor hai.

> **Dispatcher plan karta hai; Driver actual job execute karta hai.**
> Driver ka kaam hai shift start karna → assigned load lena → vehicle/trailer safety check → pickup par cars/items verify karna → dispatch karna → GPS/status update ke saath route execute karna → destination par correct items deliver karna → photos/signature/POD lena → expenses/timesheet submit karna → shift finish karna.

---

# 1. Current Driver Portal Menu

Aapke screenshots ke hisaab se current structure:

```
DRIVER PORTAL

Driver Dashboard

Start Work / Finish Work

Assigned Jobs

Pickup & Loading

Dispatch & Active Run

Delivery & POD

Fuel & Expenses

Messages

Documents & Compliance

Timesheets / Clock In-Out

Payroll & Pay History

Trailer Swap

Offline Sync

```

Ye structure overall **bahut achha hai** aur Driver role ke real business workflow ke close hai.

Lekin kuch jagah role/business logic aur data consistency correct karni padegi.

---

# 2. Driver ka Exact End-to-End Business Flow

Driver ka complete lifecycle ideally ye hona chahiye:

```
LOGIN
  ↓
DRIVER DASHBOARD
  ↓
Check today's assignments
  ↓
START WORK
  ↓
Clock In
  ↓
GPS / Geofence captured
  ↓
PRE-START SAFETY CHECKLIST
  ↓
Driver + Truck + Trailer compliance check
  ↓
Checklist Passed?
       │
   ┌───┴────┐
   │        │
  NO       YES
   ↓        ↓
Report     Continue
Defect
   ↓
Block job if critical
            ↓
ASSIGNED JOBS
            ↓
Select assigned Load
            ↓
Review:
Customer
Pickup
Delivery
Items/Cars
Instructions
Truck
Trailer
            ↓
PICKUP & LOADING
            ↓
Arrive at Pickup
            ↓
Scan VIN / select item
            ↓
Verify correct item
            ↓
Capture Before Photos
            ↓
Damage / condition check
            ↓
Pick Up Item
            ↓
All required items picked?
        │
    ┌───┴────┐
    │        │
   NO       YES
    ↓        ↓
Remain      Ready
at Pickup   to Dispatch
             ↓
DISPATCH / ACTIVE RUN
             ↓
Driver presses Dispatch
             ↓
GPS tracking active
             ↓
EN ROUTE / IN TRANSIT
             ↓
Next Stop
             ↓
Delay / Issue?
      │
  ┌───┴────┐
  │        │
 YES       NO
  ↓         ↓
Message   Continue
Dispatch
  ↓
Wait / Re-route /
Dispatcher instruction
             ↓
ARRIVE AT DELIVERY
             ↓
DELIVERY & POD
             ↓
Scan / select correct item
             ↓
Verify destination
             ↓
Capture Delivery Photos
             ↓
Record Damage if any
             ↓
Receiver Signature
             ↓
POD
             ↓
Mark Item Delivered
             ↓
More Stops?
       │
   ┌───┴────┐
   │        │
  YES       NO
   ↓        ↓
Next Stop   Complete Load
                 ↓
Fuel / Expense submission
                 ↓
Timesheet updated
                 ↓
Payroll data generated
                 ↓
FINISH WORK
                 ↓
Clock Out
                 ↓
Shift Complete

```

Ye **Driver Portal ka golden flow** lock kar sakte ho.

---

# 3. Driver Dashboard

Current Dashboard ka concept strong hai.

Screenshot me:

```
Driver
Noah Williams

Status
On Duty

Vehicle
TX-ROAD88 / Freightliner Cascadia

Odometer
245,678 km

```

Aur cards:

```
Loads Today
Completed This Week
Drive Time Today
Diesel Balance
Pay This Period

```

Ye useful hain.

Driver login karte hi usko ideally ye answer milna chahiye:

```
Aaj mera kaunsa job hai?
Mera current truck kya hai?
Mera trailer kya hai?
Pre-start checklist complete hai?
Kitna drive time baki hai?
Next pickup kab hai?
Current load kya hai?
Koi compliance issue hai?
Koi urgent Dispatch message hai?

```

Dashboard ground operations focused hi rehna chahiye.

---

# 4. Dashboard ka Current Load Card

Aapke screenshot me:

```
Current Load
LD-3987

Melbourne VIC
→ Sydney NSW

Pickup
ABC Car Yard

Delivery
Auto World Sydney

```

Ye perfect concept hai.

Driver dashboard ko shared Load record se hi data lena chahiye.

Matlab:

```
Dispatcher Planning Board
       ↓
Assign LD-3987 to Noah
       ↓
Same LD-3987
       ↓
Driver Dashboard

```

Alag dummy Driver Load nahi banana.

---

# 5. Start Work / Finish Work

Ye module bahut important hai.

Menu naam:

```
Start Work / Finish Work

```

but screenshot currently Safety Checklist open karta hai.

Ideal flow actually:

```
START WORK
   ↓
Clock In
   ↓
Capture Time
   ↓
Capture GPS
   ↓
Check authorized geofence
   ↓
Assign current Truck / Trailer
   ↓
Pre-Start Checklist
   ↓
Ready For Work

```

Aur end me:

```
FINISH WORK
   ↓
Check active job?
   ↓
Check unsubmitted expense?
   ↓
Check open incident?
   ↓
Clock Out
   ↓
Capture GPS + Time
   ↓
Timesheet finalized

```

### Important

`Start Work / Finish Work` aur `Timesheets / Clock In-Out` duplicate concepts nahi banne chahiye.

Relationship:

```
Start Work / Finish Work
        ↓
Actual action

Timesheets
        ↓
History + review + break records

```

Matlab Driver ko same shift do jagah independently start nahi karni chahiye.

---

# 6. Safety / Pre-Start Checklist

Current checklist screen directionally excellent hai.

Screenshot:

```
Vehicle:
TRK-101

Trailer:
TRL-205

Load:
LD-3987

```

Checklist:

```
Brakes
Tyres
Lights
Indicators
Steering
Windows/Mirrors
Wipers
Horn
...

```

Statuses:

```
Pass
Fail
N/A
Not Checked

```

Correct flow:

```
Driver Clock In
      ↓
Pre-Start Checklist
      ↓
Every required item answered
      ↓
Any FAIL?
    /       \
 YES        NO
 ↓           ↓
Report      Checklist Passed
Defect
 ↓
Severity
 ↓
Critical?
  /    \
YES    NO
 ↓      ↓
Vehicle  Continue based
Blocked  on company policy
 ↓
Dispatch notified

```

### Very important rule

Agar:

```
Brakes = FAIL

```

to sirf Driver button click karke job continue nahi kar sake.

Backend check hona chahiye.

---

# 7. Report Defect

Current `Report Defect` action correct hai.

It should create a shared defect:

```
Defect ID
Driver
Truck
Trailer if applicable
Checklist
Load
Description
Severity
Photos
GPS
Reported At
Status

```

Then:

```
Driver
   ↓
Defect
   ↓
Company Admin / Maintenance
   ↓
Resolve / Vehicle Out of Service

```

Dispatcher ko bhi immediately availability change dikhni chahiye.

---

# 8. Assigned Jobs

Current Assigned Jobs page logically Driver ke liye correct hai.

Cards:

```
Upcoming
In Progress
Completed
Cancelled
Total Jobs

```

Driver ko sirf:

```
Own Assigned Jobs

```

dikhne chahiye.

Not:

```
All Company Loads
Other Drivers' Jobs
Unassigned Loads

```

### Current serious problem

Screenshot me:

```
+ New Load

```

Driver Assigned Jobs page par hai.

**Normal Driver ko New Load create nahi karna chahiye.**

New Load:

```
Company Admin
or
Dispatcher

```

ka scope hai.

Driver ko optionally owner-driver business model me additional permission diya ja sakta hai, but standard Driver role me button remove/hide karo.

---

# 9. Assigned Job Status

Driver ke job view ko ideally:

```
Upcoming
Accepted
At Pickup
Picked Up
In Transit
At Delivery
Completed
Cancelled

```

type operational progression follow karna chahiye.

Dispatcher planning statuses se carefully map karna hoga.

Example:

```
Dispatcher:
ASSIGNED

Driver:
UPCOMING

```

Driver presses accept:

```
Driver:
ACCEPTED

```

Then:

```
AT_PICKUP
PICKED_UP
DISPATCHED
IN_TRANSIT
AT_DELIVERY
DELIVERED

```

Same Load event chain update ho.

---

# 10. Pickup & Loading

Ye Driver Portal ka **major physical execution module** hai.

Screenshot ka concept kaafi strong hai:

```
Load LD-3987
8 Cars

Scan VIN
Add Car

```

Cars:

```
Toyota Camry
Mazda 3
Tesla ...

```

Driver physical pickup yahin karega.

Correct process:

```
Driver reaches Pickup Stop
        ↓
GPS Arrival
        ↓
Select / Scan VIN
        ↓
Does VIN belong to this Load/Stop?
      /           \
    NO            YES
     ↓             ↓
Block            Open Item
                  ↓
Verify Rego/VIN
                  ↓
Before Photos
                  ↓
Existing Damage
                  ↓
Notes
                  ↓
Mark Picked Up

```

---

# 11. Photo Requirements

Aapke screenshot me:

```
4/4 = 100%
3/4 = 75%
Missing 1 Photo

```

Ye useful hai.

Company rules define kar sakti hain:

```
Front
Rear
Driver Side
Passenger Side

```

ya niche-specific photos.

Important:

```
Required photos incomplete
          ↓
Cannot complete pickup

```

unless allowed override.

---

# 12. Add Car to Load — Important Permission Issue

Current screen kehta hai:

> Flexible / Owner-Driver Mode
> You can add, remove and edit cars and destinations.

Ye standard Driver ke liye dangerous ho sakta hai.

Correct structure:

```
STANDARD EMPLOYEE DRIVER
→ Cannot freely add/delete Load items

OWNER-DRIVER / ELEVATED DRIVER
→ Can add/edit based on Company policy

```

Recommended permission:

```
driver.load_items.modify

```

Default = OFF.

Dispatcher/Admin ko changes notify hone chahiye.

---

# 13. Driver Item Delete

Pickup rows me delete button bhi visible hai.

Standard Driver ke liye:

```
Delete car from customer Load

```

normally allowed nahi hona chahiye.

Better:

```
Cannot Pick Up
Wrong Item
Item Missing
Customer Removed Item

```

reason-based exception create karo.

Actual master Load modification Dispatcher approve kare.

---

# 14. Dispatch & Active Run

Ye page actual journey control screen hai.

Current:

```
Picked Up
→ Dispatched
→ Delivered

```

correct high-level sequence hai.

Driver jab sab required items pickup kar le:

```
Picked Up = complete
       ↓
DISPATCH button enabled
       ↓
Driver leaves pickup
       ↓
GPS event
       ↓
DISPATCHED
       ↓
IN TRANSIT

```

Dispatcher ko instantly same status dikhna chahiye.

---

# 15. Dispatch Button Rule

Screenshot me warning:

> Please pick up all assigned cars before you can DISPATCH the load.

Perfect business rule.

Backend bhi check kare:

```
requiredPickupItems
==
pickedUpItems

```

Tabhi Dispatch.

Sirf frontend disabled button sufficient nahi.

---

# 16. Active Run

Driver ko Active Run me ideally:

```
Current Load
Current Stop
Next Stop
ETA
Distance
Contact
Instructions
Directions
Load progress
HOS
Alerts

```

dikhna chahiye.

Driver ko route planning modify nahi karna chahiye except allowed navigation choice.

Major change:

```
Contact Dispatch

```

ke through jayega.

---

# 17. Driver Status Ownership

Ye Driver Portal ka most important part hai.

Driver owns physical execution events:

```
Accept Job
Arrive Pickup
Pick Up
Load
Dispatch
In Transit
Arrive Delivery
Deliver
Capture POD
Complete Stop
Complete Load

```

Dispatcher ko ye manually impersonate nahi karna chahiye.

Every event:

```
Timestamp
Driver
GPS
Device
Load
Stop

```

ke saath log karo.

---

# 18. Delivery & POD

Current screen strong hai.

Flow:

```
Arrive at Stop
      ↓
GPS verifies location
      ↓
Scan VIN / select Item
      ↓
Correct item for this stop?
    /       \
  NO        YES
   ↓         ↓
Block      Before Condition
             ↓
Delivery Photos
             ↓
Damage?
        /          \
      YES          NO
       ↓            ↓
Damage Report     Continue
       ↓
Receiver Name
       ↓
Signature
       ↓
POD
       ↓
Delivered

```

---

# 19. Wrong Car / Wrong Destination Protection

Screenshot explicitly says:

> Deliver the correct cars only. Wrong cars are blocked.

Excellent rule.

Backend should validate:

```
item.loadId
item.deliveryStopId
currentStopId

```

before delivery.

This prevents wrong-car delivery.

---

# 20. POD ka Proper Structure

POD should include:

```
Load
Stop
Delivered Items
Receiver Name
Signature
Timestamp
GPS
Driver
Delivery Photos
Damage Status
Notes

```

Then:

```
POD Complete
      ↓
Load/Stop Delivered
      ↓
Customer Portal updated
      ↓
Accounts notified
      ↓
Invoice eligibility

```

Yahi HERO image ka original financial automation connection tha.

---

# 21. Delivery Damage

Current screenshot:

```
No Damage
Minor Scratch...

```

Good.

Damage should be item-specific:

```
Item
Before Photos
Delivery Photos
Damage Type
Damage Severity
Description
Driver Notes
Customer Confirmation

```

Then Delivery Issue create ho sakta hai.

---

# 22. Fuel & Expenses

Ye Driver ke scope me absolutely correct hai.

Driver expense enter kare:

```
Fuel
Toll
Tyre
Maintenance
Parking
Accommodation
Other

```

but Driver **expense approve nahi karega**.

Flow:

```
Driver adds Expense
       ↓
Amount
       ↓
Category
       ↓
Load
       ↓
Vehicle
       ↓
Odometer
       ↓
Merchant
       ↓
Receipt Photo
       ↓
Submit
       ↓
PENDING
       ↓
Accounts / Company approval
       ↓
APPROVED / REJECTED

```

---

# 23. Current Expense Screen me Concern

Screenshot me expenses:

```
Approved

```

Driver screen par visible hona fine hai.

But ensure Driver khud status:

```
Approved

```

set nahi kar raha.

Driver only submit kare.

Accounts/Admin approval kare.

---

# 24. Receipt OCR

Future AI connection:

```
Driver uploads Receipt
       ↓
OCR
       ↓
Merchant
Date
Amount
Tax
       ↓
Driver confirms
       ↓
Submit Expense

```

Human confirmation required.

---

# 25. Messages

Driver messaging ka current structure useful hai.

Driver communicate kar sakta hai:

```
Dispatch
Pickup Customer
Delivery Customer
Maintenance
Safety Team

```

Messages ideally Load-aware hon.

Screenshot me:

```
Dispatch Support
LD-3987
Melbourne VIC → Sydney NSW

```

good.

Correct record:

```
conversation
driverId
loadId
stopId optional
participant

```

---

# 26. Customer Messaging

Driver ko customer ke saath unrestricted generic CRM chat nahi chahiye.

Use operation-specific communication:

```
Running 15 minutes late
Arrived
Gate information required
Delivery contact unavailable

```

Company policy decide kare ki number expose ho ya masked communication ho.

---

# 27. Documents & Compliance

Current module concept correct hai.

Driver should see:

```
Driver Licence
Medical
Heavy Vehicle Card
Dangerous Goods Licence
Police Check
Chain of Responsibility
Vehicle Documents

```

Statuses:

```
Valid
Expiring Soon
Expired
Uploaded/Pending

```

### Critical connection

Expired document ko sirf red warning nahi banana.

Example:

```
Dangerous Goods Licence = Expired
       ↓
Dangerous Goods Load
       ↓
Driver assignment BLOCKED

```

Dispatcher Planning Board bhi same compliance rule use kare.

---

# 28. Compliance Dashboard me Current Logic Problem

Screenshot:

```
Total Documents 11
Valid 4
Expiring Soon 2
Expired 1
Uploaded 2

```

Ye totals 11 ko fully reconcile nahi karte.

Could be Not Required etc., but final system me status totals clearly reconcile hone chahiye.

Also:

```
4/11
44%
Compliant

```

suspicious hai.

Agar required compliance documents me expired critical document hai, Driver ko generic `Compliant` dikhana galat ho sakta hai.

Compliance should be rule-based:

```
Required critical docs valid?
YES → Compliant
NO → Non-Compliant

```

not simply percentage.

---

# 29. Timesheets / Clock In-Out

Ye current Driver workflow me very important aur mostly correct concept hai.

Flow:

```
Start Work
   ↓
Clock In
   ↓
GPS
   ↓
Work
   ↓
Break
   ↓
Resume
   ↓
Finish Work
   ↓
Clock Out
   ↓
Timesheet
   ↓
Submit
   ↓
Approve
   ↓
Payroll

```

Timesheets should never independently invent working hours.

Use actual events.

---

# 30. Geofence

Screenshot shows:

```
Within Geofence
Yass NSW
coordinates

```

good.

Company Admin should configure approved sites/branches.

Driver Clock In logic:

```
GPS permission
       ↓
Location captured
       ↓
Inside allowed geofence?

```

Company rules then determine:

```
Allow
Warn
Block
Require reason

```

---

# 31. HOS / Break Tracking

Dashboard me:

```
Drive Time Today
Remaining HOS
Next Break Due

```

hai.

Aur Timesheet me break tracking.

Ye useful hai, but **HOS and payroll timesheet ko same thing mat samjho**.

Conceptually:

```
Timesheet
= employee paid work time

Driving/HOS
= regulated driving/rest time

```

They can be connected but remain distinct datasets/rules.

---

# 32. Payroll & Pay History

Driver ko payroll **view-only** hona chahiye.

Driver can:

```
View Pay
View Earnings
View Deductions
View Tax
View Pay History
Download Payslip

```

Driver cannot:

```
Edit Gross Pay
Approve Payroll
Change Tax
Change Pay Rule
Mark Pay Paid

```

Payroll comes from:

```
Timesheet
+
Load Pay
+
Distance
+
Allowances
+
Company Pay Rules
-
Deductions
=
Pay

```

---

# 33. Current Payroll Data Inconsistency

Screenshot me top card:

```
Net Pay This Period
$2,740.25

```

Right side:

```
Gross $3,500
Deductions $1,094.75
Estimated Net $2,405.25

```

But another card:

```
Estimated Net Pay $2,820.50

```

Ye mutually inconsistent figures hain.

Final system me **one payroll source-of-truth** hona chahiye.

```
Payroll Run
   ↓
Driver Pay Summary
   ↓
Pay History
   ↓
Dashboard

```

Sab same calculation.

---

# 34. Trailer Swap

Ye interesting aur valuable functionality hai.

Current screen shows company policy:

```
Policy Type: Direct Swap
Approval Required: No
Notify Dispatch: Yes
Equipment Check: Required

```

Ye correct direction hai.

Actual flow:

```
Driver needs Trailer Swap
       ↓
Current Trailer
       ↓
Available Trailers
       ↓
Select Trailer
       ↓
Check:
Availability
Compatibility
Capacity
Compliance
Location
       ↓
Company Policy
       ↓
Approval Required?
    /          \
 YES          NO
 ↓             ↓
Request       Equipment Check
Dispatch           ↓
 ↓            Confirm Swap
Approve             ↓
       └──────→ Swap
                   ↓
             Update Load
                   ↓
             Update Driver
                   ↓
             Update Trailer
                   ↓
             Notify Dispatch
                   ↓
             Audit History

```

---

# 35. Trailer Swap Current Identity Bug

Most screens show:

```
Noah Williams

```

Trailer Swap screen shows:

```
Driver: John Smith

```

This is clearly inconsistent.

Same authenticated Driver should drive every page.

This is a high-priority mock-data bug.

---

# 36. Trailer Swap Should Never Just Change UI

When trailer changes:

```
Old Trailer → Available
New Trailer → Assigned / In Use

Driver.currentTrailer → New Trailer
Load.trailer → New Trailer
Dispatcher Planning → Updated
GPS/Active Run → Updated

```

Audit:

```
Old
New
Driver
Load
Location
Time
Reason
Approval

```

---

# 37. Offline Sync

Driver ke liye Offline Sync **bahut important** hai, especially remote route operations me.

Current concept strong hai.

Offline supported records should include:

```
Pre-start checklist
Pickup scan
Photos
Damage notes
Status events
GPS snapshots
POD
Signature
Expense
Receipt
Timesheet event
Messages where supported

```

---

# 38. Correct Offline Architecture

```
Driver action
      ↓
Network available?
   /          \
 YES          NO
  ↓            ↓
API         Local encrypted queue
  ↓            ↓
Server       Pending
               ↓
          Network returns
               ↓
             Sync
               ↓
        Server validates
               ↓
         Synced / Conflict

```

Important:

Offline does **not** mean separate fake database.

Server remains final source-of-truth.

---

# 39. Offline Conflict Handling

Example:

```
Driver offline:
Trailer = TRL-205

Meanwhile Dispatch changes:
Trailer = TRL-309

```

Then offline sync arrives.

System ko silently overwrite nahi karna chahiye.

Need:

```
Conflict Detected
       ↓
Server rule / review
       ↓
Resolve

```

Especially:

```
Load assignment
Trailer
Delivery item
POD

```

for conflict safety.

---

# 40. Driver Dashboard Offline Indicator

Dashboard currently:

```
Last Sync

```

show karta hai.

Good.

Also clearly show:

```
ONLINE
OFFLINE
SYNC PENDING
SYNC FAILED

```

so driver knows whether latest action server par gaya ya nahi.

---

# 41. Current Identity/Data Consistency Problems

Screenshots me several important mismatches visible hain:

```
Dashboard Driver:
Noah Williams

Trailer Swap Driver:
John Smith

```

Also truck/trailer varies:

```
Dashboard:
TX-ROAD88 / Freightliner

Checklist:
TRK-101
TRL-205

Fuel:
TRK-101
TRL-305

Trailer Swap:
TRK-101
TRL-205

```

Load references also mix:

```
LD-3987
PO-65432

```

Same journey me references consistently related hone chahiye.

Some differences historical context ho sakti hain, but current active-load widgets appear mixed enough that code audit definitely required hai.

---

# 42. One Shared Active Context

Driver portal ko ideally authenticated Driver ka current context provide karna chahiye:

```
Authenticated Driver
      ↓
Active Shift
      ↓
Current Assignment
      ↓
Current Load
      ↓
Current Truck
      ↓
Current Trailer
      ↓
Current Stop

```

Then:

```
Dashboard
Pickup
Active Run
Delivery
Fuel
Messages
Documents
Timesheet
Trailer Swap

```

sab same current context consume karein.

Ye multiple inconsistencies automatically solve karega.

---

# 43. Driver ko kya allowed hona chahiye

Driver ka normal responsibility:

```
View own jobs
Accept assigned job
Clock in/out
Start/finish work
Complete safety checklist
Report defect
View own truck/trailer
Pickup assigned items
Scan VIN/barcode
Capture photos
Report damage
Dispatch after pickup
Update physical journey status
Use navigation
Message Dispatch
Deliver assigned item
Capture signature/POD
Submit expenses
Upload receipts
View own compliance
Upload own documents
View own timesheet
Log break
View own pay
Request/perform trailer swap according to policy
Work offline/sync

```

---

# 44. Driver ko normally kya NOT allowed hona chahiye

```
Create arbitrary company Loads
View other Drivers' jobs
Assign Driver
Change another Driver
Create Driver
Create Truck
Create Trailer
Create Warehouse
Move warehouse inventory
Delete customer Load item freely
Change customer pricing
Approve expense
Approve payroll
Generate customer invoice
Mark invoice paid
Change Company Settings
Access Super Admin
Manage subscription

```

Owner-Driver mode ke liye selected exceptions permission-based ho sakte hain.

---

# 45. Driver Portal ka Best RBAC Model

Default permissions roughly:

```
driver.dashboard.view

driver.shift.clock_in
driver.shift.clock_out
driver.break.manage

driver.jobs.view_own
driver.jobs.accept

driver.safety.view
driver.safety.complete
driver.defects.create

driver.pickup.execute
driver.items.scan
driver.photos.upload
driver.damage.report

driver.run.execute
driver.status.physical_update

driver.delivery.execute
driver.pod.create

driver.expenses.create
driver.expenses.view_own

driver.messages.use

driver.documents.view_own
driver.documents.upload_own

driver.timesheets.view_own

driver.pay.view_own
driver.payslip.download_own

driver.trailer_swap.request

offline_sync.use

```

Optional:

```
driver.load_items.modify
driver.trailer_swap.direct
driver.customer_message
driver.owner_operator_load_create

```

---

# 46. Main Technical Connection

Driver portal should NOT have independent copies.

Correct:

```
Company Admin creates resources
        ↓
Dispatcher assigns
        ↓
SAME LOAD
        ↓
Driver executes
        ↓
SAME LOAD EVENTS
        ↓
Dispatcher sees progress
        ↓
Customer sees progress
        ↓
Accounts uses Delivered + POD

```

Example:

```
LD-3987

```

must be one record everywhere.

---

# 47. Driver → Dispatcher Live Connection

Suppose Driver:

```
Scan VIN
→ Picked Up

```

Immediately:

```
Dispatcher Active Loads
→ Picked Up

```

Driver:

```
Press Dispatch

```

Dispatcher:

```
→ In Transit

```

Driver:

```
Capture POD

```

Dispatcher:

```
→ Delivered

```

No manual duplicate update.

---

# 48. Driver → Customer Connection

```
Driver Dispatches
       ↓
Customer Portal
"In Transit"

Driver reaches Delivery
       ↓
Customer
"At Delivery"

Driver captures POD
       ↓
Customer
"Delivered"
+
POD available

```

---

# 49. Driver → Accounts Connection

```
Driver completes delivery
       ↓
POD
       ↓
Load Delivered
       ↓
Billing Ready
       ↓
Accounts
       ↓
Pricing Rules
       ↓
Invoice

```

Driver invoice create/approve nahi karega.

---

# 50. Driver → Payroll Connection

```
Clock In
   ↓
Work
   ↓
Break
   ↓
Clock Out
   ↓
Timesheet
   ↓
Approved Work
+
Load/Distance/Allowance rules
   ↓
Payroll Run
   ↓
Driver Pay History

```

Driver sirf result view karega.

---

# 51. Driver → Maintenance Connection

```
Pre-start checklist FAIL
       ↓
Defect
       ↓
Vehicle availability changes
       ↓
Dispatcher alerted
       ↓
Maintenance
       ↓
Repair
       ↓
Vehicle available again

```

Ye shared connection important hai.

---

# 52. Driver Final Sidebar

Main current sidebar ko mostly keep karunga:

```
DRIVER PORTAL

Driver Dashboard

Start Work / Finish Work

Assigned Jobs

Pickup & Loading

Dispatch & Active Run

Delivery & POD

Fuel & Expenses

Messages

Documents & Compliance

Timesheets / Clock In-Out

Payroll & Pay History

Trailer Swap

Offline Sync

```

Structure already good hai.

Major work **menu badalne me nahi**, backend/data/workflow connection correct karne me hai.

---

# 53. High-Priority Problems Jo Implementation Se Pehle Fix/Audit Karne Hain

Current screenshots ke basis par sabse important issues:

```
1. Driver identity inconsistent: Noah Williams vs John Smith.

2. Current Truck/Trailer inconsistent across pages.

3. Active Load references/context inconsistent across pages.

4. Assigned Jobs me normal Driver ke liye + New Load visible hai.

5. Owner-Driver mode permissions standard Driver se separate nahi lag rahe.

6. Driver item Add/Delete controls potentially over-permissioned hain.

7. Start Work and Timesheet Clock In/Out duplication audit required.

8. Pre-start checklist ko real shift/vehicle/current assignment se connect karna hai.

9. Critical failed checklist must block road use.

10. Driver compliance must influence Dispatcher assignment.

11. Delivery/POD must update same Load + Customer + Accounts workflow.

12. Expenses submit vs approve responsibility separate karni hai.

13. Payroll values currently internally inconsistent dikh rahe hain.

14. Trailer Swap must update same Driver/Load/Trailer records.

15. Offline Sync needs conflict-safe server synchronization.

16. Dashboard/current load/all modules must consume one Active Driver Context.

17. Mock/hard-coded data remove karke shared backend DB source use karna hai.

18. Driver should see own tenant + own assignments only.

19. All physical events require timestamp + GPS + actor + audit history.

20. Offline physical events must retain original event time/GPS, not sync time only.

```

---

# Final Driver Role Definition

Isko final rule maan sakte ho:

> **Company Admin setup karta hai. Dispatcher job plan aur assign karta hai. Warehouse/Yard cargo ready karta hai. Driver ground par actual pickup → transit → delivery → POD execute karta hai. Accounts us completed work ko invoice/payroll me convert karta hai.**

Aur **Driver golden sequence**:

```
CLOCK IN
   ↓
SAFETY CHECK
   ↓
VIEW ASSIGNED JOB
   ↓
ARRIVE PICKUP
   ↓
SCAN + VERIFY
   ↓
PHOTOS + CONDITION
   ↓
PICK UP
   ↓
DISPATCH
   ↓
IN TRANSIT
   ↓
ARRIVE DELIVERY
   ↓
SCAN + VERIFY
   ↓
PHOTOS + DAMAGE CHECK
   ↓
SIGNATURE + POD
   ↓
COMPLETE LOAD
   ↓
EXPENSES / RECEIPTS
   ↓
TIMESHEET
   ↓
CLOCK OUT
   ↓
PAYROLL

```

**Ye Driver portal ka clean business logic hai.** Is flow ke hisaab se Driver portal Company Admin/Dispatcher ka duplicate nahi banega; wo actual **physical execution + proof + driver compliance** layer banega.
---

# Implementation Source-of-Truth Addendum

## Role Boundary Lock

```text
Company Admin configures resources/rules
        ↓
Dispatcher plans + assigns
        ↓
Warehouse / Yard prepares cargo
        ↓
Driver executes physical work + proof
        ↓
Dispatcher monitors / replans
        ↓
Accounts handles billing / payroll
```

Driver is the **physical execution + proof + compliance layer**. A normal Driver must not become a Dispatcher, Company Admin, Warehouse Admin, Accounts user, or Super Admin through frontend-only controls.

## Shared Active Driver Context

All Driver pages must resolve the same authenticated context:

```text
Authenticated Driver
→ Active Shift
→ Current Assignment
→ Current Load
→ Current Truck
→ Current Trailer
→ Current Stop
```

Dashboard, Safety Checklist, Assigned Jobs, Pickup, Active Run, Delivery, Expenses, Messages, Documents, Timesheets, Payroll summary, Trailer Swap and Offline Sync must consume this same context rather than page-specific mock data.

## High-Priority Implementation Issues

1. Fix Driver identity mismatch such as Noah Williams vs John Smith.
2. Fix current Truck/Trailer mismatch across pages.
3. Fix current Load/reference mismatch across pages.
4. Remove/guard `+ New Load` for standard Drivers.
5. Separate Owner-Driver permissions from normal Driver permissions.
6. Guard Add/Delete Load item actions with RBAC and audit.
7. Unify Start Work / Finish Work with Timesheet Clock In/Out events.
8. Bind Pre-Start Checklist to the real shift, Driver, Truck and Trailer.
9. Critical checklist failure must block road operation server-side.
10. Driver compliance must affect Dispatcher assignment eligibility.
11. Delivery + POD must update the same shared Load/Stop used by Dispatcher, Customer and Accounts.
12. Driver may submit expenses but not approve them.
13. Fix inconsistent payroll figures by using one payroll source-of-truth.
14. Trailer Swap must update shared Driver/Load/Trailer/Dispatcher state atomically.
15. Offline Sync must preserve original event time/GPS and detect conflicts.
16. Remove hard-coded active operational values where backend data exists.
17. Driver must see only own tenant + own assignments/private records.
18. Every physical event must be auditable with actor/time/GPS/device.

## Recommended Driver RBAC

Default:

```text
driver.dashboard.view
driver.shift.clock_in
driver.shift.clock_out
driver.break.manage
driver.jobs.view_own
driver.jobs.accept
driver.safety.view
driver.safety.complete
driver.defects.create
driver.pickup.execute
driver.items.scan
driver.photos.upload
driver.damage.report
driver.run.execute
driver.status.physical_update
driver.delivery.execute
driver.pod.create
driver.expenses.create
driver.expenses.view_own
driver.messages.use
driver.documents.view_own
driver.documents.upload_own
driver.timesheets.view_own
driver.pay.view_own
driver.payslip.download_own
driver.trailer_swap.request
offline_sync.use
```

Optional elevated permissions:

```text
driver.load_items.modify
driver.trailer_swap.direct
driver.customer_message
driver.owner_operator_load_create
```

## Default Restrictions

A standard Driver must not be able to:

```text
Create arbitrary company Loads
View other Drivers' jobs/pay/documents
Assign Drivers
Manage fleet master records
Manage warehouses/inventory
Change customer pricing
Approve expenses
Approve payroll
Create/approve customer invoices
Mark invoices paid
Change Company Settings
Access Super Admin functions
Manage subscriptions/plans
```

## Implementation Order

```text
Phase 0  — Audit Only
Phase 1  — Authenticated Driver + Tenant/Own-Record Security + RBAC
Phase 2  — One Shared Active Driver Context
Phase 3  — Start Work / Finish Work + Timesheet Unification
Phase 4  — Safety Checklist + Defects + Compliance Blocking
Phase 5  — Assigned Jobs
Phase 6  — Pickup & Loading
Phase 7  — Dispatch & Active Run
Phase 8  — Delivery & POD
Phase 9  — Fuel & Expenses
Phase 10 — Messages
Phase 11 — Documents & Compliance
Phase 12 — Payroll Read-Only Consistency
Phase 13 — Trailer Swap
Phase 14 — Offline Sync + Idempotency + Conflict Handling
Phase 15 — Cross-Portal Integration
Phase 16 — Tests / Regression / Documentation
```

## Required Test Matrix

At minimum verify:

1. Driver sees only own tenant.
2. Driver sees only own assigned jobs.
3. URL manipulation cannot access another Driver's job/pay/documents.
4. Driver identity is consistent on every page.
5. Current Truck/Trailer/Load context is consistent.
6. Start Work creates one real Clock In event.
7. Timesheet uses the same shift events.
8. Geofence rules are enforced.
9. Checklist uses current Driver/Truck/Trailer.
10. Critical fail blocks work/dispatch where policy requires.
11. Defect affects equipment availability where applicable.
12. Compliance blocks incompatible assignment where required.
13. Normal Driver cannot create arbitrary Load.
14. Owner-driver create permission works only when granted.
15. Wrong VIN/item/pickup stop is blocked.
16. Required pickup photos are enforced.
17. Dispatch cannot occur until pickup requirements pass.
18. Driver physical status events update Dispatcher automatically.
19. Wrong delivery item/stop is blocked.
20. POD stores receiver/signature/GPS/time and updates Customer/Accounts flow.
21. Driver can submit but cannot approve expense.
22. Payroll is read-only and consistent with backend payroll run.
23. Trailer Swap validates policy/availability/compatibility/capacity/compliance/location.
24. Trailer Swap updates all shared records and audit history.
25. Offline event preserves original event time/GPS.
26. Offline retries are idempotent.
27. Conflicts do not silently overwrite newer server data.
28. Sync failures/conflicts are visible to Driver.
29. Physical actions have audit history.
30. Existing working Driver screens have no regression.

Never claim tests passed without actually running them.

## Change Log Template

Antigravity must append, not overwrite:

```text
Date:
Phase:
Files Modified:
APIs Added/Changed:
Models/Migrations:
Frontend Changes:
Backend Changes:
RBAC Changes:
Security Scope Changes:
Offline Sync Changes:
Cross-Portal Changes:
Tests:
Result:
Known Limitations:
```
