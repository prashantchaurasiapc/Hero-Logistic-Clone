const prisma = require('../utils/prismaClient');

// Get all Companys
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.company.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Companys:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Company by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.company.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Company:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Company
exports.create = async (req, res) => {
  try {
    const data = await prisma.company.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Company:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Company
exports.update = async (req, res) => {
  try {
    const data = await prisma.company.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Company:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Company
exports.delete = async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting Company:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
