const prisma = require('../utils/prismaClient');

// Get all Themes
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.theme.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Themes:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Theme by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.theme.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Theme:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Theme
exports.create = async (req, res) => {
  try {
    const data = await prisma.theme.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Theme:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Theme
exports.update = async (req, res) => {
  try {
    const data = await prisma.theme.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Theme:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Theme
exports.delete = async (req, res) => {
  try {
    await prisma.theme.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Error deleting Theme:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
