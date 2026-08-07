const prisma = require('../utils/prismaClient');
const { sendSuccess } = require('../utils/apiResponse');

exports.getSummary = async (req, res, next) => {
  try {
    // 1. Fetch all leads
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    // 2. Fetch recent activities
    const activities = await prisma.salesActivity.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        performedBy: { select: { name: true } }
      }
    });

    // 3. Fetch upcoming follow-up tasks
    const tasks = await prisma.followUpTask.findMany({
      where: { status: 'PENDING' },
      take: 10,
      orderBy: { dueDate: 'asc' },
      include: {
        lead: { select: { companyName: true, contactName: true } }
      }
    });

    // 4. Calculate KPIs
    const newLeads = leads.filter(l => l.stage === 'NEW_LEAD').length;
    const demosBooked = await prisma.demoBooking.count({ where: { status: 'UPCOMING' } });
    const trialsActive = leads.filter(l => l.stage === 'TRIAL_STARTED').length;
    const proposalsSent = await prisma.proposal.count({ where: { status: 'SENT' } });
    const dealsWon = leads.filter(l => l.stage === 'WON').length;
    const dealsLost = leads.filter(l => l.stage === 'LOST').length;

    // Sum estimatedValue
    const pipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

    // 5. Stage Distribution Matrix
    const stages = [
      { name: 'NEW LEAD', count: leads.filter(l => l.stage === 'NEW_LEAD').length },
      { name: 'CONTACTED', count: leads.filter(l => l.stage === 'CONTACTED').length },
      { name: 'DEMO BOOKED', count: leads.filter(l => l.stage === 'DEMO_BOOKED').length },
      { name: 'DEMO COMPLETED', count: leads.filter(l => l.stage === 'DEMO_COMPLETED').length },
      { name: 'TRIAL STARTED', count: leads.filter(l => l.stage === 'TRIAL_STARTED').length },
      { name: 'PROPOSAL SENT', count: leads.filter(l => l.stage === 'PROPOSAL_SENT').length },
      { name: 'NEGOTIATING', count: leads.filter(l => l.stage === 'NEGOTIATING').length },
      { name: 'WON', count: leads.filter(l => l.stage === 'WON').length },
      { name: 'LOST', count: leads.filter(l => l.stage === 'LOST').length }
    ];

    // 6. Analytics chart data (mocked/aggregated)
    const monthlyData = [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 30000 },
      { name: 'Mar', value: 30000 },
      { name: 'Apr', value: 45000 },
      { name: 'May', value: 65000 },
      { name: 'Jun', value: pipelineValue }
    ];

    const conversionData = [
      { name: 'Leads', value: leads.length, color: '#6366F1' },
      { name: 'Demos', value: await prisma.demoBooking.count(), color: '#3B82F6' },
      { name: 'Trials', value: trialsActive, color: '#10B981' },
      { name: 'Proposals', value: await prisma.proposal.count(), color: '#F59E0B' },
      { name: 'Won', value: dealsWon, color: '#EF4444' }
    ];

    return sendSuccess(res, {
      kpis: {
        newLeads,
        demosBooked,
        trialsActive,
        proposalsSent,
        dealsWon,
        dealsLost,
        pipelineValue
      },
      stages,
      monthlyData,
      conversionData,
      recentActivities: activities.map(act => ({
        id: act.id,
        title: act.title,
        date: act.timestamp.toISOString(),
        desc: act.description,
        user: act.performedBy?.name || 'SYSTEM'
      })),
      tasks: tasks.map(t => ({
        id: t.id,
        company: t.lead?.companyName || 'Unknown',
        due: t.dueDate.toISOString(),
        task: t.description,
        status: t.dueDate < new Date() ? 'OVERDUE' : 'UPCOMING',
        completed: t.status === 'COMPLETED'
      })),
      leadsList: leads
    });

  } catch (error) {
    next(error);
  }
};
