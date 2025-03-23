import { Schema, Types, type Document } from 'mongoose';

//interface for the Reaction
interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Schema.Types.Date
   }

//creating the schema for Reaction
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
            get: (timestamp: Date) => timestamp.toISOString(),
        }
    },
    {
        toJSON: {
            getters: true
        },
        timestamps: true,
       
    }
);


export default reactionSchema;