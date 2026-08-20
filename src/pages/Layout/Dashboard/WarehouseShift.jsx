import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export default function WarehouseShift() {
  const [toastMessage, setToastMessage] = useState('');
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);

  useEffect(() => {
    const checkShiftStatus = async () => {
      try {
        const res = await api.get('/warehouse-portal/shift/current');
        if (res.data?.success && res.data?.data) {
          const shiftData = res.data.data;
          const isShiftActive = shiftData.clockedIn === true || shiftData.status === 'ACTIVE';
          setClockedIn(isShiftActive);
          setClockInTime(shiftData.clockInTime || shiftData.clockIn || null);
        } else {
          setClockedIn(false);
          setClockInTime(null);
        }
      } catch (err) {
        console.error('Failed to fetch shift status:', err);
      }
    };
    checkShiftStatus();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleClockIn = async () => {
    try {
      const res = await api.post('/warehouse-portal/shift/clock-in');
      if (res.data?.success) {
        setClockedIn(true);
        const shiftData = res.data.data;
        setClockInTime(shiftData?.clockIn || shiftData?.clockInTime || shiftData?.timesheet?.clockInAt || new Date().toISOString());
        showToast('✅ Clocked In Successfully');
      }
    } catch (err) {
      showToast('❌ Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await api.post('/warehouse-portal/shift/clock-out');
      if (res.data?.success) {
        setClockedIn(false);
        setClockInTime(null);
        showToast('✅ Clocked Out Successfully');
      }
    } catch (err) {
      showToast('❌ Failed to clock out');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-yellow-400 text-black font-bold px-4 py-2 rounded shadow-lg flex items-center gap-2">
          <FiCheckCircle />
          <span>{toastMessage}</span>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">My Shift</h1>
        <p className="text-slate-500 text-sm">Manage your warehouse shift times and status.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-full ${clockedIn ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <FiClock size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {clockedIn ? 'Currently On Shift' : 'Off Duty'}
            </h2>
            {clockInTime && clockedIn && (
              <p className="text-sm text-slate-500">Clocked in at {new Date(clockInTime).toLocaleTimeString()}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            disabled={clockedIn}
            onClick={handleClockIn}
            className={`flex-1 py-3 font-bold rounded-xl ${clockedIn ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            Clock In
          </button>
          
          <button 
            disabled={!clockedIn}
            onClick={handleClockOut}
            className={`flex-1 py-3 font-bold rounded-xl ${!clockedIn ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
          >
            Clock Out
          </button>
        </div>
      </div>
    </div>
  );
}
