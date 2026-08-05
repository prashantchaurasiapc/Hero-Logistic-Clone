const prisma = require('../utils/prismaClient');

// Get all TelemetryLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.telemetryLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching TelemetryLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single TelemetryLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.telemetryLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'TelemetryLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching TelemetryLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new TelemetryLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.telemetryLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating TelemetryLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update TelemetryLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.telemetryLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating TelemetryLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TelemetryLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete TelemetryLog
exports.delete = async (req, res) => {
  try {
    await prisma.telemetryLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'TelemetryLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting TelemetryLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TelemetryLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
