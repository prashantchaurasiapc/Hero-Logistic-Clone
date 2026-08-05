const prisma = require('../utils/prismaClient');

// Get all ReportSchedules
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.reportSchedule.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ReportSchedules:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ReportSchedule by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.reportSchedule.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ReportSchedule not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ReportSchedule:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ReportSchedule
exports.create = async (req, res) => {
  try {
    const data = await prisma.reportSchedule.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ReportSchedule:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ReportSchedule
exports.update = async (req, res) => {
  try {
    const data = await prisma.reportSchedule.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ReportSchedule:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ReportSchedule not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ReportSchedule
exports.delete = async (req, res) => {
  try {
    await prisma.reportSchedule.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ReportSchedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting ReportSchedule:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ReportSchedule not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
