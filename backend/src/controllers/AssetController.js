const prisma = require('../utils/prismaClient');

// Get all Assets
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.asset.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Assets:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Asset by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.asset.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Asset:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Asset
exports.create = async (req, res) => {
  try {
    const data = await prisma.asset.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Asset:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Asset
exports.update = async (req, res) => {
  try {
    const data = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Asset:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Asset
exports.delete = async (req, res) => {
  try {
    await prisma.asset.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting Asset:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
