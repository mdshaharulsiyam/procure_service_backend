import { Document, Types } from "mongoose";

export interface IIssue extends Document {
    email: string;
    description: string;
    urgency: "HIGH" | "MEDIUM" | "LOW";
    service: Types.ObjectId;
    category: Types.ObjectId;
    address: string;
    phone: string;
    user: Types.ObjectId,
    status: "open" | "connected" | "closed";
    
}