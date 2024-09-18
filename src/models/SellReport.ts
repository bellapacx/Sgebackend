import { Schema, model, Document, Types } from 'mongoose';

// Define the individual sell order interface
interface SellOrderDetail {
  sell_order_id: Types.ObjectId;
  quantity: number;
  sell_price: number;
  sell_date: Date;
  customer_name: string;
}

// Define the SellReport interface
interface SellReport extends Document {
  store_id: Types.ObjectId;
  product_id: Types.ObjectId;
  quantity_sold: number;
  total_revenue: number;
  report_date: Date;
  sell_orders: SellOrderDetail[];  // Use SellOrderDetail interface here
}

// Define the SellReport schema
const sellReportSchema = new Schema<SellReport>({
  store_id: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity_sold: { type: Number, required: true },
  total_revenue: { type: Number, required: true },
  report_date: { type: Date, default: Date.now },
  sell_orders: [
    {
      sell_order_id: { type: Schema.Types.ObjectId, ref: 'SellOrder', required: true },
      quantity: { type: Number, required: true },
      sell_price: { type: Number, required: true },
      sell_date: { type: Date, required: true },
      customer_name: { type: String, required: true },
    },
  ],
});

// Create the SellReport model
const SellReportModel = model<SellReport>('SellReport', sellReportSchema);

export default SellReportModel;
