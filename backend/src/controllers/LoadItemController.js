const prisma = require('../utils/prismaClient');

// Get all LoadItems
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.loadItem.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching LoadItems:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single LoadItem by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.loadItem.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'LoadItem not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching LoadItem:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new LoadItem
exports.create = async (req, res) => {
  try {
    const data = await prisma.loadItem.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating LoadItem:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update LoadItem
exports.update = async (req, res) => {
  try {
    const data = await prisma.loadItem.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating LoadItem:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadItem not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete LoadItem
exports.delete = async (req, res) => {
  try {
    await prisma.loadItem.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'LoadItem deleted successfully' });
  } catch (error) {
    console.error('Error deleting LoadItem:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadItem not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
