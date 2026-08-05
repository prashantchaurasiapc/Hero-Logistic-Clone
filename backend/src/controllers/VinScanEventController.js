const prisma = require('../utils/prismaClient');

// Get all VinScanEvents
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.vinScanEvent.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching VinScanEvents:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single VinScanEvent by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.vinScanEvent.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'VinScanEvent not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching VinScanEvent:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new VinScanEvent
exports.create = async (req, res) => {
  try {
    const data = await prisma.vinScanEvent.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating VinScanEvent:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update VinScanEvent
exports.update = async (req, res) => {
  try {
    const data = await prisma.vinScanEvent.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating VinScanEvent:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'VinScanEvent not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete VinScanEvent
exports.delete = async (req, res) => {
  try {
    await prisma.vinScanEvent.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'VinScanEvent deleted successfully' });
  } catch (error) {
    console.error('Error deleting VinScanEvent:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'VinScanEvent not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
