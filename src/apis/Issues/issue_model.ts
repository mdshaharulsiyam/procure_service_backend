import { model, Schema } from "mongoose";
import { IIssue } from "./issue_type";

const issue_schema = new Schema<IIssue>({
    description: {
        type: String,
        required: [true, 'description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'user id is required'],
        ref: 'auth'
    },
    status: {
        type: String,
        enum: ['open', 'connected', 'closed'],
        default: 'open'
    },
    service: {
        type: Schema.Types.ObjectId,
        required: [true, 'service id is required'],
        ref: 'service'
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    urgency: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'LOW'
    },
})
export const issue_model = model<IIssue>('issue', issue_schema)