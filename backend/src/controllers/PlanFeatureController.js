const prisma = require('../utils/prismaClient');

// Get all PlanFeatures
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.planFeature.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching PlanFeatures:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single PlanFeature by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.planFeature.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'PlanFeature not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching PlanFeature:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new PlanFeature
exports.create = async (req, res) => {
  try {
    const data = await prisma.planFeature.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating PlanFeature:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update PlanFeature
exports.update = async (req, res) => {
  try {
    const data = await prisma.planFeature.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating PlanFeature:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PlanFeature not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete PlanFeature
exports.delete = async (req, res) => {
  try {
    await prisma.planFeature.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'PlanFeature deleted successfully' });
  } catch (error) {
    console.error('Error deleting PlanFeature:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PlanFeature not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
