import { Router, Request, Response } from 'express';
import SellOrder from '../models/sellOrder';
import Store from '../models/stores';
import Product from '../models/product'; // Assuming this is the path to your Product model
import EmptyCrate from '../models/emptyCrates';

const router = Router();

// Create a new sell order and update store inventory
router.post('/sorders', async (req: Request, res: Response) => {
  try {
    const { store_id, product_id, quantity, sell_date, customer_name } = req.body;

    // Find the store by ID
    const store = await Store.findById(store_id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Find the product by ID
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the product in the store's inventory
    const existingProduct = store.inventory.find(
      (item) => item.product_id.toString() === product_id
    );

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found in store inventory' });
    }

    // Check if there is enough stock
    if (existingProduct.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Calculate the total sell price
    const total_sell_price = product.sell_price * quantity;

    // Create the sell order
    const sellOrder = new SellOrder({
      store_id,
      product_id,
      quantity,
      sell_price: total_sell_price,
      sell_date,
      customer_name,
      created_at: new Date()
    });

    await sellOrder.save();

    // Update the store's inventory
    existingProduct.quantity -= quantity;
    await store.save();
    

    res.status(201).json(sellOrder);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// GET /sorders - Get all sell orders
router.get('/sorders', async (req: Request, res: Response) => {
  try {
    const sellOrders = await SellOrder.find()
      .populate('store_id', 'name location')
      .populate('product_id', 'name category sell_price') // Include sell_price in populated fields
      .exec();

    res.status(200).json(sellOrders);
  } catch (error) {
    console.error('Error retrieving sell orders:', error); // Log the full error
    res.status(500).json({ message: 'Error retrieving sell orders' });
  }
});

// GET /api/sell-reports - Fetch sell orders for a specific store on an exact day
router.get('/sell-reports', async (req: Request, res: Response) => {
  const { store_id, sell_date } = req.query;

  if (!store_id || !sell_date) {
    return res.status(400).json({ error: 'Store ID and sell date are required' });
  }

  try {
    const date = new Date(sell_date as string);
    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const sellOrders = await SellOrder.find({
      store_id: store_id as string,
      sell_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      }
    })
      .populate('store_id', 'name') // Populate store name
      .populate('product_id', 'name category sell_price'); // Populate product details

    if (sellOrders.length === 0) {
      return res.status(404).json({ error: 'No sell orders found for the specified date' });
    }

    // Aggregate data on the backend
    const total_revenue = sellOrders.reduce((acc, order) => acc + (order.sell_price), 0);
    const quantity_sold = sellOrders.reduce((acc, order) => acc + order.quantity, 0);

    res.status(200).json({
      quantity_sold,
      total_revenue,
      sell_orders: sellOrders
    });
  } catch (error) {
    console.error('Error fetching sell reports:', error);
    res.status(500).json({ error: 'An error occurred while fetching the sell orders' });
  }
});

export default router;
