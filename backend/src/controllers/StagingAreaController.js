const prisma = require('../utils/prismaClient');

// Get all StagingAreas
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.stagingArea.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching StagingAreas:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single StagingArea by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.stagingArea.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'StagingArea not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching StagingArea:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new StagingArea
exports.create = async (req, res) => {
  try {
    const data = await prisma.stagingArea.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating StagingArea:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update StagingArea
exports.update = async (req, res) => {
  try {
    const data = await prisma.stagingArea.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating StagingArea:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'StagingArea not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete StagingArea
exports.delete = async (req, res) => {
  try {
    await prisma.stagingArea.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'StagingArea deleted successfully' });
  } catch (error) {
    console.error('Error deleting StagingArea:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'StagingArea not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
