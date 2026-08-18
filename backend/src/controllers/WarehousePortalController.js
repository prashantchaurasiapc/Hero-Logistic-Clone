const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

const checkManagerAccess = (req) => {
  const role = req.user?.role;
  if (role === 'SUPER_ADMIN' || role === 'PLATFORM_OWNER' || role === 'COMPANY_ADMIN' || role === 'WAREHOUSE' || role === 'YARD') return true;
  if (req.user?.permissions?.includes('warehouse.overrides.use')) return true;
  return false;
};

// ============================================================================
// 1. WAREHOUSE DASHBOARD & OVERVIEW
// ============================================================================

exports.getDashboard = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    // Parallel fetch of live KPIs and dashboard tables
    const [
      inboundPendingCount,
      inYardItemsCount,
      toMoveCount,
      activeLanesCount,
      dispatchReadyLoadsCount,
      inboundTodayList,
      loadLanesList,
      recentMovementsList,
      warehouseRecord,
      recentReceipts
    ] = await Promise.all([
      // 1. Inbound Awaiting
      prisma.inboundReceipt.count({
        where: {
          status: { in: ['Pending', 'Receiving', 'PENDING'] },
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      // 2. In Yard Items
      prisma.loadItem.count({
        where: {
          stockStatus: { in: ['IN_STORAGE', 'STAGED'] },
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      // 3. To Move Tasks
      prisma.loadItem.count({
        where: {
          stockStatus: { in: ['TO_MOVE'] },
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      // 4. Active Load Lanes
      prisma.loadLane.count({
        where: {
          status: { in: ['ACTIVE'] },
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      // 5. Dispatch Ready
      prisma.load.count({
        where: {
          status: { in: ['PLANNED', 'ASSIGNED'] },
          ...(tenantId && { companyId: tenantId })
        }
      }),
      // 6. Inbound Today Receipts (Filtered by tenantId)
      prisma.inboundReceipt.findMany({
        where: {
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        },
        take: 6,
        orderBy: { receivingDate: 'desc' },
        include: {
          items: true,
          stagingArea: true
        }
      }),
      // 7. Load Lanes Overview (Filtered by tenantId)
      prisma.loadLane.findMany({
        where: {
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        },
        take: 8,
        orderBy: { name: 'asc' },
        include: {
          loads: {
            take: 1,
            include: { driver: true, truck: true, trailer: true }
          },
          loadItems: true
        }
      }),
      // 8. Recent Movements (Filtered by tenantId)
      prisma.itemMovement.findMany({
        where: {
          ...(tenantId && { item: { warehouse: { branch: { companyId: tenantId } } } })
        },
        take: 8,
        orderBy: { timestamp: 'desc' },
        include: {
          item: true,
          performedBy: true
        }
      }),
      // 9. Warehouse Capacity (Filtered by tenantId)
      prisma.warehouse.findFirst({
        where: { ...(tenantId && { branch: { companyId: tenantId } }) }
      }),
      // 10. Additional query for dynamic notifications
      prisma.inboundReceipt.findMany({
        where: {
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        },
        take: 3,
        orderBy: { receivingDate: 'desc' }
      })
    ]);

    // Format Inbound Today items
    const formattedInboundToday = inboundTodayList.map(r => ({
      id: r.id,
      receiptNo: r.receiptNo || 'GR-1023',
      from: r.supplier || '-',
      supplier: r.supplier || '-',
      itemsCount: r.items?.length || 0,
      items: `${r.items?.length || 0} Items`,
      status: r.status || 'Pending',
      time: r.receivingDate ? new Date(r.receivingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      date: r.receivingDate
    }));

    // Format Load Lanes Overview
    const formattedLoadLanes = loadLanesList.map(lane => {
      const activeLoad = lane.loads?.[0];
      const itemCount = lane.loadItems?.length || 0;
      return {
        id: lane.id,
        lane: lane.name || 'Lane',
        load: activeLoad?.loadRef || activeLoad?.draftId || '-',
        current: itemCount,
        total: 10,
        status: lane.status === 'ACTIVE' ? 'In Progress' : (lane.status || 'Empty'),
        barColor: lane.status === 'Hold' ? '#EF4444' : (itemCount > 5 ? '#3B82F6' : '#F59E0B'),
        driver: activeLoad?.driver?.licenseNumber || '-',
        trailer: activeLoad?.trailer?.rego || '-'
      };
    });

    // Format Recent Movements
    const formattedMovements = recentMovementsList.map(m => ({
      id: m.id,
      time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      item: m.item?.rego || m.item?.vin || m.item?.stockRef || 'Item',
      action: m.type || m.reason || 'Moved',
      location: m.toLocation || '-',
      staff: m.performedBy?.name || 'Staff'
    }));

    const totalCapacity = warehouseRecord?.palletCapacity || 200;
    const inYardCount = inYardItemsCount || 0;
    const availableCapacity = Math.max(0, totalCapacity - inYardCount);
    const usedPercentage = Math.min(100, Math.round((inYardCount / totalCapacity) * 100)) || 0;

    // Generate Dynamic Notifications
    const notifications = [];
    recentReceipts.forEach((r, idx) => {
      notifications.push({
        id: `rc-${r.id}`,
        title: `Inbound receipt ${r.receiptNo} received from ${r.supplier}`,
        time: r.receivingDate ? new Date(r.receivingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: idx > 0
      });
    });
    recentMovementsList.slice(0, 3).forEach((m, idx) => {
      notifications.push({
        id: `mv-${m.id}`,
        title: `Item ${m.item?.rego || m.item?.vin?.slice(-6) || 'Stock'} moved: ${m.type} to ${m.toLocation}`,
        time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: idx > 0
      });
    });
    if (notifications.length === 0) {
      notifications.push(
        { id: '1', title: 'Load Lane monitoring initialized', time: 'Just now', read: false }
      );
    }

    return sendSuccess(res, {
      overview: {
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        onlineStatus: 'Online',
        inboundAwaiting: inboundPendingCount,
        inYard: inYardCount,
        toMove: toMoveCount,
        loadLanes: activeLanesCount,
        dispatchReady: dispatchReadyLoadsCount,
        yardCapacity: {
          total: totalCapacity,
          inYard: inYardCount,
          available: availableCapacity,
          usedPercent: usedPercentage
        }
      },
      inboundToday: formattedInboundToday,
      loadLanesOverview: formattedLoadLanes,
      recentMovements: formattedMovements,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const [recentReceipts, recentMovements] = await Promise.all([
      prisma.inboundReceipt.findMany({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) },
        take: 3,
        orderBy: { receivingDate: 'desc' }
      }),
      prisma.itemMovement.findMany({
        where: { ...(tenantId && { item: { warehouse: { branch: { companyId: tenantId } } } }) },
        take: 3,
        orderBy: { timestamp: 'desc' },
        include: { item: true }
      })
    ]);

    const notifications = [];
    recentReceipts.forEach((r, idx) => {
      notifications.push({
        id: `rc-${r.id}`,
        title: `Inbound receipt ${r.receiptNo} received from ${r.supplier}`,
        time: r.receivingDate ? new Date(r.receivingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: idx > 0,
        type: 'inbound'
      });
    });
    recentMovements.forEach((m, idx) => {
      notifications.push({
        id: `mv-${m.id}`,
        title: `Item ${m.item?.rego || m.item?.vin?.slice(-6) || 'Stock'} moved: ${m.type} to ${m.toLocation}`,
        time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: idx > 0,
        type: 'movement'
      });
    });
    if (notifications.length === 0) {
      notifications.push(
        { id: '1', title: 'System initialized, monitoring alerts.', time: 'Just now', read: false, type: 'assignment' }
      );
    }
    return sendSuccess(res, notifications);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 2. FIND STOCK / STOCK INVENTORY
// ============================================================================

exports.getStock = async (req, res, next) => {
  try {
    const {
      search, type, location, status, loadJob, customer,
      zone, row, bay, stagingArea, sort, page = 1, limit = 25
    } = req.query;

    const where = {};
    if (req.tenantId) {
      where.warehouse = { branch: { companyId: req.tenantId } };
    }

    if (search) {
      where.OR = [
        { vin: { contains: search } },
        { rego: { contains: search } },
        { stockRef: { contains: search } },
        { make: { contains: search } },
        { model: { contains: search } },
        { notes: { contains: search } }
      ];
    }

    if (type && type !== 'All Types' && type !== 'All') {
      where.vehicleType = { contains: type };
    }

    if (location && location !== 'All Locations' && location !== 'All') {
      where.OR = [
        { zone: { contains: location } },
        { warehouse: { name: { contains: location } } }
      ];
    }

    if (status && status !== 'All Statuses' && status !== 'All') {
      where.stockStatus = status.toUpperCase().replace(/\s+/g, '_');
    }

    if (zone && zone !== 'All Zones' && zone !== 'All') where.zone = zone;
    if (row && row !== 'All Rows' && row !== 'All') where.row = row;
    if (bay && bay !== 'All Bays' && bay !== 'All') where.bay = bay;
    if (stagingArea && stagingArea !== 'All Staging Areas' && stagingArea !== 'All') {
      where.stagingArea = { name: { contains: stagingArea } };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const orderBy = sort === 'name' ? { make: 'asc' } : { receivedDate: 'desc' };

    const [items, total] = await Promise.all([
      prisma.loadItem.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          load: { include: { customer: true } },
          customer: true,
          warehouse: true,
          loadLane: true,
          stagingArea: true,
          photos: true
        }
      }),
      prisma.loadItem.count({ where })
    ]);

    const formatted = items.map(item => ({
      id: item.id,
      itemNo: item.rego || item.stockRef || item.vin?.slice(-6) || 'ABC123',
      title: item.make && item.model ? `${item.make} ${item.model}` : (item.stockRef || 'Inventory Item'),
      rego: item.rego || 'ABC123',
      vin: item.vin || 'JTDBE32K203456789',
      make: item.make || 'Toyota',
      model: item.model || 'Camry',
      year: item.year || 2023,
      color: item.color || 'White',
      type: item.vehicleType || 'Vehicle',
      typeBadge: item.vehicleType === 'Pallet' ? 'General Freight' : 'Car Carrying',
      typeColor: item.vehicleType === 'Pallet' ? 'green' : 'blue',
      location: item.zone || 'Yard A',
      locationDetail: `${item.zone || 'Yard A'} / ${item.row || 'R4'} / ${item.bay || 'B12'} / ${item.position || 'P01'}`,
      rowBayPos: `${item.row || 'Row 4'} / ${item.bay || 'Bay 12'} / ${item.position || 'Position 01'}`,
      status: item.stockStatus?.replace(/_/g, ' ') || 'In Storage',
      statusColor: item.stockStatus === 'STAGED' ? 'blue' : (item.stockStatus === 'READY' ? 'green-outline' : 'green'),
      loadJob: item.load?.loadRef || item.load?.draftId || 'LD-3987',
      loadDetail: item.loadLane?.name || 'Load Lane 4',
      customer: item.customer?.companyName || item.load?.customer?.companyName || 'ABC Motors',
      updated: item.receivedDate ? new Date(item.receivedDate).toLocaleDateString('en-GB') : '21/07/2026',
      receivedDate: item.receivedDate ? new Date(item.receivedDate).toLocaleDateString('en-GB') : '19/07/2026 09:15 AM',
      condition: item.damageReportReq ? 'Damage Noted' : 'Good',
      notes: item.notes || '-',
      iconType: item.vehicleType === 'Pallet' ? 'pallet' : (item.vehicleType === 'Container' ? 'container' : 'car')
    }));

    return sendList(res, formatted, {
      total,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

exports.getStockById = async (req, res, next) => {
  try {
    const item = await prisma.loadItem.findUnique({
      where: { id: req.params.id },
      include: {
        load: { include: { customer: true, driver: true, truck: true, trailer: true } },
        customer: true,
        warehouse: { include: { branch: true } },
        loadLane: true,
        stagingArea: true,
        photos: true,
        movements: {
          orderBy: { timestamp: 'desc' },
          include: { performedBy: true }
        }
      }
    });

    // Not found — return 404 without revealing whether it belongs to another tenant
    if (!item) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Stock item not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    // Tenant ownership check — item must belong to the authenticated tenant
    if (req.tenantId && item.warehouse?.branch?.companyId !== req.tenantId) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Stock item not found'
      }, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, item);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 3. MOVE & TRANSFER STOCK
// ============================================================================

exports.moveStock = async (req, res, next) => {
  try {
    const { itemId, toZone, toRow, toBay, toPosition, toLaneId, toStagingAreaId, reason, moveType } = req.body;
    if (!itemId) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Item ID is required for stock movement.' }, HTTP_STATUS.BAD_REQUEST);
    }

    if (String(itemId).startsWith('MANUAL-')) {
      return sendSuccess(res, {
        updatedItem: {
          id: itemId,
          zone: toZone || 'Zone A',
          row: toRow || 'Row 1',
          bay: toBay || 'Bay 01',
          position: toPosition || 'P01',
          stockStatus: toLaneId || toStagingAreaId ? 'STAGED' : 'IN_STORAGE'
        },
        movement: {
          id: `MVT-${Date.now()}`,
          type: toLaneId ? 'STAGE' : 'RELOCATION',
          fromLocation: 'Yard / Row 1 / Bay 01',
          toLocation: toLaneId ? 'Load Lane' : (toStagingAreaId ? 'Holding Area' : `${toZone} / ${toRow} / ${toBay}`),
          reason: reason || 'Internal Depot Move',
          result: 'COMPLETED',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Always resolve identity from JWT — never trust frontend-supplied IDs
    const userId = req.user?.userId || req.user?.id;
    const tenantId = req.tenantId;

    if (!itemId) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'itemId is required' }, HTTP_STATUS.BAD_REQUEST);
    }

    const item = await prisma.loadItem.findUnique({
      where: { id: itemId },
      include: { warehouse: { include: { branch: true } } }
    });

    if (!item) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Item not found' }, HTTP_STATUS.NOT_FOUND);
    }
    if (req.tenantId && item.warehouse?.branch?.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Item not found' }, HTTP_STATUS.NOT_FOUND);
    }

    // If moving to a lane, verify the lane belongs to the same tenant
    if (toLaneId) {
      const lane = await prisma.loadLane.findUnique({
        where: { id: toLaneId },
        include: { warehouse: { include: { branch: true } } }
      });
      if (!lane || (req.tenantId && lane.warehouse?.branch?.companyId !== req.tenantId)) {
        return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Load lane not found' }, HTTP_STATUS.NOT_FOUND);
      }
    }

    // Tenant Check
    if (tenantId && item.warehouse?.branch?.companyId && item.warehouse.branch.companyId !== tenantId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unauthorized tenant access for this item' }, HTTP_STATUS.FORBIDDEN);
    }

    // Capacity Validation: Staging Area
    if (toStagingAreaId) {
      const stageArea = await prisma.stagingArea.findUnique({
        where: { id: toStagingAreaId },
        include: { loadItems: true }
      });
      if (!stageArea) {
        return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Destination staging area not found' }, HTTP_STATUS.NOT_FOUND);
      }
      // Staging area capacity limit: default 20
      if (stageArea.loadItems.length >= 20) {
        return sendError(res, { code: 'CAPACITY_EXCEEDED', message: `Destination staging area ${stageArea.name} has reached its capacity limit (20).` }, HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Capacity Validation: Load Lane
    if (toLaneId) {
      const lane = await prisma.loadLane.findUnique({
        where: { id: toLaneId },
        include: { loadItems: true }
      });
      if (!lane) {
        return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Destination load lane not found' }, HTTP_STATUS.NOT_FOUND);
      }
      // Load lane capacity limit: default 10
      if (lane.loadItems.length >= 10) {
        return sendError(res, { code: 'CAPACITY_EXCEEDED', message: `Destination load lane ${lane.name} is full (capacity 10).` }, HTTP_STATUS.BAD_REQUEST);
      }
    }

    const fromLocation = `${item.zone || 'Yard'} / ${item.row || ''} / ${item.bay || ''} / ${item.position || ''}`;
    const toLocation = `${toZone || ''} / ${toRow || ''} / ${toBay || ''} / ${toPosition || ''}`.trim() || 'New Location';

    const result = await prisma.$transaction(async (tx) => {
      // Resolve proper stock status
      let stockStatus = 'IN_STORAGE';
      if (toLaneId || toStagingAreaId) {
        stockStatus = 'STAGED';
      }

      // 1. Update item location
      const updatedItem = await tx.loadItem.update({
        where: { id: itemId },
        data: {
          zone: toZone || item.zone,
          row: toRow || item.row,
          bay: toBay || item.bay,
          position: toPosition || item.position,
          loadLaneId: toLaneId || null,
          stagingAreaId: toStagingAreaId || null,
          stockStatus
        }
      });

      // 2. Create Movement Audit Trail — performedById always from JWT, never from payload
      const movement = await tx.itemMovement.create({
        data: {
          itemId: item.id,
          type: toLaneId ? 'STAGE' : 'RELOCATION',
          fromLocation,
          toLocation,
          reason: reason || 'Internal Depot Move',
          result: 'COMPLETED',
          performedById: userId || null,
          loadLaneId: toLaneId || null,
          stagingAreaId: toStagingAreaId || null
        }
      });

      return { updatedItem, movement };
    });

    return sendSuccess(res, result, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 4. INBOUND RECEIVING WORKFLOW (5 Steps)
// ============================================================================

exports.getInboundReceipts = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const receipts = await prisma.inboundReceipt.findMany({
      where: {
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      },
      orderBy: { receivingDate: 'desc' },
      include: {
        items: true,
        stagingArea: true,
        warehouse: true
      }
    });

    return sendSuccess(res, receipts);
  } catch (error) {
    next(error);
  }
};

exports.createInboundReceipt = async (req, res, next) => {
  try {
    const {
      inboundType = 'Purchase / Supplier Delivery',
      inboundNo,
      supplier,
      referenceNote,
      transportType = 'Truck',
      driverName,
      vehicleRef,
      date,
      receivingDepot,
      warehouseId,
      zone = 'Zone A',
      row = 'Row 4',
      bay = 'Bay 12',
      stagingAreaId,
      items = [],
      notes,
      attachments = []
    } = req.body;

    const userId = req.user?.userId || req.user?.id;
    const tenantId = req.tenantId;

    // Get default warehouse scoped to tenant
    let targetWarehouseId = warehouseId;
    if (!targetWarehouseId) {
      const defaultWh = await prisma.warehouse.findFirst({
        where: { ...(tenantId && { branch: { companyId: tenantId } }) }
      });
      targetWarehouseId = defaultWh?.id;
    }

    if (!targetWarehouseId) {
      return sendError(res, { code: 'NO_WAREHOUSE', message: 'No warehouse found in depot' }, HTTP_STATUS.BAD_REQUEST);
    }

    const receiptNo = inboundNo || `GR-${Math.floor(1000 + Math.random() * 9000)}`;

    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Create Inbound Receipt
      const receipt = await tx.inboundReceipt.create({
        data: {
          receiptNo,
          supplier: supplier || 'ABC Motors',
          referenceNote: referenceNote || 'DEL-887654',
          transportType,
          driverName: driverName || 'John Smith',
          vehicleRef: vehicleRef || 'TRK-101 / TRL-309',
          inboundType,
          status: 'Completed',
          notes,
          warehouseId: targetWarehouseId,
          stagingAreaId: stagingAreaId || null,
          receivingDate: date ? new Date(date) : new Date()
        }
      });

      // 2. Create LoadItems for each item in the delivery
      const createdItems = [];
      for (const item of items) {
        // Find dummy route stops or create item
        const dummyStop = await tx.routeStop.findFirst();
        let pickupStopId = dummyStop?.id;
        let dropoffStopId = dummyStop?.id;

        // If no route stops exist, create a draft load & stops or standalone item
        if (!pickupStopId) {
          const dummyLoad = await tx.load.create({
            data: {
              loadRef: `INB-${receiptNo}-${Math.floor(100 + Math.random() * 900)}`,
              type: 'Inbound Delivery',
              status: 'ACCEPTED'
            }
          });
          const stop1 = await tx.routeStop.create({
            data: { loadId: dummyLoad.id, type: 'PICKUP', sequenceIndex: 0, address: supplier || 'Depot' }
          });
          const stop2 = await tx.routeStop.create({
            data: { loadId: dummyLoad.id, type: 'DROPOFF', sequenceIndex: 1, address: 'Sydney Depot' }
          });
          pickupStopId = stop1.id;
          dropoffStopId = stop2.id;
        }

        const createdItem = await tx.loadItem.create({
          data: {
            loadId: dummyStop?.loadId || (await tx.load.findFirst())?.id || receipt.id,
            pickupStopId,
            dropoffStopId,
            vin: item.vin || null,
            rego: item.rego || item.plate || null,
            make: item.make || null,
            model: item.model || null,
            year: item.year ? parseInt(item.year) : null,
            color: item.color || item.colour || null,
            vehicleType: item.type || 'Vehicle',
            stockStatus: 'IN_STORAGE',
            damageReportReq: item.condition === 'Damage Noted' || item.damageNoted || false,
            notes: item.notes || null,
            warehouseId: targetWarehouseId,
            zone,
            row,
            bay,
            position: item.position || 'P01',
            stagingAreaId: stagingAreaId || null,
            inboundReceiptId: receipt.id,
            receivedDate: new Date()
          }
        });

        // 3. Log initial Received Movement
        await tx.itemMovement.create({
          data: {
            itemId: createdItem.id,
            type: 'RECEIVE',
            fromLocation: supplier || 'Inbound Dock',
            toLocation: `${zone} / ${row} / ${bay}`,
            reason: `Inbound Receipt ${receiptNo}`,
            result: 'COMPLETED',
            performedById: userId || null,
            status: 'Completed'
          }
        });

        createdItems.push(createdItem);
      }

      return { receipt, items: createdItems };
    });

    return sendSuccess(res, transactionResult, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 5. LOAD LANES (STAGING 1-8)
// ============================================================================

exports.getLoadLanes = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const lanes = await prisma.loadLane.findMany({
      where: {
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      },
      orderBy: { name: 'asc' },
      include: {
        loads: {
          include: { customer: true, driver: { include: { user: true } }, truck: true, trailer: true }
        },
        loadItems: true,
        warehouse: true
      }
    });

    const formattedLanes = lanes.map((lane, idx) => {
      const activeLoad = lane.loads?.[0];
      const count = lane.loadItems?.length || 0;
      let status = 'Empty';
      if (lane.status) {
        status = lane.status;
      } else if (activeLoad) {
        status = activeLoad.status === 'READY_FOR_PICKUP' ? 'Ready to Dispatch' : 'In Progress';
      }

      return {
        id: lane.id,
        name: lane.name || `Lane ${idx + 1}`,
        laneNumber: `Lane ${idx + 1}`,
        laneName: lane.name || `Lane ${idx + 1}`,
        area: lane.warehouse?.name || 'Main Yard',
        status: status,
        loadsCount: lane.loads?.length || 0,
        loadRef: activeLoad?.loadNumber || '-',
        subRef: activeLoad?.customer?.name || (lane.loadItems?.[0]?.vin ? `VIN: ${lane.loadItems[0].vin.slice(0, 8)}...` : '-'),
        vehicle: activeLoad ? `${activeLoad.truck?.rego || activeLoad.truckId || 'Truck'} / ${activeLoad.trailer?.rego || activeLoad.trailerId || 'Trailer'}` : '-',
        vehicleType: activeLoad ? (activeLoad.carrierType || 'Car Carrier') : '',
        driver: activeLoad?.driver?.user ? activeLoad.driver.user.name : (activeLoad?.driver?.licenseNumber || '-'),
        estDispatch: activeLoad?.scheduledPickupTime ? new Date(activeLoad.scheduledPickupTime).toLocaleString() : '-',
        progress: `${count} / 10`,
        items: lane.loadItems || []
      };
    });

    let finalLanes = formattedLanes;
    if (finalLanes.length === 0) {
      finalLanes = [
        { id: 'lane-1', name: 'Lane 1 - North Loading Dock', laneNumber: 'Lane 1', laneName: 'Lane 1 - North Loading Dock', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] },
        { id: 'lane-2', name: 'Lane 2 - East Bay', laneNumber: 'Lane 2', laneName: 'Lane 2 - East Bay', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] },
        { id: 'lane-3', name: 'Lane 3 - Express Loading', laneNumber: 'Lane 3', laneName: 'Lane 3 - Express Loading', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] },
        { id: 'lane-4', name: 'Lane 4 - Heavy Transport', laneNumber: 'Lane 4', laneName: 'Lane 4 - Heavy Transport', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] },
        { id: 'lane-5', name: 'Lane 5 - Vehicle Staging', laneNumber: 'Lane 5', laneName: 'Lane 5 - Vehicle Staging', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] },
        { id: 'lane-6', name: 'Lane 6 - Outbound Dock', laneNumber: 'Lane 6', laneName: 'Lane 6 - Outbound Dock', area: 'Main Yard', status: 'Empty', loadsCount: 0, progress: '0 / 10', items: [] }
      ];
    }

    const readyCount = finalLanes.filter(l => l.status.toLowerCase().includes('ready')).length;
    const inProgressCount = finalLanes.filter(l => l.status.toLowerCase().includes('progress')).length;
    const holdCount = finalLanes.filter(l => l.status.toLowerCase().includes('hold')).length;
    const emptyCount = finalLanes.filter(l => l.status.toLowerCase().includes('empty') || l.loadsCount === 0).length;
    const totalLanesCount = finalLanes.length;

    const upcomingLoads = await prisma.load.findMany({
      where: {
        loadLaneId: { not: null },
        status: { in: ['ASSIGNED', 'IN_TRANSIT', 'ACTIVE', 'PLANNED'] },
        ...(tenantId && { companyId: tenantId })
      },
      include: {
        loadLane: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return sendSuccess(res, {
      summary: {
        totalLanes: totalLanesCount,
        activeLanes: formattedLanes.filter(l => l.loadsCount > 0).length,
        loadsInProgress: inProgressCount,
        readyToDispatch: readyCount,
        overdueHold: holdCount,
        readyCount,
        inProgressCount,
        holdCount,
        emptyCount
      },
      lanes: finalLanes,
      upcomingDispatches: upcomingLoads.map(l => ({
        loadRef: l.loadRef || l.id,
        lane: l.loadLane?.name || 'Unassigned',
        time: l.scheduledPickupTime ? new Date(l.scheduledPickupTime).toLocaleString() : 'Pending'
      }))
    });
  } catch (error) {
    next(error);
  }
};

exports.stageItemsToLane = async (req, res, next) => {
  try {
    const { laneId } = req.params;
    const { itemIds = [] } = req.body;
    // Always resolve identity from JWT
    const userId = req.user?.userId || req.user?.id;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'itemIds array is required and must not be empty' }, HTTP_STATUS.BAD_REQUEST);
    }

    // Verify lane exists AND belongs to the authenticated tenant
    const lane = await prisma.loadLane.findUnique({
      where: { id: laneId },
      include: { warehouse: { include: { branch: true } } }
    });
    if (!lane || (req.tenantId && lane.warehouse?.branch?.companyId !== req.tenantId)) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Load lane not found' }, HTTP_STATUS.NOT_FOUND);
    }

    // Verify every item belongs to the same tenant before staging
    if (req.tenantId) {
      const items = await prisma.loadItem.findMany({
        where: { id: { in: itemIds } },
        include: { warehouse: { include: { branch: true } } }
      });
      const crossTenant = items.some(i => i.warehouse?.branch?.companyId !== req.tenantId);
      if (crossTenant || items.length !== itemIds.length) {
        return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'One or more items not found' }, HTTP_STATUS.NOT_FOUND);
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.loadItem.updateMany({
        where: { id: { in: itemIds } },
        data: {
          loadLaneId: laneId,
          stockStatus: 'STAGED'
        }
      });

      for (const id of itemIds) {
        await tx.itemMovement.create({
          data: {
            itemId: id,
            type: 'STAGE',
            toLocation: lane.name || `Load Lane ${laneId}`,
            reason: 'Staging to Load Lane',
            result: 'COMPLETED',
            performedById: userId || null
          }
        });
      }

      return { success: true, count: itemIds.length };
    });

    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 6. DISPATCH READY & OUTBOUND
// ============================================================================

exports.getDispatchReady = async (req, res, next) => {
  try {
    const readyLoads = await prisma.load.findMany({
      where: {
        status: { in: ['PLANNED', 'ASSIGNED', 'IN_TRANSIT'] },
        ...(req.tenantId && { companyId: req.tenantId })
      },
      include: {
        customer: true,
        driver: { include: { user: true } },
        truck: true,
        trailer: true,
        items: true,
        loadLane: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedLoads = readyLoads.map(load => ({
      id: load.id,
      loadRef: load.loadRef || load.draftId || load.id,
      poRef: load.customerPo || 'PO: -',
      customer: load.customer?.companyName || 'Direct Customer',
      trailerVehicle: `${load.truck?.rego || '-'} / ${load.trailer?.rego || '-'}`,
      carrierType: load.loadType || 'General Freight',
      driver: load.driver?.user?.name || load.driver?.licenseNumber || 'Unassigned',
      phone: load.driver?.user?.phone || '-',
      loadLane: load.loadLane?.name || 'Unassigned',
      area: 'Main Yard',
      readySince: load.createdAt ? new Date(load.createdAt).toLocaleString() : '-',
      status: load.status === 'IN_TRANSIT' ? 'Ready' : (load.status === 'ASSIGNED' ? 'Awaiting Pickup' : 'Planned')
    }));

    const readyCount = formattedLoads.filter(l => l.status === 'Ready').length;
    const awaitingCount = formattedLoads.filter(l => l.status === 'Awaiting Pickup').length;
    const exceptionsCount = formattedLoads.filter(l => l.status === 'Hold').length;

    return sendSuccess(res, {
      summary: {
        readyToDispatch: readyCount,
        todaysDispatch: formattedLoads.length,
        awaitingPickup: awaitingCount,
        exceptions: exceptionsCount,
        readyPercent: formattedLoads.length > 0 ? Math.round((readyCount / formattedLoads.length) * 100) : 0,
        awaitingPercent: formattedLoads.length > 0 ? Math.round((awaitingCount / formattedLoads.length) * 100) : 0,
        holdPercent: formattedLoads.length > 0 ? Math.round((exceptionsCount / formattedLoads.length) * 100) : 0
      },
      loads: formattedLoads,
      nextPickups: []
    });
  } catch (error) {
    next(error);
  }
};

exports.dispatchLoad = async (req, res, next) => {
  try {
    const { loadId } = req.params;
    // Always resolve identity from JWT — never trust payload
    const userId = req.user?.userId || req.user?.id;

    // Verify the load belongs to the authenticated tenant before any mutation
    const existingLoad = await prisma.load.findUnique({ where: { id: loadId } });
    if (!existingLoad) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Load not found' }, HTTP_STATUS.NOT_FOUND);
    }
    if (req.tenantId && existingLoad.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Load not found' }, HTTP_STATUS.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (tx) => {
      const load = await tx.load.update({
        where: { id: loadId },
        data: { status: 'DISPATCHED' }
      });

      await tx.loadItem.updateMany({
        where: { loadId },
        data: { stockStatus: 'IN_TRANSIT' }
      });

      // Create an audit movement record for dispatch
      await tx.itemMovement.create({
        data: {
          itemId: (await tx.loadItem.findFirst({ where: { loadId } }))?.id || loadId,
          type: 'DISPATCH',
          fromLocation: 'Load Lane',
          toLocation: 'Outbound / In Transit',
          reason: 'Load Dispatched',
          result: 'COMPLETED',
          performedById: userId || null,
          loadId
        }
      }).catch(() => null); // Non-fatal: audit trail failure should not block dispatch

      return load;
    });

    return sendSuccess(res, { message: 'Load marked as dispatched successfully', load: result });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 7. HOLDING AREAS (SA-01 to SA-12)
// ============================================================================

exports.getHoldingAreas = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const areas = await prisma.stagingArea.findMany({
      where: {
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      },
      include: {
        loadItems: true,
        warehouse: true
      },
      orderBy: { name: 'asc' }
    });

    const stagedItemsCount = await prisma.loadItem.count({
      where: {
        stagingAreaId: { not: null },
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      }
    });

    const finalHoldingAreas = areas.length > 0 ? areas.map((a, i) => ({
      id: a.id,
      code: `SA-${String(i + 1).padStart(2, '0')}`,
      name: a.name || `Stage Area ${i + 1}`,
      zone: a.warehouse?.name || 'Main Yard',
      location: a.name,
      subLocation: a.warehouse?.name || 'Main Yard',
      lane: `Lane ${(i % 6) + 1}`,
      status: a.status || 'Active',
      capacity: 25,
      occupancy: a.loadItems?.length ? Math.min(Math.round((a.loadItems.length / 25) * 100), 100) : 0,
      stagedItems: a.loadItems?.length || 0,
      awaitingMove: 0,
      oldestItem: '-'
    })) : [
      { id: 'sa-1', code: 'SA-01', name: 'Holding Area SA-01 (Vehicles)', zone: 'Zone A', location: 'Holding Area SA-01', subLocation: 'Main Yard', lane: 'Lane 1', status: 'Active', capacity: 25, occupancy: 0, stagedItems: 0 },
      { id: 'sa-2', code: 'SA-02', name: 'Holding Area SA-02 (Heavy Cargo)', zone: 'Zone B', location: 'Holding Area SA-02', subLocation: 'Main Yard', lane: 'Lane 2', status: 'Active', capacity: 25, occupancy: 0, stagedItems: 0 },
      { id: 'sa-3', code: 'SA-03', name: 'Holding Area SA-03 (Containers)', zone: 'Zone C', location: 'Holding Area SA-03', subLocation: 'Main Yard', lane: 'Lane 3', status: 'Active', capacity: 25, occupancy: 0, stagedItems: 0 },
      { id: 'sa-4', code: 'SA-04', name: 'Holding Area SA-04 (Rapid Dispatch)', zone: 'Zone D', location: 'Holding Area SA-04', subLocation: 'Main Yard', lane: 'Lane 4', status: 'Active', capacity: 25, occupancy: 0, stagedItems: 0 }
    ];

    const activeAreasCount = finalHoldingAreas.filter(a => a.status !== 'INACTIVE' && a.status !== 'Inactive').length;
    const inactiveAreasCount = finalHoldingAreas.filter(a => a.status === 'INACTIVE' || a.status === 'Inactive').length;

    const recentStaged = await prisma.loadItem.findMany({
      where: {
        stagingAreaId: { not: null },
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      },
      include: {
        stagingArea: true
      },
      orderBy: { id: 'desc' },
      take: 5
    });

    return sendSuccess(res, {
      summary: {
        totalHoldingAreas: finalHoldingAreas.length,
        activeAreas: activeAreasCount,
        inactiveAreas: inactiveAreasCount,
        stagedItemsTotal: stagedItemsCount,
        awaitingMoveTotal: 0,
        overdueItemsTotal: 0,
        readyForMovePercent: stagedItemsCount > 0 ? 100 : 0,
        waitingOver2hPercent: 0,
        waitingUnder2hPercent: 0,
        overduePercent: 0
      },
      holdingAreas: finalHoldingAreas,
      topOccupancy: areas.map(a => ({
        name: a.name,
        occupancy: a.loadItems?.length ? Math.min(Math.round((a.loadItems.length / 25) * 100), 100) : 0
      })).sort((a, b) => b.occupancy - a.occupancy).slice(0, 5),
      recentlyStaged: recentStaged.map(item => ({
        id: item.id,
        title: item.make ? `${item.make} ${item.model || ''}` : (item.vehicleType || item.stockRef || 'Item'),
        vin: item.vin || item.stockRef || '',
        area: item.stagingArea?.name || 'Staging Area',
        time: new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 8. MOVEMENT HISTORY & AUDIT LOGS
// ============================================================================

exports.getMovements = async (req, res, next) => {
  try {
    const { type, result, search, page = 1, limit = 25 } = req.query;
    const where = {};

    if (type && type !== 'All Types' && type !== 'All') {
      where.type = type.toUpperCase().replace(/\s+/g, '_');
    }
    if (result && result !== 'All Results' && result !== 'All') {
      where.result = result.toUpperCase();
    }
    if (search) {
      where.OR = [
        { fromLocation: { contains: search } },
        { toLocation: { contains: search } },
        { reason: { contains: search } },
        { item: { vin: { contains: search } } },
        { item: { rego: { contains: search } } },
        { item: { stockRef: { contains: search } } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [movements, total] = await Promise.all([
      prisma.itemMovement.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          item: true,
          performedBy: true,
          loadLane: true,
          stagingArea: true
        }
      }),
      prisma.itemMovement.count({ where })
    ]);

    const formatted = movements.map(m => ({
      id: m.id,
      dateTime: m.timestamp ? new Date(m.timestamp).toLocaleDateString('en-GB') + ' ' + new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      type: m.type || 'Move',
      item: m.item?.make ? `${m.item.make} ${m.item.model || ''}` : (m.item?.stockRef || 'Item'),
      vinRego: `${m.item?.vin || ''} | ${m.item?.rego || ''}`.trim(),
      fromLocation: m.fromLocation || '-',
      toLocation: m.toLocation || '-',
      loadRef: m.movementRef || '-',
      by: m.performedBy?.name || 'Staff',
      role: 'Staff',
      result: m.result || 'Completed'
    }));

    return sendList(res, formatted, {
      total: total || 0,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
      summary: {
        totalMovements: total || 0,
        completed: total || 0,
        completedPercent: 100,
        failed: 0,
        failedPercent: 0,
        inProgress: 0,
        inProgressPercent: 0,
        cancelled: 0,
        cancelledPercent: 0,
        typeBreakdown: {
          receiveInbound: 0,
          moveWithinDepot: 0,
          transferToAnother: 0,
          stageToLoadLane: 0,
          dispatchPickup: 0,
          returnOutbound: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 9. WAREHOUSE & YARD INTERACTIVE MAP
// ============================================================================

exports.getYardMap = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    const [
      loadItems,
      loadLanes
    ] = await Promise.all([
      prisma.loadItem.findMany({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) }
      }),
      prisma.loadLane.findMany({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) },
        include: { loadItems: true }
      })
    ]);

    const vehiclesCount = loadItems.filter(i => i.type === 'VEHICLE' || i.vehicleType).length;
    const containersCount = loadItems.filter(i => i.type === 'CONTAINER').length;
    const totalItems = loadItems.length;

    return sendSuccess(res, {
      areas: {
        receiving: 0,
        qc: 0,
        staging: 0,
        dispatch: 0
      },
      zones: {
        coldStorage: 0,
        zoneA: { capacity: 0 },
        zoneB: { capacity: 0 },
        zoneC: { capacity: 0 },
        zoneD: { capacity: 0 }
      },
      warehouseZones: [
        { code: 'ZONE_A', name: 'ZONE A', capacity: '0% Capacity', status: 'Available', itemsCount: 0 },
        { code: 'ZONE_B', name: 'ZONE B', capacity: '0% Capacity', status: 'Available', itemsCount: 0 },
        { code: 'ZONE_C', name: 'ZONE C', capacity: '0% Capacity', status: 'Available', itemsCount: 0 },
        { code: 'ZONE_D', name: 'ZONE D', capacity: '0% Capacity', status: 'Available', itemsCount: 0 },
        { code: 'COLD_STORAGE', name: 'COLD STORAGE', items: '0 Items', status: 'Available' },
        { code: 'HAZMAT', name: 'HAZMAT STORAGE', items: '0 Items', status: 'Available' },
        { code: 'VALUE_STORAGE', name: 'VALUE STORAGE', items: '0 Items', status: 'Available' },
        { code: 'WORKSHOP', name: 'WORKSHOP', status: '0 In Progress' },
        { code: 'OFFICE', name: 'OFFICE', status: 'Staff Ready' }
      ],
      loadLanes: loadLanes.length > 0 ? loadLanes.map(l => ({
        lane: l.name,
        status: l.status || 'Empty',
        progress: `${l.loadItems?.length || 0} / 8`
      })) : [
        { lane: 'LANE 1', status: 'Empty', progress: '0 / 8' },
        { lane: 'LANE 2', status: 'Empty', progress: '0 / 8' },
        { lane: 'LANE 3', status: 'Empty', progress: '0 / 8' },
        { lane: 'LANE 4', status: 'Empty', progress: '0 / 8' },
        { lane: 'LANE 5', status: 'Empty', progress: '0 / 8' },
        { lane: 'LANE 6', status: 'Empty', progress: '0 / 8' }
      ],
      yardAreas: {
        vehicleStorage: { name: 'VEHICLE STORAGE', count: vehiclesCount, inTransit: 0, unit: 'Vehicles' },
        containerYard: { name: 'CONTAINER YARD', count: containersCount, inTransit: 0, unit: 'Containers' },
        equipmentParking: { name: 'EQUIPMENT PARKING', count: 0, inUse: 0, unit: 'Equipment' },
        emptyPark: { name: 'EMPTY PARK', count: 0, inUse: 0, unit: 'Trailers' }
      },
      summary: {
        totalSlots: 100,
        available: Math.max(0, 100 - totalItems),
        availablePercent: 100,
        inUse: totalItems,
        inUsePercent: 0,
        onHold: 0,
        onHoldPercent: 0,
        damaged: 0,
        damagedPercent: 0,
        other: 0,
        otherPercent: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 10. REPORTS & ANALYTICS
// ============================================================================

exports.getReportsOverview = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    // RBAC check
    if (!checkManagerAccess(req)) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED_ACCESS,
        message: 'Only warehouse managers or company admins can access reports.'
      }, HTTP_STATUS.FORBIDDEN);
    }

    // Live calculations
    const [
      totalItems,
      inStorageCount,
      stagedCount,
      inTransitCount,
      inboundReceiptsCount,
      movementsCount,
      zoneGroups,
      laneLanes
    ] = await Promise.all([
      prisma.loadItem.count({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) }
      }),
      prisma.loadItem.count({
        where: {
          stockStatus: 'IN_STORAGE',
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      prisma.loadItem.count({
        where: {
          stockStatus: 'STAGED',
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      prisma.loadItem.count({
        where: {
          stockStatus: 'TO_MOVE',
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        }
      }),
      prisma.inboundReceipt.count({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) }
      }),
      prisma.itemMovement.count({
        where: { ...(tenantId && { item: { warehouse: { branch: { companyId: tenantId } } } }) }
      }),
      prisma.loadItem.groupBy({
        by: ['zone'],
        where: {
          zone: { not: null },
          ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
        },
        _count: { id: true }
      }),
      prisma.loadLane.findMany({
        where: { ...(tenantId && { warehouse: { branch: { companyId: tenantId } } }) },
        include: { loadItems: true }
      })
    ]);

    const activeCount = totalItems || 0;
    const finalInStorage = inStorageCount || 0;
    const finalStaged = stagedCount || 0;
    const finalInTransit = inTransitCount || 0;

    // Format zone list
    const inventoryByZone = zoneGroups.map(z => ({
      zone: z.zone,
      count: z._count.id,
      percent: activeCount > 0 ? parseFloat(((z._count.id / activeCount) * 100).toFixed(1)) : 0
    }));

    // Format load lanes utilization
    const topLoadLanes = laneLanes.map((lane, idx) => {
      const itemsCount = lane.loadItems?.length || 0;
      const utilization = Math.min(100, Math.round((itemsCount / 10) * 100));
      return {
        rank: idx + 1,
        lane: lane.name,
        items: itemsCount,
        utilization
      };
    }).sort((a, b) => b.items - a.items).slice(0, 5);

    return sendSuccess(res, {
      headlineKpis: {
        totalItemsHandled: activeCount,
        totalItemsTrend: '0%',
        receivedInbound: inboundReceiptsCount || 0,
        receivedTrend: '0%',
        dispatchedOutbound: finalInTransit,
        dispatchedTrend: '0%',
        stagedItems: finalStaged,
        stagedTrend: '0%',
        avgDwellTime: '0m',
        dwellTrend: '0%',
        accuracyRate: '100%',
        accuracyTrend: '0%'
      },
      movementTrend: [],
      itemsByStatus: {
        total: activeCount,
        inStock: { count: finalInStorage, percent: activeCount > 0 ? parseFloat(((finalInStorage / activeCount) * 100).toFixed(1)) : 0 },
        staged: { count: finalStaged, percent: activeCount > 0 ? parseFloat(((finalStaged / activeCount) * 100).toFixed(1)) : 0 },
        inTransit: { count: finalInTransit, percent: activeCount > 0 ? parseFloat(((finalInTransit / activeCount) * 100).toFixed(1)) : 0 },
        onHold: { count: 0, percent: 0 },
        damaged: { count: 0, percent: 0 },
        other: { count: 0, percent: 0 }
      },
      topLoadLanes,
      hourlyMetrics: [],
      inventoryByZone,
      dwellTimeAnalysis: {
        average: '0m',
        ranges: [
          { label: '0 - 2 Hours', count: finalInStorage, percent: activeCount > 0 ? parseFloat(((finalInStorage / activeCount) * 100).toFixed(1)) : 0 },
          { label: '2 - 4 Hours', count: finalStaged, percent: activeCount > 0 ? parseFloat(((finalStaged / activeCount) * 100).toFixed(1)) : 0 },
          { label: '4+ Hours', count: finalInTransit, percent: activeCount > 0 ? parseFloat(((finalInTransit / activeCount) * 100).toFixed(1)) : 0 }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 11. LABELS, TOOLS & THERMAL PRINTING
// ============================================================================

exports.getLabels = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      templates: ['VIN Label', 'Pallet Label', 'QR Code Label', 'Container Label', 'Load Label', 'Location Label', 'Holding Area Label', 'Load Lane Label', 'Custom Label'],
      printers: [
        { id: '1', name: 'Zebra ZD421 (192.168.1.25)', ip: '192.168.1.25', status: 'Online', model: 'Thermal ZPL' },
        { id: '2', name: 'Zebra ZT411 (Dock A)', ip: '192.168.1.30', status: 'Idle', model: 'Industrial Thermal' },
        { id: '3', name: 'HP LaserJet Pro (Office)', ip: '192.168.1.15', status: 'Offline', model: 'Laser A4' }
      ],
      recentPrints: [
        { item: 'JTDBK3...234567 (Hilux)', type: 'VIN Label', by: 'W. Smith', time: '18/05/26 10:21 AM', copies: 1 },
        { item: 'PAL-889900112233', type: 'Pallet Label', by: 'W. Smith', time: '18/05/26 10:15 AM', copies: 2 },
        { item: 'CONT-HJCU1234567', type: 'Container Label', by: 'W. Smith', time: '18/05/26 09:58 AM', copies: 1 },
        { item: 'Load ID: LD-0001245', type: 'Load Label', by: 'W. Smith', time: '18/05/26 09:42 AM', copies: 1 },
        { item: 'Stage Area 3', type: 'Holding Area Label', by: 'W. Smith', time: '18/05/26 09:30 AM', copies: 2 }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.printLabel = async (req, res, next) => {
  try {
    const { labelType, itemId, printerTarget = 'Zebra ZD421', copies = 1 } = req.body;
    return sendSuccess(res, {
      success: true,
      message: `Successfully spooled ${copies} ${labelType} to ${printerTarget}`,
      jobId: `#PJ-${Math.floor(900 + Math.random() * 99)}`
    });
  } catch (error) {
    next(error);
  }
};

exports.scanBarcode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Barcode or QR code is required.' }, HTTP_STATUS.BAD_REQUEST);
    }

    const tenantId = req.tenantId;
    const cleanCode = code.trim();

    // Query real load items in DB
    const item = await prisma.loadItem.findFirst({
      where: {
        OR: [
          { vin: { equals: cleanCode } },
          { rego: { equals: cleanCode } },
          { stockRef: { equals: cleanCode } },
          { id: { equals: cleanCode } }
        ],
        ...(tenantId && { warehouse: { branch: { companyId: tenantId } } })
      },
      include: {
        loadLane: true,
        stagingArea: true,
        warehouse: true
      }
    });

    if (item) {
      return sendSuccess(res, {
        code: cleanCode,
        status: `In Stock - ${item.stockStatus || 'VERIFIED'}`,
        identifier: item.vin || item.rego || item.stockRef || item.id,
        nameCategory: `${item.make || ''} ${item.model || ''}`.trim() || item.vehicleType || 'Stock Item',
        zoneBinSlot: `${item.zone || 'Zone A'} / ${item.row || 'Row 1'} / ${item.bay || 'Bay 1'}`,
        stockQty: '1 Unit',
        weight: item.weight ? `${item.weight} kg` : 'N/A',
        dimensions: 'Standard',
        lastAudit: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Recent',
        actions: ['Relocate Stock', 'Assign to Load', 'Print Label']
      });
    }

    // If item not found in DB
    return sendSuccess(res, {
      code: cleanCode,
      status: 'Tag Scanned - Unregistered Item',
      identifier: cleanCode,
      nameCategory: 'Unknown Asset / External Tag',
      zoneBinSlot: 'Unassigned',
      stockQty: '1 Unit',
      weight: 'N/A',
      dimensions: 'N/A',
      lastAudit: new Date().toLocaleString(),
      actions: ['Ingest to Yard', 'Create Stock Tag']
    });
  } catch (error) {
    next(error);
  }
};

exports.getSpoolerQueue = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      queueStatus: 'Active (120 Labels Left)',
      spoolerJobs: [
        { jobId: '#PJ-901', name: 'Batch 120 Pallet Barcodes', target: 'Zebra ZD421 (Dock A)', totalPages: '120 Labels', status: 'Printing (45%)' },
        { jobId: '#PJ-902', name: 'Outbound Manifest Batch #84', target: 'HP LaserJet Pro (Office)', totalPages: '24 Pages', status: 'Queued' },
        { jobId: '#PJ-903', name: 'Location Bin Tags - Zone B', target: 'Zebra ZD421 (Dock A)', totalPages: '80 Labels', status: 'Queued' },
        { jobId: '#PJ-900', name: 'Putaway Slips Morning Shift', target: 'HP LaserJet Pro (Office)', totalPages: '15 Pages', status: 'Completed' }
      ],
      networkPrinters: [
        { name: 'Zebra ZD421 (Office)', ip: '192.168.1.25', status: 'Online' },
        { name: 'Zebra ZT411 (Dock A)', ip: '192.168.1.30', status: 'Idle' },
        { name: 'HP LaserJet Pro (Billing)', ip: '192.168.1.15', status: 'Offline' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 12.5 SHIFT & TIME CLOCK (Yard Attendant & Warehouse Staff)
// ============================================================================

const activeShiftsStore = {};

exports.getCurrentShift = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || 'attendant_1';
    const shift = activeShiftsStore[userId];
    if (shift && shift.status === 'ACTIVE') {
      return sendSuccess(res, shift);
    }
    return sendSuccess(res, null);
  } catch (error) {
    next(error);
  }
};

exports.clockInShift = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || 'attendant_1';
    const shift = {
      id: `SHIFT-${Date.now()}`,
      userId,
      status: 'ACTIVE',
      clockIn: new Date().toISOString(),
      clockOut: null,
      notes: req.body?.notes || ''
    };
    activeShiftsStore[userId] = shift;
    return sendSuccess(res, shift);
  } catch (error) {
    next(error);
  }
};

exports.clockOutShift = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || 'attendant_1';
    const shift = activeShiftsStore[userId] || {
      id: `SHIFT-${Date.now()}`,
      userId,
      clockIn: new Date(Date.now() - 3600000).toISOString()
    };
    shift.status = 'COMPLETED';
    shift.clockOut = new Date().toISOString();
    activeShiftsStore[userId] = null;
    return sendSuccess(res, shift);
  } catch (error) {
    next(error);
  }
};

exports.getShiftHistory = async (req, res, next) => {
  try {
    return sendSuccess(res, []);
  } catch (error) {
    next(error);
  }
};

exports.getShiftStatus = exports.getCurrentShift;
exports.clockIn = exports.clockInShift;
exports.clockOut = exports.clockOutShift;

// ============================================================================
// 12. SAFETY CHECKLIST & PRE-START
// ============================================================================

exports.getSafetyChecklists = async (req, res, next) => {
  try {
    // Resolve authenticated user from JWT — never trust frontend identity
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' }, HTTP_STATUS.UNAUTHORIZED);
    }

    // Resolve yard attendant/driver record via User → Driver link
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'No staff profile found for this account.' }, HTTP_STATUS.NOT_FOUND);
    }

    // Tenant safety — ensure the driver belongs to the authenticated tenant
    if (req.tenantId && driver.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied.' }, HTTP_STATUS.FORBIDDEN);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Fetch today's checklist for this driver
    const currentChecklist = await prisma.preStartChecklist.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        date: { gte: todayStart }
      },
      include: {
        items: { orderBy: { itemNumber: 'asc' } }
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
    });

    // Fetch recent checklist history (last 10 completed)
    const recentChecklists = await prisma.preStartChecklist.findMany({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        isDraft: false
      },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        date: true,
        passedCount: true,
        failedCount: true,
        totalItems: true,
        isDraft: true,
        submittedAt: true
      }
    });

    const formattedRecent = recentChecklists.map(c => ({
      id: c.id,
      date: c.date ? new Date(c.date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : null,
      status: c.failedCount > 0 ? 'Fail' : 'Pass',
      score: `${c.passedCount} / ${c.totalItems}`
    }));

    return sendSuccess(res, {
      currentChecklist: currentChecklist || null,
      recentChecklists: formattedRecent
    });
  } catch (error) {
    next(error);
  }
};

exports.submitSafetyChecklist = async (req, res, next) => {
  try {
    // Resolve authenticated user from JWT — ignore any driverId/companyId from payload
    const userId = req.user?.userId || req.user?.id;
    const { vehicleRef, trailerRef, items, notes, isDraft, loadId, gpsLat, gpsLng, allowUpdate, isUpdate } = req.body || {};

    if (!userId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' }, HTTP_STATUS.UNAUTHORIZED);
    }

    // Resolve driver/yard attendant from JWT identity — never trust payload
    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: { id: true, companyId: true }
    });

    if (!driver) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'No staff profile found for this account.' }, HTTP_STATUS.NOT_FOUND);
    }

    // Tenant safety check
    if (req.tenantId && driver.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied.' }, HTTP_STATUS.FORBIDDEN);
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Checklist must contain inspection items.' }, HTTP_STATUS.BAD_REQUEST);
    }

    // Map UI status strings to DB ChecklistItemStatus enum (same mapping as Phase 12)
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

    // Check for existing checklist today — same duplicate prevention as Phase 12
    const existingChecklist = await prisma.preStartChecklist.findFirst({
      where: {
        driverId: driver.id,
        companyId: driver.companyId,
        date: { gte: todayStart }
      }
    });

    if (existingChecklist && !existingChecklist.isDraft && !isDraft && !allowUpdate && !isUpdate) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: "Today's pre-start safety checklist has already been submitted." }, HTTP_STATUS.BAD_REQUEST);
    }

    // Persist using Prisma transaction — same pattern as Phase 12
    const checklistResult = await prisma.$transaction(async (tx) => {
      let checklistRecord;

      if (existingChecklist) {
        // Delete old item responses and update the checklist (draft update flow)
        await tx.checklistItemResponse.deleteMany({ where: { checklistId: existingChecklist.id } });
        checklistRecord = await tx.preStartChecklist.update({
          where: { id: existingChecklist.id },
          data: {
            vehicleRef: vehicleRef || existingChecklist.vehicleRef,
            trailerRef: trailerRef || existingChecklist.trailerRef,
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
        // Create new checklist — driverId and companyId always from JWT, never payload
        checklistRecord = await tx.preStartChecklist.create({
          data: {
            driverId: driver.id,
            companyId: driver.companyId,
            date: new Date(),
            vehicleRef: vehicleRef || null,
            trailerRef: trailerRef || null,
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

      // Create all item responses in one batch
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
        include: { items: { orderBy: { itemNumber: 'asc' } } }
      });
    });

    return sendSuccess(res, {
      checklist: checklistResult,
      message: isDraft
        ? 'Safety Checklist draft saved.'
        : failedCount > 0
          ? 'Safety Checklist submitted with defects logged.'
          : 'Safety Checklist submitted successfully! All clear.'
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 13. WAREHOUSE STAFF PROFILE & CERTIFICATIONS
// ============================================================================

exports.getStaffProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' }, HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        customRole: true
      }
    });

    if (!user) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'User account not found.' }, HTTP_STATUS.NOT_FOUND);
    }

    if (req.tenantId && user.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied.' }, HTTP_STATUS.FORBIDDEN);
    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: {
        company: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true, city: true, state: true } },
        branch: { select: { id: true, name: true, location: true } }
      }
    });

    const isManager = user.role === 'SUPER_ADMIN' || user.email === 'warehouse@hero.com' || user.customRole?.name?.toLowerCase().includes('manager');
    const defaultTitle = isManager ? 'Warehouse Manager' : 'Warehouse Staff';

    const fullName = driver
      ? [driver.firstName, driver.lastName].filter(Boolean).join(' ') || user.name || user.email
      : (user.name || user.email);

    const profile = {
      userId: user.id,
      name: fullName,
      title: defaultTitle,
      email: driver?.email || user.email,
      phone: driver?.phone || user.phone || '+61 412 345 678',
      phoneWork: '+61 2 8765 4321',
      role: driver?.role || user.role || defaultTitle,
      driverCode: driver?.driverCode || user.userCode || null,
      status: driver?.status || 'AVAILABLE',
      employmentType: driver?.employmentType || null,
      category: driver?.category || null,
      joiningDate: driver?.joiningDate || user.createdAt || null,
      joinedOn: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Mar 2024',
      department: 'Warehouse Operations',
      depot: driver?.warehouse?.name || driver?.branch?.name || user.branch?.name || 'Sydney Depot Hub',
      reportsTo: isManager ? 'Operations Director' : 'Warehouse Manager',
      address: driver?.address || user.address || '12 Logistics Way, Eastern Creek NSW 2766, Australia',
      city: driver?.city || null,
      state: driver?.state || null,
      company: driver?.company || user.company || null,
      warehouse: driver?.warehouse || null,
      branch: driver?.branch || user.branch || null,
      avatarUrl: driver?.avatarUrl || null,
      emergencyContact: driver?.emergencyContact ? (typeof driver.emergencyContact === 'string' ? { phone: driver.emergencyContact } : driver.emergencyContact) : {
        name: 'Emergency Contact',
        relationship: 'Primary',
        phone: user.emergencyContact || '+61 400 987 654'
      }
    };

    return sendSuccess(res, {
      profile,
      preferences: {
        language: 'English (Australia)',
        timeZone: '(GMT+10:00) Australia/Sydney',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12-Hour (AM/PM)'
      },
      certifications: [
        { name: 'General Induction', status: 'Verified', expiry: '15 Mar 2027' },
        { name: 'Forklift Licence', status: 'Verified', expiry: '22 Oct 2027' },
        { name: 'First Aid Certificate', status: 'Verified', expiry: '10 Dec 2026' },
        { name: 'WH&S Training', status: 'Verified', expiry: '15 Mar 2027' }
      ],
      skills: [
        { skill: 'Forklift Operation', level: 'Expert' },
        { skill: 'Inventory Handling', level: 'Advanced' },
        { skill: 'Pallet Handling', level: 'Advanced' },
        { skill: 'WMS System', level: 'Advanced' },
        { skill: 'Safety Compliance', level: 'Expert' }
      ],
      permissions: user.customRole?.permissions?.map(p => p.actionString) || [
        'Receive Stock (Inbound)',
        'Move / Transfer Stock',
        'Load Lane Management',
        'Dispatch Ready',
        'View Movement History',
        'Messaging',
        'Report Issues',
        'View Reports'
      ],
      security: {
        twoFactor: 'Enabled',
        activeSessions: 2
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 14. YARD ATTENDANT SHIFT / TIME CLOCK — PHASE C
//
// All endpoints resolve identity exclusively from req.user.userId and
// req.tenantId.  No employee/company IDs are ever accepted from the payload.
// ============================================================================

/**
 * Resolve the authenticated user's Driver/staff record — strictly by userId
 * from the JWT.  Never accept a driverId from the client.
 */
async function resolveYardDriver(req, res) {
  const userId = req.user?.userId || req.user?.id;
  if (!userId) {
    sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' }, HTTP_STATUS.UNAUTHORIZED);
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, companyId: true, email: true, role: true }
  });
  if (!user) {
    sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'User account not found.' }, HTTP_STATUS.NOT_FOUND);
    return null;
  }

  // Enforce tenant isolation on the user record itself
  if (req.tenantId && user.companyId !== req.tenantId) {
    sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied.' }, HTTP_STATUS.FORBIDDEN);
    return null;
  }

  // Resolve optional Driver profile linked to this user
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: {
      warehouse: { select: { id: true, name: true, city: true, state: true } },
      branch: { select: { id: true, name: true, location: true } }
    }
  });

  let companyId = req.tenantId || driver?.companyId || user.companyId;
  if (!companyId) {
    const primaryCompany = await prisma.company.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    });
    companyId = primaryCompany?.id;
  }

  if (!companyId) {
    sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Valid company context is required.' }, HTTP_STATUS.FORBIDDEN);
    return null;
  }

  const fullName = driver
    ? [driver.firstName, driver.lastName].filter(Boolean).join(' ') || user.email
    : user.email;

  return { userId, user, driver, companyId, fullName };
}

/**
 * Format a Shift DB record into the canonical API response shape.
 */
function formatShift(shift, fullName) {
  if (!shift) return null;
  const isActive = shift.status === 'ON_SHIFT';
  return {
    id: shift.id,
    status: isActive ? 'ACTIVE' : shift.status === 'COMPLETED' ? 'COMPLETED' : shift.status,
    dbStatus: shift.status,
    clockIn: shift.startTime,
    clockOut: isActive ? null : shift.endTime,
    date: shift.date,
    role: shift.role,
    notes: shift.notes,
    companyId: shift.companyId,
    employeeName: fullName || null,
    createdAt: shift.createdAt,
    updatedAt: shift.updatedAt
  };
}

/**
 * GET /api/v1/warehouse-portal/shift/current
 *
 * Returns the currently ACTIVE (ON_SHIFT) shift for the authenticated user.
 * If no active shift exists, returns shift: null.
 */
exports.getCurrentShift = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return; // response already sent by resolveYardDriver

    const { userId, companyId, fullName } = ctx;

    // Find the single open (ON_SHIFT) shift for this user+tenant
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId,
        companyId,
        status: 'ON_SHIFT'
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, {
      shift: formatShift(activeShift, fullName)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/warehouse-portal/shift/clock-in
 *
 * Creates a new ON_SHIFT record for the authenticated user.
 * Rejects if an active shift already exists.
 * Never reads driverId / userId / companyId from the request body.
 */
exports.clockInShift = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { userId, companyId, fullName, driver } = ctx;
    const { notes } = req.body || {};

    // Guard: reject duplicate clock-in
    const existing = await prisma.shift.findFirst({
      where: { userId, companyId, status: 'ON_SHIFT' }
    });
    if (existing) {
      return sendError(res, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'You are already clocked in. Please clock out before clocking in again.',
        details: { alreadyClockedIn: true, shiftId: existing.id }
      }, HTTP_STATUS.BAD_REQUEST);
    }

    // Authoritative server timestamp — never accept from client
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Use a sentinel far-future endTime (required by schema NOT NULL) until clock-out
    const sentinelEndTime = new Date('2099-12-31T23:59:59.999Z');

    const shift = await prisma.shift.create({
      data: {
        userId,
        driverId: driver?.id || null,
        companyId,
        role: driver?.role || 'Yard Attendant',
        date: today,
        startTime: now,          // authoritative clock-in timestamp
        endTime: sentinelEndTime, // sentinel — replaced on clock-out
        status: 'ON_SHIFT',
        notes: notes || null
      }
    });

    return sendSuccess(res, {
      shift: formatShift(shift, fullName),
      message: 'Clocked in successfully! Shift started.'
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/warehouse-portal/shift/clock-out
 *
 * Closes the active ON_SHIFT record.  Validates that the shift belongs to
 * the authenticated user + tenant before writing.
 */
exports.clockOutShift = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { userId, companyId, fullName } = ctx;
    const { notes } = req.body || {};

    // Find the active shift — must match authenticated user AND tenant
    const activeShift = await prisma.shift.findFirst({
      where: { userId, companyId, status: 'ON_SHIFT' }
    });

    if (!activeShift) {
      return sendError(res, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'You are not currently clocked in. No active shift found.',
        details: { notClockedIn: true }
      }, HTTP_STATUS.BAD_REQUEST);
    }

    // Double-check ownership (IDOR guard — belt and suspenders)
    if (activeShift.userId !== userId || activeShift.companyId !== companyId) {
      return sendError(res, {
        code: ERROR_CODES.UNAUTHORIZED_ACCESS,
        message: 'Access denied.'
      }, HTTP_STATUS.FORBIDDEN);
    }

    const now = new Date(); // authoritative clock-out timestamp

    const updated = await prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        endTime: now,          // overwrite sentinel with real clock-out
        status: 'COMPLETED',
        notes: notes || activeShift.notes
      }
    });

    return sendSuccess(res, {
      shift: formatShift(updated, fullName),
      message: 'Clocked out successfully! Shift completed.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/warehouse-portal/shift/history
 *
 * Returns paginated shift history for the authenticated user, strictly
 * scoped to their own records and tenant.
 */
exports.getShiftHistory = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { userId, companyId, fullName } = ctx;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [shifts, total] = await Promise.all([
      prisma.shift.findMany({
        where: { userId, companyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.shift.count({ where: { userId, companyId } })
    ]);

    return sendSuccess(res, {
      shifts: shifts.map(s => formatShift(s, fullName)),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 15. YARD & WAREHOUSE ISSUE REPORTING
// ============================================================================

exports.reportIssue = async (req, res, next) => {
  try {
    const { category, trailerId, description, severity = 'Medium', checklist } = req.body;
    const userId = req.user?.userId || req.user?.id;
    const tenantId = req.tenantId;

    if (!trailerId || !description) {
      return sendError(res, { code: ERROR_CODES.BAD_REQUEST, message: 'Identifier and description are required' }, HTTP_STATUS.BAD_REQUEST);
    }

    // Match item in loadItem if possible
    const matchedItem = await prisma.loadItem.findFirst({
      where: {
        OR: [
          { rego: { equals: trailerId, mode: 'insensitive' } },
          { vin: { equals: trailerId, mode: 'insensitive' } },
          { stockRef: { equals: trailerId, mode: 'insensitive' } },
          { id: trailerId }
        ]
      }
    });

    // If High severity and matched item, put on damage hold
    if (matchedItem && (severity.toLowerCase().includes('high') || (category && category.toLowerCase().includes('damage')))) {
      await prisma.loadItem.update({
        where: { id: matchedItem.id },
        data: {
          damageReportReq: true,
          notes: matchedItem.notes ? `${matchedItem.notes} | ISSUE: ${description}` : `ISSUE: ${description}`
        }
      });

      // Also record movement exception
      await prisma.itemMovement.create({
        data: {
          itemId: matchedItem.id,
          type: 'RELOCATION',
          fromLocation: `${matchedItem.zone || 'Yard'} / ${matchedItem.row || ''}`,
          toLocation: 'HOLD / DEFECT AREA',
          reason: `DEFECT: ${description}`,
          result: 'HOLD',
          performedById: userId || null,
          status: 'Hold'
        }
      });
    }

    // Create Audit Log entry for canonical persistence
    const auditRecord = await prisma.auditLog.create({
      data: {
        companyId: tenantId || null,
        operator: req.user?.email || 'yard@hero.com',
        ipAddress: req.ip || '127.0.0.1',
        action: `YARD_ISSUE_LOGGED:${JSON.stringify({
          category,
          identifier: trailerId,
          resourceId: matchedItem ? matchedItem.id : trailerId,
          description,
          severity,
          checklist: checklist || {},
          status: 'ACTIVE',
          reportedAt: new Date().toISOString()
        })}`
      }
    });

    return sendSuccess(res, {
      id: auditRecord.id,
      category: category && category.includes('Damage') ? 'Damage' : 'Missing Item',
      trailerId,
      description,
      severity: severity.split(' ')[0],
      loggedDate: new Date().toISOString(),
      status: 'ACTIVE'
    }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getReportedIssues = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: {
          contains: 'YARD_ISSUE_LOGGED'
        },
        ...(tenantId && { companyId: tenantId })
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formatted = auditLogs.map(log => {
      let parsed = {};
      try {
        const jsonPart = log.action.includes('YARD_ISSUE_LOGGED:') 
          ? log.action.split('YARD_ISSUE_LOGGED:')[1] 
          : log.action;
        parsed = JSON.parse(jsonPart);
      } catch (e) {}
      return {
        id: log.id,
        category: parsed.category ? (parsed.category.includes('Damage') ? 'Damage' : 'Missing Item') : 'Damage',
        trailerId: parsed.identifier || parsed.resourceId || 'Unknown',
        description: parsed.description || 'Inspection issue reported',
        severity: parsed.severity ? parsed.severity.split(' ')[0] : 'Medium',
        loggedDate: log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-US') : 'Recent',
        status: parsed.status || 'ACTIVE'
      };
    });

    return sendSuccess(res, formatted);
  } catch (error) {
    next(error);
  }
};

exports.resolveReportedIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Log resolution to audit log
    await prisma.auditLog.create({
      data: {
        companyId: req.tenantId || null,
        operator: req.user?.email || 'yard@hero.com',
        ipAddress: req.ip || '127.0.0.1',
        action: `YARD_ISSUE_RESOLVED:${JSON.stringify({ issueId: id, resolvedAt: new Date().toISOString() })}`
      }
    });

    return sendSuccess(res, { success: true, message: 'Issue resolved successfully.' });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 16. YARD ATTENDANT TASK MANAGEMENT — PHASE D
//
// All endpoints resolve identity strictly from JWT (req.user.userId) and
// enforce tenant isolation via req.tenantId.
// ============================================================================

const VALID_TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const VALID_TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function formatYardTask(task) {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    desc: task.description || '',
    description: task.description || '',
    status: task.status, // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    priority: task.priority || 'MEDIUM', // LOW, MEDIUM, HIGH, URGENT
    taskType: task.taskType || 'GENERAL',
    gate: task.gate || '—',
    trailer: task.trailerRef || '—',
    trailerRef: task.trailerRef || null,
    dueTime: task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    dueDate: task.dueDate || null,
    completedAt: task.completedAt || null,
    notes: task.notes || '',
    assignedDriverId: task.driverId || null,
    assignedUserId: task.userId || null,
    warehouseId: task.warehouseId || null,
    companyId: task.companyId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

/**
 * GET /api/v1/warehouse-portal/tasks
 *
 * Returns tasks for the authenticated Yard Attendant / Warehouse,
 * strictly filtered by the authenticated tenant (companyId).
 */
exports.getTasks = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { userId, companyId, driver } = ctx;
    const { status, priority, taskType } = req.query;

    const where = {
      companyId, // Tenant isolation
      ...(driver?.warehouseId ? {
        OR: [
          { warehouseId: driver.warehouseId },
          { warehouseId: null },
          { userId },
          { driverId: driver.id }
        ]
      } : {})
    };

    if (status) {
      const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
      if (VALID_TASK_STATUSES.includes(normalizedStatus)) {
        where.status = normalizedStatus;
      }
    }

    if (priority) {
      const normalizedPriority = priority.toUpperCase();
      if (VALID_TASK_PRIORITIES.includes(normalizedPriority)) {
        where.priority = normalizedPriority;
      }
    }

    if (taskType) {
      where.taskType = taskType.toUpperCase();
    }

    const tasks = await prisma.yardTask.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Compute live summary counters directly from real DB records
    const allTenantTasks = await prisma.yardTask.findMany({
      where: { companyId },
      select: { status: true, priority: true }
    });

    const summary = {
      total: allTenantTasks.length,
      pending: allTenantTasks.filter(t => t.status === 'PENDING').length,
      inProgress: allTenantTasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: allTenantTasks.filter(t => t.status === 'COMPLETED').length,
      highPriority: allTenantTasks.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length
    };

    return sendSuccess(res, {
      tasks: tasks.map(formatYardTask),
      summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/warehouse-portal/tasks/:taskId
 *
 * Fetches a single task by ID. Enforces strict tenant isolation.
 */
exports.getTaskById = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { companyId } = ctx;
    const { taskId } = req.params;

    const task = await prisma.yardTask.findFirst({
      where: { id: taskId, companyId }
    });

    if (!task) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Task not found or access denied.'
      }, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, {
      task: formatYardTask(task)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/warehouse-portal/tasks/:taskId/status
 * (also supports PUT)
 *
 * Updates a task's status with validation of allowed transitions.
 */
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { companyId, userId, driver } = ctx;
    const { taskId } = req.params;
    const { status, notes } = req.body || {};

    if (!status) {
      return sendError(res, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Status is required.'
      }, HTTP_STATUS.BAD_REQUEST);
    }

    const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
    if (!VALID_TASK_STATUSES.includes(normalizedStatus)) {
      return sendError(res, {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Invalid status '${status}'. Must be one of: ${VALID_TASK_STATUSES.join(', ')}`
      }, HTTP_STATUS.BAD_REQUEST);
    }

    // Verify task exists and belongs to the tenant
    const existing = await prisma.yardTask.findFirst({
      where: { id: taskId, companyId }
    });

    if (!existing) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Task not found or access denied.'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const updateData = {
      status: normalizedStatus,
      updatedAt: new Date()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (normalizedStatus === 'COMPLETED' && !existing.completedAt) {
      updateData.completedAt = new Date(); // authoritative server timestamp
    } else if (normalizedStatus === 'IN_PROGRESS' && !existing.userId) {
      updateData.userId = userId;
      if (driver?.id) updateData.driverId = driver.id;
    }

    const updated = await prisma.yardTask.update({
      where: { id: taskId },
      data: updateData
    });

    return sendSuccess(res, {
      task: formatYardTask(updated),
      message: `Task status updated to ${normalizedStatus}.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/warehouse-portal/tasks/:taskId/complete
 *
 * Dedicated task completion endpoint. Sets status to COMPLETED and
 * records authoritative completion timestamp.
 */
exports.completeTask = async (req, res, next) => {
  try {
    const ctx = await resolveYardDriver(req, res);
    if (!ctx) return;

    const { companyId } = ctx;
    const { taskId } = req.params;
    const { notes } = req.body || {};

    const existing = await prisma.yardTask.findFirst({
      where: { id: taskId, companyId }
    });

    if (!existing) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Task not found or access denied.'
      }, HTTP_STATUS.NOT_FOUND);
    }

    const now = new Date(); // Authoritative server timestamp

    const updated = await prisma.yardTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: now,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: now
      }
    });

    return sendSuccess(res, {
      task: formatYardTask(updated),
      message: 'Task marked as completed successfully.'
    });
  } catch (error) {
    next(error);
  }
};


// --- Additional Warehouse Portal Handlers from Master ---

exports.getInboundFormOptions = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    const [suppliers, drivers, vehicles, warehouses] = await Promise.all([
      prisma.customer.findMany({
        where: { ...(tenantId && { companyId: tenantId }), type: 'BUSINESS' },
        select: { id: true, name: true, abn: true }
      }),
      prisma.driver.findMany({
        where: { ...(tenantId && { companyId: tenantId }), status: 'AVAILABLE' },
        select: { id: true, user: { select: { name: true } }, licenseNumber: true }
      }),
      prisma.vehicle.findMany({
        where: { ...(tenantId && { companyId: tenantId }), status: 'IDLE' },
        select: { id: true, rego: true, make: true, model: true }
      }),
      prisma.warehouse.findMany({
        where: { ...(tenantId && { branch: { companyId: tenantId } }) },
        select: { id: true, name: true, code: true }
      })
    ]);

    const formattedDrivers = drivers.map(d => ({
      id: d.id,
      name: d.user?.name || `Driver ${d.licenseNumber || d.id.slice(-4)}`
    }));

    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      name: `${v.rego} - ${v.make} ${v.model}`
    }));

    return sendSuccess(res, {
      suppliers,
      drivers: formattedDrivers,
      vehicles: formattedVehicles,
      warehouses
    });
  } catch (error) {
    next(error);
  }
};

exports.createLoadLane = async (req, res, next) => {
  try {
    const { name, area } = req.body;
    const tenantId = req.tenantId;
    
    // Get default warehouse
    const warehouse = await prisma.warehouse.findFirst({
      where: { ...(tenantId && { branch: { companyId: tenantId } }) }
    });

    if (!warehouse) {
      return sendError(res, { code: 'NO_WAREHOUSE', message: 'No default warehouse found' }, HTTP_STATUS.BAD_REQUEST);
    }

    const lane = await prisma.loadLane.create({
      data: {
        name,
        warehouseId: warehouse.id,
        status: 'Empty'
      }
    });

    return sendSuccess(res, lane, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateLoadLaneStatus = async (req, res, next) => {
  try {
    const { laneId } = req.params;
    const { status } = req.body;

    const lane = await prisma.loadLane.update({
      where: { id: laneId },
      data: { status }
    });

    return sendSuccess(res, lane);
  } catch (error) {
    next(error);
  }
};

exports.assignDriverToLane = async (req, res, next) => {
  try {
    const { laneId } = req.params;
    const { driverId, vehicleId } = req.body;

    const lane = await prisma.loadLane.findUnique({
      where: { id: laneId },
      include: { loads: { where: { status: 'DRAFT' } } }
    });

    if (!lane) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Lane not found' }, HTTP_STATUS.NOT_FOUND);
    }

    let load = lane.loads[0];
    
    // If vehicleId has a slash or is empty from old UI, find actual vehicle or ignore. We assume valid IDs.
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } }).catch(() => null);

    if (load) {
      // Update existing draft load
      load = await prisma.load.update({
        where: { id: load.id },
        data: {
          driverId,
          truckId: vehicle?.category === 'TRUCK' ? vehicle.id : null,
          trailerId: vehicle?.category === 'TRAILER' ? vehicle.id : null
        }
      });
    } else {
      // Create new draft load
      load = await prisma.load.create({
        data: {
          loadRef: `LD-${Math.floor(10000 + Math.random() * 90000)}`,
          type: 'Standard',
          status: 'DRAFT',
          loadLaneId: laneId,
          driverId,
          truckId: vehicle?.category === 'TRUCK' ? vehicle.id : null,
          trailerId: vehicle?.category === 'TRAILER' ? vehicle.id : null
        }
      });
    }

    return sendSuccess(res, load);
  } catch (error) {
    next(error);
  }
};

exports.moveLaneItems = async (req, res, next) => {
  try {
    const { sourceLaneId, targetLaneId } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!sourceLaneId || !targetLaneId) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Source and target lanes required' }, HTTP_STATUS.BAD_REQUEST);
    }

    const items = await prisma.loadItem.findMany({ where: { loadLaneId: sourceLaneId } });
    
    if (items.length === 0) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Source lane is empty' }, HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.$transaction(async (tx) => {
      // Update items
      await tx.loadItem.updateMany({
        where: { loadLaneId: sourceLaneId },
        data: { loadLaneId: targetLaneId }
      });

      // Update target lane status to IN_PROGRESS
      await tx.loadLane.update({
        where: { id: targetLaneId },
        data: { status: 'IN_PROGRESS' }
      });

      // Update source lane status to EMPTY
      await tx.loadLane.update({
        where: { id: sourceLaneId },
        data: { status: 'EMPTY' }
      });

      // Log movements
      const movements = items.map(item => ({
        itemId: item.id,
        type: 'MOVE',
        fromLocation: `Lane:${sourceLaneId}`,
        toLocation: `Lane:${targetLaneId}`,
        loadLaneId: targetLaneId,
        performedById: userId,
        reason: 'Moved between lanes',
        result: 'COMPLETED'
      }));
      await tx.itemMovement.createMany({ data: movements });
    });

    return sendSuccess(res, { message: 'Items moved successfully' }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.clearLoadLane = async (req, res, next) => {
  try {
    const { laneId } = req.params;
    const userId = req.user?.userId || req.user?.id;

    await prisma.$transaction(async (tx) => {
      const items = await tx.loadItem.findMany({ where: { loadLaneId: laneId } });
      
      await tx.loadItem.updateMany({
        where: { loadLaneId: laneId },
        data: { loadLaneId: null, stockStatus: 'IN_STORAGE' }
      });

      await tx.loadLane.update({
        where: { id: laneId },
        data: { status: 'EMPTY' }
      });

      if (items.length > 0) {
        const movements = items.map(item => ({
          itemId: item.id,
          type: 'MOVE',
          fromLocation: `Lane:${laneId}`,
          toLocation: 'General Storage',
          performedById: userId,
          reason: 'Lane cleared and released',
          result: 'COMPLETED'
        }));
        await tx.itemMovement.createMany({ data: movements });
      }
    });

    return sendSuccess(res, { message: 'Lane cleared successfully' }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.printManifest = async (req, res, next) => {
  try {
    const { laneId } = req.params;

    const lane = await prisma.loadLane.findUnique({
      where: { id: laneId },
      include: {
        loadItems: true,
        loads: {
          include: {
            driver: true,
            vehicle: true
          }
        }
      }
    });

    if (!lane) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Lane not found' }, HTTP_STATUS.NOT_FOUND);
    }

    const activeLoad = lane.loads.find(l => l.status !== 'COMPLETED' && l.status !== 'CANCELLED');

    const manifestData = {
      laneName: lane.name,
      status: lane.status,
      date: new Date().toISOString(),
      driverName: activeLoad?.driver ? `${activeLoad.driver.firstName} ${activeLoad.driver.lastName}` : 'Unassigned',
      vehicleLicense: activeLoad?.vehicle ? activeLoad.vehicle.licenseNumber : 'Unassigned',
      totalItems: lane.loadItems.length,
      items: lane.loadItems.map(item => ({
        vin: item.vin,
        make: item.make,
        model: item.model,
        condition: item.condition
      }))
    };

    return sendSuccess(res, { manifest: manifestData }, HTTP_STATUS.OK);

  } catch (error) {
    next(error);
  }
};

exports.moveHoldingAreaStock = async (req, res, next) => {
  try {
    const stagingAreaId = req.params.id;
    const { loadLaneId } = req.body;
    let userId = req.user?.userId || req.user?.id;
    if (userId === 'dev-user-id') {
       const firstUser = await prisma.user.findFirst();
       if (firstUser) userId = firstUser.id;
    }

    const stagingArea = await prisma.stagingArea.findUnique({
      where: { id: stagingAreaId },
      include: { loadItems: true }
    });

    if (!stagingArea) return sendError(res, { message: 'Staging Area not found' }, HTTP_STATUS.NOT_FOUND);
    if (!loadLaneId) return sendError(res, { message: 'Load Lane ID is required' }, HTTP_STATUS.BAD_REQUEST);

    const targetLane = await prisma.loadLane.findUnique({ where: { id: loadLaneId } });
    if (!targetLane) return sendError(res, { message: 'Target Load Lane not found' }, HTTP_STATUS.NOT_FOUND);

    const updated = await prisma.$transaction(async (tx) => {
      // Update all items in this staging area
      await tx.loadItem.updateMany({
        where: { stagingAreaId: stagingAreaId },
        data: {
          loadLaneId: loadLaneId,
          stockStatus: 'STAGED',
          stagingAreaId: null
        }
      });

      for (const item of stagingArea.loadItems) {
        await tx.itemMovement.create({
          data: {
            itemId: item.id,
            type: 'TRANSFER',
            fromLocation: `Staging Area: ${stagingArea.name}`,
            toLocation: `Lane: ${targetLane.name}`,
            reason: 'Staging to Load Lane Move Task',
            result: 'COMPLETED',
            performedById: userId === 'dev-user-id' ? null : (userId || null),
            loadLaneId: loadLaneId
          }
        });
      }

      return { success: true, count: stagingArea.loadItems.length };
    });

    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

exports.assignHoldingAreaToLane = async (req, res, next) => {
  try {
    const stagingAreaId = req.params.id;
    const { loadLaneId } = req.body;
    let userId = req.user?.userId || req.user?.id;

    if (!loadLaneId) return sendError(res, { message: 'Load Lane ID is required' }, HTTP_STATUS.BAD_REQUEST);

    const updatedArea = await prisma.stagingArea.update({
      where: { id: stagingAreaId },
      data: { lane: `Load Lane ${loadLaneId}` } // simple string representation for frontend mapping
    });

    return sendSuccess(res, { message: 'Assigned successfully', data: updatedArea });
  } catch (error) {
    next(error);
  }
};

exports.getShiftStatus = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let realUserId = userId;
    const driverCheck = await prisma.driver.findFirst({ where: { OR: [{ id: userId }, { userId: userId }] } });
    if (driverCheck) {
      realUserId = driverCheck.id;
    } else {
      const firstDriver = await prisma.driver.findFirst();
      if (firstDriver) realUserId = firstDriver.id;
    }

    const timesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: realUserId,
        date: today
      }
    });

    const isClockedIn = !!(timesheet && timesheet.clockInAt && !timesheet.clockOutAt);

    return sendSuccess(res, {
      clockedIn: isClockedIn,
      clockInTime: timesheet?.clockInAt || null,
      clockOutTime: timesheet?.clockOutAt || null,
      timesheet
    });
  } catch (error) {
    next(error);
  }
};

exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const companyId = req.tenantId || (await prisma.company.findFirst()).id;
    
    // Check if already clocked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let realUserId = userId;
    const driverCheck = await prisma.driver.findFirst({ where: { OR: [{ id: userId }, { userId: userId }] } });
    if (driverCheck) {
      realUserId = driverCheck.id;
    } else {
      const firstDriver = await prisma.driver.findFirst();
      if (firstDriver) realUserId = firstDriver.id;
    }

    let timesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: realUserId, // Assuming user acts as driver/staff
        date: today
      }
    });

    console.log('--- DEBUG CLOCK IN ---');
    console.log('Original userId:', userId);
    console.log('realUserId (Driver):', realUserId);
    console.log('companyId:', companyId);
    console.log('Timesheet found?', !!timesheet);

    if (!timesheet) {
      // Create new timesheet
      timesheet = await prisma.timesheet.create({
        data: {
          driverId: realUserId,
          companyId: companyId,
          date: today,
          status: 'DRAFT',
          clockInAt: new Date()
        }
      });
    } else if (!timesheet.clockInAt) {
      timesheet = await prisma.timesheet.update({
        where: { id: timesheet.id },
        data: { clockInAt: new Date() }
      });
    } else {
      return sendError(res, { message: 'Already clocked in' }, HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.timesheetEvent.create({
      data: {
        timesheetId: timesheet.id,
        type: 'CLOCK_IN',
        timestamp: new Date(),
        locationName: 'Warehouse Default'
      }
    });

    return sendSuccess(res, { message: 'Clocked in successfully', timesheet }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let realUserId = userId;
    const driverCheck = await prisma.driver.findFirst({ where: { OR: [{ id: userId }, { userId: userId }] } });
    if (driverCheck) {
      realUserId = driverCheck.id;
    } else {
      const firstDriver = await prisma.driver.findFirst();
      if (firstDriver) realUserId = firstDriver.id;
    }

    let timesheet = await prisma.timesheet.findFirst({
      where: {
        driverId: realUserId,
        date: today
      }
    });

    if (!timesheet || !timesheet.clockInAt) {
      return sendError(res, { message: 'Not clocked in yet' }, HTTP_STATUS.BAD_REQUEST);
    }

    if (timesheet.clockOutAt) {
      return sendError(res, { message: 'Already clocked out' }, HTTP_STATUS.BAD_REQUEST);
    }

    timesheet = await prisma.timesheet.update({
      where: { id: timesheet.id },
      data: { 
        clockOutAt: new Date(),
        status: 'SUBMITTED'
      }
    });

    await prisma.timesheetEvent.create({
      data: {
        timesheetId: timesheet.id,
        type: 'CLOCK_OUT',
        timestamp: new Date(),
        locationName: 'Warehouse Default'
      }
    });

    return sendSuccess(res, { message: 'Clocked out successfully', timesheet }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.getSupportDashboard = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    // 1. Fetch Conversations
    const conversations = await prisma.conversation.findMany({
      where: { ...(tenantId && { companyId: tenantId }) },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        participants: {
          include: { user: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // 2. Fetch Support Tickets
    const supportTickets = await prisma.supportTicket.findMany({
      where: { ...(tenantId && { companyId: tenantId }) },
      orderBy: { createdAt: 'desc' }
    });

    // Formatting for frontend
    let unreadMessagesCount = 0;
    const formattedConversations = conversations.map((conv, idx) => {
      const messages = conv.messages || [];
      const lastMessage = messages[messages.length - 1];
      const isRead = true; // Simplified for now
      if (!isRead) unreadMessagesCount++;

      return {
        id: conv.id,
        title: conv.title || 'Conversation',
        sub: conv.referenceType || 'Support',
        listSub: conv.referenceId || 'General',
        avatar: conv.title ? conv.title.substring(0, 2).toUpperCase() : 'C',
        bg: 'bg-blue-600',
        time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        dateStarted: new Date(conv.createdAt).toLocaleString('en-GB'),
        lastMessage: lastMessage?.content || 'No messages yet',
        unread: isRead ? 0 : 1,
        category: 'Support',
        isBot: false,
        messages: messages.map(m => ({
          id: m.id,
          sender: m.senderId === req.user?.id ? 'You' : 'Support Team',
          isMe: m.senderId === req.user?.id,
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true
        }))
      };
    });

    const formattedTickets = supportTickets.map(t => ({
      id: `#SUP-${t.ticketNumber}`,
      title: t.subject,
      created: new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: t.status === 'OPEN' ? 'Open' : (t.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'),
      statusBg: t.status === 'OPEN' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE047]' : 'bg-blue-50 text-blue-700 border-blue-200'
    }));

    const openTicketsCount = supportTickets.filter(t => t.status === 'OPEN').length;
    const awaitingResponseCount = supportTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedTicketsCount = supportTickets.filter(t => t.status === 'CLOSED').length;

    return sendSuccess(res, {
      kpi: {
        unreadMessages: unreadMessagesCount,
        openTickets: openTicketsCount,
        awaitingResponse: awaitingResponseCount,
        resolvedTickets: resolvedTicketsCount
      },
      conversations: formattedConversations,
      supportTickets: formattedTickets
    });

  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user?.id;

    if (!senderId) return sendError(res, { code: 'UNAUTHORIZED', message: 'Not logged in' }, HTTP_STATUS.UNAUTHORIZED);
    if (!text) return sendError(res, { code: 'BAD_REQUEST', message: 'Text is required' }, HTTP_STATUS.BAD_REQUEST);

    let targetConvId = conversationId;
    if (!targetConvId) {
      const companyId = req.tenantId || (await prisma.company.findFirst()).id;
      const conv = await prisma.conversation.create({
        data: {
          title: 'General Support',
          companyId,
          type: 'DIRECT',
          participants: {
            create: { userId: senderId }
          }
        }
      });
      targetConvId = conv.id;
    }

    const newMsg = await prisma.message.create({
      data: {
        conversationId: targetConvId,
        senderId,
        content: text
      }
    });

    await prisma.conversation.update({
      where: { id: targetConvId },
      data: { updatedAt: new Date() }
    });

    return sendSuccess(res, { message: newMsg }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.createSupportTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, description } = req.body;
    const companyId = req.tenantId || (await prisma.company.findFirst()).id;

    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        category: category || 'General',
        priority: priority === 'High' ? 'HIGH' : (priority === 'Urgent' ? 'URGENT' : 'MEDIUM'),
        message: description || subject,
        companyId,
        status: 'OPEN'
      }
    });

    return sendSuccess(res, { ticket }, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};
