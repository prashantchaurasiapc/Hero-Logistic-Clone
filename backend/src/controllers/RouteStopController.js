const prisma = require('../utils/prismaClient');

// Get all RouteStops
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.routeStop.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching RouteStops:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single RouteStop by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.routeStop.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'RouteStop not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching RouteStop:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new RouteStop
exports.create = async (req, res) => {
  try {
    const data = await prisma.routeStop.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating RouteStop:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update RouteStop
exports.update = async (req, res) => {
  try {
    const data = await prisma.routeStop.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating RouteStop:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'RouteStop not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete RouteStop
exports.delete = async (req, res) => {
  try {
    await prisma.routeStop.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'RouteStop deleted successfully' });
  } catch (error) {
    console.error('Error deleting RouteStop:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'RouteStop not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
