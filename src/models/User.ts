import { Schema, model, type Document } from 'mongoose';


interface IUser extends Document {
    name: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[]
}

const usernameSchema = new Schema<IUsername>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: Boolean,
            default: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'friends',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        timestamps: true
    },
);

const User = model<IUser>('Course', usernameSchema);

export default User;
