const prisma = require('../utils/prismaClient');

// Get all DemoBookings
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.demoBooking.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching DemoBookings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single DemoBooking by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.demoBooking.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'DemoBooking not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching DemoBooking:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new DemoBooking
exports.create = async (req, res) => {
  try {
    const data = await prisma.demoBooking.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating DemoBooking:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update DemoBooking
exports.update = async (req, res) => {
  try {
    const data = await prisma.demoBooking.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating DemoBooking:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'DemoBooking not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete DemoBooking
exports.delete = async (req, res) => {
  try {
    await prisma.demoBooking.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'DemoBooking deleted successfully' });
  } catch (error) {
    console.error('Error deleting DemoBooking:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'DemoBooking not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
