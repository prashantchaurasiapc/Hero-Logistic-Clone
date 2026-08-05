const prisma = require('../utils/prismaClient');

// Get all AiActivityLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.aiActivityLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching AiActivityLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single AiActivityLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.aiActivityLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'AiActivityLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching AiActivityLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new AiActivityLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.aiActivityLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating AiActivityLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update AiActivityLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.aiActivityLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating AiActivityLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AiActivityLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete AiActivityLog
exports.delete = async (req, res) => {
  try {
    await prisma.aiActivityLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'AiActivityLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting AiActivityLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AiActivityLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
