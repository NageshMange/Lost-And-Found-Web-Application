const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult, query } = require('express-validator');
const LostItem = require('../models/LostItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to normalize image path to a web-friendly relative path
const toWebRelativePath = (rawPath) => {
  if (!rawPath) return rawPath;
  const str = String(rawPath);
  const lower = str.toLowerCase();
  const idx = lower.lastIndexOf('uploads');
  const sliced = idx !== -1 ? str.slice(idx) : str;
  return sliced.replace(/\\\\/g, '/');
};

// Configure multer for file uploads (absolute folder, relative path stored)
const uploadRoot = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadRoot)) {
      fs.mkdirSync(uploadRoot, { recursive: true });
    }
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all items (public - for students)
router.get('/', [
  query('status').optional().isIn(['active', 'collected', 'archived']),
  query('category').optional().isIn(['electronics', 'clothing', 'accessories', 'books', 'bags', 'other']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status = 'active', category, dateFrom, dateTo, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { foundLocation: { $regex: search, $options: 'i' } },
        { collectionLocation: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let items = await LostItem.find(filter)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Normalize image paths for clients
    items = items.map(doc => {
      const obj = doc.toObject();
      obj.imagePath = toWebRelativePath(obj.imagePath);
      return obj;
    });

    const total = await LostItem.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    let item = await LostItem.findById(req.params.id)
      .populate('uploadedBy', 'username');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item) {
      const obj = item.toObject();
      obj.imagePath = toWebRelativePath(obj.imagePath);
      return res.json(obj);
    }
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new item (teacher only)
router.post('/', auth, upload.single('image'), [
  body('description').notEmpty().withMessage('Description is required'),
  body('foundLocation').notEmpty().withMessage('Found location is required'),
  body('collectionLocation').notEmpty().withMessage('Collection location is required'),
  body('category').optional().isIn(['electronics', 'clothing', 'accessories', 'books', 'bags', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { description, foundLocation, collectionLocation, category = 'other', tags } = req.body;

    // Always store normalized relative path like 'uploads/filename.ext'
    const relativeImagePath = path.posix.join('uploads', req.file.filename);

    const item = new LostItem({
      description,
      foundLocation,
      collectionLocation,
      imagePath: relativeImagePath,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: req.user._id
    });

    await item.save();
    await item.populate('uploadedBy', 'username');

    res.status(201).json({
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark item as collected (teacher only)
router.patch('/:id/collect', auth, [
  body('collectedBy').notEmpty().withMessage('Collector name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { collectedBy } = req.body;
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'active') {
      return res.status(400).json({ message: 'Item is not available for collection' });
    }

    item.status = 'collected';
    item.collectedBy = collectedBy;
    item.collectedAt = new Date();

    await item.save();
    await item.populate('uploadedBy', 'username');

    res.json({
      message: 'Item marked as collected',
      item
    });
  } catch (error) {
    console.error('Collect item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item (teacher only)
router.put('/:id', auth, upload.single('image'), [
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('foundLocation').optional().notEmpty().withMessage('Found location cannot be empty'),
  body('collectionLocation').optional().notEmpty().withMessage('Collection location cannot be empty'),
  body('category').optional().isIn(['electronics', 'clothing', 'accessories', 'books', 'bags', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields
    if (req.body.description) item.description = req.body.description;
    if (req.body.foundLocation) item.foundLocation = req.body.foundLocation;
    if (req.body.collectionLocation) item.collectionLocation = req.body.collectionLocation;
    if (req.body.category) item.category = req.body.category;
    if (req.body.tags) item.tags = req.body.tags.split(',').map(tag => tag.trim());

    // Update image if provided
    if (req.file) {
      // Delete old image (resolve absolute path)
      if (item.imagePath) {
        const oldAbs = path.join(__dirname, '..', item.imagePath);
        if (fs.existsSync(oldAbs)) {
          fs.unlinkSync(oldAbs);
        }
      }
      const relativeImagePath = path.posix.join('uploads', req.file.filename);
      item.imagePath = relativeImagePath;
    }

    await item.save();
    await item.populate('uploadedBy', 'username');

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete image file (resolve absolute path)
    if (item.imagePath) {
      const absPath = path.join(__dirname, '..', item.imagePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive old items (cron job endpoint)
router.post('/archive-old', auth, async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await LostItem.updateMany(
      { 
        status: 'active', 
        createdAt: { $lt: oneMonthAgo } 
      },
      { status: 'archived' }
    );

    res.json({
      message: 'Old items archived successfully',
      archivedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Archive old items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


