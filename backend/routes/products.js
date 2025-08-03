const express = require('express');
const { prisma } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }
    const product = await prisma.product.findUnique({
      where: { id: parsedId },
      include: { category: true }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const {
      name,
      articleNumber,
      description,
      categoryId,
      purchasePrice,
      sellingPrice,
      btwPercentage,
      image,
      stock,
      minStock
    } = req.body;

    // Validate required fields
    if (!name || !articleNumber || !categoryId || !purchasePrice || !sellingPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : null,
          articleNumber: !articleNumber ? 'Article number is required' : null,
          categoryId: !categoryId ? 'Category is required' : null,
          purchasePrice: !purchasePrice ? 'Purchase price is required' : null,
          sellingPrice: !sellingPrice ? 'Selling price is required' : null,
        }
      });
    }

    // Check if article number is unique
    const existingProduct = await prisma.product.findUnique({
      where: { articleNumber }
    });

    if (existingProduct) {
      return res.status(400).json({
        error: 'Article number already exists',
        details: { articleNumber: 'This article number is already in use' }
      });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(400).json({
        error: 'Invalid category',
        details: { categoryId: 'Selected category does not exist' }
      });
    }

    // Calculate price including VAT
    const priceInclBtw = sellingPrice * (1 + btwPercentage / 100);
    const isLowStock = stock <= minStock;

    const product = await prisma.product.create({
      data: {
        name,
        articleNumber,
        description,
        categoryId: parseInt(categoryId),
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        btwPercentage: parseInt(btwPercentage),
        priceInclBtw,
        image,
        stock: parseInt(stock || 0),
        minStock: parseInt(minStock || 5),
        isLowStock
      },
      include: {
        category: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Duplicate value',
        details: {
          [error.meta.target[0]]: `This ${error.meta.target[0]} is already in use`
        }
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid reference',
        details: {
          [error.meta.field_name]: `The referenced ${error.meta.field_name} does not exist`
        }
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Er ging iets mis bij het toevoegen van het product'
    });
  }
});

// Update product
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      articleNumber,
      description,
      categoryId,
      purchasePrice,
      sellingPrice,
      btwPercentage,
      image,
      stock,
      minStock
    } = req.body;

    // Calculate price including VAT
    const priceInclBtw = sellingPrice * (1 + btwPercentage / 100);
    const isLowStock = stock <= minStock;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        articleNumber,
        description,
        categoryId: parseInt(categoryId),
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        btwPercentage: parseInt(btwPercentage),
        priceInclBtw,
        image,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        isLowStock
      },
      include: {
        category: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get low stock products
router.get('/low-stock', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isLowStock: true
      },
      include: {
        category: true
      },
      orderBy: {
        stock: 'asc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update stock
router.put('/:id/stock', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isLowStock = stock <= product.minStock;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        stock: parseInt(stock),
        isLowStock
      },
      include: {
        category: true
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    // Extra logging voor debuggen
    console.log('GET /categories aangeroepen');
    if (!req.user) {
      console.log('Geen user gevonden in req.user');
      return res.status(403).json({ error: 'Geen geldige gebruiker (token ongeldig of verlopen)' });
    }
    console.log('Ingelogde gebruiker:', req.user);
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk upload products (CSV)
router.post('/bulk-upload', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid products data' });
    }

    const createdProducts = [];

    for (const productData of products) {
      const {
        name,
        articleNumber,
        description,
        categoryId,
        purchasePrice,
        sellingPrice,
        btwPercentage,
        image,
        stock,
        minStock
      } = productData;

      // Calculate price including VAT
      const priceInclBtw = sellingPrice * (1 + btwPercentage / 100);
      const isLowStock = stock <= minStock;

      const product = await prisma.product.create({
        data: {
          name,
          articleNumber,
          description,
          categoryId: parseInt(categoryId),
          purchasePrice: parseFloat(purchasePrice),
          sellingPrice: parseFloat(sellingPrice),
          btwPercentage: parseInt(btwPercentage),
          priceInclBtw,
          image,
          stock: parseInt(stock),
          minStock: parseInt(minStock),
          isLowStock
        },
        include: {
          category: true
        }
      });

      createdProducts.push(product);
    }

    res.status(201).json({
      message: `${createdProducts.length} products created successfully`,
      products: createdProducts
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 