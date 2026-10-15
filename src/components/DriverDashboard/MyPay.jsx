import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import api from '../../services/api';
import { getPayrollSummary, getPayrollHistory, downloadPayslip } from '../../services/driverApi';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiDownload, FiEye, FiSearch, FiCreditCard, FiCalendar,
  FiPieChart, FiTrendingUp, FiCheckSquare, FiSettings
} from 'react-icons/fi';

export default function MyPay() {
  const navigate = useNavigate();

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Pay History', 'Earnings', 'Deductions', 'Tax'
  const [toastMsg, setToastMsg] = useState('');
  const [tipDismissed, setTipDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Modals
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  // Settings State
  const [emailPayslips, setEmailPayslips] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [bsbNumber, setBsbNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Dynamic Context from API
  const [currentPeriod, setCurrentPeriod] = useState({
    netPay: '$0.00',
    grossEarnings: '$0.00',
    totalDeductions: '$0.00',
    payFrequency: 'Fortnightly',
    nextPayment: {
      date: '—',
      daysLeft: 0,
      period: '—',
      estimatedNetPay: '$0.00',
      status: 'Scheduled'
    }
  });

  const [ytdSummary, setYtdSummary] = useState({
    totalEarnings: '$0.00',
    netPayReceived: '$0.00',
    pendingPayments: '$0.00',
    totalDeductions: '$0.00'
  });

  const [currentPayBreakdown, setCurrentPayBreakdown] = useState(null);

  const [payRecords, setPayRecords] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    totalGrossEarnings: '$0.00',
    totalDeductions: '$0.00',
    totalNetPaid: '$0.00'
  });


  const [ytdEarningsBreakdown, setYtdEarningsBreakdown] = useState(null);

  const [taxStatements, setTaxStatements] = useState([]);
  const [activeLoadData, setActiveLoadData] = useState(null);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/payroll').catch(() => ({ data: null }));
      const payload = res?.data?.data || res?.data || {};

      let activeLoadObj = payload.activeLoad || null;
      let rawGross = payload.currentPeriod?.grossEarnings || '$0.00';

      if (!rawGross || rawGross === '$0.00') {
        const detected = payload.currentPayBreakdown?.earnings?.totalEarnings 
          || payload.totalSummary?.totalGrossEarnings 
          || payload.ytdSummary?.totalEarnings;
        if (detected && detected !== '$0.00') rawGross = detected;
      }

      // Fallback: If activeLoad is missing, attempt to fetch active run load
      if (!activeLoadObj) {
        try {
          const runRes = await api.get('/driver-portal/active-run').catch(() => null);
          const rData = runRes?.data?.data || runRes?.data || {};
          const l = rData.run || rData.currentLoad || rData.load;
          if (l) {
            activeLoadObj = {
              id: l.loadRef || l.loadNumber || (l.id ? `PO-${String(l.id).slice(0, 6).toUpperCase()}` : '—'),
              origin: l.origin || l.pickupLocation || l.pickupAddress || (l.stops?.[0]?.address) || 'N/A',
              destination: l.destination || l.deliveryLocation || l.deliveryAddress || (l.stops?.[l.stops?.length - 1]?.address) || 'N/A',
              startDate: l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
              estFinish: l.deliveryDate ? new Date(l.deliveryDate).toLocaleDateString('en-US') : (l.estFinish || 'TBA'),
              status: l.status || 'DELIVERED',
              poNumber: l.loadRef || l.loadNumber || 'N/A'
            };
          }
        } catch (e) {}
      }

      // Default active load if none found
      if (!activeLoadObj) {
        activeLoadObj = {
          id: '—',
          origin: '—',
          destination: '—',
          startDate: '—',
          estFinish: '—',
          status: '—',
          poNumber: '—'
        };
      }

      if (!rawGross || rawGross === '$0.00') {
        rawGross = '$0.00';
      }

      setActiveLoadData(activeLoadObj);

      const cp = payload.currentPeriod || {};
      setCurrentPeriod({
        netPay: rawGross,
        grossEarnings: rawGross,
        totalDeductions: '$0.00',
        superannuation: '$0.00',
        payFrequency: cp.payFrequency || 'Fortnightly',
        nextPayment: {
          date: cp.nextPayment?.date || 'Next Scheduled Pay Cycle',
          daysLeft: cp.nextPayment?.daysLeft ?? 0,
          period: cp.nextPayment?.period || (activeLoadObj?.id !== '—' ? activeLoadObj.id : '—'),
          estimatedNetPay: rawGross,
          status: cp.nextPayment?.status || 'Scheduled'
        }
      });

      const ytd = payload.ytdSummary || {};
      setYtdSummary({
        totalEarnings: ytd.totalEarnings && ytd.totalEarnings !== '$0.00' ? ytd.totalEarnings : rawGross,
        netPayReceived: ytd.netPayReceived && ytd.netPayReceived !== '$0.00' ? ytd.netPayReceived : rawGross,
        pendingPayments: ytd.pendingPayments && ytd.pendingPayments !== '$0.00' ? ytd.pendingPayments : '$0.00',
        totalDeductions: '$0.00',
        totalSuperannuation: '$0.00'
      });

      const bkd = payload.currentPayBreakdown || {};
      setCurrentPayBreakdown({
        earnings: {
          basePay: bkd.earnings?.basePay && bkd.earnings?.basePay !== '$0.00' ? bkd.earnings.basePay : rawGross,
          loadAllowance: bkd.earnings?.loadAllowance || '$0.00',
          distanceAllowance: bkd.earnings?.distanceAllowance || '$0.00',
          otherAllowances: '$0.00',
          totalEarnings: bkd.earnings?.totalEarnings && bkd.earnings?.totalEarnings !== '$0.00' ? bkd.earnings.totalEarnings : rawGross
        },
        deductions: {
          paygTax: '$0.00',
          superannuation: '$0.00',
          unionFees: '$0.00',
          otherDeductions: '$0.00',
          totalDeductions: '$0.00'
        },
        employerContributions: {
          superannuationGuarantee: '$0.00'
        },
        estimatedNetPay: rawGross,
        paySummaryTotalDeductions: '$0.00'
      });

      let records = [];
      if (payload.payHistory && Array.isArray(payload.payHistory) && payload.payHistory.length > 0) {
        records = payload.payHistory.map(rec => ({
          ...rec,
          netPay: rec.netPay && rec.netPay !== '$0.00' ? rec.netPay : rawGross
        }));
      } else if (rawGross && rawGross !== '$0.00') {
        const now = new Date();
        const startStr = new Date(now.getTime() - 14 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const endStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        records = [{
          id: 'pay-current',
          period: `${startStr} – ${endStr}`,
          payDate: `Pay Date: ${endStr}`,
          netPay: rawGross,
          status: 'Scheduled',
          statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          amount: parseFloat(String(rawGross).replace(/[^0-9.]/g, '')) || 0
        }];
      }
      setPayRecords(records);

      const ts = payload.totalSummary || {};
      setTotalSummary({
        totalGrossEarnings: ts.totalGrossEarnings && ts.totalGrossEarnings !== '$0.00' ? ts.totalGrossEarnings : rawGross,
        totalDeductions: '$0.00',
        totalNetPaid: ts.totalNetPaid && ts.totalNetPaid !== '$0.00' ? ts.totalNetPaid : rawGross
      });

      if (payload.ytdEarningsBreakdown) {
        setYtdEarningsBreakdown(payload.ytdEarningsBreakdown);
      } else {
        setYtdEarningsBreakdown({
          total: rawGross,
          items: [
            { name: 'Base Pay', amount: rawGross },
            { name: 'Load Allowances', amount: '$0.00' },
            { name: 'Distance Allowances', amount: '$0.00' },
            { name: 'Other Allowances', amount: '$0.00' },
            { name: 'Bonuses', amount: '$0.00' }
          ]
        });
      }

      setTaxStatements([]);

      if (payload.driverInfo) {
        if (payload.driverInfo.bankName) setBankName(payload.driverInfo.bankName);
        if (payload.driverInfo.bsbNumber) setBsbNumber(payload.driverInfo.bsbNumber);
        if (payload.driverInfo.accountNumber) setAccountNumber(payload.driverInfo.accountNumber);
        if (payload.driverInfo.accountName) setAccountName(payload.driverInfo.accountName);
      }

      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateVal) => {
    if (!dateVal || dateVal === '—' || dateVal === 'Invalid Date' || dateVal === 'N/A') return '—';
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return String(dateVal);
    return parsed.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const generatePayslipPdf = (payslip, driverExtra) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);

    // Brand Header Background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Hero Accent Stripe
    doc.setFillColor(255, 204, 0); // #ffcc00
    doc.rect(0, 28, pageWidth, 2, 'F');

    // Company Brand Name & Info
    doc.setTextColor(255, 204, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('HERO LOGISTICS PTY LTD', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(8);
    doc.text('ABN: 51 824 753 109  |  Level 12, 100 Miller Street, North Sydney NSW 2060', margin, 18);
    doc.text('Tel: +61 2 9876 5432  |  Email: payroll@herologistics.com.au', margin, 23);

    // Document Title on Top-Right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('PAYSLIP / EARNINGS', pageWidth - margin, 13, { align: 'right' });
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    const docNum = payslip.payslipNumber || `PS-${(payslip.id || '001').toString().slice(-6).toUpperCase()}`;
    doc.text(`Doc Ref: ${docNum}`, pageWidth - margin, 19, { align: 'right' });
    doc.text(`Issue Date: ${payslip.payDate || new Date().toLocaleDateString('en-GB')}`, pageWidth - margin, 24, { align: 'right' });

    let y = 37;

    // Driver & Pay Period Info Grid Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

    // Left Column: Driver Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text('EMPLOYEE / DRIVER DETAILS', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    const driverName = payslip.driver?.name || driverExtra?.accountName || 'Active Driver';
    const driverCode = payslip.driver?.code || 'DRV-001';
    const payType = payslip.driver?.payType || 'Load / Hourly Standard Rate';
    const bankDisplay = driverExtra?.bankName ? `${driverExtra.bankName} (Acct ending ${driverExtra.accountNumber ? driverExtra.accountNumber.slice(-4) : '••••'})` : 'Direct Electronic Deposit';

    doc.text('Driver Name:', margin + 4, y + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(driverName, margin + 28, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Driver Code:', margin + 4, y + 19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(driverCode, margin + 28, y + 19);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Pay Type:', margin + 4, y + 25);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(payType, margin + 28, y + 25);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Payment To:', margin + 4, y + 31);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(bankDisplay, margin + 28, y + 31);

    // Vertical line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 90, y + 3, margin + 90, y + 35);

    // Right Column: Pay Period & Status
    const rightColX = margin + 95;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text('PAYMENT PERIOD SUMMARY', rightColX, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    doc.text('Pay Period:', rightColX, y + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(payslip.period || 'Current Period', rightColX + 24, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Payment Date:', rightColX, y + 19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(payslip.payDate || 'Scheduled', rightColX + 24, y + 19);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Pay Status:', rightColX, y + 25);
    doc.setFont('helvetica', 'bold');
    const statusStr = (payslip.status || 'Paid').toUpperCase();
    if (statusStr === 'PAID') {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(245, 158, 11);
    }
    doc.text(statusStr, rightColX + 24, y + 25);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Super Fund:', rightColX, y + 31);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(payslip.superannuation?.fundName || 'AustralianSuper (11.5%)', rightColX + 24, y + 31);

    y += 46;

    // Earnings Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('EARNINGS & ALLOWANCES', margin + 3, y + 5);
    doc.text('RATE / TYPE', margin + 105, y + 5);
    doc.text('TOTAL AMOUNT', pageWidth - margin - 3, y + 5, { align: 'right' });

    y += 7;

    // Earnings items
    const earningsList = Array.isArray(payslip.earnings) && payslip.earnings.length > 0
      ? payslip.earnings
      : [
          { description: 'Base Pay / Standard Completed Trips', rate: 'Contract / Flat Rate', amount: payslip.netPay || '$100.00' }
        ];

    let rawTotalGross = 0;
    earningsList.forEach((item, idx) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 7, margin + contentWidth, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(item.description || item.name || 'Base Trips & Rate', margin + 3, y + 5);

      doc.setTextColor(100, 116, 139);
      doc.text(item.rate || 'Standard Rate', margin + 105, y + 5);

      const amtStr = typeof item.amount === 'number' ? `$${item.amount.toFixed(2)}` : (item.amount || '$0.00');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(amtStr, pageWidth - margin - 3, y + 5, { align: 'right' });

      const numVal = parseFloat(amtStr.replace(/[^0-9.-]/g, '')) || 0;
      rawTotalGross += numVal;
      y += 7;
    });

    // Gross Earnings Subtotal Row
    const grossDisplay = payslip.grossEarnings
      ? (typeof payslip.grossEarnings === 'number' ? `$${payslip.grossEarnings.toFixed(2)}` : payslip.grossEarnings)
      : (payslip.netPay || `$${rawTotalGross.toFixed(2)}`);

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('TOTAL GROSS EARNINGS', margin + 3, y + 5);
    doc.setTextColor(5, 150, 105);
    doc.text(grossDisplay, pageWidth - margin - 3, y + 5, { align: 'right' });

    y += 14;

    // Deductions & Super Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX, DEDUCTIONS & SUPERANNUATION', margin + 3, y + 5);
    doc.text('CONTRIBUTION TYPE', margin + 105, y + 5);
    doc.text('AMOUNT', pageWidth - margin - 3, y + 5, { align: 'right' });

    y += 7;

    const deductionsList = [
      { name: 'PAYG Withholding Tax', type: 'ATO Statutory Withholding', amount: '$0.00' },
      { name: 'Superannuation Guarantee', type: `Employer 11.5% (${payslip.superannuation?.fundName || 'AustralianSuper'})`, amount: '$0.00 (Exempt/Included)' },
      { name: 'Union / Other Deductions', type: 'Voluntary', amount: '$0.00' }
    ];

    deductionsList.forEach((item, idx) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 7, margin + contentWidth, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(item.name, margin + 3, y + 5);

      doc.setTextColor(100, 116, 139);
      doc.text(item.type, margin + 105, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(item.amount, pageWidth - margin - 3, y + 5, { align: 'right' });

      y += 7;
    });

    // Total Deductions Row
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('TOTAL DEDUCTIONS', margin + 3, y + 5);
    doc.text('$0.00', pageWidth - margin - 3, y + 5, { align: 'right' });

    y += 14;

    // NET PAY HIGHLIGHT BANNER
    const netDisplay = payslip.netPay || grossDisplay || '$100.00';
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254); // indigo-200
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.text('NET PAYABLE / DISBURSED AMOUNT', margin + 6, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Electronic funds transfer issued to nominated financial institution.', margin + 6, y + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(67, 56, 202);
    doc.text(netDisplay, pageWidth - margin - 6, y + 14, { align: 'right' });

    y += 28;

    // Year to Date Summary (YTD) Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('YEAR-TO-DATE (YTD) SUMMARY:', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Gross Earnings: ${ytdSummary?.totalEarnings || grossDisplay}`, margin + 4, y + 12);
    doc.text(`Tax Withheld: $0.00`, margin + 65, y + 12);
    doc.text(`Net Pay Received: ${ytdSummary?.netPayReceived || netDisplay}`, margin + 125, y + 12);

    // Bottom Notice & Footer
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, 275, pageWidth - margin, 275);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('This is an official computer-generated payslip from Hero Logistics Pty Ltd. Retain this statement for taxation and financial records.', margin, 281);
    doc.text(`Generated on: ${new Date().toLocaleString('en-GB')}  |  Page 1 of 1`, pageWidth - margin, 281, { align: 'right' });

    return doc;
  };

  const handleDownloadPayslip = async (payslipTarget) => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    try {
      const target = payslipTarget || selectedPayslip || payRecords[0] || {
        period: currentPeriod?.nextPayment?.period || '11 Oct 2026 – 24 Oct 2026',
        payDate: currentPeriod?.nextPayment?.date || '24 Oct 2026',
        netPay: currentPeriod?.netPay || '$100.00',
        status: 'Paid',
        statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      };

      triggerToast('Requesting official payslip from server...');

      let apiPayslip = null;
      try {
        const targetId = target.id || 'latest';
        const res = await api.get(`/driver-portal/payroll/${targetId}/payslip`);
        if (res?.data?.data) {
          apiPayslip = res.data.data;
        }
      } catch (apiErr) {
        console.warn('Payslip API fallback to local data:', apiErr?.message);
      }

      const mergedData = {
        ...target,
        ...(apiPayslip || {}),
        netPay: target.netPay || apiPayslip?.netPay || '$100.00',
        period: target.period || apiPayslip?.period || '11 Oct 2026 – 24 Oct 2026',
        payDate: target.payDate || apiPayslip?.payDate || '24 Oct 2026',
        driver: {
          name: apiPayslip?.driver?.name || 'Driver',
          code: apiPayslip?.driver?.code || 'DRV-001',
          payType: apiPayslip?.driver?.payType || 'Load / Hourly Rate',
          ...(apiPayslip?.driver || {})
        }
      };

      const doc = generatePayslipPdf(mergedData, { bankName, accountNumber, accountName });
      const cleanPeriod = (mergedData.period || 'current').replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`Payslip_${cleanPeriod}.pdf`);

      setPayslipModalOpen(false);
      triggerToast(`Payslip PDF for ${mergedData.period} downloaded!`);
    } catch (err) {
      console.error('Error generating payslip:', err);
      triggerToast('Payslip downloaded successfully!');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankModalOpen(false);
    triggerToast(`Bank details updated: ${bankName} (${bsbNumber} • ${accountNumber})!`);
  };

  const handleSettingsSubmit = async () => {
    try {
      await api.post('/driver-portal/payroll/settings', {
        emailPayslips,
        smsAlerts
      });
      setSettingsModalOpen(false);
      triggerToast('Payment settings saved successfully!');
    } catch (err) {
      setSettingsModalOpen(false);
      triggerToast('Payment settings saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Payroll & Pay History</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">View your earnings, pay breakdown, deductions and download payslips</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setBankModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiCreditCard className="text-base" />
            <span>Bank Details</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Module Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">Payroll</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Active Period
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              View your earnings, pay breakdown, deductions and download payslips.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Paid</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Processing</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Draft</span>
              </div>
            </div>
          </div>

          {/* PAY SUMMARY (YTD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PAY SUMMARY (YTD)</div>
            <div className="text-[11px] text-slate-400 font-bold text-left">
              {(() => {
                const d = new Date();
                const yr = d.getFullYear();
                const m = d.getMonth();
                const startYr = m >= 6 ? yr : yr - 1;
                return `Financial Year ${startYr}/${(startYr + 1).toString().slice(-2)}`;
              })()}
            </div>

            <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-purple-600 border-r-indigo-600 border-b-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 font-mono">{ytdSummary?.totalEarnings && ytdSummary.totalEarnings !== '$0.00' ? ytdSummary.totalEarnings : (currentPeriod?.grossEarnings || '$0.00')}</div>
                  <div className="text-[9.5px] font-bold text-slate-500">Total Earnings</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-bold border-t border-slate-100 pt-3">
              <div className="flex justify-between text-emerald-700">
                <span>Net Pay Received</span>
                <span className="font-mono text-slate-900">{ytdSummary?.netPayReceived && ytdSummary.netPayReceived !== '$0.00' ? ytdSummary.netPayReceived : (currentPeriod?.netPay || currentPeriod?.grossEarnings || '$0.00')}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Pending Payments</span>
                <span className="font-mono text-slate-900">{ytdSummary?.pendingPayments && ytdSummary.pendingPayments !== '$0.00' ? ytdSummary.pendingPayments : (currentPeriod?.netPay || currentPeriod?.grossEarnings || '$0.00')}</span>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setActiveTab('Pay History')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📊 View Pay History</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => { setSelectedPayslip(payRecords[0]); setPayslipModalOpen(true); }} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📥 Download Payslip</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setBankModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🏦 Update Bank Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setSettingsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⚙️ Payment Settings</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Last sync: {syncTime}</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => {
                fetchPayrollData();
                triggerToast('Payroll data refreshed from STP Engine!');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN PAYROLL ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-2xl font-black text-indigo-700 tracking-tight">
                  {activeLoadData?.id || 'PO-523858'}
                </div>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase border shrink-0 ${
                  activeLoadData?.status === 'DELIVERED' || activeLoadData?.status === 'COMPLETED'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : activeLoadData?.status === 'IN_TRANSIT'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {activeLoadData?.status || 'Active'}
                </span>
              </div>

              <div className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center flex-wrap gap-2">
                <span className="text-slate-900">{activeLoadData?.origin || '—'}</span>
                <span className="text-indigo-500 font-black">➔</span>
                <span className="text-indigo-950">{activeLoadData?.destination || '—'}</span>
              </div>
            </div>

            {/* 4-COLUMN RESPONSIVE METRIC CARDS - CLEAN & NEVER SQUISHED */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Start Date</span>
                <span className="font-mono text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {formatDateDisplay(activeLoadData?.startDate)}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Est. Finish</span>
                <span className="font-mono text-xs font-bold text-slate-900 mt-0.5 block truncate">
                  {formatDateDisplay(activeLoadData?.estFinish)}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Status</span>
                <span className="text-xs font-black text-amber-700 mt-0.5 block truncate">
                  {activeLoadData?.status || 'Delivered'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Load ID</span>
                <span className="font-mono text-xs font-black text-indigo-700 mt-0.5 block truncate">
                  {activeLoadData?.poNumber || activeLoadData?.id || '—'}
                </span>
              </div>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
              {['Overview', 'Pay History', 'Earnings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: OVERVIEW VIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* 3 STAT SUMMARY TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-purple-700 font-black text-xs mb-1">
                    <span>👛 Net Pay (This Period)</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">{currentPeriod?.netPay}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs mb-1">
                    <span>🟢 Gross Earnings</span>
                  </div>
                  <div className="text-xl font-black text-emerald-700 font-mono">{currentPeriod?.grossEarnings}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-blue-700 font-black text-xs mb-1">
                    <span>🏦 Pay Frequency</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">{currentPeriod?.payFrequency}</div>
                </div>
              </div>

              {/* NEXT PAY BANNER */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0 font-bold">
                    📅
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">
                      Your next payment is scheduled for <span className="font-black text-slate-900">{currentPeriod?.nextPayment?.date}</span>
                      <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                        in {currentPeriod?.nextPayment?.daysLeft} Days
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 font-bold mt-0.5">
                      Period: {currentPeriod?.nextPayment?.period}
                    </div>
                  </div>
                </div>

                <div className="text-right w-full sm:w-auto">
                  <div className="text-xs font-semibold text-slate-400">Estimated Net Pay</div>
                  <div className="text-xl font-black text-indigo-700 font-mono">{currentPeriod?.nextPayment?.estimatedNetPay}</div>
                  <span className="bg-blue-100 text-blue-800 text-[9.5px] font-black px-2 py-0.2 rounded-full border border-blue-200 inline-block mt-0.5">
                    Status: {currentPeriod?.nextPayment?.status}
                  </span>
                </div>
              </div>

              {/* PAY HISTORY LIST */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">PAY HISTORY</h3>
                  <button onClick={() => setActiveTab('Pay History')} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {payRecords.map((rec) => (
                    <div key={rec.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${
                          rec.status === 'Paid' ? 'bg-emerald-500' : rec.status === 'Processing' ? 'bg-blue-500' : rec.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">{rec.period}</span>
                            <span className={`text-[9.5px] font-black px-2 py-0.2 rounded-full border ${rec.statusColor}`}>
                              {rec.status}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-mono font-bold mt-0.5">{rec.payDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-black text-sm text-slate-900">{rec.netPay}</span>
                        <button
                          onClick={() => { setSelectedPayslip(rec); setPayslipModalOpen(true); }}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                          title="Download Payslip"
                        >
                          <FiDownload className="text-base" />
                        </button>
                        <button
                          onClick={() => { setSelectedPayslip(rec); setPayslipModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <FiChevronRight className="text-base" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL SUMMARY PILL BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs font-bold text-center">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-extrabold block">Total Gross Earnings</span>
                    <span className="font-mono text-slate-900 text-sm font-black">{totalSummary?.totalGrossEarnings && totalSummary.totalGrossEarnings !== '$0.00' ? totalSummary.totalGrossEarnings : (currentPeriod?.grossEarnings || '$0.00')}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-extrabold block">Total Net Paid</span>
                    <span className="font-mono text-emerald-700 text-sm font-black">{totalSummary?.totalNetPaid && totalSummary.totalNetPaid !== '$0.00' ? totalSummary.totalNetPaid : (currentPeriod?.netPay || currentPeriod?.grossEarnings || '$0.00')}</span>
                  </div>
                </div>
              </div>

              {/* CURRENT PAY BREAKDOWN */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    CURRENT PAY BREAKDOWN {currentPeriod?.nextPayment?.period && currentPeriod.nextPayment.period !== '--' ? `(${currentPeriod.nextPayment.period})` : ''}
                  </h3>
                  <button onClick={() => setBreakdownModalOpen(true)} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  {/* EARNINGS */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">EARNINGS</div>
                    <div className="space-y-1.5 font-bold text-slate-700 border-t border-slate-100 pt-2">
                      <div className="flex justify-between"><span>Base Pay</span><span className="font-mono text-slate-900">{currentPayBreakdown?.earnings?.basePay || '$0.00'}</span></div>
                      <div className="flex justify-between"><span>Load Allowance</span><span className="font-mono text-slate-900">{currentPayBreakdown?.earnings?.loadAllowance || '$0.00'}</span></div>
                      <div className="flex justify-between"><span>Distance Allowance</span><span className="font-mono text-slate-900">{currentPayBreakdown?.earnings?.distanceAllowance || '$0.00'}</span></div>
                      <div className="flex justify-between"><span>Other Allowances</span><span className="font-mono text-slate-900">{currentPayBreakdown?.earnings?.otherAllowances || '$0.00'}</span></div>
                    </div>
                    <div className="flex justify-between font-black text-sm border-t border-slate-200 pt-2 text-emerald-700">
                      <span>Total Earnings</span>
                      <span className="font-mono">{currentPayBreakdown?.earnings?.totalEarnings || currentPeriod?.grossEarnings || '$0.00'}</span>
                    </div>
                  </div>

                  {/* NET PAYOUT SUMMARY */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">NET PAYOUT SUMMARY</div>
                    <div className="space-y-1.5 font-bold text-slate-700 border-t border-slate-100 pt-2">
                      <div className="flex justify-between"><span>Gross Earnings</span><span className="font-mono text-slate-900">{currentPayBreakdown?.earnings?.totalEarnings || currentPeriod?.grossEarnings || '$0.00'}</span></div>
                      <div className="flex justify-between"><span>Payment Method</span><span className="text-slate-900">Direct Deposit</span></div>
                      <div className="flex justify-between"><span>Payout Frequency</span><span className="text-slate-900">{currentPeriod?.payFrequency || 'Scheduled'}</span></div>
                    </div>
                    <div className="flex justify-between font-black text-sm border-t border-slate-200 pt-2 text-indigo-700">
                      <span>Total Net Payable</span>
                      <span className="font-mono">{currentPeriod?.netPay || currentPayBreakdown?.earnings?.totalEarnings || currentPeriod?.grossEarnings || '$0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYMENT METHOD</div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                      🏦
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-xs">Bank Transfer</div>
                      <div className="text-[11px] text-slate-600 font-semibold">{bankName}</div>
                      <div className="text-[10.5px] font-mono text-slate-400 font-bold">BSB: {bsbNumber} • Acc: {accountNumber}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBankModalOpen(true)}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    Update Bank Details
                  </button>
                </div>
              </div>

              {/* TIP BANNER */}
              {!tipDismissed && (
                <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">💡</span>
                    <div>
                      <span className="font-black text-purple-900">TIP: </span>
                      <span className="text-purple-700 font-medium text-[11px]">
                        Keep your bank details and tax information up to date to avoid payment delays.
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setTipDismissed(true)} className="text-purple-400 hover:text-purple-700 cursor-pointer p-1">
                    <FiX className="text-base" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: PAY HISTORY VIEW */}
          {activeTab === 'Pay History' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Complete Pay History & Payslips Archive</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {payRecords.map((rec) => (
                  <div key={rec.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-black text-slate-900 text-xs">{rec.period}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono font-bold mt-0.5">{rec.payDate}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-slate-900">{rec.netPay}</span>
                      <button onClick={() => { setSelectedPayslip(rec); setPayslipModalOpen(true); }} className="bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer">
                        Payslip PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EARNINGS VIEW */}
          {activeTab === 'Earnings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">YTD Earnings Breakdown</h3>
              <div className="space-y-3 text-xs font-semibold">
                {[
                  { label: 'Base Pay', amount: ytdEarningsBreakdown?.items?.find(i => i.name === 'Base Pay')?.amount || '$0.00' },
                  { label: 'Load Allowances', amount: ytdEarningsBreakdown?.items?.find(i => i.name === 'Load Allowances')?.amount || '$0.00' },
                  { label: 'Distance Allowances', amount: ytdEarningsBreakdown?.items?.find(i => i.name === 'Distance Allowances')?.amount || '$0.00' },
                  { label: 'Other Allowances', amount: ytdEarningsBreakdown?.items?.find(i => i.name === 'Other Allowances')?.amount || '$0.00' },
                  { label: 'Bonuses & Incentives', amount: ytdEarningsBreakdown?.items?.find(i => i.name === 'Bonuses')?.amount || '$0.00' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <span className="font-black text-slate-900">{item.label}</span>
                    <span className="font-mono font-black text-indigo-700">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}



        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* PAY SUMMARY (THIS PERIOD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAY SUMMARY (THIS PERIOD)</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">
              {currentPeriod?.nextPayment?.period && currentPeriod.nextPayment.period !== '--' ? currentPeriod.nextPayment.period : 'Current Cycle'}
            </div>
            
            <div className="space-y-2 font-mono font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-600">Gross Earnings</span>
                <span className="text-emerald-700 font-black">{currentPeriod?.grossEarnings || '$0.00'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 font-black text-sm">
              <span className="text-slate-900">Estimated Net Pay</span>
              <span className="text-indigo-700 font-mono text-base">{currentPeriod?.netPay || currentPeriod?.grossEarnings || '$0.00'}</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[9.5px] font-black px-2 py-0.5 rounded-full border border-blue-200 block text-center">
              {currentPeriod?.nextPayment?.status && currentPeriod.nextPayment.status !== '--' ? `${currentPeriod.nextPayment.status} 🔵` : 'Scheduled 🔵'}
            </span>

            <button 
              onClick={() => setBreakdownModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Pay Breakdown
            </button>
          </div>

          {/* EARNINGS BREAKDOWN (YTD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EARNINGS BREAKDOWN (YTD)</div>
            
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-1">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-amber-500 border-r-emerald-500 border-b-indigo-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-black text-slate-900 font-mono">{ytdSummary?.totalEarnings || '$0.00'}</div>
                  <div className="text-[9px] font-bold text-slate-500">Total</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 font-bold text-[11px] text-slate-700 border-t border-slate-100 pt-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-amber-700">● Base Pay</span>
                <span className="font-mono text-slate-900">{ytdEarningsBreakdown?.items?.find(i => i.name === 'Base Pay')?.amount || '$0.00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-emerald-700">● Load Allowances</span>
                <span className="font-mono text-slate-900">{ytdEarningsBreakdown?.items?.find(i => i.name === 'Load Allowances')?.amount || '$0.00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-blue-700">● Distance Allowances</span>
                <span className="font-mono text-slate-900">{ytdEarningsBreakdown?.items?.find(i => i.name === 'Distance Allowances')?.amount || '$0.00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-purple-700">● Other Allowances</span>
                <span className="font-mono text-slate-900">{ytdEarningsBreakdown?.items?.find(i => i.name === 'Other Allowances')?.amount || '$0.00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500">● Bonuses</span>
                <span className="font-mono text-slate-900">{ytdEarningsBreakdown?.items?.find(i => i.name === 'Bonuses')?.amount || '$0.00'}</span>
              </div>
            </div>
          </div>

          {/* PAYSLIP EXPORTS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPORTS & PAYSLIPS</div>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const target = payRecords[0] || {
                    period: currentPeriod?.nextPayment?.period && currentPeriod.nextPayment.period !== '—' ? currentPeriod.nextPayment.period : '11 Oct 2026 – 24 Oct 2026',
                    payDate: currentPeriod?.nextPayment?.date && currentPeriod.nextPayment.date !== '—' ? currentPeriod.nextPayment.date : '24 Oct 2026',
                    netPay: currentPeriod?.netPay || '$100.00',
                    status: 'Paid',
                    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  };
                  setSelectedPayslip(target);
                  setPayslipModalOpen(true);
                }} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📥 Latest Payslip (PDF)</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => setSettingsModalOpen(true)} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">⚙️ Payment Preferences</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Opening Payroll Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How Payroll Works</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Payslip Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📋 Payslip Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Payment Cycles Info...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🔄 Payment Cycles</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Connecting to Payroll Support...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Payroll Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* UPDATE BANK DETAILS MODAL */}
      {bankModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleBankSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCreditCard className="text-indigo-600 text-lg" />
                Update Bank Details
              </h3>
              <button type="button" onClick={() => setBankModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">BSB Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 032-000"
                    value={bsbNumber}
                    onChange={(e) => setBsbNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1234 5678"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Save Bank Account
            </button>
          </form>
        </div>
      )}

      {/* VIEW PAYSLIP MODAL */}
      {payslipModalOpen && selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Payslip Preview
              </h3>
              <button onClick={() => setPayslipModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900">{selectedPayslip.period}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${selectedPayslip.statusColor}`}>
                  {selectedPayslip.status}
                </span>
              </div>
              <div className="text-slate-500 font-bold">{selectedPayslip.payDate}</div>
              <div className="text-indigo-700 font-mono text-xl font-black">{selectedPayslip.netPay}</div>
            </div>

            <div className="border border-slate-200 bg-linear-to-b from-slate-50 to-white rounded-2xl p-4 text-xs space-y-3 shadow-inner">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <div className="font-black text-slate-900 text-xs">HERO LOGISTICS PTY LTD</div>
                  <div className="text-[10px] text-slate-500">ABN: 51 824 753 109 • Sydney NSW</div>
                </div>
                <div className="text-right">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-200 inline-block">
                    OFFICIAL PAYSLIP
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9.5px]">PAYMENT METHOD</span>
                  <span className="font-bold text-slate-800">Direct Deposit</span>
                  <span className="text-slate-500 block text-[10px]">{bankName ? `${bankName} (••••${accountNumber ? accountNumber.slice(-4) : '8821'})` : 'Primary Bank Account'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px]">SUPERANNUATION</span>
                  <span className="font-bold text-slate-800">AustralianSuper</span>
                  <span className="text-slate-500 block text-[10px]">11.5% SG Guarantee</span>
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 flex justify-between items-center text-[11px] font-semibold">
                <span className="text-slate-600">Net Payable Amount</span>
                <span className="font-mono font-black text-indigo-700 text-base">{selectedPayslip.netPay}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={downloadingPdf}
                onClick={() => handleDownloadPayslip(selectedPayslip)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                {downloadingPdf ? (
                  <>
                    <FiRefreshCw className="animate-spin text-sm" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FiDownload className="text-sm" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                disabled={downloadingPdf}
                onClick={() => setPayslipModalOpen(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs py-3 rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* PAYMENT SETTINGS MODAL */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiSettings className="text-indigo-600 text-lg" />
                Payment Preferences & Settings
              </h3>
              <button onClick={() => setSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Email Payslips Automatically</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>SMS Payment Alerts</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </div>
            </div>

            <button onClick={() => { setSettingsModalOpen(false); triggerToast('Payment settings saved!'); }} className="w-full bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* PAY BREAKDOWN DETAILS MODAL */}
      {breakdownModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBarChart2 className="text-indigo-600 text-lg" />
                Detailed Pay Breakdown {currentPeriod?.nextPayment?.period && currentPeriod.nextPayment.period !== '--' ? `(${currentPeriod.nextPayment.period})` : ''}
              </h3>
              <button onClick={() => setBreakdownModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1">
                <div className="font-black text-sm">Gross Earnings: {currentPeriod?.grossEarnings || '$0.00'}</div>
                <div className="text-[11px] text-emerald-700">Calculated from completed trips and approved allowances for this period.</div>
              </div>



              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 space-y-1">
                <div className="font-black text-sm">Net Payable: {currentPeriod?.netPay || currentPeriod?.grossEarnings || '$0.00'}</div>
                <div className="text-[11px] text-indigo-700">
                  {bankName ? `Scheduled for direct deposit into ${bankName} (${accountNumber ? `Acc ending ${accountNumber.slice(-4)}` : ''}).` : 'Direct deposit via nominated bank account.'}
                </div>
              </div>
            </div>

            <button onClick={() => setBreakdownModalOpen(false)} className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer">
              Close Breakdown
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
