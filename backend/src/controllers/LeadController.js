const prisma = require('../utils/prismaClient');

// Get all Leads
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.lead.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Leads:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Lead by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.lead.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Lead:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Lead
exports.create = async (req, res) => {
  try {
    const data = await prisma.lead.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Lead:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Lead
exports.update = async (req, res) => {
  try {
    const data = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Lead:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Lead
exports.delete = async (req, res) => {
  try {
    await prisma.lead.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting Lead:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
