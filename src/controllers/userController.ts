import { Request, Response } from 'express';
import { User, Thought} from '../models/index.js';

/**
 * GET All Users /users
 * @returns an array of Users
*/
export const getAllUsers = async(_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET User based on id /course/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    try {
      const thought = await User.findById(courseId);
      if(thought) {
        res.json(thought);
      } else {
        res.status(404).json({
          message: 'Volunteer not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
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
    const { course } = req.body;
    try {
      const newUser = await User.create({
        course
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({
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
        { _id: req.params.courseId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user)
    } catch (error: any) {
      res.status(400).json({
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
      const user = await User.findOneAndDelete({ _id: req.params.userId});
      
      if(!user) {
        res.status(404).json({
          message: 'No course with that ID'
        });
      } else {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and thoughts deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };
