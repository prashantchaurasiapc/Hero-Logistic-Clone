const prisma = require('../utils/prismaClient');

// Get all Documents
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.document.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Documents:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Document by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.document.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Document:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Document
exports.create = async (req, res) => {
  try {
    const data = await prisma.document.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Document:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Document
exports.update = async (req, res) => {
  try {
    const data = await prisma.document.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Document:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Document
exports.delete = async (req, res) => {
  try {
    await prisma.document.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting Document:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
