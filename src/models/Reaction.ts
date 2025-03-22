import { Schema, Types, model, type Document } from 'mongoose';


interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Schema.Types.Date
    timestamp: boolean
}


const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: any) => dateFormat(timestamp)
        }
    },
    {
        toJSON: {
            getters: true
        },
        timestamp: true,
        id: false
    }
);

export default reactionSchema;