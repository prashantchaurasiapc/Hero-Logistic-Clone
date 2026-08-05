const prisma = require('../utils/prismaClient');

// Get all CustomPermissions
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.customPermission.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CustomPermissions:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CustomPermission by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.customPermission.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CustomPermission not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CustomPermission:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CustomPermission
exports.create = async (req, res) => {
  try {
    const data = await prisma.customPermission.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CustomPermission:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CustomPermission
exports.update = async (req, res) => {
  try {
    const data = await prisma.customPermission.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CustomPermission:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomPermission not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CustomPermission
exports.delete = async (req, res) => {
  try {
    await prisma.customPermission.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CustomPermission deleted successfully' });
  } catch (error) {
    console.error('Error deleting CustomPermission:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomPermission not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
