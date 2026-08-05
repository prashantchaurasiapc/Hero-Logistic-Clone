const prisma = require('../utils/prismaClient');

// Get all Timesheets
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.timesheet.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Timesheets:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Timesheet by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.timesheet.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Timesheet:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Timesheet
exports.create = async (req, res) => {
  try {
    const data = await prisma.timesheet.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Timesheet:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Timesheet
exports.update = async (req, res) => {
  try {
    const data = await prisma.timesheet.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Timesheet:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Timesheet
exports.delete = async (req, res) => {
  try {
    await prisma.timesheet.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Timesheet deleted successfully' });
  } catch (error) {
    console.error('Error deleting Timesheet:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
