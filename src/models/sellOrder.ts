import mongoose, { Schema, Document } from 'mongoose';

interface ISellOrder extends Document {
  store_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  sell_price: number;
  total_amount: number; // Add total_amount field
  sell_date: Date;
  customer_name: string;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
}

const SellOrderSchema: Schema = new Schema({
  store_id: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  sell_price: { type: Number, required: true },
  total_amount: { type: Number, required: true }, // Total amount field
  sell_date: { type: Date, required: true },
  customer_name: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now }
});

const SellOrder = mongoose.model<ISellOrder>('SellOrder', SellOrderSchema);

export default SellOrder;
