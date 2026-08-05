const prisma = require('../utils/prismaClient');

// Get all AiModules
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.aiModule.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching AiModules:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single AiModule by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.aiModule.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'AiModule not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching AiModule:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new AiModule
exports.create = async (req, res) => {
  try {
    const data = await prisma.aiModule.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating AiModule:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update AiModule
exports.update = async (req, res) => {
  try {
    const data = await prisma.aiModule.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating AiModule:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AiModule not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete AiModule
exports.delete = async (req, res) => {
  try {
    await prisma.aiModule.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'AiModule deleted successfully' });
  } catch (error) {
    console.error('Error deleting AiModule:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AiModule not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
