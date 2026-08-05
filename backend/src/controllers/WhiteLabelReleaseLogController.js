const prisma = require('../utils/prismaClient');

// Get all WhiteLabelReleaseLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.whiteLabelReleaseLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching WhiteLabelReleaseLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single WhiteLabelReleaseLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.whiteLabelReleaseLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'WhiteLabelReleaseLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching WhiteLabelReleaseLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new WhiteLabelReleaseLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.whiteLabelReleaseLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating WhiteLabelReleaseLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update WhiteLabelReleaseLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.whiteLabelReleaseLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating WhiteLabelReleaseLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WhiteLabelReleaseLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete WhiteLabelReleaseLog
exports.delete = async (req, res) => {
  try {
    await prisma.whiteLabelReleaseLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'WhiteLabelReleaseLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting WhiteLabelReleaseLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WhiteLabelReleaseLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
