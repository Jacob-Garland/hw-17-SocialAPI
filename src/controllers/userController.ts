import { RequestHandler } from 'express';
import User from '../models/User';
import Thought from '../models/Thought';

// Get all users
const getUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get user by ID
const getUserById: RequestHandler<{ userId: string }> = async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
    if (!user) {
      res.status(404).json({ message: 'No user found with this ID!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create user
const createUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update user
const updateUser: RequestHandler<{ userId: string }> = async (req, res): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });
    if (!user) {
      res.status(404).json({ message: 'No user found with this ID!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete user and their thoughts
const deleteUser: RequestHandler<{ userId: string }> = async (req, res): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'No user found with this ID!' });
    }
    if (user) {
      await Thought.deleteMany({ _id: { $in: user.thoughts } }); // BONUS: Delete all associated thoughts with User
    }
    res.json({ message: 'User and associated thoughts deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add friend
const addFriend: RequestHandler<{ userId: string; friendId: string }> = async (req, res): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user found with this ID!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Remove friend
const removeFriend: RequestHandler<{ userId: string; friendId: string }> = async (req, res): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user found with this ID!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};