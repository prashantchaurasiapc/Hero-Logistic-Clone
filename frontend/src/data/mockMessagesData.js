export const mockConversationsData = [
  {
    id: "conv-1",
    name: "John Doe",
    type: "individual",
    status: "In Transit",
    statusColor: "emerald",
    loadId: "LD-10563",
    time: "10:24 AM",
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'John Doe', text: "Hi John, just confirming pickup is complete and I'm on the way.", time: "08:45 AM", type: 'incoming', dateGroup: 'Today' },
      { id: 'm2', senderId: 'me', text: "Hi John, thanks for the update. Please make sure to follow the planned route and take breaks as per regulations.", time: "08:47 AM", type: 'outgoing', status: 'read', dateGroup: 'Today' },
      { id: 'm3', senderId: 'John Doe', text: "Will do. Current ETA to delivery is 3:15 PM.", time: "08:49 AM", type: 'incoming', dateGroup: 'Today' },
      { id: 'm4', senderId: 'me', text: "Great. Let me know if there are any delays.", time: "08:50 AM", type: 'outgoing', status: 'read', dateGroup: 'Today' },
      { id: 'm5', senderId: 'John Doe', text: "Traffic is heavy after Geelong. ETA might be pushed back by 30 mins.", time: "10:18 AM", type: 'incoming', isUnread: true, dateGroup: 'Today' },
      { id: 'm6', senderId: 'John Doe', text: "ETA updated. See new time.", time: "10:24 AM", type: 'incoming', isUnread: true, dateGroup: 'Today' }
    ],
    driverInfo: {
      mobile: "+61 412 345 676",
      email: "john.doe@example.com",
      empId: "DRV-0021",
      license: "MC, HR"
    },
    currentLoad: {
      id: "LD-10563",
      status: "In Transit",
      statusColor: "emerald",
      route: "Melbourne → Geelong",
      reqDate: "22 May 2026, 10:00 PM",
      vehicle: "MAN TGX 26.580 / TR-01",
      progress: "3/5 Stops"
    }
  },
  {
    id: "conv-2",
    name: "Chris Lee",
    type: "individual",
    status: "En Route",
    statusColor: "blue",
    loadId: "LD-10578",
    time: "09:45 AM",
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'Chris Lee', text: "Can you confirm the delivery address?", time: "09:45 AM", type: 'incoming', isUnread: true, dateGroup: 'Today' }
    ],
    driverInfo: {
      mobile: "+61 412 345 677",
      email: "chris.lee@example.com",
      empId: "DRV-0022",
      license: "HR"
    },
    currentLoad: {
      id: "LD-10578",
      status: "En Route",
      statusColor: "blue",
      route: "Sydney → Newcastle",
      reqDate: "22 May 2026, 06:00 PM",
      vehicle: "Volvo FH16 / TR-02",
      progress: "2/4 Stops"
    }
  },
  {
    id: "conv-3",
    name: "Yard Team - Melbourne",
    type: "group",
    memberCount: 8,
    status: "Group • 8 members",
    statusColor: "slate",
    loadId: "",
    time: "09:15 AM",
    unreadCount: 3,
    messages: [
      { id: 'm1', senderId: 'Yard Team', text: "New vehicles arrived at yard.", time: "09:15 AM", type: 'incoming', isUnread: true, dateGroup: 'Today' }
    ]
  },
  {
    id: "conv-4",
    name: "Daniel Craig",
    type: "individual",
    status: "At Pickup",
    statusColor: "orange",
    loadId: "LD-10576",
    time: "08:51 AM",
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'Daniel Craig', text: "Waiting for customer to be ready.", time: "08:51 AM", type: 'incoming', dateGroup: 'Today' }
    ],
    driverInfo: {
      mobile: "+61 412 345 678",
      email: "daniel.c@example.com",
      empId: "DRV-0023",
      license: "MC"
    },
    currentLoad: {
      id: "LD-10576",
      status: "At Pickup",
      statusColor: "orange",
      route: "Brisbane → Gold Coast",
      reqDate: "22 May 2026, 02:00 PM",
      vehicle: "Kenworth K200 / TR-03",
      progress: "1/2 Stops"
    }
  },
  {
    id: "conv-5",
    name: "Michael Tan",
    type: "individual",
    status: "En Route",
    statusColor: "blue",
    loadId: "LD-10581",
    time: "08:30 AM",
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'Michael Tan', text: "Loaded and heading to Sydney.", time: "08:30 AM", type: 'incoming', dateGroup: 'Today' }
    ],
    driverInfo: {
      mobile: "+61 412 345 679",
      email: "michael.t@example.com",
      empId: "DRV-0024",
      license: "HR"
    },
    currentLoad: {
      id: "LD-10581",
      status: "En Route",
      statusColor: "blue",
      route: "Melbourne → Sydney",
      reqDate: "23 May 2026, 08:00 AM",
      vehicle: "Scania R620 / TR-04",
      progress: "1/5 Stops"
    }
  },
  {
    id: "conv-6",
    name: "Sarah Connor",
    type: "individual",
    status: "At Delivery",
    statusColor: "purple",
    loadId: "LD-10577",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'Sarah Connor', text: "Delivery completed. POD uploaded.", time: "Yesterday", type: 'incoming', dateGroup: 'Yesterday' }
    ],
    driverInfo: {
      mobile: "+61 412 345 680",
      email: "sarah.c@example.com",
      empId: "DRV-0025",
      license: "HR"
    },
    currentLoad: null
  },
  {
    id: "conv-7",
    name: "Maintenance Team",
    type: "group",
    memberCount: 5,
    status: "Group • 5 members",
    statusColor: "slate",
    loadId: "",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'Maintenance', text: "Trailer TR-02 service completed.", time: "Yesterday", type: 'incoming', dateGroup: 'Yesterday' }
    ]
  },
  {
    id: "conv-8",
    name: "David Brown",
    type: "individual",
    status: "Delayed",
    statusColor: "rose",
    loadId: "LD-10579",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'David Brown', text: "Traffic incident on route.", time: "Yesterday", type: 'incoming', dateGroup: 'Yesterday' }
    ],
    driverInfo: {
      mobile: "+61 412 345 681",
      email: "david.b@example.com",
      empId: "DRV-0026",
      license: "MC, HR"
    },
    currentLoad: null
  }
];
