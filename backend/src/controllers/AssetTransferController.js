const prisma = require('../utils/prismaClient');

// Get all AssetTransfers
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.assetTransfer.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching AssetTransfers:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single AssetTransfer by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.assetTransfer.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'AssetTransfer not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching AssetTransfer:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new AssetTransfer
exports.create = async (req, res) => {
  try {
    const data = await prisma.assetTransfer.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating AssetTransfer:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update AssetTransfer
exports.update = async (req, res) => {
  try {
    const data = await prisma.assetTransfer.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating AssetTransfer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AssetTransfer not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete AssetTransfer
exports.delete = async (req, res) => {
  try {
    await prisma.assetTransfer.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'AssetTransfer deleted successfully' });
  } catch (error) {
    console.error('Error deleting AssetTransfer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AssetTransfer not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
