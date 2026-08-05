const prisma = require('../utils/prismaClient');

// Get all Loads
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.load.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Loads:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Load by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.load.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Load:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Load
exports.create = async (req, res) => {
  try {
    const data = await prisma.load.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Load:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Load
exports.update = async (req, res) => {
  try {
    const data = await prisma.load.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Load:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Load
exports.delete = async (req, res) => {
  try {
    await prisma.load.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Load deleted successfully' });
  } catch (error) {
    console.error('Error deleting Load:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Load not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
