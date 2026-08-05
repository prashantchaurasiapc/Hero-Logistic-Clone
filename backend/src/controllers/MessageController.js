const prisma = require('../utils/prismaClient');

// Get all Messages
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.message.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Messages:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Message by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.message.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Message:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Message
exports.create = async (req, res) => {
  try {
    const data = await prisma.message.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Message:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Message
exports.update = async (req, res) => {
  try {
    const data = await prisma.message.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Message:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Message
exports.delete = async (req, res) => {
  try {
    await prisma.message.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting Message:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
