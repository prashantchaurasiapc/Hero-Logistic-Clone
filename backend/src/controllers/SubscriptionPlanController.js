const prisma = require('../utils/prismaClient');

// Get all SubscriptionPlans
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.subscriptionPlan.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching SubscriptionPlans:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single SubscriptionPlan by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.subscriptionPlan.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'SubscriptionPlan not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching SubscriptionPlan:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new SubscriptionPlan
exports.create = async (req, res) => {
  try {
    const data = await prisma.subscriptionPlan.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating SubscriptionPlan:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update SubscriptionPlan
exports.update = async (req, res) => {
  try {
    const data = await prisma.subscriptionPlan.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating SubscriptionPlan:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SubscriptionPlan not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete SubscriptionPlan
exports.delete = async (req, res) => {
  try {
    await prisma.subscriptionPlan.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'SubscriptionPlan deleted successfully' });
  } catch (error) {
    console.error('Error deleting SubscriptionPlan:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SubscriptionPlan not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
