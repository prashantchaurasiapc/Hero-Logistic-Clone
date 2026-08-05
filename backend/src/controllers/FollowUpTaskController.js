const prisma = require('../utils/prismaClient');

// Get all FollowUpTasks
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.followUpTask.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching FollowUpTasks:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single FollowUpTask by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.followUpTask.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'FollowUpTask not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching FollowUpTask:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new FollowUpTask
exports.create = async (req, res) => {
  try {
    const data = await prisma.followUpTask.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating FollowUpTask:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update FollowUpTask
exports.update = async (req, res) => {
  try {
    const data = await prisma.followUpTask.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating FollowUpTask:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FollowUpTask not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete FollowUpTask
exports.delete = async (req, res) => {
  try {
    await prisma.followUpTask.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'FollowUpTask deleted successfully' });
  } catch (error) {
    console.error('Error deleting FollowUpTask:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'FollowUpTask not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
