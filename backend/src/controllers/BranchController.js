const prisma = require('../utils/prismaClient');

// Get all Branchs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.branch.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Branchs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Branch by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.branch.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Branch:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Branch
exports.create = async (req, res) => {
  try {
    const data = await prisma.branch.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Branch:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Branch
exports.update = async (req, res) => {
  try {
    const data = await prisma.branch.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Branch:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Branch
exports.delete = async (req, res) => {
  try {
    await prisma.branch.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting Branch:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
