const prisma = require('../utils/prismaClient');

// Get all SupportTickets
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.supportTicket.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching SupportTickets:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single SupportTicket by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.supportTicket.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'SupportTicket not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching SupportTicket:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new SupportTicket
exports.create = async (req, res) => {
  try {
    const data = await prisma.supportTicket.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating SupportTicket:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update SupportTicket
exports.update = async (req, res) => {
  try {
    const data = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating SupportTicket:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SupportTicket not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete SupportTicket
exports.delete = async (req, res) => {
  try {
    await prisma.supportTicket.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'SupportTicket deleted successfully' });
  } catch (error) {
    console.error('Error deleting SupportTicket:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'SupportTicket not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
