const prisma = require('../utils/prismaClient');

// Get all TicketReplys
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.ticketReply.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching TicketReplys:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single TicketReply by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.ticketReply.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'TicketReply not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching TicketReply:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new TicketReply
exports.create = async (req, res) => {
  try {
    const data = await prisma.ticketReply.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating TicketReply:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update TicketReply
exports.update = async (req, res) => {
  try {
    const data = await prisma.ticketReply.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating TicketReply:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TicketReply not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete TicketReply
exports.delete = async (req, res) => {
  try {
    await prisma.ticketReply.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'TicketReply deleted successfully' });
  } catch (error) {
    console.error('Error deleting TicketReply:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'TicketReply not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
