const prisma = require('../utils/prismaClient');

// Get all Vehicles
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.vehicle.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Vehicles:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Vehicle by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.vehicle.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Vehicle:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Vehicle
exports.create = async (req, res) => {
  try {
    const data = await prisma.vehicle.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Vehicle:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Vehicle
exports.update = async (req, res) => {
  try {
    const data = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Vehicle:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Vehicle
exports.delete = async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting Vehicle:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
