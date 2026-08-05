const prisma = require('../utils/prismaClient');

// Get all AssetAssignments
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.assetAssignment.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching AssetAssignments:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single AssetAssignment by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.assetAssignment.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'AssetAssignment not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching AssetAssignment:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new AssetAssignment
exports.create = async (req, res) => {
  try {
    const data = await prisma.assetAssignment.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating AssetAssignment:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update AssetAssignment
exports.update = async (req, res) => {
  try {
    const data = await prisma.assetAssignment.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating AssetAssignment:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AssetAssignment not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete AssetAssignment
exports.delete = async (req, res) => {
  try {
    await prisma.assetAssignment.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'AssetAssignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting AssetAssignment:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AssetAssignment not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
