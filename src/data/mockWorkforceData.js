export const mockWorkers = [
  {
    id: 'DRV-0021',
    name: 'John Doe',
    role: 'Car Carrier Driver',
    category: 'Drivers',
    skills: ['HR'],
    phone: '+61 412 345 676',
    email: 'john.d@example.com',
    certifications: [
      { name: 'First Aid', status: 'valid', detail: 'Valid until 12 Jul 2026' },
      { name: 'Heavy Rigid (HR)', status: 'valid', detail: 'Valid until 03 Sep 2026' },
      { name: 'Working at Heights', status: 'warning', detail: 'Expires in 15 days' }
    ],
    schedule: {
      'Mon 18 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Tue 19 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Wed 20 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Thu 21 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Fri 22 May': { status: 'On Shift', time: '06:00 - 14:00', selected: true },
      'Sat 23 May': { status: 'Available' },
      'Sun 24 May': { status: 'Available' }
    }
  },
  {
    id: 'DRV-0022',
    name: 'Chris Lee',
    role: 'Car Carrier Driver',
    category: 'Drivers',
    skills: ['HR', 'MC'],
    phone: '+61 412 345 677',
    email: 'chris.l@example.com',
    certifications: [
      { name: 'First Aid', status: 'valid', detail: 'Valid until 12 Jul 2026' },
      { name: 'Heavy Rigid (HR)', status: 'valid', detail: 'Valid until 03 Sep 2026' }
    ],
    schedule: {
      'Mon 18 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Tue 19 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Wed 20 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Thu 21 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Fri 22 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Sat 23 May': { status: 'Available' },
      'Sun 24 May': { status: 'Available' }
    }
  },
  {
    id: 'DRV-0023',
    name: 'Daniel Craig',
    role: 'Driver',
    category: 'Drivers',
    skills: ['MC'],
    phone: '+61 412 345 678',
    email: 'daniel.c@example.com',
    certifications: [
      { name: 'Multi-Combination (MC)', status: 'valid', detail: 'Valid until 01 Jan 2027' }
    ],
    schedule: {
      'Mon 18 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Tue 19 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Wed 20 May': { status: 'Leave', detail: 'Personal' },
      'Thu 21 May': { status: 'On Shift', time: '06:00 - 14:00' },
      'Fri 22 May': { status: 'Available' },
      'Sat 23 May': { status: 'Available' },
      'Sun 24 May': { status: 'Unavailable', detail: 'Sick Leave' }
    }
  },
  {
    id: 'DRV-0024',
    name: 'Sarah Connor',
    role: 'Driver',
    category: 'Drivers',
    skills: ['HR'],
    phone: '+61 412 345 679',
    email: 'sarah.c@example.com',
    certifications: [
      { name: 'Heavy Rigid (HR)', status: 'valid', detail: 'Valid until 03 Sep 2026' }
    ],
    schedule: {
      'Mon 18 May': { status: 'Available' },
      'Tue 19 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Wed 20 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Thu 21 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Fri 22 May': { status: 'On Shift', time: '14:00 - 22:00' },
      'Sat 23 May': { status: 'Available' },
      'Sun 24 May': { status: 'Available' }
    }
  }
];

export const mockStats = {
  totalWorkforce: 86,
  availableToday: 38,
  availablePercentage: 44,
  onShift: 31,
  onShiftPercentage: 36,
  onLeave: 5,
  onLeavePercentage: 6,
  absent: 12,
  absentPercentage: 14
};
