const prisma = require('../utils/prismaClient');

// Get all Customers
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.customer.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Customers:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Customer by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Customer:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Customer
exports.create = async (req, res) => {
  try {
    const data = await prisma.customer.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Customer:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Customer
exports.update = async (req, res) => {
  try {
    const data = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Customer
exports.delete = async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting Customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
