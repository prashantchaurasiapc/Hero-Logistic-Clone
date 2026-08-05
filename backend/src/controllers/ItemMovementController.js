const prisma = require('../utils/prismaClient');

// Get all ItemMovements
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.itemMovement.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ItemMovements:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ItemMovement by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.itemMovement.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ItemMovement not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ItemMovement:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ItemMovement
exports.create = async (req, res) => {
  try {
    const data = await prisma.itemMovement.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ItemMovement:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ItemMovement
exports.update = async (req, res) => {
  try {
    const data = await prisma.itemMovement.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ItemMovement:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ItemMovement not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ItemMovement
exports.delete = async (req, res) => {
  try {
    await prisma.itemMovement.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ItemMovement deleted successfully' });
  } catch (error) {
    console.error('Error deleting ItemMovement:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ItemMovement not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
