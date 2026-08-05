const prisma = require('../utils/prismaClient');

// Get all OfflineSyncItems
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.offlineSyncItem.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching OfflineSyncItems:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single OfflineSyncItem by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.offlineSyncItem.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'OfflineSyncItem not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching OfflineSyncItem:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new OfflineSyncItem
exports.create = async (req, res) => {
  try {
    const data = await prisma.offlineSyncItem.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating OfflineSyncItem:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update OfflineSyncItem
exports.update = async (req, res) => {
  try {
    const data = await prisma.offlineSyncItem.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating OfflineSyncItem:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'OfflineSyncItem not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete OfflineSyncItem
exports.delete = async (req, res) => {
  try {
    await prisma.offlineSyncItem.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'OfflineSyncItem deleted successfully' });
  } catch (error) {
    console.error('Error deleting OfflineSyncItem:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'OfflineSyncItem not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
