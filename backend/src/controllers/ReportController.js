const prisma = require('../utils/prismaClient');

// Get all Reports
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.report.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Reports:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Report by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.report.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Report:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Report
exports.create = async (req, res) => {
  try {
    const data = await prisma.report.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Report:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Report
exports.update = async (req, res) => {
  try {
    const data = await prisma.report.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Report:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Report
exports.delete = async (req, res) => {
  try {
    await prisma.report.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting Report:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
