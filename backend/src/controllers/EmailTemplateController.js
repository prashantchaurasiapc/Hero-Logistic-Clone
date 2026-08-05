const prisma = require('../utils/prismaClient');

// Get all EmailTemplates
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.emailTemplate.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching EmailTemplates:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single EmailTemplate by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.emailTemplate.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'EmailTemplate not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching EmailTemplate:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new EmailTemplate
exports.create = async (req, res) => {
  try {
    const data = await prisma.emailTemplate.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating EmailTemplate:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update EmailTemplate
exports.update = async (req, res) => {
  try {
    const data = await prisma.emailTemplate.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating EmailTemplate:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'EmailTemplate not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete EmailTemplate
exports.delete = async (req, res) => {
  try {
    await prisma.emailTemplate.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'EmailTemplate deleted successfully' });
  } catch (error) {
    console.error('Error deleting EmailTemplate:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'EmailTemplate not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
