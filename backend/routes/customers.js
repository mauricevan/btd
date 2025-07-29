const express = require('express');
const { prisma } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        customerProducts: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single customer
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        customerProducts: {
          include: {
            product: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new customer
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      notes,
      productIds
    } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        notes
      },
      include: {
        customerProducts: {
          include: {
            product: true
          }
        }
      }
    });

    // Add products if provided
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const customerProducts = productIds.map(productId => ({
        customerId: customer.id,
        productId: parseInt(productId)
      }));

      await prisma.customerProduct.createMany({
        data: customerProducts
      });

      // Fetch customer with products
      const customerWithProducts = await prisma.customer.findUnique({
        where: { id: customer.id },
        include: {
          customerProducts: {
            include: {
              product: true
            }
          }
        }
      });

      return res.status(201).json(customerWithProducts);
    }

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      notes,
      productIds
    } = req.body;

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        notes
      },
      include: {
        customerProducts: {
          include: {
            product: true
          }
        }
      }
    });

    // Update products if provided
    if (productIds && Array.isArray(productIds)) {
      // Remove existing products
      await prisma.customerProduct.deleteMany({
        where: { customerId: parseInt(id) }
      });

      // Add new products
      if (productIds.length > 0) {
        const customerProducts = productIds.map(productId => ({
          customerId: parseInt(id),
          productId: parseInt(productId)
        }));

        await prisma.customerProduct.createMany({
          data: customerProducts
        });
      }

      // Fetch updated customer with products
      const updatedCustomer = await prisma.customer.findUnique({
        where: { id: parseInt(id) },
        include: {
          customerProducts: {
            include: {
              product: true
            }
          }
        }
      });

      return res.json(updatedCustomer);
    }

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Delete customer products first
    await prisma.customerProduct.deleteMany({
      where: { customerId: parseInt(id) }
    });

    // Delete customer
    await prisma.customer.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add product to customer
router.post('/:id/products', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const customerProduct = await prisma.customerProduct.create({
      data: {
        customerId: parseInt(id),
        productId: parseInt(productId)
      },
      include: {
        product: true
      }
    });

    res.status(201).json(customerProduct);
  } catch (error) {
    console.error('Add product to customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove product from customer
router.delete('/:id/products/:productId', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id, productId } = req.params;

    await prisma.customerProduct.delete({
      where: {
        customerId_productId: {
          customerId: parseInt(id),
          productId: parseInt(productId)
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove product from customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search customers
router.get('/search/:query', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { query } = req.params;

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        customerProducts: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(customers);
  } catch (error) {
    console.error('Search customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 