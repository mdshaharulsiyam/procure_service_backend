import { Document } from "mongoose";

export interface IAuth extends Document {
    name?: string;
    email: string;
    password: string;
    phone?: string;
    img?: string;
    role: "ADMIN" | 'SUPER_ADMIN' | "PROFESSIONAL" | 'USER';
    block: boolean;
    provider: "GOOGLE" | "CREDENTIAL" | "FACEBOOK" | "GITHUB" | "APPLE"
    is_verified: boolean;
    accessToken: string;
    useType: 'FREE' | "PREMIUM",
    documents: string[];
    credits: number;
    is_identity_verified: boolean,
    createdAt: Date;
    updatedAt: Date;
}