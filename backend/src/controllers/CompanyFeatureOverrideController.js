const prisma = require('../utils/prismaClient');

// Get all CompanyFeatureOverrides
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.companyFeatureOverride.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CompanyFeatureOverrides:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CompanyFeatureOverride by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.companyFeatureOverride.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CompanyFeatureOverride not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CompanyFeatureOverride:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CompanyFeatureOverride
exports.create = async (req, res) => {
  try {
    const data = await prisma.companyFeatureOverride.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CompanyFeatureOverride:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CompanyFeatureOverride
exports.update = async (req, res) => {
  try {
    const data = await prisma.companyFeatureOverride.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CompanyFeatureOverride:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CompanyFeatureOverride not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CompanyFeatureOverride
exports.delete = async (req, res) => {
  try {
    await prisma.companyFeatureOverride.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CompanyFeatureOverride deleted successfully' });
  } catch (error) {
    console.error('Error deleting CompanyFeatureOverride:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CompanyFeatureOverride not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
