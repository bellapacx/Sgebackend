// models/emptyCrates.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the InventoryItem interface
interface InventoryItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
}

// Define the EmptyCrate interface
interface EmptyCrate extends Document {
  store_id: mongoose.Types.ObjectId;
  inventory: InventoryItem[];
  created_at: Date;
  updated_at: Date;
}

const emptyCrateSchema = new Schema<EmptyCrate>({
  store_id: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  inventory: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const EmptyCrate = mongoose.model<EmptyCrate>('EmptyCrate', emptyCrateSchema);
export default EmptyCrate;
