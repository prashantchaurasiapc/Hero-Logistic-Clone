const prisma = require('../utils/prismaClient');

// Get all CompanyIntegrations
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.companyIntegration.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CompanyIntegrations:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CompanyIntegration by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.companyIntegration.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CompanyIntegration not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CompanyIntegration:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CompanyIntegration
exports.create = async (req, res) => {
  try {
    const data = await prisma.companyIntegration.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CompanyIntegration:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CompanyIntegration
exports.update = async (req, res) => {
  try {
    const data = await prisma.companyIntegration.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CompanyIntegration:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CompanyIntegration not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CompanyIntegration
exports.delete = async (req, res) => {
  try {
    await prisma.companyIntegration.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CompanyIntegration deleted successfully' });
  } catch (error) {
    console.error('Error deleting CompanyIntegration:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CompanyIntegration not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
