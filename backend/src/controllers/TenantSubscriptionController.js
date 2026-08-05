const prisma = require('../utils/prismaClient');

// Get all TenantSubscriptions
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.tenantSubscription.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching TenantSubscriptions:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single TenantSubscription by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.tenantSubscription.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'TenantSubscription not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching TenantSubscription:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new TenantSubscription
exports.create = async (req, res) => {
  try {
    const data = await prisma.tenantSubscription.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating TenantSubscription:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update TenantSubscription
exports.update = async (req, res) => {
  try {
    const data = await prisma.tenantSubscription.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating TenantSubscription:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TenantSubscription not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete TenantSubscription
exports.delete = async (req, res) => {
  try {
    await prisma.tenantSubscription.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'TenantSubscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting TenantSubscription:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TenantSubscription not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
