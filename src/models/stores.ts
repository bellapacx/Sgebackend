import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for InventoryItem
interface InventoryItem {
  product_id: Types.ObjectId;
  quantity: number;
  
}

// Define the interface for Store document
interface StoreDocument extends Document {
  name: string;
  location: string;
  manager: string;
  inventory: InventoryItem[];
  created_at: Date;
  updated_at: Date;
}

// Define the InventoryItem schema
const InventoryItemSchema = new Schema<InventoryItem>({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0 },
});

// Define the Store schema
const StoreSchema = new Schema<StoreDocument>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  manager: { type: String, required: true },
  inventory: { type: [InventoryItemSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save hook to update the `updated_at` field
StoreSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Create the Store model
const Store = model<StoreDocument>('Store', StoreSchema);

export default Store;
