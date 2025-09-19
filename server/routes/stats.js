const express = require('express');
const LostItem = require('../models/LostItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Get statistics dashboard
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total counts
    const totalItems = await LostItem.countDocuments();
    const activeItems = await LostItem.countDocuments({ status: 'active' });
    const collectedItems = await LostItem.countDocuments({ status: 'collected' });
    const archivedItems = await LostItem.countDocuments({ status: 'archived' });

    // This month's stats
    const thisMonthItems = await LostItem.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Monthly data for charts (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthItems = await LostItem.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthCollected = await LostItem.countDocuments({
        status: 'collected',
        collectedAt: { $gte: monthStart, $lte: monthEnd }
      });

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: monthItems,
        collected: monthCollected,
        active: monthItems - monthCollected
      });
    }

    // Category distribution
    const categoryStats = await LostItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await LostItem.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('uploadedBy', 'username')
    .sort({ createdAt: -1 })
    .limit(10);

    // Collection rate (percentage of items collected)
    const collectionRate = totalItems > 0 ? ((collectedItems / totalItems) * 100).toFixed(1) : 0;

    res.json({
      overview: {
        totalItems,
        activeItems,
        collectedItems,
        archivedItems,
        thisMonthItems,
        collectionRate: parseFloat(collectionRate)
      },
      monthlyData,
      categoryStats,
      recentActivity
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get items by date range
router.get('/date-range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    const items = await LostItem.find({
      createdAt: { $gte: start, $lte: end }
    })
    .populate('uploadedBy', 'username')
    .sort({ createdAt: -1 });

    const stats = {
      total: items.length,
      active: items.filter(item => item.status === 'active').length,
      collected: items.filter(item => item.status === 'collected').length,
      archived: items.filter(item => item.status === 'archived').length
    };

    res.json({
      items,
      stats,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error('Get date range stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;








