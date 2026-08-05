const prisma = require('../utils/prismaClient');

// Get all ApiIntegrations
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.apiIntegration.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ApiIntegrations:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ApiIntegration by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.apiIntegration.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ApiIntegration not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ApiIntegration:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ApiIntegration
exports.create = async (req, res) => {
  try {
    const data = await prisma.apiIntegration.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ApiIntegration:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ApiIntegration
exports.update = async (req, res) => {
  try {
    const data = await prisma.apiIntegration.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ApiIntegration:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ApiIntegration not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ApiIntegration
exports.delete = async (req, res) => {
  try {
    await prisma.apiIntegration.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ApiIntegration deleted successfully' });
  } catch (error) {
    console.error('Error deleting ApiIntegration:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ApiIntegration not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
