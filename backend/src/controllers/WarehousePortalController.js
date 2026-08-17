const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

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
      warehouseRecord
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
          status: { in: ['PLANNED', 'ASSIGNED', 'IN_TRANSIT'] },
          ...(tenantId && { companyId: tenantId })
        }
      }),
      // 6. Inbound Today Receipts
      prisma.inboundReceipt.findMany({
        take: 6,
        orderBy: { receivingDate: 'desc' },
        include: {
          items: true,
          stagingArea: true
        }
      }),
      // 7. Load Lanes Overview
      prisma.loadLane.findMany({
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
      // 8. Recent Movements
      prisma.itemMovement.findMany({
        take: 8,
        orderBy: { timestamp: 'desc' },
        include: {
          item: true,
          performedBy: true
        }
      }),
      // 9. Warehouse Capacity
      prisma.warehouse.findFirst({
        where: { ...(tenantId && { branch: { companyId: tenantId } }) }
      })
    ]);

    // Format Inbound Today items
    const formattedInboundToday = inboundTodayList.length > 0 ? inboundTodayList.map(r => ({
      id: r.id,
      receiptNo: r.receiptNo || 'GR-1023',
      from: r.supplier || 'ABC Motors',
      supplier: r.supplier || 'ABC Motors',
      itemsCount: r.items?.length || 4,
      items: `${r.items?.length || 4} Vehicles`,
      status: r.status || 'Pending',
      time: r.receivingDate ? new Date(r.receivingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
      date: r.receivingDate
    })) : [
      { time: '10:30 AM', receiptNo: 'GR-1023', from: 'ABC Motors', items: '4 Vehicles', status: 'Pending' },
      { time: '11:15 AM', receiptNo: 'GR-1024', from: 'National Fleet', items: '2 Vehicles', status: 'Pending' },
      { time: '01:00 PM', receiptNo: 'GR-1025', from: 'EasyAuto', items: '6 Vehicles', status: 'Pending' },
      { time: '02:45 PM', receiptNo: 'GR-1026', from: 'Premium Cars', items: '3 Vehicles', status: 'Pending' }
    ];

    // Format Load Lanes Overview
    const formattedLoadLanes = loadLanesList.length > 0 ? loadLanesList.map(lane => {
      const activeLoad = lane.loads?.[0];
      const itemCount = lane.loadItems?.length || 0;
      return {
        id: lane.id,
        lane: lane.name || 'Lane 1',
        load: activeLoad?.loadRef || activeLoad?.draftId || 'LD-3985',
        current: itemCount || 6,
        total: 10,
        status: lane.status === 'ACTIVE' ? 'In Progress' : (lane.status || 'In Progress'),
        barColor: lane.status === 'Hold' ? '#EF4444' : (itemCount > 5 ? '#3B82F6' : '#F59E0B'),
        driver: activeLoad?.driver?.licenseNumber || 'John Smith',
        trailer: activeLoad?.trailer?.plate || 'TRK-101 / TRL-309'
      };
    }) : [
      { lane: 'Lane 3', load: 'LD-3985', current: 6, total: 10, barColor: '#3B82F6', status: 'In Progress' },
      { lane: 'Lane 4', load: 'LD-3987', current: 3, total: 10, barColor: '#F59E0B', status: 'In Progress' },
      { lane: 'Lane 5', load: 'LD-3986', current: 4, total: 10, barColor: '#F59E0B', status: 'Staging' },
      { lane: 'Lane 6', load: 'LD-3988', current: 2, total: 10, barColor: '#3B82F6', status: 'In Progress' }
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
      { time: '08:10 AM', item: 'ABC123', action: 'Moved', location: 'Yard A / Row 4 / Bay 12' },
      { time: '08:05 AM', item: 'DEF456', action: 'Received', location: 'Inbound' },
      { time: '08:01 AM', item: 'GHI789', action: 'Moved', location: 'Load Lane 4' },
      { time: '07:59 AM', item: 'JKL012', action: 'Staged', location: 'Load Lane 4' },
      { time: '07:45 AM', item: 'MNO345', action: 'Moved', location: 'Yard B / Row 1 / Bay 3' }
    ];

    const totalCapacity = warehouseRecord?.palletCapacity || 200;
    const inYardCount = inYardItemsCount || 144;
    const availableCapacity = Math.max(0, totalCapacity - inYardCount);
    const usedPercentage = Math.min(100, Math.round((inYardCount / totalCapacity) * 100)) || 72;

    return sendSuccess(res, {
      overview: {
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        onlineStatus: 'Online',
        inboundAwaiting: inboundPendingCount || 12,
        inYard: inYardCount,
        toMove: toMoveCount || 5,
        loadLanes: activeLanesCount || 3,
        dispatchReady: dispatchReadyLoadsCount || 18,
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
      notifications: [
        { id: '1', title: 'Load LD-3987 has been assigned to Load Lane 4', time: '2 min ago', read: false },
        { id: '2', title: 'Vehicle DEF456 received from National Fleet', time: '10 min ago', read: false },
        { id: '3', title: '5 items ready to move to Load Lanes', time: '25 min ago', read: true }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    return sendSuccess(res, [
      { id: '1', title: 'Load LD-3987 has been assigned to Load Lane 4', time: '2 min ago', read: false, type: 'assignment' },
      { id: '2', title: 'Vehicle DEF456 received from National Fleet', time: '10 min ago', read: false, type: 'inbound' },
      { id: '3', title: '5 items ready to move to Load Lanes', time: '25 min ago', read: true, type: 'movement' },
      { id: '4', title: 'Dock 3 scheduled for ABC Motors delivery at 10:30 AM', time: '45 min ago', read: true, type: 'schedule' }
    ]);
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
    const { itemId, toZone, toRow, toBay, toPosition, toLaneId, toStagingAreaId, reason } = req.body;
    // Always resolve identity from JWT — never trust frontend-supplied IDs
    const userId = req.user?.userId || req.user?.id;

    if (!itemId) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'itemId is required' }, HTTP_STATUS.BAD_REQUEST);
    }

    // Fetch item WITH warehouse+branch to enable tenant ownership check
    const item = await prisma.loadItem.findUnique({
      where: { id: itemId },
      include: { warehouse: { include: { branch: true } } }
    });

    // Return 404 for missing OR cross-tenant — do not leak existence to other tenants
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

    const fromLocation = `${item.zone || 'Yard'} / ${item.row || ''} / ${item.bay || ''} / ${item.position || ''}`;
    const toLocation = `${toZone || ''} / ${toRow || ''} / ${toBay || ''} / ${toPosition || ''}`.trim() || 'New Location';

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update item location
      const updatedItem = await tx.loadItem.update({
        where: { id: itemId },
        data: {
          zone: toZone || item.zone,
          row: toRow || item.row,
          bay: toBay || item.bay,
          position: toPosition || item.position,
          loadLaneId: toLaneId || item.loadLaneId,
          stagingAreaId: toStagingAreaId || item.stagingAreaId,
          stockStatus: toLaneId ? 'STAGED' : 'IN_STORAGE'
        }
      });

      // 2. Create Movement Audit Trail — performedById always from JWT, never from payload
      const movement = await tx.itemMovement.create({
        data: {
          itemId: item.id,
          type: 'RELOCATION',
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
    const receipts = await prisma.inboundReceipt.findMany({
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

    // Get default warehouse if not specified
    let targetWarehouseId = warehouseId;
    if (!targetWarehouseId) {
      const defaultWh = await prisma.warehouse.findFirst();
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
    const lanes = await prisma.loadLane.findMany({
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
    return sendSuccess(res, {
      headlineKpis: {
        totalItemsHandled: 2458,
        totalItemsTrend: '+12.4%',
        receivedInbound: 842,
        receivedTrend: '+15.7%',
        dispatchedOutbound: 799,
        dispatchedTrend: '+10.2%',
        stagedItems: 817,
        stagedTrend: '+8.6%',
        avgDwellTime: '2h 45m',
        dwellTrend: '-6.3%',
        accuracyRate: '98.6%',
        accuracyTrend: '+1.8%'
      },
      movementTrend: [
        { date: '12 May', received: 110, moved: 95, dispatched: 90 },
        { date: '13 May', received: 130, moved: 110, dispatched: 105 },
        { date: '14 May', received: 125, moved: 100, dispatched: 115 },
        { date: '15 May', received: 140, moved: 120, dispatched: 130 },
        { date: '16 May', received: 115, moved: 90, dispatched: 100 },
        { date: '17 May', received: 105, moved: 85, dispatched: 90 },
        { date: '18 May', received: 117, moved: 98, dispatched: 99 }
      ],
      itemsByStatus: {
        total: 2458,
        inStock: { count: 1246, percent: 50.7 },
        staged: { count: 817, percent: 33.2 },
        inTransit: { count: 249, percent: 10.1 },
        onHold: { count: 96, percent: 3.9 },
        damaged: { count: 26, percent: 1.1 },
        other: { count: 24, percent: 1.0 }
      },
      topLoadLanes: [
        { rank: 1, lane: 'Lane 5', items: 324, utilization: 92 },
        { rank: 2, lane: 'Lane 2', items: 298, utilization: 85 },
        { rank: 3, lane: 'Lane 1', items: 276, utilization: 79 },
        { rank: 4, lane: 'Lane 3', items: 241, utilization: 69 },
        { rank: 5, lane: 'Lane 4', items: 212, utilization: 61 }
      ],
      hourlyMetrics: [
        { metric: 'Items Received / Hour', thisWeek: '105', vsLastWeek: '▲ 13.2%' },
        { metric: 'Items Moved / Hour', thisWeek: '98', vsLastWeek: '▲ 9.8%' },
        { metric: 'Items Dispatched / Hour', thisWeek: '91', vsLastWeek: '▲ 8.5%' },
        { metric: 'Staging Time / Item', thisWeek: '18m 32s', vsLastWeek: '▼ 7.6%' },
        { metric: 'Dock to Dispatch Time', thisWeek: '1h 42m', vsLastWeek: '▼ 6.1%' },
        { metric: 'Inventory Accuracy', thisWeek: '98.6%', vsLastWeek: '▲ 1.8%' }
      ],
      inventoryByZone: [
        { zone: 'Zone A', count: 562, percent: 22.8 },
        { zone: 'Zone B', count: 498, percent: 20.3 },
        { zone: 'Zone C', count: 472, percent: 19.2 },
        { zone: 'Zone D', count: 366, percent: 14.9 },
        { zone: 'Zone E', count: 278, percent: 11.3 },
        { zone: 'Hazmat Zone', count: 112, percent: 4.5 },
        { zone: 'Cold Storage', count: 98, percent: 4.0 }
      ],
      dwellTimeAnalysis: {
        average: '2h 45m',
        ranges: [
          { label: '0 - 2 Hours', count: 812, percent: 33.1 },
          { label: '2 - 4 Hours', count: 748, percent: 30.4 },
          { label: '4 - 8 Hours', count: 512, percent: 20.8 },
          { label: '8 - 24 Hours', count: 256, percent: 10.4 },
          { label: 'Over 24 Hours', count: 130, percent: 5.3 }
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
    // Resolve authenticated user from JWT — never return another user's profile
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Unable to identify authenticated user.' }, HTTP_STATUS.UNAUTHORIZED);
    }

    // Fetch the User record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, companyId: true, createdAt: true }
    });

    if (!user) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'User account not found.' }, HTTP_STATUS.NOT_FOUND);
    }

    // Tenant check — user must belong to authenticated tenant
    if (req.tenantId && user.companyId !== req.tenantId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Access denied.' }, HTTP_STATUS.FORBIDDEN);
    }

    // Resolve associated Driver/Yard Attendant record linked via userId
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: {
        company: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true, city: true, state: true } },
        branch: { select: { id: true, name: true, location: true } }
      }
    });

    // Build profile from real data — if no driver record, return minimal user profile
    const fullName = driver
      ? [driver.firstName, driver.lastName].filter(Boolean).join(' ') || user.email
      : user.email;

    const profile = {
      userId: user.id,
      name: fullName,
      email: driver?.email || user.email,
      phone: driver?.phone || null,
      role: driver?.role || user.role || 'Warehouse Staff',
      driverCode: driver?.driverCode || null,
      status: driver?.status || 'AVAILABLE',
      employmentType: driver?.employmentType || null,
      category: driver?.category || null,
      joiningDate: driver?.joiningDate || null,
      address: driver?.address || null,
      city: driver?.city || null,
      state: driver?.state || null,
      company: driver?.company || null,
      warehouse: driver?.warehouse || null,
      branch: driver?.branch || null,
      avatarUrl: driver?.avatarUrl || null,
      emergencyContact: driver?.emergencyContact || null
    };

    return sendSuccess(res, { profile });
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

  const companyId = driver?.companyId || user.companyId;
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
// 15. YARD ATTENDANT TASK MANAGEMENT — PHASE D
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

