import { Schema, model, Types } from 'mongoose';

// Define the SubAgent interface
interface SubAgent {
  name: string;
  contact_info?: string;
  assigned_stores: Types.ObjectId[]; // Array of store IDs
  created_at?: Date;
  updated_at?: Date;
}

// Define the SubAgent schema
const subAgentSchema = new Schema<SubAgent>({
  name: { type: String, required: true },
  contact_info: { type: String },
  assigned_stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }], // Reference to Store model
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the SubAgent model
const SubAgentModel = model<SubAgent>('SubAgent', subAgentSchema);

export default SubAgentModel;
