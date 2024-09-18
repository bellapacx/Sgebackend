import { Schema, model, Document, Types } from 'mongoose';

interface IPurchaseOrder extends Document {
  store_id: Types.ObjectId; // Use Types.ObjectId instead of Schema.Types.ObjectId
  product_id: Types.ObjectId; // Use Types.ObjectId instead of Schema.Types.ObjectId
  quantity: number;
  supplier: string;
  purchase_date: Date;
  total_cost: number;
  status: 'pending' | 'accepted';
  created_at: Date;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>({
  store_id: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  supplier: { type: String, required: true },
  purchase_date: { type: Date, required: true },
  total_cost: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
