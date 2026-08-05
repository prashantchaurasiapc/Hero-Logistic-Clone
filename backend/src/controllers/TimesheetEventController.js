const prisma = require('../utils/prismaClient');

// Get all TimesheetEvents
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.timesheetEvent.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching TimesheetEvents:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single TimesheetEvent by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.timesheetEvent.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'TimesheetEvent not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching TimesheetEvent:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new TimesheetEvent
exports.create = async (req, res) => {
  try {
    const data = await prisma.timesheetEvent.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating TimesheetEvent:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update TimesheetEvent
exports.update = async (req, res) => {
  try {
    const data = await prisma.timesheetEvent.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating TimesheetEvent:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TimesheetEvent not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete TimesheetEvent
exports.delete = async (req, res) => {
  try {
    await prisma.timesheetEvent.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'TimesheetEvent deleted successfully' });
  } catch (error) {
    console.error('Error deleting TimesheetEvent:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TimesheetEvent not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
