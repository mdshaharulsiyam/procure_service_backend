import { verification_service } from "../Verification/verification_service";
import auth_model from "./auth_model";
import { IAuth } from "./auth_types";

async function create(data: { [key: string]: string }, auth?: IAuth) {
    const { role, is_verified, block, is_identity_verified, confirm_password, ...otherValues } = data

    if (confirm_password != otherValues?.password) throw new Error(`confirm password doesn't match `)

    const user = await auth_model.findOne({ email: otherValues.email, is_verified: false }).lean()

    if (user) return await verification_service.create(user.email as string);

    await auth_model.create(otherValues);

    return await verification_service.create(otherValues?.email as string);

}

export const auth_service = Object.freeze({
    create
})