import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Thought, User } from '../models/index.js';

// Aggregate function to get number of overall reactions 

export const totalReactions = async () => {
    const numberOfReactions = await Thought.aggregate()
        .count('totalReactions');
    return numberOfReactions;
}

// Aggregate function for getting the thought 
export const thought = async (thoughtId: string) =>
    Thought.aggregate([
        // only include the given thought by using $match
        { $match: { _id: new ObjectId(thoughtId) } },
        {
            $unwind: '$reactions',
        },
        {
            $group: {
                _id: new ObjectId(thoughtId), totalReactions: { $sum: 1 }
            },
        },
    ]);

/**
 * GET All Thoughts /thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughtText = await Thought.find();

        const thoughtObj = {
            thoughtText,
            totalReactions: await totalReactions(),
        }

        res.json(thoughtObj);
    } catch (error: any) {
        console.error(error)
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Thought based on id /thoughts/:id
 * @param string id
 * @returns a single Thought object
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const foundThought = await Thought.findById(thoughtId);
        if (foundThought) {
            res.json({
                thought: await thought(thoughtId)
            });
        } else {
            res.status(404).json({
                message: 'Thought not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST Thought /thoughts
 * @param object thought
 * @returns a single Thought object
*/

export const createThought = async (req: Request, res: Response) => {
    try {
        const { thoughtText, username, userId } = req.body;
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add the thought to the user's thoughts array
        const thought = await Thought.create({ thoughtText, username });
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        return res.json(thought);
    } catch (err) {
        console.error(err)
        return res.status(500).json(err);
    }
}

/**
 * PUT User based on id /thought/:id
 * @param object id, thought
 * @returns a single thought
*/
export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }

        return res.json(thought)
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({
            message: error.message
        });
    }
};

/**

/**
* DELETE Thought based on id /thoughts/:id
* @param string id
* @returns string 
*/

export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No such thought exists' });
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'Thought deleted, but no users found',
            });
        }

        return res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
 * POST Reaction based on /thought/:thoughtId/reactions
 * @param string id
 * @param object reaction
 * @returns object thought 
*/

export const addReaction = async (req: Request, res: Response) => {
    console.log('Adding reaction');
    
    try {
        const { reactionBody, username } = req.body;  // Ensure these fields are passed in the body

        // Validate if reactionBody and username are provided
        if (!reactionBody || !username) {
            return res.status(400).json({ message: 'Reaction body and username are required.' });
        }

        // Create a new reaction object with required fields
        const newReaction = {
            reactionBody,
            username,
            createdAt: new Date()  // or use a default in your schema if necessary
        };

        // Find the thought by its ID and add the new reaction to the reactions array
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: newReaction } },  // $addToSet prevents duplicate reactions
            { runValidators: true, new: true }  // Ensures that the updated thought is returned
        );

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        return res.status(201).json(thought);  // Successfully return the updated thought with the new reaction

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err });
    }
};


/**
 * DELETE Reaction based on /thoughts/:thoughtId/reactions
 * @param string reactionId
 * @param string thoughtId
 * @returns object thought 
*/

export const removeReaction = async (req: Request, res: Response) => {
    try {
        // Find the thought by its ID and pull the reaction by its reactionId
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, // Match thought by its ID
            { $pull: { reactions: { _id: req.params.reactionId } } }, // Match reaction by reactionId (_id field in each reaction)
            { runValidators: true, new: true } // Return the updated thought with reactions removed
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID :(' });
        }

        return res.json(thought); // Return the updated thought with reactions removed
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
