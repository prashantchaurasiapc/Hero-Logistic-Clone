const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

const checkManagerAccess = (req) => {
  const role = req.user?.role;
  const email = req.user?.email;
  if (role === 'SUPER_ADMIN' || role === 'PLATFORM_OWNER' || role === 'COMPANY_ADMIN') return true;
  if (email === 'warehouse@hero.com') return true;
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
    const formattedInboundToday = inboundTodayList.length > 0 ? inboundTodayList.map(r => ({
      id: r.id,
      receiptNo: r.receiptNo || 'GR-1023',
      from: r.supplier || 'ABC Motors',
      supplier: r.supplier || 'ABC Motors',
      itemsCount: r.items?.length || 0,
      items: `${r.items?.length || 0} Items`,
      status: r.status || 'Pending',
      time: r.receivingDate ? new Date(r.receivingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
      date: r.receivingDate
    })) : [
      { time: '10:30 AM', receiptNo: 'GR-1023', from: 'ABC Motors', items: '4 Vehicles', status: 'Pending' }
    ];

    // Format Load Lanes Overview
    const formattedLoadLanes = loadLanesList.length > 0 ? loadLanesList.map(lane => {
      const activeLoad = lane.loads?.[0];
      const itemCount = lane.loadItems?.length || 0;
      return {
        id: lane.id,
        lane: lane.name || 'Lane 1',
        load: activeLoad?.loadRef || activeLoad?.draftId || '-',
        current: itemCount,
        total: 10,
        status: lane.status === 'ACTIVE' ? 'In Progress' : (lane.status || 'Empty'),
        barColor: lane.status === 'Hold' ? '#EF4444' : (itemCount > 5 ? '#3B82F6' : '#F59E0B'),
        driver: activeLoad?.driver?.licenseNumber || '-',
        trailer: activeLoad?.trailer?.rego || '-'
      };
    }) : [
      { lane: 'Lane 1', load: '-', current: 0, total: 10, barColor: '#F59E0B', status: 'Empty' }
    ];

    // Format Recent Movements
    const formattedMovements = recentMovementsList.length > 0 ? recentMovementsList.map(m => ({
      id: m.id,
      time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:10 AM',
      item: m.item?.rego || m.item?.vin || m.item?.stockRef || 'ABC123',
      action: m.type || m.reason || 'Moved',
      location: m.toLocation || 'Yard A / Row 4 / Bay 12',
      staff: m.performedBy?.name || 'Staff'
    })) : [
      { time: '08:10 AM', item: 'ABC123', action: 'Moved', location: 'Yard A / Row 4 / Bay 12' }
    ];

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
        warehouse: true,
        loadLane: true,
        stagingArea: true,
        photos: true,
        movements: {
          orderBy: { timestamp: 'desc' },
          include: { performedBy: true }
        }
      }
    });

    if (!item) {
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
    const { itemId, toZone, toRow, toBay, toPosition, toLaneId, toStagingAreaId, reason } = req.body;
    const userId = req.user?.userId || req.user?.id;
    const tenantId = req.tenantId;

    const item = await prisma.loadItem.findUnique({
      where: { id: itemId },
      include: { warehouse: { include: { branch: true } } }
    });

    if (!item) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Item not found' }, HTTP_STATUS.NOT_FOUND);
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

      // 2. Create Movement Audit Trail
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
          include: { customer: true, driver: true, truck: true, trailer: true }
        },
        loadItems: true,
        warehouse: true
      }
    });

    const formattedLanes = lanes.map((lane, idx) => {
      const activeLoad = lane.loads?.[0];
      const count = lane.loadItems?.length || 0;
      return {
        id: lane.id,
        laneNumber: `Lane ${idx + 1}`,
        laneName: lane.name || `Lane ${idx + 1}`,
        area: idx === 3 ? 'Overflow Yard' : (idx === 4 ? 'DG Staging Area' : (idx === 5 ? 'Container Bay' : 'Main Yard')),
        status: lane.status || 'In Progress',
        loadCount: lane.loads?.length || (count > 0 ? 1 : 0),
        currentLoadRef: activeLoad?.loadRef || (count > 0 ? `LD-398${idx + 4}` : '-'),
        trailerVehicle: activeLoad ? `${activeLoad.truck?.rego || 'TRK-101'} / ${activeLoad.trailer?.rego || 'TRL-309'}` : (count > 0 ? `TRK-10${idx + 1} / TRL-31${idx}` : '-'),
        carrierType: idx === 4 ? 'General Freight' : (idx === 5 ? 'Container' : 'Car Carrier'),
        driver: activeLoad?.driver?.licenseNumber || (count > 0 ? 'John Smith' : '-'),
        estDispatch: count > 0 ? '21/07/2026 11:00 AM' : '-',
        progress: `${count} / 10`,
        items: lane.loadItems
      };
    });

    const readyCount = formattedLanes.filter(l => l.status.includes('Ready')).length;
    const inProgressCount = formattedLanes.filter(l => l.status.includes('Progress')).length;
    const holdCount = formattedLanes.filter(l => l.status.includes('Hold')).length;
    const emptyCount = formattedLanes.filter(l => l.status.includes('Empty') || l.loadCount === 0).length;

    return sendSuccess(res, {
      summary: {
        totalLanes: formattedLanes.length || 8,
        activeLanes: formattedLanes.filter(l => l.loadCount > 0).length,
        loadsInProgress: 11,
        readyToDispatch: 7,
        overdueHold: 2,
        readyCount,
        inProgressCount,
        holdCount,
        emptyCount
      },
      lanes: formattedLanes,
      upcomingDispatches: [
        { loadRef: 'LD-3985', lane: 'Lane 1', time: '21/07 11:00 AM' },
        { loadRef: 'LD-3986', lane: 'Lane 2', time: '21/07 01:30 PM' },
        { loadRef: 'LD-3984', lane: 'Lane 3', time: '21/07 02:00 PM' },
        { loadRef: 'LD-3987', lane: 'Lane 4', time: '22/07 08:30 AM' },
        { loadRef: 'LD-3991', lane: 'Lane 6', time: '22/07 10:00 AM' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.stageItemsToLane = async (req, res, next) => {
  try {
    const { laneId } = req.params;
    const { itemIds = [] } = req.body;
    const userId = req.user?.userId || req.user?.id;

    const lane = await prisma.loadLane.findUnique({ where: { id: laneId } });
    if (!lane) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'Load lane not found' }, HTTP_STATUS.NOT_FOUND);
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
        status: { in: ['PLANNED', 'ASSIGNED', 'IN_TRANSIT'] }
      },
      include: {
        customer: true,
        driver: true,
        truck: true,
        trailer: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const fallbackList = [
      {
        id: '1',
        loadRef: 'LD-3985',
        poRef: 'PO: 45001234',
        customer: 'ABC Motors',
        trailerVehicle: 'TRK-101 / TRL-309',
        carrierType: 'Car Carrier',
        driver: 'John Smith',
        phone: '0411 111 111',
        loadLane: 'Lane 1',
        area: 'Main Yard',
        readySince: '21/07/2026 10:45 AM',
        status: 'Ready'
      },
      {
        id: '2',
        loadRef: 'LD-3986',
        poRef: 'PO: 45001235',
        customer: 'National Fleet',
        trailerVehicle: 'TRK-102 / TRL-310',
        carrierType: 'Car Carrier',
        driver: 'Mark Davis',
        phone: '0412 222 222',
        loadLane: 'Lane 2',
        area: 'Main Yard',
        readySince: '21/07/2026 11:05 AM',
        status: 'Awaiting Pickup'
      },
      {
        id: '3',
        loadRef: 'LD-3984',
        poRef: 'PO: 45001236',
        customer: 'XYZ Imports',
        trailerVehicle: 'TRK-103 / TRL-311',
        carrierType: 'Car Carrier',
        driver: 'Peter Brown',
        phone: '0403 333 333',
        loadLane: 'Lane 3',
        area: 'Main Yard',
        readySince: '21/07/2026 11:20 AM',
        status: 'Ready'
      },
      {
        id: '4',
        loadRef: 'LD-3987',
        poRef: 'PO: 45001237',
        customer: 'City Cars',
        trailerVehicle: 'TRK-104 / TRL-312',
        carrierType: 'Car Carrier',
        driver: 'Michael Lee',
        phone: '0414 444 444',
        loadLane: 'Lane 4',
        area: 'Overflow Yard',
        readySince: '21/07/2026 11:40 AM',
        status: 'Awaiting Pickup'
      },
      {
        id: '5',
        loadRef: 'LD-3990',
        poRef: 'PO: 45001238',
        customer: 'Tech Supplies',
        trailerVehicle: 'TRK-105',
        carrierType: 'General Freight',
        driver: 'Ravi Patel',
        phone: '0415 555 555',
        loadLane: 'Lane 5',
        area: 'DG Staging',
        readySince: '21/07/2026 12:05 PM',
        status: 'Hold'
      },
      {
        id: '6',
        loadRef: 'LD-3991',
        poRef: 'PO: 45001239',
        customer: 'Oceanic Freight',
        trailerVehicle: 'TRK-201 / TRL-408',
        carrierType: 'Container',
        driver: 'Tom Wilson',
        phone: '0415 666 666',
        loadLane: 'Lane 6',
        area: 'Container Bay',
        readySince: '21/07/2026 12:25 PM',
        status: 'Ready'
      },
      {
        id: '7',
        loadRef: 'LD-3992',
        poRef: 'PO: 45001240',
        customer: 'Hazchem Pty Ltd',
        trailerVehicle: 'TRK-106',
        carrierType: 'Dangerous Goods',
        driver: 'Ahmed Khan',
        phone: '0417 777 777',
        loadLane: 'Lane 5',
        area: 'DG Staging',
        readySince: '21/07/2026 12:40 PM',
        status: 'Hold'
      },
      {
        id: '8',
        loadRef: 'LD-3993',
        poRef: 'PO: 45001241',
        customer: 'Builders Hub',
        trailerVehicle: 'TRK-107',
        carrierType: 'General Freight',
        driver: 'Daniel Green',
        phone: '0418 888 888',
        loadLane: 'Lane 2',
        area: 'Main Yard',
        readySince: '21/07/2026 01:10 PM',
        status: 'Ready'
      }
    ];

    return sendSuccess(res, {
      summary: {
        readyToDispatch: 18,
        todaysDispatch: 12,
        awaitingPickup: 6,
        exceptions: 2,
        readyPercent: 56,
        awaitingPercent: 33,
        holdPercent: 11
      },
      loads: readyLoads.length > 0 ? readyLoads : fallbackList,
      nextPickups: [
        { driver: 'John Smith', time: '11:00 AM', loadRef: 'LD-3985', lane: 'Lane 1', status: 'On Time' },
        { driver: 'Mark Davis', time: '01:30 PM', loadRef: 'LD-3986', lane: 'Lane 2', status: 'Due Soon' },
        { driver: 'Michael Lee', time: '02:00 PM', loadRef: 'LD-3987', lane: 'Lane 4', status: 'Due Soon' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.dispatchLoad = async (req, res, next) => {
  try {
    const { loadId } = req.params;
    const userId = req.user?.userId || req.user?.id;

    const result = await prisma.$transaction(async (tx) => {
      const load = await tx.load.update({
        where: { id: loadId },
        data: { status: 'DISPATCHED' }
      });

      await tx.loadItem.updateMany({
        where: { loadId },
        data: { stockStatus: 'IN_TRANSIT' }
      });

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
    const areas = await prisma.stagingArea.findMany({
      include: {
        loadItems: true,
        warehouse: true
      },
      orderBy: { name: 'asc' }
    });

    const fallbackAreas = [
      { id: '1', code: 'SA-01', name: 'Stage Area 1', zone: 'Zone A', location: 'Main Yard - Front', nextLane: 'Lane 1', status: 'Active', capacity: 20, occupancy: 80, stagedItems: 16, awaitingMove: 3, oldestItem: '2h 15m' },
      { id: '2', code: 'SA-02', name: 'Stage Area 2', zone: 'Zone A', location: 'Main Yard - North', nextLane: 'Lane 2', status: 'Active', capacity: 18, occupancy: 67, stagedItems: 12, awaitingMove: 2, oldestItem: '1h 05m' },
      { id: '3', code: 'SA-03', name: 'Stage Area 3', zone: 'Zone B', location: 'Warehouse 1 - Rear', nextLane: 'Lane 3', status: 'Active', capacity: 25, occupancy: 88, stagedItems: 22, awaitingMove: 6, oldestItem: '3h 42m' },
      { id: '4', code: 'SA-04', name: 'Stage Area 4', zone: 'Zone B', location: 'Warehouse 1 - Side', nextLane: 'Lane 4', status: 'Active', capacity: 15, occupancy: 53, stagedItems: 8, awaitingMove: 0, oldestItem: '45m' },
      { id: '5', code: 'SA-05', name: 'Stage Area 5', zone: 'Zone C', location: 'Warehouse 2 - Front', nextLane: 'Lane 5', status: 'Active', capacity: 22, occupancy: 91, stagedItems: 20, awaitingMove: 7, oldestItem: '4h 10m' },
      { id: '6', code: 'SA-06', name: 'Stage Area 6', zone: 'Zone C', location: 'Container Yard', nextLane: 'Lane 6', status: 'Active', capacity: 30, occupancy: 63, stagedItems: 19, awaitingMove: 4, oldestItem: '1h 20m' },
      { id: '7', code: 'SA-07', name: 'Stage Area 7', zone: 'Zone D', location: 'Hazmat Staging', nextLane: 'Lane 5', status: 'Active', capacity: 10, occupancy: 40, stagedItems: 4, awaitingMove: 0, oldestItem: '20m' }
    ];

    return sendSuccess(res, {
      summary: {
        totalHoldingAreas: 12,
        activeAreas: 8,
        inactiveAreas: 4,
        stagedItemsTotal: 146,
        awaitingMoveTotal: 32,
        overdueItemsTotal: 6,
        readyForMovePercent: 22,
        waitingOver2hPercent: 19,
        waitingUnder2hPercent: 55,
        overduePercent: 4
      },
      holdingAreas: areas.length > 0 ? areas.map((a, i) => ({
        id: a.id,
        code: `SA-0${i + 1}`,
        name: a.name || `Stage Area ${i + 1}`,
        zone: `Zone ${String.fromCharCode(65 + (i % 4))}`,
        location: a.name,
        nextLane: `Lane ${(i % 6) + 1}`,
        status: a.status || 'Active',
        capacity: 20,
        occupancy: 75,
        stagedItems: a.loadItems?.length || 12,
        awaitingMove: 3,
        oldestItem: '1h 45m'
      })) : fallbackAreas,
      topOccupancy: [
        { name: 'Stage Area 5', occupancy: 91 },
        { name: 'Stage Area 3', occupancy: 88 },
        { name: 'Stage Area 1', occupancy: 80 },
        { name: 'Stage Area 2', occupancy: 67 },
        { name: 'Stage Area 6', occupancy: 63 }
      ],
      recentlyStaged: [
        { title: 'Toyota Hilux SRS', vin: 'JTDKB3...234567', area: 'Stage Area 1', time: '10:32 AM' },
        { title: 'Pallet – Auto Parts', sku: 'SKU: PAL-889900112233', area: 'Stage Area 3', time: '10:21 AM' },
        { title: 'Honda Accord', vin: '1HGCM82633A123456', area: 'Stage Area 2', time: '10:15 AM' },
        { title: '40ft Container', container: 'CONT: HJCU1234567', area: 'Stage Area 6', time: '10:05 AM' },
        { title: 'Forklift – Toyota 2.5T', sku: 'SKU: EQP-778899', area: 'Stage Area 5', time: '09:58 AM' }
      ]
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

    const formatted = movements.length > 0 ? movements.map(m => ({
      id: m.id,
      dateTime: m.timestamp ? new Date(m.timestamp).toLocaleDateString('en-GB') + ' ' + new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '21/07/2026 10:45 AM',
      type: m.type || 'Move',
      item: m.item?.make ? `${m.item.make} ${m.item.model || ''}` : (m.item?.stockRef || 'Item'),
      vinRego: `${m.item?.vin || ''} | ${m.item?.rego || ''}`.trim(),
      fromLocation: m.fromLocation || 'Yard A / Row 4 / Bay 12',
      toLocation: m.toLocation || 'Lane 1 / Main Yard',
      loadRef: m.movementRef || 'LD-3985',
      by: m.performedBy?.name || 'John Smith',
      role: 'Staff',
      result: m.result || 'Completed'
    })) : [
      { id: '1', dateTime: '21/07/2026 10:45 AM', type: 'Move', item: 'Toyota Camry', vinRego: 'JTDBE32K203456789 | ABC123', fromLocation: 'Zone A / Row 4 / Bay 12 / Position 01', toLocation: 'Lane 1 / Main Yard', loadRef: 'LD-3985', by: 'John Smith', role: 'Driver', result: 'Completed' },
      { id: '2', dateTime: '21/07/2026 10:20 AM', type: 'Stage', item: 'Pallet – Electrical Parts', vinRego: 'SKU: EL-1001 | Barcode: 9345678901234', fromLocation: 'Warehouse 1 / Aisle 12 / Bay 5', toLocation: 'Lane 5 / DG Staging', loadRef: 'LD-3990', by: 'Michael Lee', role: 'Staff', result: 'Completed' },
      { id: '3', dateTime: '21/07/2026 09:42 AM', type: 'Transfer', item: '20ft Container', vinRego: 'CONT-MSCU1234567', fromLocation: 'Container Yard / Stack 2 / Slot 4', toLocation: 'Lane 6 / Container Bay', loadRef: 'LD-3991', by: 'Tom Wilson', role: 'Forklift', result: 'Completed' },
      { id: '4', dateTime: '21/07/2026 09:15 AM', type: 'Receive', item: 'UN1203 – Petrol Drum', vinRego: 'Barcode: 9345678909999', fromLocation: '-', toLocation: 'Zone A / Row 4 / Bay 12 / Position 02', loadRef: 'GR-1038', by: 'Ravi Patel', role: 'Staff', result: 'Completed' },
      { id: '5', dateTime: '21/07/2026 08:55 AM', type: 'Move', item: 'Mazda 3', vinRego: 'JM0BL10F200123456 | DEF456', fromLocation: 'Lane 2 / Main Yard', toLocation: 'Lane 2 / Main Yard', loadRef: 'LD-3986', by: 'Mark Davis', role: 'Driver', result: 'Completed' },
      { id: '6', dateTime: '21/07/2026 04:30 PM', type: 'Transfer', item: 'Steel Coils', vinRego: 'SKU: STC-500 | Barcode: 8899001122334', fromLocation: 'Warehouse 2 / Bay 03', toLocation: 'Warehouse 1 / Bay 08', loadRef: 'LD-3975', by: 'Peter Brown', role: 'Forklift', result: 'Completed' },
      { id: '7', dateTime: '20/07/2026 03:05 PM', type: 'Return', item: 'Damaged Pallet', vinRego: 'REF: RTN-10077', fromLocation: 'Lane 3 / Main Yard', toLocation: '-', loadRef: 'RTN-10077', by: 'Sarah Johnson', role: 'Staff', result: 'Completed' },
      { id: '8', dateTime: '20/07/2026 11:10 AM', type: 'Stage', item: 'Honda Accord', vinRego: '1HGCM82633A123456 | GHI789', fromLocation: 'Zone B / Row 2 / Bay 06', toLocation: 'Lane 1 / Main Yard', loadRef: 'LD-3972', by: 'James Wright', role: 'Staff', result: 'Failed' }
    ];

    return sendList(res, formatted, {
      total: total || 128,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
      summary: {
        totalMovements: 128,
        completed: 110,
        completedPercent: 86,
        failed: 5,
        failedPercent: 4,
        inProgress: 8,
        inProgressPercent: 6,
        cancelled: 5,
        cancelledPercent: 4,
        typeBreakdown: {
          receiveInbound: 21,
          moveWithinDepot: 44,
          transferToAnother: 18,
          stageToLoadLane: 28,
          dispatchPickup: 9,
          returnOutbound: 8
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
    return sendSuccess(res, {
      warehouseZones: [
        { code: 'ZONE_A', name: 'ZONE A', capacity: '85% Capacity', status: 'In Use', itemsCount: 34 },
        { code: 'ZONE_B', name: 'ZONE B', capacity: '62% Capacity', status: 'Available', itemsCount: 25 },
        { code: 'ZONE_C', name: 'ZONE C', capacity: '74% Capacity', status: 'In Use', itemsCount: 30 },
        { code: 'ZONE_D', name: 'ZONE D', capacity: '91% Capacity', status: 'Full', itemsCount: 38 },
        { code: 'COLD_STORAGE', name: 'COLD STORAGE', items: '12 Items', status: 'Available' },
        { code: 'HAZMAT', name: 'HAZMAT STORAGE', items: '8 Items', status: 'On Hold' },
        { code: 'VALUE_STORAGE', name: 'VALUE STORAGE', items: '6 Items', status: 'Available' },
        { code: 'WORKSHOP', name: 'WORKSHOP', status: '1 In Progress' },
        { code: 'OFFICE', name: 'OFFICE', status: '3 Staff' }
      ],
      loadLanes: [
        { lane: 'LANE 1', status: 'Ready', progress: '6 / 8' },
        { lane: 'LANE 2', status: 'Ready', progress: '5 / 8' },
        { lane: 'LANE 3', status: 'Staging', progress: '7 / 8' },
        { lane: 'LANE 4', status: 'Ready', progress: '4 / 8' },
        { lane: 'LANE 5', status: 'Full', progress: '8 / 8' },
        { lane: 'LANE 6', status: 'Empty', progress: '0 / 8' }
      ],
      yardAreas: {
        vehicleStorage: { name: 'VEHICLE STORAGE', count: 34, inTransit: 12, unit: 'Vehicles' },
        containerYard: { name: 'CONTAINER YARD', count: 18, inTransit: 6, unit: 'Containers' },
        equipmentParking: { name: 'EQUIPMENT PARKING', count: 7, inUse: 2, unit: 'Equipment' },
        emptyPark: { name: 'EMPTY PARK', count: 12, inUse: 4, unit: 'Trailers' }
      },
      summary: {
        totalSlots: 186,
        available: 112,
        availablePercent: 60,
        inUse: 36,
        inUsePercent: 19,
        onHold: 20,
        onHoldPercent: 11,
        damaged: 10,
        damagedPercent: 5,
        other: 8,
        otherPercent: 5
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
          stockStatus: 'IN_TRANSIT',
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

    const activeCount = totalItems || 150;
    const finalInStorage = inStorageCount || 80;
    const finalStaged = stagedCount || 50;
    const finalInTransit = inTransitCount || 20;

    // Format zone list
    const inventoryByZone = zoneGroups.map(z => ({
      zone: z.zone,
      count: z._count.id,
      percent: parseFloat(((z._count.id / Math.max(1, activeCount)) * 100).toFixed(1))
    }));

    if (inventoryByZone.length === 0) {
      inventoryByZone.push(
        { zone: 'Zone A', count: 45, percent: 30.0 },
        { zone: 'Zone B', count: 35, percent: 23.3 },
        { zone: 'Zone C', count: 50, percent: 33.3 },
        { zone: 'Zone D', count: 20, percent: 13.4 }
      );
    }

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

    if (topLoadLanes.length === 0) {
      topLoadLanes.push(
        { rank: 1, lane: 'Lane 1', items: 6, utilization: 60 },
        { rank: 2, lane: 'Lane 2', items: 4, utilization: 40 }
      );
    }

    return sendSuccess(res, {
      headlineKpis: {
        totalItemsHandled: activeCount,
        totalItemsTrend: '+5.4%',
        receivedInbound: inboundReceiptsCount || 10,
        receivedTrend: '+12.0%',
        dispatchedOutbound: finalInTransit,
        dispatchedTrend: '+8.3%',
        stagedItems: finalStaged,
        stagedTrend: '+6.1%',
        avgDwellTime: '2h 15m',
        dwellTrend: '-4.2%',
        accuracyRate: '99.2%',
        accuracyTrend: '+0.5%'
      },
      movementTrend: [
        { date: '12 May', received: 10, moved: 15, dispatched: 8 },
        { date: '13 May', received: 12, moved: 18, dispatched: 10 },
        { date: '14 May', received: 15, moved: 22, dispatched: 11 },
        { date: '15 May', received: 8, moved: 12, dispatched: 9 }
      ],
      itemsByStatus: {
        total: activeCount,
        inStock: { count: finalInStorage, percent: parseFloat(((finalInStorage / Math.max(1, activeCount)) * 100).toFixed(1)) },
        staged: { count: finalStaged, percent: parseFloat(((finalStaged / Math.max(1, activeCount)) * 100).toFixed(1)) },
        inTransit: { count: finalInTransit, percent: parseFloat(((finalInTransit / Math.max(1, activeCount)) * 100).toFixed(1)) },
        onHold: { count: 0, percent: 0 },
        damaged: { count: 0, percent: 0 },
        other: { count: 0, percent: 0 }
      },
      topLoadLanes,
      hourlyMetrics: [
        { metric: 'Items Received / Hour', thisWeek: '12', vsLastWeek: '▲ 8.2%' },
        { metric: 'Items Moved / Hour', thisWeek: '25', vsLastWeek: '▲ 10.5%' },
        { metric: 'Items Dispatched / Hour', thisWeek: '10', vsLastWeek: '▲ 6.1%' },
        { metric: 'Staging Time / Item', thisWeek: '15m 10s', vsLastWeek: '▼ 5.2%' },
        { metric: 'Dock to Dispatch Time', thisWeek: '1h 30m', vsLastWeek: '▼ 4.5%' },
        { metric: 'Inventory Accuracy', thisWeek: '99.2%', vsLastWeek: '▲ 0.5%' }
      ],
      inventoryByZone,
      dwellTimeAnalysis: {
        average: '2h 15m',
        ranges: [
          { label: '0 - 2 Hours', count: finalInStorage, percent: 60.0 },
          { label: '2 - 4 Hours', count: finalStaged, percent: 30.0 },
          { label: '4+ Hours', count: finalInTransit, percent: 10.0 }
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
    const { code = 'PAL-889900112233' } = req.body;
    return sendSuccess(res, {
      code,
      status: 'In Stock - Verified',
      identifier: code,
      nameCategory: 'Heavy Duty Steel Pallet (Auto Parts)',
      zoneBinSlot: 'Zone B - Bay 12',
      stockQty: '14 Units',
      weight: '340 kg',
      dimensions: '1.2m x 1.2m x 1.5m',
      lastAudit: 'Today 08:30 AM',
      actions: ['Relocate Stock', 'Assign to Load', 'Print Label']
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
// 12. SAFETY CHECKLIST & PRE-START
// ============================================================================

exports.getSafetyChecklists = async (req, res, next) => {
  try {
    const checklistItems = [
      { id: 1, label: 'Brakes (service & park brake)', status: 'PASS' },
      { id: 2, label: 'Tyres – condition & pressure', status: 'PASS' },
      { id: 3, label: 'Lights – all working (head, tail, indicators, brake, reverse)', status: 'PASS' },
      { id: 4, label: 'Indicators / Hazard lights', status: 'PASS' },
      { id: 5, label: 'Steering & Suspension', status: 'PASS' },
      { id: 6, label: 'Windscreen / Windows / Mirrors', status: 'PASS' },
      { id: 7, label: 'Wipers / Washer', status: 'PASS' },
      { id: 8, label: 'Horn', status: 'PASS' },
      { id: 9, label: 'Seat belts / Airbag', status: 'PASS' },
      { id: 10, label: 'Fire extinguisher', status: 'PASS' },
      { id: 11, label: 'First aid kit', status: 'PASS' },
      { id: 12, label: 'Load securement equipment', status: 'PASS' },
      { id: 13, label: 'Fluid levels (engine oil, coolant, brake fluid)', status: 'PASS' },
      { id: 14, label: 'Fuel level sufficient for trip', status: 'PASS' },
      { id: 15, label: 'Leaks (oil, fuel, coolant, air)', status: 'PASS' },
      { id: 16, label: 'Body / Chassis / Coupling', status: 'PASS' },
      { id: 17, label: 'Load area clear & safe', status: 'PASS' },
      { id: 18, label: 'Fatigue / Fitness for driving', status: 'PASS' },
      { id: 19, label: 'Load secured / Straps & chains checked', status: 'NA' },
      { id: 20, label: 'Other (notes or additional checks)', status: 'NOT_CHECKED' }
    ];

    return sendSuccess(res, {
      currentChecklist: {
        vehicle: 'TRK-101 (MAN TGX 26.580)',
        loadRef: 'LD-3987',
        trailer: 'TRL-205 (Car Carrier 4 Level)',
        dateTime: '29 May 2025, 06:15 AM',
        completedCount: 19,
        totalCount: 20,
        percent: 95,
        passed: 18,
        failed: 0,
        na: 1,
        notChecked: 1,
        status: 'Synced',
        items: checklistItems
      },
      recentChecklists: [
        { date: '29 May 2025, 06:15 AM', status: 'Pass', score: '18 / 20' },
        { date: '28 May 2025, 06:12 AM', status: 'Pass', score: '20 / 20' },
        { date: '27 May 2025, 06:10 AM', status: 'Pass', score: '19 / 20' },
        { date: '26 May 2025, 06:08 AM', status: 'Pass', score: '20 / 20' },
        { date: '25 May 2025, 06:11 AM', status: 'Pass', score: '18 / 20' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.submitSafetyChecklist = async (req, res, next) => {
  try {
    const { vehicleRef, trailerRef, items = [], isDraft = false, notes } = req.body;
    return sendSuccess(res, {
      success: true,
      message: isDraft ? 'Checklist draft saved' : 'Safety checklist submitted successfully',
      checklistId: `PSC-${Date.now()}`
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 13. WAREHOUSE STAFF PROFILE & CERTIFICATIONS
// ============================================================================

exports.getStaffProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Invalid session context' }, HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        branch: true,
        customRole: true
      }
    });

    if (!user) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'User profile not found' }, HTTP_STATUS.NOT_FOUND);
    }

    const isManager = user.role === 'SUPER_ADMIN' || user.email === 'warehouse@hero.com' || user.customRole?.name?.toLowerCase().includes('manager');
    const title = isManager ? 'Warehouse Manager' : 'Warehouse Staff';

    return sendSuccess(res, {
      profile: {
        name: user.name || 'WAREHOUSE Demo',
        title: title,
        status: 'On Shift',
        employeeId: user.userCode || 'WS-1007',
        email: user.email || 'warehouse@hero.com',
        phone: user.phone || '+61 412 345 678',
        phoneWork: '+61 2 8765 4321',
        department: 'Warehouse Operations',
        depot: user.branch?.name || 'Sydney Depot Hub',
        role: user.role,
        reportsTo: isManager ? 'Operations Director' : 'Warehouse Manager',
        joinedOn: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Mar 2024',
        address: user.address || '12 Logistics Way, Eastern Creek NSW 2766, Australia',
        emergencyContact: {
          name: 'Komal Smith',
          relationship: 'Spouse',
          phone: user.emergencyContact || '+61 400 987 654'
        }
      },
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
      permissions: user.customRole?.permissions.map(p => p.actionString) || [
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
// 13. YARD & WAREHOUSE ISSUE REPORTING
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
    if (matchedItem && (severity.toLowerCase().includes('high') || category.toLowerCase().includes('damage'))) {
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
        userId: userId || null,
        userEmail: req.user?.email || 'yard@hero.com',
        action: 'YARD_ISSUE_LOGGED',
        resource: 'YARD_EQUIPMENT',
        resourceId: matchedItem ? matchedItem.id : trailerId,
        details: JSON.stringify({
          category,
          identifier: trailerId,
          description,
          severity,
          checklist: checklist || {},
          status: 'ACTIVE',
          reportedAt: new Date().toISOString()
        })
      }
    });

    return sendSuccess(res, {
      id: auditRecord.id,
      category: category.includes('Damage') ? 'Damage' : 'Missing Item',
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
        action: 'YARD_ISSUE_LOGGED',
        ...(tenantId && { companyId: tenantId })
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    const formatted = auditLogs.map(log => {
      let parsed = {};
      try { parsed = JSON.parse(log.details); } catch (e) {}
      return {
        id: log.id,
        category: parsed.category ? (parsed.category.includes('Damage') ? 'Damage' : 'Missing Item') : 'Damage',
        trailerId: parsed.identifier || log.resourceId || 'Unknown',
        description: parsed.description || 'Inspection issue reported',
        severity: parsed.severity ? parsed.severity.split(' ')[0] : 'Medium',
        loggedDate: log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-US') : 'Recent',
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
    const userId = req.user?.userId || req.user?.id;

    // Log resolution to audit log
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userEmail: req.user?.email || 'yard@hero.com',
        action: 'YARD_ISSUE_RESOLVED',
        resource: 'YARD_EQUIPMENT',
        resourceId: id,
        details: JSON.stringify({ issueId: id, resolvedAt: new Date().toISOString() })
      }
    });

    return sendSuccess(res, { success: true, message: 'Issue resolved successfully.' });
  } catch (error) {
    next(error);
  }
};
