const prisma = require('../utils/prismaClient');

// Get all EquipmentSwaps
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.equipmentSwap.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching EquipmentSwaps:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single EquipmentSwap by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.equipmentSwap.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'EquipmentSwap not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching EquipmentSwap:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new EquipmentSwap
exports.create = async (req, res) => {
  try {
    const data = await prisma.equipmentSwap.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating EquipmentSwap:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update EquipmentSwap
exports.update = async (req, res) => {
  try {
    const data = await prisma.equipmentSwap.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating EquipmentSwap:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'EquipmentSwap not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete EquipmentSwap
exports.delete = async (req, res) => {
  try {
    await prisma.equipmentSwap.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'EquipmentSwap deleted successfully' });
  } catch (error) {
    console.error('Error deleting EquipmentSwap:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'EquipmentSwap not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
