const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardMetrics = async (req, res) => {
  try {
    // 1. KPIs — using correct field names from schema
    const totalCompanies = await prisma.company.count();
    const activeCompanies = await prisma.company.count({ where: { status: 'ACTIVE' } });
    const trialCompanies = await prisma.company.count({ where: { status: 'TRIAL' } });
    const paidCompanies = activeCompanies;

    // Monthly Revenue (MRR) — plan uses monthlyPrice not price
    const subscriptions = await prisma.tenantSubscription.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true }
    });
    const monthlyRevenue = subscriptions.reduce(
      (sum, sub) => sum + (sub.plan?.monthlyPrice || 0),
      0
    );

    // PaymentAttempt status enum: PAID | PENDING | FAILED ✅
    const failedPayments = await prisma.paymentAttempt.count({
      where: { status: 'FAILED' }
    });

    const openTickets = await prisma.supportTicket.count({
      where: { status: 'OPEN' }
    });

    // User.status is UserStatus enum: ACTIVE | SUSPENDED | PENDING
    const activeUsers = await prisma.user.count({
      where: { status: 'ACTIVE' }
    });

    // 2. Chart Data (MRR Revenue Timeline)
    const chartData = [
      { name: 'Jan', mrr: 21000 },
      { name: 'Feb', mrr: 28000 },
      { name: 'Mar', mrr: 28000 },
      { name: 'Apr', mrr: 30000 },
      { name: 'May', mrr: 30000 },
      { name: 'Jun', mrr: monthlyRevenue > 0 ? monthlyRevenue : 42910 },
    ];

    // 3. Tenant Overview — Company has tenantSubscription (singular, unique relation)
    const recentTenantsRaw = await prisma.company.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { users: true } },
        tenantSubscription: {
          include: { plan: true }
        }
      }
    });

    const recentTenants = recentTenantsRaw.map(company => {
      const activeSub = company.tenantSubscription;
      return {
        id: company.id,
        name: company.name,
        plan: activeSub?.plan?.name || 'No Plan',
        status: company.status,
        users: company._count.users,
        // monthlyPrice is the correct field on SubscriptionPlan
        mrr: activeSub?.plan?.monthlyPrice
          ? `$${activeSub.plan.monthlyPrice}`
          : activeSub?.amount
            ? `$${activeSub.amount}`
            : '$0',
        trialExpiry: activeSub?.nextRenewal
          ? activeSub.nextRenewal.toISOString().split('T')[0]
          : 'N/A',
        lastActive: 'Today'
      };
    });

    // 4. Platform Health Center (static operational data)
    const healthCenter = {
      systemStatus: {
        apiHealth: '99.98%',
        databaseHealth: 'Synced',
        storageHealth: '52.3% Free',
        queueHealth: '0 pending',
        aiProcessingHealth: 'Active'
      },
      usageMetrics: {
        activeSessions: '42 active',
        requestsPerMinute: '1,250 RPM',
        storageConsumption: '4.78 TB / 10 TB',
        aiJobsProcessed: '14,050 runs'
      }
    };

    // 5. Ticket Widget Stats
    const tickets = {
      open: await prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      highPriority: await prisma.supportTicket.count({ where: { priority: 'HIGH' } }),
      waitingCustomer: await prisma.supportTicket.count({ where: { status: 'WAITING_CUSTOMER' } }),
      waitingInternal: await prisma.supportTicket.count({ where: { status: 'WAITING_INTERNAL' } })
    };

    // 6. Subscription Monitoring
    const subMonitoring = {
      activePlans: subscriptions.length,
      expiringThisMonth: 1,
      overduePayments: failedPayments,
      upgradeOpportunities: 2
    };

    // 7. Recent Platform Activity
    // AuditLog has: id, action, operator (String), ipAddress, companyId, createdAt
    // NO user relation — use operator field directly
    const recentActivityRaw = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
      // NO include: { user: true } — AuditLog has no user relation
    });

    const recentActivity = recentActivityRaw.map(log => ({
      id: log.id,
      title: log.action || 'System Action',
      details: log.operator ? `By ${log.operator}` : 'System',
      timestamp: log.createdAt.toLocaleString()
    }));

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          activeCompanies,
          trialCompanies,
          paidCompanies,
          monthlyRevenue,
          failedPayments,
          openTickets,
          activeUsers,
          platformUsage: '14.2%'
        },
        chartData,
        recentTenants,
        healthCenter,
        tickets,
        subMonitoring,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error in getDashboardMetrics:', error.message);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard metrics.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
