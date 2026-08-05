const prisma = require('../utils/prismaClient');

// Get all SalesActivitys
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.salesActivity.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching SalesActivitys:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single SalesActivity by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.salesActivity.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'SalesActivity not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching SalesActivity:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new SalesActivity
exports.create = async (req, res) => {
  try {
    const data = await prisma.salesActivity.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating SalesActivity:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update SalesActivity
exports.update = async (req, res) => {
  try {
    const data = await prisma.salesActivity.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating SalesActivity:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SalesActivity not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete SalesActivity
exports.delete = async (req, res) => {
  try {
    await prisma.salesActivity.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'SalesActivity deleted successfully' });
  } catch (error) {
    console.error('Error deleting SalesActivity:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SalesActivity not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
