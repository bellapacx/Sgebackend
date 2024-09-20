import express, { Request, Response } from 'express';
import ProductModel from '../models/product';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new product
router.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, category, purchase_price, default_sell_price, unit, store_prices, sub_agent_prices } = req.body;

    // Ensure all required fields are present
    if (!name || !category || !purchase_price || !default_sell_price || !unit) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate and convert store_prices
    const convertStorePrices = (prices: any) => {
      return prices.map((price: any) => ({
        ...price,
        store_id: new mongoose.Types.ObjectId(price.store_id), // Use new here
      }));
    };

    // Validate and convert sub_agent_prices
    const convertSubAgentPrices = (prices: any) => {
      return prices.map((price: any) => ({
        ...price,
        sub_agent_id: new mongoose.Types.ObjectId(price.sub_agent_id), // Use new here
      }));
    };

    let convertedStorePrices = store_prices ? convertStorePrices(store_prices) : undefined;
    let convertedSubAgentPrices = sub_agent_prices ? convertSubAgentPrices(sub_agent_prices) : undefined;

    const product = new ProductModel({
      name,
      category,
      purchase_price,
      default_sell_price,
      unit,
      store_prices: convertedStorePrices, // Optional: array of store-specific prices
      sub_agent_prices: convertedSubAgentPrices, // Optional: array of sub-agent-specific prices
    });

    await product.save();
    res.status(201).json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get a single product
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Update a product
router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { name, category, purchase_price, default_sell_price, unit, store_prices, sub_agent_prices } = req.body;

    // Convert IDs to ObjectId before updating
    const updatedStorePrices = store_prices ? store_prices.map((price: any) => ({
      ...price,
      store_id: new mongoose.Types.ObjectId(price.store_id),
    })) : undefined;

    const updatedSubAgentPrices = sub_agent_prices ? sub_agent_prices.map((price: any) => ({
      ...price,
      sub_agent_id: new mongoose.Types.ObjectId(price.sub_agent_id),
    })) : undefined;

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, category, purchase_price, default_sell_price, unit, store_prices: updatedStorePrices, sub_agent_prices: updatedSubAgentPrices },
      { new: true }
    );

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Delete a product
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
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
