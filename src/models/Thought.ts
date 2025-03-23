import { Schema, model, type Document } from 'mongoose';
import reactionSchema from './Reaction.js';



interface IThought extends Document {
    thoughtText: string,
    username: string,
    createdAt: Schema.Types.Date,
    reactions: [typeof reactionSchema]
}

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date) => timestamp.toISOString(),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        },
        timestamps: true,
        _id: false
    }
);

const Thought = model('Thought', thoughtSchema);

export default Thought;
