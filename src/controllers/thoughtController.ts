import { RequestHandler } from 'express';
import Thought from '../models/Thought';
import User from '../models/User';

// Get all thoughts
const getThoughts: RequestHandler = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get thought by ID
const getThoughtById: RequestHandler<{ thoughtId: string }> = async (req, res): Promise<void> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create a thought
const createThought: RequestHandler = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update thought
const updateThought: RequestHandler<{ thoughtId: string }> = async (req, res): Promise<void> => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true, runValidators: true });
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete thought
const deleteThought: RequestHandler<{ thoughtId: string }> = async (req, res): Promise<void> => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json({ message: 'Thought deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add reaction to thought
const addReaction: RequestHandler<{ thoughtId: string }> = async (req, res): Promise<void> => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Remove reaction
const removeReaction: RequestHandler<{ thoughtId: string; reactionId: string }> = async (req, res): Promise<void> => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

export default {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
};