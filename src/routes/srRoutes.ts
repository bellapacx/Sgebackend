import { Router, Request, Response } from 'express';
import SellReport from '../models/SellReport'; // Adjust the path as necessary

const router = Router();

// POST /sell-reports - Create a new sell report
router.post('/sellreports', async (req: Request, res: Response) => {
  try {
    const { store_id, product_id, quantity_sold, total_revenue, report_date, sell_orders } = req.body;

    // Validate inputs
    if (!store_id || !product_id || !quantity_sold || !total_revenue || !report_date || !sell_orders) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate and parse the report_date
    const parsedDate = new Date(report_date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid report_date format. Use ISO 8601 format (e.g., 2024-08-18T00:00:00.000Z).' });
    }

    // Create the sell report
    const sellReport = new SellReport({
      store_id,
      product_id,
      quantity_sold,
      total_revenue,
      report_date: parsedDate,
      sell_orders,
    });

    await sellReport.save();

    res.status(201).json(sellReport);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// GET /sell-reports - Get all sell reports
router.get('/sellreports', async (req: Request, res: Response) => {
  try {
    const sellReports = await SellReport.find()
      .populate('store_id', 'name location') // Assuming you want to populate store details
      .populate('product_id', 'name category sell_price') // Assuming you want to populate product details
      .exec();

    res.status(200).json(sellReports);
  } catch (error) {
    console.error('Error retrieving sell reports:', error); // Log the full error
    res.status(500).json({ message: 'Error retrieving sell reports' });
  }
});

export default router;
