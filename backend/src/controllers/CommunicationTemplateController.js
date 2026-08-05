const prisma = require('../utils/prismaClient');

// Get all CommunicationTemplates
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.communicationTemplate.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching CommunicationTemplates:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single CommunicationTemplate by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.communicationTemplate.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'CommunicationTemplate not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CommunicationTemplate:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new CommunicationTemplate
exports.create = async (req, res) => {
  try {
    const data = await prisma.communicationTemplate.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating CommunicationTemplate:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update CommunicationTemplate
exports.update = async (req, res) => {
  try {
    const data = await prisma.communicationTemplate.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating CommunicationTemplate:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CommunicationTemplate not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete CommunicationTemplate
exports.delete = async (req, res) => {
  try {
    await prisma.communicationTemplate.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'CommunicationTemplate deleted successfully' });
  } catch (error) {
    console.error('Error deleting CommunicationTemplate:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'CommunicationTemplate not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
