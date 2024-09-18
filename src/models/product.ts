import { Schema, model } from 'mongoose';

// Define the Product interface
interface Product {
  name: string;
  category: string;
  purchase_price: number; // New field for purchase price
  sell_price: number; // New field for selling price
  unit: string;
  created_at?: Date;
  updated_at?: Date;
}

// Define the product schema
const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchase_price: { type: Number, required: true }, // New field for purchase price
  sell_price: { type: Number, required: true }, // New field for selling price
  unit: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the Product model
const ProductModel = model<Product>('Product', productSchema);

export default ProductModel;
