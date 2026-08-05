const prisma = require('../utils/prismaClient');

// Get all CustomerInvoices
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.customerInvoice.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CustomerInvoices:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CustomerInvoice by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.customerInvoice.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CustomerInvoice not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CustomerInvoice:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CustomerInvoice
exports.create = async (req, res) => {
  try {
    const data = await prisma.customerInvoice.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CustomerInvoice:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CustomerInvoice
exports.update = async (req, res) => {
  try {
    const data = await prisma.customerInvoice.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CustomerInvoice:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomerInvoice not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CustomerInvoice
exports.delete = async (req, res) => {
  try {
    await prisma.customerInvoice.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CustomerInvoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting CustomerInvoice:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CustomerInvoice not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
