const prisma = require('../utils/prismaClient');

// Get all TransferEventLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.transferEventLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching TransferEventLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single TransferEventLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.transferEventLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'TransferEventLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching TransferEventLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new TransferEventLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.transferEventLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating TransferEventLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update TransferEventLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.transferEventLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating TransferEventLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TransferEventLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete TransferEventLog
exports.delete = async (req, res) => {
  try {
    await prisma.transferEventLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'TransferEventLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting TransferEventLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TransferEventLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
