const prisma = require('../utils/prismaClient');

// Get all UserSessions
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.userSession.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching UserSessions:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single UserSession by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.userSession.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'UserSession not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching UserSession:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new UserSession
exports.create = async (req, res) => {
  try {
    const data = await prisma.userSession.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating UserSession:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update UserSession
exports.update = async (req, res) => {
  try {
    const data = await prisma.userSession.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating UserSession:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'UserSession not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete UserSession
exports.delete = async (req, res) => {
  try {
    await prisma.userSession.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'UserSession deleted successfully' });
  } catch (error) {
    console.error('Error deleting UserSession:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'UserSession not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
