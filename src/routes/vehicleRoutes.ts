import express from 'express';
import Vehicle from '../models/Vehicles';

const router = express.Router();

// Create a new vehicle
router.post('/vehicles', async (req, res) => {
  try {
    const { driverName, plateNumber } = req.body;
    const vehicle = new Vehicle({ driverName, plateNumber });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
});

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
});

// Update a vehicle by ID
router.put('/vehicles/:id', async (req, res) => {
  try {
    const { driverName, plateNumber } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { driverName, plateNumber },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'error'});
  }
});

// Delete a vehicle by ID
router.delete('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(400).json({ error: 'error deleting vehicle' });
  }
});

export default router;
