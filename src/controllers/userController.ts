import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, Thought } from '../models/index.js';

/**
 * GET All Users /users
 * @returns an array of Users
*/
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .populate('thoughts').populate('friends');
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
}

/**
 * GET User based on id /user/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const thought = await User.findById(userId)
      .populate('thoughts').populate('friends');
    if (thought) {
      return res.json(thought);
    } else {
      return res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/**
* POST User /users
* @param object username
* @returns a single User object
*/
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const newUser = await User.create({
      name, email
    });
   return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
};

/**
 * PUT User based on id /users/:id
 * @param object id, username
 * @returns a single User object
*/
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with this id!' });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
};

/**
* DELETE User based on id /user/:id
* @param string id
* @returns string 
*/
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({
        message: 'No user with that ID'
      });
    } else {
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      return res.json({ message: 'User and thoughts deleted!' });
    }

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};


//POST to add a new friend to a user's friend list
// @param userId, friendId
// @returns a user object

export const createFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params; // Get userId and friendId from URL params

  try {
    // Find the user and the friend by their respective IDs
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

       // Check if the user is already friends with the friend
    if (user.friends.some((friend) => friend.toString() === friendId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Add the friend to the user's friends array
    user.friends.push(friendId as unknown as mongoose.Schema.Types.ObjectId);

    // Save the updated user
    await user.save();

    // Return the updated user
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//DELETE to delete a friend to user's friend list
// @ param userId, friendId
//@returns a user object

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.friends.some((friendId) => friendId.toString() === req.params.friendId)) {
      return res.status(404).json({
        message: 'User not found or friend not in user\'s friend list'
      });
    }
    user.friends = user.friends.filter((friend) => friend.toString() !== req.params.friendId);
    await user.save();
    return res.json(user)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

