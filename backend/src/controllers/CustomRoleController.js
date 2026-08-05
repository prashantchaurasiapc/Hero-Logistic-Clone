const prisma = require('../utils/prismaClient');

// Get all CustomRoles
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.customRole.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CustomRoles:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CustomRole by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.customRole.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CustomRole not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CustomRole:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CustomRole
exports.create = async (req, res) => {
  try {
    const data = await prisma.customRole.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CustomRole:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CustomRole
exports.update = async (req, res) => {
  try {
    const data = await prisma.customRole.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CustomRole:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomRole not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CustomRole
exports.delete = async (req, res) => {
  try {
    await prisma.customRole.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CustomRole deleted successfully' });
  } catch (error) {
    console.error('Error deleting CustomRole:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomRole not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
