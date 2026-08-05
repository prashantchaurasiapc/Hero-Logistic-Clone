const prisma = require('../utils/prismaClient');

// Get all LoadExpenses
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.loadExpense.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching LoadExpenses:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single LoadExpense by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.loadExpense.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'LoadExpense not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching LoadExpense:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new LoadExpense
exports.create = async (req, res) => {
  try {
    const data = await prisma.loadExpense.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating LoadExpense:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update LoadExpense
exports.update = async (req, res) => {
  try {
    const data = await prisma.loadExpense.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating LoadExpense:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadExpense not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete LoadExpense
exports.delete = async (req, res) => {
  try {
    await prisma.loadExpense.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'LoadExpense deleted successfully' });
  } catch (error) {
    console.error('Error deleting LoadExpense:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'LoadExpense not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
