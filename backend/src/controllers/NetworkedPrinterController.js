const prisma = require('../utils/prismaClient');

// Get all NetworkedPrinters
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.networkedPrinter.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching NetworkedPrinters:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single NetworkedPrinter by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.networkedPrinter.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'NetworkedPrinter not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching NetworkedPrinter:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new NetworkedPrinter
exports.create = async (req, res) => {
  try {
    const data = await prisma.networkedPrinter.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating NetworkedPrinter:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update NetworkedPrinter
exports.update = async (req, res) => {
  try {
    const data = await prisma.networkedPrinter.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating NetworkedPrinter:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'NetworkedPrinter not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete NetworkedPrinter
exports.delete = async (req, res) => {
  try {
    await prisma.networkedPrinter.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'NetworkedPrinter deleted successfully' });
  } catch (error) {
    console.error('Error deleting NetworkedPrinter:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'NetworkedPrinter not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
