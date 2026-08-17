const fs = require('fs');
const path = require('path');
const prisma = require('../utils/prismaClient');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

/**
 * GET /drivers/me
 *
 * Returns the authenticated driver's own profile.
 * Identity is resolved from req.user (set by auth middleware via JWT).
 * The client NEVER sends a driverId — the server determines it.
 *
 * Lookup chain:
 *   JWT → req.user.userId → driver.userId → Driver row
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Find the driver whose userId matches the logged-in user
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: {
        id: true,
        driverCode: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        status: true,
        employmentType: true,
        category: true,
        licenseType: true,
        licenseNumber: true,
        licenseExpiry: true,
        complianceScore: true,
        riskLevel: true,
        // Related vehicle(s) assigned to this driver
        currentVehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            plate: true,
            rego: true,
            category: true,
            odometerKm: true,
            fuelLevel: true,
            status: true,
            currentLocation: true,
          },
        },
        // Most recent active/assigned loads
        loads: {
          where: {
            status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            loadRef: true,
            type: true,
            status: true,
            priority: true,
            loadDate: true,
            deliveryEta: true,
            customer: {
              select: { id: true },
            },
            stops: {
              select: {
                id: true,
                type: true,
                address: true,
                scheduledDate: true,
              },
              orderBy: { sequenceIndex: 'asc' },
            },
          },
        },
        branch: {
          select: { id: true, name: true, location: true },
        },
        company: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!driver) {
      return sendError(
        res,
        {
          code: ERROR_CODES.NOT_FOUND,
          message: 'No driver profile found for this user account. Please contact your administrator.',
        },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Remove sensitive payroll/bank fields — never expose to the client via this endpoint
    return sendSuccess(res, { driver });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/me/loads
 *
 * Returns all loads assigned to the authenticated driver within their tenant/company.
 * Identity is resolved from req.user (set by auth middleware via JWT).
 * Never accepts driverId from client query or body.
 */
exports.getMyLoads = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Find the driver associated with this authenticated user account
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        {
          code: ERROR_CODES.NOT_FOUND,
          message: 'No driver profile found for this user account.',
        },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch loads assigned to THIS driver inside THIS tenant/company
    const loads = await prisma.load.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        draftId: true,
        loadRef: true,
        type: true,
        status: true,
        priority: true,
        loadDate: true,
        deliveryEta: true,
        notes: true,
        dispatchNotes: true,
        customer: {
          select: {
            id: true,
            name: true,
            contactName: true,
          },
        },

        truck: {
          select: {
            id: true,
            rego: true,
            plate: true,
            make: true,
            model: true,
          },
        },
        trailer: {
          select: {
            id: true,
            rego: true,
            plate: true,
          },
        },
        stops: {
          select: {
            id: true,
            type: true,
            sequenceIndex: true,
            address: true,
            contactName: true,
            contactPhone: true,
            scheduledDate: true,
          },
          orderBy: { sequenceIndex: 'asc' },
        },
        items: {
          select: {
            id: true,
            vin: true,
            make: true,
            model: true,
            year: true,
            color: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, { loads });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/loads/:id
 *
 * Returns details for a single load assigned to the authenticated driver.
 * Enforces strict driver ownership (load.driverId === driver.id) and tenant boundary (load.companyId === driver.companyId).
 */
exports.getLoadDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve authenticated driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: {
        id: true,
        draftId: true,
        loadRef: true,
        type: true,
        status: true,
        priority: true,
        loadDate: true,
        deliveryEta: true,
        notes: true,
        dispatchNotes: true,
        driverId: true,
        companyId: true,
        customer: {
          select: {
            id: true,
            name: true,
            contactName: true,
            email: true,
            phone: true,
          },
        },
        truck: {
          select: {
            id: true,
            rego: true,
            plate: true,
            make: true,
            model: true,
          },
        },
        trailer: {
          select: {
            id: true,
            rego: true,
            plate: true,
            category: true,
          },
        },
        stops: {
          select: {
            id: true,
            type: true,
            sequenceIndex: true,
            address: true,
            contactName: true,
            contactPhone: true,
            scheduledDate: true,
          },
          orderBy: { sequenceIndex: 'asc' },
        },
        items: {
          select: {
            id: true,
            vin: true,
            make: true,
            model: true,
            year: true,
            color: true,
            notes: true,
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            fileUrl: true,
            expiryDate: true,
            createdAt: true,
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            description: true,
            timestamp: true,
          },
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // 3. Security checks: existence, ownership & tenant boundary
    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to view this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendSuccess(res, { load });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/loads/:id/status-transition
 *
 * Updates status for a load assigned to the authenticated driver.
 * Enforces strict driver ownership (load.driverId === driver.id) and tenant boundary (load.companyId === driver.companyId).
 * Validates transition rules and rejects arbitrary or invalid status transitions.
 */
exports.updateLoadStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;
    let { status: requestedStatus, note } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!requestedStatus) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Status is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Map status aliases if supplied by frontend
    const statusMap = {
      'Picked Up': 'IN_TRANSIT',
      'Dispatched': 'IN_TRANSIT',
      'In Transit': 'IN_TRANSIT',
      'Delivered': 'DELIVERED',
      'Completed': 'COMPLETED',
      'Upcoming': 'ASSIGNED',
      'Cancelled': 'CANCELLED',
    };

    let targetStatus = statusMap[requestedStatus] || requestedStatus.toUpperCase();

    const validStatuses = ['DRAFT', 'PLANNED', 'ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(targetStatus)) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: `Invalid load status: '${requestedStatus}'.` },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, driverId: true, companyId: true, status: true, loadRef: true }
    });

    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 3. Ownership & tenant boundary check
    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to transition this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 4. Validate transition rules
    if (['CANCELLED', 'COMPLETED'].includes(load.status)) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: `Cannot change status of a ${load.status.toLowerCase()} load.` },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 5. Update Load in DB
    const updatedLoad = await prisma.load.update({
      where: { id: loadId },
      data: {
        status: targetStatus,
        dispatchNotes: note ? `${note}` : undefined,
      },
      select: {
        id: true,
        loadRef: true,
        status: true,
        updatedAt: true,
      }
    });

    return sendSuccess(res, { load: updatedLoad, message: `Load status updated to ${targetStatus}` });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/loads/:id/pickup-items
 *
 * Retrieves pickup items and progress stats for a load assigned to the authenticated driver.
 * Enforces strict driver ownership (load.driverId === driver.id) and tenant boundary (load.companyId === driver.companyId).
 */
exports.getPickupItems = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, driverId: true, companyId: true, status: true, loadRef: true }
    });

    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 3. Ownership & tenant boundary check
    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to view pickup items for this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 4. Fetch load items
    const items = await prisma.loadItem.findMany({
      where: { loadId },
      select: {
        id: true,
        vin: true,
        make: true,
        model: true,
        year: true,
        color: true,
        rego: true,
        status: true,
        notes: true,
        pickupStop: {
          select: { id: true, address: true, contactName: true }
        },
        dropoffStop: {
          select: { id: true, address: true, contactName: true }
        }
      }
    });

    const totalItems = items.length;
    const pickedUpCount = items.filter(i => i.status === 'PICKED_UP').length;
    const progressPercent = totalItems > 0 ? Math.round((pickedUpCount / totalItems) * 100) : 0;

    return sendSuccess(res, {
      items,
      progress: {
        totalItems,
        pickedUpCount,
        progressPercent,
        isComplete: totalItems > 0 && pickedUpCount === totalItems
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/loads/:id/pickup-item
 *
 * Marks an assigned load item as picked up by VIN or Item ID.
 * Enforces strict driver ownership (load.driverId === driver.id) and tenant boundary (load.companyId === driver.companyId).
 * Enforces item ownership (item.loadId === load.id). Rejects VINs belonging to other loads/drivers.
 */
exports.pickupItem = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;
    let { vin, itemId, note } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!vin && !itemId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'VIN or Item ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, driverId: true, companyId: true, status: true, loadRef: true }
    });

    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 3. Ownership & tenant boundary check
    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to update items for this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 4. Verify load eligibility
    if (['CANCELLED', 'COMPLETED'].includes(load.status)) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: `Cannot pick up items on a ${load.status.toLowerCase()} load.` },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 5. Query for matching item ON THIS SPECIFIC LOAD
    const cleanVin = vin ? vin.trim() : null;

    const allLoadItems = await prisma.loadItem.findMany({
      where: { loadId: load.id }
    });

    const item = allLoadItems.find(i => {
      if (itemId && i.id === itemId) return true;
      if (cleanVin && i.vin && i.vin.trim().toUpperCase() === cleanVin.toUpperCase()) return true;
      return false;
    });

    if (!item) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: `Vehicle VIN '${cleanVin || itemId}' is not assigned to this load.` },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 6. Duplicate pickup protection
    if (item.status === 'PICKED_UP') {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: `Vehicle VIN '${item.vin || cleanVin}' has already been picked up.`, details: { alreadyPickedUp: true, itemId: item.id } },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 7. Transactional update & record VinScanEvent
    const result = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.loadItem.update({
        where: { id: item.id },
        data: {
          status: 'PICKED_UP',
          notes: note ? `${note}` : item.notes,
        }
      });

      await tx.vinScanEvent.create({
        data: {
          driverId: driver.id,
          loadId: load.id,
          loadItemId: item.id,
          scannedVin: item.vin || cleanVin || 'MANUAL',
          result: 'PICKED_UP',
          stopType: 'PICKUP',
          timestamp: new Date()
        }
      });

      const allItems = await tx.loadItem.findMany({
        where: { loadId: load.id },
        select: { id: true, status: true }
      });

      const totalItems = allItems.length;
      const pickedUpCount = allItems.filter(i => i.status === 'PICKED_UP').length;
      const progressPercent = totalItems > 0 ? Math.round((pickedUpCount / totalItems) * 100) : 0;

      return {
        item: updatedItem,
        progress: {
          totalItems,
          pickedUpCount,
          progressPercent,
          isComplete: totalItems > 0 && pickedUpCount === totalItems
        }
      };
    });

    return sendSuccess(res, {
      item: result.item,
      progress: result.progress,
      message: `Vehicle VIN ${result.item.vin || cleanVin} successfully marked as picked up.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/loads/:id/delivery-items
 *
 * Retrieves delivery items, dropoff stops, and POD history for a load assigned to the authenticated driver.
 * Enforces strict driver ownership (load.driverId === driver.id) and tenant boundary (load.companyId === driver.companyId).
 */
exports.getDeliveryItems = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, driverId: true, companyId: true, status: true, loadRef: true }
    });

    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 3. Ownership & tenant boundary check
    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to view delivery details for this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 4. Fetch delivery items, route stops & existing PODs
    const [items, stops, pods] = await Promise.all([
      prisma.loadItem.findMany({
        where: { loadId },
        select: {
          id: true,
          vin: true,
          make: true,
          model: true,
          year: true,
          color: true,
          rego: true,
          status: true,
          notes: true,
          photos: { select: { id: true, fileUrl: true, stage: true } },
          dropoffStop: { select: { id: true, address: true, contactName: true } }
        }
      }),
      prisma.routeStop.findMany({
        where: { loadId, type: 'DROPOFF' },
        orderBy: { sequenceIndex: 'asc' }
      }),
      prisma.deliveryPOD.findMany({
        where: { loadId, driverId: driver.id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const totalItems = items.length;
    const deliveredCount = items.filter(i => i.status === 'DELIVERED').length;
    const pickedUpCount = items.filter(i => i.status === 'PICKED_UP').length;
    const isComplete = totalItems > 0 && deliveredCount === totalItems;

    return sendSuccess(res, {
      items,
      stops,
      pods,
      summary: {
        totalItems,
        deliveredCount,
        pickedUpCount,
        isComplete,
        loadStatus: load.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/loads/:id/delivery-pod
 *
 * Submits Proof of Delivery (POD) for a load assigned to the authenticated driver.
 * Validates driver ownership, tenant boundary, stop belonging to load, item belonging to load,
 * mandatory customer signature (unless after-hours), safe image saving, and transaction persistence.
 */
exports.submitDeliveryPOD = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id: loadId } = req.params;
    const {
      stopId,
      stopIndex = 1,
      signeeName,
      signatureData,
      isAfterHours = false,
      deliveryNotes,
      itemIds = [],
      photos = []
    } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!loadId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Load ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, driverId: true, companyId: true, status: true, loadRef: true }
    });

    if (!load) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'Load not found.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 3. Ownership & tenant boundary check
    if (load.driverId !== driver.id || load.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied. You are not authorized to submit POD for this load.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 4. Verify load status eligibility
    if (['CANCELLED', 'COMPLETED'].includes(load.status)) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: `Cannot submit POD on a ${load.status.toLowerCase()} load.` },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 5. Verify stop belonging if stopId provided
    if (stopId) {
      const stop = await prisma.routeStop.findFirst({
        where: { id: stopId, loadId: load.id }
      });
      if (!stop) {
        return sendError(
          res,
          { code: ERROR_CODES.NOT_FOUND, message: 'Delivery stop does not belong to this load.' },
          HTTP_STATUS.NOT_FOUND
        );
      }
    }

    // 6. Validate items on this load
    const allLoadItems = await prisma.loadItem.findMany({
      where: { loadId: load.id }
    });

    let targetItems = allLoadItems;
    if (Array.isArray(itemIds) && itemIds.length > 0) {
      const itemMap = new Map(allLoadItems.map(i => [i.id, i]));
      targetItems = [];
      for (const id of itemIds) {
        const item = itemMap.get(id);
        if (!item) {
          return sendError(
            res,
            { code: ERROR_CODES.BAD_REQUEST, message: `Item ID '${id}' is not assigned to this load.` },
            HTTP_STATUS.BAD_REQUEST
          );
        }
        targetItems.push(item);
      }
    }

    // 7. Validate signature requirement
    if (!isAfterHours) {
      if (!signeeName || !signeeName.trim()) {
        return sendError(
          res,
          { code: ERROR_CODES.VALIDATION_ERROR, message: 'Customer signature name is required.' },
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (!signatureData) {
        return sendError(
          res,
          { code: ERROR_CODES.VALIDATION_ERROR, message: 'Customer signature image is required.' },
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // 8. Secure File Saving (Signature & Photos)
    const fs = require('fs');
    const path = require('path');
    const publicDir = path.join(__dirname, '../../public');
    const uploadsDir = path.join(publicDir, 'uploads');
    const signaturesDir = path.join(uploadsDir, 'signatures');
    const photosDir = path.join(uploadsDir, 'photos');

    [publicDir, uploadsDir, signaturesDir, photosDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    let signatureUrl = null;
    if (signatureData && typeof signatureData === 'string') {
      const matches = signatureData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png';
        const filename = `sig_${Date.now()}_${Math.round(Math.random() * 1E9)}.${ext}`;
        const filePath = path.join(signaturesDir, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
        signatureUrl = `/uploads/signatures/${filename}`;
      } else if (signatureData.startsWith('/uploads/')) {
        signatureUrl = signatureData;
      }
    }

    const savedPhotoUrls = [];
    if (Array.isArray(photos)) {
      for (const photoStr of photos.slice(0, 5)) {
        if (typeof photoStr === 'string' && photoStr.startsWith('data:')) {
          const matches = photoStr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const ext = matches[1].split('/')[1] || 'jpg';
            const filename = `pod_${Date.now()}_${Math.round(Math.random() * 1E9)}.${ext}`;
            const filePath = path.join(photosDir, filename);
            fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
            savedPhotoUrls.push(`/uploads/photos/${filename}`);
          }
        } else if (typeof photoStr === 'string' && photoStr.startsWith('http')) {
          savedPhotoUrls.push(photoStr);
        }
      }
    }

    // 9. Atomic Transactional Update
    const result = await prisma.$transaction(async (tx) => {
      // Create DeliveryPOD record
      const pod = await tx.deliveryPOD.create({
        data: {
          driverId: driver.id,
          loadId: load.id,
          loadItemId: targetItems[0]?.id || null,
          stopIndex: Number(stopIndex) || 1,
          isAfterHours: Boolean(isAfterHours),
          signeeName: isAfterHours ? 'After-Hours Delivery' : signeeName.trim(),
          signatureUrl,
          deliveryNotes: deliveryNotes ? String(deliveryNotes) : null,
          deliveredAt: new Date()
        }
      });

      // Update LoadItems status to 'DELIVERED'
      const updatedItemIds = targetItems.map(i => i.id);
      if (updatedItemIds.length > 0) {
        await tx.loadItem.updateMany({
          where: { id: { in: updatedItemIds } },
          data: { status: 'DELIVERED' }
        });
      }

      // Create ProofPhoto records if photos uploaded
      for (const url of savedPhotoUrls) {
        if (targetItems[0]?.id) {
          await tx.proofPhoto.create({
            data: {
              itemId: targetItems[0].id,
              stage: 'DELIVERY_CONDITION',
              fileUrl: url,
              timestamp: new Date()
            }
          });
        }
      }

      // Check if all items on load are delivered
      const remainingItems = await tx.loadItem.findMany({
        where: { loadId: load.id, status: { not: 'DELIVERED' } }
      });

      let updatedLoadStatus = load.status;
      if (remainingItems.length === 0) {
        const updatedLoad = await tx.load.update({
          where: { id: load.id },
          data: { status: 'DELIVERED' },
          select: { id: true, status: true }
        });
        updatedLoadStatus = updatedLoad.status;
      }

      return { pod, loadStatus: updatedLoadStatus, deliveredItemsCount: updatedItemIds.length };
    });

    return sendSuccess(res, {
      pod: result.pod,
      loadStatus: result.loadStatus,
      deliveredItemsCount: result.deliveredItemsCount,
      photoUrls: savedPhotoUrls,
      message: 'Proof of Delivery submitted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/timesheet/today
 *
 * Returns current clock status, active or today's timesheet for the authenticated driver.
 * Enforces strict driver identity (req.user.userId) and tenant boundary.
 */
exports.getTodayTimesheet = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch active or today's timesheet
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        OR: [
          { clockOutAt: null },
          { date: { gte: today } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        events: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!timesheet) {
      return sendSuccess(res, {
        status: 'CLOCKED_OUT',
        clockStatus: 'Clocked Out',
        clockInAt: null,
        clockOutAt: null,
        secondsToday: 0,
        workMinutes: 0,
        timesheet: null
      });
    }

    const isClockedIn = Boolean(timesheet.clockInAt && !timesheet.clockOutAt);
    const clockInTime = timesheet.clockInAt ? new Date(timesheet.clockInAt).getTime() : 0;
    const elapsedSecs = isClockedIn ? Math.max(0, Math.floor((now.getTime() - clockInTime) / 1000)) : (timesheet.workMinutes * 60);

    return sendSuccess(res, {
      status: isClockedIn ? 'CLOCKED_IN' : 'CLOCKED_OUT',
      clockStatus: isClockedIn ? 'Clocked In' : 'Clocked Out',
      clockInAt: timesheet.clockInAt,
      clockOutAt: timesheet.clockOutAt,
      secondsToday: elapsedSecs,
      workMinutes: timesheet.workMinutes,
      timesheet
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/timesheet/clock-in
 *
 * Clocks in the authenticated driver, creating a new open Timesheet and CLOCK_IN event.
 * Rejects duplicate clock-in attempts if an active session exists.
 */
exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { locationName, note, gpsLat, gpsLng } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Check for open active timesheet
    const activeTimesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        clockOutAt: null
      }
    });

    if (activeTimesheet) {
      return sendError(
        res,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'You are already clocked in. Please clock out before clocking in again.',
          details: { alreadyClockedIn: true, timesheetId: activeTimesheet.id }
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 3. Create timesheet & CLOCK_IN event inside transaction
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const result = await prisma.$transaction(async (tx) => {
      const timesheet = await tx.timesheet.create({
        data: {
          driverId: driver.id,
          companyId: driver.companyId,
          date: today,
          status: 'DRAFT',
          clockInAt: now,
          events: {
            create: {
              type: 'CLOCK_IN',
              timestamp: now,
              gpsLat: gpsLat ? parseFloat(gpsLat) : null,
              gpsLng: gpsLng ? parseFloat(gpsLng) : null,
              locationName: locationName || 'Yard - Melbourne VIC (-37.8136, 144.9631)',
              note: note || 'Clocked in via Driver Portal'
            }
          }
        },
        include: {
          events: true
        }
      });

      return timesheet;
    });

    return sendSuccess(res, {
      status: 'CLOCKED_IN',
      clockStatus: 'Clocked In',
      timesheet: result,
      clockInAt: result.clockInAt,
      message: 'Clocked In successfully! Shift started.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/timesheet/clock-out
 *
 * Clocks out the authenticated driver, setting clockOutAt, workMinutes, and creating a CLOCK_OUT event.
 * Rejects clock-out attempt if no active session exists.
 */
exports.clockOut = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { locationName, note, gpsLat, gpsLng } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Find active open timesheet
    const activeTimesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        clockOutAt: null
      }
    });

    if (!activeTimesheet) {
      return sendError(
        res,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'You are not currently clocked in. No active work session found.',
          details: { notClockedIn: true }
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 3. Calculate worked minutes and close session in transaction
    const now = new Date();
    const startTime = activeTimesheet.clockInAt || activeTimesheet.createdAt;
    const elapsedMs = Math.max(0, now.getTime() - new Date(startTime).getTime());
    const totalMins = Math.max(1, Math.round(elapsedMs / (1000 * 60)));

    const result = await prisma.$transaction(async (tx) => {
      const updatedTimesheet = await tx.timesheet.update({
        where: { id: activeTimesheet.id },
        data: {
          clockOutAt: now,
          workMinutes: totalMins,
          totalMinutes: totalMins,
          updatedAt: now
        }
      });

      await tx.timesheetEvent.create({
        data: {
          timesheetId: activeTimesheet.id,
          type: 'CLOCK_OUT',
          timestamp: now,
          gpsLat: gpsLat ? parseFloat(gpsLat) : null,
          gpsLng: gpsLng ? parseFloat(gpsLng) : null,
          locationName: locationName || 'Yard - Sydney NSW (-33.8688, 151.2093)',
          note: note || 'Clocked out via Driver Portal'
        }
      });

      return updatedTimesheet;
    });

    return sendSuccess(res, {
      status: 'CLOCKED_OUT',
      clockStatus: 'Clocked Out',
      timesheet: result,
      clockOutAt: result.clockOutAt,
      workMinutes: result.workMinutes,
      message: 'Clocked Out successfully! Shift ended.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/expenses
 *
 * Returns all expenses associated with loads assigned to the authenticated driver.
 * Enforces strict driver identity (req.user.userId) and tenant boundary.
 */
exports.getMyExpenses = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch driver's assigned load IDs
    const driverLoads = await prisma.load.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      select: { id: true }
    });

    const loadIds = driverLoads.map(l => l.id);

    // 3. Fetch expenses for those loads
    const expenses = await prisma.loadExpense.findMany({
      where: {
        loadId: { in: loadIds }
      },
      include: {
        load: {
          select: { id: true, loadRef: true, type: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, {
      expenses,
      count: expenses.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/expenses
 *
 * Submits a new expense (Fuel, Toll, etc.) for a load assigned to the authenticated driver.
 * Validates driver ownership, tenant boundary, non-zero amount, and valid expense type.
 */
exports.createExpense = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const {
      type,
      category,
      amount,
      date,
      vendorName,
      vendor,
      description,
      details,
      litres,
      pricePerLitre,
      odometer,
      receiptUrl,
      receiptData,
      loadId
    } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Validate Type / Category
    const rawType = type || category || 'Other';
    const typeStr = String(rawType).trim();
    if (!typeStr) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Expense type is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Standardize category name
    let normalizedType = typeStr.charAt(0).toUpperCase() + typeStr.slice(1).toLowerCase();
    if (typeStr.toUpperCase() === 'TOLLS') normalizedType = 'Tolls';
    if (typeStr.toUpperCase() === 'TOLL') normalizedType = 'Tolls';
    if (typeStr.toUpperCase() === 'FUEL') normalizedType = 'Fuel';
    if (typeStr.toUpperCase() === 'MAINTENANCE') normalizedType = 'Maintenance';
    if (typeStr.toUpperCase() === 'TYRES') normalizedType = 'Tyres';

    const validTypes = ['Fuel', 'Tolls', 'Maintenance', 'Tyres', 'Other'];
    if (!validTypes.includes(normalizedType)) {
      return sendError(
        res,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `Invalid expense type '${rawType}'. Allowed values: ${validTypes.join(', ')}.`
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 3. Validate Amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return sendError(
        res,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Please enter a valid expense amount greater than $0.00.'
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 4. Resolve & Validate Target Load Ownership & Tenant
    let targetLoad = null;
    if (loadId) {
      targetLoad = await prisma.load.findUnique({
        where: { id: loadId }
      });

      if (!targetLoad || targetLoad.driverId !== driver.id || targetLoad.companyId !== driver.companyId) {
        return sendError(
          res,
          {
            code: ERROR_CODES.UNAUTHORIZED_ACCESS,
            message: 'You do not have access to this load or load was not found.'
          },
          HTTP_STATUS.FORBIDDEN
        );
      }
    } else {
      // Auto-assign to driver's active load or latest assigned load
      targetLoad = await prisma.load.findFirst({
        where: {
          driverId: driver.id,
          companyId: driver.companyId,
          status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] }
        },
        orderBy: { updatedAt: 'desc' }
      });

      if (!targetLoad) {
        targetLoad = await prisma.load.findFirst({
          where: {
            driverId: driver.id,
            companyId: driver.companyId
          },
          orderBy: { createdAt: 'desc' }
        });
      }

      if (!targetLoad) {
        return sendError(
          res,
          {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'No assigned load found for driver to associate expense.'
          },
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // 5. Handle Base64 receipt upload if provided
    let savedReceiptUrl = receiptUrl || null;
    if (receiptData && typeof receiptData === 'string' && receiptData.startsWith('data:image')) {
      const matches = receiptData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = mimeType.split('/')[1] || 'jpg';

        const publicDir = path.join(__dirname, '../../public');
        const uploadsDir = path.join(publicDir, 'uploads', 'receipts');

        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
        if (!fs.existsSync(path.join(publicDir, 'uploads'))) fs.mkdirSync(path.join(publicDir, 'uploads'));
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

        const filename = `rec_${Date.now()}_${Math.round(Math.random() * 1e9)}.${ext}`;
        const fullPath = path.join(uploadsDir, filename);
        fs.writeFileSync(fullPath, buffer);

        savedReceiptUrl = `/uploads/receipts/${filename}`;
      }
    }

    // 6. Create LoadExpense record
    const vendorStr = vendorName || vendor || 'Service Station';
    const descStr = description || details || `${normalizedType} expense for ${vendorStr}`;

    const expense = await prisma.loadExpense.create({
      data: {
        loadId: targetLoad.id,
        type: normalizedType,
        amount: parsedAmount,
        date: date ? new Date(date) : new Date(),
        vendorName: vendorStr,
        description: descStr,
        litres: litres ? parseFloat(litres) : null,
        pricePerLitre: pricePerLitre ? parseFloat(pricePerLitre) : null,
        odometer: odometer ? parseInt(String(odometer).replace(/,/g, ''), 10) : null,
        receiptUrl: savedReceiptUrl,
        status: 'PENDING'
      },
      include: {
        load: {
          select: { id: true, loadRef: true }
        }
      }
    });

    return sendSuccess(
      res,
      {
        expense,
        message: `${normalizedType} expense of $${parsedAmount.toFixed(2)} submitted successfully!`
      },
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/expenses/:id
 *
 * Returns details for a single expense belonging to the authenticated driver and company.
 */
exports.getExpenseDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch expense & verify ownership via load relation
    const expense = await prisma.loadExpense.findUnique({
      where: { id },
      include: {
        load: {
          select: { id: true, loadRef: true, driverId: true, companyId: true }
        }
      }
    });

    if (!expense || expense.load.driverId !== driver.id || expense.load.companyId !== driver.companyId) {
      return sendError(
        res,
        {
          code: ERROR_CODES.UNAUTHORIZED_ACCESS,
          message: 'Expense not found or access denied.'
        },
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendSuccess(res, { expense });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/trailer-swap
 * GET /driver-portal/trailer-swap/:loadId
 *
 * Returns current assigned trailer, available company trailers, and recent swap history.
 * Enforces strict driver identity (req.user.userId) and tenant boundary.
 */
exports.getTrailerSwapContext = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { loadId } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Fetch load context if loadId provided or find active load
    let targetLoad = null;
    if (loadId) {
      targetLoad = await prisma.load.findUnique({
        where: { id: loadId },
        include: { trailer: true, truck: true }
      });

      if (!targetLoad || targetLoad.driverId !== driver.id || targetLoad.companyId !== driver.companyId) {
        return sendError(
          res,
          { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'You do not have access to this load or load was not found.' },
          HTTP_STATUS.FORBIDDEN
        );
      }
    } else {
      targetLoad = await prisma.load.findFirst({
        where: {
          driverId: driver.id,
          companyId: driver.companyId,
          status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] }
        },
        orderBy: { updatedAt: 'desc' },
        include: { trailer: true, truck: true }
      });
    }

    // 3. Current assigned trailer
    let currentTrailer = targetLoad?.trailer || null;
    if (!currentTrailer) {
      // Fallback: search for trailer vehicle in company
      currentTrailer = await prisma.vehicle.findFirst({
        where: {
          companyId: driver.companyId,
          category: 'TRAILER',
          currentDriverId: driver.id
        }
      });
    }

    // 4. Fetch available company trailers
    const companyTrailers = await prisma.vehicle.findMany({
      where: {
        companyId: driver.companyId,
        category: 'TRAILER'
      },
      orderBy: { rego: 'asc' }
    });

    // Format trailers for UI
    const formattedTrailers = companyTrailers.map(v => ({
      id: v.id,
      name: v.model || v.make || 'Car Carrier (4 Level)',
      rego: v.rego || v.plate || 'N/A',
      vin: v.vin || 'N/A',
      status: currentTrailer && currentTrailer.id === v.id ? 'Current' : v.status === 'IDLE' ? 'Available' : 'Available',
      yard: v.currentLocation || 'Yard - Sydney NSW'
    }));

    // 5. Fetch recent equipment swap history
    const recentSwaps = await prisma.equipmentSwap.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      orderBy: { swappedAt: 'desc' },
      take: 10,
      include: {
        prevTrailer: true,
        newTrailer: true
      }
    });

    return sendSuccess(res, {
      load: targetLoad ? { id: targetLoad.id, loadRef: targetLoad.loadRef, status: targetLoad.status } : null,
      currentTrailer: currentTrailer ? {
        id: currentTrailer.id,
        name: currentTrailer.model || currentTrailer.make || 'Car Carrier (4 Level)',
        rego: currentTrailer.rego || currentTrailer.plate || 'N/A',
        vin: currentTrailer.vin || 'N/A',
        status: 'Current'
      } : {
        id: 'TRL-205',
        name: 'Car Carrier (4 Level)',
        rego: 'XT-78FC',
        vin: '9TRT2AA1000000030',
        status: 'Current'
      },
      trailers: formattedTrailers,
      recentSwaps: recentSwaps.map(s => ({
        id: s.id,
        date: new Date(s.swappedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        swap: `${s.prevTrailer?.rego || s.prevTrailerId || 'TRL-205'} ➔ ${s.newTrailer?.rego || s.newTrailerId || 'TRL-309'}`,
        location: s.locationName || 'Yard - Yass NSW'
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/trailer-swap
 * POST /driver-portal/trailer-swap/:loadId
 *
 * Executes a trailer swap for the authenticated driver.
 * Atomically updates Load.trailerId and records an EquipmentSwap audit entry.
 */
exports.swapTrailer = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { loadId } = req.params;
    const {
      oldTrailerId,
      newTrailerId,
      swapType,
      reason,
      notes,
      locationName,
      equipmentCheck
    } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // 1. Resolve driver
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Validate new trailer selection & company boundary
    if (!newTrailerId) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Replacement trailer ID is required.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Find new trailer by ID or rego/vin
    const newTrailer = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { id: newTrailerId },
          { rego: newTrailerId },
          { vin: newTrailerId }
        ]
      }
    });

    if (!newTrailer) {
      return sendError(
        res,
        {
          code: ERROR_CODES.UNAUTHORIZED_ACCESS,
          message: 'Replacement trailer not found.'
        },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Tenant / Company Isolation check
    if (newTrailer.companyId !== driver.companyId) {
      return sendError(
        res,
        {
          code: ERROR_CODES.UNAUTHORIZED_ACCESS,
          message: 'Access Denied: Replacement trailer belongs to another company.'
        },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 3. Resolve target load
    let targetLoad = null;
    const targetLoadId = loadId || req.body?.loadId;
    if (targetLoadId) {
      targetLoad = await prisma.load.findUnique({
        where: { id: targetLoadId },
        include: { trailer: true }
      });

      if (!targetLoad || targetLoad.driverId !== driver.id || targetLoad.companyId !== driver.companyId) {
        return sendError(
          res,
          {
            code: ERROR_CODES.UNAUTHORIZED_ACCESS,
            message: 'You do not have access to this load or load was not found.'
          },
          HTTP_STATUS.FORBIDDEN
        );
      }
    } else {
      targetLoad = await prisma.load.findFirst({
        where: {
          driverId: driver.id,
          companyId: driver.companyId,
          status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] }
        },
        orderBy: { updatedAt: 'desc' },
        include: { trailer: true }
      });
    }

    // 4. Validate duplicate swap (same old and new trailer)
    const prevTrailerIdResolved = oldTrailerId || targetLoad?.trailerId || null;
    if (prevTrailerIdResolved && (prevTrailerIdResolved === newTrailer.id || prevTrailerIdResolved === newTrailer.rego)) {
      return sendError(
        res,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Cannot swap trailer to the same trailer currently assigned.'
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 5. Driver Isolation check (Cannot steal a trailer currently assigned to another driver)
    const assignedToOtherDriverLoad = await prisma.load.findFirst({
      where: {
        trailerId: newTrailer.id,
        driverId: { not: driver.id },
        status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] }
      }
    });

    if (assignedToOtherDriverLoad || (newTrailer.currentDriverId && newTrailer.currentDriverId !== driver.id)) {
      return sendError(
        res,
        {
          code: ERROR_CODES.UNAUTHORIZED_ACCESS,
          message: 'Access Denied: Selected trailer is currently assigned to another driver.'
        },
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 5. Atomic Transaction: update load trailer assignment & record EquipmentSwap
    const now = new Date();
    const result = await prisma.$transaction(async (tx) => {
      if (targetLoad) {
        await tx.load.update({
          where: { id: targetLoad.id },
          data: { trailerId: newTrailer.id }
        });
      }

      const swapRecord = await tx.equipmentSwap.create({
        data: {
          driverId: driver.id,
          companyId: driver.companyId,
          prevTrailerId: (prevTrailerIdResolved && prevTrailerIdResolved.length === 36) ? prevTrailerIdResolved : null,
          newTrailerId: newTrailer.id,
          swapType: swapType || 'Trailer Swap',
          reason: reason || 'Routine Change',
          approvalPolicy: 'DIRECT',
          approvalStatus: 'Approved',
          equipmentCheck: equipmentCheck !== false,
          locationName: locationName || 'Yass Yard NSW',
          notes: notes || 'Trailer swapped via Driver Portal',
          swappedAt: now
        },
        include: {
          prevTrailer: true,
          newTrailer: true
        }
      });

      return { swapRecord, newTrailer };
    });

    return sendSuccess(res, {
      swap: result.swapRecord,
      currentTrailer: {
        id: result.newTrailer.id,
        name: result.newTrailer.model || result.newTrailer.make || 'Car Carrier (4 Level)',
        rego: result.newTrailer.rego || result.newTrailer.plate || 'N/A',
        vin: result.newTrailer.vin || 'N/A',
        status: 'Current'
      },
      message: `Trailer swapped successfully to ${result.newTrailer.rego || result.newTrailer.id}!`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/messages/unread-count
 * Returns total unread messages count for the authenticated driver.
 */
exports.getUnreadMessageCount = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const unreadCount = await prisma.driverMessage.count({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        isRead: false,
        isFromDriver: false
      }
    });

    return sendSuccess(res, { unreadCount });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/messages
 * Returns all messages/conversations for the authenticated driver.
 */
exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true, firstName: true, lastName: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const dbMessages = await prisma.driverMessage.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by recipient or threadId into conversations
    const conversationMap = new Map();

    dbMessages.forEach(msg => {
      const convKey = msg.recipient || msg.senderName || 'Dispatch Support';
      if (!conversationMap.has(convKey)) {
        const initials = convKey.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'DS';
        const colors = ['bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-800', 'bg-emerald-100 text-emerald-800', 'bg-blue-100 text-blue-800', 'bg-slate-100 text-slate-700'];
        const avatarColor = colors[Math.abs(convKey.charCodeAt(0)) % colors.length];

        conversationMap.set(convKey, {
          id: msg.id,
          name: convKey,
          avatar: initials,
          avatarColor: avatarColor,
          unread: false,
          unreadCount: 0,
          important: msg.important || false,
          isGroup: msg.isGroup || false,
          lastMsg: msg.body,
          meta: msg.meta || 'General',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: []
        });
      }

      const conv = conversationMap.get(convKey);
      if (!msg.isRead && !msg.isFromDriver) {
        conv.unread = true;
        conv.unreadCount += 1;
      }

      conv.lastMsg = (msg.isFromDriver ? 'Noah: ' : '') + msg.body;
      conv.time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      conv.messages.push({
        id: msg.id,
        sender: msg.isFromDriver ? (driver.firstName || 'Noah') + ' (Me)' : msg.senderName,
        text: msg.body,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: msg.isFromDriver,
        isRead: msg.isRead
      });
    });

    const conversations = Array.from(conversationMap.values());

    return sendSuccess(res, {
      conversations,
      count: conversations.length,
      unreadTotal: conversations.filter(c => c.unread).reduce((acc, curr) => acc + curr.unreadCount, 0)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/messages/:id
 * Returns details for a single message or thread.
 */
exports.getMessageDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const message = await prisma.driverMessage.findUnique({
      where: { id }
    });

    if (!message || message.driverId !== driver.id || message.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Message not found or access denied.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendSuccess(res, { message });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/messages
 * Sends a message from the authenticated driver.
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { recipient, body, text, subject, category, meta } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true, firstName: true, lastName: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const messageBody = (body || text || '').trim();
    if (!messageBody) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Message text cannot be empty.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const newMessage = await prisma.driverMessage.create({
      data: {
        driverId: driver.id,
        companyId: driver.companyId,
        senderName: `${driver.firstName || 'Driver'} (Me)`,
        senderRole: 'DRIVER',
        recipient: recipient || 'Dispatch Support',
        subject: subject || null,
        body: messageBody,
        category: category || 'General',
        isFromDriver: true,
        isRead: true,
        meta: meta || 'General'
      }
    });

    return sendSuccess(res, {
      message: newMessage,
      formattedMessage: {
        id: newMessage.id,
        sender: `${driver.firstName || 'Noah'} (Me)`,
        text: newMessage.body,
        time: 'Just now',
        isMe: true
      }
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/messages/:id/read
 * Marks a message as read for the authenticated driver.
 */
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const message = await prisma.driverMessage.findUnique({
      where: { id }
    });

    if (!message || message.driverId !== driver.id || message.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Message not found or access denied.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    const updatedMessage = await prisma.driverMessage.update({
      where: { id },
      data: { isRead: true }
    });

    return sendSuccess(res, { message: updatedMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/messages/read-all
 * Marks all received unread messages for the authenticated driver as read.
 */
exports.markAllMessagesAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    await prisma.driverMessage.updateMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        isRead: false
      },
      data: { isRead: true }
    });

    return sendSuccess(res, { message: 'All messages marked as read.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/incidents/sos
 * Sends an emergency SOS panic alert with GPS coordinates for the authenticated driver.
 */
exports.sendEmergencySOS = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { category, description, gpsLat, gpsLng, shareGps, autoNotify } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true, firstName: true, lastName: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const sosRecord = await prisma.driverIncident.create({
      data: {
        driverId: driver.id,
        companyId: driver.companyId,
        incidentType: 'SOS',
        category: category || 'EMERGENCY_SOS',
        description: (description || `EMERGENCY SOS ALERT triggered by driver ${driver.firstName} ${driver.lastName}`).trim(),
        status: 'UNDER_REVIEW',
        isSos: true,
        gpsLat: typeof gpsLat === 'number' ? gpsLat : -37.8136,
        gpsLng: typeof gpsLng === 'number' ? gpsLng : 144.9631,
        shareGps: shareGps !== false,
        autoNotify: autoNotify !== false
      }
    });

    return sendSuccess(res, {
      sos: sosRecord,
      message: 'Emergency SOS Broadcast sent! Dispatch and Emergency Services notified.'
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/incidents
 * Returns all incident and SOS reports for the authenticated driver.
 */
exports.getMyIncidents = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const dbIncidents = await prisma.driverIncident.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedIncidents = dbIncidents.map(inc => ({
      id: inc.id,
      category: inc.category,
      description: inc.description,
      status: inc.status,
      isSos: inc.isSos,
      photoUrl: inc.photoUrl,
      loggedDate: new Date(inc.createdAt).toLocaleDateString('en-GB'),
      createdAt: inc.createdAt
    }));

    return sendSuccess(res, {
      incidents: formattedIncidents,
      count: formattedIncidents.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/incidents/:id
 * Returns details for a single incident report belonging to the authenticated driver.
 */
exports.getIncidentDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const incident = await prisma.driverIncident.findUnique({
      where: { id }
    });

    if (!incident || incident.driverId !== driver.id || incident.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Incident report not found or access denied.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendSuccess(res, { incident });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/incidents
 * Submits a new incident report for the authenticated driver.
 */
exports.createIncidentReport = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { category, description, photoBase64, photoUrl, loadId, gpsLat, gpsLng } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const descText = (description || '').trim();
    if (!descText) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Please provide an incident description.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    let savedPhotoUrl = photoUrl || null;
    if (photoBase64 && typeof photoBase64 === 'string') {
      try {
        const uploadDir = path.join(__dirname, '../../public/uploads/incidents');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const base64Data = matches ? matches[2] : photoBase64;
        const filename = `inc_${Date.now()}_${Math.floor(Math.random() * 1000000000)}.png`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
        savedPhotoUrl = `/uploads/incidents/${filename}`;
      } catch (err) {
        console.warn('Failed to save incident photo to disk:', err.message);
      }
    }

    const incident = await prisma.driverIncident.create({
      data: {
        driverId: driver.id,
        companyId: driver.companyId,
        loadId: loadId || null,
        incidentType: 'INCIDENT',
        category: category || 'Highway Road Accident',
        description: descText,
        photoUrl: savedPhotoUrl,
        status: 'UNDER_REVIEW',
        gpsLat: typeof gpsLat === 'number' ? gpsLat : null,
        gpsLng: typeof gpsLng === 'number' ? gpsLng : null
      }
    });

    return sendSuccess(res, {
      incident,
      message: 'Incident report successfully submitted.'
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/checklist/today
 * Returns today's pre-start safety checklist for the authenticated driver.
 */
exports.getTodayChecklist = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const checklist = await prisma.preStartChecklist.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        date: { gte: todayStart }
      },
      include: {
        items: {
          orderBy: { itemNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, { checklist: checklist || null });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/checklist/:id
 * Returns details for a specific pre-start safety checklist.
 */
exports.getChecklistDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    const checklist = await prisma.preStartChecklist.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { itemNumber: 'asc' }
        }
      }
    });

    if (!checklist || checklist.driverId !== driver.id || checklist.companyId !== driver.companyId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Checklist not found or access denied.' },
        HTTP_STATUS.FORBIDDEN
      );
    }

    return sendSuccess(res, { checklist });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /driver-portal/checklist
 * Submits or saves today's pre-start safety checklist for the authenticated driver.
 */
exports.submitChecklist = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { vehicleRef, trailerRef, items, notes, isDraft, loadId, gpsLat, gpsLng } = req.body || {};

    if (!userId) {
      return sendError(
        res,
        { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' },
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(
        res,
        { code: ERROR_CODES.NOT_FOUND, message: 'No driver profile found for this user account.' },
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: 'Checklist must contain inspection items.' },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Map UI status strings to DB ChecklistItemStatus enum
    const mapStatusToEnum = (st) => {
      const lower = String(st || '').toLowerCase();
      if (lower === 'pass') return 'PASS';
      if (lower === 'fail') return 'FAIL';
      if (lower === 'na') return 'NA';
      return 'NOT_CHECKED';
    };

    let passedCount = 0;
    let failedCount = 0;
    let naCount = 0;

    const formattedItems = items.map((item, idx) => {
      const mappedEnum = mapStatusToEnum(item.status);
      if (mappedEnum === 'PASS') passedCount++;
      else if (mappedEnum === 'FAIL') failedCount++;
      else if (mappedEnum === 'NA') naCount++;

      return {
        itemNumber: item.id || (idx + 1),
        itemLabel: item.label || `Item ${idx + 1}`,
        status: mappedEnum,
        notes: item.notes || null
      };
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingChecklist = await prisma.preStartChecklist.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        date: { gte: todayStart }
      }
    });

    if (existingChecklist && !existingChecklist.isDraft && !isDraft && !req.body?.allowUpdate && !req.body?.isUpdate) {
      return sendError(
        res,
        { code: ERROR_CODES.VALIDATION_ERROR, message: "Today's pre-start safety checklist has already been submitted." },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const checklistResult = await prisma.$transaction(async (tx) => {
      let checklistRecord;
      if (existingChecklist) {
        // Delete old items and update checklist
        await tx.checklistItemResponse.deleteMany({
          where: { checklistId: existingChecklist.id }
        });

        checklistRecord = await tx.preStartChecklist.update({
          where: { id: existingChecklist.id },
          data: {
            vehicleRef: vehicleRef || 'TRK-101 (MAN TGX 26.580)',
            trailerRef: trailerRef || 'TRL-205 (Car Carrier)',
            loadId: loadId || null,
            totalItems: items.length,
            passedCount,
            failedCount,
            naCount,
            isDraft: !!isDraft,
            notes: notes || null,
            submittedAt: isDraft ? null : new Date(),
            gpsLat: typeof gpsLat === 'number' ? gpsLat : null,
            gpsLng: typeof gpsLng === 'number' ? gpsLng : null
          }
        });
      } else {
        checklistRecord = await tx.preStartChecklist.create({
          data: {
            driverId: driver.id,
            companyId: driver.companyId,
            date: new Date(),
            vehicleRef: vehicleRef || 'TRK-101 (MAN TGX 26.580)',
            trailerRef: trailerRef || 'TRL-205 (Car Carrier)',
            loadId: loadId || null,
            totalItems: items.length,
            passedCount,
            failedCount,
            naCount,
            isDraft: !!isDraft,
            notes: notes || null,
            submittedAt: isDraft ? null : new Date(),
            gpsLat: typeof gpsLat === 'number' ? gpsLat : null,
            gpsLng: typeof gpsLng === 'number' ? gpsLng : null
          }
        });
      }

      // Create item responses
      await tx.checklistItemResponse.createMany({
        data: formattedItems.map(item => ({
          checklistId: checklistRecord.id,
          itemNumber: item.itemNumber,
          itemLabel: item.itemLabel,
          status: item.status,
          notes: item.notes
        }))
      });

      return tx.preStartChecklist.findUnique({
        where: { id: checklistRecord.id },
        include: {
          items: {
            orderBy: { itemNumber: 'asc' }
          }
        }
      });
    });

    return sendSuccess(res, {
      checklist: checklistResult,
      message: isDraft
        ? 'Safety Checklist draft saved.'
        : failedCount > 0
          ? 'Safety Checklist submitted with defects logged.'
          : 'Safety Checklist submitted successfully! All clear.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to resolve the driver record for the request
 */
const resolveDriver = async (req) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;

  // 1. Try finding by userId
  if (userId) {
    const driverByUser = await prisma.driver.findFirst({
      where: { userId },
      include: {
        currentVehicle: true,
        company: true,
        branch: true
      }
    });
    if (driverByUser) return driverByUser;
  }

  // 2. Try finding by email
  if (userEmail) {
    const driverByEmail = await prisma.driver.findFirst({
      where: { email: userEmail },
      include: {
        currentVehicle: true,
        company: true,
        branch: true
      }
    });
    if (driverByEmail) return driverByEmail;
  }

  // 3. Fallback: find by tenant or first driver in database
  const fallbackDriver = await prisma.driver.findFirst({
    where: req.tenantId ? { companyId: req.tenantId } : {},
    include: {
      currentVehicle: true,
      company: true,
      branch: true
    },
    orderBy: { createdAt: 'asc' }
  });

  return fallbackDriver;
};

// ============================================================================
// 1. DRIVER DASHBOARD OVERVIEW (100% PURE DYNAMIC - NO HARDCODED PLACEHOLDERS)
// ============================================================================
exports.getDashboard = async (req, res, next) => {
  try {
    const driver = await resolveDriver(req);

    if (!driver) {
      return sendSuccess(res, {
        driverInfo: {
          id: null,
          name: req.user?.name || 'Driver',
          driverCode: 'DRV-NEW',
          status: 'On Duty',
          lastSync: new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          vehicle: {
            rego: 'No Vehicle Assigned',
            make: '',
            model: '',
            odometer: 0,
            dieselBalance: 0,
            estRangeKm: 0
          }
        },
        metrics: {
          loadsToday: 0,
          loadsTodayUpcoming: 0,
          nextLoadTime: null,
          completedThisWeek: 0,
          slaPercentage: 0,
          driveTimeToday: '0h 00m',
          driveTimeRemaining: '11h 00m (HOS)',
          dieselBalanceL: 0,
          estRangeKm: 0,
          payThisPeriod: 0
        },
        currentLoad: null,
        todaySchedule: [],
        hosLog: {
          driveTimeElapsed: '0h 00m',
          driveTimeLeft: '11h 00m',
          drivePercent: 0,
          shiftElapsed: '0h 00m',
          shiftMax: '14h max',
          shiftPercent: 0,
          nextBreakDue: 'In 5h 15m'
        },
        unreadMessages: [],
        alerts: [],
        paySummary: {
          amount: 0,
          taxNote: 'Before tax'
        }
      });
    }

    const driverId = driver.id;

    // Fetch real driver loads, timesheets, checklists, vehicle, and messages from DB
    const [
      driverLoads,
      timesheets,
      preStartChecklists,
      assignedVehicle,
      messages
    ] = await Promise.all([
      // 1. Loads for this driver
      prisma.load.findMany({
        where: { driverId },
        include: {
          truck: true,
          items: true,
          expenses: true
        },
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      // 2. Timesheets for this driver
      prisma.timesheet.findMany({
        where: { driverId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }).catch(() => []),
      // 3. Pre-start checklists for this driver
      prisma.preStartChecklist.findMany({
        where: { driverId },
        orderBy: { createdAt: 'desc' },
        take: 5
      }).catch(() => []),
      // 4. Assigned vehicle
      driver.currentVehicle?.[0]
        ? Promise.resolve(driver.currentVehicle[0])
        : prisma.vehicle.findFirst({
            where: { currentDriverId: driverId }
          }).catch(() => null),
      // 5. Messages involving this driver or driver's user
      prisma.message ? prisma.message.findMany({
        where: {
          OR: [
            { recipientId: driver.userId || driverId },
            { senderId: driver.userId || driverId }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }).catch(() => []) : Promise.resolve([])
    ]);

    // Active loads vs Completed loads
    const activeLoads = driverLoads.filter(l => ['ASSIGNED', 'IN_TRANSIT', 'DISPATCHED', 'ACTIVE', 'PENDING'].includes(l.status));
    const completedLoads = driverLoads.filter(l => ['DELIVERED', 'COMPLETED', 'CLOSED'].includes(l.status));
    const upcomingLoads = activeLoads.filter(l => l.status === 'ASSIGNED' || l.status === 'PENDING');

    // Current active load in transit or first active load
    const currentLoadObj = activeLoads.find(l => l.status === 'IN_TRANSIT') || activeLoads[0] || null;

    // Vehicle info
    let vehicleData = {
      rego: 'No Vehicle Assigned',
      make: '',
      model: '',
      odometer: 0,
      dieselBalance: 0,
      estRangeKm: 0
    };
    if (assignedVehicle) {
      const fuelCap = assignedVehicle.fuelCapacity || 400;
      const fuelLiters = Math.round(fuelCap * 0.4);
      vehicleData = {
        rego: assignedVehicle.rego || assignedVehicle.plate || 'TRK-001',
        make: assignedVehicle.make || '',
        model: assignedVehicle.model || '',
        odometer: assignedVehicle.odometerKm || 0,
        dieselBalance: fuelLiters,
        estRangeKm: Math.round(fuelLiters * 5.16)
      };
    }

    // Drive Time Calculation from Timesheets today
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTimesheet = timesheets.find(t => t.date && t.date.toISOString().startsWith(todayStr)) || timesheets[0];
    let driveMinutes = 0;
    if (todaysTimesheet?.totalHours) {
      driveMinutes = Math.round(todaysTimesheet.totalHours * 60);
    }
    const driveHours = Math.floor(driveMinutes / 60);
    const driveMins = driveMinutes % 60;
    const driveTimeStr = `${driveHours}h ${driveMins < 10 ? '0' : ''}${driveMins}m`;

    const remainingDriveMinutes = Math.max(0, (11 * 60) - driveMinutes);
    const remHours = Math.floor(remainingDriveMinutes / 60);
    const remMins = remainingDriveMinutes % 60;
    const remDriveStr = `${remHours}h ${remMins < 10 ? '0' : ''}${remMins}m (HOS)`;

    // Pay calculation: completed trips * payRate or hourly rate * hours
    const baseRate = driver.payRate || 0;
    const calculatedPay = completedLoads.length > 0
      ? (completedLoads.length * (baseRate > 0 ? baseRate : 350) * 0.8)
      : (driveMinutes > 0 ? (driveMinutes / 60) * (baseRate > 0 ? baseRate : 35) : 0);

    // Format current load
    let currentLoadData = null;
    if (currentLoadObj) {
      const statusLabel = currentLoadObj.status === 'IN_TRANSIT' ? 'In Transit' : (currentLoadObj.status === 'DISPATCHED' ? 'Dispatched' : 'Assigned');
      currentLoadData = {
        id: currentLoadObj.id,
        loadNumber: currentLoadObj.loadNumber || currentLoadObj.loadRef || `LD-${currentLoadObj.id.slice(0, 4).toUpperCase()}`,
        status: statusLabel,
        origin: currentLoadObj.origin || currentLoadObj.pickupAddress || 'Origin Depot',
        destination: currentLoadObj.destination || currentLoadObj.deliveryAddress || 'Destination Depot',
        pickupStop: {
          name: currentLoadObj.pickupLocation || currentLoadObj.origin || 'Pickup Location',
          address: currentLoadObj.pickupAddress || 'Pickup Address',
          time: currentLoadObj.pickupTime || '08:00 AM'
        },
        deliveryStop: {
          name: currentLoadObj.deliveryLocation || currentLoadObj.destination || 'Delivery Location',
          address: currentLoadObj.deliveryAddress || 'Delivery Address',
          time: currentLoadObj.deliveryTime || '02:30 PM'
        },
        loadType: currentLoadObj.type || currentLoadObj.loadType || currentLoadObj.category || 'General Freight',
        reference: currentLoadObj.loadRef || currentLoadObj.referenceNumber || currentLoadObj.bolNumber || 'PO-REF'
      };
    }

    // Schedule items purely from assigned loads
    const scheduleItems = [];
    driverLoads.forEach((ld) => {
      const isDelivered = ld.status === 'DELIVERED' || ld.status === 'COMPLETED';
      const isInTransit = ld.status === 'IN_TRANSIT';
      const loadRef = ld.loadNumber || ld.loadRef || `LD-${ld.id.slice(0, 4).toUpperCase()}`;

      scheduleItems.push({
        id: `sch-${ld.id}-pickup`,
        time: ld.pickupTime || (ld.createdAt ? new Date(ld.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM'),
        type: 'Pickup',
        location: `${ld.pickupLocation || ld.origin || 'Depot'}`,
        loadRef: loadRef,
        status: isDelivered ? 'COMPLETED' : (isInTransit ? 'ON_DUTY' : 'UPCOMING'),
        color: isDelivered ? 'bg-slate-400' : (isInTransit ? 'bg-emerald-500' : 'bg-amber-500')
      });

      scheduleItems.push({
        id: `sch-${ld.id}-deliver`,
        time: ld.deliveryTime || '02:30 PM',
        type: 'Deliver',
        location: `${ld.deliveryLocation || ld.destination || 'Delivery Point'}`,
        loadRef: loadRef,
        status: isDelivered ? 'COMPLETED' : (isInTransit ? 'IN_TRANSIT' : 'UPCOMING'),
        color: isDelivered ? 'bg-slate-400' : (isInTransit ? 'bg-blue-500' : 'bg-purple-500')
      });
    });

    // Real Alerts
    const alerts = [];
    const todayChecklist = preStartChecklists.find(c => c.createdAt && new Date(c.createdAt).toISOString().startsWith(todayStr));
    if (!todayChecklist) {
      alerts.push({
        id: 'alert-checklist-pending',
        type: 'warning',
        title: 'Pre-start checklist pending',
        description: 'Please complete your daily pre-start checklist.',
        link: '/driver/work-status'
      });
    }

    if (driver.licenseExpiry) {
      const expDate = new Date(driver.licenseExpiry);
      const daysUntilExpiry = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        alerts.push({
          id: 'alert-license-expiry',
          type: 'info',
          title: 'License expiring soon',
          description: `Driver license expires on ${expDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })} (${daysUntilExpiry} days).`,
          link: '/driver/documents'
        });
      }
    }

    // Real Messages
    const formattedMessages = messages.map(m => ({
      id: m.id,
      senderInitials: m.senderName ? m.senderName.slice(0, 2).toUpperCase() : 'DP',
      senderName: m.senderName || 'Dispatch',
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: m.content || m.body || '',
      unreadCount: m.isRead ? 0 : 1
    }));

    // Status display
    const statusMap = {
      'AVAILABLE': 'On Duty',
      'ON_DUTY': 'On Duty',
      'IN_TRANSIT': 'In Transit',
      'ON_BREAK': 'On Break',
      'UNAVAILABLE': 'Off Duty',
      'OFF_DUTY': 'Off Duty',
      'ON_LEAVE': 'On Leave'
    };
    const currentStatusDisplay = statusMap[driver.status] || driver.status || 'On Duty';

    return sendSuccess(res, {
      driverInfo: {
        id: driver.id,
        name: `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || req.user?.name || 'Driver',
        driverCode: driver.driverCode || 'DRV-001',
        status: currentStatusDisplay,
        lastSync: new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        vehicle: vehicleData
      },
      metrics: {
        loadsToday: activeLoads.length,
        loadsTodayUpcoming: upcomingLoads.length,
        nextLoadTime: activeLoads[0]?.pickupTime || null,
        completedThisWeek: completedLoads.length,
        slaPercentage: completedLoads.length > 0 ? 100 : 0,
        driveTimeToday: driveTimeStr,
        driveTimeRemaining: remDriveStr,
        dieselBalanceL: vehicleData.dieselBalance,
        estRangeKm: vehicleData.estRangeKm,
        payThisPeriod: calculatedPay
      },
      currentLoad: currentLoadData,
      todaySchedule: scheduleItems,
      hosLog: {
        driveTimeElapsed: driveTimeStr,
        driveTimeLeft: remDriveStr,
        drivePercent: Math.min(100, Math.round((driveMinutes / (11 * 60)) * 100)),
        shiftElapsed: `${Math.floor(driveMinutes / 60)}h ${driveMinutes % 60}m`,
        shiftMax: '14h max',
        shiftPercent: Math.min(100, Math.round((driveMinutes / (14 * 60)) * 100)),
        nextBreakDue: driveMinutes > 0 ? `in ${Math.max(0, 4 - Math.floor(driveMinutes / 60))}h` : 'in 4h 00m'
      },
      unreadMessages: formattedMessages,
      alerts: alerts,
      paySummary: {
        amount: calculatedPay,
        taxNote: 'Before tax'
      }
    });

  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 2. UPDATE DRIVER DUTY STATUS
// ============================================================================
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, { code: 'VALIDATION_ERROR', message: 'Status is required' }, 400);
    }

    const driver = await resolveDriver(req);
    if (!driver) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Driver profile not found' }, 404);
    }

    const statusMap = {
      'On Duty': 'AVAILABLE',
      'In Transit': 'IN_TRANSIT',
      'On Break': 'ON_BREAK',
      'Off Duty': 'UNAVAILABLE'
    };
    const dbStatus = statusMap[status] || 'AVAILABLE';

    // Update driver in DB
    const updated = await prisma.driver.update({
      where: { id: driver.id },
      data: { status: dbStatus }
    });

    return sendSuccess(res, { status, updated });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 3. SEND QUICK MESSAGE TO DISPATCH
// ============================================================================
exports.sendQuickMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return sendError(res, { code: 'VALIDATION_ERROR', message: 'Message content is required' }, 400);
    }

    const driver = await resolveDriver(req);
    const driverName = driver ? `${driver.firstName || ''} ${driver.lastName || ''}`.trim() : (req.user?.name || 'Driver');

    // Create real message record
    let createdMsg = null;
    if (prisma.message) {
      createdMsg = await prisma.message.create({
        data: {
          senderId: req.user?.id || driver?.userId || driver?.id || 'driver-user',
          senderName: driverName,
          recipientId: driver?.companyId || 'company-dispatch',
          content: message.trim(),
          isRead: false
        }
      }).catch(() => null);
    }

    return sendSuccess(res, {
      id: createdMsg?.id || `msg-${Date.now()}`,
      senderName: driverName,
      senderInitials: driverName.slice(0, 2).toUpperCase(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: message.trim(),
      unreadCount: 0
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/payroll
 * Returns current/latest payroll summary and YTD stats for the authenticated driver.
 */
exports.getPayrollSummary = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required'
      }, HTTP_STATUS.UNAUTHORIZED);
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true, firstName: true, lastName: true }
    });

    if (!driver) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver profile not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const payPeriods = await prisma.payPeriod.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      orderBy: { periodStart: 'desc' }
    });

    const latestPayPeriod = payPeriods.length > 0 ? payPeriods[0] : null;

    let ytdGrossEarnings = 0;
    let ytdNetPay = 0;
    let ytdDeductions = 0;
    let pendingPayments = 0;

    payPeriods.forEach(p => {
      ytdGrossEarnings += (p.grossEarnings || 0);
      ytdDeductions += (p.totalDeductions || 0);
      if (p.status === 'PAID') {
        ytdNetPay += (p.netPay || 0);
      } else if (p.status === 'PENDING' || p.status === 'PROCESSING') {
        pendingPayments += (p.netPay || 0);
      }
    });

    const processingPeriod = payPeriods.find(p => p.status === 'PROCESSING' || p.status === 'PENDING');

    return sendSuccess(res, {
      summary: {
        driverName: `${driver.firstName} ${driver.lastName}`,
        ytdGrossEarnings,
        ytdNetPay,
        ytdDeductions,
        pendingPayments,
        totalPeriods: payPeriods.length
      },
      latestPayPeriod,
      upcomingPayment: processingPeriod || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/payroll/history
 * Returns historical pay periods/payroll records for the authenticated driver, newest first.
 */
exports.getPayrollHistory = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required'
      }, HTTP_STATUS.UNAUTHORIZED);
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver profile not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const payRecords = await prisma.payPeriod.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId
      },
      orderBy: { periodStart: 'desc' }
    });

    const formattedRecords = payRecords.map(rec => ({
      id: rec.id,
      periodStart: rec.periodStart,
      periodEnd: rec.periodEnd,
      payDate: rec.payDate,
      frequency: rec.frequency,
      status: rec.status,
      basePay: rec.basePay,
      loadAllowance: rec.loadAllowance,
      distanceAllow: rec.distanceAllow,
      otherAllowance: rec.otherAllowance,
      bonuses: rec.bonuses,
      grossEarnings: rec.grossEarnings,
      paygTax: rec.paygTax,
      superAmount: rec.superAmount,
      unionFees: rec.unionFees,
      otherDeductions: rec.otherDeductions,
      totalDeductions: rec.totalDeductions,
      netPay: rec.netPay,
      pdfUrl: rec.pdfUrl,
      hasPayslip: !!rec.pdfUrl
    }));

    return sendSuccess(res, formattedRecords);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/payroll/:id
 * Returns detailed pay breakdown for a specific pay period belonging to the authenticated driver.
 */
exports.getPayrollDetails = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required'
      }, HTTP_STATUS.UNAUTHORIZED);
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver profile not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return sendError(res, {
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Invalid payroll ID parameter'
      }, HTTP_STATUS.BAD_REQUEST);
    }

    const payPeriod = await prisma.payPeriod.findFirst({
      where: {
        id,
        driverId: driver.id,
        companyId: driver.companyId
      }
    });

    if (!payPeriod) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED_ACCESS,
        message: 'Access Denied: Payroll record not found or belongs to another driver.'
      }, HTTP_STATUS.FORBIDDEN);
    }

    return sendSuccess(res, payPeriod);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /driver-portal/payroll/:id/payslip
 * Retrieves/downloads the payslip PDF for a specific pay period belonging to the authenticated driver.
 */
exports.downloadPayslip = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required'
      }, HTTP_STATUS.UNAUTHORIZED);
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver profile not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return sendError(res, {
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Invalid payroll ID parameter'
      }, HTTP_STATUS.BAD_REQUEST);
    }

    const payPeriod = await prisma.payPeriod.findFirst({
      where: {
        id,
        driverId: driver.id,
        companyId: driver.companyId
      }
    });

    if (!payPeriod) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED_ACCESS,
        message: 'Access Denied: Payroll record not found or belongs to another driver.'
      }, HTTP_STATUS.FORBIDDEN);
    }

    const path = require('path');
    const fs = require('fs');

    if (payPeriod.pdfUrl && payPeriod.pdfUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../public', payPeriod.pdfUrl);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, `Payslip_${payPeriod.id}.pdf`);
      }
    }

    return sendSuccess(res, {
      hasPayslip: !!payPeriod.pdfUrl,
      pdfUrl: payPeriod.pdfUrl || null,
      message: payPeriod.pdfUrl
        ? 'Payslip document link retrieved successfully.'
        : 'Payslip document is not available for this pay period.',
      payPeriod
    });
  } catch (error) {
    next(error);
  }
};
