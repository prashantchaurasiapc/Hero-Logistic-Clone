const prisma = require('../utils/prismaClient');

// Get all FeatureVersionLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.featureVersionLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching FeatureVersionLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single FeatureVersionLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.featureVersionLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'FeatureVersionLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching FeatureVersionLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new FeatureVersionLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.featureVersionLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating FeatureVersionLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update FeatureVersionLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.featureVersionLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating FeatureVersionLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FeatureVersionLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete FeatureVersionLog
exports.delete = async (req, res) => {
  try {
    await prisma.featureVersionLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'FeatureVersionLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting FeatureVersionLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FeatureVersionLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
