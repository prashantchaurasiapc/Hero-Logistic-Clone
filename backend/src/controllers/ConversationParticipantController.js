const prisma = require('../utils/prismaClient');

// Get all ConversationParticipants
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.conversationParticipant.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ConversationParticipants:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ConversationParticipant by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.conversationParticipant.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ConversationParticipant not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ConversationParticipant:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ConversationParticipant
exports.create = async (req, res) => {
  try {
    const data = await prisma.conversationParticipant.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ConversationParticipant:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ConversationParticipant
exports.update = async (req, res) => {
  try {
    const data = await prisma.conversationParticipant.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ConversationParticipant:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ConversationParticipant not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ConversationParticipant
exports.delete = async (req, res) => {
  try {
    await prisma.conversationParticipant.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ConversationParticipant deleted successfully' });
  } catch (error) {
    console.error('Error deleting ConversationParticipant:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ConversationParticipant not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
