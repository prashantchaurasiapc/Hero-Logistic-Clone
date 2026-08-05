const prisma = require('../utils/prismaClient');

// Get all Shifts
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.shift.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Shifts:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Shift by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.shift.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Shift:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Shift
exports.create = async (req, res) => {
  try {
    const data = await prisma.shift.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Shift:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Shift
exports.update = async (req, res) => {
  try {
    const data = await prisma.shift.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Shift:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Shift
exports.delete = async (req, res) => {
  try {
    await prisma.shift.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting Shift:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
