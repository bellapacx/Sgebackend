import { Router, Request, Response } from 'express';
import SellOrder from '../models/sellOrder';
import Store from '../models/stores';
import Product from '../models/product'; // Ensure this is the correct path to your Product model

const router = Router();

// Create a new sell order and update store inventory
router.post('/sorders', async (req: Request, res: Response) => {
  try {
    const { store_id, product_id, quantity, sell_date, customer_name, pricing_type, sub_agent_id } = req.body;
    // `pricing_type` indicates whether to use 'store' or 'sub_agent' pricing
    // `sub_agent_id` will be provided if pricing_type is 'sub_agent'

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

    // Determine the sell price based on the `pricing_type` (store or sub-agent)
    let sellPrice: number;

    if (pricing_type === 'store') {
      // Find the store-specific price
      const storePrice = product.store_prices?.find(sp => sp.store_id.toString() === store_id);
      sellPrice = storePrice ? storePrice.sell_price : product.default_sell_price;
    } else if (pricing_type === 'sub_agent' && sub_agent_id) {
      // Find the sub-agent-specific price
      const subAgentPrice = product.sub_agent_prices?.find(sa => sa.sub_agent_id.toString() === sub_agent_id);
      sellPrice = subAgentPrice ? subAgentPrice.sell_price : product.default_sell_price;
    } else {
      // Default to the product's default sell price if no specific price is found
      sellPrice = product.default_sell_price;
    }

    // Calculate the total sell price
    const total_amount = sellPrice * quantity;

    // Create the sell order
    const sellOrder = new SellOrder({
      store_id,
      product_id,
      quantity,
      sell_price: sellPrice,
      total_amount, // Assign the calculated total amount
      sell_date,
      customer_name,
      created_at: new Date(),
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
      .populate('product_id', 'name category default_sell_price') // Include default_sell_price in populated fields
      .exec();

    res.status(200).json(sellOrders);
  } catch (error) {
    console.error('Error retrieving sell orders:', error);
    res.status(500).json({ message: 'Error retrieving sell orders' });
  }
});

// GET /sell-reports - Fetch sell orders for a specific store on an exact day
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
      },
    })
      .populate('store_id', 'name') // Populate store name
      .populate('product_id', 'name category default_sell_price'); // Populate product details

    if (sellOrders.length === 0) {
      return res.status(404).json({ error: 'No sell orders found for the specified date' });
    }

    // Aggregate data on the backend
    const total_revenue = sellOrders.reduce((acc, order) => acc + order.total_amount, 0);
    const quantity_sold = sellOrders.reduce((acc, order) => acc + order.quantity, 0);

    res.status(200).json({
      quantity_sold,
      total_revenue,
      sell_orders: sellOrders,
    });
  } catch (error) {
    console.error('Error fetching sell reports:', error);
    res.status(500).json({ error: 'An error occurred while fetching the sell orders' });
  }
});

export default router;
