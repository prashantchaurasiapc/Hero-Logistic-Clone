const prisma = require('../utils/prismaClient');

// Get all Warehouses
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.warehouse.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Warehouses:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Warehouse by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.warehouse.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Warehouse:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Warehouse
exports.create = async (req, res) => {
  try {
    const data = await prisma.warehouse.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Warehouse:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Warehouse
exports.update = async (req, res) => {
  try {
    const data = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Warehouse:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Warehouse
exports.delete = async (req, res) => {
  try {
    await prisma.warehouse.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Error deleting Warehouse:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Warehouse not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
