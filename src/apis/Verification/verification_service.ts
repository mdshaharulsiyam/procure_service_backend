import auth_model from "../Auth/auth_model";
import { verification_model } from "./verification_model";

async function create(email: string) {
    const user = await auth_model.findOne({ email: email })

    if (!user) throw new Error('User not found')

    const result = await verification_model.findOneAndUpdate(
        { email: email },
        { email: email },
        { new: true, upsert: true }
    ).lean();

    if (!result) {
        throw new Error('unable to sent verification code')

    }

    return { success: true, message: 'a verification code has been sent to your email', data: { email } }
}

export const verification_service = Object.freeze({
    create
})