const prisma = require('../utils/prismaClient');

// Get all DeliveryPODs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.deliveryPOD.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching DeliveryPODs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single DeliveryPOD by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.deliveryPOD.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'DeliveryPOD not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching DeliveryPOD:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new DeliveryPOD
exports.create = async (req, res) => {
  try {
    const data = await prisma.deliveryPOD.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating DeliveryPOD:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update DeliveryPOD
exports.update = async (req, res) => {
  try {
    const data = await prisma.deliveryPOD.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating DeliveryPOD:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'DeliveryPOD not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete DeliveryPOD
exports.delete = async (req, res) => {
  try {
    await prisma.deliveryPOD.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'DeliveryPOD deleted successfully' });
  } catch (error) {
    console.error('Error deleting DeliveryPOD:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'DeliveryPOD not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
