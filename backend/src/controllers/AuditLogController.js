const prisma = require('../utils/prismaClient');

// Get all AuditLogs
exports.getAll = async (req, res) => {
  try {
    const data = await prisma.auditLog.findMany();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching AuditLogs:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single AuditLog by ID
exports.getById = async (req, res) => {
  try {
    const data = await prisma.auditLog.findUnique({
      where: { id: req.params.id }
    });
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'AuditLog not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching AuditLog:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new AuditLog
exports.create = async (req, res) => {
  try {
    const data = await prisma.auditLog.create({
      data: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating AuditLog:', error);
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Update AuditLog
exports.update = async (req, res) => {
  try {
    const data = await prisma.auditLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating AuditLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AuditLog not found' });
    }
    res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
  }
};

// Delete AuditLog
exports.delete = async (req, res) => {
  try {
    await prisma.auditLog.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'AuditLog deleted successfully' });
  } catch (error) {
    console.error('Error deleting AuditLog:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'AuditLog not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
