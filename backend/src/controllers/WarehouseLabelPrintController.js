const prisma = require('../utils/prismaClient');

// Get all WarehouseLabelPrints
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.warehouseLabelPrint.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching WarehouseLabelPrints:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single WarehouseLabelPrint by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.warehouseLabelPrint.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'WarehouseLabelPrint not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching WarehouseLabelPrint:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new WarehouseLabelPrint
exports.create = async (req, res) => {
  try {
    const data = await prisma.warehouseLabelPrint.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating WarehouseLabelPrint:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update WarehouseLabelPrint
exports.update = async (req, res) => {
  try {
    const data = await prisma.warehouseLabelPrint.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating WarehouseLabelPrint:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WarehouseLabelPrint not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete WarehouseLabelPrint
exports.delete = async (req, res) => {
  try {
    await prisma.warehouseLabelPrint.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'WarehouseLabelPrint deleted successfully' });
  } catch (error) {
    console.error('Error deleting WarehouseLabelPrint:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'WarehouseLabelPrint not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
