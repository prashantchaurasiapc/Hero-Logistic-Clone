const prisma = require('../utils/prismaClient');

// Get all FeatureDependencys
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.featureDependency.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching FeatureDependencys:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single FeatureDependency by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.featureDependency.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'FeatureDependency not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching FeatureDependency:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new FeatureDependency
exports.create = async (req, res) => {
  try {
    const data = await prisma.featureDependency.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating FeatureDependency:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update FeatureDependency
exports.update = async (req, res) => {
  try {
    const data = await prisma.featureDependency.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating FeatureDependency:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FeatureDependency not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete FeatureDependency
exports.delete = async (req, res) => {
  try {
    await prisma.featureDependency.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'FeatureDependency deleted successfully' });
  } catch (error) {
    console.error('Error deleting FeatureDependency:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FeatureDependency not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
