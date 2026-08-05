const prisma = require('../utils/prismaClient');

// Get all PromoCodes
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.promoCode.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching PromoCodes:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single PromoCode by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.promoCode.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'PromoCode not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching PromoCode:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new PromoCode
exports.create = async (req, res) => {
  try {
    const data = await prisma.promoCode.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating PromoCode:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update PromoCode
exports.update = async (req, res) => {
  try {
    const data = await prisma.promoCode.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating PromoCode:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PromoCode not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete PromoCode
exports.delete = async (req, res) => {
  try {
    await prisma.promoCode.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'PromoCode deleted successfully' });
  } catch (error) {
    console.error('Error deleting PromoCode:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'PromoCode not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
