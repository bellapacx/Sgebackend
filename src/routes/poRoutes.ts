import { Router, Request, Response } from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import Store from '../models/stores'; // Ensure this matches your actual schema
import Product from '../models/product'; // Import for Product model if needed
import mongoose from 'mongoose';

const router = Router();

// Create a new purchase order with status 'pending'
router.post('/porders', async (req: Request, res: Response) => {
  try {
    const { store_id, product_id, quantity } = req.body;

    // Validate required fields
    if (!store_id || !product_id || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch the product to get the purchase price
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const total_cost = product.purchase_price * quantity;

    // Create the purchase order
    const purchaseOrder = new PurchaseOrder({
      ...req.body,
      total_cost,
      status: 'pending',
    });

    await purchaseOrder.save();

    res.status(201).json(purchaseOrder);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Accept a purchase order and update store inventory
router.put('/porders/:id/accept', async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    if (purchaseOrder.status === 'accepted') {
      return res.status(400).json({ error: 'Purchase order is already accepted' });
    }

    purchaseOrder.status = 'accepted';
    await purchaseOrder.save();

    // Update the store's stock
    const store = await Store.findById(purchaseOrder.store_id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const existingProduct = store.inventory.find(
      (item) => item.product_id.toString() === purchaseOrder.product_id.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += purchaseOrder.quantity;
    } else {
      store.inventory.push({
        product_id: purchaseOrder.product_id,
        quantity: purchaseOrder.quantity,
      });
    }

    await store.save();

    res.status(200).json({ message: 'Purchase order accepted and inventory updated', purchaseOrder });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get all purchase orders
router.get('/porders', async (req: Request, res: Response) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().populate('store_id product_id');
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

/// Get a purchase order by ID for editing
router.get('/porders/:id', async (req: Request, res: Response) => {
    try {
      // Validate the ID parameter
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid purchase order ID' });
      }
  
      // Fetch the purchase order
      const purchaseOrder = await PurchaseOrder.findById(id);
  
      if (!purchaseOrder) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
  
      res.status(200).json(purchaseOrder);
    } catch (error) {
      console.error('Error fetching purchase order:', error);
      res.status(500).json({ error: 'Failed to fetch purchase order' });
    }
  });
  
// Update a purchase order by ID
router.put('/porders/:id', async (req: Request, res: Response) => {
    try {
      const { store_id, product_id, quantity, supplier, purchase_date } = req.body;
  
      // Validate required fields
      if (!store_id || !product_id || quantity === undefined || !supplier || !purchase_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Validate ObjectId fields
      if (!mongoose.Types.ObjectId.isValid(store_id) || !mongoose.Types.ObjectId.isValid(product_id)) {
        return res.status(400).json({ error: 'Invalid store_id or product_id' });
      }
  
      // Fetch the purchase order to update
      const purchaseOrder = await PurchaseOrder.findById(req.params.id);
  
      if (!purchaseOrder) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
  
      // Fetch the product to get the purchase price
      const product = await Product.findById(product_id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const total_cost = product.purchase_price * quantity;
  
      // Update the purchase order
      purchaseOrder.store_id = store_id;
      purchaseOrder.product_id = product_id;
      purchaseOrder.quantity = quantity;
      purchaseOrder.supplier = supplier;
      purchaseOrder.purchase_date = new Date(purchase_date);
      purchaseOrder.total_cost = total_cost;
  
      await purchaseOrder.save();
  
      res.status(200).json(purchaseOrder);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  


export default router;
