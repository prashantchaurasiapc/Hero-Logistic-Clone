const prisma = require('../utils/prismaClient');

// Get all InboundReceipts
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.inboundReceipt.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching InboundReceipts:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single InboundReceipt by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.inboundReceipt.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'InboundReceipt not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching InboundReceipt:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new InboundReceipt
exports.create = async (req, res) => {
  try {
    const data = await prisma.inboundReceipt.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating InboundReceipt:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update InboundReceipt
exports.update = async (req, res) => {
  try {
    const data = await prisma.inboundReceipt.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating InboundReceipt:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'InboundReceipt not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete InboundReceipt
exports.delete = async (req, res) => {
  try {
    await prisma.inboundReceipt.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'InboundReceipt deleted successfully' });
  } catch (error) {
    console.error('Error deleting InboundReceipt:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'InboundReceipt not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
