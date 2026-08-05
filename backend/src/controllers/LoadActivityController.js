const prisma = require('../utils/prismaClient');

// Get all LoadActivitys
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.loadActivity.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching LoadActivitys:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single LoadActivity by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.loadActivity.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'LoadActivity not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching LoadActivity:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new LoadActivity
exports.create = async (req, res) => {
  try {
    const data = await prisma.loadActivity.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating LoadActivity:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update LoadActivity
exports.update = async (req, res) => {
  try {
    const data = await prisma.loadActivity.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating LoadActivity:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadActivity not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete LoadActivity
exports.delete = async (req, res) => {
  try {
    await prisma.loadActivity.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'LoadActivity deleted successfully' });
  } catch (error) {
    console.error('Error deleting LoadActivity:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadActivity not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
