import { Router, Request, Response } from 'express';
import Store from '../models/stores'; // Adjust the path as necessary
import EmptyCrate from '../models/emptyCrates';
import mongoose from 'mongoose';

const router = Router();

router.post('/stores', async (req: Request, res: Response) => {
    try {
      const { name, location, manager } = req.body;
  
      // Validate required fields
      if (!name || !location || !manager) {
        return res.status(400).json({ error: 'Name, location, and manager are required.' });
      }
  
      // Create a new store instance
      const store = new Store({ name, location, manager });
  
      // Save store to the database
      await store.save();
  
      // Send successful response
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
// Get all stores
router.get('/stores', async (req: Request, res: Response) => {
  try {
    const stores = await Store.find().populate('manager').populate('inventory.product_id');
    res.status(200).json(stores);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get a single store by ID
router.get('/stores/:id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id).populate('manager').populate('inventory.product_id');
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Update a store by ID
router.put('/stores/:id', async (req: Request, res: Response) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('inventory.product_id');
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Delete a store
router.delete('/stores/:id', async (req: Request, res: Response) => {
  try {
    const storeId = req.params.id;

    // Delete associated inventory (empty crates) for this store
    await EmptyCrate.deleteMany({ store_id: storeId });

    const store = await Store.findByIdAndDelete(storeId);
    if (store) {
      res.status(200).json({ message: 'Store and associated inventory deleted successfully' });
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
