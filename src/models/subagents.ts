import { Schema, model, Types } from 'mongoose';

// Define the SubAgent interface
interface SubAgent {
  name: string;
  contact_info?: string;
  assigned_stores: Types.ObjectId[]; // Array of store IDs
  assigned_products: Array<{
    product_id: Types.ObjectId; // Product reference
    sell_price: number; // Sub-agent specific sell price
  }>;
  created_at?: Date;
  updated_at?: Date;
}

// Define the SubAgent schema
const subAgentSchema = new Schema<SubAgent>({
  name: { type: String, required: true },
  contact_info: { type: String },
  assigned_stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }], // Reference to Store model
  assigned_products: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sell_price: { type: Number, required: true }, // Sell price specific to this sub-agent
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the SubAgent model
const SubAgentModel = model<SubAgent>('SubAgent', subAgentSchema);

export default SubAgentModel;
