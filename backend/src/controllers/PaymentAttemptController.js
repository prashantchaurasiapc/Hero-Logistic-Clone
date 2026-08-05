const prisma = require('../utils/prismaClient');

// Get all PaymentAttempts
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.paymentAttempt.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching PaymentAttempts:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single PaymentAttempt by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.paymentAttempt.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'PaymentAttempt not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching PaymentAttempt:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new PaymentAttempt
exports.create = async (req, res) => {
  try {
    const data = await prisma.paymentAttempt.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating PaymentAttempt:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update PaymentAttempt
exports.update = async (req, res) => {
  try {
    const data = await prisma.paymentAttempt.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating PaymentAttempt:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PaymentAttempt not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete PaymentAttempt
exports.delete = async (req, res) => {
  try {
    await prisma.paymentAttempt.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'PaymentAttempt deleted successfully' });
  } catch (error) {
    console.error('Error deleting PaymentAttempt:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PaymentAttempt not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
