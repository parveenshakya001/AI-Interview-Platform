const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VALID_CATEGORIES = ['dsa', 'python', 'java', 'ai-ml', 'web-development', 'system-design'];

const getDashboardStats = async (req, res) => {
  try {
    // req.userId may arrive as a string or number depending on how the JWT
    // payload was signed — Number() safely handles both cases.
    const userId = Number(req.userId);
    const { category } = req.query;

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user.' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required.' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const results = await prisma.interviewResult.findMany({
      where: { userId, category },
      orderBy: { createdAt: 'asc' },
    });

    const interviews = results.filter((r) => r.type === 'interview');
    const codingTests = results.filter((r) => r.type === 'coding-test');

    const avgScore =
      results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score ?? 0), 0) / results.length)
        : 0;

    // Build last-7-entries chart data (or fewer if user has less history)
    const chart = results.slice(-7).map((r) => ({
      day: r.createdAt.toLocaleDateString('en-US', { weekday: 'short' }),
      score: r.score ?? 0,
    }));

    // Calculate streak: consecutive days (from today backwards) with at least one result
    const uniqueDays = [
      ...new Set(results.map((r) => r.createdAt.toISOString().split('T')[0])),
    ].sort();

    let streak = 0;
    let checkDate = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (uniqueDays.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const recentActivity = results
      .slice(-5)
      .reverse()
      .map((r) => ({
        title: `${category.toUpperCase()} ${r.type === 'interview' ? 'Mock Interview' : 'Coding Test'}`,
        detail: `Score: ${r.score ?? 0}%`,
        createdAt: r.createdAt,
      }));

    return res.status(200).json({
      stats: {
        interviews: interviews.length,
        avgScore: `${avgScore}%`,
        tests: codingTests.length,
        streak: streak > 0 ? `${streak} Day${streak > 1 ? 's' : ''} 🔥` : '0 Days',
      },
      chart,
      activity: recentActivity,
    });
  } catch (error) {
    // Keep this log — it's your source of truth when something goes wrong.
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error fetching stats.' });
  }
};

// Called after a user completes an interview or coding test
const saveResult = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { category, type, score } = req.body;

    if (!userId || Number.isNaN(userId)) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user.' });
    }

    if (!category || !type || score === undefined || score === null) {
      return res.status(400).json({ message: 'category, type, and score are required.' });
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return res.status(400).json({ message: 'score must be a number between 0 and 100.' });
    }

    const result = await prisma.interviewResult.create({
      data: { userId, category, type, score: numericScore },
    });

    return res.status(201).json({ message: 'Result saved.', result });
  } catch (error) {
    console.error('Save result error:', error);
    return res.status(500).json({ message: 'Server error saving result.' });
  }
};

module.exports = { getDashboardStats, saveResult };