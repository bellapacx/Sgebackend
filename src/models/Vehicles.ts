import mongoose, { Document, Schema } from 'mongoose';

interface IVehicle extends Document {
  driverName: string;
  plateNumber: string;
}

const vehicleSchema: Schema = new Schema({
  driverName: {
    type: String,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
