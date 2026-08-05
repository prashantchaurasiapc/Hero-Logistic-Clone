const prisma = require('../utils/prismaClient');

// Get all ApiUsageLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.apiUsageLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ApiUsageLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ApiUsageLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.apiUsageLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ApiUsageLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ApiUsageLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ApiUsageLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.apiUsageLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ApiUsageLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ApiUsageLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.apiUsageLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ApiUsageLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ApiUsageLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ApiUsageLog
exports.delete = async (req, res) => {
  try {
    await prisma.apiUsageLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ApiUsageLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting ApiUsageLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ApiUsageLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
