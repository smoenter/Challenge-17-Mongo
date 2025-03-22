import { Schema, Types, model, type Document } from 'mongoose';

interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: number
}

interface IThought extends Document {
    thoughtText: string,
    username: string,
    createdAt: Schema.Types.Date,
    reaction: [reactionSchema]
}

const thoughtSchema = new Schema<IReaction>(
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: any) => dateFormat(timestamp)
        },
        username: {
            name: String,
            required: true,
        },
    reaction: [reactionSchema]

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
