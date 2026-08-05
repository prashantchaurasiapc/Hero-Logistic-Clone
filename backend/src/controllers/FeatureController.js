const prisma = require('../utils/prismaClient');

// Get all Features
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.feature.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Features:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Feature by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.feature.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Feature:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Feature
exports.create = async (req, res) => {
  try {
    const data = await prisma.feature.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Feature:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Feature
exports.update = async (req, res) => {
  try {
    const data = await prisma.feature.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Feature:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Feature
exports.delete = async (req, res) => {
  try {
    await prisma.feature.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting Feature:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
