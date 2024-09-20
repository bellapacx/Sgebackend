import { Schema, model } from 'mongoose';

// Define the interface for store-specific pricing
interface StorePrice {
  store_id: Schema.Types.ObjectId;
  sell_price: number;
}

// Define the interface for sub-agent-specific pricing
interface SubAgentPrice {
  sub_agent_id: Schema.Types.ObjectId;
  sell_price: number;
}

// Define the Product interface
interface Product {
  name: string;
  category: string;
  purchase_price: number;
  default_sell_price: number; // Default sell price if no specific price is defined
  unit: string;
  store_prices?: StorePrice[]; // Array of specific store prices
  sub_agent_prices?: SubAgentPrice[]; // Array of specific sub-agent prices
  created_at?: Date;
  updated_at?: Date;
}

// Define the product schema
const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchase_price: { type: Number, required: true }, // Purchase price
  default_sell_price: { type: Number, required: true }, // Default selling price
  unit: { type: String, required: true },
  store_prices: [
    {
      store_id: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
      sell_price: { type: Number, required: true },
    }
  ],
  sub_agent_prices: [
    {
      sub_agent_id: { type: Schema.Types.ObjectId, ref: 'SubAgent', required: true },
      sell_price: { type: Number, required: true },
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the Product model
const ProductModel = model<Product>('Product', productSchema);

export default ProductModel;
