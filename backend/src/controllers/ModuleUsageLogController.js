const prisma = require('../utils/prismaClient');

// Get all ModuleUsageLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.moduleUsageLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ModuleUsageLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ModuleUsageLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.moduleUsageLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ModuleUsageLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ModuleUsageLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ModuleUsageLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.moduleUsageLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ModuleUsageLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ModuleUsageLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.moduleUsageLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ModuleUsageLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ModuleUsageLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ModuleUsageLog
exports.delete = async (req, res) => {
  try {
    await prisma.moduleUsageLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ModuleUsageLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting ModuleUsageLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ModuleUsageLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
