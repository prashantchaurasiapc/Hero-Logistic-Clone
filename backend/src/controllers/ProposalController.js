const prisma = require('../utils/prismaClient');

// Get all Proposals
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.proposal.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching Proposals:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single Proposal by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.proposal.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Proposal:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new Proposal
exports.create = async (req, res) => {
  try {
    const data = await prisma.proposal.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating Proposal:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update Proposal
exports.update = async (req, res) => {
  try {
    const data = await prisma.proposal.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating Proposal:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete Proposal
exports.delete = async (req, res) => {
  try {
    await prisma.proposal.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting Proposal:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
