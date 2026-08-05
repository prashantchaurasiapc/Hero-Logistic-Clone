const prisma = require('../utils/prismaClient');

// Get all CustomDomains
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.customDomain.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CustomDomains:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CustomDomain by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.customDomain.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CustomDomain not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CustomDomain:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CustomDomain
exports.create = async (req, res) => {
  try {
    const data = await prisma.customDomain.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CustomDomain:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CustomDomain
exports.update = async (req, res) => {
  try {
    const data = await prisma.customDomain.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CustomDomain:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomDomain not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CustomDomain
exports.delete = async (req, res) => {
  try {
    await prisma.customDomain.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CustomDomain deleted successfully' });
  } catch (error) {
    console.error('Error deleting CustomDomain:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomDomain not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
