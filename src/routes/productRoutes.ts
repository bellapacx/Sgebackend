import express, { Request, Response } from 'express';
import ProductModel from '../models/product';

const router = express.Router();

// Create a new product
router.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, category, purchase_price, sell_price, unit } = req.body;

    // Ensure all required fields are present
    if (!name || !category || !purchase_price || !sell_price || !unit) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new ProductModel({
      name,
      category,
      purchase_price,
      sell_price,
      unit,
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
    const { name, category, purchase_price, sell_price, unit } = req.body;

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, category, purchase_price, sell_price, unit },
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
