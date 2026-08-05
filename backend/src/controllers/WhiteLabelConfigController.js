const prisma = require('../utils/prismaClient');

// Get all WhiteLabelConfigs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.whiteLabelConfig.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching WhiteLabelConfigs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single WhiteLabelConfig by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.whiteLabelConfig.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'WhiteLabelConfig not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching WhiteLabelConfig:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new WhiteLabelConfig
exports.create = async (req, res) => {
  try {
    const data = await prisma.whiteLabelConfig.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating WhiteLabelConfig:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update WhiteLabelConfig
exports.update = async (req, res) => {
  try {
    const data = await prisma.whiteLabelConfig.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating WhiteLabelConfig:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WhiteLabelConfig not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete WhiteLabelConfig
exports.delete = async (req, res) => {
  try {
    await prisma.whiteLabelConfig.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'WhiteLabelConfig deleted successfully' });
  } catch (error) {
    console.error('Error deleting WhiteLabelConfig:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WhiteLabelConfig not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
