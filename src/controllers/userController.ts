import { Request, Response } from 'express';
import { User, Thought} from '../models/index.js';

/**
 * GET All Users /courses
 * @returns an array of Users
*/
export const getAllUsers = async(_req: Request, res: Response) => {
    try {
        const courses = await User.find();
        res.json(courses);
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
      const student = await User.findById(courseId);
      if(student) {
        res.json(student);
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
 * POST User /courses
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
 * PUT User based on id /courses/:id
 * @param object id, username
 * @returns a single User object
*/
export const updateUser = async (req: Request, res: Response) => {
    try {
      const course = await User.findOneAndUpdate(
        { _id: req.params.courseId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!course) {
        res.status(404).json({ message: 'No course with this id!' });
      }

      res.json(course)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE User based on id /courses/:id
 * @param string id
 * @returns string 
*/
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const course = await User.findOneAndDelete({ _id: req.params.courseId});
      
      if(!course) {
        res.status(404).json({
          message: 'No course with that ID'
        });
      } else {
        await Student.deleteMany({ _id: { $in: course.students } });
        res.json({ message: 'User and students deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };
