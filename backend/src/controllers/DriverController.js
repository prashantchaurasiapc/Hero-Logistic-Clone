const prisma = require('../utils/prismaClient');

// Get all Drivers
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.driver.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Drivers:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Driver by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.driver.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Driver:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Driver
exports.create = async (req, res) => {
  try {
    const data = await prisma.driver.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Driver:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Driver
exports.update = async (req, res) => {
  try {
    const data = await prisma.driver.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Driver:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Driver
exports.delete = async (req, res) => {
  try {
    await prisma.driver.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting Driver:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
