const prisma = require('../utils/prismaClient');

// Get all ChecklistItemResponses
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.checklistItemResponse.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching ChecklistItemResponses:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single ChecklistItemResponse by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.checklistItemResponse.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'ChecklistItemResponse not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ChecklistItemResponse:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new ChecklistItemResponse
exports.create = async (req, res) => {
  try {
    const data = await prisma.checklistItemResponse.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating ChecklistItemResponse:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update ChecklistItemResponse
exports.update = async (req, res) => {
  try {
    const data = await prisma.checklistItemResponse.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating ChecklistItemResponse:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ChecklistItemResponse not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete ChecklistItemResponse
exports.delete = async (req, res) => {
  try {
    await prisma.checklistItemResponse.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'ChecklistItemResponse deleted successfully' });
  } catch (error) {
    console.error('Error deleting ChecklistItemResponse:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'ChecklistItemResponse not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
