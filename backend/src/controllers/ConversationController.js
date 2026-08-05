const prisma = require('../utils/prismaClient');

// Get all Conversations
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.conversation.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Conversations:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Conversation by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.conversation.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Conversation:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Conversation
exports.create = async (req, res) => {
  try {
    const data = await prisma.conversation.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Conversation:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Conversation
exports.update = async (req, res) => {
  try {
    const data = await prisma.conversation.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Conversation:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Conversation
exports.delete = async (req, res) => {
  try {
    await prisma.conversation.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting Conversation:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
