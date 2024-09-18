// routes/emptyCratesRoutes.ts
import { Router, Request, Response } from 'express';
import EmptyCrate from '../models/emptyCrates';
import { Types } from 'mongoose';

const router = Router();
// Add or update empty crates
interface InventoryItem {
    product_id: string;
    quantity: number;
  }
  
  // POST route to add new empty crates
  router.post('/empty-crates', async (req: Request, res: Response) => {
    try {
      const { store_id, inventory } = req.body;
  
      if (!store_id || !inventory || !Array.isArray(inventory)) {
        return res.status(400).json({ error: 'Store ID and inventory are required.' });
      }
  
      let emptyCrate = await EmptyCrate.findOne({ store_id });
  
      if (emptyCrate) {
        inventory.forEach(item => {
          const existingItemIndex = emptyCrate!.inventory.findIndex(crate => crate.product_id.toString() === item.product_id);
          if (existingItemIndex > -1) {
            emptyCrate!.inventory[existingItemIndex].quantity += item.quantity;
          } else {
            emptyCrate!.inventory.push(item);
          }
        });
        emptyCrate.updated_at = new Date();
      } else {
        emptyCrate = new EmptyCrate({ store_id, inventory });
      }
  
      await emptyCrate.save();
      res.status(200).json(emptyCrate);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
  
  router.get('/empty-crates/:store_id', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.store_id;
  
      const emptyCrate = await EmptyCrate.findOne({ store_id: storeId }).populate('inventory.product_id');
  
      if (!emptyCrate) {
        return res.status(404).json({ error: 'No empty crates found for the specified store' });
      }
  
      res.status(200).json(emptyCrate);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
// GET route to fetch all empty crates
router.get('/empty-crates', async (req: Request, res: Response) => {
    try {
      const emptyCrates = await EmptyCrate.find().populate('inventory.product_id');
      res.status(200).json(emptyCrates);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
// Get a single store by ID (return store_id, product_id, and quantity in inventory)
router.get('/emptycrates/:storeId', async (req: Request, res: Response) => {
  try {
      // Find the empty crates document for the given store and select the required fields
      const emptyCrate = await EmptyCrate.findOne({ store_id: req.params.storeId })
          .select('store_id inventory.product_id inventory.quantity'); // Include store_id, product_id, and quantity

      if (!emptyCrate) {
          return res.status(404).json({ error: 'No empty crates found for the specified store' });
      }

      res.status(200).json(emptyCrate);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching empty crates' });
  }
});

  // Update empty crates inventory
// Update empty crates for a specific store
router.put('/emptycrates/:storeId', async (req: Request, res: Response) => {
    try {
      const storeId = req.params.storeId;
      const { inventory } = req.body;
  
      // Find the empty crate document for the given store
      const emptyCrate = await EmptyCrate.findOne({ store_id: storeId });
  
      if (!emptyCrate) {
        return res.status(404).json({ error: 'No empty crates found for the specified store' });
      }
  
      // Update inventory
      emptyCrate.inventory = inventory;
  
      // Save the updated document
      await emptyCrate.save();
  
      res.status(200).json(emptyCrate);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating empty crates' });
    }
  });
  
  
// Get empty crates by store ID
// Create a new entry for empty crates
router.post('/emptycrates', async (req: Request, res: Response) => {
  try {
      const { store_id, inventory } = req.body;

      // Check if the store already has an entry for empty crates
      const existingEmptyCrate = await EmptyCrate.findOne({ store_id });

      if (existingEmptyCrate) {
          return res.status(400).json({ error: 'Empty crates entry already exists for this store' });
      }

      // Create a new empty crates entry
      const newEmptyCrate = new EmptyCrate({
          store_id,
          inventory,
          created_at: new Date(),
          updated_at: new Date(),
      });

      // Save the new empty crates entry to the database
      await newEmptyCrate.save();

      res.status(201).json(newEmptyCrate);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating empty crates' });
  }
});

export default router;
