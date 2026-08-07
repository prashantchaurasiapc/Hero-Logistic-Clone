const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all Leads with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    // Optional: Inject tenant scope here if applicable
    // if (req.tenantId) where.tenantId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where, skip, take, orderBy
      }),
      prisma.lead.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single Lead by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    const data = await prisma.lead.findFirst({ where });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Lead not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new Lead
exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    // if (req.tenantId) payload.tenantId = req.tenantId;

    const data = await prisma.lead.create({
      data: payload
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update Lead with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    const where = { id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    // Check version if optimistic concurrency is required
    const ifMatch = req.headers['if-match'];
    if (ifMatch) {
      where.version = parseInt(ifMatch.replace(/"/g, ''), 10);
    }

    try {
      const data = await prisma.lead.update({
        where,
        data: updateData
      });
      return sendSuccess(res, data);
    } catch (e) {
      if (e.code === 'P2025') {
        if (ifMatch) {
          return sendError(res, {
            code: ERROR_CODES.RESOURCE_CONFLICT,
            message: 'Resource was updated by another user or does not exist.'
          }, HTTP_STATUS.CONFLICT);
        }
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Lead not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete Lead
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete related records first to avoid foreign key constraint errors
    await prisma.$transaction([
      prisma.demoBooking.deleteMany({ where: { leadId: id } }),
      prisma.proposal.deleteMany({ where: { leadId: id } }),
      prisma.followUpTask.deleteMany({ where: { leadId: id } }),
      prisma.salesActivity.deleteMany({ where: { leadId: id } }),
      prisma.lead.delete({ where: { id } })
    ]);
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Lead not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

// Convert Lead to Company tenant
exports.convertToCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selectedPlan = 'Professional' } = req.body;

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Lead not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    // Hash password for company admin
    const passwordHash = await bcrypt.hash('123456', 10);

    // Find the subscription plan
    let plan = await prisma.subscriptionPlan.findFirst({
      where: { name: selectedPlan }
    });

    if (!plan) {
      plan = await prisma.subscriptionPlan.findFirst();
    }

    // Create Company
    const company = await prisma.company.create({
      data: {
        name: lead.companyName,
        status: 'ACTIVE',
        nicheCarCarrying: lead.transportNiche?.includes('Car Carrying') || false,
        nicheGeneralFreight: !lead.transportNiche?.includes('Car Carrying'),
        defaultNiche: lead.transportNiche || 'General Freight',
        adminEmail: lead.email,
        tenantId: `#TEN-${Math.floor(100 + Math.random() * 900)}`
      }
    });

    // Create User (COMPANY_ADMIN)
    const adminUser = await prisma.user.create({
      data: {
        email: lead.email,
        password: passwordHash,
        name: lead.contactName,
        role: 'COMPANY_ADMIN',
        status: 'ACTIVE',
        companyId: company.id,
        phone: lead.phone
      }
    });

    // Create TenantSubscription
    await prisma.tenantSubscription.create({
      data: {
        subId: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        companyId: company.id,
        planId: plan.id,
        status: 'ACTIVE',
        amount: plan.monthlyPrice,
        nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    // Update Lead to WON and associate company
    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        stage: 'WON',
        painPoints: `Converted to Company: ${company.name} (Admin ID: ${adminUser.id})`
      }
    });

    // Create a Sales Activity
    await prisma.salesActivity.create({
      data: {
        leadId: lead.id,
        title: 'Lead Converted to Company',
        description: `Successfully created Company: ${company.name} and Admin User: ${adminUser.email}`,
        performedById: lead.repId,
        timestamp: new Date()
      }
    });

    return sendSuccess(res, {
      lead: updatedLead,
      company,
      adminUser
    });

  } catch (error) {
    next(error);
  }
};
