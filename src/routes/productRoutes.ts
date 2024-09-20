import express, { Request, Response } from 'express';
import ProductModel from '../models/product';
import Store from '../models/stores';
import EmptyCrate from '../models/emptyCrates';
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

    // Convert store_prices to the correct structure
    const convertedStorePrices = store_prices ? store_prices.map((price: any) => ({
      store_id: new mongoose.Types.ObjectId(price.store_id), // Convert to ObjectId
      sell_price: price.sell_price,
    })) : [];

    // Convert sub_agent_prices to the correct structure
    const convertedSubAgentPrices = sub_agent_prices ? sub_agent_prices.map((price: any) => ({
      sub_agent_id: new mongoose.Types.ObjectId(price.sub_agent_id), // Convert to ObjectId
      sell_price: price.sell_price,
    })) : [];

    const product = new ProductModel({
      name,
      category,
      purchase_price,
      default_sell_price,
      unit,
      store_prices: convertedStorePrices,
      sub_agent_prices: convertedSubAgentPrices,
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

    const updatedStorePrices = store_prices ? store_prices.map((price: any) => ({
      store_id: new mongoose.Types.ObjectId(price.store_id),
      sell_price: price.sell_price,
    })) : undefined;

    const updatedSubAgentPrices = sub_agent_prices ? sub_agent_prices.map((price: any) => ({
      sub_agent_id: new mongoose.Types.ObjectId(price.sub_agent_id),
      sell_price: price.sell_price,
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

// Delete a product and remove it from store inventories
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // Step 1: Delete the product from the products collection
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Step 2: Remove the product from all inventories
    await Store.updateMany(
      {},
      { $pull: { inventory: { product_id: productId } } }
    );

    // Step 2: Remove the product from all inventories
    await EmptyCrate.updateMany(
      {},
      { $pull: { inventory: { product_id: productId } } }
    );

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});


export default router;
