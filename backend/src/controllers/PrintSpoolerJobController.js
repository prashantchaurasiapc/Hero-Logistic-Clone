const prisma = require('../utils/prismaClient');

// Get all PrintSpoolerJobs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.printSpoolerJob.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching PrintSpoolerJobs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single PrintSpoolerJob by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.printSpoolerJob.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'PrintSpoolerJob not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching PrintSpoolerJob:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new PrintSpoolerJob
exports.create = async (req, res) => {
  try {
    const data = await prisma.printSpoolerJob.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating PrintSpoolerJob:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update PrintSpoolerJob
exports.update = async (req, res) => {
  try {
    const data = await prisma.printSpoolerJob.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating PrintSpoolerJob:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PrintSpoolerJob not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete PrintSpoolerJob
exports.delete = async (req, res) => {
  try {
    await prisma.printSpoolerJob.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'PrintSpoolerJob deleted successfully' });
  } catch (error) {
    console.error('Error deleting PrintSpoolerJob:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PrintSpoolerJob not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
