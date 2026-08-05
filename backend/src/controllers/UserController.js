const prisma = require('../utils/prismaClient');

// Get all Users
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.user.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Users:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single User by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new User
exports.create = async (req, res) => {
  try {
    const data = await prisma.user.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating User:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update User
exports.update = async (req, res) => {
  try {
    const data = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating User:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete User
exports.delete = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting User:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
