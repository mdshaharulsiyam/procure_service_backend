import { model, Schema } from "mongoose";
import { IVerification } from "./verification_type";

const verification_schema = new Schema<IVerification>({

    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
    },

    code: {
        type: String,
        required: [true, 'code is required'],
    },

});

export const verification_model = model<IVerification>('verification', verification_schema);