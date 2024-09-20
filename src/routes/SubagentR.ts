import express from 'express';
import SubAgent from '../models/subagents';

const router = express.Router();

// Get all sub-agents
router.get('/subagent', async (req, res) => {
  try {
    const subAgents = await SubAgent.find()
      .populate('assigned_stores', 'name location'); // Populate assigned stores
    res.json(subAgents);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});

// Create a new sub-agent
router.post('/subagent', async (req, res) => {
  const { name, contact_info, assigned_stores } = req.body; // Removed assigned_products

  try {
    const newSubAgent = new SubAgent({
      name,
      contact_info,
      assigned_stores,
    });
    await newSubAgent.save();
    res.status(201).json(newSubAgent);
  } catch (err) {
    res.status(400).json({ message: 'Error creating sub-agent', error: err });
  }
});

// Get a specific sub-agent by ID
router.get('/subagent/:id', async (req, res) => {
  try {
    const subAgent = await SubAgent.findById(req.params.id)
      .populate('assigned_stores', 'name location');
    
    if (!subAgent) {
      return res.status(404).json({ message: 'Sub-agent not found' });
    }
    res.json(subAgent);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});

// Update a sub-agent
router.put('/subagent/:id', async (req, res) => {
  const { name, contact_info, assigned_stores } = req.body; // Removed assigned_products

  try {
    const updatedSubAgent = await SubAgent.findByIdAndUpdate(
      req.params.id,
      { name, contact_info, assigned_stores },
      { new: true }
    );

    if (!updatedSubAgent) {
      return res.status(404).json({ message: 'Sub-agent not found' });
    }
    res.json(updatedSubAgent);
  } catch (err) {
    res.status(400).json({ message: 'Error updating sub-agent', error: err });
  }
});

// Delete a sub-agent
router.delete('/subagent/:id', async (req, res) => {
  try {
    const deletedSubAgent = await SubAgent.findByIdAndDelete(req.params.id);
    if (!deletedSubAgent) {
      return res.status(404).json({ message: 'Sub-agent not found' });
    }
    res.json({ message: 'Sub-agent deleted', deletedSubAgent });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});

export default router;
