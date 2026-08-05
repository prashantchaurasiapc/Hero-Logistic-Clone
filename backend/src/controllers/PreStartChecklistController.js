const prisma = require('../utils/prismaClient');

// Get all PreStartChecklists
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.preStartChecklist.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching PreStartChecklists:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single PreStartChecklist by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.preStartChecklist.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'PreStartChecklist not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching PreStartChecklist:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new PreStartChecklist
exports.create = async (req, res) => {
  try {
    const data = await prisma.preStartChecklist.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating PreStartChecklist:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update PreStartChecklist
exports.update = async (req, res) => {
  try {
    const data = await prisma.preStartChecklist.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating PreStartChecklist:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PreStartChecklist not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete PreStartChecklist
exports.delete = async (req, res) => {
  try {
    await prisma.preStartChecklist.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'PreStartChecklist deleted successfully' });
  } catch (error) {
    console.error('Error deleting PreStartChecklist:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PreStartChecklist not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
