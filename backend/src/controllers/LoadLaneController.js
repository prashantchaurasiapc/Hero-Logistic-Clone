const prisma = require('../utils/prismaClient');

// Get all LoadLanes
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.loadLane.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching LoadLanes:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single LoadLane by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.loadLane.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'LoadLane not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching LoadLane:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new LoadLane
exports.create = async (req, res) => {
  try {
    const data = await prisma.loadLane.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating LoadLane:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update LoadLane
exports.update = async (req, res) => {
  try {
    const data = await prisma.loadLane.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating LoadLane:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadLane not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete LoadLane
exports.delete = async (req, res) => {
  try {
    await prisma.loadLane.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'LoadLane deleted successfully' });
  } catch (error) {
    console.error('Error deleting LoadLane:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadLane not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
